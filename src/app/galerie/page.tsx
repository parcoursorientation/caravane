"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import {
  Filter,
  CalendarDays,
  MapPin,
  Users,
  Eye,
  Image as ImageIcon,
  Video,
  File,
} from "lucide-react";
import Image from "next/image";
import Layout from "@/components/layout/Layout";

interface Photo {
  id: string;
  titre: string;
  description?: string;
  fichier: string;
  type: string;
  evenement: {
    nom: string;
    date: string | null;
    lieu: string;
  };
  date: string;
  lieu: string;
  categorie: string;
}

export default function GaleriePage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [categorieFilter, setCategorieFilter] = useState<string>("TOUS");
  const [anneeFilter, setAnneeFilter] = useState<string>("TOUS");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"grid" | "events">("grid"); // Nouveau mode d'affichage

  const handleImageError = (photoId: string) => {
    console.error(
      `❌ Erreur de chargement de l'image pour la photo ${photoId}`
    );
    setImageErrors((prev) => new Set(prev).add(photoId));
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case "PHOTO":
        return <ImageIcon className="h-8 w-8" />;
      case "VIDEO":
        return <Video className="h-8 w-8" />;
      default:
        return <File className="h-8 w-8" />;
    }
  };

  const renderMediaPreview = (photo: Photo, isDialog = false) => {
    const hasError = imageErrors.has(photo.id);

    // Autoriser les URLs externes (http/https) et garder compatibilité avec fichiers locaux
    const isExternalUrl = (value: string) => /^https?:\/\//i.test(value);
    const rawPath = (photo.fichier || "").trim();

    // Construire l'URL finale à afficher
    const imageUrl = isExternalUrl(rawPath)
      ? rawPath
      : rawPath.startsWith("/")
      ? rawPath
      : `/uploads/${rawPath}`;

    // Déterminer le type de fichier basé sur l'extension, en gérant les URLs avec query/hash
    const getFileType = (input: string) => {
      let pathname = input;
      try {
        // Si c'est une URL valide, récupérer seulement le pathname
        const u = new URL(input);
        pathname = u.pathname;
      } catch {
        // sinon on garde la chaîne telle quelle
      }
      const lastSegment = pathname.split("/").pop() || pathname;
      const clean = lastSegment.split("?")[0].split("#")[0];
      const ext = clean.toLowerCase().split(".").pop();

      if (
        ["jpg", "jpeg", "png", "gif", "webp", "avif", "svg"].includes(ext || "")
      ) {
        return "image" as const;
      }
      if (["mp4", "webm", "ogg", "avi", "mov"].includes(ext || "")) {
        return "video" as const;
      }
      if (["pdf"].includes(ext || "")) {
        return "pdf" as const;
      }
      return "document" as const;
    };

    const fileType = getFileType(imageUrl);

    // Pour les PDFs, on affiche une prévisualisation ou on ouvre dans un nouvel onglet
    if (fileType === "pdf") {
      return (
        <div
          className="w-full h-full bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center cursor-pointer hover:from-red-100 hover:to-red-200 transition-colors"
          onClick={() => window.open(imageUrl, "_blank")}
        >
          <div className="text-red-600 text-center p-4">
            <File className="h-12 w-12 mx-auto mb-2" />
            <p className="text-sm font-medium">Document PDF</p>
            <p className="text-xs mt-1 text-red-500">Cliquez pour ouvrir</p>
          </div>
        </div>
      );
    }

    // Pour les documents non supportés ou erreurs
    if (hasError || fileType === "document") {
      return (
        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-gray-500 text-center p-4">
            {getMediaIcon(photo.type)}
            <p className="text-sm mt-2 font-medium">
              {fileType === "document" ? "Document" : "Média non disponible"}
            </p>
          </div>
        </div>
      );
    }

    const imgClass = isDialog
      ? "w-full h-full object-contain bg-white"
      : "w-full h-full object-cover";

    // Affichage des images
    if (fileType === "image") {
      return (
        <img
          src={imageUrl}
          alt={photo.titre}
          className={imgClass}
          onError={() => handleImageError(photo.id)}
        />
      );
    }

    // Affichage des vidéos
    if (fileType === "video") {
      return (
        <div className="w-full h-full relative overflow-hidden">
          <video
            className={imgClass}
            controls={true}
            preload="metadata"
            onError={() => handleImageError(photo.id)}
          >
            <source src={imageUrl} type="video/mp4" />
            <source src={imageUrl} type="video/webm" />
            <source src={imageUrl} type="video/ogg" />
            Votre navigateur ne supporte pas la lecture de vidéos.
          </video>
        </div>
      );
    }

    // Fallback pour types non supportés
    return (
      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-blue-500 text-center p-4">
          {getMediaIcon(photo.type)}
          <p className="text-sm mt-2 font-medium">Type de média non supporté</p>
        </div>
      </div>
    );
  };

  // Récupérer les données depuis l'API
  useEffect(() => {
    const fetchMedias = async () => {
      try {
        console.log("🔄 Récupération des médias depuis l'API...");
        const response = await fetch("/api/medias");

        if (response.ok) {
          const data = await response.json();
          console.log(`✅ ${data.data.length} médias récupérés depuis l'API`);
          setPhotos(data.data);
          setFilteredPhotos(data.data);
        } else {
          console.error(
            "❌ Erreur lors de la récupération des médias:",
            response.status
          );
          // En cas d'erreur, on utilise un tableau vide
          setPhotos([]);
          setFilteredPhotos([]);
        }
      } catch (error) {
        console.error("❌ Erreur de connexion au serveur:", error);
        // En cas d'erreur, on utilise un tableau vide
        setPhotos([]);
        setFilteredPhotos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMedias();
  }, []);

  useEffect(() => {
    let filtered = photos;

    // Filtrer par catégorie
    if (categorieFilter !== "TOUS") {
      filtered = filtered.filter(
        (photo) => photo.categorie === categorieFilter
      );
    }

    // Filtrer par année
    if (anneeFilter !== "TOUS") {
      filtered = filtered.filter((photo) =>
        (photo.evenement.date ? photo.evenement.date : photo.date).startsWith(
          anneeFilter
        )
      );
    }

    setFilteredPhotos(filtered);
  }, [photos, categorieFilter, anneeFilter]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getUniqueCategories = () => {
    const categories = photos.map((photo) => photo.categorie);
    return [...new Set(categories)];
  };

  const getUniqueAnnees = () => {
    const annees = photos.map((photo) =>
      photo.evenement.date
        ? photo.evenement.date.substring(0, 4)
        : photo.date.substring(0, 4)
    );
    return [...new Set(annees)].sort((a, b) => b.localeCompare(a));
  };

  const groupPhotosByEvent = () => {
    const grouped = filteredPhotos.reduce((acc, photo) => {
      const eventKey = photo.evenement.nom;
      if (!acc[eventKey]) {
        acc[eventKey] = [];
      }
      acc[eventKey].push(photo);
      return acc;
    }, {} as Record<string, Photo[]>);

    return Object.entries(grouped).sort(([a, photosA], [b, photosB]) => {
      // Trier par date d'événement (prendre la date du premier photo de chaque groupe)
      const dateA = photosA[0]?.evenement.date;
      const dateB = photosB[0]?.evenement.date;

      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;

      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement de la galerie...</p>
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Galerie Photos
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Revivez les moments forts des Forums et journées portes ouvertes
            précédentes
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select
                  value={categorieFilter}
                  onValueChange={setCategorieFilter}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TOUS">Toutes les catégories</SelectItem>
                    {getUniqueCategories().map((categorie) => (
                      <SelectItem key={categorie} value={categorie}>
                        {categorie}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-gray-500" />
                <Select value={anneeFilter} onValueChange={setAnneeFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Année" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TOUS">Toutes les années</SelectItem>
                    {getUniqueAnnees().map((annee) => (
                      <SelectItem key={annee} value={annee}>
                        {annee}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Mode d'affichage:</span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-8 px-3"
                  >
                    Grille
                  </Button>
                  <Button
                    variant={viewMode === "events" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("events")}
                    className="h-8 px-3"
                  >
                    Par événement
                  </Button>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                {filteredPhotos.length} photo
                {filteredPhotos.length > 1 ? "s" : ""} trouvée
                {filteredPhotos.length > 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>

        {/* Galerie */}
        {filteredPhotos.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune photo trouvée
              </h3>
              <p className="text-gray-500">
                Essayez de modifier vos critères de filtrage
              </p>
            </CardContent>
          </Card>
        ) : viewMode === "grid" ? (
          /* Mode grille - Version simplifiée pour tester */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPhotos.map((photo) => (
              <Card
                key={photo.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-white">
                  {renderMediaPreview(photo)}
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="text-xs">
                      {photo.categorie}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm text-gray-900 truncate">
                      {photo.evenement.nom}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <CalendarDays className="h-3 w-3" />
                      <span>
                        {photo.evenement.date
                          ? formatDate(photo.evenement.date)
                          : "Date inconnue"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{photo.evenement.lieu}</span>
                    </div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="w-full mt-3"
                        size="sm"
                        onClick={() => {
                          const fileType = photo.fichier
                            .toLowerCase()
                            .split(".")
                            .pop();
                          if (fileType === "pdf") {
                            // Pour les PDF, ouvrir dans un nouvel onglet
                            const url = photo.fichier.startsWith("/")
                              ? photo.fichier
                              : `/uploads/${photo.fichier}`;
                            window.open(url, "_blank");
                            return;
                          }
                          setSelectedPhoto(photo);
                        }}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        {photo.fichier.toLowerCase().endsWith(".pdf")
                          ? "Ouvrir PDF"
                          : "Voir"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
                      <VisuallyHidden>
                        <DialogTitle>{photo.titre}</DialogTitle>
                      </VisuallyHidden>
                      <div className="relative w-full h-full">
                        {renderMediaPreview(photo, true)}
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Mode par événement - Version simplifiée pour tester */
          <div className="space-y-8">
            {groupPhotosByEvent().map(([eventName, eventPhotos]) => (
              <div key={eventName} className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarDays className="h-5 w-5 text-blue-600" />
                      {eventName}
                    </CardTitle>
                    <CardDescription>
                      {eventPhotos.length} photo
                      {eventPhotos.length > 1 ? "s" : ""} dans cet événement
                    </CardDescription>
                  </CardHeader>
                </Card>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {eventPhotos.map((photo) => (
                    <Card
                      key={photo.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-white">
                        {renderMediaPreview(photo)}
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="text-xs">
                            {photo.categorie}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <div className="space-y-1 mb-3">
                          <h3 className="font-medium text-sm text-gray-900 truncate">
                            {photo.evenement.nom}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <CalendarDays className="h-3 w-3" />
                            <span>
                              {photo.evenement.date
                                ? formatDate(photo.evenement.date)
                                : "Date inconnue"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">
                              {photo.evenement.lieu}
                            </span>
                          </div>
                        </div>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              className="w-full"
                              size="sm"
                              onClick={() => {
                                const fileType = photo.fichier
                                  .toLowerCase()
                                  .split(".")
                                  .pop();
                                if (fileType === "pdf") {
                                  // Pour les PDF, ouvrir dans un nouvel onglet
                                  const url = photo.fichier.startsWith("/")
                                    ? photo.fichier
                                    : `/uploads/${photo.fichier}`;
                                  window.open(url, "_blank");
                                  return;
                                }
                                setSelectedPhoto(photo);
                              }}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              {photo.fichier.toLowerCase().endsWith(".pdf")
                                ? "Ouvrir PDF"
                                : "Voir"}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
                            <VisuallyHidden>
                              <DialogTitle>{photo.titre}</DialogTitle>
                            </VisuallyHidden>
                            <div className="relative w-full h-full">
                              {renderMediaPreview(photo, true)}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
