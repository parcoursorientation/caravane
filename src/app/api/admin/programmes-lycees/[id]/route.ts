import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Récupérer un programme spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const programme = await db.programmeLycee.findUnique({
      where: { id },
      include: {
        lycee: {
          select: {
            id: true,
            nom: true,
          },
        },
      },
    });

    if (!programme) {
      return NextResponse.json(
        { error: 'Programme non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: programme,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du programme:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un programme
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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

    // Vérifier que le programme existe
    const programmeExist = await db.programmeLycee.findUnique({
      where: { id },
    });

    if (!programmeExist) {
      return NextResponse.json(
        { error: 'Programme non trouvé' },
        { status: 404 }
      );
    }

    // Si le lycéeId est modifié, vérifier qu'il existe
    if (lyceeId && lyceeId !== programmeExist.lyceeId) {
      const lycee = await db.lycee.findUnique({
        where: { id: lyceeId },
      });

      if (!lycee) {
        return NextResponse.json(
          { error: 'Lycée non trouvé' },
          { status: 404 }
        );
      }
    }

    // Mettre à jour le programme
    const programme = await db.programmeLycee.update({
      where: { id },
      data: {
        ...(titre && { titre }),
        ...(description && { description }),
        ...(heure && { heure }),
        ...(duree && { duree }),
        ...(lieu && { lieu }),
        ...(type && { type }),
        ...(publicCible !== undefined && { public: publicCible }),
        ...(animateur !== undefined && { animateur }),
        ...(lyceeId && { lyceeId }),
        ...(ordre !== undefined && { ordre }),
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
      message: 'Programme mis à jour avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du programme:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un programme
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Vérifier que le programme existe
    const programme = await db.programmeLycee.findUnique({
      where: { id },
    });

    if (!programme) {
      return NextResponse.json(
        { error: 'Programme non trouvé' },
        { status: 404 }
      );
    }

    // Supprimer le programme
    await db.programmeLycee.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Programme supprimé avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du programme:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}