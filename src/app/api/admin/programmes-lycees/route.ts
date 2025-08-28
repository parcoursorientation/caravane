import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Récupérer tous les programmes de tous les lycées
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lyceeId = searchParams.get('lyceeId');

    const where = lyceeId ? { lyceeId } : {};

    const programmes = await db.programmeLycee.findMany({
      where,
      include: {
        lycee: {
          select: {
            id: true,
            nom: true,
          },
        },
      },
      orderBy: [
        { lyceeId: 'asc' },
        { ordre: 'asc' },
      ],
    });

    return NextResponse.json({
      success: true,
      data: programmes,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des programmes:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau programme
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      titre,
      description,
      heure,
      duree,
      lieu,
      type,
      public: publicCible,
      animateur,
      lyceeId,
      ordre,
    } = body;

    // Validation des champs requis
    if (!titre || !description || !heure || !duree || !lieu || !lyceeId) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      );
    }

    // Vérifier que le lycée existe
    const lycee = await db.lycee.findUnique({
      where: { id: lyceeId },
    });

    if (!lycee) {
      return NextResponse.json(
        { error: 'Lycée non trouvé' },
        { status: 404 }
      );
    }

    // Créer le programme
    const programme = await db.programmeLycee.create({
      data: {
        titre,
        description,
        heure,
        duree,
        lieu,
        type: type || 'PRESENTATION',
        public: publicCible || 'Tous',
        animateur: animateur || 'Non spécifié',
        lyceeId,
        ordre: ordre || 0,
      },
      include: {
        lycee: {
          select: {
            id: true,
            nom: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: programme,
      message: 'Programme créé avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la création du programme:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}