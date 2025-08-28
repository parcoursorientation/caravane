import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/compte-a-rebours - Récupérer le compte à rebours actif
export async function GET(request: NextRequest) {
  try {
    console.log('🔄 GET /api/compte-a-rebours - Récupération du compte à rebours actif...');

    const compteARebours = await db.compteARebours.findFirst({
      where: { actif: true },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!compteARebours) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'Aucun compte à rebours actif trouvé'
      });
    }

    console.log(`✅ Compte à rebours actif récupéré: ${compteARebours.titre}`);

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