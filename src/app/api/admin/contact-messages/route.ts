import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Middleware d'authentification simplifié
function authenticate(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  return authHeader && authHeader.startsWith('Bearer ');
}

// GET /api/admin/contact-messages - Récupérer tous les messages de contact
export async function GET(request: NextRequest) {
  try {
    console.log('🔄 GET /api/admin/contact-messages - Récupération des messages de contact...');
    
    if (!authenticate(request)) {
      console.log('❌ Échec d\'authentification');
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const filter = searchParams.get('filter') || 'all';

    const skip = (page - 1) * limit;

    // Construire la clause where
    let where: any = {};
    
    if (search) {
      where.OR = [
        { nom: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (filter === 'unread') {
      where.lu = false;
    } else if (filter === 'read') {
      where.lu = true;
    }

    const [messages, total] = await Promise.all([
      db.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.contactMessage.count({ where })
    ]);

    const unreadCount = await db.contactMessage.count({
      where: { lu: false }
    });

    console.log(`✅ ${messages.length} messages récupérés (page ${page})`);

    return NextResponse.json({
      success: true,
      data: messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      unreadCount,
      filters: {
        search,
        filter
      }
    });

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des messages de contact:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/contact-messages - Marquer un message comme lu/non lu
export async function PUT(request: NextRequest) {
  try {
    console.log('🔄 PUT /api/admin/contact-messages - Mise à jour d\'un message...');
    
    if (!authenticate(request)) {
      console.log('❌ Échec d\'authentification');
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, lu } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID du message requis' },
        { status: 400 }
      );
    }

    const updatedMessage = await db.contactMessage.update({
      where: { id },
      data: { lu: lu !== undefined ? lu : true }
    });

    console.log(`✅ Message ${id} marqué comme ${lu ? 'lu' : 'non lu'}`);

    return NextResponse.json({
      success: true,
      data: updatedMessage,
      message: `Message marqué comme ${lu ? 'lu' : 'non lu'}`
    });

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du message:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/contact-messages - Supprimer un message
export async function DELETE(request: NextRequest) {
  try {
    console.log('🔄 DELETE /api/admin/contact-messages - Suppression d\'un message...');
    
    if (!authenticate(request)) {
      console.log('❌ Échec d\'authentification');
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID du message requis' },
        { status: 400 }
      );
    }

    await db.contactMessage.delete({
      where: { id }
    });

    console.log(`✅ Message ${id} supprimé`);

    return NextResponse.json({
      success: true,
      message: 'Message supprimé avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur lors de la suppression du message:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}