#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Configuration du déploiement Vercel + Supabase');
console.log('=============================================\n');

async function setupDeployment() {
  try {
    // 1. Configuration Supabase
    console.log('📋 Étape 1: Configuration Supabase');
    console.log('----------------------------------------');
    
    const supabaseHost = await question('🌐 URL de l\'hôte Supabase (ex: db.votre-projet.supabase.co): ');
    const supabasePassword = await question('🔒 Mot de passe de la base de données Supabase: ');
    const supabaseProject = await question('📝 Nom du projet Supabase (ex: votre-projet): ');
    
    // 2. Configuration Vercel
    console.log('\n📋 Étape 2: Configuration Vercel');
    console.log('------------------------------------');
    
    const vercelUrl = await question('🌍 URL de votre application Vercel (ex: https://votre-app.vercel.app): ');
    const nextauthSecret = await question('🔑 NEXTAUTH_SECRET (laissez vide pour en générer un): ');
    
    // 3. Génération des fichiers de configuration
    console.log('\n📋 Étape 3: Génération des fichiers de configuration');
    console.log('----------------------------------------------------');
    
    // Générer .env.local
    const envContent = `# URL de la base de données Supabase
DATABASE_URL="postgresql://postgres:${supabasePassword}@${supabaseHost}:5432/postgres"

# Configuration NextAuth
NEXTAUTH_URL="${vercelUrl}"
NEXTAUTH_SECRET="${nextauthSecret || generateSecret()}"

# Configuration Supabase
NEXT_PUBLIC_SUPABASE_URL="https://${supabaseProject}.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY=""

# Configuration Socket.IO
SOCKET_IO_PORT="3000"
`;

    fs.writeFileSync(path.join(__dirname, '../.env.local'), envContent);
    console.log('✅ Fichier .env.local créé');
    
    // Générer .env.example
    const envExampleContent = `# URL de la base de données Supabase
DATABASE_URL="postgresql://postgres:[VOTRE_MOT_DE_PASSE]@db.votre-projet.supabase.co:5432/postgres"

# Configuration NextAuth
NEXTAUTH_URL="https://votre-app.vercel.app"
NEXTAUTH_SECRET="votre-secret-ici"

# Configuration Supabase
NEXT_PUBLIC_SUPABASE_URL="https://votre-projet.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="votre-cle-anon-ici"

# Configuration Socket.IO
SOCKET_IO_PORT="3000"
`;

    fs.writeFileSync(path.join(__dirname, '../.env.example'), envExampleContent);
    console.log('✅ Fichier .env.example créé');
    
    // Mettre à jour next.config.js si nécessaire
    const nextConfigPath = path.join(__dirname, '../next.config.js');
    if (!fs.existsSync(nextConfigPath)) {
      const nextConfigContent = `/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['${supabaseProject}.supabase.co'],
  },
}

module.exports = nextConfig
`;
      fs.writeFileSync(nextConfigPath, nextConfigContent);
      console.log('✅ Fichier next.config.js créé');
    }
    
    // 4. Instructions pour le déploiement
    console.log('\n📋 Étape 4: Instructions de déploiement');
    console.log('-------------------------------------');
    
    console.log('\n🎯 Configuration Supabase:');
    console.log('1. Allez sur https://supabase.com');
    console.log('2. Créez un nouveau projet avec les informations ci-dessus');
    console.log('3. Une fois le projet créé, allez dans Settings > Database');
    console.log('4. Copiez le script SQL depuis migration.sql');
    console.log('5. Exécutez-le dans l\'éditeur SQL Supabase');
    
    console.log('\n🎯 Configuration Vercel:');
    console.log('1. Allez sur https://vercel.com');
    console.log('2. Importez votre dépôt GitHub');
    console.log('3. Configurez les variables d\'environnement suivantes:');
    console.log('   - DATABASE_URL');
    console.log('   - NEXTAUTH_URL');
    console.log('   - NEXTAUTH_SECRET');
    console.log('   - NEXT_PUBLIC_SUPABASE_URL');
    console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY');
    
    console.log('\n🎯 Après le déploiement:');
    console.log('1. Testez toutes les fonctionnalités');
    console.log('2. Vérifiez les logs Vercel pour les erreurs');
    console.log('3. Surveillez les performances avec Analytics');
    
    console.log('\n🎉 Configuration terminée !');
    console.log('📁 Fichiers générés:');
    console.log('   - .env.local');
    console.log('   - .env.example');
    console.log('   - next.config.js (si nécessaire)');
    
  } catch (error) {
    console.error('❌ Erreur lors de la configuration:', error);
  } finally {
    rl.close();
  }
}

function question(query) {
  return new Promise(resolve => {
    rl.question(query, answer => {
      resolve(answer);
    });
  });
}

function generateSecret() {
  const crypto = require('crypto');
  return crypto.randomBytes(32).toString('base64');
}

setupDeployment();