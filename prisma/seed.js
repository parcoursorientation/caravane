const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function main() {
  console.log('Début du seeding de la base de données...');

  // Création des utilisateurs
  console.log('Création des utilisateurs...');
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      id: uuidv4(),
      email: 'admin@example.com',
      name: 'Administrateur',
      password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      role: 'ADMIN',
    },
  });

  // Création des lycées
  console.log('Création des lycées...');
  const lycee1 = await prisma.lycee.upsert({
    where: { id: 'lycee-1' },
    update: {},
    create: {
      id: 'lycee-1',
      nom: 'Lycée Polyvalent de Paris',
      adresse: '123 Rue de l\'Éducation, 75001 Paris',
      type: 'PUBLIC',
      description: 'Un lycée d\'excellence préparant les étudiants aux meilleures grandes écoles',
    },
  });

  const lycee2 = await prisma.lycee.upsert({
    where: { id: 'lycee-2' },
    update: {},
    create: {
      id: 'lycee-2',
      nom: 'Lycée Ibn Khaldoun',
      adresse: '45 Avenue des Savoirs, 75002 Paris',
      type: 'PUBLIC',
      description: 'Lycée spécialisé dans les sciences et technologies',
    },
  });

  const lycee3 = await prisma.lycee.upsert({
    where: { id: 'lycee-3' },
    update: {},
    create: {
      id: 'lycee-3',
      nom: 'Lycée Privé Al Amal',
      adresse: '78 Boulevard de l\'Espoir, 75003 Paris',
      type: 'PRIVE',
      description: 'Établissement d\'excellence avec approche pédagogique innovante',
    },
  });

  const lycee4 = await prisma.lycee.upsert({
    where: { id: 'lycee-4' },
    update: {},
    create: {
      id: 'lycee-4',
      nom: 'Lycée Ibn Battouta',
      adresse: '156 Route de la Découverte, 75004 Paris',
      type: 'PUBLIC',
      description: 'Lycée tourné vers l\'international et les langues étrangères',
    },
  });

  const lycee5 = await prisma.lycee.upsert({
    where: { id: 'lycee-5' },
    update: {},
    create: {
      id: 'lycee-5',
      nom: 'Lycée Alamana',
      adresse: '234 Rue de la Culture, 75005 Paris',
      type: 'PRIVE',
      description: 'Lycée spécialisé dans les arts et la culture',
    },
  });

  const lycee6 = await prisma.lycee.upsert({
    where: { id: 'lycee-6' },
    update: {},
    create: {
      id: 'lycee-6',
      nom: 'Lycée Sidi Driss',
      adresse: '567 Avenue du Progrès, 75006 Paris',
      type: 'PUBLIC',
      description: 'Lycée technologique avec équipements de pointe',
    },
  });

  const allLycees = [lycee1, lycee2, lycee3, lycee4, lycee5, lycee6];

  // Création des exposants
  console.log('Création des exposants...');
  const exposants = [
    {
      id: 'exposant-1',
      nom: 'École d\'Ingénieurs ParisTech',
      description: 'Formation d\'excellence en ingénierie avec spécialisations en IA, robotique et énergies durables. Notre école propose des programmes innovants et des laboratoires de recherche de pointe.',
      domaine: 'Ingénierie et Technologie',
      logo: '/logos/ecole-ingenieurs.png',
      siteWeb: 'https://paristech.edu',
    },
    {
      id: 'exposant-2',
      nom: 'Institut Technologique Supérieur',
      description: 'Programmes techniques avancés en informatique, réseaux et cybersécurité. Formez-vous aux métiers d\'avenir du numérique avec nos experts et nos équipements de dernière génération.',
      domaine: 'Technologies Numériques',
      logo: '/logos/institut-technologique.png',
      siteWeb: 'https://its-techno.edu',
    },
    {
      id: 'exposant-3',
      nom: 'École de Commerce Internationale',
      description: 'Formation aux métiers du commerce, du marketing et de la gestion internationale. Développez votre potentiel entrepreneurial dans un environnement mondialisé.',
      domaine: 'Commerce et Management',
      logo: '/logos/ecole-commerce.png',
      siteWeb: 'https://ecom-international.edu',
    },
    {
      id: 'exposant-4',
      nom: 'École Supérieure des Arts',
      description: 'Formation artistique complète en design graphique, arts visuels et multimédia. Exprimez votre créativité dans un cadre inspirant avec des professionnels reconnus.',
      domaine: 'Arts et Design',
      logo: '/logos/ecole-arts.png',
      siteWeb: 'https://arts-superieur.edu',
    },
    {
      id: 'exposant-5',
      nom: 'Institut des Sciences de la Santé',
      description: 'Programmes spécialisés en médecine, biologie et sciences de la santé. Préparez-vous aux carrières médicales et paramédicales avec nos installations modernes.',
      domaine: 'Santé et Sciences',
      logo: '/logos/institut-sante.png',
      siteWeb: 'https://sante-institut.edu',
    },
  ];

  for (const exposantData of exposants) {
    await prisma.exposant.upsert({
      where: { id: exposantData.id },
      update: {},
      create: exposantData,
    });
  }

  // Création des programmes pour chaque exposant
  console.log('Création des programmes...');

  // Programmes pour l'École d'Ingénieurs ParisTech
  const programmesExposant1 = [
    {
      titre: 'Présentation générale de l\'école',
      description: 'Découvrez notre établissement, nos valeurs et nos programmes de formation. Présentation des laboratoires de recherche et des partenariats industriels.',
      heure: '09:00',
      duree: '45 min',
      lieu: 'Amphi A',
      type: 'PRESENTATION',
      public: 'Tous publics',
      animateur: 'Prof. Jean Dupont, Directeur',
      ordre: 1,
    },
    {
      titre: 'Atelier d\'initiation à la robotique',
      description: 'Manipulez nos robots et découvrez les bases de la programmation robotique. Atelier pratique avec nos robots éducatifs.',
      heure: '10:00',
      duree: '1h',
      lieu: 'Labo Robotique',
      type: 'ATELIER',
      public: 'Étudiants intéressés par la robotique',
      animateur: 'Dr. Marie Martin, Responsable Labo',
      ordre: 2,
    },
    {
      titre: 'Témoignage d\'anciens élèves',
      description: 'Nos diplômés partagent leur expérience et leur parcours professionnel dans l\'ingénierie. Session interactive avec questions-réponses.',
      heure: '11:15',
      duree: '45 min',
      lieu: 'Salle de Conférence',
      type: 'TEMOIGNAGE',
      public: 'Futurs étudiants et parents',
      animateur: 'Anciens diplômés',
      ordre: 3,
    },
    {
      titre: 'Visite des laboratoires',
      description: 'Visite guidée de nos installations de pointe : labo d\'IA, centre de robotique et installations énergétiques.',
      heure: '12:15',
      duree: '1h',
      lieu: 'Laboratoires',
      type: 'VISITE',
      public: 'Groupes de 10 personnes maximum',
      animateur: 'Équipe technique',
      ordre: 4,
    },
    {
      titre: 'Démonstration de projets étudiants',
      description: 'Présentation des projets innovants réalisés par nos étudiants : drones autonomes, systèmes intelligents et applications IoT.',
      heure: '14:00',
      duree: '1h',
      lieu: 'Espace Exposition',
      type: 'DEMONSTRATION',
      public: 'Tous publics',
      animateur: 'Étudiants en projet',
      ordre: 5,
    },
    {
      titre: 'Entretiens individuels',
      description: 'Sessions personnalisées pour discuter de votre projet d\'études et répondre à vos questions sur nos formations.',
      heure: '15:15',
      duree: '30 min',
      lieu: 'Salles de réunion',
      type: 'ENTRETIEN',
      public: 'Sur rendez-vous',
      animateur: 'Conseillers d\'orientation',
      ordre: 6,
    },
    {
      titre: 'Partenariats industriels',
      description: 'Présentation de nos collaborations avec les entreprises leaders de l\'industrie et opportunités de stages et d\'emplois.',
      heure: '16:00',
      duree: '45 min',
      lieu: 'Amphi B',
      type: 'PARTENARIAT',
      public: 'Représentants d\'entreprises',
      animateur: 'Dr. Pierre Bernard, Relations Industrielles',
      ordre: 7,
    },
    {
      titre: 'Session de clôture',
      description: 'Bilan de la journée, remise de documentation et informations sur les procédures d\'admission.',
      heure: '17:00',
      duree: '30 min',
      lieu: 'Amphi A',
      type: 'CLOTURE',
      public: 'Tous les participants',
      animateur: 'Prof. Jean Dupont, Directeur',
      ordre: 8,
    },
  ];

  // Programmes pour l'Institut Technologique Supérieur
  const programmesExposant2 = [
    {
      titre: 'Introduction aux technologies numériques',
      description: 'Présentation des filières informatiques, réseaux et cybersécurité. Découvrez les métiers d\'avenir du numérique.',
      heure: '09:00',
      duree: '45 min',
      lieu: 'Amphi Tech',
      type: 'PRESENTATION',
      public: 'Tous publics',
      animateur: 'Dr. Sophie Laurent, Directrice',
      ordre: 1,
    },
    {
      titre: 'Atelier de programmation web',
      description: 'Initiation pratique au développement web avec HTML, CSS et JavaScript. Créez votre première page web.',
      heure: '10:00',
      duree: '1h30',
      lieu: 'Salle Informatique',
      type: 'ATELIER',
      public: 'Débutants en programmation',
      animateur: 'M. Thomas Dubois, Formateur',
      ordre: 2,
    },
    {
      titre: 'Carrières dans le numérique',
      description: 'Témoignages de professionnels du secteur sur les opportunités et les évolutions de carrière dans le numérique.',
      heure: '11:45',
      duree: '45 min',
      lieu: 'Salle de Conférence',
      type: 'TEMOIGNAGE',
      public: 'Étudiants et parents',
      animateur: 'Professionnels du secteur',
      ordre: 3,
    },
    {
      titre: 'Visite du campus numérique',
      description: 'Découvrez nos salles informatiques, notre data center et nos équipements de réalité virtuelle.',
      heure: '12:45',
      duree: '45 min',
      lieu: 'Campus Numérique',
      type: 'VISITE',
      public: 'Groupes organisés',
      animateur: 'Équipe technique',
      ordre: 4,
    },
    {
      titre: 'Démonstration de cybersécurité',
      description: 'Présentation des techniques de hacking éthique et des méthodes de protection des systèmes informatiques.',
      heure: '14:00',
      duree: '1h',
      lieu: 'Labo Sécurité',
      type: 'DEMONSTRATION',
      public: 'Public averti',
      animateur: 'Dr. Michel Rousseau, Expert Cybersécurité',
      ordre: 5,
    },
    {
      titre: 'Conseils d\'orientation personnalisés',
      description: 'Sessions individuelles pour vous aider à choisir la formation la plus adaptée à votre profil et vos objectifs.',
      heure: '15:15',
      duree: '30 min',
      lieu: 'Bureau d\'orientation',
      type: 'ENTRETIEN',
      public: 'Sur rendez-vous',
      animateur: 'Conseillers d\'orientation',
      ordre: 6,
    },
    {
      titre: 'Partenariats avec les entreprises tech',
      description: 'Présentation de nos collaborations avec les startups et les grands groupes du numérique.',
      heure: '16:00',
      duree: '45 min',
      lieu: 'Espace Partenaires',
      type: 'PARTENARIAT',
      public: 'Représentants d\'entreprises',
      animateur: 'Mme Claire Petit, Relations Entreprises',
      ordre: 7,
    },
    {
      titre: 'Clôture et informations pratiques',
      description: 'Synthèse de la journée, présentation des modalités d\'inscription et distribution de documentation.',
      heure: '17:00',
      duree: '30 min',
      lieu: 'Amphi Tech',
      type: 'CLOTURE',
      public: 'Tous les participants',
      animateur: 'Dr. Sophie Laurent, Directrice',
      ordre: 8,
    },
  ];

  // Programmes pour l'École de Commerce Internationale
  const programmesExposant3 = [
    {
      titre: 'Présentation des programmes commerciaux',
      description: 'Découvrez nos formations en commerce, marketing et gestion internationale. Présentation des débouchés professionnels.',
      heure: '09:00',
      duree: '45 min',
      lieu: 'Amphi Commerce',
      type: 'PRESENTATION',
      public: 'Tous publics',
      animateur: 'Dr. Bernard Moreau, Directeur',
      ordre: 1,
    },
    {
      titre: 'Atelier de marketing digital',
      description: 'Apprenez les bases du marketing digital : réseaux sociaux, SEO, email marketing. Créez votre première campagne.',
      heure: '10:00',
      duree: '1h30',
      lieu: 'Salle Marketing',
      type: 'ATELIER',
      public: 'Intéressés par le marketing',
      animateur: 'Mme Isabelle Martin, Consultante',
      ordre: 2,
    },
    {
      titre: 'Expériences internationales',
      description: 'Témoignages d\'anciens étudiants sur leurs expériences à l\'étranger et leurs carrières internationales.',
      heure: '11:45',
      duree: '45 min',
      lieu: 'Salle de Conférence',
      type: 'TEMOIGNAGE',
      public: 'Étudiants et parents',
      animateur: 'Anciens diplômés',
      ordre: 3,
    },
    {
      titre: 'Visite des installations',
      description: 'Découvrez nos salles de cours, notre centre de langues et notre bibliothèque spécialisée en commerce.',
      heure: '12:45',
      duree: '45 min',
      lieu: 'Campus Commercial',
      type: 'VISITE',
      public: 'Groupes organisés',
      animateur: 'Équipe administrative',
      ordre: 4,
    },
    {
      titre: 'Démonstration de trading',
      description: 'Initiation aux marchés financiers avec notre simulateur de trading. Découvrez les bases de l\'investissement.',
      heure: '14:00',
      duree: '1h',
      lieu: 'Salle de Trading',
      type: 'DEMONSTRATION',
      public: 'Public intéressé par la finance',
      animateur: 'Dr. Philippe Leroy, Expert Finance',
      ordre: 5,
    },
    {
      titre: 'Entretiens de carrière',
      description: 'Sessions individuelles pour discuter de votre projet professionnel et des opportunités dans le commerce.',
      heure: '15:15',
      duree: '30 min',
      lieu: 'Salles de réunion',
      type: 'ENTRETIEN',
      public: 'Sur rendez-vous',
      animateur: 'Conseillers en carrière',
      ordre: 6,
    },
    {
      titre: 'Réseau de partenaires internationaux',
      description: 'Présentation de nos universités partenaires et des opportunités d\'échanges académiques à l\'étranger.',
      heure: '16:00',
      duree: '45 min',
      lieu: 'Espace International',
      type: 'PARTENARIAT',
      public: 'Étudiants internationaux',
      animateur: 'Mme Sophie Bernard, Relations Internationales',
      ordre: 7,
    },
    {
      titre: 'Session de clôture',
      description: 'Bilan de la journée, informations sur les admissions et remise de documentation.',
      heure: '17:00',
      duree: '30 min',
      lieu: 'Amphi Commerce',
      type: 'CLOTURE',
      public: 'Tous les participants',
      animateur: 'Dr. Bernard Moreau, Directeur',
      ordre: 8,
    },
  ];

  // Programmes pour l'École Supérieure des Arts
  const programmesExposant4 = [
    {
      titre: 'Présentation des formations artistiques',
      description: 'Découvrez nos programmes en design graphique, arts visuels et multimédia. Présentation des débouchés créatifs.',
      heure: '09:00',
      duree: '45 min',
      lieu: 'Amphi Arts',
      type: 'PRESENTATION',
      public: 'Tous publics',
      animateur: 'Mme Catherine Dubois, Directrice',
      ordre: 1,
    },
    {
      titre: 'Atelier de dessin numérique',
      description: 'Initiation au dessin sur tablette graphique. Découvrez les techniques de base et créez votre première œuvre numérique.',
      heure: '10:00',
      duree: '1h30',
      lieu: 'Atelier Numérique',
      type: 'ATELIER',
      public: 'Débutants en arts numériques',
      animateur: 'M. Pierre Martin, Artiste numérique',
      ordre: 2,
    },
    {
      titre: 'Parcours d\'artistes professionnels',
      description: 'Témoignages d\'anciens élèves sur leurs carrières dans le design, l\'illustration et les arts multimédias.',
      heure: '11:45',
      duree: '45 min',
      lieu: 'Galerie d\'Art',
      type: 'TEMOIGNAGE',
      public: 'Futurs artistes et créatifs',
      animateur: 'Anciens diplômés',
      ordre: 3,
    },
    {
      titre: 'Visite des ateliers créatifs',
      description: 'Découvrez nos espaces de création : ateliers de peinture, studio photo, labo multimédia et salle d\'exposition.',
      heure: '12:45',
      duree: '45 min',
      lieu: 'Ateliers Créatifs',
      type: 'VISITE',
      public: 'Groupes organisés',
      animateur: 'Équipe technique',
      ordre: 4,
    },
    {
      titre: 'Démonstration de motion design',
      description: 'Présentation des techniques d\'animation et de création de vidéos. Découvrez les logiciels professionnels.',
      heure: '14:00',
      duree: '1h',
      lieu: 'Studio Multimédia',
      type: 'DEMONSTRATION',
      public: 'Intéressés par l\'animation',
      animateur: 'Dr. Laurent Bernard, Motion Designer',
      ordre: 5,
    },
    {
      titre: 'Conseils en portfolio',
      description: 'Sessions individuelles pour vous aider à constituer votre portfolio artistique et présenter vos créations.',
      heure: '15:15',
      duree: '30 min',
      lieu: 'Salle de Portfolio',
      type: 'ENTRETIEN',
      public: 'Sur rendez-vous',
      animateur: 'Professionnels de l\'art',
      ordre: 6,
    },
    {
      titre: 'Partenariats avec les agences créatives',
      description: 'Présentation de nos collaborations avec les agences de design, les studios et les maisons d\'édition.',
      heure: '16:00',
      duree: '45 min',
      lieu: 'Espace Partenaires',
      type: 'PARTENARIAT',
      public: 'Professionnels du secteur',
      animateur: 'Mme Sophie Laurent, Relations Culturelles',
      ordre: 7,
    },
    {
      titre: 'Clôture artistique',
      description: 'Exposition des travaux des étudiants et remise des prix du concours créatif de la journée.',
      heure: '17:00',
      duree: '30 min',
      lieu: 'Galerie d\'Art',
      type: 'CLOTURE',
      public: 'Tous les participants',
      animateur: 'Mme Catherine Dubois, Directrice',
      ordre: 8,
    },
  ];

  // Programmes pour l'Institut des Sciences de la Santé
  const programmesExposant5 = [
    {
      titre: 'Présentation des formations médicales',
      description: 'Découvrez nos programmes en médecine, biologie et sciences de la santé. Présentation des débouchés professionnels.',
      heure: '09:00',
      duree: '45 min',
      lieu: 'Amphi Santé',
      type: 'PRESENTATION',
      public: 'Tous publics',
      animateur: 'Dr. Martin Bernard, Directeur',
      ordre: 1,
    },
    {
      titre: 'Atelier de premiers secours',
      description: 'Apprenez les gestes qui sauvent : réanimation cardio-pulmonaire, position latérale de sécurité et utilisation du DAE.',
      heure: '10:00',
      duree: '1h30',
      lieu: 'Labo de Simulation',
      type: 'ATELIER',
      public: 'Tous publics',
      animateur: 'Dr. Sophie Martin, Urgentiste',
      ordre: 2,
    },
    {
      titre: 'Carrières dans la santé',
      description: 'Témoignages de professionnels sur les différents métiers de la santé et leurs expériences quotidiennes.',
      heure: '11:45',
      duree: '45 min',
      lieu: 'Salle de Conférence',
      type: 'TEMOIGNAGE',
      public: 'Futurs professionnels de santé',
      animateur: 'Professionnels de santé',
      ordre: 3,
    },
    {
      titre: 'Visite des installations médicales',
      description: 'Découvrez nos laboratoires de biologie, salles de simulation et équipements médicaux de pointe.',
      heure: '12:45',
      duree: '45 min',
      lieu: 'Campus Médical',
      type: 'VISITE',
      public: 'Groupes organisés',
      animateur: 'Équipe technique',
      ordre: 4,
    },
    {
      titre: 'Démonstration de dissection virtuelle',
      description: 'Présentation de notre table de dissection virtuelle et exploration interactive du corps humain en 3D.',
      heure: '14:00',
      duree: '1h',
      lieu: 'Labo d\'Anatomie',
      type: 'DEMONSTRATION',
      public: 'Public intéressé par la médecine',
      animateur: 'Dr. Pierre Dubois, Anatomiste',
      ordre: 5,
    },
    {
      titre: 'Conseils d\'orientation médicale',
      description: 'Sessions individuelles pour vous guider dans votre projet d\'études médicales et paramédicales.',
      heure: '15:15',
      duree: '30 min',
      lieu: 'Bureau d\'orientation',
      type: 'ENTRETIEN',
      public: 'Sur rendez-vous',
      animateur: 'Conseillers d\'orientation',
      ordre: 6,
    },
    {
      titre: 'Partenariats hospitaliers',
      description: 'Présentation de nos collaborations avec les hôpitaux et cliniques pour les stages et les opportunités d\'emploi.',
      heure: '16:00',
      duree: '45 min',
      lieu: 'Espace Partenaires',
      type: 'PARTENARIAT',
      public: 'Représentants hospitaliers',
      animateur: 'Dr. Isabelle Laurent, Relations Hospitalières',
      ordre: 7,
    },
    {
      titre: 'Session de clôture',
      description: 'Synthèse de la journée, informations sur les concours médicaux et remise de documentation.',
      heure: '17:00',
      duree: '30 min',
      lieu: 'Amphi Santé',
      type: 'CLOTURE',
      public: 'Tous les participants',
      animateur: 'Dr. Martin Bernard, Directeur',
      ordre: 8,
    },
  ];

  // Insertion des programmes dans la base de données
  const allProgrammes = [
    ...programmesExposant1.map(p => ({ ...p, exposantId: 'exposant-1' })),
    ...programmesExposant2.map(p => ({ ...p, exposantId: 'exposant-2' })),
    ...programmesExposant3.map(p => ({ ...p, exposantId: 'exposant-3' })),
    ...programmesExposant4.map(p => ({ ...p, exposantId: 'exposant-4' })),
    ...programmesExposant5.map(p => ({ ...p, exposantId: 'exposant-5' })),
  ];

  for (const programmeData of allProgrammes) {
    await prisma.programmeExposant.create({
      data: programmeData,
    });
  }

  // Création d'un événement
  console.log('Création d\'un événement...');
  const evenement = await prisma.evenement.upsert({
    where: { id: 'evenement-1' },
    update: {},
    create: {
      id: 'evenement-1',
      nom: 'Salon de l\'Orientation 2024',
      date: new Date('2024-03-15T09:00:00Z'),
      dateDebut: new Date('2024-03-15T09:00:00Z'),
      dateFin: new Date('2024-03-15T17:00:00Z'),
      heureDebut: '09:00',
      heureFin: '17:00',
      ville: 'Paris',
      lyceeId: lycee1.id,
    },
  });

  // Association des exposants à l'événement
  console.log('Association des exposants à l\'événement...');
  for (const exposant of exposants) {
    await prisma.evenementExposant.upsert({
      where: {
        evenementId_exposantId: {
          evenementId: evenement.id,
          exposantId: exposant.id,
        },
      },
      update: {},
      create: {
        evenementId: evenement.id,
        exposantId: exposant.id,
      },
    });
  }

  // Création des partenaires
  console.log('Création des partenaires...');
  const partenaires = [
    {
      id: 'partenaire-1',
      nom: 'Ministère de l\'Éducation Nationale',
      type: 'ORGANISATEUR',
      description: 'Partenaire institutionnel principal du salon',
      logo: '/logos/ministere-education.png',
      email: 'contact@education.gouv.fr',
      ordre: 1,
    },
    {
      id: 'partenaire-2',
      nom: 'Région Île-de-France',
      type: 'PARTENAIRE',
      description: 'Soutien régional pour l\'éducation et la formation',
      logo: '/logos/region-idf.png',
      email: 'contact@iledefrance.fr',
      ordre: 2,
    },
    {
      id: 'partenaire-3',
      nom: 'Chambre de Commerce et d\'Industrie',
      type: 'SPONSOR',
      description: 'Partenaire privilégié pour les formations commerciales',
      logo: '/logos/cci.png',
      email: 'contact@cci-paris.fr',
      ordre: 3,
    },
  ];

  for (const partenaireData of partenaires) {
    await prisma.partenaire.upsert({
      where: { id: partenaireData.id },
      update: {},
      create: partenaireData,
    });
  }

  // Création d'une galerie pour l'événement
  console.log('Création d\'une galerie...');
  const galerie = await prisma.galerie.upsert({
    where: { id: 'galerie-1' },
    update: {},
    create: {
      id: 'galerie-1',
      titre: 'Galerie du Salon de l\'Orientation 2024',
      description: 'Photos et vidéos du salon de l\'orientation',
      evenementId: evenement.id,
      maxImages: 20,
    },
  });

  // Création des médias
  console.log('Création des médias...');
  const medias = [
    {
      id: 'media-1',
      titre: 'Photo d\'ouverture du salon',
      description: 'Vue générale du hall d\'exposition',
      fichier: '/images/salon-ouverture.jpg',
      type: 'PHOTO',
      categorie: 'Événement',
      evenementId: evenement.id,
    },
    {
      id: 'media-2',
      titre: 'Vidéo de présentation',
      description: 'Vidéo promotionnelle du salon',
      fichier: '/videos/presentation-salon.mp4',
      type: 'VIDEO',
      categorie: 'Promotion',
      evenementId: evenement.id,
    },
    {
      id: 'media-3',
      titre: 'Photo des exposants',
      description: 'Stands des exposants dans le hall',
      fichier: '/images/exposants-stands.jpg',
      type: 'PHOTO',
      categorie: 'Exposants',
      galerieId: galerie.id,
    },
    {
      id: 'media-4',
      titre: 'Brochure du salon',
      description: 'Brochure informative sur les formations',
      fichier: '/documents/brochure-salon.pdf',
      type: 'DOCUMENT',
      categorie: 'Documentation',
      evenementId: evenement.id,
    },
    {
      id: 'media-5',
      titre: 'Photo des conférences',
      description: 'Salle de conférence pendant une présentation',
      fichier: '/images/conference.jpg',
      type: 'PHOTO',
      categorie: 'Conférences',
      galerieId: galerie.id,
    },
  ];

  for (const mediaData of medias) {
    await prisma.media.upsert({
      where: { id: mediaData.id },
      update: {},
      create: mediaData,
    });
  }

  // Création de comptes à rebours
  console.log('Création des comptes à rebours...');
  
  // Compte à rebours 1 - Événement à venir (actif)
  const compteARebours1 = await prisma.compteARebours.upsert({
    where: { id: 'compte-1' },
    update: {},
    create: {
      id: 'compte-1',
      titre: 'Salon de l\'Orientation 2024',
      description: 'Ne manquez pas le plus grand salon de l\'orientation de l\'année ! Découvrez plus de 50 établissements et participez à des ateliers interactifs.',
      lieu: 'Lycée Polyvalent de Paris',
      ville: 'Paris',
      dateCible: new Date('2024-06-15T09:00:00Z'),
      dateDebut: new Date('2024-06-15T09:00:00Z'),
      dateFin: new Date('2024-06-15T18:00:00Z'),
      actif: true,
    },
  });

  // Compte à rebours 2 - Forum d'orientation (futur)
  const compteARebours2 = await prisma.compteARebours.upsert({
    where: { id: 'compte-2' },
    update: {},
    create: {
      id: 'compte-2',
      titre: 'Forum d\'Orientation 2026',
      description: 'Le plus grand forum d\'orientation de la région avec des professionnels de l\'éducation et des entreprises.',
      lieu: 'Centre des Congrès',
      ville: 'Lyon',
      dateCible: new Date('2026-03-20T10:00:00Z'),
      dateDebut: new Date('2026-03-20T10:00:00Z'),
      dateFin: new Date('2026-03-20T17:00:00Z'),
      actif: false,
    },
  });

  // Compte à rebours 3 - Journée Portes Ouvertes (passé)
  const compteARebours3 = await prisma.compteARebours.upsert({
    where: { id: 'compte-3' },
    update: {},
    create: {
      id: 'compte-3',
      titre: 'Journée Portes Ouvertes - École de Commerce',
      description: 'Venez découvrir nos installations et rencontrer nos professeurs et étudiants.',
      lieu: 'École Supérieure de Commerce',
      ville: 'Marseille',
      dateCible: new Date('2024-02-10T14:00:00Z'),
      dateDebut: new Date('2024-02-10T09:00:00Z'),
      dateFin: new Date('2024-02-10T17:00:00Z'),
      actif: false,
    },
  });

  // Compte à rebours 4 - Salon des Métiers (futur)
  const compteARebours4 = await prisma.compteARebours.upsert({
    where: { id: 'compte-4' },
    update: {},
    create: {
      id: 'compte-4',
      titre: 'Salon des Métiers du Numérique',
      description: 'Découvrez les métiers d\'avenir du numérique : IA, cybersécurité, développement web, et plus encore.',
      lieu: 'Parc des Expositions',
      ville: 'Bordeaux',
      dateCible: new Date('2024-09-05T09:30:00Z'),
      dateDebut: new Date('2024-09-05T09:30:00Z'),
      dateFin: new Date('2024-09-05T18:30:00Z'),
      actif: false,
    },
  });

  // Compte à rebours 5 - Conférence Éducation (futur)
  const compteARebours5 = await prisma.compteARebours.upsert({
    where: { id: 'compte-5' },
    update: {},
    create: {
      id: 'compte-5',
      titre: 'Conférence sur l\'Éducation du Futur',
      description: 'Experts internationaux discutent des tendances et innovations dans l\'éducation pour la prochaine décennie.',
      lieu: 'Université Paris-Sorbonne',
      ville: 'Paris',
      dateCible: new Date('2024-11-12T15:00:00Z'),
      dateDebut: new Date('2024-11-12T14:00:00Z'),
      dateFin: new Date('2024-11-12T18:00:00Z'),
      actif: false,
    },
  });

  // Compte à rebours 6 - Compétitions Étudiantes (passé)
  const compteARebours6 = await prisma.compteARebours.upsert({
    where: { id: 'compte-6' },
    update: {},
    create: {
      id: 'compte-6',
      titre: 'Olympiades Scientifiques Régionales',
      description: 'Compétition annuelle réunissant les meilleurs étudiants scientifiques de la région.',
      lieu: 'Lycée Scientifique',
      ville: 'Toulouse',
      dateCible: new Date('2024-01-20T08:00:00Z'),
      dateDebut: new Date('2024-01-20T08:00:00Z'),
      dateFin: new Date('2024-01-20T19:00:00Z'),
      actif: false,
    },
  });

  // Compte à rebours 7 - Salon International (futur)
  const compteARebours7 = await prisma.compteARebours.upsert({
    where: { id: 'compte-7' },
    update: {},
    create: {
      id: 'compte-7',
      titre: 'Salon International de l\'Éducation',
      description: 'Rencontre internationale entre institutions éducatives, entreprises et étudiants du monde entier.',
      lieu: 'Palais des Congrès',
      ville: 'Nice',
      dateCible: new Date('2025-04-08T10:00:00Z'),
      dateDebut: new Date('2025-04-08T10:00:00Z'),
      dateFin: new Date('2025-04-08T19:00:00Z'),
      actif: false,
    },
  });

  // Création de messages de contact
  console.log('Création des messages de contact...');
  const contactMessages = [
    {
      id: 'contact-1',
      nom: 'Martin Sophie',
      email: 'sophie.martin@email.com',
      message: 'Bonjour, je souhaiterais avoir plus d\'informations sur les formations en ingénierie. Mon fils est intéressé par la robotique.',
      lu: false,
    },
    {
      id: 'contact-2',
      nom: 'Dubois Thomas',
      email: 'thomas.dubois@email.com',
      message: 'Je suis étudiant en terminale et je voudrais savoir quelles sont les démarches pour m\'inscrire au salon.',
      lu: true,
    },
    {
      id: 'contact-3',
      nom: 'Bernard Marie',
      email: 'marie.bernard@email.com',
      message: 'Est-ce que les parents peuvent accompagner leurs enfants au salon ? Y a-t-il des animations prévues pour les familles ?',
      lu: false,
    },
    {
      id: 'contact-4',
      nom: 'Laurent Pierre',
      email: 'pierre.laurent@email.com',
      message: 'Je représente une école de commerce et je souhaiterais devenir exposant pour le prochain salon. Pouvez-vous me transmettre les tarifs ?',
      lu: true,
    },
    {
      id: 'contact-5',
      nom: 'Moreau Isabelle',
      email: 'isabelle.moreau@email.com',
      message: 'Merci pour l\'organisation de ce salon. C\'était très enrichissant !',
      lu: false,
    },
  ];

  for (const messageData of contactMessages) {
    await prisma.contactMessage.upsert({
      where: { id: messageData.id },
      update: {},
      create: messageData,
    });
  }

  // Création des inscriptions
  console.log('Création des inscriptions...');
  const inscriptions = [
    {
      id: 'inscription-1',
      nom: 'Durand',
      prenom: 'Lucas',
      email: 'lucas.durand@email.com',
      telephone: '0612345678',
      evenementId: evenement.id,
      typeParticipant: 'Étudiant',
      etablissement: 'Lycée Jean Moulin',
      niveau: 'Terminale',
      branche: 'Scientifique',
      interets: 'Ingénierie, Robotique, IA',
      message: 'Je suis très intéressé par les formations en ingénierie et j\'aimerais en savoir plus sur les débouchés.',
      statut: 'CONFIRMEE',
    },
    {
      id: 'inscription-2',
      nom: 'Lefebvre',
      prenom: 'Emma',
      email: 'emma.lefebvre@email.com',
      telephone: '0623456789',
      evenementId: evenement.id,
      typeParticipant: 'Étudiant',
      etablissement: 'Lycée Victor Hugo',
      niveau: 'Première',
      branche: 'Économique et Social',
      interets: 'Commerce, Marketing, Management',
      message: 'Je voudrais rencontrer les écoles de commerce pour discuter des parcours internationaux.',
      statut: 'EN_ATTENTE',
    },
    {
      id: 'inscription-3',
      nom: 'Mercier',
      prenom: 'Louis',
      email: 'louis.mercier@email.com',
      telephone: '0634567890',
      evenementId: evenement.id,
      typeParticipant: 'Parent',
      etablissement: 'Collège Marie Curie',
      niveau: '3ème',
      branche: 'Général',
      interets: 'Orientation générale',
      message: 'J\'accompagne ma fille pour l\'aider dans son orientation. Nous sommes intéressés par toutes les formations.',
      statut: 'CONFIRMEE',
    },
    {
      id: 'inscription-4',
      nom: 'Gauthier',
      prenom: 'Chloé',
      email: 'chloe.gauthier@email.com',
      telephone: '0645678901',
      evenementId: evenement.id,
      typeParticipant: 'Étudiant',
      etablissement: 'Lycée Pasteur',
      niveau: 'Terminale',
      branche: 'Littéraire',
      interets: 'Arts, Design, Communication',
      message: 'Je cherche une école d\'arts pour poursuivre mes études en design graphique.',
      statut: 'CONFIRMEE',
    },
    {
      id: 'inscription-5',
      nom: 'Rousseau',
      prenom: 'Maxime',
      email: 'maxime.rousseau@email.com',
      telephone: '0656789012',
      evenementId: evenement.id,
      typeParticipant: 'Professeur',
      etablissement: 'Lycée Voltaire',
      niveau: '',
      branche: '',
      interets: 'Informatique, Numérique',
      message: 'Je suis professeur de mathématiques et je viens découvrir les formations numériques pour conseiller mes élèves.',
      statut: 'EN_ATTENTE',
    },
    {
      id: 'inscription-6',
      nom: 'Fournier',
      prenom: 'Léa',
      email: 'lea.fournier@email.com',
      telephone: '0667890123',
      evenementId: evenement.id,
      typeParticipant: 'Étudiant',
      etablissement: 'Lycée Jean Jaurès',
      niveau: 'Terminale',
      branche: 'Scientifique',
      interets: 'Santé, Biologie, Médecine',
      message: 'Je souhaite devenir médecin et je voudrais rencontrer les écoles préparatoires.',
      statut: 'ANNULEE',
    },
    {
      id: 'inscription-7',
      nom: 'Girard',
      prenom: 'Antoine',
      email: 'antoine.girard@email.com',
      telephone: '0678901234',
      evenementId: evenement.id,
      typeParticipant: 'Étudiant',
      etablissement: 'Lycée Condorcet',
      niveau: 'Première',
      branche: 'Scientifique',
      interets: 'Informatique, Cybersécurité',
      message: 'Passionné par la cybersécurité, je cherche les meilleures formations dans ce domaine.',
      statut: 'CONFIRMEE',
    },
    {
      id: 'inscription-8',
      nom: 'Bonnet',
      prenom: 'Camille',
      email: 'camille.bonnet@email.com',
      telephone: '0689012345',
      evenementId: evenement.id,
      typeParticipant: 'Professionnel',
      etablissement: '',
      niveau: '',
      branche: '',
      interets: 'Formation continue',
      message: 'Je travaille dans le marketing et je souhaite me reconvertir dans le digital.',
      statut: 'EN_ATTENTE',
    },
  ];

  for (const inscriptionData of inscriptions) {
    await prisma.inscription.upsert({
      where: { id: inscriptionData.id },
      update: {},
      create: inscriptionData,
    });
  }

  // Création des contacts d'exposants
  console.log('Création des contacts d\'exposants...');
  const contactsExposants = [
    {
      id: 'contact-1',
      nom: 'Martin',
      prenom: 'Jean',
      email: 'jean.martin@paristech.edu',
      telephone: '0123456789',
      fonction: 'Directeur des admissions',
      entreprise: 'École d\'Ingénieurs ParisTech',
      exposantId: 'exposant-1',
      statut: 'ACTIF',
      notes: 'Contact principal pour les partenariats éducatifs',
    },
    {
      id: 'contact-2',
      nom: 'Dubois',
      prenom: 'Marie',
      email: 'marie.dubois@paristech.edu',
      telephone: '0123456790',
      fonction: 'Responsable relations entreprises',
      entreprise: 'École d\'Ingénieurs ParisTech',
      exposantId: 'exposant-1',
      statut: 'ACTIF',
      notes: 'Gère les stages et les alternances',
    },
    {
      id: 'contact-3',
      nom: 'Laurent',
      prenom: 'Sophie',
      email: 'sophie.laurent@its-techno.edu',
      telephone: '0123456791',
      fonction: 'Directrice',
      entreprise: 'Institut Technologique Supérieur',
      exposantId: 'exposant-2',
      statut: 'ACTIF',
      notes: 'Experte en technologies numériques',
    },
    {
      id: 'contact-4',
      nom: 'Moreau',
      prenom: 'Bernard',
      email: 'bernard.moreau@ecom-international.edu',
      telephone: '0123456792',
      fonction: 'Directeur des programmes',
      entreprise: 'École de Commerce Internationale',
      exposantId: 'exposant-3',
      statut: 'ACTIF',
      notes: 'Spécialiste en commerce international',
    },
    {
      id: 'contact-5',
      nom: 'Petit',
      prenom: 'Claire',
      email: 'claire.petit@ecom-international.edu',
      telephone: '0123456793',
      fonction: 'Responsable admissions',
      entreprise: 'École de Commerce Internationale',
      exposantId: 'exposant-3',
      statut: 'ACTIF',
      notes: 'Gère les inscriptions et l\'orientation',
    },
    {
      id: 'contact-6',
      nom: 'Dubois',
      prenom: 'Catherine',
      email: 'catherine.dubois@arts-superieur.edu',
      telephone: '0123456794',
      fonction: 'Directrice artistique',
      entreprise: 'École Supérieure des Arts',
      exposantId: 'exposant-4',
      statut: 'ACTIF',
      notes: 'Artiste reconnue dans le domaine du design',
    },
    {
      id: 'contact-7',
      nom: 'Rousseau',
      prenom: 'Michel',
      email: 'michel.rousseau@sante-institut.edu',
      telephone: '0123456795',
      fonction: 'Directeur scientifique',
      entreprise: 'Institut des Sciences de la Santé',
      exposantId: 'exposant-5',
      statut: 'ACTIF',
      notes: 'Médecin et chercheur en biologie',
    },
    {
      id: 'contact-8',
      nom: 'Lefebvre',
      prenom: 'Isabelle',
      email: 'isabelle.lefebvre@its-techno.edu',
      telephone: '0123456796',
      fonction: 'Responsable marketing',
      entreprise: 'Institut Technologique Supérieur',
      exposantId: 'exposant-2',
      statut: 'ACTIF',
      notes: 'Experte en marketing digital',
    },
    {
      id: 'contact-9',
      nom: 'Bernard',
      prenom: 'Philippe',
      email: 'philippe.bernard@ecom-international.edu',
      telephone: '0123456797',
      fonction: 'Professeur de finance',
      entreprise: 'École de Commerce Internationale',
      exposantId: 'exposant-3',
      statut: 'ACTIF',
      notes: 'Expert en marchés financiers',
    },
    {
      id: 'contact-10',
      nom: 'Martin',
      prenom: 'Pierre',
      email: 'pierre.martin@arts-superieur.edu',
      telephone: '0123456798',
      fonction: 'Artiste numérique',
      entreprise: 'École Supérieure des Arts',
      exposantId: 'exposant-4',
      statut: 'ACTIF',
      notes: 'Spécialiste en art digital et multimédia',
    },
  ];

  for (const contactData of contactsExposants) {
    await prisma.contactExposant.upsert({
      where: { id: contactData.id },
      update: {},
      create: contactData,
    });
  }

  // Création des programmes pour les lycées
  console.log('Création des programmes pour les lycées...');
  
  // Programmes pour Lycée Polyvalent de Paris
  const programmesLycee1 = [
    {
      id: 'programme-lycee-1',
      titre: 'Accueil et Inscription',
      description: 'Bienvenue des visiteurs et distribution des programmes',
      heure: '08:30',
      duree: '30 min',
      lieu: 'Hall d\'entrée',
      type: 'ACCUEIL',
      public: 'Tous',
      animateur: 'Équipe d\'accueil',
      ordre: 1,
    },
    {
      id: 'programme-lycee-2',
      titre: 'Présentation de l\'établissement',
      description: 'Historique, valeurs et projet d\'établissement',
      heure: '09:00',
      duree: '45 min',
      lieu: 'Amphithéâtre',
      type: 'PRESENTATION',
      public: 'Tous',
      animateur: 'Proviseur',
      ordre: 2,
    },
    {
      id: 'programme-lycee-3',
      titre: 'Visite guidée des installations',
      description: 'Découverte des salles de classe, laboratoires et équipements',
      heure: '10:00',
      duree: '1h',
      lieu: 'Départ hall d\'entrée',
      type: 'VISITE',
      public: 'Tous',
      animateur: 'Équipe pédagogique',
      ordre: 3,
    },
    {
      id: 'programme-lycee-4',
      titre: 'Atelier: Découverte des filières',
      description: 'Présentation détaillée des différentes filières et débouchés',
      heure: '11:15',
      duree: '1h',
      lieu: 'Salle polyvalente',
      type: 'ATELIER',
      public: 'Élèves de 3ème',
      animateur: 'Professeurs principaux',
      ordre: 4,
    },
    {
      id: 'programme-lycee-5',
      titre: 'Rencontre avec les élèves',
      description: 'Témoignages et échanges avec les élèves du lycée',
      heure: '12:30',
      duree: '45 min',
      lieu: 'CDI',
      type: 'RENCONTRE',
      public: 'Parents et élèves',
      animateur: 'Délégués élèves',
      ordre: 5,
    },
  ];

  // Programmes pour Lycée Ibn Khaldoun
  const programmesLycee2 = [
    {
      id: 'programme-lycee-11',
      titre: 'Accueil des scientifiques en herbe',
      description: 'Bienvenue et présentation du lycée scientifique',
      heure: '08:45',
      duree: '30 min',
      lieu: 'Hall scientifique',
      type: 'ACCUEIL',
      public: 'Tous',
      animateur: 'Équipe scientifique',
      ordre: 1,
    },
    {
      id: 'programme-lycee-12',
      titre: 'Présentation des laboratoires',
      description: 'Découverte des équipements scientifiques de pointe',
      heure: '09:30',
      duree: '1h',
      lieu: 'Labo principal',
      type: 'PRESENTATION',
      public: 'Tous',
      animateur: 'Responsable labo',
      ordre: 2,
    },
    {
      id: 'programme-lycee-13',
      titre: 'Visite des installations techniques',
      description: 'Découverte des salles de technologie et informatique',
      heure: '10:45',
      duree: '1h',
      lieu: 'Département technique',
      type: 'VISITE',
      public: 'Tous',
      animateur: 'Professeurs de techno',
      ordre: 3,
    },
    {
      id: 'programme-lycee-14',
      titre: 'Atelier de programmation',
      description: 'Initiation à la programmation et à l\'algorithmique',
      heure: '12:00',
      duree: '1h30',
      lieu: 'Salle informatique',
      type: 'ATELIER',
      public: 'Débutants',
      animateur: 'Professeurs d\'info',
      ordre: 4,
    },
  ];

  // Programmes pour Lycée Privé Al Amal
  const programmesLycee3 = [
    {
      id: 'programme-lycee-21',
      titre: 'Accueil personnalisé',
      description: 'Réception individuelle des familles',
      heure: '09:00',
      duree: '45 min',
      lieu: 'Hall d\'accueil',
      type: 'ACCUEIL',
      public: 'Familles',
      animateur: 'Direction',
      ordre: 1,
    },
    {
      id: 'programme-lycee-22',
      titre: 'Présentation pédagogique',
      description: 'Méthodes d\'enseignement et approche éducative',
      heure: '10:00',
      duree: '1h',
      lieu: 'Amphithéâtre',
      type: 'PRESENTATION',
      public: 'Parents',
      animateur: 'Directeur pédagogique',
      ordre: 2,
    },
    {
      id: 'programme-lycee-23',
      titre: 'Visite des classes modernes',
      description: 'Découverte des salles équipées de technologies modernes',
      heure: '11:15',
      duree: '45 min',
      lieu: 'Aile pédagogique',
      type: 'VISITE',
      public: 'Tous',
      animateur: 'Équipe enseignante',
      ordre: 3,
    },
    {
      id: 'programme-lycee-24',
      titre: 'Atelier méthodologie',
      description: 'Techniques de travail et organisation',
      heure: '12:15',
      duree: '1h',
      lieu: 'Salle d\'étude',
      type: 'ATELIER',
      public: 'Élèves',
      animateur: 'Conseillers principaux',
      ordre: 4,
    },
  ];

  // Programmes pour Lycée Ibn Battouta
  const programmesLycee4 = [
    {
      id: 'programme-lycee-31',
      titre: 'Accueil international',
      description: 'Bienvenue en plusieurs langues',
      heure: '08:30',
      duree: '30 min',
      lieu: 'Hall international',
      type: 'ACCUEIL',
      public: 'Tous',
      animateur: 'Équipe multilingue',
      ordre: 1,
    },
    {
      id: 'programme-lycee-32',
      titre: 'Présentation des langues',
      description: 'Parcours linguistiques et certifications',
      heure: '09:15',
      duree: '45 min',
      lieu: 'Salle des langues',
      type: 'PRESENTATION',
      public: 'Tous',
      animateur: 'Responsable langues',
      ordre: 2,
    },
    {
      id: 'programme-lycee-33',
      titre: 'Visite culturelle',
      description: 'Découverte des espaces culturels du lycée',
      heure: '10:15',
      duree: '1h',
      lieu: 'Espace culturel',
      type: 'VISITE',
      public: 'Tous',
      animateur: 'Professeurs de langues',
      ordre: 3,
    },
    {
      id: 'programme-lycee-34',
      titre: 'Atelier d\'échanges',
      description: 'Rencontre avec les partenaires internationaux',
      heure: '11:30',
      duree: '1h30',
      lieu: 'Salle de conférence',
      type: 'ATELIER',
      public: 'Élèves intéressés',
      animateur: 'Partenaires étrangers',
      ordre: 4,
    },
  ];

  // Programmes pour Lycée Alamana
  const programmesLycee5 = [
    {
      id: 'programme-lycee-41',
      titre: 'Accueil artistique',
      description: 'Bienvenue avec ambiance musicale',
      heure: '09:00',
      duree: '30 min',
      lieu: 'Hall des arts',
      type: 'ACCUEIL',
      public: 'Tous',
      animateur: 'Équipe artistique',
      ordre: 1,
    },
    {
      id: 'programme-lycee-42',
      titre: 'Présentation des filières artistiques',
      description: 'Arts plastiques, musique, théâtre et danse',
      heure: '09:45',
      duree: '1h',
      lieu: 'Auditorium',
      type: 'PRESENTATION',
      public: 'Tous',
      animateur: 'Directeur artistique',
      ordre: 2,
    },
    {
      id: 'programme-lycee-43',
      titre: 'Visite des ateliers créatifs',
      description: 'Découverte des salles d\'arts et de musique',
      heure: '11:00',
      duree: '1h',
      lieu: 'Ateliers d\'arts',
      type: 'VISITE',
      public: 'Tous',
      animateur: 'Professeurs d\'arts',
      ordre: 3,
    },
    {
      id: 'programme-lycee-44',
      titre: 'Atelier de création',
      description: 'Participation à une œuvre collective',
      heure: '12:15',
      duree: '1h30',
      lieu: 'Atelier principal',
      type: 'ATELIER',
      public: 'Tous',
      animateur: 'Artistes résidents',
      ordre: 4,
    },
  ];

  // Programmes pour Lycée Sidi Driss
  const programmesLycee6 = [
    {
      id: 'programme-lycee-51',
      titre: 'Accueil technologique',
      description: 'Présentation des innovations technologiques',
      heure: '08:45',
      duree: '30 min',
      lieu: 'Hall tech',
      type: 'ACCUEIL',
      public: 'Tous',
      animateur: 'Équipe technique',
      ordre: 1,
    },
    {
      id: 'programme-lycee-52',
      titre: 'Présentation des équipements',
      description: 'Démonstration des technologies de pointe',
      heure: '09:30',
      duree: '1h',
      lieu: 'Labo technologique',
      type: 'PRESENTATION',
      public: 'Tous',
      animateur: 'Responsable technique',
      ordre: 2,
    },
    {
      id: 'programme-lycee-53',
      titre: 'Visite des installations',
      description: 'Découverte des salles informatiques et techniques',
      heure: '10:45',
      duree: '1h',
      lieu: 'Département technique',
      type: 'VISITE',
      public: 'Tous',
      animateur: 'Techniciens',
      ordre: 3,
    },
    {
      id: 'programme-lycee-54',
      titre: 'Atelier robotique',
      description: 'Initiation à la robotique et à l\'automatisation',
      heure: '12:00',
      duree: '1h30',
      lieu: 'Labo robotique',
      type: 'ATELIER',
      public: 'Passionnés de techno',
      animateur: 'Ingénieurs',
      ordre: 4,
    },
  ];

  // Insertion des programmes pour chaque lycée
  const allProgrammesLycees = [
    ...programmesLycee1.map(p => ({ ...p, lyceeId: lycee1.id })),
    ...programmesLycee2.map(p => ({ ...p, lyceeId: lycee2.id })),
    ...programmesLycee3.map(p => ({ ...p, lyceeId: lycee3.id })),
    ...programmesLycee4.map(p => ({ ...p, lyceeId: lycee4.id })),
    ...programmesLycee5.map(p => ({ ...p, lyceeId: lycee5.id })),
    ...programmesLycee6.map(p => ({ ...p, lyceeId: lycee6.id })),
  ];

  for (const programmeData of allProgrammesLycees) {
    await prisma.programmeLycee.create({
      data: programmeData,
    });
  }

  console.log('Seeding terminé avec succès !');
  console.log('Résumé des données créées :');
  console.log(`- ${1} utilisateur`);
  console.log(`- ${allLycees.length} lycées`);
  console.log(`- ${exposants.length} exposants`);
  console.log(`- ${allProgrammes.length} programmes`);
  console.log(`- ${1} événement`);
  console.log(`- ${partenaires.length} partenaires`);
  console.log(`- ${1} galerie`);
  console.log(`- ${medias.length} médias`);
  console.log(`- ${7} comptes à rebours`);
  console.log(`- ${contactMessages.length} messages de contact`);
  console.log(`- ${inscriptions.length} inscriptions`);
  console.log(`- ${contactsExposants.length} contacts d'exposants`);
  console.log(`- ${allProgrammesLycees.length} programmes de lycée`);
}

main()
  .catch((e) => {
    console.error('Erreur lors du seeding :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });