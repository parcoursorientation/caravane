import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/layout/Layout";
import { 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  Shield, 
  FileText, 
  Users,
  Calendar,
  MapPin
} from "lucide-react";

export default function MentionsLegales() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Mentions Légales</h1>
          <p className="text-lg text-gray-600">
            Informations légales et conditions d'utilisation du site
          </p>
        </div>

        <div className="space-y-8">
          {/* Éditeur du site */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Éditeur du site
              </CardTitle>
              <CardDescription>
                Informations sur l'entité qui édite le site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Raison sociale</h4>
                  <p className="text-gray-700">ATLANTIS EVENTS SARL</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Forme juridique</h4>
                  <p className="text-gray-700">SARL au capital de 10 000€</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Adresse</h4>
                  <p className="text-gray-700 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    123 Avenue de l'Éducation<br />
                    75000 Paris, France
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Téléphone</h4>
                  <p className="text-gray-700 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    +33 1 23 45 67 89
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
                  <p className="text-gray-700 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    contact@atlantisevents.fr
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Site web</h4>
                  <p className="text-gray-700 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    www.atlantisevents.fr
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Directeur de publication */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Directeur de publication
              </CardTitle>
              <CardDescription>
                Responsable de la rédaction et du contenu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Nom</h4>
                  <p className="text-gray-700">Jean Dupont</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Fonction</h4>
                  <p className="text-gray-700">Gérant</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
                  <p className="text-gray-700 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    jean.dupont@atlantisevents.fr
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Téléphone</h4>
                  <p className="text-gray-700 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    +33 1 23 45 67 90
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hébergeur */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Hébergeur du site
              </CardTitle>
              <CardDescription>
                Entreprise qui héberge le site web
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Société</h4>
                  <p className="text-gray-700">OVH SAS</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Adresse</h4>
                  <p className="text-gray-700 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    2 rue Kellermann<br />
                    59100 Roubaix, France
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Téléphone</h4>
                  <p className="text-gray-700 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    +33 9 72 10 10 07
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Site web</h4>
                  <p className="text-gray-700 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    www.ovh.com
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Propriété intellectuelle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Propriété intellectuelle
              </CardTitle>
              <CardDescription>
                Droits d'auteur et conditions d'utilisation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Contenu du site</h4>
                <p className="text-gray-700 mb-4">
                  L'ensemble des éléments de ce site (textes, images, vidéos, logos, etc.) est la propriété exclusive de ATLANTIS EVENTS SARL ou de ses partenaires. Toute reproduction, distribution, modification ou utilisation de ces éléments sans autorisation écrite préalable est strictement interdite.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Marques déposées</h4>
                <p className="text-gray-700 mb-4">
                  Les noms de produits et d'entreprises mentionnés sur ce site sont des marques déposées de leurs propriétaires respectifs.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Liens hypertextes</h4>
                <p className="text-gray-700">
                  Ce site peut contenir des liens vers des sites tiers. ATLANTIS EVENTS SARL ne peut être tenue responsable du contenu de ces sites externes. L'utilisateur navigue sur ces sites à ses propres risques.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Protection des données */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Protection des données personnelles
              </CardTitle>
              <CardDescription>
                Conformité avec le RGPD
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Collecte des données</h4>
                <p className="text-gray-700 mb-4">
                  Les informations personnelles collectées sur ce site (nom, email, téléphone, etc.) sont destinées exclusivement à l'organisation des événements par ATLANTIS EVENTS SARL et à la communication avec les participants.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Droits des utilisateurs</h4>
                <p className="text-gray-700 mb-4">
                  Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression, de limitation, d'opposition et de portabilité de vos données personnelles. Pour exercer ces droits, contactez-nous à l'adresse : 
                  <span className="block mt-2 font-medium">dpo@atlantisevents.fr</span>
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Conservation des données</h4>
                <p className="text-gray-700">
                  Les données personnelles sont conservées pendant une durée n'excédant pas celle nécessaire aux finalités pour lesquelles elles ont été collectées, conformément à notre politique de conservation des données.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Cookies et technologies similaires
              </CardTitle>
              <CardDescription>
                Utilisation des cookies sur le site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Types de cookies utilisés</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Techniques</Badge>
                    <span className="text-gray-700">Cookies nécessaires au fonctionnement du site</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Analytiques</Badge>
                    <span className="text-gray-700">Cookies pour mesurer l'audience et améliorer l'expérience utilisateur</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Fonctionnels</Badge>
                    <span className="text-gray-700">Cookies pour mémoriser vos préférences</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Gestion des cookies</h4>
                <p className="text-gray-700">
                  Vous pouvez configurer votre navigateur pour refuser les cookies ou être informé lorsque des cookies sont déposés. Cependant, certaines fonctionnalités du site pourraient ne pas fonctionner correctement sans cookies.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Conditions d'utilisation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Conditions d'utilisation
              </CardTitle>
              <CardDescription>
                Règles d'utilisation du site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Accès au site</h4>
                <p className="text-gray-700 mb-4">
                  L'accès à ce site est gratuit. ATLANTIS EVENTS SARL se réserve le droit de modifier, suspendre ou interrompre le site à tout moment sans préavis.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Responsabilités</h4>
                <p className="text-gray-700 mb-4">
                  L'utilisateur s'engage à utiliser le site conformément aux lois et réglementations en vigueur. ATLANTIS EVENTS SARL ne saurait être tenue responsable des dommages directs ou indirects résultant de l'utilisation du site.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Contenu utilisateur</h4>
                <p className="text-gray-700">
                  Les utilisateurs sont seuls responsables du contenu qu'ils publient sur le site. Ils s'engagent à ne pas diffuser de contenu illégal, diffamatoire, ou portant atteinte aux droits des tiers.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Mise à jour */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Mise à jour des mentions légales
              </CardTitle>
              <CardDescription>
                Date de dernière mise à jour
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="h-4 w-4" />
                Dernière mise à jour : 23 août 2025
              </div>
              <p className="text-gray-600 mt-2">
                Les mentions légales sont susceptibles d'être modifiées à tout moment. Nous vous invitons à les consulter régulièrement.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact pour les mentions légales */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Contact pour les mentions légales</CardTitle>
              <CardDescription>
                Pour toute question concernant ces mentions légales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="flex items-center justify-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>legal@atlantisevents.fr</span>
                </p>
                <p className="flex items-center justify-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+33 1 23 45 67 89</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}