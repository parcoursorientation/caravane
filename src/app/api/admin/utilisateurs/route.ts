import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

// Fonction de logging des actions administrateur
function logAdminAction(action: string, details: any, request: NextRequest) {
  const timestamp = new Date().toISOString();
  const authHeader = request.headers.get("authorization");
  const token = authHeader ? authHeader.substring(7) : "unknown";

  const logEntry = {
    timestamp,
    action,
    details,
    token: token.substring(0, 20) + "...", // Afficher seulement les premiers caractères du token
    userAgent: request.headers.get("user-agent"),
    ip: request.headers.get("x-forwarded-for") || "unknown",
  };

  console.log(`[ADMIN ACTION] ${JSON.stringify(logEntry)}`);

  // Dans un environnement réel, on sauvegarderait cela dans la base de données
  // ou un système de logging comme Winston ou Pino
}
function authenticate(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  return !!(authHeader && authHeader.startsWith("Bearer "));
}

// Vérifier les droits de super admin
function isSuperAdmin(request: NextRequest): boolean {
  // Dans un environnement réel, on vérifierait le rôle dans le token
  return true; // Simplifié pour la démo
}

// GET /api/admin/utilisateurs - Récupérer tous les utilisateurs
export async function GET(request: NextRequest) {
  try {
    if (!authenticate(request)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Récupérer les utilisateurs depuis la base de données
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    logAdminAction("LIST_USERS", { count: users.length }, request);

    return NextResponse.json({
      success: true,
      data: users,
      total: users.length,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// POST /api/admin/utilisateurs - Créer un nouvel utilisateur
export async function POST(request: NextRequest) {
  try {
    if (!authenticate(request)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    if (!isSuperAdmin(request)) {
      return NextResponse.json(
        { error: "Droits insuffisants" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email, name, password, role } = body;

    // Validation améliorée
    if (!email || !name || !password || !role) {
      return NextResponse.json(
        { error: "Email, nom, mot de passe et rôle sont requis" },
        { status: 400 }
      );
    }

    // Validation de l'email avec regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Format d'email invalide" },
        { status: 400 }
      );
    }

    // Validation du mot de passe
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères" },
        { status: 400 }
      );
    }

    // Validation du nom (pas de caractères spéciaux)
    const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    if (!nameRegex.test(name.trim())) {
      return NextResponse.json(
        { error: "Le nom contient des caractères invalides" },
        { status: 400 }
      );
    }

    if (!["ADMIN", "SUPER_ADMIN"].includes(role)) {
      return NextResponse.json(
        { error: "Rôle doit être ADMIN ou SUPER_ADMIN" },
        { status: 400 }
      );
    }

    // Vérifier si l'email existe déjà
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Un utilisateur avec cet email existe déjà" },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création du nouvel utilisateur dans la base de données
    const newUser = await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    console.log(
      `Nouvel utilisateur créé: ${email} (${role}) - ${new Date().toISOString()}`
    );
    logAdminAction("CREATE_USER", { email, name, role }, request);

    return NextResponse.json(
      {
        success: true,
        data: newUser,
        message: "Utilisateur créé avec succès",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/utilisateurs/[id] - Mettre à jour un utilisateur
export async function PUT(request: NextRequest) {
  try {
    if (!authenticate(request)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    if (!isSuperAdmin(request)) {
      return NextResponse.json(
        { error: "Droits insuffisants" },
        { status: 403 }
      );
    }

    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { error: "ID utilisateur manquant" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { email, name, role, password } = body;

    // Validation
    if (!email || !name || !role) {
      return NextResponse.json(
        { error: "Email, nom et rôle sont requis" },
        { status: 400 }
      );
    }

    if (!["ADMIN", "SUPER_ADMIN"].includes(role)) {
      return NextResponse.json(
        { error: "Rôle doit être ADMIN ou SUPER_ADMIN" },
        { status: 400 }
      );
    }

    // Recherche de l'utilisateur
    const existingUser = await db.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    const emailConflict = await db.user.findFirst({
      where: {
        email,
        NOT: { id },
      },
    });

    if (emailConflict) {
      return NextResponse.json(
        { error: "Un utilisateur avec cet email existe déjà" },
        { status: 400 }
      );
    }

    // Préparer les données de mise à jour
    const updateData: any = {
      email,
      name,
      role,
    };

    // Mettre à jour le mot de passe si fourni
    if (password && password.trim()) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Mise à jour dans la base de données
    const updatedUser = await db.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    console.log(
      `Utilisateur mis à jour: ${email} (${role}) - ${new Date().toISOString()}`
    );
    logAdminAction(
      "UPDATE_USER",
      { id, email, name, role, passwordChanged: !!password },
      request
    );

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: "Utilisateur mis à jour avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/utilisateurs/[id] - Supprimer un utilisateur
export async function DELETE(request: NextRequest) {
  try {
    if (!authenticate(request)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    if (!isSuperAdmin(request)) {
      return NextResponse.json(
        { error: "Droits insuffisants" },
        { status: 403 }
      );
    }

    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { error: "ID utilisateur manquant" },
        { status: 400 }
      );
    }

    // Recherche de l'utilisateur à supprimer
    const user = await db.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Empêcher la suppression du dernier super admin
    if (user.role === "SUPER_ADMIN") {
      const superAdminCount = await db.user.count({
        where: { role: "SUPER_ADMIN" },
      });

      if (superAdminCount <= 1) {
        return NextResponse.json(
          { error: "Impossible de supprimer le dernier super administrateur" },
          { status: 400 }
        );
      }
    }

    // Empêcher l'auto-suppression du compte principal
    if (user.email === "admin@atlantisevents.ma") {
      return NextResponse.json(
        { error: "Impossible de supprimer le compte administrateur principal" },
        { status: 400 }
      );
    }

    // Suppression de l'utilisateur
    await db.user.delete({
      where: { id },
    });

    console.log(
      `Utilisateur supprimé: ${user.email} - ${new Date().toISOString()}`
    );
    logAdminAction(
      "DELETE_USER",
      { id, email: user.email, role: user.role },
      request
    );

    return NextResponse.json({
      success: true,
      message: "Utilisateur supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
