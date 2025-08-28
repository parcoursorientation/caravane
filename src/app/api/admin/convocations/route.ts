import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Middleware d'authentification simplifié
function authenticate(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  return authHeader && authHeader.startsWith('Bearer ');
}

interface ConvocationRequest {
  sujet: string;
  message: string;
  contactIds: string[];
  evenementId: string;
  envoiImmediat?: boolean;
  dateEnvoi?: string;
}

// POST /api/admin/convocations - Créer et envoyer une convocation
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 POST /api/admin/convocations - Création d\'une convocation...');
    
    if (!authenticate(request)) {
      console.log('❌ Échec d\'authentification');
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const body: ConvocationRequest = await request.json();
    const { sujet, message, contactIds, evenementId, envoiImmediat = true, dateEnvoi } = body;

    // Validation des champs requis
    if (!sujet || !message || !contactIds || contactIds.length === 0 || !evenementId) {
      return NextResponse.json(
        { error: 'Les champs sujet, message, contactIds et evenementId sont requis' },
        { status: 400 }
      );
    }

    // Vérifier si l'événement existe
    const evenement = await db.evenement.findUnique({
      where: { id: evenementId },
      include: {
        lycee: {
          select: {
            nom: true,
            adresse: true,
            ville: true
          }
        }
      }
    });

    if (!evenement) {
      return NextResponse.json(
        { error: 'Événement non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si les contacts existent
    const contacts = await db.contactExposant.findMany({
      where: {
        id: {
          in: contactIds
        },
        statut: 'ACTIF'
      }
    });

    if (contacts.length === 0) {
      return NextResponse.json(
        { error: 'Aucun contact actif trouvé pour les IDs fournis' },
        { status: 404 }
      );
    }

    // Créer la convocation
    const convocationData = {
      sujet,
      message,
      evenementId,
      statutEnvoi: envoiImmediat ? 'ENVOYE' : 'EN_ATTENTE',
      dateEnvoiReel: envoiImmediat ? new Date() : null,
      dateEnvoi: dateEnvoi ? new Date(dateEnvoi) : new Date()
    };

    const convocation = await db.convocation.create({
      data: convocationData
    });

    // Créer les destinataires
    const destinatairesData = contacts.map(contact => ({
      convocationId: convocation.id,
      contactId: contact.id,
      statut: envoiImmediat ? 'ENVOYE' : 'EN_ATTENTE'
    }));

    await db.convocationDestinataire.createMany({
      data: destinatairesData
    });

    // Simuler l'envoi d'emails (dans une implémentation réelle, vous utiliseriez un service d'email)
    let emailsEnvoyes = 0;
    let erreursEnvoi: string[] = [];

    if (envoiImmediat) {
      console.log(`📧 Envoi de ${contacts.length} emails...`);
      
      // Simuler l'envoi d'emails
      for (const contact of contacts) {
        try {
          // Simuler un délai d'envoi
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Simuler une erreur aléatoire pour la démo (10% de chance d'échec)
          if (Math.random() < 0.1) {
            throw new Error(`Erreur d'envoi à ${contact.email}`);
          }
          
          console.log(`✅ Email envoyé à ${contact.email}`);
          emailsEnvoyes++;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
          erreursEnvoi.push(errorMessage);
          console.error(`❌ Échec d'envoi à ${contact.email}: ${errorMessage}`);
        }
      }

      // Mettre à jour le statut de la convocation
      if (emailsEnvoyes === contacts.length) {
        await db.convocation.update({
          where: { id: convocation.id },
          data: { statutEnvoi: 'ENVOYE' }
        });
      } else if (emailsEnvoyes === 0) {
        await db.convocation.update({
          where: { id: convocation.id },
          data: { 
            statutEnvoi: 'EN_ERREUR',
            erreurEnvoi: erreursEnvoi.join(', ')
          }
        });
      } else {
        await db.convocation.update({
          where: { id: convocation.id },
          data: { 
            statutEnvoi: 'ENVOYE',
            erreurEnvoi: erreursEnvoi.length > 0 ? erreursEnvoi.join(', ') : null
          }
        });
      }
    }

    console.log(`✅ Convocation ${convocation.id} créée avec succès`);

    return NextResponse.json({
      success: true,
      data: {
        convocation,
        destinataires: contacts.length,
        emailsEnvoyes,
        erreursEnvoi: erreursEnvoi.length,
        evenement
      },
      message: envoiImmediat 
        ? `${emailsEnvoyes} emails envoyés sur ${contacts.length}`
        : `Convocation programmée pour ${contacts.length} destinataires`
    });

  } catch (error) {
    console.error('❌ Erreur lors de la création de la convocation:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// GET /api/admin/convocations - Récupérer l'historique des convocations
export async function GET(request: NextRequest) {
  try {
    console.log('🔄 GET /api/admin/convocations - Récupération des convocations...');
    
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

    const skip = (page - 1) * limit;

    // Construire la clause where
    let where: any = {};
    
    if (search) {
      where.OR = [
        { sujet: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (statut) {
      where.statutEnvoi = statut;
    }

    const [convocations, total] = await Promise.all([
      db.convocation.findMany({
        where,
        include: {
          evenement: {
            select: {
              id: true,
              nom: true,
              date: true,
              ville: true,
              lycee: {
                select: {
                  nom: true
                }
              }
            }
          },
          destinataires: {
            include: {
              contact: {
                select: {
                  id: true,
                  nom: true,
                  prenom: true,
                  email: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.convocation.count({ where })
    ]);

    console.log(`✅ ${convocations.length} convocations récupérées (page ${page})`);

    return NextResponse.json({
      success: true,
      data: convocations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      filters: {
        search,
        statut
      }
    });

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des convocations:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}