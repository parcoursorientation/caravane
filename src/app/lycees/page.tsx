"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Building2,
  MapPin,
  CalendarDays,
  Search,
  Filter,
  Clock,
  Users,
  BookOpen,
  Trophy,
} from "lucide-react";
import Layout from "@/components/layout/Layout";

// Helpers villes et texte (top-level)
const extractCity = (value?: string | null) => {
  if (!value) return "";
  const base = String(value);
  const simple = (base.split(",").pop() || base).trim();
  return simple;
};

const normalizeCityKey = (value?: string | null) => {
  const city = extractCity(value);
  return city
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

const normalizeText = (value?: string | null) => {
  if (!value) return "";
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

// Label lisible pour le type d'événement
const eventTypeLabel = (t?: string | null) => {
  if (!t) return "";
  const map: Record<string, string> = {
    caravane_d_orientation: "Caravane d’Orientation",
    forum_d_orientation: "Forum d’Orientation",
    portes_ouvertes: "Portes Ouvertes",
  };
  return map[t] || t;
};

interface Lycee {
  id: string;
  nom: string;
  adresse: string;
  type: "PUBLIC" | "PRIVE";
  description?: string;
  logo?: string;
  evenements: Array<{
    id: string;
    date: string | Date;
    heureDebut: string | Date;
    heureFin: string | Date;
  }>;
}

interface EvenementPublic {
  id: string;
  nom: string;
  date: string;
  dateDebut?: string | null;
  dateFin?: string | null;
  heureDebut?: string | Date | null;
  heureFin?: string | Date | null;
  ville?: string | null;
  type?: string | null;
  academicYear?: string | null;
  lycee: {
    id: string;
    nom: string;
    adresse: string;
  };
  exposantsCount: number;
}

export default function LyceesPage() {
  const [lycees, setLycees] = useState<Lycee[]>([]);
  const [filteredLycees, setFilteredLycees] = useState<Lycee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("TOUS");
  const [selectedLycee, setSelectedLycee] = useState<Lycee | null>(null);
  const [showProgrammeComplet, setShowProgrammeComplet] = useState(false);

  // Nouveaux états pour l'affichage groupé par événement
  const [evenements, setEvenements] = useState<EvenementPublic[]>([]);
  const [loadingEvents, setLoadingEvents] = useState<boolean>(false);
  const [groupSortBy, setGroupSortBy] = useState<"nom" | "ville">("nom");

  // Groupes par nom d'événement -> lycées (chaque lycée garde ses propres dates)
  const eventsGrouped = useMemo(() => {
    // Map par NOM d'événement => { idRepresentative, nom, items: [...] }
    const map = new Map<
      string,
      {
        idRepresentative: string; // premier ID rencontré pour servir de value dans l'accordéon
        nom: string;
        items: Array<{ lycee: Lycee | null; evt: EvenementPublic }>;
      }
    >();

    for (const evt of evenements) {
      const key = (evt.nom || "Événement").trim();
      if (!map.has(key)) {
        map.set(key, { idRepresentative: evt.id, nom: key, items: [] });
      }
      // Try to enrich with local lycée by ID, then fallback by name/city when ID is missing
      let foundLycee = lycees.find((l) => l.id === evt.lycee.id) || null;
      if (!foundLycee) {
        const targetName = (evt.lycee.nom || "").trim().toLowerCase();
        const targetCity = normalizeCityKey(
          evt.ville ?? evt.lycee.adresse ?? ""
        );
        // 1) Strict match by name + city
        foundLycee =
          lycees.find(
            (l) =>
              l.nom.trim().toLowerCase() === targetName &&
              normalizeCityKey(l.adresse) === targetCity
          ) || null;
        // 2) Fallback: match by name only
        if (!foundLycee) {
          foundLycee =
            lycees.find((l) => l.nom.trim().toLowerCase() === targetName) ||
            null;
        }
      }
      map.get(key)!.items.push({ lycee: foundLycee, evt });
    }

    // Transformer en tableau stable trié par première date du groupe
    const arr = Array.from(map.entries()).map(([name, val]) => {
      // tri interne des items d'un groupe par nom ou ville du lycée
      const itemsSorted = [...val.items].sort((a, b) => {
        const aLycee = a.lycee;
        const bLycee = b.lycee;
        // fallback: si pas de lycée enrichi, utiliser nom/adresse de evt.lycee
        const aNom = (aLycee?.nom ?? a.evt.lycee.nom ?? "").toLocaleLowerCase();
        const bNom = (bLycee?.nom ?? b.evt.lycee.nom ?? "").toLocaleLowerCase();
        const aVille = (
          a.evt.ville ??
          aLycee?.adresse ??
          a.evt.lycee.adresse ??
          ""
        ).toLocaleLowerCase();
        const bVille = (
          b.evt.ville ??
          bLycee?.adresse ??
          b.evt.lycee.adresse ??
          ""
        ).toLocaleLowerCase();

        if (groupSortBy === "ville") {
          const cityA = extractCity(
            a.evt.ville ?? aLycee?.adresse ?? a.evt.lycee.adresse ?? ""
          );
          const cityB = extractCity(
            b.evt.ville ?? bLycee?.adresse ?? b.evt.lycee.adresse ?? ""
          );
          const keyA = normalizeCityKey(cityA);
          const keyB = normalizeCityKey(cityB);
          if (keyA !== keyB)
            return cityA.localeCompare(cityB, "fr", { sensitivity: "base" });
          return aNom.localeCompare(bNom, "fr", { sensitivity: "base" });
        }
        // par défaut: nom
        if (aNom !== bNom) return aNom.localeCompare(bNom);
        return aVille.localeCompare(bVille);
      });

      // calcul des villes pour l'entête de groupe
      const cityValuesLower = itemsSorted.map(({ lycee, evt }) =>
        normalizeCityKey(evt.ville ?? lycee?.adresse ?? evt.lycee.adresse ?? "")
      );
      const cityValuesDisplay = itemsSorted.map(({ lycee, evt }) => {
        const base = evt.ville ?? lycee?.adresse ?? evt.lycee.adresse ?? "";
        const simple = (base.split(",").pop() || base).trim();
        return simple;
      });
      const uniqueCitiesLower = Array.from(
        new Set(cityValuesLower.filter(Boolean))
      );
      // Conserver la casse d'origine en mappant par clé lower-case, puis trier alphabétiquement
      const byLowerToDisplay = new Map<string, string>();
      for (let i = 0; i < cityValuesLower.length; i++) {
        const lower = cityValuesLower[i];
        const display = cityValuesDisplay[i];
        if (lower) {
          // Enregistre le premier affichage rencontré pour conserver la casse naturelle
          if (!byLowerToDisplay.has(lower))
            byLowerToDisplay.set(lower, display);
        }
      }
      const uniqueCitiesDisplay = uniqueCitiesLower
        .map((lower) => byLowerToDisplay.get(lower)!)
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }));

      const groupVille =
        uniqueCitiesDisplay.length === 1 ? uniqueCitiesDisplay[0] : null;
      const groupVilles =
        uniqueCitiesDisplay.length > 1 ? uniqueCitiesDisplay : null;
      const groupVillesDisplay =
        groupVilles && groupVilles.length > 0
          ? (() => {
              const shown = groupVilles.slice(0, 3).join(", ");
              const rest = groupVilles.length - 3;
              return rest > 0 ? `${shown} +${rest} autres` : shown;
            })()
          : null;

      // Déduire type de lycée dominant dans le groupe (si cohérent)
      const typeCounts = itemsSorted.reduce(
        (acc, it) => {
          const t = it.lycee?.type || null;
          if (t === "PUBLIC" || t === "PRIVE") acc[t]++;
          return acc;
        },
        { PUBLIC: 0, PRIVE: 0 } as { PUBLIC: number; PRIVE: number }
      );
      const groupLyceeType =
        typeCounts.PUBLIC === 0 && typeCounts.PRIVE === 0
          ? null
          : typeCounts.PUBLIC >= typeCounts.PRIVE
          ? "PUBLIC"
          : "PRIVE";

      // Déduire type et année académique depuis le premier item du groupe (métadonnées d'événement)
      const firstItem = itemsSorted[0]?.evt;
      const groupType = firstItem?.type ?? null;
      const groupAcademic = firstItem?.academicYear ?? null;

      return {
        id: val.idRepresentative,
        nom: val.nom,
        items: itemsSorted,
        firstDate: itemsSorted[0]?.evt.date || "",
        ville: groupVille,
        villes: groupVilles,
        villesDisplay: groupVillesDisplay,
        type: groupType,
        academicYear: groupAcademic,
        hostCount: itemsSorted.length,
        groupLyceeType,
      };
    });
    arr.sort(
      (a, b) =>
        new Date(a.firstDate).getTime() - new Date(b.firstDate).getTime()
    );
    return arr;
  }, [evenements, lycees, groupSortBy]);

  // Récupérer les données depuis l'API
  useEffect(() => {
    const fetchLycees = async () => {
      try {
        console.log("🔄 Récupération des lycées depuis l'API...");
        const response = await fetch("/api/lycees");

        if (response.ok) {
          const data = await response.json();
          console.log(`✅ ${data.data.length} lycées récupérés depuis l'API`);
          setLycees(data.data);
          setFilteredLycees(data.data);
        } else {
          console.error(
            "❌ Erreur lors de la récupération des lycées:",
            response.status
          );
          // En cas d'erreur, on utilise un tableau vide
          setLycees([]);
          setFilteredLycees([]);
        }
      } catch (error) {
        console.error("❌ Erreur de connexion au serveur:", error);
        // En cas d'erreur, on utilise un tableau vide
        setLycees([]);
        setFilteredLycees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLycees();
  }, []);

  // Récupérer les événements publics (avec lycée associé)
  useEffect(() => {
    const fetchEvenements = async () => {
      try {
        setLoadingEvents(true);
        const response = await fetch("/api/evenements-public");
        if (response.ok) {
          const json = await response.json();

          // Supporte deux formats:
          // 1) { data: EvenementPublic[] } (ancien format)
          // 2) { events: [{ id, name, hosts: [...] }, ...] } (multi-lycées)
          let list: EvenementPublic[] = [];

          if (Array.isArray(json?.data)) {
            list = json.data as EvenementPublic[];
          } else if (Array.isArray(json?.events)) {
            const events = json.events as Array<{
              id: string;
              name: string;
              type?: string;
              academic_year?: string;
              hosts?: Array<{
                school_name: string;
                city?: string;
                start_date?: string;
                end_date?: string;
                start_time?: string;
                end_time?: string;
              }>;
            }>;

            list = events.flatMap((ev) => {
              return (ev.hosts || []).map((h) => {
                const city = h.city || "";
                return {
                  id: `${ev.id}::${h.school_name}::${city}`,
                  nom: ev.name,
                  date: h.start_date || "",
                  dateDebut: h.start_date || null,
                  dateFin: h.end_date || null,
                  heureDebut: h.start_time || null,
                  heureFin: h.end_time || null,
                  ville: city,
                  type: ev.type || null,
                  academicYear: ev.academic_year || null,
                  lycee: {
                    id: "", // id inconnu côté source JSON, on laisse vide
                    nom: h.school_name,
                    adresse: city,
                  },
                  exposantsCount: 0,
                } as EvenementPublic;
              });
            });
          }

          setEvenements(list);
        } else {
          console.error(
            "❌ Erreur lors de la récupération des événements:",
            response.status
          );
          setEvenements([]);
        }
      } catch (error) {
        console.error("❌ Erreur de connexion (événements):", error);
        setEvenements([]);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvenements();
  }, []);

  useEffect(() => {
    let filtered = lycees;

    // Filtrer par terme de recherche
    if (searchTerm) {
      const needle = normalizeText(searchTerm);
      filtered = filtered.filter((lycee) => {
        const nom = normalizeText(lycee.nom);
        const adresse = normalizeText(lycee.adresse);
        const ville = normalizeText(extractCity(lycee.adresse));
        return (
          nom.includes(needle) ||
          adresse.includes(needle) ||
          ville.includes(needle)
        );
      });
    }

    // Filtrer par type
    if (typeFilter !== "TOUS") {
      filtered = filtered.filter((lycee) => lycee.type === typeFilter);
    }

    setFilteredLycees(filtered);
  }, [lycees, searchTerm, typeFilter]);

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    // Format JJ/MM/AAAA
    const dd = String(dateObj.getDate()).padStart(2, "0");
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
    const yyyy = dateObj.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const formatTime = (date: string | Date) => {
    // Si c'est une chaîne au format HH:MM, la retourner directement
    if (typeof date === "string" && date.includes(":") && date.length <= 5) {
      return date;
    }
    // Sinon, essayer de parser comme Date (pour la compatibilité avec les anciennes données)
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  interface ProgrammeCompletProps {
    lycee: Lycee | null;
  }

  const ProgrammeComplet = ({ lycee }: ProgrammeCompletProps) => {
    const [programmes, setProgrammes] = useState<any[]>([]);
    const [loadingProgrammes, setLoadingProgrammes] = useState(true);

    useEffect(() => {
      const fetchProgrammes = async () => {
        if (!lycee) return;

        try {
          setLoadingProgrammes(true);
          const response = await fetch(`/api/lycees/${lycee.id}/programmes`);

          if (response.ok) {
            const data = await response.json();
            setProgrammes(data.data.programmes || []);
          } else {
            console.error("Erreur lors de la récupération des programmes");
            setProgrammes([]);
          }
        } catch (error) {
          console.error("Erreur de connexion:", error);
          setProgrammes([]);
        } finally {
          setLoadingProgrammes(false);
        }
      };

      fetchProgrammes();
    }, [lycee]);

    if (!lycee) {
      return (
        <div className="text-center py-8 text-gray-500">
          Aucun lycée sélectionné
        </div>
      );
    }

    if (loadingProgrammes) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du programme...</p>
        </div>
      );
    }

    // Si aucun programme n'est trouvé, utiliser le programme fictif comme fallback
    const programmeDetaille =
      programmes.length > 0
        ? programmes
        : [
            {
              id: "1",
              titre: "Accueil et Inscription",
              description:
                "Bienvenue des visiteurs et distribution des programmes",
              heure: "08:30",
              duree: "30 min",
              lieu: "Hall d'entrée",
              type: "ACCUEIL",
              public: "Tous",
              animateur: "Équipe d'accueil",
            },
            {
              id: "2",
              titre: "Présentation de l'établissement",
              description: "Historique, valeurs et projet d'établissement",
              heure: "09:00",
              duree: "45 min",
              lieu: "Amphithéâtre",
              type: "PRESENTATION",
              public: "Tous",
              animateur: "Proviseur",
            },
            {
              id: "3",
              titre: "Visite guidée des installations",
              description:
                "Découverte des salles de classe, laboratoires et équipements",
              heure: "10:00",
              duree: "1h",
              lieu: "Départ hall d'entrée",
              type: "VISITE",
              public: "Tous",
              animateur: "Équipe pédagogique",
            },
            {
              id: "4",
              titre: "Atelier: Découverte des filières",
              description:
                "Présentation détaillée des différentes filières et débouchés",
              heure: "11:15",
              duree: "1h",
              lieu: "Salle polyvalente",
              type: "ATELIER",
              public: "Élèves de 3ème",
              animateur: "Professeurs principaux",
            },
            {
              id: "5",
              titre: "Rencontre avec les élèves",
              description: "Témoignages et échanges avec les élèves du lycée",
              heure: "12:30",
              duree: "45 min",
              lieu: "CDI",
              type: "RENCONTRE",
              public: "Parents et élèves",
              animateur: "Délégués élèves",
            },
            {
              id: "6",
              titre: "Déjeuner sur place",
              description: "Repas proposé par le restaurant scolaire",
              heure: "13:30",
              duree: "1h",
              lieu: "Cafétéria",
              type: "REPAS",
              public: "Tous",
              animateur: "Personnel de restauration",
            },
            {
              id: "7",
              titre: "Démonstrations scientifiques",
              description: "Expériences et projets des élèves en laboratoire",
              heure: "14:30",
              duree: "1h30",
              lieu: "Laboratoires de sciences",
              type: "DEMONSTRATION",
              public: "Tous",
              animateur: "Professeurs de sciences",
            },
            {
              id: "8",
              titre: "Forum des métiers",
              description: "Présentation des métiers et formations accessibles",
              heure: "16:00",
              duree: "2h",
              lieu: "Gymnase",
              type: "FORUM",
              public: "Tous",
              animateur: "Partenaires professionnels",
            },
            {
              id: "9",
              titre: "Séance d'information pour les parents",
              description: "Inscription, scolarité et vie au lycée",
              heure: "16:30",
              duree: "1h",
              lieu: "Salle des professeurs",
              type: "INFORMATION",
              public: "Parents",
              animateur: "Administration",
            },
            {
              id: "10",
              titre: "Clôture et cocktail",
              description: "Moment convivial pour finaliser la journée",
              heure: "18:00",
              duree: "1h",
              lieu: "Hall d'entrée",
              type: "CLOTURE",
              public: "Tous",
              animateur: "Équipe d'accueil",
            },
          ];

    const getTypeIcon = (type: string) => {
      switch (type) {
        case "ACCUEIL":
          return <Users className="h-4 w-4" />;
        case "PRESENTATION":
          return <BookOpen className="h-4 w-4" />;
        case "VISITE":
          return <MapPin className="h-4 w-4" />;
        case "ATELIER":
          return <Trophy className="h-4 w-4" />;
        case "RENCONTRE":
          return <Users className="h-4 w-4" />;
        case "REPAS":
          return <Clock className="h-4 w-4" />;
        case "DEMONSTRATION":
          return <BookOpen className="h-4 w-4" />;
        case "FORUM":
          return <Trophy className="h-4 w-4" />;
        case "INFORMATION":
          return <BookOpen className="h-4 w-4" />;
        case "CLOTURE":
          return <Trophy className="h-4 w-4" />;
        default:
          return <Clock className="h-4 w-4" />;
      }
    };

    const getTypeColor = (type: string) => {
      switch (type) {
        case "ACCUEIL":
          return "bg-blue-100 text-blue-800 border-blue-200";
        case "PRESENTATION":
          return "bg-green-100 text-green-800 border-green-200";
        case "VISITE":
          return "bg-purple-100 text-purple-800 border-purple-200";
        case "ATELIER":
          return "bg-orange-100 text-orange-800 border-orange-200";
        case "RENCONTRE":
          return "bg-pink-100 text-pink-800 border-pink-200";
        case "REPAS":
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "DEMONSTRATION":
          return "bg-indigo-100 text-indigo-800 border-indigo-200";
        case "FORUM":
          return "bg-red-100 text-red-800 border-red-200";
        case "INFORMATION":
          return "bg-gray-100 text-gray-800 border-gray-200";
        case "CLOTURE":
          return "bg-teal-100 text-teal-800 border-teal-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    };

    return (
      <div className="space-y-6">
        {/* Résumé de la journée */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-blue-600" />
            Résumé de la journée
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span>
                <strong>Activités:</strong> {programmeDetaille.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span>
                <strong>Type:</strong>{" "}
                {programmeDetaille.length > 0 && programmes.length > 0
                  ? "Données réelles"
                  : "Programme type"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span>
                <strong>Lieux:</strong>{" "}
                {[...new Set(programmeDetaille.map((p) => p.lieu))].length}{" "}
                espaces
              </span>
            </div>
          </div>
        </div>

        {/* Programme détaillé */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4">Détail des activités</h3>
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
                        <span className="font-semibold text-blue-600">
                          {activite.heure}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600">
                          {activite.duree}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getTypeColor(activite.type)}`}
                      >
                        {getTypeIcon(activite.type)}
                        <span className="ml-1 capitalize">{activite.type}</span>
                      </Badge>
                    </div>

                    <h4 className="font-semibold text-lg mb-2">
                      {activite.titre}
                    </h4>
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

        {/* Informations pratiques */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-gray-600" />
            Informations pratiques
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Accès</h4>
              <p className="text-gray-600">
                Entrée principale libre pendant toute la durée de l'événement.
                Parking disponible sur place.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Réservation</h4>
              <p className="text-gray-600">
                Aucune réservation nécessaire pour la plupart des activités. Les
                ateliers en petits groupes peuvent nécessiter une inscription
                sur place.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Contact</h4>
              <p className="text-gray-600">
                Pour toute question:{" "}
                {lycee.nom.toLowerCase().replace(/\s+/g, ".")}@education.ma
                <br />
                Téléphone: +212 5XX XXX XXX
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Accessibilité</h4>
              <p className="text-gray-600">
                Établissement accessible aux personnes à mobilité réduite. Merci
                de nous prévenir pour une meilleure organisation.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des lycées...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Lycées Participants
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto px-4">
            Découvrez les établissements d'accueil qui ouvrent leurs portes pour
            votre orientation
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher un lycée..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TOUS">Tous les types</SelectItem>
                  <SelectItem value="PUBLIC">Public</SelectItem>
                  <SelectItem value="PRIVE">Privé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-gray-600 w-full md:w-auto text-center md:text-left">
              {filteredLycees.length} lycée
              {filteredLycees.length > 1 ? "s" : ""} trouvé
              {filteredLycees.length > 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Vue groupée par événement */}
        <div className="space-y-6 mb-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-gray-700" />
              Lycées par événement
            </h2>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Trier par</span>
              <Select
                value={groupSortBy}
                onValueChange={(v) => setGroupSortBy(v as "nom" | "ville")}
              >
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nom">Nom du lycée</SelectItem>
                  <SelectItem value="ville">Ville</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loadingEvents ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des événements...</p>
            </div>
          ) : evenements.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <CalendarDays className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Aucun événement disponible</p>
              </CardContent>
            </Card>
          ) : (
            <Accordion type="multiple" className="w-full">
              {eventsGrouped.map((group) => (
                <AccordionItem key={group.id} value={group.id}>
                  <AccordionTrigger>
                    <div className="flex flex-col items-start">
                      <div className="text-sm font-medium flex items-center gap-2">
                        <span>{group.nom}</span>
                        {group.type && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                            {eventTypeLabel(group.type)}
                          </span>
                        )}
                        {group.academicYear && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            {group.academicYear}
                          </span>
                        )}
                        {typeof group.hostCount === "number" && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                            {group.hostCount} hôte
                            {group.hostCount > 1 ? "s" : ""}
                          </span>
                        )}
                        {group.ville ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                            <MapPin className="h-3 w-3" /> {group.ville}
                          </span>
                        ) : group.villesDisplay ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                            <MapPin className="h-3 w-3" /> {group.villesDisplay}
                          </span>
                        ) : null}
                        {group.groupLyceeType && (
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded ${
                              group.groupLyceeType === "PUBLIC"
                                ? "text-blue-700 bg-blue-50"
                                : "text-purple-700 bg-purple-50"
                            }`}
                          >
                            {group.groupLyceeType === "PUBLIC"
                              ? "Public"
                              : "Privé"}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-600">
                        Première date: {formatDate(group.firstDate)}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {group.items.map(({ lycee, evt }) => (
                        <Card
                          key={`${group.id}-${evt.lycee.id}`}
                          className="hover:shadow-md"
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1 pr-2">
                                <CardTitle className="text-base">
                                  {lycee?.nom ?? evt.lycee.nom}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-1 mt-1 text-xs">
                                  <MapPin className="h-3 w-3 flex-shrink-0" />
                                  <span className="line-clamp-2">
                                    {(() => {
                                      const base =
                                        evt.ville ??
                                        lycee?.adresse ??
                                        evt.lycee.adresse ??
                                        "";
                                      const simple = (
                                        base.split(",").pop() || base
                                      ).trim();
                                      return simple;
                                    })()}
                                  </span>
                                </CardDescription>
                              </div>
                              <Badge
                                variant="outline"
                                className={`text-xs font-medium ${
                                  lycee?.type === "PUBLIC"
                                    ? "border-blue-500 text-blue-700 bg-blue-50"
                                    : "border-purple-500 text-purple-700 bg-purple-50"
                                }`}
                              >
                                {lycee?.type === "PUBLIC" ? "Public" : "Privé"}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4 text-gray-500" />
                                <span>
                                  {evt.dateDebut &&
                                  evt.dateFin &&
                                  evt.dateFin !== evt.dateDebut
                                    ? `${formatDate(
                                        evt.dateDebut
                                      )} → ${formatDate(evt.dateFin)}`
                                    : formatDate(evt.date)}
                                  {evt.heureDebut
                                    ? ` • ${formatTime(evt.heureDebut)}`
                                    : ""}
                                  {evt.heureFin
                                    ? ` - ${formatTime(evt.heureFin)}`
                                    : ""}
                                </span>
                              </div>
                              {/* Type du lycée déjà affiché en badge dans l’en-tête */}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>

        {/* Grille des lycées (vue originale) 
        {filteredLycees.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12 animate-fadeIn">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {lycees.length === 0
                  ? "Aucun lycée disponible"
                  : "Aucun lycée trouvé"}
              </h3>
              <p className="text-gray-500">
                {lycees.length === 0
                  ? "Les lycées seront bientôt disponibles. Revenez plus tard !"
                  : "Essayez de modifier vos critères de recherche"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredLycees.map((lycee) => (
              <Card
                key={lycee.id}
                className="hover:shadow-lg transition-all-300 card-animate hover-lift"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-2">
                      <CardTitle className="text-base md:text-lg">
                        {lycee.nom}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1 text-xs md:text-sm">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="line-clamp-2">{lycee.adresse}</span>
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        lycee.type === "PUBLIC" ? "default" : "secondary"
                      }
                      className="text-xs flex-shrink-0 badge-animate"
                    >
                      {lycee.type === "PUBLIC" ? "Public" : "Privé"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {lycee.description}
                    </p>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <CalendarDays className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">
                          Événements ({lycee.evenements.length})
                        </span>
                      </div>
                      <div className="space-y-1">
                        {lycee.evenements.slice(0, 2).map((evenement) => (
                          <div
                            key={evenement.id}
                            className="text-xs text-gray-600 list-item-animate"
                          >
                            {formatDate(evenement.date)} -{" "}
                            {formatTime(evenement.heureDebut)} à{" "}
                            {formatTime(evenement.heureFin)}
                          </div>
                        ))}
                        {lycee.evenements.length > 2 && (
                          <div className="text-xs text-blue-600">
                            +{lycee.evenements.length - 2} autre
                            {lycee.evenements.length > 3 ? "s" : ""} date
                            {lycee.evenements.length > 3 ? "s" : ""}
                          </div>
                        )}
                      </div>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="w-full button-animate hover-lift"
                          size="sm"
                          onClick={() => setSelectedLycee(lycee)}
                        >
                          Voir la fiche détaillée
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2 animate-fadeIn">
                            <Building2 className="h-5 w-5" />
                            {lycee.nom}
                          </DialogTitle>
                          <DialogDescription className="animate-fadeIn animate-delay-100">
                            Fiche détaillée du lycée
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">
                          <div className="flex items-center gap-2 animate-fadeIn animate-delay-200">
                            <Badge
                              variant={
                                lycee.type === "PUBLIC"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {lycee.type === "PUBLIC"
                                ? "Établissement Public"
                                : "Établissement Privé"}
                            </Badge>
                          </div>

                          <div className="animate-fadeIn animate-delay-300">
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              Adresse
                            </h4>
                            <p className="text-gray-600">{lycee.adresse}</p>
                          </div>

                          <div className="animate-fadeIn animate-delay-400">
                            <h4 className="font-medium mb-2">Description</h4>
                            <p className="text-gray-600">{lycee.description}</p>
                          </div>

                          <div className="animate-fadeIn animate-delay-500">
                            <h4 className="font-medium mb-3 flex items-center gap-2">
                              <CalendarDays className="h-4 w-4" />
                              Calendrier des événements (
                              {lycee.evenements.length})
                            </h4>
                            <div className="space-y-2">
                              {lycee.evenements.map((evenement) => (
                                <div
                                  key={evenement.id}
                                  className="bg-gray-50 rounded-lg p-3 list-item-animate"
                                >
                                  <div className="font-medium text-sm">
                                    {formatDate(evenement.date)}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {formatTime(evenement.heureDebut)} -{" "}
                                    {formatTime(evenement.heureFin)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2 pt-4 animate-fadeIn animate-delay-600">
                            <Button
                              className="flex-1 button-animate hover-lift"
                              onClick={() => setShowProgrammeComplet(true)}
                            >
                              <CalendarDays className="h-4 w-4 mr-2" />
                              Voir le programme complet
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Dialogue pour le programme complet 
                    <Dialog
                      open={showProgrammeComplet}
                      onOpenChange={setShowProgrammeComplet}
                    >
                      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2 animate-fadeIn">
                            <CalendarDays className="h-5 w-5" />
                            Programme Complet - {selectedLycee?.nom}
                          </DialogTitle>
                          <DialogDescription className="animate-fadeIn animate-delay-100">
                            Détail des activités et événements prévus pendant
                            les portes ouvertes
                          </DialogDescription>
                        </DialogHeader>

                        <ProgrammeComplet lycee={selectedLycee} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )} */}
      </div>
    </Layout>
  );
}
