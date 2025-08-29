const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function initializeAdmin() {
  const prisma = new PrismaClient();

  try {
    console.log('🔄 Initialisation de l\'utilisateur administrateur...');

    // Vérifier si un utilisateur admin existe déjà
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'SUPER_ADMIN' }
    });

    if (existingAdmin) {
      console.log('✅ Un super administrateur existe déjà:', existingAdmin.email);
      return;
    }

    // Créer le mot de passe hashé
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Créer l'utilisateur administrateur
    const admin = await prisma.user.create({
      data: {
        email: 'admin@atlantisevents.ma',
        name: 'Administrateur Principal',
        password: hashedPassword,
        role: 'SUPER_ADMIN'
      }
    });

    console.log('✅ Utilisateur administrateur créé avec succès !');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Mot de passe: admin123');
    console.log('👤 Rôle:', admin.role);
    console.log('🆔 ID:', admin.id);

    // Créer un utilisateur staff également
    const staff = await prisma.user.create({
      data: {
        email: 'staff@atlantisevents.ma',
        name: 'Staff ATLANTIS',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    console.log('✅ Utilisateur staff créé avec succès !');
    console.log('📧 Email:', staff.email);
    console.log('🔑 Mot de passe: admin123');
    console.log('👤 Rôle:', staff.role);
    console.log('🆔 ID:', staff.id);

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    
    if (error.code === 'P2002') {
      console.error('Un utilisateur avec cet email existe déjà.');
    }
  } finally {
    await prisma.$disconnect();
  }
}

initializeAdmin();