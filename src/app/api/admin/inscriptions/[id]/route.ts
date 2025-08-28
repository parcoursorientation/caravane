import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { statut } = await request.json();

    if (!statut || !['EN_ATTENTE', 'CONFIRMEE', 'ANNULEE'].includes(statut)) {
      return NextResponse.json(
        { error: 'Statut invalide' },
        { status: 400 }
      );
    }

    // Vérifier si l'inscription existe
    const existingInscription = await db.inscription.findUnique({
      where: { id: params.id }
    });

    if (!existingInscription) {
      return NextResponse.json(
        { error: 'Inscription non trouvée' },
        { status: 404 }
      );
    }

    // Mettre à jour le statut de l'inscription
    const updatedInscription = await db.inscription.update({
      where: { id: params.id },
      data: { statut }
    });

    console.log(`Statut de l'inscription ${params.id} mis à jour: ${statut}`);

    return NextResponse.json({
      message: 'Statut de l\'inscription mis à jour avec succès',
      data: updatedInscription
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'inscription:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Vérifier si l'inscription existe
    const existingInscription = await db.inscription.findUnique({
      where: { id: params.id }
    });

    if (!existingInscription) {
      return NextResponse.json(
        { error: 'Inscription non trouvée' },
        { status: 404 }
      );
    }

    // Supprimer l'inscription
    await db.inscription.delete({
      where: { id: params.id }
    });

    console.log(`Inscription ${params.id} supprimée`);

    return NextResponse.json({
      message: 'Inscription supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'inscription:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}