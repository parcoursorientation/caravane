import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/medias - Récupérer tous les médias avec leurs événements
export async function GET(request: NextRequest) {
  try {
    console.log("🔄 GET /api/medias - Récupération des médias publics...");

    const medias = await db.media.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        evenement: {
          include: {
            lycee: true,
          },
        },
      },
    });

    console.log(`✅ ${medias.length} médias récupérés de la base de données`);

    // Transformer les données pour le format attendu par le frontend
    const transformedMedias = medias.map((media) => ({
      id: media.id,
      titre: media.titre,
      description: media.description,
      fichier: media.fichier,
      type: media.type,
      // Informations de l'événement
      evenement: {
        nom: media.evenement?.nom || "Événement inconnu",
        date: media.evenement?.date || null,
        lieu: media.evenement?.lycee?.nom || "Lieu inconnu",
      },
      // Garder les anciennes propriétés pour compatibilité
      date:
        media.evenement?.date?.toISOString().split("T")[0] ||
        media.createdAt.toISOString().split("T")[0],
      lieu: media.evenement?.lycee?.nom || "Lieu inconnu",
      categorie: media.categorie || "Photo",
    }));

    return NextResponse.json({
      success: true,
      data: transformedMedias,
      total: transformedMedias.length,
    });
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des médias:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
