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
  Video, 
  File, 
  CalendarDays, 
  MapPin,
  Eye,
  Edit,
  Trash2,
  Upload,
  X
} from "lucide-react";
import Layout from "@/components/layout/Layout";

interface Media {
  id: string;
  titre: string;
  description?: string;
  fichier: string;
  type: "PHOTO" | "VIDEO" | "DOCUMENT";
  categorie?: string;
  evenement?: {
    id: string;
    date: string;
    lycee: {
      nom: string;
    };
  };
  createdAt: string;
}

interface Evenement {
  id: string;
  date: string;
  lycee: {
    nom: string;
  };
}

export default function AdminGaleriePage() {
  const [user, setUser] = useState<any>(null);
  const [medias, setMedias] = useState<Media[]>([]);
  const [filteredMedias, setFilteredMedias] = useState<Media[]>([]);
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("TOUS");
  const [categorieFilter, setCategorieFilter] = useState<string>("TOUS");
  const [evenementFilter, setEvenementFilter] = useState<string>("TOUS");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    type: "PHOTO" as "PHOTO" | "VIDEO" | "DOCUMENT",
    categorie: "",
    evenementId: "",
    fichier: null as File | null
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
      console.log("Chargement des données de la galerie...");
      
      // Charger les événements
      const evenementsResponse = await fetch('/api/admin/evenements/simple');
      if (evenementsResponse.ok) {
        const evenementsData = await evenementsResponse.json();
        setEvenements(evenementsData);
        console.log("Événements chargés:", evenementsData.length);
      } else {
        console.log("Erreur lors du chargement des événements:", evenementsResponse.status);
      }

      // Charger les médias
      const mediasResponse = await fetch('/api/admin/galerie');
      if (mediasResponse.ok) {
        const mediasData = await mediasResponse.json();
        setMedias(mediasData);
        setFilteredMedias(mediasData);
        console.log("Médias chargés:", mediasData.length);
      } else {
        console.log("Erreur lors du chargement des médias:", mediasResponse.status);
        // Si l'API n'est pas encore prête, utiliser des données simulées
        const mockMedias: Media[] = [
          {
            id: "1",
            titre: "Inauguration du Forum 2024",
            description: "Cérémonie d'ouverture du forum d'orientation 2024",
            fichier: "/uploads/1755949877899-kqvvkffyauf.jpg",
            type: "PHOTO",
            categorie: "Cérémonie",
            evenement: {
              id: "1",
              date: "2024-09-15",
              lycee: { nom: "Lycée Ibn Battouta" }
            },
            createdAt: "2024-09-15T10:00:00Z"
          },
          {
            id: "2",
            titre: "Stands des exposants",
            description: "Vue d'ensemble des stands des différentes écoles",
            fichier: "/uploads/1755949804484-5vrl28oum6d.png",
            type: "PHOTO",
            categorie: "Exposants",
            evenement: {
              id: "1",
              date: "2024-09-15",
              lycee: { nom: "Lycée Ibn Battouta" }
            },
            createdAt: "2024-09-15T11:00:00Z"
          },
          {
            id: "3",
            titre: "Conférence sur l'ingénierie",
            description: "Intervention d'un ingénieur de l'École Supérieure d'Ingénierie",
            fichier: "/api/placeholder/800/600",
            type: "VIDEO",
            categorie: "Conférence",
            evenement: {
              id: "1",
              date: "2024-09-15",
              lycee: { nom: "Lycée Ibn Battouta" }
            },
            createdAt: "2024-09-15T14:00:00Z"
          }
        ];

        const mockEvenements: Evenement[] = [
          {
            id: "1",
            date: "2024-09-15",
            lycee: { nom: "Lycée Ibn Battouta" }
          },
          {
            id: "2",
            date: "2024-03-20",
            lycee: { nom: "Lycée Ibn Khaldoun" }
          }
        ];

        setMedias(mockMedias);
        setFilteredMedias(mockMedias);
        setEvenements(mockEvenements);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      // Utiliser des données simulées en cas d'erreur
      const mockMedias: Media[] = [
        {
          id: "1",
          titre: "Inauguration du Forum 2024",
          description: "Cérémonie d'ouverture du forum d'orientation 2024",
          fichier: "/uploads/1755949877899-kqvvkffyauf.jpg",
          type: "PHOTO",
          categorie: "Cérémonie",
          evenement: {
            id: "1",
            date: "2024-09-15",
            lycee: { nom: "Lycée Ibn Battouta" }
          },
          createdAt: "2024-09-15T10:00:00Z"
        }
      ];

      const mockEvenements: Evenement[] = [
        {
          id: "1",
          date: "2024-09-15",
          lycee: { nom: "Lycée Ibn Battouta" }
        }
      ];

      setMedias(mockMedias);
      setFilteredMedias(mockMedias);
      setEvenements(mockEvenements);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = medias;

    // Filtrer par recherche
    if (searchTerm) {
      filtered = filtered.filter(media => 
        media.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        media.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrer par type
    if (typeFilter !== "TOUS") {
      filtered = filtered.filter(media => media.type === typeFilter);
    }

    // Filtrer par catégorie
    if (categorieFilter !== "TOUS") {
      filtered = filtered.filter(media => media.categorie === categorieFilter);
    }

    // Filtrer par événement
    if (evenementFilter !== "TOUS") {
      filtered = filtered.filter(media => media.evenement?.id === evenementFilter);
    }

    setFilteredMedias(filtered);
  }, [medias, searchTerm, typeFilter, categorieFilter, evenementFilter]);

  const handleCreateMedia = async () => {
    setSaving(true);
    setError(null);
    
    try {
      let fichierUrl = "/api/placeholder/800/600"; // Valeur par défaut
      
      // Si un fichier est sélectionné, l'uploader d'abord
      if (formData.fichier) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', formData.fichier);
        
        const uploadResponse = await fetch('/api/admin/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || 'Erreur lors de l\'upload du fichier');
        }

        const uploadResult = await uploadResponse.json();
        fichierUrl = uploadResult.url;
      }

      const response = await fetch('/api/admin/galerie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titre: formData.titre,
          description: formData.description,
          type: formData.type,
          categorie: formData.categorie,
          evenementId: formData.evenementId === "none" ? null : formData.evenementId || null,
          fichier: fichierUrl
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création du média');
      }

      const newMedia = await response.json();
      setMedias([newMedia, ...medias]);
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Erreur:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors de la création du média');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateMedia = async () => {
    if (!selectedMedia) return;

    setSaving(true);
    setError(null);
    
    try {
      let fichierUrl = selectedMedia.fichier; // Conserver le fichier existant par défaut
      
      // Si un nouveau fichier est sélectionné, l'uploader
      if (formData.fichier) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', formData.fichier);
        
        const uploadResponse = await fetch('/api/admin/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || 'Erreur lors de l\'upload du fichier');
        }

        const uploadResult = await uploadResponse.json();
        fichierUrl = uploadResult.url;
      }

      const response = await fetch(`/api/admin/galerie/${selectedMedia.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titre: formData.titre,
          description: formData.description,
          type: formData.type,
          categorie: formData.categorie,
          evenementId: formData.evenementId === "none" ? null : formData.evenementId || null,
          fichier: fichierUrl
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour du média');
      }

      const updatedMedia = await response.json();
      const updatedMedias = medias.map(media => 
        media.id === selectedMedia.id ? updatedMedia : media
      );

      setMedias(updatedMedias);
      setIsEditDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Erreur:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors de la mise à jour du média');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMedia = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/galerie/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression du média');
      }

      const updatedMedias = medias.filter(media => media.id !== id);
      setMedias(updatedMedias);
    } catch (error) {
      console.error('Erreur:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors de la suppression du média');
    }
  };

  const openEditDialog = (media: Media) => {
    setSelectedMedia(media);
    setFormData({
      titre: media.titre,
      description: media.description || "",
      type: media.type,
      categorie: media.categorie || "",
      evenementId: media.evenement?.id || "",
      fichier: null
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      titre: "",
      description: "",
      type: "PHOTO",
      categorie: "",
      evenementId: "",
      fichier: null
    });
    setSelectedMedia(null);
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

  const getUniqueCategories = () => {
    const categories = medias.map(media => media.categorie).filter(Boolean);
    return [...new Set(categories)];
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "PHOTO": return <ImageIcon className="h-4 w-4" />;
      case "VIDEO": return <Video className="h-4 w-4" />;
      case "DOCUMENT": return <File className="h-4 w-4" />;
      default: return <ImageIcon className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "PHOTO": return "bg-blue-100 text-blue-800";
      case "VIDEO": return "bg-red-100 text-red-800";
      case "DOCUMENT": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <Layout isAdmin>
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
    <Layout isAdmin>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion de la Galerie</h1>
            <p className="text-gray-600 mt-2">
              Gérez les photos, vidéos et documents de vos événements
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un média
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Ajouter un média</DialogTitle>
                <DialogDescription>
                  Ajoutez une photo, vidéo ou document à la galerie
                </DialogDescription>
              </DialogHeader>
              <MediaForm 
                formData={formData}
                setFormData={setFormData}
                evenements={evenements}
                onSubmit={handleCreateMedia}
                onCancel={() => setIsCreateDialogOpen(false)}
                saving={saving}
                error={error}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-800">
                <span className="text-sm font-medium">Erreur:</span>
                <span className="text-sm">{error}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setError(null)}
                  className="ml-auto text-red-600 hover:text-red-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TOUS">Tous les types</SelectItem>
                  <SelectItem value="PHOTO">Photos</SelectItem>
                  <SelectItem value="VIDEO">Vidéos</SelectItem>
                  <SelectItem value="DOCUMENT">Documents</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categorieFilter} onValueChange={setCategorieFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TOUS">Toutes les catégories</SelectItem>
                  {getUniqueCategories().map((categorie) => (
                    <SelectItem key={categorie} value={categorie}>{categorie}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={evenementFilter} onValueChange={setEvenementFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Événement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TOUS">Tous les événements</SelectItem>
                  {evenements.map((evenement) => (
                    <SelectItem key={evenement.id} value={evenement.id}>
                      {evenement.nom || evenement.lycee.nom} - {formatDate(evenement.date)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="text-sm text-gray-600 flex items-center">
                {filteredMedias.length} média{filteredMedias.length > 1 ? 's' : ''} trouvé{filteredMedias.length > 1 ? 's' : ''}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media Grid */}
        {filteredMedias.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun média trouvé</h3>
              <p className="text-gray-500 mb-4">Commencez par ajouter votre premier média à la galerie</p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un média
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedias.map((media) => (
              <Card key={media.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative aspect-[4/3] bg-gray-100">
                  {media.type === "PHOTO" && !imageErrors.has(media.id) ? (
                    <img 
                      src={media.fichier} 
                      alt={media.titre}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(media.id)}
                    />
                  ) : media.type === "VIDEO" ? (
                    <div className="w-full h-full flex items-center justify-center bg-black">
                      <video 
                        src={media.fichier}
                        className="w-full h-full object-cover"
                        controls={false}
                        muted
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black bg-opacity-50 rounded-full p-3">
                          <Video className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        {getTypeIcon(media.type)}
                        <p className="text-xs mt-2">
                          {imageErrors.has(media.id) ? "Image non disponible" : media.type}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Badge className={`text-xs ${getTypeColor(media.type)}`}>
                      {media.type}
                    </Badge>
                    {media.categorie && (
                      <Badge variant="secondary" className="text-xs">
                        {media.categorie}
                      </Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-sm mb-1 line-clamp-1">{media.titre}</h3>
                  {media.description && (
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">{media.description}</p>
                  )}
                  
                  {media.evenement && (
                    <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                      <CalendarDays className="h-3 w-3" />
                      <span>{media.evenement.nom || media.evenement.lycee.nom} - {formatDate(media.evenement.date)}</span>
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => openEditDialog(media)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Modifier
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer "{media.titre}" ? Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteMedia(media.id)}>
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Modifier le média</DialogTitle>
              <DialogDescription>
                Modifiez les informations du média sélectionné
              </DialogDescription>
            </DialogHeader>
            <MediaForm 
              formData={formData}
              setFormData={setFormData}
              evenements={evenements}
              onSubmit={handleUpdateMedia}
              onCancel={() => setIsEditDialogOpen(false)}
              saving={saving}
              error={error}
            />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}

interface MediaFormProps {
  formData: any;
  setFormData: (data: any) => void;
  evenements: Evenement[];
  onSubmit: () => void;
  onCancel: () => void;
  saving?: boolean;
  error?: string | null;
}

function MediaForm({ formData, setFormData, evenements, onSubmit, onCancel, saving = false, error = null }: MediaFormProps) {
  return (
    <div className="space-y-4">
      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center gap-2 text-red-800">
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="titre">Titre *</Label>
        <Input
          id="titre"
          value={formData.titre}
          onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
          placeholder="Titre du média"
          disabled={saving}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Description du média"
          rows={3}
          disabled={saving}
        />
      </div>

      <div>
        <Label htmlFor="type">Type *</Label>
        <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })} disabled={saving}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PHOTO">Photo</SelectItem>
            <SelectItem value="VIDEO">Vidéo</SelectItem>
            <SelectItem value="DOCUMENT">Document</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="categorie">Catégorie</Label>
        <Input
          id="categorie"
          value={formData.categorie}
          onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
          placeholder="Ex: Cérémonie, Conférence, Exposants..."
          disabled={saving}
        />
      </div>

      <div>
        <Label htmlFor="evenement">Événement associé</Label>
        <Select value={formData.evenementId} onValueChange={(value) => setFormData({ ...formData, evenementId: value })} disabled={saving}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un événement" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Aucun événement</SelectItem>
            {evenements.map((evenement) => (
              <SelectItem key={evenement.id} value={evenement.id}>
                {evenement.nom || evenement.lycee.nom} - {new Date(evenement.date).toLocaleDateString('fr-FR')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="fichier">Fichier *</Label>
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
          onClick={() => document.getElementById('fichier')?.click()}
        >
          {formData.fichier ? (
            <div className="space-y-2">
              <div className="text-green-600">
                <Upload className="h-8 w-8 mx-auto mb-2" />
              </div>
              <p className="text-sm font-medium text-gray-900">
                {formData.fichier.name}
              </p>
              <p className="text-xs text-gray-500">
                {(formData.fichier.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFormData({ ...formData, fichier: null });
                }}
                className="mt-2"
              >
                <X className="h-3 w-3 mr-1" />
                Retirer
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Cliquez pour télécharger ou glissez-déposez
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF, MP4, PDF jusqu'à 10MB
              </p>
            </div>
          )}
          <Input
            id="fichier"
            type="file"
            className="hidden"
            accept="image/*,video/*,.pdf,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                // Vérifier la taille du fichier
                if (file.size > 10 * 1024 * 1024) {
                  alert('Le fichier est trop volumineux (max 10MB)');
                  return;
                }
                setFormData({ ...formData, fichier: file });
              }
            }}
            disabled={saving}
          />
        </div>
        {!formData.fichier && (
          <p className="text-xs text-red-500 mt-1">
            Un fichier est requis
          </p>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <Button onClick={onSubmit} className="flex-1" disabled={saving}>
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
        <Button variant="outline" onClick={onCancel} disabled={saving}>
          Annuler
        </Button>
      </div>
    </div>
  );
}