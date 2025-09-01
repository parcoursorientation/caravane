"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ExternalLink, Search, Filter, GraduationCap, Building2, CalendarDays, Globe, Clock, Users, BookOpen, Trophy, MapPin } from "lucide-react";
import Layout from "@/components/layout/Layout";

interface Exposant {
  id: string;
  nom: string;
  description: string;
  domaine: string;
  logo?: string;
  siteWeb?: string;
  statutConfirmation: "CONFIRME" | "EN_ATTENTE";
  programmes: Array<{
    id: string;
    titre: string;
    description: string;
    heure: string;
    duree: string;
    lieu: string;
    type: "PRESENTATION" | "ATELIER" | "TEMOIGNAGE" | "VISITE" | "DEMONSTRATION" | "ENTRETIEN" | "PARTENARIAT" | "CLOTURE";
    public: string;
    animateur: string;
    ordre: number;
  }>;
  evenements: Array<{
    id: string;
    date: string | Date;
    heureDebut: string | Date;
    heureFin: string | Date;
    lycee: {
      id: string;
      nom: string;
      adresse: string;
      type: "PUBLIC" | "PRIVE";
    };
  }>;
}

export default function ExposantsPage() {
  const [exposants, setExposants] = useState<Exposant[]>([]);
  const [filteredExposants, setFilteredExposants] = useState<Exposant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [domaineFilter, setDomaineFilter] = useState<string>("TOUS");
  const [selectedExposant, setSelectedExposant] = useState<Exposant | null>(null);
  const [showProgrammeComplet, setShowProgrammeComplet] = useState(false);

  // Récupérer les données depuis l'API
  useEffect(() => {
    const fetchExposants = async () => {
      try {
        console.log('🔄 Récupération des exposants depuis l\'API...');
        const response = await fetch('/api/exposants-public');
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ ${data.data.length} exposants récupérés depuis l'API`);
          setExposants(data.data);
          setFilteredExposants(data.data);
        } else {
          console.error('❌ Erreur lors de la récupération des exposants:', response.status);
          // En cas d'erreur, on utilise un tableau vide
          setExposants([]);
          setFilteredExposants([]);
        }
      } catch (error) {
        console.error('❌ Erreur de connexion au serveur:', error);
        // En cas d'erreur, on utilise un tableau vide
        setExposants([]);
        setFilteredExposants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExposants();
  }, []);

  useEffect(() => {
    let filtered = exposants;

    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(exposant =>
        exposant.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exposant.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exposant.domaine.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrer par domaine
    if (domaineFilter !== "TOUS") {
      filtered = filtered.filter(exposant => exposant.domaine === domaineFilter);
    }

    setFilteredExposants(filtered);
  }, [exposants, searchTerm, domaineFilter]);

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (date: string | Date) => {
    // Si c'est une chaîne au format HH:MM, la retourner directement
    if (typeof date === 'string' && date.includes(':') && date.length <= 5) {
      return date;
    }
    // Sinon, essayer de parser comme Date (pour la compatibilité avec les anciennes données)
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  interface ProgrammeCompletExposantProps {
    exposant: Exposant | null;
  }

  const ProgrammeCompletExposant = ({ exposant }: ProgrammeCompletExposantProps) => {
    if (!exposant) {
      return <div className="text-center py-8 text-gray-500">Aucun exposant sélectionné</div>;
    }

    // Utiliser les données réelles de la base de données
    const programmeDetaille = exposant.programmes;

    const getTypeIcon = (type: string) => {
      switch (type) {
        case 'PRESENTATION': return <BookOpen className="h-4 w-4" />;
        case 'ATELIER': return <Trophy className="h-4 w-4" />;
        case 'TEMOIGNAGE': return <Users className="h-4 w-4" />;
        case 'VISITE': return <MapPin className="h-4 w-4" />;
        case 'DEMONSTRATION': return <BookOpen className="h-4 w-4" />;
        case 'ENTRETIEN': return <Users className="h-4 w-4" />;
        case 'PARTENARIAT': return <Trophy className="h-4 w-4" />;
        case 'CLOTURE': return <Trophy className="h-4 w-4" />;
        default: return <Clock className="h-4 w-4" />;
      }
    };

    const getTypeColor = (type: string) => {
      switch (type) {
        case 'PRESENTATION': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'ATELIER': return 'bg-orange-100 text-orange-800 border-orange-200';
        case 'TEMOIGNAGE': return 'bg-green-100 text-green-800 border-green-200';
        case 'VISITE': return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'DEMONSTRATION': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
        case 'ENTRETIEN': return 'bg-pink-100 text-pink-800 border-pink-200';
        case 'PARTENARIAT': return 'bg-red-100 text-red-800 border-red-200';
        case 'CLOTURE': return 'bg-teal-100 text-teal-800 border-teal-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    return (
      <div className="space-y-6">
        {/* Résumé de la journée */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-green-600" />
            Programme de la journée - {exposant.nom}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-600" />
              <span><strong>Activités:</strong> {programmeDetaille.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-600" />
              <span><strong>Domaine:</strong> {exposant.domaine}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-green-600" />
              <span><strong>Statut:</strong> {exposant.statutConfirmation === 'CONFIRME' ? 'Confirmé' : 'En attente'}</span>
            </div>
          </div>
        </div>

        {/* Programme détaillé */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4">Détail des interventions</h3>
          <div className="space-y-3">
            {programmeDetaille.map((activite, index) => (
              <div 
                key={activite.id} 
                className="border rounded-lg p-4 hover:shadow-md transition-all-300 animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-green-600">{activite.heure}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600">{activite.duree}</span>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getTypeColor(activite.type)}`}
                      >
                        {getTypeIcon(activite.type)}
                        <span className="ml-1 capitalize">{activite.type}</span>
                      </Badge>
                    </div>
                    
                    <h4 className="font-semibold text-lg mb-2">{activite.titre}</h4>
                    <p className="text-gray-600 mb-3">{activite.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{activite.lieu}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{activite.public}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        <span>{activite.animateur}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Informations pratiques spécifiques à l'exposant */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-gray-600" />
            Informations pratiques
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Participation</h4>
              <p className="text-gray-600">
                Notre équipe sera présente pendant toute la durée de l'événement. 
                N'hésitez pas à nous rendre visite à notre stand pour toutes vos questions.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Documentation</h4>
              <p className="text-gray-600">
                Des brochures, plaquettes et documents informatifs seront disponibles 
                gratuitement à notre stand.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Contact</h4>
              <p className="text-gray-600">
                Pour toute question: contact@{exposant.nom.toLowerCase().replace(/\s+/g, '.')}<br />
                Téléphone: +212 5XX XXX XXX
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Avantages exclusifs</h4>
              <p className="text-gray-600">
                Inscriptions prioritaires et réductions spéciales pour les visiteurs 
                de l'événement.
              </p>
            </div>
          </div>
        </div>

        {/* Présence dans les lycées */}
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            Présence dans les établissements
          </h3>
          <div className="space-y-3">
            {exposant.evenements.map((evenement) => (
              <div key={evenement.id} className="bg-white rounded-lg p-3 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{evenement.lycee.nom}</div>
                    <div className="text-xs text-gray-600">
                      {formatDate(evenement.date)} • {formatTime(evenement.heureDebut)}-{formatTime(evenement.heureFin)}
                    </div>
                  </div>
                  <Badge variant={evenement.lycee.type === "PUBLIC" ? "default" : "secondary"} className="text-xs">
                    {evenement.lycee.type === "PUBLIC" ? "Public" : "Privé"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const getUniqueDomaines = () => {
    const domaines = exposants.map(exposant => exposant.domaine);
    return [...new Set(domaines)];
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des exposants...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-safe text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Exposants</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Découvrez les instituts et écoles de formation qui participent à l'événement
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher un exposant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={domaineFilter} onValueChange={setDomaineFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Domaine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TOUS">Tous les domaines</SelectItem>
                  {getUniqueDomaines().map((domaine) => (
                    <SelectItem key={domaine} value={domaine}>{domaine}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-gray-600">
              {filteredExposants.length} exposant{filteredExposants.length > 1 ? 's' : ''} trouvé{filteredExposants.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Grille des exposants */}
        {filteredExposants.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun exposant trouvé</h3>
              <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredExposants.map((exposant) => (
              <Card key={exposant.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-sm leading-tight">{exposant.nom}</CardTitle>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {exposant.domaine}
                      </Badge>
                    </div>
                    <Badge 
                      variant={exposant.statutConfirmation === "CONFIRME" ? "default" : "secondary"} 
                      className="text-xs"
                    >
                      {exposant.statutConfirmation === "CONFIRME" ? "Confirmé" : "En attente"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="w-20 h-20 mx-auto bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {exposant.logo ? (
                        <img 
                          src={exposant.logo} 
                          alt={`Logo de ${exposant.nom}`}
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <GraduationCap className="h-10 w-10 text-gray-400" />
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-600 line-clamp-3">
                      {exposant.description}
                    </p>
                    
                    <div className="text-xs text-gray-500">
                      {exposant.evenements.length} événement{exposant.evenements.length > 1 ? 's' : ''}
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full" size="sm" onClick={() => setSelectedExposant(exposant)}>
                          Voir la fiche détaillée
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <GraduationCap className="h-5 w-5" />
                            {exposant.nom}
                          </DialogTitle>
                          <DialogDescription>
                            Fiche détaillée de l'établissement
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6">
                          {/* Logo et informations de base */}
                          <div className="flex flex-col sm:flex-row items-start gap-4">
                            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                              {exposant.logo ? (
                                <img 
                                  src={exposant.logo} 
                                  alt={`Logo de ${exposant.nom}`}
                                  className="w-full h-full object-contain p-2"
                                />
                              ) : (
                                <GraduationCap className="h-12 w-12 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-wrap gap-2 mb-2">
                                <Badge variant="outline">{exposant.domaine}</Badge>
                                <Badge 
                                  variant={exposant.statutConfirmation === "CONFIRME" ? "default" : "secondary"}
                                >
                                  {exposant.statutConfirmation === "CONFIRME" ? "Participation confirmée" : "En attente de confirmation"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Présentation</h4>
                            <p className="text-gray-600 leading-relaxed">{exposant.description}</p>
                          </div>
                          
                          {exposant.siteWeb && (
                            <div>
                              <h4 className="font-medium mb-2 flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                Site web
                              </h4>
                              <a 
                                href={exposant.siteWeb} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                              >
                                {exposant.siteWeb}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          )}
                          
                          <div>
                            <h4 className="font-medium mb-3 flex items-center gap-2">
                              <CalendarDays className="h-4 w-4" />
                              Présent aux événements ({exposant.evenements.length})
                            </h4>
                            <div className="space-y-3">
                              {exposant.evenements.map((evenement) => (
                                <div key={evenement.id} className="bg-gray-50 rounded-lg p-4">
                                  <div className="font-medium text-sm mb-1">
                                    {formatDate(evenement.date)}
                                  </div>
                                  <div className="text-xs text-gray-600 mb-2">
                                    {formatTime(evenement.heureDebut)} - {formatTime(evenement.heureFin)}
                                  </div>
                                  <div className="flex items-center gap-2 text-xs">
                                    <Building2 className="h-3 w-3" />
                                    <span>{evenement.lycee.nom}</span>
                                    <Badge variant={evenement.lycee.type === "PUBLIC" ? "default" : "secondary"} className="text-xs">
                                      {evenement.lycee.type === "PUBLIC" ? "Public" : "Privé"}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex gap-2 pt-4">
                            <Button 
                              className="flex-1"
                              onClick={() => setShowProgrammeComplet(true)}
                            >
                              <CalendarDays className="h-4 w-4 mr-2" />
                              Voir le programme complet
                            </Button>
                            {exposant.siteWeb && (
                              <Button variant="outline" asChild>
                                <a href={exposant.siteWeb} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Site web
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    {/* Dialogue pour le programme complet */}
                    <Dialog open={showProgrammeComplet} onOpenChange={setShowProgrammeComplet}>
                      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2 animate-fadeIn">
                            <CalendarDays className="h-5 w-5" />
                            Programme Complet - {selectedExposant?.nom}
                          </DialogTitle>
                          <DialogDescription className="animate-fadeIn animate-delay-100">
                            Détail des interventions et activités prévues pendant les portes ouvertes
                          </DialogDescription>
                        </DialogHeader>
                        
                        <ProgrammeCompletExposant exposant={selectedExposant} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
