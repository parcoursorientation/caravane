import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const galerieId = params.id;
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    // Vérifier si la galerie existe
    const galerie = await db.galerie.findUnique({
      where: { id: galerieId },
      include: { medias: true }
    });

    if (!galerie) {
      return NextResponse.json(
        { error: 'Galerie non trouvée' },
        { status: 404 }
      );
    }

    const currentImageCount = galerie.medias.length;
    const maxImages = galerie.maxImages || 10;

    if (files && files.length > 0) {
      // Vérifier le nombre maximum d'images
      if (currentImageCount + files.length > maxImages) {
        return NextResponse.json(
          { error: `Maximum ${maxImages} images autorisées par galerie (${currentImageCount} déjà présentes)` },
          { status: 400 }
        );
      }

      const uploadedMedias = [];

      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) { // 5MB max
          return NextResponse.json(
            { error: 'La taille maximale des fichiers est de 5MB' },
            { status: 400 }
          );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Générer un nom de fichier unique
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(2, 15);
        const fileExtension = file.name.split('.').pop();
        const fileName = `${timestamp}-${randomId}.${fileExtension}`;
        const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);

        // Écrire le fichier
        await writeFile(filePath, buffer);

        // Créer l'entrée dans la base de données
        const media = await db.media.create({
          data: {
            titre: file.name.replace(/\.[^/.]+$/, ""), // Nom sans extension
            description: `Image ajoutée à ${galerie.titre}`,
            fichier: `/uploads/${fileName}`,
            type: 'PHOTO',
            categorie: 'GALERIE_EVENEMENT',
            galerieId: galerie.id
          }
        });

        uploadedMedias.push(media);
      }

      // Récupérer la galerie mise à jour
      const updatedGalerie = await db.galerie.findUnique({
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

      return NextResponse.json({ 
        data: updatedGalerie,
        message: 'Images ajoutées avec succès',
        uploadedCount: uploadedMedias.length
      });
    }

    return NextResponse.json(
      { error: 'Aucun fichier fourni' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Erreur lors de l\'ajout des images:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}