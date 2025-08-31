import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/lycees - Récupérer tous les lycées avec leurs événements
export async function GET(request: NextRequest) {
  try {
    console.log("🔄 GET /api/lycees - Récupération des lycées publics...");

    const lycees = await db.lycee.findMany({
      where: { actif: true },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        evenements: {
          orderBy: {
            date: "asc",
          },
        },
      },
    });

    console.log(`✅ ${lycees.length} lycées récupérés de la base de données`);

    // Transformer les données pour assurer une sérialisation correcte des dates
    const transformedLycees = lycees.map((lycee) => ({
      ...lycee,
      evenements: lycee.evenements.map((evenement) => ({
        ...evenement,
        date: evenement.date.toISOString(),
        // heureDebut et heureFin sont déjà des chaînes, pas besoin de conversion
        heureDebut: evenement.heureDebut,
        heureFin: evenement.heureFin,
      })),
    }));

    return NextResponse.json({
      data: transformedLycees,
      total: transformedLycees.length,
    });
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des lycées:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
