"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Timer, MapPin } from "lucide-react";

interface CompteARebours {
  id: string;
  titre: string;
  description?: string;
  lieu?: string;
  ville?: string;
  dateCible: string;
  dateDebut?: string;
  dateFin?: string;
  actif: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CompteAReboursProps {
  className?: string;
}

export default function CompteARebours({ className = "" }: CompteAReboursProps) {
  const [compteARebours, setCompteARebours] = useState<CompteARebours | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    fetchCompteARebours();
  }, []);

  useEffect(() => {
    if (!compteARebours) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const targetDate = new Date(compteARebours.dateCible).getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        // Le compte à rebours est terminé
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Calculer immédiatement
    calculateTimeLeft();
    
    // Mettre à jour chaque seconde
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [compteARebours]);

  const fetchCompteARebours = async () => {
    try {
      const response = await fetch('/api/compte-a-rebours');
      if (response.ok) {
        const data = await response.json();
        setCompteARebours(data.data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du compte à rebours:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpired = () => {
    if (!compteARebours) return false;
    return new Date(compteARebours.dateCible) < new Date();
  };

  if (loading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="text-center">
                  <div className="h-8 bg-gray-200 rounded w-full mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!compteARebours) {
    return null; // Ne pas afficher s'il n'y a pas de compte à rebours actif
  }

  return (
    <Card className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white ${className}`}>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-xl">
          <Timer className="h-6 w-6" />
          {compteARebours.titre}
        </CardTitle>
        {compteARebours.description && (
          <CardDescription className="text-blue-100">
            {compteARebours.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 text-sm text-blue-100 mb-2">
            <Calendar className="h-4 w-4" />
            <span>Événement le {formatDate(compteARebours.dateCible)}</span>
          </div>
          {compteARebours.dateFin && (
            <div className="flex items-center justify-center gap-2 text-sm text-blue-100 mb-2">
              <Calendar className="h-4 w-4" />
              <span>Jusqu'au {formatDate(compteARebours.dateFin)}</span>
            </div>
          )}
          {(compteARebours.lieu || compteARebours.ville) && (
            <div className="flex items-center justify-center gap-2 text-sm text-blue-100 mb-2">
              <MapPin className="h-4 w-4" />
              <span>
                {compteARebours.lieu}
                {compteARebours.lieu && compteARebours.ville && ", "}
                {compteARebours.ville}
              </span>
            </div>
          )}
          {isExpired() ? (
            <Badge variant="secondary" className="bg-yellow-500 text-white">
              Événement terminé
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-green-500 text-white">
              À venir
            </Badge>
          )}
        </div>

        {!isExpired() && (
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <div className="text-2xl font-bold">{timeLeft.days}</div>
              <div className="text-xs text-blue-100">Jours</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <div className="text-2xl font-bold">{timeLeft.hours}</div>
              <div className="text-xs text-blue-100">Heures</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <div className="text-2xl font-bold">{timeLeft.minutes}</div>
              <div className="text-xs text-blue-100">Minutes</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <div className="text-2xl font-bold">{timeLeft.seconds}</div>
              <div className="text-xs text-blue-100">Secondes</div>
            </div>
          </div>
        )}

        {isExpired() && (
          <div className="text-center py-4">
            <Clock className="h-12 w-12 mx-auto mb-2 text-blue-200" />
            <p className="text-blue-100">Cet événement est maintenant terminé.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}