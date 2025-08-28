"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Filter, CalendarDays, MapPin, Users, Eye, Image as ImageIcon, Video, File } from "lucide-react";
import Image from "next/image";
import Layout from "@/components/layout/Layout";

interface Photo {
  id: string;
  titre: string;
  description?: string;
  fichier: string;
  type: string;
  evenement: string;
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
  const [viewMode, setViewMode] = useState<'grid' | 'events'>('grid'); // Nouveau mode d'affichage

  const handleImageError = (photoId: string) => {
    console.error(`❌ Erreur de chargement de l'image pour la photo ${photoId}`);
    setImageErrors(prev => new Set(prev).add(photoId));
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'PHOTO':
        return <ImageIcon className="h-8 w-8" />;
      case 'VIDEO':
        return <Video className="h-8 w-8" />;
      default:
        return <File className="h-8 w-8" />;
    }
  };

  const renderMediaPreview = (photo: Photo, isDialog = false) => {
    const hasError = imageErrors.has(photo.id);
    const imageUrl = photo.fichier.startsWith('/') ? photo.fichier : `/uploads/${photo.fichier}`;
    
    console.log(`🖼️ Tentative d'affichage de l'image: ${imageUrl} pour la photo ${photo.titre}`);
    
    if (hasError) {
      return (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <div className="text-gray-400 text-center">
            {getMediaIcon(photo.type)}
            <p className="text-sm mt-2">Image non disponible</p>
          </div>
        </div>
      );
    }

    if (photo.type === 'PHOTO') {
      return (
        <img
          src={imageUrl}
          alt={photo.titre}
          className="w-full h-full object-cover"
          onError={() => handleImageError(photo.id)}
        />
      );
    } else if (photo.type === 'VIDEO') {
      return (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center relative">
          <video
            className="w-full h-full object-cover"
            controls
            onError={() => handleImageError(photo.id)}
          >
            <source src={imageUrl} type="video/mp4" />
            Votre navigateur ne supporte pas la lecture de vidéos.
          </video>
        </div>
      );
    } else {
      return (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <div className="text-gray-400 text-center">
            {getMediaIcon(photo.type)}
            <p className="text-sm mt-2">Document</p>
          </div>
        </div>
      );
    }
  };

  // Récupérer les données depuis l'API
  useEffect(() => {
    const fetchMedias = async () => {
      try {
        console.log('🔄 Récupération des médias depuis l\'API...');
        const response = await fetch('/api/medias');
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ ${data.data.length} médias récupérés depuis l'API`);
          setPhotos(data.data);
          setFilteredPhotos(data.data);
        } else {
          console.error('❌ Erreur lors de la récupération des médias:', response.status);
          // En cas d'erreur, on utilise un tableau vide
          setPhotos([]);
          setFilteredPhotos([]);
        }
      } catch (error) {
        console.error('❌ Erreur de connexion au serveur:', error);
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
      filtered = filtered.filter(photo => photo.categorie === categorieFilter);
    }

    // Filtrer par année
    if (anneeFilter !== "TOUS") {
      filtered = filtered.filter(photo => photo.date.startsWith(anneeFilter));
    }

    setFilteredPhotos(filtered);
  }, [photos, categorieFilter, anneeFilter]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getUniqueCategories = () => {
    const categories = photos.map(photo => photo.categorie);
    return [...new Set(categories)];
  };

  const getUniqueAnnees = () => {
    const annees = photos.map(photo => photo.date.substring(0, 4));
    return [...new Set(annees)].sort((a, b) => b.localeCompare(a));
  };

  const groupPhotosByEvent = () => {
    const grouped = filteredPhotos.reduce((acc, photo) => {
      const eventKey = photo.evenement;
      if (!acc[eventKey]) {
        acc[eventKey] = [];
      }
      acc[eventKey].push(photo);
      return acc;
    }, {} as Record<string, Photo[]>);

    return Object.entries(grouped).sort(([a], [b]) => {
      // Trier par date (extraire la date du nom de l'événement)
      const dateA = a.split(' - ')[0];
      const dateB = b.split(' - ')[0];
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
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Galerie Photos</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Revivez les moments forts des Forums et journées portes ouvertes précédentes
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
                <Select value={categorieFilter} onValueChange={setCategorieFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TOUS">Toutes les catégories</SelectItem>
                    {getUniqueCategories().map((categorie) => (
                      <SelectItem key={categorie} value={categorie}>{categorie}</SelectItem>
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
                      <SelectItem key={annee} value={annee}>{annee}</SelectItem>
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
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="h-8 px-3"
                  >
                    Grille
                  </Button>
                  <Button
                    variant={viewMode === 'events' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('events')}
                    className="h-8 px-3"
                  >
                    Par événement
                  </Button>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                {filteredPhotos.length} photo{filteredPhotos.length > 1 ? 's' : ''} trouvée{filteredPhotos.length > 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>

          {/* Galerie */}
        {filteredPhotos.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune photo trouvée</h3>
              <p className="text-gray-500">Essayez de modifier vos critères de filtrage</p>
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          /* Mode grille - Version simplifiée pour tester */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPhotos.map((photo) => (
              <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={photo.fichier}
                    alt={photo.titre}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error(`Erreur de chargement de l'image: ${photo.fichier}`);
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = `
                        <div class="w-full h-full bg-gray-200 flex items-center justify-center">
                          <div class="text-gray-400 text-center">
                            <svg class="h-12 w-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <p class="text-sm">Image non disponible</p>
                          </div>
                        </div>
                      `;
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center overflow-hidden">
                    <img
                      src={photo.fichier}
                      alt={photo.titre}
                      className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        console.error(`Erreur de chargement de l'image au survol: ${photo.fichier}`);
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = `
                          <div class="w-full h-full bg-gray-200 flex items-center justify-center">
                            <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                          </div>
                        `;
                      }}
                    />
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="text-xs">
                      {photo.categorie}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-sm mb-1 line-clamp-1">{photo.titre}</h3>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">{photo.description}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <CalendarDays className="h-3 w-3" />
                    <span>{formatDate(photo.date)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <MapPin className="h-3 w-3" />
                    <span>{photo.lieu}</span>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full mt-3" 
                        size="sm" 
                        onClick={() => setSelectedPhoto(photo)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Voir
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
                      <div className="relative w-full h-full">
                        <img
                          src={photo.fichier}
                          alt={photo.titre}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = `
                              <div class="w-full h-full bg-gray-200 flex items-center justify-center">
                                <div class="text-gray-400 text-center">
                                  <svg class="h-16 w-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                  </svg>
                                  <p>Image non disponible</p>
                                </div>
                              </div>
                            `;
                          }}
                        />
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
                      {eventPhotos.length} photo{eventPhotos.length > 1 ? 's' : ''} dans cet événement
                    </CardDescription>
                  </CardHeader>
                </Card>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {eventPhotos.map((photo) => (
                    <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                        <img
                          src={photo.fichier}
                          alt={photo.titre}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error(`Erreur de chargement de l'image: ${photo.fichier}`);
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = `
                              <div class="w-full h-full bg-gray-200 flex items-center justify-center">
                                <div class="text-gray-400 text-center">
                                  <svg class="h-12 w-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                  </svg>
                                  <p class="text-sm">Image non disponible</p>
                                </div>
                              </div>
                            `;
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center overflow-hidden">
                          <img
                            src={photo.fichier}
                            alt={photo.titre}
                            className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              console.error(`Erreur de chargement de l'image au survol: ${photo.fichier}`);
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement!.innerHTML = `
                                <div class="w-full h-full bg-gray-200 flex items-center justify-center">
                                  <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                  </svg>
                                </div>
                              `;
                            }}
                          />
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="text-xs">
                            {photo.categorie}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-medium text-sm mb-1 line-clamp-1">{photo.titre}</h3>
                        <p className="text-xs text-gray-500 mb-2 line-clamp-1">{photo.description}</p>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              className="w-full" 
                              size="sm" 
                              onClick={() => setSelectedPhoto(photo)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Voir
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
                            <div className="relative w-full h-full">
                              <img
                                src={photo.fichier}
                                alt={photo.titre}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.parentElement!.innerHTML = `
                                    <div class="w-full h-full bg-gray-200 flex items-center justify-center">
                                      <div class="text-gray-400 text-center">
                                        <svg class="h-16 w-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                        </svg>
                                        <p>Image non disponible</p>
                                      </div>
                                    </div>
                                  `;
                                }}
                              />
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