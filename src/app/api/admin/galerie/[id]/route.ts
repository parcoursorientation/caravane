import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/admin/galerie/[id] - Récupérer un média spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const media = await db.media.findUnique({
      where: { id: params.id },
      include: {
        evenement: {
          include: {
            lycee: true
          }
        }
      }
    });

    if (!media) {
      return NextResponse.json(
        { error: 'Média non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(media);
  } catch (error) {
    console.error('Erreur lors de la récupération du média:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du média' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/galerie/[id] - Mettre à jour un média
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { titre, description, type, categorie, evenementId, fichier } = body;

    // Vérifier si le média existe
    const existingMedia = await db.media.findUnique({
      where: { id: params.id }
    });

    if (!existingMedia) {
      return NextResponse.json(
        { error: 'Média non trouvé' },
        { status: 404 }
      );
    }

    const updatedMedia = await db.media.update({
      where: { id: params.id },
      data: {
        titre: titre || existingMedia.titre,
        description: description !== undefined ? description : existingMedia.description,
        type: type || existingMedia.type,
        categorie: categorie !== undefined ? categorie : existingMedia.categorie,
        evenementId: evenementId !== undefined ? evenementId : existingMedia.evenementId,
        fichier: fichier || existingMedia.fichier
      },
      include: {
        evenement: {
          include: {
            lycee: true
          }
        }
      }
    });

    return NextResponse.json(updatedMedia);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du média:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du média' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/galerie/[id] - Supprimer un média
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier si le média existe
    const existingMedia = await db.media.findUnique({
      where: { id: params.id }
    });

    if (!existingMedia) {
      return NextResponse.json(
        { error: 'Média non trouvé' },
        { status: 404 }
      );
    }

    await db.media.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Média supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du média:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du média' },
      { status: 500 }
    );
  }
}