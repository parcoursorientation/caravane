import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Récupérer les programmes du lycée avec les informations du lycée
    const programmes = await db.programmeLycee.findMany({
      where: {
        lyceeId: id,
      },
      orderBy: {
        ordre: 'asc',
      },
    });

    // Récupérer aussi les informations du lycée
    const lycee = await db.lycee.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        nom: true,
        adresse: true,
        type: true,
        description: true,
      },
    });

    if (!lycee) {
      return NextResponse.json(
        { error: 'Lycée non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        lycee,
        programmes,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des programmes du lycée:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}