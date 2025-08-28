import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { unlink } from 'fs/promises';
import path from 'path';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const galerieId = params.id;

    // Récupérer la galerie avec tous ses médias
    const galerie = await db.galerie.findUnique({
      where: { id: galerieId },
      include: {
        medias: true
      }
    });

    if (!galerie) {
      return NextResponse.json(
        { error: 'Galerie non trouvée' },
        { status: 404 }
      );
    }

    // Supprimer tous les fichiers physiques
    for (const media of galerie.medias) {
      if (media.fichier) {
        const filePath = path.join(process.cwd(), 'public', media.fichier);
        try {
          await unlink(filePath);
        } catch (error) {
          console.error('Erreur lors de la suppression du fichier:', media.fichier, error);
          // Continuer même si le fichier n'existe pas
        }
      }
    }

    // Supprimer la galerie (cela supprimera automatiquement les médias grâce à la relation)
    await db.galerie.delete({
      where: { id: galerieId }
    });

    return NextResponse.json({ 
      message: 'Galerie et toutes ses images supprimées avec succès',
      deletedGalerie: galerie
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de la galerie:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}