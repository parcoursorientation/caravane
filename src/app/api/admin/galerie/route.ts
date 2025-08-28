import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/admin/galerie - Récupérer tous les médias
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const categorie = searchParams.get('categorie');
    const evenementId = searchParams.get('evenementId');
    const search = searchParams.get('search');

    let whereClause: any = {};

    if (type && type !== 'TOUS') {
      whereClause.type = type;
    }

    if (categorie && categorie !== 'TOUS') {
      whereClause.categorie = categorie;
    }

    if (evenementId && evenementId !== 'TOUS') {
      whereClause.evenementId = evenementId;
    }

    if (search) {
      whereClause.OR = [
        { titre: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const medias = await db.media.findMany({
      where: whereClause,
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

    return NextResponse.json(medias);
  } catch (error) {
    console.error('Erreur lors de la récupération des médias:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des médias' },
      { status: 500 }
    );
  }
}

// POST /api/admin/galerie - Créer un nouveau média
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { titre, description, type, categorie, evenementId, fichier } = body;

    // Validation des champs requis
    if (!titre || !type || !fichier) {
      return NextResponse.json(
        { error: 'Les champs titre, type et fichier sont requis' },
        { status: 400 }
      );
    }

    const media = await db.media.create({
      data: {
        titre,
        description: description || null,
        type,
        categorie: categorie || null,
        evenementId: evenementId || null,
        fichier
      },
      include: {
        evenement: {
          include: {
            lycee: true
          }
        }
      }
    });

    return NextResponse.json(media, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du média:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du média' },
      { status: 500 }
    );
  }
}