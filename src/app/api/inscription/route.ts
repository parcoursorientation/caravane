import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface InscriptionFormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  evenementId: string;
  typeParticipant: string;
  etablissement: string;
  niveau: string;
  branche?: string;
  interets: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as InscriptionFormData;
    
    // Validation des données
    const { 
      nom, 
      prenom, 
      email, 
      telephone, 
      evenementId, 
      typeParticipant,
      etablissement,
      niveau,
      branche,
      interets,
      message
    } = body;
    
    // Validation des champs requis
    if (!nom || !prenom || !email || !telephone || !evenementId || !typeParticipant) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }
    
    // Validation de l'email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      );
    }
    
    // Validation du téléphone
    if (!/^[+]?[\d\s-]{10,}$/.test(telephone)) {
      return NextResponse.json(
        { error: 'Numéro de téléphone invalide' },
        { status: 400 }
      );
    }
    
    // Validation de la longueur des champs
    if (nom.trim().length < 2) {
      return NextResponse.json(
        { error: 'Le nom doit contenir au moins 2 caractères' },
        { status: 400 }
      );
    }
    
    if (prenom.trim().length < 2) {
      return NextResponse.json(
        { error: 'Le prénom doit contenir au moins 2 caractères' },
        { status: 400 }
      );
    }
    
    // Validation conditionnelle pour la branche si niveau est 2ème Bac
    if (niveau === '2eme-bac' && !branche) {
      return NextResponse.json(
        { error: 'La branche est obligatoire pour les étudiants de 2ème Bac' },
        { status: 400 }
      );
    }
    
    // Vérifier si l'événement existe
    const evenement = await db.evenement.findUnique({
      where: { id: evenementId }
    });
    
    if (!evenement) {
      return NextResponse.json(
        { error: 'Événement non trouvé' },
        { status: 404 }
      );
    }
    
    // Vérifier si l'utilisateur est déjà inscrit à cet événement
    const existingInscription = await db.inscription.findFirst({
      where: {
        email: email,
        evenementId: evenementId,
        statut: { in: ['EN_ATTENTE', 'CONFIRMEE'] }
      }
    });
    
    if (existingInscription) {
      return NextResponse.json(
        { error: 'Vous êtes déjà inscrit à cet événement' },
        { status: 400 }
      );
    }
    
    // Créer l'inscription dans la base de données
    const inscription = await db.inscription.create({
      data: {
        nom: nom.trim(),
        prenom: prenom.trim(),
        email: email.trim(),
        telephone: telephone.trim(),
        evenementId,
        typeParticipant,
        etablissement: etablissement?.trim() || null,
        niveau: niveau?.trim() || null,
        branche: branche?.trim() || null,
        interets: interets?.trim() || null,
        message: message?.trim() || null,
        statut: 'EN_ATTENTE'
      }
    });
    
    console.log('=== Nouvelle inscription aux portes ouvertes ===');
    console.log('ID:', inscription.id);
    console.log('Nom:', nom);
    console.log('Prénom:', prenom);
    console.log('Email:', email);
    console.log('Téléphone:', telephone);
    console.log('ID Événement:', evenementId);
    console.log('Type participant:', typeParticipant);
    console.log('Établissement:', etablissement || 'Non spécifié');
    console.log('Niveau:', niveau || 'Non spécifié');
    console.log('Branche:', branche || 'Non spécifié');
    console.log('Centres d intérêt:', interets || 'Non spécifié');
    console.log('Message:', message || 'Aucun message');
    console.log('Date:', new Date().toISOString());
    console.log('==========================================');
    
    // Simuler l'envoi d'un email de confirmation
    console.log('Email de confirmation envoyé à:', email);
    
    return NextResponse.json(
      { 
        message: 'Inscription enregistrée avec succès',
        data: {
          id: inscription.id,
          nom,
          prenom,
          email,
          evenementId,
          typeParticipant,
          statut: inscription.statut,
          dateInscription: inscription.createdAt
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Erreur lors du traitement de l\'inscription:', error);
    
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