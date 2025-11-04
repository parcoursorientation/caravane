import Link from "next/link";
import { Phone, Mail, MapPin, CalendarDays, Users, Building2 } from "lucide-react";

interface FooterProps {
  isAdmin?: boolean;
}

export default function Footer({ isAdmin = false }: FooterProps) {
  if (isAdmin) {
    return (
      <footer className="bg-gray-900 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              &copy; 2025 ATLANTIS EVENTS. Administration - Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ATLANTIS EVENTS</h3>
            <p className="text-gray-400 mb-4">
              Votre partenaire pour des événements d'orientation réussis.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">AE</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact rapide</h3>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>+212 679-55-28-24</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>+212 628-47-31-53</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>info@atlantis-events.pro</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>contact@atlantis-events.pro</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <div className="space-y-2">
              <Link href="/programme" className="block text-gray-400 hover:text-white transition-colors">
                <CalendarDays className="h-4 w-4 inline mr-2" />
                Programme
              </Link>
              <Link href="/inscription" className="block text-gray-400 hover:text-white transition-colors">
                <Users className="h-4 w-4 inline mr-2" />
                Inscription
              </Link>
              <Link href="/lycees" className="block text-gray-400 hover:text-white transition-colors">
                <Building2 className="h-4 w-4 inline mr-2" />
                Lycées
              </Link>
              <Link href="/exposants" className="block text-gray-400 hover:text-white transition-colors">
                <Users className="h-4 w-4 inline mr-2" />
                Exposants
              </Link>
              <Link href="/contact" className="block text-gray-400 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Informations</h3>
            <div className="space-y-2">
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  123, Avenue Mohammed VI<br />
                  Tanger 90000, Maroc
                </span>
              </div>
              <div className="text-gray-400 text-sm">
                <strong>Horaires :</strong><br />
                Lundi - Vendredi: 09:00 - 18:00<br />
                Samedi: 09:00 - 13:00
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; 2025 ATLANTIS EVENTS. Tous droits réservés.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="/mentions-legales" className="text-gray-400 hover:text-white transition-colors">
                Mentions légales
              </Link>
              <Link href="/politique-confidentialite" className="text-gray-400 hover:text-white transition-colors">
                Politique de confidentialité
              </Link>
              <Link href="/cgu" className="text-gray-400 hover:text-white transition-colors">
                CGU
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
