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
    
    // Récupérer le nombre total d'inscriptions
    const totalInscriptions = await db.inscription.count();
    
    // Récupérer le nombre total de partenaires
    const totalPartenaires = await db.partenaire.count();
    
    // Récupérer le nombre total de médias
    const totalMedias = await db.media.count();
    
    // Récupérer le nombre total de galeries
    const totalGaleries = await db.galerie.count();
    
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
    
    // Récupérer le nombre d'inscriptions récentes (derniers 7 jours)
    const recentInscriptions = await db.inscription.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    });
    
    // Récupérer le nombre d'événements récents (derniers 7 jours)
    const recentEvenements = await db.evenement.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    });
    
    // Récupérer le nombre d'exposants récents (derniers 7 jours)
    const recentExposants = await db.exposant.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    });
    
    // Récupérer le nombre de lycées récents (derniers 7 jours)
    const recentLycees = await db.lycee.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    });
    
    // Statistiques par type de lycée
    const lyceesByType = await db.lycee.groupBy({
      by: ['type'],
      _count: {
        type: true
      }
    });
    
    // Statistiques par statut de paiement des exposants
    const exposantsByPaymentStatus = await db.exposant.groupBy({
      by: ['statutPaiement'],
      _count: {
        statutPaiement: true
      }
    });
    
    // Statistiques par type de participant
    const inscriptionsByType = await db.inscription.groupBy({
      by: ['typeParticipant'],
      _count: {
        typeParticipant: true
      }
    });
    
    // Statistiques par statut d'inscription
    const inscriptionsByStatus = await db.inscription.groupBy({
      by: ['statut'],
      _count: {
        statut: true
      }
    });
    
    // Statistiques par niveau d'études
    const inscriptionsByNiveau = await db.inscription.groupBy({
      by: ['niveau'],
      _count: {
        niveau: true
      },
      where: {
        niveau: {
          not: null
        }
      }
    });
    
    // Statistiques par filière (pour 2ème Bac)
    const inscriptionsByBranche = await db.inscription.groupBy({
      by: ['branche'],
      _count: {
        branche: true
      },
      where: {
        niveau: '2eme-bac',
        branche: {
          not: null
        }
      }
    });
    
    // Statistiques par type de partenaire
    const partenairesByType = await db.partenaire.groupBy({
      by: ['type'],
      _count: {
        type: true
      }
    });
    
    // Statistiques par type de média
    const mediasByType = await db.media.groupBy({
      by: ['type'],
      _count: {
        type: true
      }
    });
    
    // Activité des 7 derniers jours
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      const dayStats = await Promise.all([
        db.lycee.count({
          where: {
            createdAt: {
              gte: startOfDay,
              lte: endOfDay
            }
          }
        }),
        db.exposant.count({
          where: {
            createdAt: {
              gte: startOfDay,
              lte: endOfDay
            }
          }
        }),
        db.evenement.count({
          where: {
            createdAt: {
              gte: startOfDay,
              lte: endOfDay
            }
          }
        }),
        db.inscription.count({
          where: {
            createdAt: {
              gte: startOfDay,
              lte: endOfDay
            }
          }
        }),
        db.contactMessage.count({
          where: {
            createdAt: {
              gte: startOfDay,
              lte: endOfDay
            }
          }
        })
      ]);
      
      last7Days.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('fr-FR', { weekday: 'long' }),
        lycees: dayStats[0],
        exposants: dayStats[1],
        evenements: dayStats[2],
        inscriptions: dayStats[3],
        messages: dayStats[4]
      });
    }
    
    // Événements par ville
    const evenementsByVille = await db.evenement.groupBy({
      by: ['ville'],
      _count: {
        ville: true
      },
      where: {
        ville: {
          not: null
        }
      }
    });
    
    // Inscriptions par événement
    const inscriptionsByEvenement = await db.inscription.groupBy({
      by: ['evenementId'],
      _count: {
        evenementId: true
      }
    });
    
    // Messages lus vs non lus
    const messagesByReadStatus = await db.contactMessage.groupBy({
      by: ['lu'],
      _count: {
        lu: true
      }
    });
    
    const stats = {
      // Totaux
      totalLycees,
      totalExposants,
      totalEvenements,
      totalMessages,
      totalInscriptions,
      totalPartenaires,
      totalMedias,
      totalGaleries,
      
      // Activité récente (7 derniers jours)
      recentMessages,
      recentInscriptions,
      recentEvenements,
      recentExposants,
      recentLycees,
      
      // Statistiques groupées
      lyceesByType,
      exposantsByPaymentStatus,
      inscriptionsByType,
      inscriptionsByStatus,
      inscriptionsByNiveau,
      inscriptionsByBranche,
      partenairesByType,
      mediasByType,
      
      // Activité quotidienne
      last7Days,
      
      // Autres statistiques
      evenementsByVille,
      inscriptionsByEvenement,
      messagesByReadStatus
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