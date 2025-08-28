import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const evenementId = searchParams.get('evenementId');

    if (evenementId) {
      // Récupérer une galerie spécifique
      const galerie = await db.galerie.findUnique({
        where: { evenementId },
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
    } else {
      // Récupérer toutes les galeries
      const galeries = await db.galerie.findMany({
        include: {
          medias: {
            orderBy: { createdAt: 'desc' }
          },
          evenement: {
            include: {
              lycee: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return NextResponse.json({ data: galeries });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des galeries:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const evenementId = formData.get('evenementId') as string;
    const titre = formData.get('titre') as string;
    const description = formData.get('description') as string;
    const files = formData.getAll('files') as File[];

    if (!evenementId || !titre) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      );
    }

    // Vérifier si l'événement existe
    const evenement = await db.evenement.findUnique({
      where: { id: evenementId }
    });

    if (!evenement) {
      return NextResponse.json(
        { error: 'Événement non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si une galerie existe déjà pour cet événement
    const existingGalerie = await db.galerie.findUnique({
      where: { evenementId },
      include: { medias: true }
    });

    let galerie;
    if (existingGalerie) {
      // Mettre à jour la galerie existante
      galerie = await db.galerie.update({
        where: { evenementId },
        data: {
          titre,
          description,
          updatedAt: new Date()
        },
        include: {
          medias: {
            orderBy: { createdAt: 'desc' }
          }
        }
      });
    } else {
      // Créer une nouvelle galerie
      galerie = await db.galerie.create({
        data: {
          titre,
          description,
          evenementId,
          maxImages: 10
        },
        include: {
          medias: {
            orderBy: { createdAt: 'desc' }
          }
        }
      });
    }

    // Traiter les fichiers uploadés
    const uploadedMedias = [];
    const currentImageCount = existingGalerie ? existingGalerie.medias.length : 0;
    const maxImages = 10;

    if (files && files.length > 0) {
      // Vérifier le nombre maximum d'images
      if (currentImageCount + files.length > maxImages) {
        return NextResponse.json(
          { error: `Maximum ${maxImages} images autorisées par galerie` },
          { status: 400 }
        );
      }

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
            description: `Image uploadée pour ${titre}`,
            fichier: `/uploads/${fileName}`,
            type: 'PHOTO',
            categorie: 'GALERIE_EVENEMENT',
            galerieId: galerie.id
          }
        });

        uploadedMedias.push(media);
      }
    }

    // Récupérer la galerie mise à jour avec tous les médias
    const updatedGalerie = await db.galerie.findUnique({
      where: { id: galerie.id },
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
      message: 'Galerie créée/mise à jour avec succès',
      uploadedCount: uploadedMedias.length
    });

  } catch (error) {
    console.error('Erreur lors de la création/mise à jour de la galerie:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}