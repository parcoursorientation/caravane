import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/admin/partenaires - Récupérer tous les partenaires
export async function GET(request: NextRequest) {
  try {
    console.log('🔄 GET /api/admin/partenaires - Récupération des partenaires...');

    const partenaires = await db.partenaire.findMany({
      orderBy: [
        { ordre: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    console.log(`✅ ${partenaires.length} partenaires récupérés`);

    return NextResponse.json({
      success: true,
      data: partenaires,
      total: partenaires.length
    });

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des partenaires:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// POST /api/admin/partenaires - Créer un nouveau partenaire
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 POST /api/admin/partenaires - Création d\'un partenaire...');

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

    // Validation des données requises
    if (!nom) {
      return NextResponse.json(
        { error: 'Le nom est requis' },
        { status: 400 }
      );
    }

    const partenaire = await db.partenaire.create({
      data: {
        nom,
        type: type || 'ORGANISATEUR',
        description: description || null,
        logo: logo || null,
        siteWeb: siteWeb || null,
        email: email || null,
        telephone: telephone || null,
        adresse: adresse || null,
        ville: ville || null,
        pays: pays || null,
        statut: statut || 'ACTIF',
        ordre: ordre || 0
      }
    });

    console.log(`✅ Partenaire créé: ${partenaire.nom}`);

    return NextResponse.json({
      success: true,
      data: partenaire,
      message: 'Partenaire créé avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur lors de la création du partenaire:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}