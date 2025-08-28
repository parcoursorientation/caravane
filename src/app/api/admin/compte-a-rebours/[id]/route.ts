import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/admin/compte-a-rebours/[id] - Récupérer un compte à rebours spécifique
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    console.log(`🔄 GET /api/admin/compte-a-rebours/${id} - Récupération du compte à rebours...`);

    const compteARebours = await db.compteARebours.findUnique({
      where: { id }
    });

    if (!compteARebours) {
      return NextResponse.json(
        { error: 'Compte à rebours non trouvé' },
        { status: 404 }
      );
    }

    console.log(`✅ Compte à rebours récupéré: ${compteARebours.titre}`);

    return NextResponse.json({
      success: true,
      data: compteARebours
    });

  } catch (error) {
    console.error('❌ Erreur lors de la récupération du compte à rebours:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/compte-a-rebours/[id] - Mettre à jour un compte à rebours
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    console.log(`🔄 PUT /api/admin/compte-a-rebours/${id} - Mise à jour du compte à rebours...`);

    const body = await request.json();
    const { titre, description, lieu, ville, dateCible, dateDebut, dateFin, actif } = body;

    // Vérifier si le compte à rebours existe
    const existingCompte = await db.compteARebours.findUnique({
      where: { id }
    });

    if (!existingCompte) {
      return NextResponse.json(
        { error: 'Compte à rebours non trouvé' },
        { status: 404 }
      );
    }

    // Désactiver tous les autres comptes à rebours si celui-ci est activé
    if (actif && !existingCompte.actif) {
      await db.compteARebours.updateMany({
        where: { 
          actif: true,
          id: { not: id }
        },
        data: { actif: false }
      });
    }

    const updateData: any = {};
    if (titre !== undefined) updateData.titre = titre;
    if (description !== undefined) updateData.description = description;
    if (lieu !== undefined) updateData.lieu = lieu;
    if (ville !== undefined) updateData.ville = ville;
    if (dateCible !== undefined) updateData.dateCible = new Date(dateCible);
    if (dateDebut !== undefined) updateData.dateDebut = dateDebut ? new Date(dateDebut) : null;
    if (dateFin !== undefined) updateData.dateFin = dateFin ? new Date(dateFin) : null;
    if (actif !== undefined) updateData.actif = actif;

    const compteARebours = await db.compteARebours.update({
      where: { id },
      data: updateData
    });

    console.log(`✅ Compte à rebours mis à jour: ${compteARebours.titre}`);

    return NextResponse.json({
      success: true,
      data: compteARebours,
      message: 'Compte à rebours mis à jour avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du compte à rebours:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/compte-a-rebours/[id] - Supprimer un compte à rebours
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    console.log(`🔄 DELETE /api/admin/compte-a-rebours/${id} - Suppression du compte à rebours...`);

    // Vérifier si le compte à rebours existe
    const existingCompte = await db.compteARebours.findUnique({
      where: { id }
    });

    if (!existingCompte) {
      return NextResponse.json(
        { error: 'Compte à rebours non trouvé' },
        { status: 404 }
      );
    }

    await db.compteARebours.delete({
      where: { id }
    });

    console.log(`✅ Compte à rebours supprimé: ${existingCompte.titre}`);

    return NextResponse.json({
      success: true,
      message: 'Compte à rebours supprimé avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur lors de la suppression du compte à rebours:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}