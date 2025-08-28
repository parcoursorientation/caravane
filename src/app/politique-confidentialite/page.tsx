import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/layout/Layout";
import { 
  Shield, 
  Eye, 
  Trash2, 
  Download, 
  Settings, 
  Lock, 
  FileText,
  Database,
  Cookie,
  Mail,
  Phone,
  Calendar,
  Users,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";

export default function PolitiqueConfidentialite() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Politique de Confidentialité</h1>
          <p className="text-lg text-gray-600">
            Comment nous collectons, utilisons et protégeons vos données personnelles
          </p>
          <div className="mt-4">
            <Badge variant="outline" className="text-green-600 border-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              Conforme RGPD
            </Badge>
            <Badge variant="outline" className="ml-2 text-blue-600 border-blue-600">
              Dernière mise à jour : 23 août 2025
            </Badge>
          </div>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Notre engagement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                ATLANTIS EVENTS SARL s'engage à protéger la vie privée de ses utilisateurs et à respecter 
                la réglementation en vigueur sur la protection des données personnelles, notamment le Règlement Général 
                sur la Protection des Données (RGPD). Cette politique de confidentialité explique comment nous collectons, 
                utilisons et protégeons vos données personnelles lorsque vous utilisez notre site web.
              </p>
            </CardContent>
          </Card>

          {/* Données collectées */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Quelles données collectons-nous ?
              </CardTitle>
              <CardDescription>
                Types de données personnelles que nous recueillons
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Données d'inscription
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-2">Obligatoires</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Nom et prénom</li>
                      <li>• Adresse email</li>
                      <li>• Numéro de téléphone</li>
                      <li>• Type de participant</li>
                      <li>• Établissement</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-2">Optionnelles</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Niveau d'études</li>
                      <li>• Centres d'intérêt</li>
                      <li>• Message personnel</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Données de contact
                </h4>
                <p className="text-gray-700">
                  Lorsque vous nous contactez via notre formulaire de contact, nous collectons votre nom, 
                  votre adresse email et votre message pour pouvoir vous répondre.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Cookie className="h-4 w-4" />
                  Données techniques
                </h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-900 text-sm">
                    Nous collectons automatiquement certaines données techniques lorsque vous naviguez sur notre site :
                  </p>
                  <ul className="text-blue-800 text-sm mt-2 space-y-1">
                    <li>• Adresse IP (anonymisée)</li>
                    <li>• Type de navigateur et version</li>
                    <li>• Système d'exploitation</li>
                    <li>• Pages visitées et durée de visite</li>
                    <li>• Données de cookies (avec votre consentement)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Finalités */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Pourquoi utilisons-nous vos données ?
              </CardTitle>
              <CardDescription>
                Finalités du traitement des données personnelles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">Organisation des événements</h5>
                      <p className="text-sm text-gray-600">
                        Gérer les inscriptions, communiquer sur les événements et assurer le bon déroulement des événements organisés par ATLANTIS EVENTS SARL.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Mail className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">Communication</h5>
                      <p className="text-sm text-gray-600">
                        Vous envoyer des informations relatives aux événements, confirmations d'inscription et rappels.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Users className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">Amélioration du service</h5>
                      <p className="text-sm text-gray-600">
                        Analyser les données pour améliorer notre site et l'expérience utilisateur.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-orange-100 p-2 rounded-full">
                      <Lock className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">Sécurité</h5>
                      <p className="text-sm text-gray-600">
                        Assurer la sécurité du site et prévenir les fraudes ou abus.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-red-100 p-2 rounded-full">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">Conformité légale</h5>
                      <p className="text-sm text-gray-600">
                        Respecter nos obligations légales et réglementaires.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Base légale */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Base légale du traitement
              </CardTitle>
              <CardDescription>
                Fondements juridiques de la collecte de vos données
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Consentement
                  </Badge>
                  <div>
                    <h5 className="font-semibold text-gray-900">Votre consentement explicite</h5>
                    <p className="text-sm text-gray-600">
                      Pour les données optionnelles et l'envoi de communications marketing.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Contrat
                  </Badge>
                  <div>
                    <h5 className="font-semibold text-gray-900">Exécution du contrat</h5>
                    <p className="text-sm text-gray-600">
                      Pour traiter votre inscription et vous fournir les services liés aux événements.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    Obligation légale
                  </Badge>
                  <div>
                    <h5 className="font-semibold text-gray-900">Obligations légales</h5>
                    <p className="text-sm text-gray-600">
                      Pour respecter nos obligations légales et réglementaires.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    Intérêt légitime
                  </Badge>
                  <div>
                    <h5 className="font-semibold text-gray-900">Intérêts légitimes</h5>
                    <p className="text-sm text-gray-600">
                      Pour améliorer nos services, assurer la sécurité et prévenir les fraudes.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Durée de conservation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Combien de temps conservons-nous vos données ?
              </CardTitle>
              <CardDescription>
                Durées de conservation des différentes catégories de données
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h5 className="font-semibold text-gray-900">Données d'inscription</h5>
                    <p className="text-sm text-gray-600">
                      <Badge variant="outline">2 ans</Badge> après la fin de l'événement
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h5 className="font-semibold text-gray-900">Données de contact</h5>
                    <p className="text-sm text-gray-600">
                      <Badge variant="outline">3 ans</Badge> après le dernier contact
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h5 className="font-semibold text-gray-900">Données techniques</h5>
                    <p className="text-sm text-gray-600">
                      <Badge variant="outline">13 mois</Badge> maximum
                    </p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h5 className="font-semibold text-gray-900">Cookies</h5>
                    <p className="text-sm text-gray-600">
                      <Badge variant="outline">13 mois</Badge> pour la plupart
                    </p>
                  </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    <strong>Note :</strong> Les données peuvent être conservées plus longtemps si nécessaire pour 
                    respecter nos obligations légales ou pour faire valoir nos droits.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Partage des données */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Avec qui partageons-nous vos données ?
              </CardTitle>
              <CardDescription>
                Destinataires de vos données personnelles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-green-900 mb-2">Partenaires de confiance</h5>
                  <p className="text-green-800 text-sm">
                    Nous partageons certaines données avec nos partenaires (établissements d'enseignement, exposants) 
                    uniquement dans la mesure nécessaire à l'organisation des événements et avec votre consentement.
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-blue-900 mb-2">Prestataires techniques</h5>
                  <p className="text-blue-800 text-sm">
                    Nous utilisons des prestataires techniques (hébergement, email, analyse) qui traitent vos données 
                    en tant que sous-traitants et dans le respect strict de nos instructions.
                  </p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-red-900 mb-2">Autorités légales</h5>
                  <p className="text-red-800 text-sm">
                    Nous pouvons être amenés à communiquer vos données aux autorités compétentes lorsque cela est 
                    requis par la loi ou pour protéger nos droits.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-900 mb-2">Engagement de non-commercialisation</h5>
                  <p className="text-gray-700 text-sm">
                    Nous ne vendons, ne louons et ne partageons pas vos données personnelles à des fins commerciales 
                    avec des tiers sans votre consentement explicite.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vos droits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Vos droits sur vos données
              </CardTitle>
              <CardDescription>
                Droits RGPD dont vous disposez sur vos données personnelles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Eye className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">Droit d'accès</h5>
                      <p className="text-sm text-gray-600">
                        Demander une copie de vos données personnelles.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Settings className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">Droit de rectification</h5>
                      <p className="text-sm text-gray-600">
                        Corriger des données inexactes ou incomplètes.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-red-100 p-2 rounded-full">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">Droit de suppression</h5>
                      <p className="text-sm text-gray-600">
                        Demander la suppression de vos données.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Lock className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">Droit de limitation</h5>
                      <p className="text-sm text-gray-600">
                        Limiter le traitement de vos données.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-orange-100 p-2 rounded-full">
                      <Download className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">Droit de portabilité</h5>
                      <p className="text-sm text-gray-600">
                        Recevoir vos données dans un format réutilisable.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <AlertCircle className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">Droit d'opposition</h5>
                      <p className="text-sm text-gray-600">
                        Vous opposer au traitement de vos données.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h5 className="font-semibold text-blue-900 mb-2">Comment exercer vos droits ?</h5>
                <p className="text-blue-800 text-sm">
                  Pour exercer vos droits, contactez-nous à l'adresse : 
                  <span className="block mt-1 font-medium">dpo@atlantisevents.fr</span>
                  Nous vous répondrons dans un délai d'un mois maximum.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Sécurité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Comment protégeons-nous vos données ?
              </CardTitle>
              <CardDescription>
                Mesures de sécurité mises en place
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Chiffrement SSL/TLS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Contrôle d'accès strict</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Sauvegardes régulières</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Mises à jour de sécurité</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Formation du personnel</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Audit de sécurité réguliers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Plan de réponse aux incidents</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Hébergeur certifié</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cookie className="h-5 w-5" />
                Politique de cookies
              </CardTitle>
              <CardDescription>
                Utilisation des cookies sur notre site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Qu'est-ce qu'un cookie ?</h4>
                <p className="text-gray-700 text-sm">
                  Un cookie est un petit fichier texte déposé sur votre appareil lorsque vous visitez notre site. 
                  Il nous permet de reconnaître votre appareil et de mémoriser certaines préférences.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-green-900 mb-2">Cookies nécessaires</h5>
                  <p className="text-green-800 text-sm">
                    Essentiels au fonctionnement du site. Ils ne peuvent pas être désactivés.
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-blue-900 mb-2">Cookies analytiques</h5>
                  <p className="text-blue-800 text-sm">
                    Nous aident à comprendre comment vous utilisez notre site pour l'améliorer.
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-purple-900 mb-2">Cookies fonctionnels</h5>
                  <p className="text-purple-800 text-sm">
                    Mémorisent vos préférences pour améliorer votre expérience.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-semibold text-gray-900 mb-2">Gestion des cookies</h5>
                <p className="text-gray-700 text-sm">
                  Vous pouvez gérer vos préférences de cookies via notre bandeau de consentement ou dans les 
                  paramètres de votre navigateur. Cependant, désactiver certains cookies peut affecter le 
                  fonctionnement du site.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Modifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Modifications de cette politique
              </CardTitle>
              <CardDescription>
                Mises à jour de notre politique de confidentialité
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. 
                Les modifications seront publiées sur cette page avec une date de mise à jour.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>Nous vous recommandons de consulter régulièrement cette page</strong> pour rester informé 
                  des éventuelles modifications. En cas de changement significatif, nous vous en informerons 
                  par email ou via une notification sur notre site.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact DPO
              </CardTitle>
              <CardDescription>
                Pour toute question sur cette politique de confidentialité
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <h5 className="font-semibold text-green-900 mb-4">Délégué à la Protection des Données</h5>
                <div className="space-y-2">
                  <p className="flex items-center justify-center gap-2 text-green-800">
                    <Mail className="h-4 w-4" />
                    <span>dpo@atlantisevents.fr</span>
                  </p>
                  <p className="flex items-center justify-center gap-2 text-green-800">
                    <Phone className="h-4 w-4" />
                    <span>+33 1 23 45 67 89</span>
                  </p>
                  <p className="flex items-center justify-center gap-2 text-green-800">
                    <Calendar className="h-4 w-4" />
                    <span>Réponse sous 30 jours maximum</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}