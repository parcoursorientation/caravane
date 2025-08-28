import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/exposants-public - Récupérer tous les exposants avec leurs événements
export async function GET(request: NextRequest) {
  try {
    console.log('🔄 GET /api/exposants-public - Récupération des exposants publics...');

    const exposants = await db.exposant.findMany({
      orderBy: {
        nom: 'asc'
      },
      include: {
        evenementExposants: {
          include: {
            evenement: {
              include: {
                lycee: true
              }
            }
          }
        },
        programmes: {
          orderBy: {
            ordre: 'asc'
          }
        }
      }
    });

    console.log(`✅ ${exposants.length} exposants récupérés de la base de données`);

    // Transformer les données pour le format attendu par le frontend
    const transformedExposants = exposants.map(exposant => ({
      id: exposant.id,
      nom: exposant.nom,
      description: exposant.description,
      domaine: exposant.domaine,
      logo: exposant.logo,
      siteWeb: exposant.siteWeb,
      statutConfirmation: exposant.statutPaiement === 'PAYE' ? 'CONFIRME' : 'EN_ATTENTE',
      programmes: exposant.programmes.map(programme => ({
        id: programme.id,
        titre: programme.titre,
        description: programme.description,
        heure: programme.heure,
        duree: programme.duree,
        lieu: programme.lieu,
        type: programme.type,
        public: programme.public,
        animateur: programme.animateur,
        ordre: programme.ordre
      })),
      evenements: exposant.evenementExposants.map(ee => ({
        id: ee.evenement.id,
        date: ee.evenement.date.toISOString(),
        heureDebut: ee.evenement.heureDebut, // Déjà une chaîne, pas besoin de conversion
        heureFin: ee.evenement.heureFin,     // Déjà une chaîne, pas besoin de conversion
        lycee: {
          id: ee.evenement.lycee.id,
          nom: ee.evenement.lycee.nom,
          adresse: ee.evenement.lycee.adresse,
          type: ee.evenement.lycee.type
        }
      }))
    }));

    return NextResponse.json({
      data: transformedExposants,
      total: transformedExposants.length
    });

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des exposants:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}