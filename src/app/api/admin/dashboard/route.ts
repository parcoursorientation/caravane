import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Récupérer le nombre total de lycées
    const totalLycees = await db.lycee.count();
    
    // Récupérer le nombre total d'exposants
    const totalExposants = await db.exposant.count();
    
    // Récupérer le nombre total d'événements
    const totalEvenements = await db.evenement.count();
    
    // Récupérer le nombre total de messages
    const totalMessages = await db.contactMessage.count();
    
    // Récupérer le nombre de messages récents (derniers 7 jours)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentMessages = await db.contactMessage.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    });

    // Récupérer le nombre total d'inscriptions
    const totalInscriptions = await db.inscription.count();
    
    // Récupérer le nombre d'inscriptions récentes (derniers 7 jours)
    const recentInscriptions = await db.inscription.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    });

    const stats = {
      totalLycees,
      totalExposants,
      totalEvenements,
      totalMessages,
      recentMessages,
      totalInscriptions,
      recentInscriptions
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des statistiques" },
      { status: 500 }
    );
  }
}