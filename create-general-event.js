const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createGeneralEvent() {
  try {
    // Vérifier si l'événement "general" existe déjà
    const existingEvent = await prisma.evenement.findUnique({
      where: { id: 'general' }
    });

    if (existingEvent) {
      console.log('L\'événement "general" existe déjà');
      return;
    }

    // Créer un lycée par défaut s'il n'existe pas
    let defaultLycee = await prisma.lycee.findFirst();
    
    if (!defaultLycee) {
      defaultLycee = await prisma.lycee.create({
        data: {
          nom: 'Événements Généraux',
          adresse: 'Adresse par défaut',
          ville: 'Casablanca',
          telephone: '0000000000',
          email: 'general@example.com',
          statut: 'ACTIF'
        }
      });
      console.log('Lycée par défaut créé:', defaultLycee.id);
    }

    // Créer l'événement "general"
    const generalEvent = await prisma.evenement.create({
      data: {
        id: 'general',
        nom: 'Inscriptions Générales',
        date: new Date('2024-12-31'),
        dateDebut: new Date('2024-01-01'),
        dateFin: new Date('2024-12-31'),
        heureDebut: '09:00',
        heureFin: '17:00',
        ville: 'En ligne',
        lyceeId: defaultLycee.id
      }
    });

    console.log('Événement "general" créé avec succès:', generalEvent.id);
  } catch (error) {
    console.error('Erreur lors de la création de l\'événement général:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createGeneralEvent();