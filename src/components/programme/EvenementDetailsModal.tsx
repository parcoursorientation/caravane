"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Building,
  Phone,
  Mail,
  ExternalLink,
  User,
  Presentation,
  BookOpen,
} from "lucide-react";

interface Evenement {
  id: string;
  nom?: string;
  date: string;
  dateDebut?: string;
  dateFin?: string;
  heureDebut: string;
  heureFin: string;
  ville?: string;
  lycee: {
    id: string;
    nom: string;
    adresse: string;
  };
  exposantsCount: number;
}

interface Programme {
  id: string;
  titre: string;
  description: string;
  heure: string;
  duree: string;
  lieu: string;
  type: string;
  public: string;
  animateur: string;
  ordre: number;
}

interface Exposant {
  id: string;
  nom: string;
  description: string;
  domaine: string;
  logo?: string;
  siteWeb?: string;
  programmes: Programme[];
}

interface EvenementDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  evenement: Evenement;
}

export default function EvenementDetailsModal({
  isOpen,
  onClose,
  evenement,
}: EvenementDetailsModalProps) {
  const [exposants, setExposants] = useState<Exposant[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && evenement) {
      fetchExposantsDetails();
    }
  }, [isOpen, evenement]);

  const fetchExposantsDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/evenements/${evenement.id}/exposants`);
      if (response.ok) {
        const data = await response.json();
        setExposants(data.data || []);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des exposants:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatHeure = (heure: string) => {
    return heure.slice(0, 5);
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "presentation":
        return <Presentation className="h-4 w-4" />;
      case "atelier":
        return <BookOpen className="h-4 w-4" />;
      case "conference":
        return <Users className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "presentation":
        return "bg-blue-100 text-blue-800";
      case "atelier":
        return "bg-green-100 text-green-800";
      case "conference":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {evenement.nom || `Portes Ouvertes - ${evenement.lycee.nom}`}
          </DialogTitle>
          <DialogDescription>
            Détails complets de l'événement et programme des exposants
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-gray-600">
                      {formatDate(evenement.date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Horaires</p>
                    <p className="text-gray-600">
                      {formatHeure(evenement.heureDebut)} -{" "}
                      {formatHeure(evenement.heureFin)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Établissement</p>
                    <p className="text-gray-600">{evenement.lycee.nom}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium">Adresse</p>
                    <p className="text-gray-600">{evenement.lycee.adresse}</p>
                    {evenement.ville && (
                      <p className="text-gray-500 text-sm">{evenement.ville}</p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-orange-600" />
                  <span className="font-medium">
                    {evenement.exposantsCount} exposant
                    {evenement.exposantsCount > 1 ? "s" : ""} présent
                    {evenement.exposantsCount > 1 ? "s" : ""}
                  </span>
                </div>
                <Button
                  onClick={() => {
                    onClose();
                    window.location.href = `/inscription?evenement=${evenement.id}`;
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  S'inscrire à cet événement
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Programme des exposants */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Programme des exposants
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : exposants.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>
                    Aucun exposant n'a encore publié son programme pour cet
                    événement.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {exposants.map((exposant) => (
                    <div key={exposant.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {exposant.logo && (
                            <img
                              src={exposant.logo}
                              alt={`Logo ${exposant.nom}`}
                              className="w-12 h-12 object-contain rounded"
                            />
                          )}
                          <div>
                            <h4 className="font-semibold text-lg">
                              {exposant.nom}
                            </h4>
                            <p className="text-gray-600">{exposant.domaine}</p>
                          </div>
                        </div>
                        {exposant.siteWeb && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              window.open(exposant.siteWeb, "_blank")
                            }
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Site web
                          </Button>
                        )}
                      </div>

                      <p className="text-gray-700 mb-4">
                        {exposant.description}
                      </p>

                      {exposant.programmes.length > 0 && (
                        <div>
                          <h5 className="font-medium mb-3">
                            Activités programmées :
                          </h5>
                          <div className="space-y-3">
                            {exposant.programmes
                              .sort((a, b) => a.ordre - b.ordre)
                              .map((programme) => (
                                <div
                                  key={programme.id}
                                  className="bg-gray-50 rounded-lg p-3"
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <h6 className="font-medium">
                                      {programme.titre}
                                    </h6>
                                    <div className="flex items-center gap-2">
                                      <Badge
                                        className={getTypeBadgeColor(
                                          programme.type
                                        )}
                                      >
                                        {getTypeIcon(programme.type)}
                                        <span className="ml-1">
                                          {programme.type}
                                        </span>
                                      </Badge>
                                      <Badge variant="outline">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {formatHeure(programme.heure)}
                                      </Badge>
                                    </div>
                                  </div>

                                  <p className="text-gray-600 text-sm mb-2">
                                    {programme.description}
                                  </p>

                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-500">
                                    <div>
                                      <span className="font-medium">
                                        Durée:
                                      </span>{" "}
                                      {programme.duree}
                                    </div>
                                    <div>
                                      <span className="font-medium">Lieu:</span>{" "}
                                      {programme.lieu}
                                    </div>
                                    <div>
                                      <span className="font-medium">
                                        Public:
                                      </span>{" "}
                                      {programme.public}
                                    </div>
                                    <div>
                                      <span className="font-medium">
                                        Animateur:
                                      </span>{" "}
                                      {programme.animateur}
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
