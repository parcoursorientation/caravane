import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Middleware d'authentification simplifié
function authenticate(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  return !!(authHeader && authHeader.startsWith('Bearer '));
}

interface ContactExposant {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  fonction?: string;
  entreprise?: string;
  exposantId?: string;
  statut: 'ACTIF' | 'INACTIF' | 'EN_ATTENTE';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  exposant?: {
    id: string;
    nom: string;
    domaine: string;
  };
}

// GET /api/admin/contacts-exposants - Récupérer tous les contacts d'exposants
export async function GET(request: NextRequest) {
  try {
    console.log('🔄 GET /api/admin/contacts-exposants - Récupération des contacts d\'exposants...');
    
    if (!authenticate(request)) {
      console.log('❌ Échec d\'authentification');
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const statut = searchParams.get('statut') || '';
    const exposantId = searchParams.get('exposantId') || '';

    const skip = (page - 1) * limit;

    // Construire la clause where
    let where: any = {};
    
    if (search) {
      where.OR = [
        { nom: { contains: search, mode: 'insensitive' } },
        { prenom: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { entreprise: { contains: search, mode: 'insensitive' } },
        { fonction: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (statut) {
      where.statut = statut;
    }

    if (exposantId) {
      where.exposantId = exposantId;
    }

    const [contacts, total] = await Promise.all([
      db.contactExposant.findMany({
        where,
        include: {
          exposant: {
            select: {
              id: true,
              nom: true,
              domaine: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.contactExposant.count({ where })
    ]);

    // Compter les contacts par statut
    const [actifsCount, inactifsCount, enAttenteCount] = await Promise.all([
      db.contactExposant.count({ where: { ...where, statut: 'ACTIF' } }),
      db.contactExposant.count({ where: { ...where, statut: 'INACTIF' } }),
      db.contactExposant.count({ where: { ...where, statut: 'EN_ATTENTE' } })
    ]);

    console.log(`✅ ${contacts.length} contacts récupérés (page ${page})`);

    return NextResponse.json({
      success: true,
      data: contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      stats: {
        actifs: actifsCount,
        inactifs: inactifsCount,
        enAttente: enAttenteCount
      },
      filters: {
        search,
        statut,
        exposantId
      }
    });

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des contacts d\'exposants:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// POST /api/admin/contacts-exposants - Créer un nouveau contact d'exposant
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 POST /api/admin/contacts-exposants - Création d\'un contact d\'exposant...');
    
    if (!authenticate(request)) {
      console.log('❌ Échec d\'authentification');
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { nom, prenom, email, telephone, fonction, entreprise, exposantId, statut, notes } = body;

    // Validation des champs requis
    if (!nom || !prenom || !email) {
      return NextResponse.json(
        { error: 'Les champs nom, prénom et email sont requis' },
        { status: 400 }
      );
    }

    // Vérifier si l'email existe déjà
    const existingContact = await db.contactExposant.findUnique({
      where: { email }
    });

    if (existingContact) {
      return NextResponse.json(
        { error: 'Un contact avec cet email existe déjà' },
        { status: 400 }
      );
    }

    const newContact = await db.contactExposant.create({
      data: {
        nom,
        prenom,
        email,
        telephone,
        fonction,
        entreprise,
        exposantId,
        statut: statut || 'ACTIF',
        notes
      },
      include: {
        exposant: {
          select: {
            id: true,
            nom: true,
            domaine: true
          }
        }
      }
    });

    console.log(`✅ Contact ${newContact.id} créé avec succès`);

    return NextResponse.json({
      success: true,
      data: newContact,
      message: 'Contact créé avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur lors de la création du contact d\'exposant:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}