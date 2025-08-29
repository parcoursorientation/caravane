import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import nodemailer from "nodemailer";

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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
      return NextResponse.json(
        { error: "Tous les champs obligatoires doivent être remplis" },
        { status: 400 }
      );
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Format d'email invalide" },
        { status: 400 }
      );
    }

    // Vérifier si l'événement existe (si spécifié)
    if (evenementId && evenementId !== "general") {
      const evenement = await db.evenement.findUnique({
        where: { id: evenementId },
        include: {
          lycee: {
            select: {
              nom: true,
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
    }

    // Vérifier si l'utilisateur n'est pas déjà inscrit
    const existingInscription = await db.inscription.findFirst({
      where: {
        email,
        evenementId: evenementId || "general",
      },
    });

    if (existingInscription) {
      return NextResponse.json(
        { error: "Vous êtes déjà inscrit à cet événement" },
        { status: 400 }
      );
    }

    // Créer l'inscription
    const inscription = await db.inscription.create({
      data: {
        nom,
        prenom,
        email,
        telephone,
        evenementId: evenementId || "general",
        typeParticipant,
        etablissement: etablissement || null,
        niveau: niveau || null,
        branche: branche || null,
        interets: interets || null,
        message: message || null,
        statut: "EN_ATTENTE",
      },
      include: {
        evenement: {
          include: {
            lycee: {
              select: {
                nom: true,
                adresse: true,
              },
            },
          },
        },
      },
    });

    // Envoyer l'email de confirmation
    try {
      await envoyerEmailConfirmation(inscription);
    } catch (emailError) {
      console.error("Erreur lors de l'envoi de l'email:", emailError);
      // Ne pas faire échouer l'inscription si l'email ne peut pas être envoyé
    }

    // Envoyer une notification à l'admin
    try {
      await envoyerNotificationAdmin(inscription);
    } catch (emailError) {
      console.error(
        "Erreur lors de l'envoi de la notification admin:",
        emailError
      );
    }

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
    console.error("Erreur lors de l'inscription:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

async function envoyerEmailConfirmation(inscription: any) {
  const evenementInfo = inscription.evenement
    ? `${
        inscription.evenement.nom ||
        `Portes Ouvertes - ${inscription.evenement.lycee.nom}`
      }`
    : "Portes Ouvertes";

  const dateInfo = inscription.evenement
    ? new Date(inscription.evenement.date).toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const heureInfo = inscription.evenement
    ? `${inscription.evenement.heureDebut?.slice(
        0,
        5
      )} - ${inscription.evenement.heureFin?.slice(0, 5)}`
    : "";

  const lieuInfo = inscription.evenement
    ? `${inscription.evenement.lycee.nom}\n${inscription.evenement.lycee.adresse}`
    : "";

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: inscription.email,
    subject: `Confirmation d'inscription - ${evenementInfo}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">Inscription confirmée !</h1>
        </div>
        
        <div style="padding: 30px; background-color: #f8f9fa;">
          <p style="font-size: 16px; color: #333;">Bonjour ${
            inscription.prenom
          } ${inscription.nom},</p>
          
          <p style="font-size: 16px; color: #333;">
            Votre inscription à <strong>${evenementInfo}</strong> a été confirmée avec succès.
          </p>
          
          ${
            inscription.evenement
              ? `
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #333; margin-top: 0;">Détails de l'événement :</h3>
              <p style="margin: 5px 0;"><strong>📅 Date :</strong> ${dateInfo}</p>
              <p style="margin: 5px 0;"><strong>🕐 Horaires :</strong> ${heureInfo}</p>
              <p style="margin: 5px 0;"><strong>📍 Lieu :</strong></p>
              <p style="margin: 5px 0; padding-left: 20px;">${lieuInfo}</p>
            </div>
          `
              : ""
          }
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Informations pratiques :</h3>
            <ul style="color: #666; line-height: 1.6;">
              <li>Arrivez 15 minutes avant le début de l'événement</li>
              <li>Munissez-vous d'une pièce d'identité</li>
              <li>N'hésitez pas à préparer vos questions à l'avance</li>
              <li>Des documents d'information seront disponibles sur place</li>
            </ul>
          </div>
          
          <p style="font-size: 16px; color: #333;">
            Si vous avez des questions ou si vous devez annuler votre inscription, 
            n'hésitez pas à nous contacter.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #666;">À très bientôt !</p>
            <p style="color: #667eea; font-weight: bold;">L'équipe des Portes Ouvertes</p>
          </div>
        </div>
        
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 14px;">
          <p style="margin: 0;">Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

async function envoyerNotificationAdmin(inscription: any) {
  const evenementInfo = inscription.evenement
    ? `${
        inscription.evenement.nom ||
        `Portes Ouvertes - ${inscription.evenement.lycee.nom}`
      }`
    : "Portes Ouvertes (Général)";

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
    subject: `Nouvelle inscription - ${evenementInfo}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #333; color: white; padding: 20px;">
          <h2 style="margin: 0;">Nouvelle inscription reçue</h2>
        </div>
        
        <div style="padding: 20px; background-color: #f8f9fa;">
          <h3>Détails du participant :</h3>
          <ul>
            <li><strong>Nom :</strong> ${inscription.prenom} ${
      inscription.nom
    }</li>
            <li><strong>Email :</strong> ${inscription.email}</li>
            <li><strong>Téléphone :</strong> ${inscription.telephone}</li>
            <li><strong>Type :</strong> ${inscription.typeParticipant}</li>
            ${
              inscription.etablissement
                ? `<li><strong>Établissement :</strong> ${inscription.etablissement}</li>`
                : ""
            }
            ${
              inscription.niveau
                ? `<li><strong>Niveau :</strong> ${inscription.niveau}</li>`
                : ""
            }
            ${
              inscription.branche
                ? `<li><strong>Filière :</strong> ${inscription.branche}</li>`
                : ""
            }
          </ul>
          
          <h3>Événement :</h3>
          <p>${evenementInfo}</p>
          
          ${
            inscription.interets
              ? `
            <h3>Centres d'intérêt :</h3>
            <p>${inscription.interets}</p>
          `
              : ""
          }
          
          ${
            inscription.message
              ? `
            <h3>Message :</h3>
            <p>${inscription.message}</p>
          `
              : ""
          }
          
          <p><strong>Date d'inscription :</strong> ${new Date(
            inscription.createdAt
          ).toLocaleString("fr-FR")}</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
