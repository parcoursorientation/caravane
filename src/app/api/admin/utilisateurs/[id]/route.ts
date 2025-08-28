import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// Données simulées pour les utilisateurs admin
// Dans un environnement réel, ces données viendraient de la base de données via Prisma
let users = [
  {
    id: "1",
    email: "admin@atlantisevents.ma",
    name: "Administrateur Principal",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // "admin123"
    role: "SUPER_ADMIN" as const,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "2",
    email: "staff@atlantisevents.ma",
    name: "Staff ATLANTIS",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // "admin123"
    role: "ADMIN" as const,
    createdAt: "2024-01-16T10:00:00Z",
    updatedAt: "2024-01-16T10:00:00Z"
  }
];

// Fonction de logging des actions administrateur
function logAdminAction(action: string, details: any, request: NextRequest) {
  const timestamp = new Date().toISOString();
  const authHeader = request.headers.get('authorization');
  const token = authHeader ? authHeader.substring(7) : 'unknown';
  
  const logEntry = {
    timestamp,
    action,
    details,
    token: token.substring(0, 20) + '...', // Afficher seulement les premiers caractères du token
    userAgent: request.headers.get('user-agent'),
    ip: request.headers.get('x-forwarded-for') || 'unknown'
  };
  
  console.log(`[ADMIN ACTION] ${JSON.stringify(logEntry)}`);
  
  // Dans un environnement réel, on sauvegarderait cela dans la base de données
  // ou un système de logging comme Winston ou Pino
}
function authenticate(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  return authHeader && authHeader.startsWith('Bearer ');
}

// Vérifier les droits de super admin
function isSuperAdmin(request: NextRequest): boolean {
  // Dans un environnement réel, on vérifierait le rôle dans le token
  return true; // Simplifié pour la démo
}

// GET /api/admin/utilisateurs/[id] - Récupérer un utilisateur spécifique
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!authenticate(request)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const user = users.find(u => u.id === id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = user;

    logAdminAction('GET_USER', { id, email: user.email }, request);

    return NextResponse.json({
      success: true,
      data: userWithoutPassword
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/utilisateurs/[id] - Mettre à jour un utilisateur
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!authenticate(request)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    if (!isSuperAdmin(request)) {
      return NextResponse.json(
        { error: 'Droits insuffisants' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { email, name, role, password } = body;

    // Validation améliorée
    if (!email || !name || !role) {
      return NextResponse.json(
        { error: 'Email, nom et rôle sont requis' },
        { status: 400 }
      );
    }

    // Validation de l'email avec regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    // Validation du nom (pas de caractères spéciaux)
    const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    if (!nameRegex.test(name.trim())) {
      return NextResponse.json(
        { error: 'Le nom contient des caractères invalides' },
        { status: 400 }
      );
    }

    if (!['ADMIN', 'SUPER_ADMIN'].includes(role)) {
      return NextResponse.json(
        { error: 'Rôle doit être ADMIN ou SUPER_ADMIN' },
        { status: 400 }
      );
    }

    // Validation du mot de passe si fourni
    if (password && password.length < 8) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      );
    }

    // Recherche de l'utilisateur
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    const existingUser = users.find(u => u.email === email && u.id !== id);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà' },
        { status: 400 }
      );
    }

    // Mise à jour
    const updatedUser = {
      ...users[userIndex],
      email,
      name,
      role,
      updatedAt: new Date().toISOString()
    };

    // Mettre à jour le mot de passe si fourni
    if (password && password.trim()) {
      updatedUser.password = await bcrypt.hash(password, 10);
    }

    users[userIndex] = updatedUser;

    console.log(`Utilisateur mis à jour: ${email} (${role}) - ${new Date().toISOString()}`);
    logAdminAction('UPDATE_USER', { id, email, name, role, passwordChanged: !!password }, request);

    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      success: true,
      data: userWithoutPassword,
      message: 'Utilisateur mis à jour avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/utilisateurs/[id] - Supprimer un utilisateur
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!authenticate(request)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    if (!isSuperAdmin(request)) {
      return NextResponse.json(
        { error: 'Droits insuffisants' },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Empêcher la suppression du dernier super admin
    const user = users.find(u => u.id === id);
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    if (user.role === 'SUPER_ADMIN') {
      const superAdminCount = users.filter(u => u.role === 'SUPER_ADMIN').length;
      if (superAdminCount <= 1) {
        return NextResponse.json(
          { error: 'Impossible de supprimer le dernier super administrateur' },
          { status: 400 }
        );
      }
    }

    // Empêcher l'auto-suppression
    if (user.email === 'admin@atlantisevents.ma') {
      return NextResponse.json(
        { error: 'Impossible de supprimer le compte administrateur principal' },
        { status: 400 }
      );
    }

    users.splice(users.findIndex(u => u.id === id), 1);

    console.log(`Utilisateur supprimé: ${user.email} - ${new Date().toISOString()}`);
    logAdminAction('DELETE_USER', { id, email: user.email, role: user.role }, request);

    return NextResponse.json({
      success: true,
      message: 'Utilisateur supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}