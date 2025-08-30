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
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Filter,
  Download,
  FileText,
  Table,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import RapportProgramme from "@/components/programme/RapportProgramme";
import EvenementDetailsModal from "@/components/programme/EvenementDetailsModal";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
}

interface EvenementAvecExposants extends Evenement {
  exposantsCount: number;
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

export default function ProgrammePage() {
  const [evenements, setEvenements] = useState<EvenementAvecExposants[]>([]);
  const [exposants, setExposants] = useState<Exposant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("vue-classique");
  const [selectedEvenement, setSelectedEvenement] =
    useState<EvenementAvecExposants | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sélection manuelle d'événements pour le rapport
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
  const toggleEventSelection = (id: string, checked: boolean | string) => {
    setSelectedEventIds((prev) =>
      checked
        ? [...new Set([...prev, id])]
        : prev.filter((x) => x !== id)
    );
  };
  const clearSelection = () => setSelectedEventIds([]);
  const selectAll = () => setSelectedEventIds(evenements.map((e) => e.id));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [evenementsResponse, exposantsResponse] = await Promise.all([
        fetch("/api/evenements-public"),
        fetch("/api/exposants-public"),
      ]);

      if (evenementsResponse.ok) {
        const evenementsData = await evenementsResponse.json();
        setEvenements(evenementsData.data);
      }

      if (exposantsResponse.ok) {
        const exposantsData = await exposantsResponse.json();
        setExposants(exposantsData.data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
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
    return heure.slice(0, 5); // Format HH:MM
  };

  const formatISODate = (d: Date) => d.toISOString().split("T")[0];

  const getEventDates = (e: Evenement): string[] => {
    const start = e.dateDebut ? new Date(e.dateDebut) : new Date(e.date);
    const end = e.dateFin ? new Date(e.dateFin) : new Date(e.date);
    // Normalize to midnight to avoid timezone drift
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const dates: string[] = [];
    const cur = new Date(start);
    while (cur <= end) {
      dates.push(formatISODate(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return dates;
  };

  const getUniqueDates = () => {
    const allDates = evenements.flatMap(getEventDates);
    return [...new Set(allDates)].sort();
  };

  // Pour les événements multi-jours: n'afficher que sous le premier jour
  const isFirstDayForEvent = (e: EvenementAvecExposants, date: string) => {
    const start = e.dateDebut ? new Date(e.dateDebut) : new Date(e.date);
    start.setHours(0, 0, 0, 0);
    return date === formatISODate(start);
  };

  const filteredEvenements =
    selectedDate === "all"
      ? evenements
      : evenements.filter((e) => getEventDates(e).includes(selectedDate));

  const groupEvenementsByDate = () => {
    const grouped = filteredEvenements.reduce((acc, evenement) => {
      const dates = getEventDates(evenement);
      dates.forEach((date) => {
        if (!acc[date]) acc[date] = [];
        // Ajouter l'événement uniquement pour son premier jour
        if (isFirstDayForEvent(evenement, date)) {
          acc[date].push(evenement);
        }
      });
      return acc;
    }, {} as Record<string, EvenementAvecExposants[]>);

    // Trier les événements par heure de début
    Object.keys(grouped).forEach((date) => {
      grouped[date].sort((a, b) => a.heureDebut.localeCompare(b.heureDebut));
    });

    return grouped;
  };

  const getAllProgrammes = () => {
    const allProgrammes = exposants.flatMap((exposant) =>
      exposant.programmes.map((programme) => ({
        ...programme,
        exposant: {
          id: exposant.id,
          nom: exposant.nom,
          domaine: exposant.domaine,
          logo: exposant.logo,
        },
      }))
    );
    return allProgrammes;
  };

  const handleTelechargerProgramme = async () => {
    try {
      const element = document.getElementById("rapport-programme-cache");
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `programme-portes-ouvertes-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      // Fallback: try with a simpler approach
      try {
        const element = document.getElementById("rapport-programme-cache");
        if (!element) return;

        // Create a clean clone of the element
        const clone = element.cloneNode(true) as HTMLElement;
        clone.style.display = "block";
        clone.style.position = "absolute";
        clone.style.left = "-9999px";
        clone.style.top = "-9999px";
        document.body.appendChild(clone);

        const canvas = await html2canvas(clone, {
          scale: 2,
          backgroundColor: "#ffffff",
          logging: false,
        });

        document.body.removeChild(clone);

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        const fileName = `programme-portes-ouvertes-${
          new Date().toISOString().split("T")[0]
        }.pdf`;
        pdf.save(fileName);
      } catch (fallbackError) {
        console.error("Fallback PDF generation also failed:", fallbackError);
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  const allProgrammes = getAllProgrammes();
  const premierEvenement = evenements.length > 0 ? evenements[0] : undefined;

  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Programme des Portes Ouvertes
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Découvrez le calendrier complet des événements et le détail des
            programmes des exposants
          </p>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="vue-classique"
              className="flex items-center gap-2"
            >
              <CalendarDays className="h-4 w-4" />
              Vue classique
            </TabsTrigger>
            <TabsTrigger
              value="rapport-professionnel"
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Rapport professionnel
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vue-classique" className="mt-6">
            {/* Filtres et actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="flex items-center gap-4">
                <Filter className="h-5 w-5 text-gray-500" />
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Toutes les dates</option>
                  {getUniqueDates().map((date) => (
                    <option key={date} value={date}>
                      {formatDate(date)}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                onClick={handleTelechargerProgramme}
                className="flex items-center gap-2 bg-black text-white hover:bg-gray-800 cursor-pointer"
              >
                <Download className="h-4 w-4" />
                Télécharger le programme
              </Button>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="text-center">
                <CardHeader>
                  <CalendarDays className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">
                    {getUniqueDates().length}{" "}
                    {getUniqueDates().length > 1 ? "Journées" : "Journée"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">D'événements programmés</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <MapPin className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">
                    {new Set(evenements.map((e) => e.lycee.id)).size} Lycées
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Lycées organisateurs (lieux des événements)
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">
                    {evenements.reduce(
                      (total, e) => total + e.exposantsCount,
                      0
                    )}{" "}
                    Exposants
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Total attendus</p>
                </CardContent>
              </Card>
            </div>

            {/* Programme par date */}
            {Object.entries(groupEvenementsByDate()).length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucun événement trouvé
                  </h3>
                  <p className="text-gray-500">
                    Aucun événement ne correspond à vos critères de filtrage.
                  </p>
                </CardContent>
              </Card>
            ) : (
              Object.entries(groupEvenementsByDate()).map(
                ([date, evenementsDuJour]) => (
                  <div key={date} className="mb-12">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {formatDate(date)}
                      </h2>
                      <div className="h-1 w-20 bg-blue-600 rounded"></div>
                    </div>

                    <div className="grid gap-6">
                      {evenementsDuJour.map((evenement) => (
                        <Card
                          key={evenement.id}
                          className="hover:shadow-lg transition-shadow"
                        >
                          <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <Badge
                                    variant="secondary"
                                    className="bg-blue-100 text-blue-800"
                                  >
                                    {formatHeure(evenement.heureDebut)} -{" "}
                                    {formatHeure(evenement.heureFin)}
                                  </Badge>
                                  {evenement.dateDebut &&
                                    evenement.dateFin &&
                                    evenement.dateDebut !==
                                      evenement.dateFin && (
                                      <Badge
                                        variant="outline"
                                        className="ml-2 text-blue-800 border-blue-300"
                                      >
                                        {new Date(
                                          evenement.dateDebut
                                        ).toLocaleDateString("fr-FR", {
                                          day: "2-digit",
                                          month: "2-digit",
                                        })}
                                        {" → "}
                                        {new Date(
                                          evenement.dateFin
                                        ).toLocaleDateString("fr-FR", {
                                          day: "2-digit",
                                          month: "2-digit",
                                        })}
                                      </Badge>
                                      <Badge variant="outline" className="ml-2 text-purple-800 border-purple-300">
                                        {Math.round((new Date(evenement.dateFin).setHours(0,0,0,0) - new Date(evenement.dateDebut).setHours(0,0,0,0)) / (1000*60*60*24)) + 1} jours
                                      </Badge>
                                    )}
                                  {evenement.exposantsCount > 0 && (
                                    <Badge
                                      variant="outline"
                                      className="text-green-600 border-green-600"
                                    >
                                      {evenement.exposantsCount} exposant
                                      {evenement.exposantsCount > 1 ? "s" : ""}
                                    </Badge>
                                  )}
                                </div>

                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                  {evenement.nom ||
                                    `Portes Ouvertes - ${evenement.lycee.nom}`}
                                </h3>

                                <div className="flex items-center gap-4 text-gray-600 mb-3">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>{evenement.lycee.nom}</span>
                                  </div>
                                  {evenement.ville && (
                                    <div className="flex items-center gap-1">
                                      <span>{evenement.ville}</span>
                                    </div>
                                  )}
                                </div>

                                <p className="text-gray-600 text-sm">
                                  {evenement.lycee.adresse}
                                </p>
                              </div>

                              <div className="flex flex-col sm:flex-row gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedEvenement(evenement);
                                    setIsModalOpen(true);
                                  }}
                                >
                                  Voir les détails
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    window.location.href = `/inscription?evenement=${evenement.id}`;
                                  }}
                                >
                                  S'inscrire
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )
              )
            )}

            {/* Informations pratiques */}
            <Card className="mt-12">
              <CardHeader>
                <CardTitle>Informations pratiques</CardTitle>
                <CardDescription>
                  Tout ce que vous devez savoir pour participer aux portes
                  ouvertes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Accessibilité</h4>
                    <p className="text-gray-600 text-sm">
                      Tous les lycées sont accessibles aux personnes à mobilité
                      réduite. Des places de parking sont disponibles à
                      proximité de chaque établissement.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Matériel à prévoir</h4>
                    <p className="text-gray-600 text-sm">
                      Nous vous conseillons de venir avec un bloc-notes et un
                      stylo pour prendre des notes. Des documents d'information
                      seront disponibles sur place.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">
                      Durée moyenne de visite
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Comptez entre 2 et 3 heures par lycée pour visiter les
                      installations et échanger avec les représentants.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Inscription</h4>
                    <p className="text-gray-600 text-sm">
                      L'inscription est gratuite mais recommandée pour garantir
                      votre place. Vous pouvez vous inscrire en ligne ou sur
                      place.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rapport-professionnel" className="mt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="text-sm text-gray-600">
                Sélectionnez les événements à inclure dans le rapport PDF.
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={selectAll}>Tout sélectionner</Button>
                <Button variant="outline" size="sm" onClick={clearSelection}>Tout désélectionner</Button>
              </div>
            </div>

            <div className="border rounded-lg divide-y mb-6">
              {evenements.length === 0 ? (
                <div className="p-4 text-gray-500">Aucun événement disponible.</div>
              ) : (
                evenements
                  .slice()
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map((e) => {
                    const isMulti = !!(e.dateDebut && e.dateFin && e.dateDebut !== e.dateFin);
                    const start = isMulti ? new Date(e.dateDebut!) : new Date(e.date);
                    const end = isMulti ? new Date(e.dateFin!) : new Date(e.date);
                    const days = Math.round((end.setHours(0,0,0,0) - start.setHours(0,0,0,0)) / (1000*60*60*24)) + 1;
                    const checked = selectedEventIds.includes(e.id);
                    return (
                      <label key={e.id} className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer">
                        <Checkbox checked={checked} onCheckedChange={(v) => toggleEventSelection(e.id, v)} />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {new Date(isMulti ? e.dateDebut! : e.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                            {isMulti && (
                              <>
                                <span className="mx-1">→</span>
                                {new Date(e.dateFin!).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                              </>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            {e.nom || `Portes Ouvertes - ${e.lycee.nom}`}
                          </div>
                        </div>
                        {isMulti && (
                          <span className="px-2 py-0.5 text-xs border border-purple-300 text-purple-800 rounded">{days} jours</span>
                        )}
                      </label>
                    );
                  })
              )}
            </div>

            <RapportProgramme evenements={evenements.filter((e) => selectedEventIds.includes(e.id))} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Élément caché pour la génération du PDF depuis la vue classique */}
      <div id="rapport-programme-cache" className="hidden pdf-generation">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* En-tête simple */}
          <div className="bg-gray-100 p-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Programme des Événements
              </h1>
              <div className="text-gray-600">
                Document généré le {new Date().toLocaleDateString("fr-FR")}
              </div>
            </div>
          </div>

          {/* Liste des événements */}
          <div className="p-6">
            <h2
              style={{ color: "#111827" }}
              className="text-2xl font-bold mb-6"
            >
              Calendrier des Événements
            </h2>

            <div className="space-y-3">
              {evenements
                .sort(
                  (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                )
                .map((evenement, index) => (
                  <div
                    key={evenement.id}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {formatDate(evenement.date)}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {evenement.nom ||
                          `Portes Ouvertes - ${evenement.lycee.nom}`}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">
                          {formatHeure(evenement.heureDebut)}
                        </span>
                        <span className="text-gray-500">-</span>
                        <span className="font-medium">
                          {formatHeure(evenement.heureFin)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">
                          {evenement.lycee.nom}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Pied de page */}
          <div className="bg-gray-100 p-6">
            <div className="mt-6 border-t border-gray-300 pt-6">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800">
                  ATLANTIS EVENTS SARL
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal des détails */}
      {selectedEvenement && (
        <EvenementDetailsModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEvenement(null);
          }}
          evenement={selectedEvenement}
        />
      )}
    </Layout>
  );
}
