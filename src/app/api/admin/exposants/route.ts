import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Middleware d'authentification simplifié
function authenticate(request: NextRequest): boolean {
  // Dans un environnement réel, on vérifierait le token JWT
  const authHeader = request.headers.get("authorization");
  return !!(authHeader && authHeader.startsWith("Bearer "));
}

// GET /api/admin/exposants - Récupérer tous les exposants
export async function GET(request: NextRequest) {
  try {
    if (!authenticate(request)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const exposants = await db.exposant.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // Mapper le statut de paiement au statut de confirmation pour la réponse
    const responseData = exposants.map((exposant) => ({
      ...exposant,
      statutConfirmation:
        exposant.statutPaiement === "PAYE" ? "CONFIRME" : "EN_ATTENTE",
    }));

    return NextResponse.json({
      success: true,
      data: responseData,
      total: responseData.length,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des exposants:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// POST /api/admin/exposants - Créer un nouvel exposant
export async function POST(request: NextRequest) {
  try {
    if (!authenticate(request)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const {
      nom,
      description,
      domaine,
      logo,
      siteWeb,
      statutConfirmation,
      actif,
    } = body;

    // Validation
    if (!nom || !description || !domaine || !statutConfirmation) {
      return NextResponse.json(
        {
          error:
            "Nom, description, domaine et statut de confirmation sont requis",
        },
        { status: 400 }
      );
    }

    if (!["CONFIRME", "EN_ATTENTE"].includes(statutConfirmation)) {
      return NextResponse.json(
        { error: "Statut de confirmation doit être CONFIRME ou EN_ATTENTE" },
        { status: 400 }
      );
    }

    // Validation du site web si fourni
    if (siteWeb && !siteWeb.startsWith("http")) {
      return NextResponse.json(
        { error: "URL du site web invalide" },
        { status: 400 }
      );
    }

    // Mapper le statut de confirmation au statut de paiement
    const statutPaiement =
      statutConfirmation === "CONFIRME" ? "PAYE" : "EN_ATTENTE";

    // Création du nouvel exposant
    const newExposant = await db.exposant.create({
      data: {
        nom,
        description,
        domaine,
        logo: logo || null,
        siteWeb: siteWeb || null,
        statutPaiement,
        actif: typeof actif === "boolean" ? actif : true,
      },
    });

    // Mapper le statut de paiement au statut de confirmation pour la réponse
    const responseData = {
      ...newExposant,
      statutConfirmation:
        newExposant.statutPaiement === "PAYE" ? "CONFIRME" : "EN_ATTENTE",
    };

    console.log(`Nouvel exposant créé: ${nom} - ${new Date().toISOString()}`);

    return NextResponse.json(
      {
        success: true,
        data: responseData,
        message: "Exposant créé avec succès",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de la création de l'exposant:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
