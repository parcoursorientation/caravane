import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Middleware d'authentification simplifié
function authenticate(request: NextRequest): boolean {
  // Dans un environnement réel, on vérifierait le token JWT
  const authHeader = request.headers.get('authorization');
  return !!(authHeader && authHeader.startsWith('Bearer '));
}

// GET /api/admin/lycees - Récupérer tous les lycées
export async function GET(request: NextRequest) {
  try {
    console.log('🔄 GET /api/admin/lycees - Récupération des lycées...');
    
    if (!authenticate(request)) {
      console.log('❌ Échec d\'authentification');
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const lycees = await db.lycee.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`✅ ${lycees.length} lycées récupérés de la base de données`);

    return NextResponse.json({
      success: true,
      data: lycees,
      total: lycees.length
    });

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des lycées:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// POST /api/admin/lycees - Créer un nouveau lycée
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 POST /api/admin/lycees - Création d\'un nouveau lycée...');
    
    if (!authenticate(request)) {
      console.log('❌ Échec d\'authentification');
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { nom, adresse, type, description, logo } = body;

    console.log('📝 Données reçues:', { nom, adresse, type, hasDescription: !!description, hasLogo: !!logo });

    // Validation
    if (!nom || !adresse || !type) {
      console.log('❌ Validation échouée: champs manquants');
      return NextResponse.json(
        { error: 'Nom, adresse et type sont requis' },
        { status: 400 }
      );
    }

    if (!['PUBLIC', 'PRIVE'].includes(type)) {
      console.log('❌ Validation échouée: type invalide');
      return NextResponse.json(
        { error: 'Type doit être PUBLIC ou PRIVE' },
        { status: 400 }
      );
    }

    // Création du nouveau lycée
    const newLycee = await db.lycee.create({
      data: {
        nom,
        adresse,
        type,
        description: description || null,
        logo: logo || null
      }
    });

    console.log(`✅ Nouveau lycée créé: ${nom} (ID: ${newLycee.id}) - ${new Date().toISOString()}`);

    return NextResponse.json({
      success: true,
      data: newLycee,
      message: 'Lycée créé avec succès'
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Erreur lors de la création du lycée:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}