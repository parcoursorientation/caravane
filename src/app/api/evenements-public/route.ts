import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/evenements-public - Récupérer tous les événements publics avec le nombre d'exposants
export async function GET(request: NextRequest) {
  try {
    console.log(
      "🔄 GET /api/evenements-public - Récupération des événements publics..."
    );

    const evenements = await db.evenement.findMany({
      where: {
        actif: true, // Filtrer seulement les événements actifs
      },
      include: {
        lycee: true,
        evenementExposants: {
          include: {
            exposant: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    // Transformer les données pour inclure le nombre d'exposants
    const evenementsAvecExposants = evenements.map((evenement) => ({
      id: evenement.id,
      nom: evenement.nom,
      date: evenement.date.toISOString(),
      dateDebut: evenement.dateDebut?.toISOString(),
      dateFin: evenement.dateFin?.toISOString(),
      heureDebut: evenement.heureDebut,
      heureFin: evenement.heureFin,
      ville: evenement.ville,
      actif: evenement.actif,
      lycee: {
        id: evenement.lycee.id,
        nom: evenement.lycee.nom,
        adresse: evenement.lycee.adresse,
      },
      exposantsCount: evenement.evenementExposants.length,
    }));

    console.log(`✅ ${evenementsAvecExposants.length} événements récupérés`);

    return NextResponse.json({
      success: true,
      data: evenementsAvecExposants,
      total: evenementsAvecExposants.length,
    });
  } catch (error) {
    console.error(
      "❌ Erreur lors de la récupération des événements publics:",
      error
    );
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
