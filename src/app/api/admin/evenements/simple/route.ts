import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/admin/evenements/simple - Récupérer la liste simplifiée des événements
export async function GET(request: NextRequest) {
  try {
    const evenements = await db.evenement.findMany({
      include: {
        lycee: {
          select: {
            nom: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    return NextResponse.json(evenements);
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des événements' },
      { status: 500 }
    );
  }
}