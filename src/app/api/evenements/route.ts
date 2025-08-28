import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/evenements - Récupérer tous les événements avec leurs relations
export async function GET(request: NextRequest) {
  try {
    console.log('🔄 GET /api/evenements - Récupération des événements publics...');

    const evenements = await db.evenement.findMany({
      orderBy: {
        date: 'asc'
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

    console.log(`✅ ${evenements.length} événements récupérés de la base de données`);

    // Transformer les données pour le format attendu par le frontend
    const transformedEvenements = evenements.map(evenement => ({
      id: evenement.id,
      nom: evenement.nom,
      date: evenement.date.toISOString(),
      dateDebut: evenement.dateDebut ? evenement.dateDebut.toISOString() : null,
      dateFin: evenement.dateFin ? evenement.dateFin.toISOString() : null,
      heureDebut: evenement.heureDebut, // Déjà au format HH:MM
      heureFin: evenement.heureFin,     // Déjà au format HH:MM
      lycee: {
        id: evenement.lycee.id,
        nom: evenement.lycee.nom,
        adresse: evenement.lycee.adresse,
        type: evenement.lycee.type
      },
      exposants: evenement.evenementExposants.map(ee => ({
        id: ee.exposant.id,
        nom: ee.exposant.nom,
        logo: ee.exposant.logo,
        domaine: ee.exposant.domaine
      }))
    }));

    return NextResponse.json({
      success: true,
      data: transformedEvenements,
      total: transformedEvenements.length
    });

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des événements:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}