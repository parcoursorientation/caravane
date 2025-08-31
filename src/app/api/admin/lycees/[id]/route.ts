import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Middleware d'authentification simplifié
function authenticate(request: NextRequest): boolean {
  // Dans un environnement réel, on vérifierait le token JWT
  const authHeader = request.headers.get("authorization");
  return !!(authHeader && authHeader.startsWith("Bearer "));
}

// Interface pour le contexte des paramètres
interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// PUT /api/admin/lycees/[id] - Mettre à jour un lycée
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    console.log("🔄 PUT /api/admin/lycees/[id] - Mise à jour d'un lycée...");

    if (!authenticate(request)) {
      console.log("❌ Échec d'authentification");
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const { nom, adresse, type, description, logo, actif } = body;

    console.log("📝 Données reçues pour mise à jour:", {
      id,
      nom,
      adresse,
      type,
      actif,
      hasDescription: !!description,
      hasLogo: !!logo,
    });

    // Validation
    if (!nom || !adresse || !type) {
      console.log("❌ Validation échouée: champs manquants");
      return NextResponse.json(
        { error: "Nom, adresse et type sont requis" },
        { status: 400 }
      );
    }

    if (!["PUBLIC", "PRIVE"].includes(type)) {
      console.log("❌ Validation échouée: type invalide");
      return NextResponse.json(
        { error: "Type doit être PUBLIC ou PRIVE" },
        { status: 400 }
      );
    }

    // Vérifier si le lycée existe
    const existingLycee = await db.lycee.findUnique({
      where: { id },
    });

    if (!existingLycee) {
      console.log(`❌ Lycée non trouvé: ${id}`);
      return NextResponse.json({ error: "Lycée non trouvé" }, { status: 404 });
    }

    console.log(`📝 Lycée trouvé: ${existingLycee.nom}`);

    // Mise à jour du lycée
    const updatedLycee = await db.lycee.update({
      where: { id },
      data: {
        nom,
        adresse,
        type,
        description: description || null,
        logo: logo || null,
        ...(typeof actif === "boolean" ? { actif } : {}),
      },
    });

    console.log(
      `✅ Lycée mis à jour: ${nom} (ID: ${id}) - ${new Date().toISOString()}`
    );

    return NextResponse.json({
      success: true,
      data: updatedLycee,
      message: "Lycée mis à jour avec succès",
    });
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour du lycée:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/lycees/[id] - Supprimer un lycée
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    console.log("🔄 DELETE /api/admin/lycees/[id] - Suppression d'un lycée...");

    if (!authenticate(request)) {
      console.log("❌ Échec d'authentification");
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await context.params;

    console.log(`📝 Demande de suppression pour le lycée: ${id}`);

    // Vérifier si le lycée existe
    const existingLycee = await db.lycee.findUnique({
      where: { id },
    });

    if (!existingLycee) {
      console.log(`❌ Lycée non trouvé: ${id}`);
      return NextResponse.json({ error: "Lycée non trouvé" }, { status: 404 });
    }

    console.log(`📝 Lycée trouvé pour suppression: ${existingLycee.nom}`);

    // Suppression du lycée
    await db.lycee.delete({
      where: { id },
    });

    console.log(
      `✅ Lycée supprimé: ${
        existingLycee.nom
      } (ID: ${id}) - ${new Date().toISOString()}`
    );

    return NextResponse.json({
      success: true,
      message: "Lycée supprimé avec succès",
    });
  } catch (error) {
    console.error("❌ Erreur lors de la suppression du lycée:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
