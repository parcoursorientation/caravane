import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

type Prog = {
  titre: string;
  description: string;
  heure: string;
  duree: string;
  lieu: string;
  type: string;
  public: string;
  animateur: string;
  ordre: number;
};

// ⚠️ Les clés du dictionnaire doivent correspondre EXACTEMENT aux noms créés par seed-exposants.ts
const programmesParExposant: Record<string, Prog[]> = {
  "École Supérieure d'Ingénierie de Tanger": [
    {
      titre: "Présentation de l'ESIT",
      description:
        "Découvrez la première école d'ingénieurs privée du Nord du Maroc et ses formations d'excellence",
      heure: "09:00",
      duree: "30 min",
      lieu: "Stand principal",
      type: "PRESENTATION",
      public: "Tous",
      animateur: "Directeur de l'école",
      ordre: 1,
    },
    {
      titre: "Atelier: Spécialités d'ingénierie",
      description:
        "Présentation détaillée des filières en informatique, génie civil et télécommunications",
      heure: "09:45",
      duree: "45 min",
      lieu: "Espace atelier",
      type: "ATELIER",
      public: "Élèves et parents",
      animateur: "Chefs de département",
      ordre: 2,
    },
    {
      titre: "Projets étudiants innovants",
      description:
        "Présentation des projets innovants réalisés par les étudiants",
      heure: "10:45",
      duree: "45 min",
      lieu: "Espace démonstration",
      type: "DEMONSTRATION",
      public: "Tous",
      animateur: "Étudiants et professeurs",
      ordre: 3,
    },
    {
      titre: "Témoignages de réussite",
      description: "Intervention d'anciens diplômés ayant réussi leur carrière",
      heure: "11:45",
      duree: "30 min",
      lieu: "Stand principal",
      type: "TEMOIGNAGE",
      public: "Tous",
      animateur: "Anciens diplômés",
      ordre: 4,
    },
    {
      titre: "Visite des laboratoires",
      description: "Découverte des laboratoires et équipements pédagogiques",
      heure: "12:30",
      duree: "45 min",
      lieu: "Départ du stand",
      type: "VISITE",
      public: "Tous",
      animateur: "Équipe technique",
      ordre: 5,
    },
    {
      titre: "Orientation personnalisée",
      description: "Sessions individuelles pour guider les futurs ingénieurs",
      heure: "13:30",
      duree: "2h",
      lieu: "Stand principal",
      type: "ENTRETIEN",
      public: "Tous",
      animateur: "Conseillers d'orientation",
      ordre: 6,
    },
    {
      titre: "Partenariats industriels",
      description: "Présentation des partenariats et opportunités",
      heure: "15:45",
      duree: "30 min",
      lieu: "Espace conférence",
      type: "PARTENARIAT",
      public: "Parents et élèves",
      animateur: "Responsable partenariats",
      ordre: 7,
    },
    {
      titre: "Cocktail de clôture",
      description: "Échanges avec l'équipe et les partenaires",
      heure: "16:30",
      duree: "1h",
      lieu: "Stand principal",
      type: "CLOTURE",
      public: "Tous",
      animateur: "Équipe complète",
      ordre: 8,
    },
  ],
  "Institut Technologique du Nord": [
    {
      titre: "Présentation de l'ITN",
      description:
        "Centre de formation professionnelle aux nouvelles technologies",
      heure: "09:00",
      duree: "30 min",
      lieu: "Stand principal",
      type: "PRESENTATION",
      public: "Tous",
      animateur: "Directeur de l'institut",
      ordre: 1,
    },
    {
      titre: "Atelier: Les métiers du numérique",
      description: "Développement web, cybersécurité, IA, réseaux",
      heure: "09:45",
      duree: "45 min",
      lieu: "Espace atelier",
      type: "ATELIER",
      public: "Élèves et parents",
      animateur: "Formateurs spécialisés",
      ordre: 2,
    },
    {
      titre: "Démonstration live",
      description: "Programmation, création de sites, projets tech",
      heure: "10:45",
      duree: "1h",
      lieu: "Espace démonstration",
      type: "DEMONSTRATION",
      public: "Tous",
      animateur: "Étudiants et formateurs",
      ordre: 3,
    },
    {
      titre: "Témoignages de professionnels",
      description: "Opportunités de carrière tech",
      heure: "12:00",
      duree: "45 min",
      lieu: "Espace conférence",
      type: "TEMOIGNAGE",
      public: "Tous",
      animateur: "Partenaires entreprises",
      ordre: 4,
    },
    {
      titre: "Visite des installations",
      description: "Salles informatiques et infrastructures",
      heure: "13:00",
      duree: "30 min",
      lieu: "Départ du stand",
      type: "VISITE",
      public: "Tous",
      animateur: "Équipe technique",
      ordre: 5,
    },
    {
      titre: "Conseils d'orientation",
      description: "Sessions individuelles d'orientation",
      heure: "13:45",
      duree: "2h",
      lieu: "Stand principal",
      type: "ENTRETIEN",
      public: "Tous",
      animateur: "Conseillers",
      ordre: 6,
    },
    {
      titre: "Partenariats et certifications",
      description: "Certifications reconnues, partenariats",
      heure: "16:00",
      duree: "30 min",
      lieu: "Espace conférence",
      type: "PARTENARIAT",
      public: "Parents et élèves",
      animateur: "Responsable partenariats",
      ordre: 7,
    },
    {
      titre: "Cocktail de clôture",
      description: "Échanges et opportunités de formation",
      heure: "16:45",
      duree: "45 min",
      lieu: "Stand principal",
      type: "CLOTURE",
      public: "Tous",
      animateur: "Équipe complète",
      ordre: 8,
    },
  ],
  "Institut de Commerce International": [
    {
      titre: "Présentation de l'ICI",
      description: "Établissement de référence en commerce et gestion",
      heure: "09:00",
      duree: "30 min",
      lieu: "Stand principal",
      type: "PRESENTATION",
      public: "Tous",
      animateur: "Directeur de l'institut",
      ordre: 1,
    },
    {
      titre: "Atelier: Métiers du commerce",
      description: "Marketing, finance, commerce international, gestion",
      heure: "09:45",
      duree: "45 min",
      lieu: "Espace atelier",
      type: "ATELIER",
      public: "Élèves et parents",
      animateur: "Professeurs spécialisés",
      ordre: 2,
    },
    {
      titre: "Témoignages d'anciens",
      description: "Parcours dans le monde des affaires",
      heure: "10:45",
      duree: "30 min",
      lieu: "Stand principal",
      type: "TEMOIGNAGE",
      public: "Tous",
      animateur: "Anciens diplômés",
      ordre: 3,
    },
    {
      titre: "Simulation de négociation",
      description: "Atelier pratique",
      heure: "11:30",
      duree: "1h",
      lieu: "Espace démonstration",
      type: "DEMONSTRATION",
      public: "Tous",
      animateur: "Professeurs et étudiants",
      ordre: 4,
    },
    {
      titre: "Visite des installations",
      description: "Salles de cours, espaces de travail",
      heure: "12:45",
      duree: "30 min",
      lieu: "Départ du stand",
      type: "VISITE",
      public: "Tous",
      animateur: "Équipe administrative",
      ordre: 5,
    },
    {
      titre: "Conseils en carrière",
      description: "Orientation pro",
      heure: "13:30",
      duree: "2h",
      lieu: "Stand principal",
      type: "ENTRETIEN",
      public: "Tous",
      animateur: "Conseillers",
      ordre: 6,
    },
    {
      titre: "Partenariats entreprises",
      description: "Stages et partenariats",
      heure: "15:45",
      duree: "30 min",
      lieu: "Espace conférence",
      type: "PARTENARIAT",
      public: "Parents et élèves",
      animateur: "Responsable des stages",
      ordre: 7,
    },
    {
      titre: "Réseau de clôture",
      description: "Cocktail networking",
      heure: "16:30",
      duree: "1h",
      lieu: "Stand principal",
      type: "CLOTURE",
      public: "Tous",
      animateur: "Équipe complète",
      ordre: 8,
    },
  ],
  "École des Beaux-Arts de Tanger": [
    {
      titre: "Présentation de l'EBAT",
      description: "Institution dédiée aux formations artistiques",
      heure: "09:00",
      duree: "30 min",
      lieu: "Stand principal",
      type: "PRESENTATION",
      public: "Tous",
      animateur: "Directeur de l'école",
      ordre: 1,
    },
    {
      titre: "Atelier: Disciplines artistiques",
      description:
        "Design graphique, architecture d'intérieur, arts plastiques",
      heure: "09:45",
      duree: "45 min",
      lieu: "Espace atelier",
      type: "ATELIER",
      public: "Élèves et parents",
      animateur: "Professeurs d'art",
      ordre: 2,
    },
    {
      titre: "Démonstration en direct",
      description: "Ateliers pratiques",
      heure: "10:45",
      duree: "1h",
      lieu: "Espace démonstration",
      type: "DEMONSTRATION",
      public: "Tous",
      animateur: "Étudiants et professeurs",
      ordre: 3,
    },
    {
      titre: "Exposition des œuvres",
      description: "Réalisations des étudiants",
      heure: "12:00",
      duree: "1h",
      lieu: "Espace exposition",
      type: "TEMOIGNAGE",
      public: "Tous",
      animateur: "Étudiants",
      ordre: 4,
    },
    {
      titre: "Visite des ateliers",
      description: "Découverte des ateliers et espaces d'expo",
      heure: "13:15",
      duree: "45 min",
      lieu: "Départ du stand",
      type: "VISITE",
      public: "Tous",
      animateur: "Équipe pédagogique",
      ordre: 5,
    },
    {
      titre: "Orientation artistique",
      description: "Sessions individuelles",
      heure: "14:15",
      duree: "2h",
      lieu: "Stand principal",
      type: "ENTRETIEN",
      public: "Tous",
      animateur: "Conseillers",
      ordre: 6,
    },
    {
      titre: "Partenariats culturels",
      description: "Institutions culturelles et galeries",
      heure: "16:30",
      duree: "30 min",
      lieu: "Espace conférence",
      type: "PARTENARIAT",
      public: "Parents et élèves",
      animateur: "Responsable culturel",
      ordre: 7,
    },
    {
      titre: "Vernissage de clôture",
      description: "Cocktail artistique",
      heure: "17:15",
      duree: "45 min",
      lieu: "Stand principal",
      type: "CLOTURE",
      public: "Tous",
      animateur: "Équipe complète",
      ordre: 8,
    },
  ],
};

async function main() {
  console.log("🌱 Début de l'insertion des programmes des exposants...");

  for (const [nomExposant, programmes] of Object.entries(
    programmesParExposant
  )) {
    const exposant = await prisma.exposant.findFirst({
      where: { nom: nomExposant },
    });

    if (!exposant) {
      console.warn(`❌ Exposant non trouvé par nom: ${nomExposant}`);
      continue;
    }

    console.log(
      `📝 Insertion des programmes pour ${nomExposant} (${exposant.id})...`
    );

    // Optionnel : supprimer les anciens programmes pour éviter les doublons
    await prisma.programmeExposant.deleteMany({
      where: { exposantId: exposant.id },
    });

    // Insertion en masse
    await prisma.programmeExposant.createMany({
      data: programmes.map((p) => ({ ...p, exposantId: exposant.id })),
      skipDuplicates: true,
    });

    console.log(`  ✅ ${programmes.length} programmes ajoutés`);
  }

  console.log("🎉 Insertion des programmes terminée avec succès!");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors de l'insertion:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
