import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Middleware d'authentification simplifié
function authenticate(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  return authHeader && authHeader.startsWith('Bearer ');
}

// PUT /api/admin/evenements/[id] - Mettre à jour un événement
export async function PUT(request: NextRequest) {
  try {
    if (!authenticate(request)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
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

    // Vérifier que l'événement existe
    const existingEvenement = await db.evenement.findUnique({
      where: { id }
    });
    if (!existingEvenement) {
      return NextResponse.json(
        { error: 'Événement non trouvé' },
        { status: 404 }
      );
    }

    // Mise à jour de l'événement
    const updatedEvenement = await db.evenement.update({
      where: { id },
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

    // Supprimer les anciennes associations avec les exposants
    await db.evenementExposant.deleteMany({
      where: { evenementId: id }
    });

    // Ajouter les nouvelles associations avec les exposants
    if (exposantIds && Array.isArray(exposantIds)) {
      for (const exposantId of exposantIds) {
        const exposant = await db.exposant.findUnique({
          where: { id: exposantId }
        });
        if (exposant) {
          await db.evenementExposant.create({
            data: {
              evenementId: id,
              exposantId
            }
          });
        }
      }
    }

    // Récupérer l'événement complet avec les associations
    const completeEvenement = await db.evenement.findUnique({
      where: { id },
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

    console.log(`Événement mis à jour: ${date} à ${lycee.nom} - ${new Date().toISOString()}`);

    return NextResponse.json({
      success: true,
      data: transformedEvenement,
      message: 'Événement mis à jour avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'événement:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/evenements/[id] - Supprimer un événement
export async function DELETE(request: NextRequest) {
  try {
    if (!authenticate(request)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    // Vérifier que l'événement existe
    const existingEvenement = await db.evenement.findUnique({
      where: { id },
      include: {
        lycee: true
      }
    });
    if (!existingEvenement) {
      return NextResponse.json(
        { error: 'Événement non trouvé' },
        { status: 404 }
      );
    }

    // Supprimer l'événement (cela supprimera aussi les associations grâce à onDelete: Cascade)
    await db.evenement.delete({
      where: { id }
    });

    console.log(`Événement supprimé: ${existingEvenement.date} à ${existingEvenement.lycee.nom} - ${new Date().toISOString()}`);

    return NextResponse.json({
      success: true,
      message: 'Événement supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'événement:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}