import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Middleware d'authentification simplifié
function authenticate(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  return !!(authHeader && authHeader.startsWith("Bearer "));
}

// GET /api/admin/parametres - Récupérer tous les paramètres
export async function GET(request: NextRequest) {
  try {
    if (!authenticate(request)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const parametres = await db.parametreSite.findMany();

    // Transformer en objet clé-valeur pour faciliter l'usage
    const parametresObj = parametres.reduce((acc, parametre) => {
      acc[parametre.cle] = parametre.valeur;
      return acc;
    }, {} as Record<string, string>);

    // Valeurs par défaut
    const parametresAvecDefauts = {
      afficherPartenaires: parametresObj.afficherPartenaires || "true",
      afficherExposants: parametresObj.afficherExposants || "true",
      ...parametresObj,
    };

    return NextResponse.json({
      success: true,
      data: parametresAvecDefauts,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des paramètres:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// POST /api/admin/parametres - Mettre à jour les paramètres
export async function POST(request: NextRequest) {
  try {
    if (!authenticate(request)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { parametres } = body;

    if (!parametres || typeof parametres !== "object") {
      return NextResponse.json(
        { error: "Format de paramètres invalide" },
        { status: 400 }
      );
    }

    // Mettre à jour chaque paramètre
    const results = [];
    for (const [cle, valeur] of Object.entries(parametres)) {
      const result = await db.parametreSite.upsert({
        where: { cle },
        update: { valeur: String(valeur) },
        create: { cle, valeur: String(valeur) },
      });
      results.push(result);
    }

    console.log(`Paramètres mis à jour: ${Object.keys(parametres).join(", ")}`);

    return NextResponse.json({
      success: true,
      message: "Paramètres mis à jour avec succès",
      data: results,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour des paramètres:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
