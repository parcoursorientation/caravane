import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/partenaires-public - Récupérer tous les partenaires actifs
export async function GET(request: NextRequest) {
  try {
    console.log('🔄 GET /api/partenaires-public - Récupération des partenaires publics...');

    const partenaires = await db.partenaire.findMany({
      where: {
        statut: 'ACTIF'
      },
      orderBy: [
        { ordre: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    console.log(`✅ ${partenaires.length} partenaires actifs récupérés`);

    return NextResponse.json({
      success: true,
      data: partenaires,
      total: partenaires.length
    });

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des partenaires publics:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}