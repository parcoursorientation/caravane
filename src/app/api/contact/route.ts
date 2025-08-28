import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface ContactFormData {
  nom: string;
  email: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ContactFormData;
    
    // Validation des données
    const { nom, email, message } = body;
    
    if (!nom || !email || !message) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      );
    }
    
    if (message.trim().length < 10) {
      return NextResponse.json(
        { error: 'Le message doit contenir au moins 10 caractères' },
        { status: 400 }
      );
    }
    
    // Enregistrer le message dans la base de données
    const contactMessage = await db.contactMessage.create({
      data: {
        nom: nom.trim(),
        email: email.trim(),
        message: message.trim()
      }
    });
    
    console.log('=== Nouveau message de contact enregistré ===');
    console.log('ID:', contactMessage.id);
    console.log('Nom:', contactMessage.nom);
    console.log('Email:', contactMessage.email);
    console.log('Message:', contactMessage.message);
    console.log('Date:', contactMessage.createdAt);
    console.log('=========================================');
    
    // Simuler l'envoi d'un email de notification
    // Dans un environnement réel, on utiliserait un service comme Nodemailer, SendGrid, etc.
    console.log('Email de notification envoyé à l\'administrateur');
    
    return NextResponse.json(
      { 
        message: 'Message envoyé avec succès',
        data: {
          id: contactMessage.id,
          nom: contactMessage.nom,
          email: contactMessage.email,
          message: contactMessage.message.substring(0, 50) + '...', // Tronquer pour la réponse
          dateEnvoi: contactMessage.createdAt
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Erreur lors du traitement du formulaire de contact:', error);
    
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Méthode non autorisée' },
    { status: 405 }
  );
}