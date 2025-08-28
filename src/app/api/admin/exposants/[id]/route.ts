import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Middleware d'authentification simplifié
function authenticate(request: NextRequest): boolean {
  // Dans un environnement réel, on vérifierait le token JWT
  const authHeader = request.headers.get('authorization');
  return authHeader && authHeader.startsWith('Bearer ');
}

// Interface pour le contexte des paramètres
interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// PUT /api/admin/exposants/[id] - Mettre à jour un exposant
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    if (!authenticate(request)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();
    const { nom, description, domaine, logo, siteWeb, statutConfirmation } = body;

    // Validation
    if (!nom || !description || !domaine || !statutConfirmation) {
      return NextResponse.json(
        { error: 'Nom, description, domaine et statut de confirmation sont requis' },
        { status: 400 }
      );
    }

    if (!['CONFIRME', 'EN_ATTENTE'].includes(statutConfirmation)) {
      return NextResponse.json(
        { error: 'Statut de confirmation doit être CONFIRME ou EN_ATTENTE' },
        { status: 400 }
      );
    }

    // Validation du site web si fourni
    if (siteWeb && !siteWeb.startsWith('http')) {
      return NextResponse.json(
        { error: 'URL du site web invalide' },
        { status: 400 }
      );
    }

    // Vérifier si l'exposant existe
    const existingExposant = await db.exposant.findUnique({
      where: { id }
    });

    if (!existingExposant) {
      return NextResponse.json(
        { error: 'Exposant non trouvé' },
        { status: 404 }
      );
    }

    // Mapper le statut de confirmation au statut de paiement
    const statutPaiement = statutConfirmation === 'CONFIRME' ? 'PAYE' : 'EN_ATTENTE';

    // Mise à jour de l'exposant
    const updatedExposant = await db.exposant.update({
      where: { id },
      data: {
        nom,
        description,
        domaine,
        logo: logo || null,
        siteWeb: siteWeb || null,
        statutPaiement
      }
    });

    // Mapper le statut de paiement au statut de confirmation pour la réponse
    const responseData = {
      ...updatedExposant,
      statutConfirmation: updatedExposant.statutPaiement === 'PAYE' ? 'CONFIRME' : 'EN_ATTENTE'
    };

    console.log(`Exposant mis à jour: ${nom} - ${new Date().toISOString()}`);

    return NextResponse.json({
      success: true,
      data: responseData,
      message: 'Exposant mis à jour avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'exposant:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/exposants/[id] - Supprimer un exposant
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    if (!authenticate(request)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    // Vérifier si l'exposant existe
    const existingExposant = await db.exposant.findUnique({
      where: { id }
    });

    if (!existingExposant) {
      return NextResponse.json(
        { error: 'Exposant non trouvé' },
        { status: 404 }
      );
    }

    // Suppression de l'exposant
    await db.exposant.delete({
      where: { id }
    });

    console.log(`Exposant supprimé: ${existingExposant.nom} - ${new Date().toISOString()}`);

    return NextResponse.json({
      success: true,
      message: 'Exposant supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'exposant:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}