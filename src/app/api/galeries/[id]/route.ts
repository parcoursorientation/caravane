import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { unlink, writeFile } from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const galerieId = params.id;

    // Récupérer une galerie spécifique
    const galerie = await db.galerie.findUnique({
      where: { id: galerieId },
      include: {
        medias: {
          orderBy: { createdAt: 'desc' }
        },
        evenement: {
          include: {
            lycee: true
          }
        }
      }
    });

    if (!galerie) {
      return NextResponse.json(
        { error: 'Galerie non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: galerie });
  } catch (error) {
    console.error('Erreur lors de la récupération de la galerie:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const galerieId = params.id;
    const { titre, description } = await request.json();

    if (!titre) {
      return NextResponse.json(
        { error: 'Le titre est requis' },
        { status: 400 }
      );
    }

    // Vérifier si la galerie existe
    const existingGalerie = await db.galerie.findUnique({
      where: { id: galerieId }
    });

    if (!existingGalerie) {
      return NextResponse.json(
        { error: 'Galerie non trouvée' },
        { status: 404 }
      );
    }

    // Mettre à jour la galerie
    const updatedGalerie = await db.galerie.update({
      where: { id: galerieId },
      data: {
        titre,
        description,
        updatedAt: new Date()
      },
      include: {
        medias: {
          orderBy: { createdAt: 'desc' }
        },
        evenement: {
          include: {
            lycee: true
          }
        }
      }
    });

    return NextResponse.json({ 
      data: updatedGalerie,
      message: 'Galerie mise à jour avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la galerie:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const mediaId = params.id;

    // Récupérer le média à supprimer
    const media = await db.media.findUnique({
      where: { id: mediaId },
      include: {
        galerie: true
      }
    });

    if (!media) {
      return NextResponse.json(
        { error: 'Média non trouvé' },
        { status: 404 }
      );
    }

    // Supprimer le fichier physique
    if (media.fichier) {
      const filePath = path.join(process.cwd(), 'public', media.fichier);
      try {
        await unlink(filePath);
      } catch (error) {
        console.error('Erreur lors de la suppression du fichier:', error);
        // Continuer même si le fichier n'existe pas
      }
    }

    // Supprimer l'entrée de la base de données
    await db.media.delete({
      where: { id: mediaId }
    });

    return NextResponse.json({ 
      message: 'Image supprimée avec succès',
      deletedMedia: media
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'image:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}