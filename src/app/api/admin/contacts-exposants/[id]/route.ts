import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Middleware d'authentification simplifié
function authenticate(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  return !!(authHeader && authHeader.startsWith('Bearer '));
}

// PUT /api/admin/contacts-exposants/[id] - Mettre à jour un contact d'exposant
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log(`🔄 PUT /api/admin/contacts-exposants/${params.id} - Mise à jour d'un contact d'exposant...`);
    
    if (!authenticate(request)) {
      console.log('❌ Échec d\'authentification');
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { nom, prenom, email, telephone, fonction, entreprise, exposantId, statut, notes } = body;

    // Vérifier si le contact existe
    const existingContact = await db.contactExposant.findUnique({
      where: { id: params.id }
    });

    if (!existingContact) {
      return NextResponse.json(
        { error: 'Contact non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si l'email est déjà utilisé par un autre contact
    if (email && email !== existingContact.email) {
      const emailExists = await db.contactExposant.findUnique({
        where: { email }
      });

      if (emailExists) {
        return NextResponse.json(
          { error: 'Un contact avec cet email existe déjà' },
          { status: 400 }
        );
      }
    }

    const updatedContact = await db.contactExposant.update({
      where: { id: params.id },
      data: {
        ...(nom && { nom }),
        ...(prenom && { prenom }),
        ...(email && { email }),
        ...(telephone !== undefined && { telephone }),
        ...(fonction !== undefined && { fonction }),
        ...(entreprise !== undefined && { entreprise }),
        ...(exposantId !== undefined && { exposantId }),
        ...(statut && { statut }),
        ...(notes !== undefined && { notes })
      },
      include: {
        exposant: {
          select: {
            id: true,
            nom: true,
            domaine: true
          }
        }
      }
    });

    console.log(`✅ Contact ${params.id} mis à jour avec succès`);

    return NextResponse.json({
      success: true,
      data: updatedContact,
      message: 'Contact mis à jour avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du contact d\'exposant:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/contacts-exposants/[id] - Supprimer un contact d'exposant
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log(`🔄 DELETE /api/admin/contacts-exposants/${params.id} - Suppression d'un contact d'exposant...`);
    
    if (!authenticate(request)) {
      console.log('❌ Échec d\'authentification');
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Vérifier si le contact existe
    const existingContact = await db.contactExposant.findUnique({
      where: { id: params.id }
    });

    if (!existingContact) {
      return NextResponse.json(
        { error: 'Contact non trouvé' },
        { status: 404 }
      );
    }

    await db.contactExposant.delete({
      where: { id: params.id }
    });

    console.log(`✅ Contact ${params.id} supprimé avec succès`);

    return NextResponse.json({
      success: true,
      message: 'Contact supprimé avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur lors de la suppression du contact d\'exposant:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}