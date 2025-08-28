import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/layout/Layout";
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Shield, 
  Users, 
  Calendar,
  Mail,
  Phone,
  Globe,
  Eye,
  Download,
  Lock,
  Ban,
  CreditCard,
  MessageSquare,
  Camera,
  MapPin,
  Clock,
  ExternalLink,
  Info
} from "lucide-react";

export default function CGU() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Conditions Générales d'Utilisation</h1>
          <p className="text-lg text-gray-600 mb-4">
            Règles et conditions d'utilisation du site ATLANTIS EVENTS
          </p>
          <div className="flex justify-center gap-2">
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              <FileText className="h-4 w-4 mr-1" />
              Document contractuel
            </Badge>
            <Badge variant="outline" className="text-green-600 border-green-600">
              Dernière mise à jour : 23 août 2025
            </Badge>
          </div>
        </div>

        <div className="space-y-8">
          {/* Préambule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Préambule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">
                Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation du site web 
                "ATLANTIS EVENTS" mis à disposition par ATLANTIS EVENTS SARL.
              </p>
              <p className="text-gray-700 leading-relaxed">
                En accédant à ce site et en l'utilisant, vous reconnaissez avoir lu, compris et accepté sans réserve 
                les présentes CGU. Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser ce site.
              </p>
            </CardContent>
          </Card>

          {/* Article 1 - Définitions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Article 1 - Définitions
              </CardTitle>
              <CardDescription>
                Termes utilisés dans les présentes CGU
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-gray-900">Site</h5>
                    <p className="text-sm text-gray-600">
                      Le site web "ATLANTIS EVENTS" accessible à l'URL www.atlantisevents.fr
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-gray-900">Utilisateur</h5>
                    <p className="text-sm text-gray-600">
                      Toute personne physique ou morale accédant au Site et l'utilisant
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-gray-900">Membre</h5>
                    <p className="text-sm text-gray-600">
                      Utilisateur ayant créé un compte et étant connecté au Site
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-gray-900">Contenu</h5>
                    <p className="text-sm text-gray-600">
                      Textes, images, vidéos, sons, logos, marques et tout autre élément présent sur le Site
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-gray-900">Événement</h5>
                    <p className="text-sm text-gray-600">
                      Session d'orientation organisée dans le cadre des événements ATLANTIS EVENTS
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-gray-900">Exposant</h5>
                    <p className="text-sm text-gray-600">
                      Établissement d'enseignement ou partenaire présentant ses offres lors des Événements
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Article 2 - Objet */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Article 2 - Objet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Les présentes CGU ont pour objet de définir les conditions d'accès et d'utilisation du Site par 
                l'Utilisateur, ainsi que les droits et obligations des parties dans le cadre de cette utilisation.
              </p>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>Objectif principal du Site :</strong> Faciliter l'organisation et la participation aux 
                  événements ATLANTIS EVENTS en mettant en relation les établissements d'enseignement, les exposants 
                  et les participants potentiels.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Article 3 - Accès au site */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Article 3 - Accès au site
              </CardTitle>
              <CardDescription>
                Conditions d'accès et disponibilité du service
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Disponibilité du service</h4>
                <p className="text-gray-700 mb-3">
                  Le Site est accessible gratuitement 24h/24 et 7j/7, sauf en cas de force majeure, panne technique, 
                  maintenance ou événement hors du contrôle d'ATLANTIS EVENTS SARL.
                </p>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    <AlertTriangle className="h-4 w-4 inline mr-1" />
                    ATLANTIS EVENTS SARL ne garantit pas la disponibilité continue et sans interruption du Site et ne saurait 
                    être tenue responsable des dommages résultant d'une indisponibilité.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Conditions techniques</h4>
                <p className="text-gray-700">
                  L'Utilisateur reconnaît disposer des compétences et moyens nécessaires pour accéder et utiliser 
                  le Site, notamment :
                </p>
                <ul className="mt-2 text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Un accès internet stable</li>
                  <li>• Un navigateur web à jour</li>
                  <li>• Un matériel informatique compatible</li>
                  <li>• Les logiciels nécessaires (PDF reader, etc.)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Maintenance et interruptions</h4>
                <p className="text-gray-700">
                  ATLANTIS EVENTS SARL se réserve le droit d'interrompre temporairement le Site pour des raisons de 
                  maintenance, mise à jour ou amélioration. Les interruptions seront, si possible, annoncées 
                  à l'avance sur le Site.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Article 4 - Inscription et compte utilisateur */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Article 4 - Inscription et compte utilisateur
              </CardTitle>
              <CardDescription>
                Création et gestion des comptes utilisateurs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Création de compte</h4>
                <p className="text-gray-700 mb-3">
                  Pour accéder à certaines fonctionnalités du Site, l'Utilisateur doit créer un compte en fournissant 
                  des informations exactes, complètes et à jour.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-green-900 mb-1">Informations requises</h5>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Nom et prénom</li>
                      <li>• Adresse email valide</li>
                      <li>• Numéro de téléphone</li>
                      <li>• Type de participant</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-blue-900 mb-1">Informations optionnelles</h5>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Établissement</li>
                      <li>• Niveau d'études</li>
                      <li>• Centres d'intérêt</li>
                      <li>• Photo de profil</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Responsabilités de l'Utilisateur</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-gray-700">Garder ses identifiants confidentiels</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-gray-700">Ne pas partager son compte avec des tiers</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-gray-700">Mettre à jour ses informations régulièrement</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-gray-700">Notifier immédiatement tout compromission de compte</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Suspension et résiliation</h4>
                <p className="text-gray-700">
                  ATLANTIS EVENTS SARL se réserve le droit de suspendre ou résilier un compte utilisateur en cas de :
                </p>
                <ul className="mt-2 text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Violation des présentes CGU</li>
                  <li>• Fourniture de fausses informations</li>
                  <li>• Activité suspecte ou frauduleuse</li>
                  <li>• Inactivité prolongée (plus de 2 ans)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Article 5 - Utilisation du service */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Article 5 - Utilisation du service
              </CardTitle>
              <CardDescription>
                Règles d'utilisation des fonctionnalités du site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Utilisations autorisées</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span className="text-sm text-gray-700">Consulter les informations sur les événements</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span className="text-sm text-gray-700">S'inscrire aux événements</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span className="text-sm text-gray-700">Contacter les exposants</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span className="text-sm text-gray-700">Télécharger les documents disponibles</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span className="text-sm text-gray-700">Partager les informations sur les réseaux sociaux</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span className="text-sm text-gray-700">Donner son avis sur les événements</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Utilisations interdites</h4>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                      <span className="text-sm text-red-800">Copier, reproduire ou distribuer le Contenu sans autorisation</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                      <span className="text-sm text-red-800">Publier du contenu illégal, diffamatoire ou offensant</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                      <span className="text-sm text-red-800">Tenter d'accéder à des zones non autorisées du Site</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                      <span className="text-sm text-red-800">Utiliser des robots ou scripts pour scraper le Site</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                      <span className="text-sm text-red-800">Se faire passer pour une autre personne ou entité</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Article 6 - Contenu utilisateur */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Article 6 - Contenu utilisateur
              </CardTitle>
              <CardDescription>
                Règles concernant le contenu publié par les utilisateurs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Types de contenu utilisateur</h4>
                <p className="text-gray-700 mb-3">
                  Le Contenu utilisateur inclut notamment : commentaires, avis, messages, photos, vidéos, 
                  profils, et tout autre élément publié par l'Utilisateur sur le Site.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Responsabilités sur le contenu</h4>
                <p className="text-gray-700 mb-3">
                  L'Utilisateur est seul responsable du Contenu qu'il publie sur le Site. Il s'engage à :
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span className="text-sm text-gray-700">Publier un contenu original ou autorisé</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span className="text-sm text-gray-700">Respecter les droits des tiers</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span className="text-sm text-gray-700">Ne pas publier de contenu illégal</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span className="text-sm text-gray-700">Être respectueux envers les autres utilisateurs</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span className="text-sm text-gray-700">Ne pas faire de spam ou de publicité non sollicitée</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span className="text-sm text-gray-700">Ne pas publier d'informations personnelles d'autrui</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Droits sur le contenu utilisateur</h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 text-sm mb-2">
                    En publiant du Contenu sur le Site, l'Utilisateur accorde à ATLANTIS EVENTS SARL :
                  </p>
                  <ul className="text-blue-800 text-sm space-y-1 ml-4">
                    <li>• Une licence mondiale, non exclusive, gratuite et transférable</li>
                    <li>• Le droit d'utiliser, reproduire, modifier et distribuer le Contenu</li>
                    <li>• Le droit d'incorporer le Contenu dans d'autres œuvres</li>
                    <li>• Ces droits sont nécessaires pour faire fonctionner le Site</li>
                  </ul>
                  <p className="text-blue-800 text-sm mt-2">
                    L'Utilisateur conserve la propriété de son Contenu et peut le retirer à tout moment.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Modération et suppression</h4>
                <p className="text-gray-700">
                  L'association se réserve le droit de modérer, modifier ou supprimer tout Contenu utilisateur 
                  qui viole les présentes CGU, sans préavis et sans responsabilité.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Article 7 - Propriété intellectuelle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Article 7 - Propriété intellectuelle
              </CardTitle>
              <CardDescription>
                Droits sur le contenu du site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Contenu du site</h4>
                <p className="text-gray-700 mb-3">
                  L'ensemble des éléments composant le Site (textes, images, vidéos, logos, structure, design, 
                  logiciels, bases de données, etc.) est la propriété exclusive d'ATLANTIS EVENTS SARL et est protégé par les lois sur la propriété intellectuelle.
                </p>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-red-800 text-sm">
                    <Ban className="h-4 w-4 inline mr-1" />
                    Toute reproduction, distribution, modification ou utilisation de ces éléments sans autorisation 
                    écrite préalable est strictement interdite et pourrait entraîner des poursuites judiciaires.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Marques déposées</h4>
                <p className="text-gray-700">
                  Les noms, logos, marques et autres signes distinctifs figurant sur le Site sont des marques 
                  déposées par ATLANTIS EVENTS SARL ou ses partenaires. Toute utilisation 
                  non autorisée de ces marques est interdite.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Licence d'utilisation</h4>
                <p className="text-gray-700 mb-3">
                  L'association accorde à l'Utilisateur une licence d'utilisation personnelle, non exclusive, 
                  non transférable et révocable pour accéder et utiliser le Site conformément aux présentes CGU.
                </p>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-800 text-sm">
                    <CheckCircle className="h-4 w-4 inline mr-1" />
                    Cette licence permet à l'Utilisateur de consulter le Contenu, de s'inscrire aux événements, 
                    et d'utiliser les fonctionnalités du Site pour un usage personnel et non commercial.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Article 8 - Inscription aux événements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Article 8 - Inscription aux événements
              </CardTitle>
              <CardDescription>
                Conditions spécifiques aux inscriptions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Processus d'inscription</h4>
                <p className="text-gray-700 mb-3">
                  L'inscription aux événements se fait via le formulaire en ligne. L'Utilisateur doit fournir 
                  toutes les informations requises et confirmer qu'il a lu et accepté les conditions spécifiques 
                  à l'événement.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Confirmation et annulation</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-green-900 mb-1">Confirmation</h5>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Email de confirmation envoyé après inscription</li>
                      <li>• Présentation du billet électronique</li>
                      <li>• Vérification de l'identité à l'entrée</li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-orange-900 mb-1">Annulation</h5>
                    <ul className="text-sm text-orange-800 space-y-1">
                      <li>• Annulation possible jusqu'à 48h avant l'événement</li>
                      <li>• Remboursement selon conditions spécifiques</li>
                      <li>• Frais d'annulation possibles</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Responsabilités du participant</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-gray-700">Être présent à l'heure indiquée</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-gray-700">Se comporter de manière respectueuse</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-gray-700">Respecter les règles de l'événement</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-gray-700">Ne pas perturber le déroulement de l'événement</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Limitation de responsabilité</h4>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    <AlertTriangle className="h-4 w-4 inline mr-1" />
                    L'association ne saurait être tenue responsable des dommages directs ou indirects résultant 
                    de la participation à un événement, y compris en cas d'annulation, de report ou de 
                    modification de l'événement pour des raisons indépendantes de sa volonté.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Article 9 - Données personnelles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Article 9 - Données personnelles
              </CardTitle>
              <CardDescription>
                Protection des données personnelles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                La collecte et le traitement des données personnelles des Utilisateurs sont régis par notre 
                Politique de Confidentialité, qui fait partie intégrante des présentes CGU.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 text-sm mb-2">
                  En utilisant le Site, l'Utilisateur consent expressément à la collecte et au traitement de 
                  ses données personnelles conformément à notre Politique de Confidentialité.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <ExternalLink className="h-4 w-4 text-blue-600" />
                  <a href="/politique-confidentialite" className="text-blue-600 hover:text-blue-800 text-sm underline">
                    Consulter notre Politique de Confidentialité
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Article 10 - Liens hypertextes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                Article 10 - Liens hypertextes
              </CardTitle>
              <CardDescription>
                Liens vers des sites tiers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Liens sortants</h4>
                <p className="text-gray-700 mb-3">
                  Le Site peut contenir des liens hypertextes vers des sites web tiers. Ces liens sont fournis 
                  pour la commodité des Utilisateurs et ne constituent pas une approbation ou un parrainage 
                  des sites concernés.
                </p>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    <AlertTriangle className="h-4 w-4 inline mr-1" />
                    L'association n'exerce aucun contrôle sur ces sites tiers et ne saurait être tenue responsable 
                    de leur contenu, de leurs politiques de confidentialité ou de leurs pratiques.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Liens entrants</h4>
                <p className="text-gray-700">
                  Toute mise en place de lien hypertexte vers le Site est soumise à l'autorisation préalable 
                    et écrite d'ATLANTIS EVENTS SARL. Les liens doivent être retirés sur simple demande d'ATLANTIS EVENTS SARL.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Article 11 - Limitation de responsabilité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Article 11 - Limitation de responsabilité
              </CardTitle>
              <CardDescription>
                Responsabilités et garanties
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Garanties</h4>
                <p className="text-gray-700 mb-3">
                  L'association s'efforce de fournir des informations exactes et à jour sur le Site, mais ne 
                  peut garantir l'exactitude, l'exhaustivité ou la pertinence de ces informations.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Exclusions de responsabilité</h4>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-red-800 text-sm mb-2">
                    L'association ne saurait être tenue responsable des :
                  </p>
                  <ul className="text-red-800 text-sm space-y-1 ml-4">
                    <li>• Erreurs ou omissions dans le Contenu du Site</li>
                    <li>• Indisponibilité temporaire du Site</li>
                    <li>• Dommages directs ou indirects résultant de l'utilisation du Site</li>
                    <li>• Perte de données ou de profits</li>
                    <li>• Contenu publié par les Utilisateurs</li>
                    <li>• Virus ou autres éléments malveillants pouvant infecter l'équipement de l'Utilisateur</li>
                    <li>• Performance ou qualité des services des exposants</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Force majeure</h4>
                <p className="text-gray-700">
                  L'association ne saurait être tenue responsable pour tout manquement à ses obligations 
                  résultant d'un cas de force majeure, incluant notamment les catastrophes naturelles, 
                  les guerres, les grèves, les pandémies, ou les pannes techniques.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Article 12 - Modifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Article 12 - Modifications des CGU
              </CardTitle>
              <CardDescription>
                Processus de mise à jour des conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                L'association se réserve le droit de modifier les présentes CGU à tout moment. Les modifications 
                entreront en vigueur dès leur publication sur le Site.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 text-sm mb-2">
                  <strong>Notification des modifications :</strong>
                </p>
                <ul className="text-blue-800 text-sm space-y-1 ml-4">
                  <li>• Publication de la nouvelle version sur le Site</li>
                  <li>• Mise à jour de la date de "Dernière mise à jour"</li>
                  <li>• Notification par email pour les modifications significatives</li>
                  <li>• Acceptation implicite lors de la prochaine utilisation du Site</li>
                </ul>
              </div>
              <p className="text-gray-700 mt-4">
                Il est recommandé aux Utilisateurs de consulter régulièrement les présentes CGU pour rester 
                informés des éventuelles modifications.
              </p>
            </CardContent>
          </Card>

          {/* Article 13 - Durée et résiliation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ban className="h-5 w-5" />
                Article 13 - Durée et résiliation
              </CardTitle>
              <CardDescription>
                Durée du contrat et conditions de résiliation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Durée</h4>
                <p className="text-gray-700">
                  Les présentes CGU entrent en vigueur dès l'acceptation par l'Utilisateur et demeurent 
                  en vigueur tant que le Site est accessible et utilisé par l'Utilisateur.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Résiliation par l'Utilisateur</h4>
                <p className="text-gray-700">
                  L'Utilisateur peut résilier son contrat à tout moment en cessant d'utiliser le Site et, 
                  le cas échéant, en supprimant son compte utilisateur.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Résiliation par ATLANTIS EVENTS SARL</h4>
                <p className="text-gray-700">
                  ATLANTIS EVENTS SARL peut résilier l'accès d'un Utilisateur au Site en cas de violation des 
                  présentes CGU, d'activité frauduleuse, ou pour toute autre raison légitime.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Effets de la résiliation</h4>
                <p className="text-gray-700">
                  En cas de résiliation, l'Utilisateur perd tout accès au Site et à son compte. Les données 
                  personnelles seront traitées conformément à notre Politique de Confidentialité.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Article 14 - Loi applicable et juridiction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Article 14 - Loi applicable et juridiction
              </CardTitle>
              <CardDescription>
                Droit applicable et tribunal compétent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-blue-900 mb-2">Loi applicable</h5>
                  <p className="text-blue-800 text-sm">
                    Les présentes CGU sont régies par le droit français. 
                    Toute question relative à leur interprétation ou exécution 
                    sera soumise au droit français.
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-green-900 mb-2">Juridiction compétente</h5>
                  <p className="text-green-800 text-sm">
                    En cas de litige, et à défaut de résolution amiable, 
                    les tribunaux de Paris seront seuls compétents 
                    pour connaître du différend.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Article 15 - Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Article 15 - Contact
              </CardTitle>
              <CardDescription>
                Pour toute question sur les CGU
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Pour toute question relative aux présentes Conditions Générales d'Utilisation, 
                vous pouvez nous contacter :
              </p>
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <div className="space-y-3">
                  <p className="flex items-center justify-center gap-2 text-green-800">
                    <Mail className="h-4 w-4" />
                    <span>legal@atlantisevents.fr</span>
                  </p>
                  <p className="flex items-center justify-center gap-2 text-green-800">
                    <Phone className="h-4 w-4" />
                    <span>+33 1 23 45 67 89</span>
                  </p>
                  <p className="flex items-center justify-center gap-2 text-green-800">
                    <MapPin className="h-4 w-4" />
                    <span>123 Avenue de l'Éducation, 75000 Paris</span>
                  </p>
                  <p className="text-green-700 text-sm">
                    Réponse sous 10 jours ouvrés maximum
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acceptation */}
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <CheckCircle className="h-5 w-5" />
                Acceptation des CGU
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <p className="text-blue-900 font-semibold mb-2">
                  En utilisant le Site ATLANTIS EVENTS, vous déclarez avoir lu, compris et accepté 
                  sans réserve les présentes Conditions Générales d'Utilisation.
                </p>
                <p className="text-blue-800 text-sm">
                  Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser ce Site.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}