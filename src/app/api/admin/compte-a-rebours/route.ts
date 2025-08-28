import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/admin/compte-a-rebours - Récupérer tous les comptes à rebours
export async function GET(request: NextRequest) {
  try {
    console.log('🔄 GET /api/admin/compte-a-rebours - Récupération des comptes à rebours...');

    const comptesARebours = await db.compteARebours.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`✅ ${comptesARebours.length} comptes à rebours récupérés`);

    return NextResponse.json({
      success: true,
      data: comptesARebours,
      total: comptesARebours.length
    });

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des comptes à rebours:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// POST /api/admin/compte-a-rebours - Créer un nouveau compte à rebours
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 POST /api/admin/compte-a-rebours - Création d\'un compte à rebours...');

    const body = await request.json();
    const { titre, description, lieu, ville, dateCible, dateDebut, dateFin, actif } = body;

    // Validation des données requises
    if (!titre || !dateCible) {
      return NextResponse.json(
        { error: 'Le titre et la date cible sont requis' },
        { status: 400 }
      );
    }

    // Désactiver tous les autres comptes à rebours si celui-ci est actif
    if (actif) {
      await db.compteARebours.updateMany({
        where: { actif: true },
        data: { actif: false }
      });
    }

    const compteARebours = await db.compteARebours.create({
      data: {
        titre,
        description: description || null,
        lieu: lieu || null,
        ville: ville || null,
        dateCible: new Date(dateCible),
        dateDebut: dateDebut ? new Date(dateDebut) : null,
        dateFin: dateFin ? new Date(dateFin) : null,
        actif: actif ?? true
      }
    });

    console.log(`✅ Compte à rebours créé: ${compteARebours.titre}`);

    return NextResponse.json({
      success: true,
      data: compteARebours,
      message: 'Compte à rebours créé avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur lors de la création du compte à rebours:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}