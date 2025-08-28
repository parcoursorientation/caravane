import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Middleware d'authentification simplifié
function authenticate(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  return authHeader && authHeader.startsWith('Bearer ');
}

interface Activity {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'MESSAGE' | 'INSCRIPTION';
  entityType: 'LYCEE' | 'EXPOSANT' | 'EVENEMENT' | 'PROGRAMME' | 'USER' | 'CONTACT' | 'INSCRIPTION';
  entityId: string;
  entityName: string;
  description: string;
  userId?: string;
  userEmail?: string;
  createdAt: Date;
  metadata?: any;
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 GET /api/admin/activities - Récupération des activités...');
    
    if (!authenticate(request)) {
      console.log('❌ Échec d\'authentification');
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type') as Activity['type'] | null;
    const entityType = searchParams.get('entityType') as Activity['entityType'] | null;
    const search = searchParams.get('search') || '';

    const offset = (page - 1) * limit;

    // Construire la requête de base
    let whereClause: any = {};
    
    if (type) {
      whereClause.type = type;
    }
    
    if (entityType) {
      whereClause.entityType = entityType;
    }
    
    if (search) {
      whereClause.OR = [
        { entityName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { userEmail: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Récupérer les activités depuis la base de données
    // Note: Pour l'instant, nous allons simuler les activités car la table n'existe pas encore
    // Dans une implémentation réelle, vous auriez une table ActivityLog dans votre schéma Prisma
    
    // Activités simulées pour démonstration
    const mockActivities: Activity[] = [
      {
        id: '1',
        type: 'CREATE',
        entityType: 'LYCEE',
        entityId: '1',
        entityName: 'Lycée des Sciences et Technologies',
        description: 'Nouveau lycée ajouté au système',
        userEmail: 'admin@example.com',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 heures ago
        metadata: { action: 'create', fields: ['name', 'address', 'type'] }
      },
      {
        id: '2',
        type: 'UPDATE',
        entityType: 'EXPOSANT',
        entityId: '2',
        entityName: 'École Supérieure d\'Ingénierie',
        description: 'Informations de l\'exposant mises à jour',
        userEmail: 'admin@example.com',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 heures ago
        metadata: { action: 'update', fields: ['description', 'website'] }
      },
      {
        id: '3',
        type: 'CREATE',
        entityType: 'EVENEMENT',
        entityId: '3',
        entityName: 'Session au Lycée Mohamed V',
        description: 'Nouvel événement créé',
        userEmail: 'admin@example.com',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 jour ago
        metadata: { action: 'create', date: '2024-01-15', time: '14:00' }
      },
      {
        id: '4',
        type: 'MESSAGE',
        entityType: 'CONTACT',
        entityId: '4',
        entityName: 'Contact via le formulaire',
        description: 'Nouveau message de contact reçu',
        userEmail: 'visiteur@example.com',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 jours ago
        metadata: { subject: 'Demande d\'information', priority: 'normal' }
      },
      {
        id: '5',
        type: 'CREATE',
        entityType: 'INSCRIPTION',
        entityId: '5',
        entityName: 'Inscription de Jean Dupont',
        description: 'Nouvelle inscription enregistrée',
        userEmail: 'jean.dupont@email.com',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 jours ago
        metadata: { eventName: 'Tour de Portes Ouvertes', status: 'pending' }
      },
      {
        id: '6',
        type: 'UPDATE',
        entityType: 'PROGRAMME',
        entityId: '6',
        entityName: 'Programme de mathématiques',
        description: 'Programme mis à jour',
        userEmail: 'admin@example.com',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 jours ago
        metadata: { action: 'update', changes: ['description', 'duration'] }
      },
      {
        id: '7',
        type: 'DELETE',
        entityType: 'EXPOSANT',
        entityId: '7',
        entityName: 'Ancien exposant supprimé',
        description: 'Exposant supprimé du système',
        userEmail: 'admin@example.com',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 jours ago
        metadata: { action: 'delete', reason: 'doublon' }
      },
      {
        id: '8',
        type: 'LOGIN',
        entityType: 'USER',
        entityId: '8',
        entityName: 'Connexion administrateur',
        description: 'Connexion réussie au tableau de bord',
        userEmail: 'admin@example.com',
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 jours ago
        metadata: { ip: '192.168.1.1', device: 'Chrome on Windows' }
      },
      {
        id: '9',
        type: 'CREATE',
        entityType: 'LYCEE',
        entityId: '9',
        entityName: 'Lycée Polyvalent de Paris',
        description: 'Nouveau lycée ajouté',
        userEmail: 'admin@example.com',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 jours ago
        metadata: { action: 'create', type: 'public' }
      },
      {
        id: '10',
        type: 'UPDATE',
        entityType: 'EVENEMENT',
        entityId: '10',
        entityName: 'Session de présentation',
        description: 'Détails de l\'événement modifiés',
        userEmail: 'admin@example.com',
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 jours ago
        metadata: { action: 'update', changes: ['location', 'time'] }
      }
    ];

    // Filtrer les activités simulées
    let filteredActivities = mockActivities;
    
    if (type) {
      filteredActivities = filteredActivities.filter(a => a.type === type);
    }
    
    if (entityType) {
      filteredActivities = filteredActivities.filter(a => a.entityType === entityType);
    }
    
    if (search) {
      filteredActivities = filteredActivities.filter(a => 
        a.entityName.toLowerCase().includes(search.toLowerCase()) ||
        a.description.toLowerCase().includes(search.toLowerCase()) ||
        (a.userEmail && a.userEmail.toLowerCase().includes(search.toLowerCase()))
      );
    }

    // Trier par date (plus récent en premier)
    filteredActivities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Paginer
    const activities = filteredActivities.slice(offset, offset + limit);
    const total = filteredActivities.length;

    console.log(`✅ ${activities.length} activités récupérées (page ${page})`);

    return NextResponse.json({
      success: true,
      data: activities,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des activités:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}