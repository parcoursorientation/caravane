import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const evenement = await db.evenement.findUnique({
      where: { id },
      include: {
        lycee: {
          select: {
            id: true,
            nom: true,
            adresse: true,
          },
        },
        _count: {
          select: {
            evenementExposants: true,
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

    const evenementFormate = {
      id: evenement.id,
      nom: evenement.nom,
      date: evenement.date.toISOString(),
      dateDebut: evenement.dateDebut?.toISOString(),
      dateFin: evenement.dateFin?.toISOString(),
      heureDebut: evenement.heureDebut || "",
      heureFin: evenement.heureFin || "",
      ville: evenement.ville,
      lycee: {
        id: evenement.lycee.id,
        nom: evenement.lycee.nom,
        adresse: evenement.lycee.adresse,
      },
      exposantsCount: evenement._count.evenementExposants,
    };

    return NextResponse.json({
      success: true,
      data: evenementFormate,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'événement:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
