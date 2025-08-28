import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Récupérer toutes les inscriptions avec les informations des événements
    const inscriptions = await db.inscription.findMany({
      include: {
        evenement: {
          include: {
            lycee: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      message: 'Inscriptions récupérées avec succès',
      data: inscriptions
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des inscriptions:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}