import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    console.log("=== DÉBUT API INSCRIPTION ===");

    const body = await request.json();
    console.log("Body reçu:", body);

    const {
      nom,
      prenom,
      email,
      telephone,
      evenementId,
      typeParticipant,
      etablissement,
      niveau,
      branche,
      interets,
      message,
      souhaiteNewsletter,
    } = body;

    // Validation des champs requis
    if (!nom || !prenom || !email || !telephone || !typeParticipant) {
      console.log("Validation échouée - champs manquants");
      return NextResponse.json(
        { error: "Tous les champs obligatoires doivent être remplis" },
        { status: 400 }
      );
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("Validation échouée - email invalide");
      return NextResponse.json(
        { error: "Format d'email invalide" },
        { status: 400 }
      );
    }

    // Validation de l'événement
    if (!evenementId) {
      return NextResponse.json(
        { error: "L'ID de l'événement est requis" },
        { status: 400 }
      );
    }

    // Vérifier que l'événement existe
    const evenement = await db.evenement.findUnique({
      where: { id: evenementId },
    });

    if (!evenement) {
      return NextResponse.json(
        { error: "Événement non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier si l'utilisateur n'est pas déjà inscrit à cet événement
    const existingInscription = await db.inscription.findFirst({
      where: {
        email,
        evenementId,
      },
    });

    if (existingInscription) {
      return NextResponse.json(
        { error: "Vous êtes déjà inscrit à cet événement" },
        { status: 400 }
      );
    }

    console.log("Validation réussie, création de l'inscription...");

    // Créer l'inscription
    console.log("Données à insérer:", {
      nom,
      prenom,
      email,
      telephone,
      evenementId,
      typeParticipant,
      etablissement: etablissement || null,
      niveau: niveau || null,
      branche: branche || null,
      interets: interets || null,
      message: message || null,
    });

    const inscription = await db.inscription.create({
      data: {
        nom,
        prenom,
        email,
        telephone,
        evenementId,
        typeParticipant,
        etablissement: etablissement || null,
        niveau: niveau || null,
        branche: branche || null,
        interets: interets || null,
        message: message || null,
      },
    });

    console.log("Inscription créée avec succès:", inscription.id);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: inscription.id,
          message: "Inscription enregistrée avec succès",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("=== ERREUR API INSCRIPTION ===");
    console.error("Type d'erreur:", error.constructor.name);
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);

    return NextResponse.json(
      { error: "Erreur interne du serveur", details: error.message },
      { status: 500 }
    );
  }
}
