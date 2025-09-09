import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/parametres-publics - Récupérer les paramètres publics (navigation)
export async function GET(request: NextRequest) {
  try {
    const parametres = await db.parametreSite.findMany({
      where: {
        cle: {
          in: ["afficherPartenaires", "afficherExposants"],
        },
      },
    });

    // Transformer en objet clé-valeur
    const parametresObj = parametres.reduce((acc, parametre) => {
      acc[parametre.cle] = parametre.valeur === "true";
      return acc;
    }, {} as Record<string, boolean>);

    // Valeurs par défaut si les paramètres n'existent pas
    const parametresAvecDefauts = {
      afficherPartenaires:
        parametresObj.afficherPartenaires !== undefined
          ? parametresObj.afficherPartenaires
          : true,
      afficherExposants:
        parametresObj.afficherExposants !== undefined
          ? parametresObj.afficherExposants
          : true,
    };

    return NextResponse.json({
      success: true,
      data: parametresAvecDefauts,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des paramètres publics:",
      error
    );
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
