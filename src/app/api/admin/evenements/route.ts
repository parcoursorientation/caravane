import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Middleware d'authentification simplifié
function authenticate(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  return !!(authHeader && authHeader.startsWith('Bearer '));
}

// GET /api/admin/evenements - Récupérer tous les événements
export async function GET(request: NextRequest) {
  try {
    if (!authenticate(request)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const evenements = await db.evenement.findMany({
      include: {
        lycee: true,
        evenementExposants: {
          include: {
            exposant: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    const lycees = await db.lycee.findMany({
      orderBy: {
        nom: 'asc'
      }
    });

    const exposants = await db.exposant.findMany({
      orderBy: {
        nom: 'asc'
      }
    });

    // Transformer les données pour assurer la bonne sérialisation
    const transformedEvenements = evenements.map(evenement => ({
      ...evenement,
      heureDebut: evenement.heureDebut || '',
      heureFin: evenement.heureFin || '',
      date: evenement.date.toISOString(),
      dateDebut: evenement.dateDebut ? evenement.dateDebut.toISOString() : null,
      dateFin: evenement.dateFin ? evenement.dateFin.toISOString() : null,
      createdAt: evenement.createdAt.toISOString(),
      updatedAt: evenement.updatedAt.toISOString()
    }));

    return NextResponse.json({
      success: true,
      data: transformedEvenements,
      total: transformedEvenements.length,
      lycees,
      exposants
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// POST /api/admin/evenements - Créer un nouvel événement
export async function POST(request: NextRequest) {
  try {
    if (!authenticate(request)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { nom, date, dateDebut, dateFin, heureDebut, heureFin, ville, lyceeId, exposantIds } = body;

    // Validation
    if (!nom || !date || !heureDebut || !heureFin || !lyceeId) {
      return NextResponse.json(
        { error: 'Nom, date, heure de début, heure de fin et lycée sont requis' },
        { status: 400 }
      );
    }

    // Vérifier que le lycée existe
    const lycee = await db.lycee.findUnique({
      where: { id: lyceeId }
    });
    if (!lycee) {
      return NextResponse.json(
        { error: 'Lycée non trouvé' },
        { status: 404 }
      );
    }

    // Valider les heures
  // Valider le format des heures (HH:MM)
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(heureDebut) || !timeRegex.test(heureFin)) {
    return NextResponse.json(
      { error: 'Le format des heures doit être HH:MM (ex: 09:00, 14:30)' },
      { status: 400 }
    );
  }
  
  // Valider que l'heure de début est antérieure à l'heure de fin
  if (heureDebut >= heureFin) {
    return NextResponse.json(
      { error: 'L\'heure de début doit être antérieure à l\'heure de fin' },
      { status: 400 }
    );
  }

    // Création du nouvel événement
    const newEvenement = await db.evenement.create({
      data: {
        nom,
        date: new Date(date),
        dateDebut: dateDebut ? new Date(dateDebut) : null,
        dateFin: dateFin ? new Date(dateFin) : null,
        heureDebut,
        heureFin,
        ville: ville || null,
        lyceeId
      },
      include: {
        lycee: true,
        evenementExposants: {
          include: {
            exposant: true
          }
        }
      }
    });

    // Ajouter les associations avec les exposants
    if (exposantIds && Array.isArray(exposantIds)) {
      for (const exposantId of exposantIds) {
        const exposant = await db.exposant.findUnique({
          where: { id: exposantId }
        });
        if (exposant) {
          await db.evenementExposant.create({
            data: {
              evenementId: newEvenement.id,
              exposantId
            }
          });
        }
      }
    }

    // Récupérer l'événement complet avec les associations
    const completeEvenement = await db.evenement.findUnique({
      where: { id: newEvenement.id },
      include: {
        lycee: true,
        evenementExposants: {
          include: {
            exposant: true
          }
        }
      }
    });

    // Transformer les données pour assurer la bonne sérialisation
    const transformedEvenement = {
      ...completeEvenement,
      heureDebut: completeEvenement.heureDebut || '',
      heureFin: completeEvenement.heureFin || '',
      date: completeEvenement.date.toISOString(),
      dateDebut: completeEvenement.dateDebut ? completeEvenement.dateDebut.toISOString() : null,
      dateFin: completeEvenement.dateFin ? completeEvenement.dateFin.toISOString() : null,
      createdAt: completeEvenement.createdAt.toISOString(),
      updatedAt: completeEvenement.updatedAt.toISOString()
    };

    console.log(`Nouvel événement créé: ${date} à ${lycee.nom} - ${new Date().toISOString()}`);

    return NextResponse.json({
      success: true,
      data: transformedEvenement,
      message: 'Événement créé avec succès'
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de la création de l\'événement:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}