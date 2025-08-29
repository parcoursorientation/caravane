import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Récupérer l'événement avec ses exposants et leurs programmes
    const evenement = await db.evenement.findUnique({
      where: { id },
      include: {
        evenementExposants: {
          include: {
            exposant: {
              include: {
                programmes: {
                  orderBy: {
                    ordre: "asc",
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!evenement) {
      return NextResponse.json(
        { error: "Événement non trouvé" },
        { status: 404 }
      );
    }

    // Transformer les données pour le frontend
    const exposants = evenement.evenementExposants.map((ee) => ({
      id: ee.exposant.id,
      nom: ee.exposant.nom,
      description: ee.exposant.description,
      domaine: ee.exposant.domaine,
      logo: ee.exposant.logo,
      siteWeb: ee.exposant.siteWeb,
      programmes: ee.exposant.programmes.map((p) => ({
        id: p.id,
        titre: p.titre,
        description: p.description,
        heure: p.heure,
        duree: p.duree,
        lieu: p.lieu,
        type: p.type,
        public: p.public,
        animateur: p.animateur,
        ordre: p.ordre,
      })),
    }));

    return NextResponse.json({
      success: true,
      data: exposants,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des exposants:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
