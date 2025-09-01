"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building,
  Users,
  Globe,
  Star,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Filter,
} from "lucide-react";
import Layout from "@/components/layout/Layout";

interface Partenaire {
  id: string;
  nom: string;
  type: "ORGANISATEUR" | "PARTENAIRE" | "SPONSOR" | "MEDIA" | "INSTITUTION";
  description?: string;
  logo?: string;
  siteWeb?: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  ville?: string;
  pays?: string;
  statut: "ACTIF" | "INACTIF" | "EN_ATTENTE";
  ordre: number;
  createdAt: string;
  updatedAt: string;
}

export default function PartenairesPage() {
  const [partenaires, setPartenaires] = useState<Partenaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("all");

  useEffect(() => {
    fetchPartenaires();
  }, []);

  const fetchPartenaires = async () => {
    try {
      const response = await fetch("/api/partenaires-public");
      if (response.ok) {
        const data = await response.json();
        setPartenaires(data.data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des partenaires:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      ORGANISATEUR: "Organisateur",
      PARTENAIRE: "Partenaire",
      SPONSOR: "Sponsor",
      MEDIA: "Média",
      INSTITUTION: "Institution",
    };
    return labels[type] || type;
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      ORGANISATEUR: <Users className="h-5 w-5" />,
      PARTENAIRE: <Building className="h-5 w-5" />,
      SPONSOR: <Star className="h-5 w-5" />,
      MEDIA: <Globe className="h-5 w-5" />,
      INSTITUTION: <Building className="h-5 w-5" />,
    };
    return icons[type] || <Building className="h-5 w-5" />;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      ORGANISATEUR: "bg-blue-100 text-blue-800",
      PARTENAIRE: "bg-green-100 text-green-800",
      SPONSOR: "bg-yellow-100 text-yellow-800",
      MEDIA: "bg-purple-100 text-purple-800",
      INSTITUTION: "bg-gray-100 text-gray-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const filteredPartenaires =
    selectedType === "all"
      ? partenaires
      : partenaires.filter((p) => p.type === selectedType);

  const groupedPartenaires = filteredPartenaires.reduce((acc, partenaire) => {
    const type = partenaire.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(partenaire);
    return acc;
  }, {} as Record<string, Partenaire[]>);

  const typeOrder = [
    "ORGANISATEUR",
    "PARTENAIRE",
    "SPONSOR",
    "MEDIA",
    "INSTITUTION",
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-safe text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Nos Partenaires
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Découvrez les organisateurs, partenaires et sponsors qui contribuent
            au succès des Portes Ouvertes
          </p>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filtres */}
        <div className="mb-8">
          <div className="flex items-center gap-4 flex-wrap">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les types</option>
              <option value="ORGANISATEUR">Organisateurs</option>
              <option value="PARTENAIRE">Partenaires</option>
              <option value="SPONSOR">Sponsors</option>
              <option value="MEDIA">Médias</option>
              <option value="INSTITUTION">Institutions</option>
            </select>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          <Card className="text-center">
            <CardHeader>
              <Building className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-2xl">{partenaires.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Total</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-2xl">
                {partenaires.filter((p) => p.type === "ORGANISATEUR").length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Organisateurs</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <CardTitle className="text-2xl">
                {partenaires.filter((p) => p.type === "PARTENAIRE").length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Partenaires</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Globe className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-2xl">
                {partenaires.filter((p) => p.type === "SPONSOR").length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Sponsors</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Building className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <CardTitle className="text-2xl">
                {partenaires.filter((p) => p.type === "MEDIA").length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Médias</p>
            </CardContent>
          </Card>
        </div>

        {/* Partenaires par type */}
        {Object.keys(groupedPartenaires).length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun partenaire trouvé
              </h3>
              <p className="text-gray-500">
                Aucun partenaire ne correspond à vos critères de filtrage.
              </p>
            </CardContent>
          </Card>
        ) : (
          typeOrder.map((type) => {
            if (!groupedPartenaires[type]) return null;

            return (
              <div key={type} className="mb-12">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    {getTypeIcon(type)}
                    <h2 className="text-2xl font-bold text-gray-900">
                      {getTypeLabel(type)}
                    </h2>
                  </div>
                  <div className="h-1 w-20 bg-blue-600 rounded"></div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedPartenaires[type].map((partenaire) => (
                    <Card
                      key={partenaire.id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                          {partenaire.logo ? (
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                              <img
                                src={partenaire.logo}
                                alt={partenaire.nom}
                                className="w-12 h-12 object-contain"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                              {getTypeIcon(type)}
                            </div>
                          )}
                        </div>
                        <CardTitle className="text-lg">
                          {partenaire.nom}
                        </CardTitle>
                        <CardDescription>
                          <Badge className={getTypeColor(partenaire.type)}>
                            {getTypeLabel(partenaire.type)}
                          </Badge>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {partenaire.description && (
                          <p className="text-gray-600 text-sm mb-4">
                            {partenaire.description}
                          </p>
                        )}

                        <div className="space-y-2 mb-4">
                          {partenaire.email && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="h-4 w-4" />
                              <span>{partenaire.email}</span>
                            </div>
                          )}

                          {partenaire.telephone && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="h-4 w-4" />
                              <span>{partenaire.telephone}</span>
                            </div>
                          )}

                          {(partenaire.ville || partenaire.pays) && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span>
                                {partenaire.ville}
                                {partenaire.ville && partenaire.pays && ", "}
                                {partenaire.pays}
                              </span>
                            </div>
                          )}
                        </div>

                        {partenaire.siteWeb && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() =>
                              window.open(partenaire.siteWeb, "_blank")
                            }
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Visiter le site web
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })
        )}

        {/* Section devenir partenaire */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Devenir Partenaire</CardTitle>
            <CardDescription>
              Vous souhaitez rejoindre notre réseau de partenaires et sponsors ?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">
                  Pourquoi devenir partenaire ?
                </h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Visibilité auprès de milliers de visiteurs</li>
                  <li>• Opportunités de networking</li>
                  <li>• Participation à un événement d'envergure</li>
                  <li>• Impact positif sur l'orientation des jeunes</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Comment nous contacter ?</h4>
                <p className="text-gray-600 text-sm mb-3">
                  Envoyez-nous un message via notre formulaire de contact en
                  sélectionnant "Partenariat".
                </p>
                <Button asChild>
                  <a href="/contact">Nous contacter</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
