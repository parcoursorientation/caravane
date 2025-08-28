import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/medias - Récupérer tous les médias avec leurs événements
export async function GET(request: NextRequest) {
  try {
    console.log('🔄 GET /api/medias - Récupération des médias publics...');

    const medias = await db.media.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        evenement: {
          include: {
            lycee: true
          }
        }
      }
    });

    console.log(`✅ ${medias.length} médias récupérés de la base de données`);

    // Transformer les données pour le format attendu par le frontend
    const transformedMedias = medias.map(media => ({
      id: media.id,
      titre: media.titre,
      description: media.description,
      fichier: media.fichier,
      type: media.type,
      evenement: media.evenement ? `${media.evenement.date.toDateString().split('T')[0]} - ${media.evenement.lycee.nom}` : 'Événement inconnu',
      date: media.createdAt.toISOString().split('T')[0], // Utiliser la date de création
      lieu: media.evenement ? media.evenement.lycee.adresse : 'Lieu inconnu',
      categorie: media.categorie || 'Photo'
    }));

    return NextResponse.json({
      success: true,
      data: transformedMedias,
      total: transformedMedias.length
    });

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des médias:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}