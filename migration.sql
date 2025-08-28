-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."TypeProgrammeLycee" AS ENUM ('ACCUEIL', 'PRESENTATION', 'VISITE', 'ATELIER', 'RENCONTRE', 'REPAS', 'DEMONSTRATION', 'FORUM', 'INFORMATION', 'CLOTURE');

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "public"."TypeLycee" AS ENUM ('PUBLIC', 'PRIVE');

-- CreateEnum
CREATE TYPE "public"."StatutPaiement" AS ENUM ('PAYE', 'EN_ATTENTE');

-- CreateEnum
CREATE TYPE "public"."MediaType" AS ENUM ('PHOTO', 'VIDEO', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "public"."TypePartenaire" AS ENUM ('ORGANISATEUR', 'PARTENAIRE', 'SPONSOR', 'MEDIA', 'INSTITUTION');

-- CreateEnum
CREATE TYPE "public"."StatutPartenaire" AS ENUM ('ACTIF', 'INACTIF', 'EN_ATTENTE');

-- CreateEnum
CREATE TYPE "public"."StatutInscription" AS ENUM ('EN_ATTENTE', 'CONFIRMEE', 'ANNULEE');

-- CreateEnum
CREATE TYPE "public"."StatutContact" AS ENUM ('ACTIF', 'INACTIF', 'EN_ATTENTE');

-- CreateEnum
CREATE TYPE "public"."StatutEnvoi" AS ENUM ('EN_ATTENTE', 'ENVOYE', 'EN_ERREUR', 'ANNULE');

-- CreateEnum
CREATE TYPE "public"."StatutDestinataire" AS ENUM ('EN_ATTENTE', 'ENVOYE', 'OUVERT', 'REPONDU', 'ERREUR');

-- CreateEnum
CREATE TYPE "public"."TypeProgramme" AS ENUM ('PRESENTATION', 'ATELIER', 'TEMOIGNAGE', 'VISITE', 'DEMONSTRATION', 'ENTRETIEN', 'PARTENARIAT', 'CLOTURE');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."lycees" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "type" "public"."TypeLycee" NOT NULL DEFAULT 'PUBLIC',
    "description" TEXT,
    "logo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lycees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."exposants" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "domaine" TEXT NOT NULL,
    "logo" TEXT,
    "siteWeb" TEXT,
    "statutPaiement" "public"."StatutPaiement" NOT NULL DEFAULT 'EN_ATTENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exposants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."evenements" (
    "id" TEXT NOT NULL,
    "nom" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "dateDebut" TIMESTAMP(3),
    "dateFin" TIMESTAMP(3),
    "heureDebut" TEXT NOT NULL,
    "heureFin" TEXT NOT NULL,
    "ville" TEXT,
    "lyceeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evenements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."evenement_exposants" (
    "id" TEXT NOT NULL,
    "evenementId" TEXT NOT NULL,
    "exposantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evenement_exposants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."medias" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "fichier" TEXT NOT NULL,
    "type" "public"."MediaType" NOT NULL DEFAULT 'PHOTO',
    "categorie" TEXT,
    "evenementId" TEXT,
    "galerieId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."galeries" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "evenementId" TEXT NOT NULL,
    "maxImages" INTEGER NOT NULL DEFAULT 10,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "galeries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."compte_a_rebours" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "lieu" TEXT,
    "ville" TEXT,
    "dateCible" TIMESTAMP(3) NOT NULL,
    "dateDebut" TIMESTAMP(3),
    "dateFin" TIMESTAMP(3),
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "compte_a_rebours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contact_messages" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "lu" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."inscriptions" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "evenementId" TEXT NOT NULL,
    "typeParticipant" TEXT NOT NULL,
    "etablissement" TEXT,
    "niveau" TEXT,
    "branche" TEXT,
    "interets" TEXT,
    "message" TEXT,
    "statut" "public"."StatutInscription" NOT NULL DEFAULT 'EN_ATTENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."programme_exposants" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "heure" TEXT NOT NULL,
    "duree" TEXT NOT NULL,
    "lieu" TEXT NOT NULL,
    "type" "public"."TypeProgramme" NOT NULL DEFAULT 'PRESENTATION',
    "public" TEXT NOT NULL,
    "animateur" TEXT NOT NULL,
    "exposantId" TEXT NOT NULL,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "programme_exposants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."programme_lycees" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "heure" TEXT NOT NULL,
    "duree" TEXT NOT NULL,
    "lieu" TEXT NOT NULL,
    "type" "public"."TypeProgrammeLycee" NOT NULL DEFAULT 'PRESENTATION',
    "public" TEXT NOT NULL,
    "animateur" TEXT NOT NULL,
    "lyceeId" TEXT NOT NULL,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "programme_lycees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contact_exposants" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT,
    "fonction" TEXT,
    "entreprise" TEXT,
    "exposantId" TEXT,
    "statut" "public"."StatutContact" NOT NULL DEFAULT 'ACTIF',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_exposants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."convocations" (
    "id" TEXT NOT NULL,
    "sujet" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "dateEnvoi" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statutEnvoi" "public"."StatutEnvoi" NOT NULL DEFAULT 'EN_ATTENTE',
    "dateEnvoiReel" TIMESTAMP(3),
    "erreurEnvoi" TEXT,
    "evenementId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "convocations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."convocation_destinataires" (
    "id" TEXT NOT NULL,
    "convocationId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "statut" "public"."StatutDestinataire" NOT NULL DEFAULT 'EN_ATTENTE',
    "dateOuverture" TIMESTAMP(3),
    "dateReponse" TIMESTAMP(3),
    "reponse" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "convocation_destinataires_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."partenaires" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "type" "public"."TypePartenaire" NOT NULL DEFAULT 'ORGANISATEUR',
    "description" TEXT,
    "logo" TEXT,
    "siteWeb" TEXT,
    "email" TEXT,
    "telephone" TEXT,
    "adresse" TEXT,
    "ville" TEXT,
    "pays" TEXT,
    "statut" "public"."StatutPartenaire" NOT NULL DEFAULT 'ACTIF',
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partenaires_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_ContactExposantToConvocation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ContactExposantToConvocation_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "evenement_exposants_evenementId_exposantId_key" ON "public"."evenement_exposants"("evenementId", "exposantId");

-- CreateIndex
CREATE UNIQUE INDEX "galeries_evenementId_key" ON "public"."galeries"("evenementId");

-- CreateIndex
CREATE UNIQUE INDEX "contact_exposants_email_key" ON "public"."contact_exposants"("email");

-- CreateIndex
CREATE UNIQUE INDEX "convocation_destinataires_convocationId_contactId_key" ON "public"."convocation_destinataires"("convocationId", "contactId");

-- CreateIndex
CREATE INDEX "_ContactExposantToConvocation_B_index" ON "public"."_ContactExposantToConvocation"("B");

-- AddForeignKey
ALTER TABLE "public"."evenements" ADD CONSTRAINT "evenements_lyceeId_fkey" FOREIGN KEY ("lyceeId") REFERENCES "public"."lycees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."evenement_exposants" ADD CONSTRAINT "evenement_exposants_evenementId_fkey" FOREIGN KEY ("evenementId") REFERENCES "public"."evenements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."evenement_exposants" ADD CONSTRAINT "evenement_exposants_exposantId_fkey" FOREIGN KEY ("exposantId") REFERENCES "public"."exposants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."medias" ADD CONSTRAINT "medias_evenementId_fkey" FOREIGN KEY ("evenementId") REFERENCES "public"."evenements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."medias" ADD CONSTRAINT "medias_galerieId_fkey" FOREIGN KEY ("galerieId") REFERENCES "public"."galeries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."galeries" ADD CONSTRAINT "galeries_evenementId_fkey" FOREIGN KEY ("evenementId") REFERENCES "public"."evenements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inscriptions" ADD CONSTRAINT "inscriptions_evenementId_fkey" FOREIGN KEY ("evenementId") REFERENCES "public"."evenements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."programme_exposants" ADD CONSTRAINT "programme_exposants_exposantId_fkey" FOREIGN KEY ("exposantId") REFERENCES "public"."exposants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."programme_lycees" ADD CONSTRAINT "programme_lycees_lyceeId_fkey" FOREIGN KEY ("lyceeId") REFERENCES "public"."lycees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contact_exposants" ADD CONSTRAINT "contact_exposants_exposantId_fkey" FOREIGN KEY ("exposantId") REFERENCES "public"."exposants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."convocations" ADD CONSTRAINT "convocations_evenementId_fkey" FOREIGN KEY ("evenementId") REFERENCES "public"."evenements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."convocation_destinataires" ADD CONSTRAINT "convocation_destinataires_convocationId_fkey" FOREIGN KEY ("convocationId") REFERENCES "public"."convocations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."convocation_destinataires" ADD CONSTRAINT "convocation_destinataires_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "public"."contact_exposants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ContactExposantToConvocation" ADD CONSTRAINT "_ContactExposantToConvocation_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."contact_exposants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ContactExposantToConvocation" ADD CONSTRAINT "_ContactExposantToConvocation_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."convocations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

