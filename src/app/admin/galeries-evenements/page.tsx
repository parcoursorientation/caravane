"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { 
  Plus, 
  Search, 
  Filter, 
  Image as ImageIcon, 
  CalendarDays, 
  MapPin,
  Eye,
  Edit,
  Trash2,
  Upload,
  X,
  Camera,
  Users
} from "lucide-react";
import Layout from "@/components/layout/Layout";

interface Galerie {
  id: string;
  titre: string;
  description?: string;
  maxImages: number;
  createdAt: string;
  updatedAt: string;
  evenement: {
    id: string;
    date: string;
    lycee: {
      nom: string;
    };
  };
  medias: Media[];
}

interface Media {
  id: string;
  titre: string;
  description?: string;
  fichier: string;
  type: "PHOTO" | "VIDEO" | "DOCUMENT";
  categorie?: string;
  createdAt: string;
}

interface Evenement {
  id: string;
  date: string;
  lycee: {
    nom: string;
  };
}

export default function AdminGaleriesEvenementsPage() {
  const [user, setUser] = useState<any>(null);
  const [galeries, setGaleries] = useState<Galerie[]>([]);
  const [filteredGaleries, setFilteredGaleries] = useState<Galerie[]>([]);
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedGalerie, setSelectedGalerie] = useState<Galerie | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    evenementId: ""
  });

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem("adminToken");
    const userData = localStorage.getItem("adminUser");
    
    if (!token || !userData) {
      router.push("/admin/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error("Erreur lors du chargement des données utilisateur:", error);
      router.push("/admin/login");
      return;
    }
    
    loadData();
  }, [router]);

  const loadData = async () => {
    setLoading(true);
    try {
      console.log("Chargement des données des galeries...");
      
      // Charger les événements
      const evenementsResponse = await fetch('/api/admin/evenements/simple');
      if (evenementsResponse.ok) {
        const evenementsData = await evenementsResponse.json();
        setEvenements(evenementsData);
        console.log("Événements chargés:", evenementsData.length);
      }

      // Charger les galeries
      const galeriesResponse = await fetch('/api/galeries');
      if (galeriesResponse.ok) {
        const galeriesData = await galeriesResponse.json();
        setGaleries(galeriesData.data || []);
        setFilteredGaleries(galeriesData.data || []);
        console.log("Galeries chargées:", galeriesData.data?.length || 0);
      } else {
        console.log("Erreur lors du chargement des galeries:", galeriesResponse.status);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = galeries;

    // Filtrer par recherche
    if (searchTerm) {
      filtered = filtered.filter(galerie => 
        galerie.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        galerie.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        galerie.evenement.lycee.nom.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredGaleries(filtered);
  }, [galeries, searchTerm]);

  const handleCreateGalerie = async () => {
    setSaving(true);
    setError(null);
    
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('evenementId', formData.evenementId);
      uploadFormData.append('titre', formData.titre);
      uploadFormData.append('description', formData.description);
      
      // Ajouter les fichiers
      selectedFiles.forEach((file, index) => {
        uploadFormData.append(`files`, file);
      });

      const response = await fetch('/api/galeries', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création de la galerie');
      }

      const result = await response.json();
      setGaleries([result.data, ...galeries]);
      setIsCreateDialogOpen(false);
      resetForm();
      setSelectedFiles([]);
    } catch (error) {
      console.error('Erreur:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors de la création de la galerie');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMedia = async (mediaId: string) => {
    try {
      const response = await fetch(`/api/galeries/${mediaId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression de l\'image');
      }

      // Mettre à jour la liste des galeries
      loadData();
    } catch (error) {
      console.error('Erreur:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors de la suppression de l\'image');
    }
  };

  const handleUpdateGalerie = async () => {
    if (!selectedGalerie) return;

    setSaving(true);
    setError(null);
    
    try {
      // Mettre à jour les informations de la galerie
      const response = await fetch(`/api/galeries/${selectedGalerie.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titre: formData.titre,
          description: formData.description,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour de la galerie');
      }

      let updatedGalerie = await response.json();

      // Ajouter de nouvelles images si des fichiers sont sélectionnés
      if (selectedFiles.length > 0) {
        const uploadFormData = new FormData();
        selectedFiles.forEach((file) => {
          uploadFormData.append('files', file);
        });

        const uploadResponse = await fetch(`/api/galeries/${selectedGalerie.id}/add-images`, {
          method: 'POST',
          body: uploadFormData,
        });

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          updatedGalerie = uploadResult.data;
        } else {
          const errorData = await uploadResponse.json();
          console.error('Erreur lors de l\'upload des images:', errorData.error);
          // Ne pas bloquer la mise à jour si l'upload échoue
        }
      }

      setGaleries(galeries.map(g => g.id === selectedGalerie.id ? updatedGalerie.data : g));
      setIsEditDialogOpen(false);
      resetForm();
      setSelectedFiles([]);
    } catch (error) {
      console.error('Erreur:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors de la mise à jour de la galerie');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGalerie = async (galerieId: string) => {
    try {
      const response = await fetch(`/api/galeries/${galerieId}/delete-galerie`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression de la galerie');
      }

      // Mettre à jour la liste des galeries
      setGaleries(galeries.filter(g => g.id !== galerieId));
    } catch (error) {
      console.error('Erreur:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors de la suppression de la galerie');
    }
  };

  const openEditDialog = (galerie: Galerie) => {
    setSelectedGalerie(galerie);
    setFormData({
      titre: galerie.titre,
      description: galerie.description || "",
      evenementId: galerie.evenement.id
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      titre: "",
      description: "",
      evenementId: ""
    });
    setSelectedGalerie(null);
    setSelectedFiles([]);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Vérifier le nombre maximum de fichiers
    const currentGalerie = selectedGalerie;
    const currentImageCount = currentGalerie ? currentGalerie.medias.length : 0;
    
    if (currentImageCount + files.length > 10) {
      setError(`Maximum 10 images autorisées par galerie (${currentImageCount} déjà présentes)`);
      return;
    }

    // Vérifier la taille des fichiers (5MB max)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError('La taille maximale des fichiers est de 5MB');
      return;
    }

    // Vérifier le type des fichiers
    const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      setError('Seules les images sont autorisées');
      return;
    }

    setSelectedFiles(files);
    setError(null);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageError = (mediaId: string) => {
    setImageErrors(prev => new Set(prev).add(mediaId));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <Layout isAdmin>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des galeries...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout isAdmin>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Galeries d'Événements</h1>
            <p className="text-gray-600 mt-2">
              Gérez les galeries photos pour chaque événement (max 10 images par galerie)
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Créer une galerie
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Créer une galerie</DialogTitle>
                <DialogDescription>
                  Créez une nouvelle galerie pour un événement avec jusqu'à 10 images
                </DialogDescription>
              </DialogHeader>
              <GalerieForm 
                formData={formData}
                setFormData={setFormData}
                evenements={evenements}
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                onFileSelect={handleFileSelect}
                onRemoveFile={removeFile}
                onSubmit={handleCreateGalerie}
                onCancel={() => {
                  setIsCreateDialogOpen(false);
                  resetForm();
                  setSelectedFiles([]);
                }}
                saving={saving}
                error={error}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Modifier la galerie</DialogTitle>
                <DialogDescription>
                  Modifiez les informations de la galerie et ajoutez de nouvelles images
                </DialogDescription>
              </DialogHeader>
              <GalerieForm 
                formData={formData}
                setFormData={setFormData}
                evenements={evenements}
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                onFileSelect={handleFileSelect}
                onRemoveFile={removeFile}
                onSubmit={handleUpdateGalerie}
                onCancel={() => {
                  setIsEditDialogOpen(false);
                  resetForm();
                  setSelectedFiles([]);
                }}
                saving={saving}
                error={error}
                isEdit={true}
                selectedGalerie={selectedGalerie}
                onDeleteMedia={handleDeleteMedia}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher une galerie..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Galeries Grid */}
        {filteredGaleries.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune galerie trouvée</h3>
              <p className="text-gray-500 mb-4">Commencez par créer votre première galerie d'événement</p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Créer une galerie
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGaleries.map((galerie) => (
              <Card key={galerie.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{galerie.titre}</CardTitle>
                      <CardDescription className="text-sm mt-1">
                        <div className="flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" />
                          {formatDate(galerie.evenement.date)}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {galerie.evenement.lycee.nom}
                        </div>
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      {galerie.medias.length}/10
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {/* Mini galerie */}
                  <div className="grid grid-cols-3 gap-1 mb-4">
                    {galerie.medias.slice(0, 6).map((media, index) => (
                      <div key={media.id} className="relative aspect-square bg-gray-100 rounded overflow-hidden">
                        {imageErrors.has(media.id) ? (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <ImageIcon className="h-4 w-4 text-gray-400" />
                          </div>
                        ) : (
                          <img
                            src={media.fichier}
                            alt={media.titre}
                            className="w-full h-full object-cover"
                            onError={() => handleImageError(media.id)}
                          />
                        )}
                        {index === 5 && galerie.medias.length > 6 && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xs font-medium">
                            +{galerie.medias.length - 6}
                          </div>
                        )}
                      </div>
                    ))}
                    {galerie.medias.length === 0 && (
                      <div className="col-span-3 aspect-square bg-gray-100 rounded flex items-center justify-center">
                        <Camera className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {galerie.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {galerie.description}
                    </p>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Users className="h-3 w-3" />
                      {galerie.medias.length} image{galerie.medias.length > 1 ? 's' : ''}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(galerie)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer la galerie</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer cette galerie et toutes ses images ? Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteGalerie(galerie.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
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

interface GalerieFormProps {
  formData: {
    titre: string;
    description: string;
    evenementId: string;
  };
  setFormData: (data: any) => void;
  evenements: Evenement[];
  selectedFiles: File[];
  setSelectedFiles: (files: File[]) => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  onSubmit: () => void;
  onCancel: () => void;
  saving: boolean;
  error: string | null;
  isEdit?: boolean;
  selectedGalerie?: Galerie | null;
  onDeleteMedia?: (mediaId: string) => void;
}

function GalerieForm({
  formData,
  setFormData,
  evenements,
  selectedFiles,
  setSelectedFiles,
  onFileSelect,
  onRemoveFile,
  onSubmit,
  onCancel,
  saving,
  error,
  isEdit = false,
  selectedGalerie = null,
  onDeleteMedia
}: GalerieFormProps) {
  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <Label htmlFor="evenementId">Événement *</Label>
        <Select value={formData.evenementId} onValueChange={(value) => setFormData({...formData, evenementId: value})} disabled={isEdit}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un événement" />
          </SelectTrigger>
          <SelectContent>
            {evenements.map((evenement) => (
              <SelectItem key={evenement.id} value={evenement.id}>
                {new Date(evenement.date).toLocaleDateString('fr-FR')} - {evenement.lycee.nom}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isEdit && (
          <p className="text-xs text-gray-500 mt-1">L'événement ne peut pas être modifié</p>
        )}
      </div>

      <div>
        <Label htmlFor="titre">Titre de la galerie *</Label>
        <Input
          id="titre"
          value={formData.titre}
          onChange={(e) => setFormData({...formData, titre: e.target.value})}
          placeholder="Ex: Forum d'orientation 2024"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Description de la galerie..."
          rows={3}
        />
      </div>

      {isEdit && selectedGalerie && selectedGalerie.medias.length > 0 && (
        <div>
          <Label>Images existantes ({selectedGalerie.medias.length}/10)</Label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {selectedGalerie.medias.map((media) => (
              <div key={media.id} className="relative group">
                <div className="aspect-square bg-gray-100 rounded overflow-hidden">
                  <img
                    src={media.fichier}
                    alt={media.titre}
                    className="w-full h-full object-cover"
                  />
                </div>
                {onDeleteMedia && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onDeleteMedia(media.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <Label>
          {isEdit ? 'Ajouter des images' : 'Images'} (max 10)
          {isEdit && selectedGalerie && (
            <span className="text-xs text-gray-500 ml-2">
              ({selectedGalerie.medias.length} déjà présentes)
            </span>
          )}
        </Label>
        <div className="mt-2">
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={onFileSelect}
            className="mb-2"
          />
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Fichiers sélectionnés:</p>
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm truncate flex-1">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveFile(index)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onCancel} disabled={saving}>
          Annuler
        </Button>
        <Button 
          onClick={onSubmit} 
          disabled={saving || !formData.titre || !formData.evenementId}
        >
          {saving ? (isEdit ? 'Mise à jour...' : 'Création...') : (isEdit ? 'Mettre à jour' : 'Créer la galerie')}
        </Button>
      </div>
    </div>
  );
}