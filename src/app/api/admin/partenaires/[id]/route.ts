import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/admin/partenaires/[id] - Récupérer un partenaire spécifique
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log(`🔄 GET /api/admin/partenaires/${params.id} - Récupération du partenaire...`);

    const partenaire = await db.partenaire.findUnique({
      where: { id: params.id }
    });

    if (!partenaire) {
      return NextResponse.json(
        { error: 'Partenaire non trouvé' },
        { status: 404 }
      );
    }

    console.log(`✅ Partenaire récupéré: ${partenaire.nom}`);

    return NextResponse.json({
      success: true,
      data: partenaire
    });

  } catch (error) {
    console.error('❌ Erreur lors de la récupération du partenaire:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/partenaires/[id] - Mettre à jour un partenaire
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log(`🔄 PUT /api/admin/partenaires/${params.id} - Mise à jour du partenaire...`);

    const body = await request.json();
    const { 
      nom, 
      type, 
      description, 
      logo,
      siteWeb, 
      email, 
      telephone, 
      adresse, 
      ville, 
      pays, 
      statut,
      ordre 
    } = body;

    // Vérifier si le partenaire existe
    const existingPartenaire = await db.partenaire.findUnique({
      where: { id: params.id }
    });

    if (!existingPartenaire) {
      return NextResponse.json(
        { error: 'Partenaire non trouvé' },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (nom !== undefined) updateData.nom = nom;
    if (type !== undefined) updateData.type = type;
    if (description !== undefined) updateData.description = description;
    if (logo !== undefined) updateData.logo = logo;
    if (siteWeb !== undefined) updateData.siteWeb = siteWeb;
    if (email !== undefined) updateData.email = email;
    if (telephone !== undefined) updateData.telephone = telephone;
    if (adresse !== undefined) updateData.adresse = adresse;
    if (ville !== undefined) updateData.ville = ville;
    if (pays !== undefined) updateData.pays = pays;
    if (statut !== undefined) updateData.statut = statut;
    if (ordre !== undefined) updateData.ordre = ordre;

    const partenaire = await db.partenaire.update({
      where: { id: params.id },
      data: updateData
    });

    console.log(`✅ Partenaire mis à jour: ${partenaire.nom}`);

    return NextResponse.json({
      success: true,
      data: partenaire,
      message: 'Partenaire mis à jour avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du partenaire:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/partenaires/[id] - Supprimer un partenaire
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log(`🔄 DELETE /api/admin/partenaires/${params.id} - Suppression du partenaire...`);

    // Vérifier si le partenaire existe
    const existingPartenaire = await db.partenaire.findUnique({
      where: { id: params.id }
    });

    if (!existingPartenaire) {
      return NextResponse.json(
        { error: 'Partenaire non trouvé' },
        { status: 404 }
      );
    }

    await db.partenaire.delete({
      where: { id: params.id }
    });

    console.log(`✅ Partenaire supprimé: ${existingPartenaire.nom}`);

    return NextResponse.json({
      success: true,
      message: 'Partenaire supprimé avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur lors de la suppression du partenaire:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}