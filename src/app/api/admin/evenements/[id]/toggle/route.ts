import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Middleware d'authentification simplifié
function authenticate(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  return !!(authHeader && authHeader.startsWith("Bearer "));
}

// PATCH /api/admin/evenements/[id]/toggle - Activer/désactiver un événement
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!authenticate(request)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { actif } = body;

    // Validation
    if (typeof actif !== "boolean") {
      return NextResponse.json(
        { error: "Le statut actif doit être un booléen" },
        { status: 400 }
      );
    }

    // Vérifier que l'événement existe
    const evenement = await db.evenement.findUnique({
      where: { id },
    });

    if (!evenement) {
      return NextResponse.json(
        { error: "Événement non trouvé" },
        { status: 404 }
      );
    }

    // Mettre à jour le statut de l'événement
    const updatedEvenement = await db.evenement.update({
      where: { id },
      data: { actif },
      include: {
        lycee: true,
        evenementExposants: {
          include: {
            exposant: true,
          },
        },
      },
    });

    // Transformer les données pour assurer la bonne sérialisation
    const transformedEvenement = {
      ...updatedEvenement,
      heureDebut: updatedEvenement.heureDebut || "",
      heureFin: updatedEvenement.heureFin || "",
      date: updatedEvenement.date.toISOString(),
      dateDebut: updatedEvenement.dateDebut
        ? updatedEvenement.dateDebut.toISOString()
        : null,
      dateFin: updatedEvenement.dateFin
        ? updatedEvenement.dateFin.toISOString()
        : null,
      createdAt: updatedEvenement.createdAt.toISOString(),
      updatedAt: updatedEvenement.updatedAt.toISOString(),
    };

    console.log(
      `Événement ${actif ? "activé" : "désactivé"}: ${
        updatedEvenement.nom
      } - ${new Date().toISOString()}`
    );

    return NextResponse.json({
      success: true,
      data: transformedEvenement,
      message: `Événement ${actif ? "activé" : "désactivé"} avec succès`,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la modification du statut de l'événement:",
      error
    );
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
