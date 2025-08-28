import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Récupérer toutes les données nécessaires pour l'export
    const [
      totalLycees,
      totalExposants,
      totalEvenements,
      totalMessages,
      totalInscriptions,
      totalPartenaires,
      totalMedias,
      totalGaleries,
      lycees,
      exposants,
      evenements,
      inscriptions,
      contactMessages,
      partenaires
    ] = await Promise.all([
      db.lycee.count(),
      db.exposant.count(),
      db.evenement.count(),
      db.contactMessage.count(),
      db.inscription.count(),
      db.partenaire.count(),
      db.media.count(),
      db.galerie.count(),
      db.lycee.findMany({
        select: {
          id: true,
          nom: true,
          type: true,
          adresse: true,
          createdAt: true
        }
      }),
      db.exposant.findMany({
        select: {
          id: true,
          nom: true,
          domaine: true,
          statutPaiement: true,
          createdAt: true
        }
      }),
      db.evenement.findMany({
        select: {
          id: true,
          date: true,
          ville: true,
          createdAt: true
        }
      }),
      db.inscription.findMany({
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true,
          typeParticipant: true,
          statut: true,
          createdAt: true
        }
      }),
      db.contactMessage.findMany({
        select: {
          id: true,
          nom: true,
          email: true,
          message: true,
          lu: true,
          createdAt: true
        }
      }),
      db.partenaire.findMany({
        select: {
          id: true,
          nom: true,
          type: true,
          statut: true,
          createdAt: true
        }
      })
    ]);

    // Statistiques par type
    const lyceesByType = lycees.reduce((acc, lycee) => {
      acc[lycee.type] = (acc[lycee.type] || 0) + 1;
      return acc;
    }, {});

    const exposantsByPaymentStatus = exposants.reduce((acc, exposant) => {
      acc[exposant.statutPaiement] = (acc[exposant.statutPaiement] || 0) + 1;
      return acc;
    }, {});

    const inscriptionsByType = inscriptions.reduce((acc, inscription) => {
      acc[inscription.typeParticipant] = (acc[inscription.typeParticipant] || 0) + 1;
      return acc;
    }, {});

    const inscriptionsByStatus = inscriptions.reduce((acc, inscription) => {
      acc[inscription.statut] = (acc[inscription.statut] || 0) + 1;
      return acc;
    }, {});

    const partenairesByType = partenaires.reduce((acc, partenaire) => {
      acc[partenaire.type] = (acc[partenaire.type] || 0) + 1;
      return acc;
    }, {});

    const partenairesByStatus = partenaires.reduce((acc, partenaire) => {
      acc[partenaire.statut] = (acc[partenaire.statut] || 0) + 1;
      return acc;
    }, {});

    const messagesByReadStatus = contactMessages.reduce((acc, message) => {
      acc[message.lu ? 'lus' : 'non_lus'] = (acc[message.lu ? 'lus' : 'non_lus'] || 0) + 1;
      return acc;
    }, {});

    // Activité par mois
    const currentYear = new Date().getFullYear();
    const monthlyActivity = {};
    
    for (let month = 1; month <= 12; month++) {
      const monthStart = new Date(currentYear, month - 1, 1);
      const monthEnd = new Date(currentYear, month, 0);
      
      const [
        monthLycees,
        monthExposants,
        monthEvenements,
        monthInscriptions,
        monthMessages
      ] = await Promise.all([
        db.lycee.count({
          where: {
            createdAt: {
              gte: monthStart,
              lte: monthEnd
            }
          }
        }),
        db.exposant.count({
          where: {
            createdAt: {
              gte: monthStart,
              lte: monthEnd
            }
          }
        }),
        db.evenement.count({
          where: {
            createdAt: {
              gte: monthStart,
              lte: monthEnd
            }
          }
        }),
        db.inscription.count({
          where: {
            createdAt: {
              gte: monthStart,
              lte: monthEnd
            }
          }
        }),
        db.contactMessage.count({
          where: {
            createdAt: {
              gte: monthStart,
              lte: monthEnd
            }
          }
        })
      ]);
      
      monthlyActivity[month] = {
        lycées: monthLycees,
        exposants: monthExposants,
        événements: monthEvenements,
        inscriptions: monthInscriptions,
        messages: monthMessages
      };
    }

    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        periode: `${currentYear}`,
        version: "1.0"
      },
      resume: {
        totaux: {
          lycées: totalLycees,
          exposants: totalExposants,
          événements: totalEvenements,
          messages: totalMessages,
          inscriptions: totalInscriptions,
          partenaires: totalPartenaires,
          médias: totalMedias,
          galeries: totalGaleries
        }
      },
      statistiquesDetaillees: {
        parType: {
          lycées: lyceesByType,
          exposants: exposantsByPaymentStatus,
          inscriptions: {
            parType: inscriptionsByType,
            parStatut: inscriptionsByStatus
          },
          partenaires: {
            parType: partenairesByType,
            parStatut: partenairesByStatus
          },
          messages: messagesByReadStatus
        }
      },
      activiteMensuelle: monthlyActivity,
      donneesBrutes: {
        lycées: lycees,
        exposants: exposants,
        événements: evenements,
        inscriptions: inscriptions,
        messages: contactMessages,
        partenaires: partenaires
      }
    };

    return NextResponse.json(exportData);
  } catch (error) {
    console.error("Erreur lors de l'export des statistiques:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'export des statistiques" },
      { status: 500 }
    );
  }
}