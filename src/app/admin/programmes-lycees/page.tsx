"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ConfirmDialog, useConfirmDialog } from "@/components/ui/confirm-dialog";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  Users, 
  BookOpen,
  CalendarDays,
  Building2,
  Save,
  X,
  Shield,
  ArrowLeft
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useRouter } from "next/navigation";

interface ProgrammeLycee {
  id: string;
  titre: string;
  description: string;
  heure: string;
  duree: string;
  lieu: string;
  type: "ACCUEIL" | "PRESENTATION" | "VISITE" | "ATELIER" | "RENCONTRE" | "REPAS" | "DEMONSTRATION" | "FORUM" | "INFORMATION" | "CLOTURE";
  public: string;
  animateur: string;
  ordre: number;
  lycee: {
    id: string;
    nom: string;
  };
}

interface Lycee {
  id: string;
  nom: string;
}

interface ProgrammeFormData {
  titre: string;
  description: string;
  heure: string;
  duree: string;
  lieu: string;
  type: "ACCUEIL" | "PRESENTATION" | "VISITE" | "ATELIER" | "RENCONTRE" | "REPAS" | "DEMONSTRATION" | "FORUM" | "INFORMATION" | "CLOTURE";
  public: string;
  animateur: string;
  lyceeId: string;
  ordre: number;
}

export default function ProgrammesLyceesAdmin() {
  const { confirm, ConfirmDialog } = useConfirmDialog();
  const [programmes, setProgrammes] = useState<ProgrammeLycee[]>([]);
  const [lycees, setLycees] = useState<Lycee[]>([]);
  const [filteredProgrammes, setFilteredProgrammes] = useState<ProgrammeLycee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [lyceeFilter, setLyceeFilter] = useState<string>("TOUS");
  const [typeFilter, setTypeFilter] = useState<string>("TOUS");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProgramme, setEditingProgramme] = useState<ProgrammeLycee | null>(null);
  const [formData, setFormData] = useState<ProgrammeFormData>({
    titre: "",
    description: "",
    heure: "",
    duree: "",
    lieu: "",
    type: "PRESENTATION",
    public: "Tous",
    animateur: "",
    lyceeId: "",
    ordre: 0,
  });
  const router = useRouter();

  // Récupérer les programmes et les lycées
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      
      if (!token) {
        console.error("Aucun token d'authentification trouvé");
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      
      setIsAuthenticated(true);
      
      // Récupérer les programmes
      const programmesResponse = await fetch('/api/admin/programmes-lycees', {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (programmesResponse.ok) {
        const programmesData = await programmesResponse.json();
        setProgrammes(programmesData.data);
        setFilteredProgrammes(programmesData.data);
      } else if (programmesResponse.status === 401) {
        console.error("Token invalide ou expiré");
        setIsAuthenticated(false);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        return;
      }

      // Récupérer les lycées
      const lyceesResponse = await fetch('/api/admin/lycees', {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (lyceesResponse.ok) {
        const lyceesData = await lyceesResponse.json();
        setLycees(lyceesData.data);
      } else if (lyceesResponse.status === 401) {
        console.error("Token invalide ou expiré");
        setIsAuthenticated(false);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        return;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = programmes;

    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(programme =>
        programme.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        programme.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        programme.lycee.nom.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrer par lycée
    if (lyceeFilter !== "TOUS") {
      filtered = filtered.filter(programme => programme.lyceeId === lyceeFilter);
    }

    // Filtrer par type
    if (typeFilter !== "TOUS") {
      filtered = filtered.filter(programme => programme.type === typeFilter);
    }

    setFilteredProgrammes(filtered);
  }, [programmes, searchTerm, lyceeFilter, typeFilter]);

  const handleCreate = () => {
    setEditingProgramme(null);
    setFormData({
      titre: "",
      description: "",
      heure: "",
      duree: "",
      lieu: "",
      type: "PRESENTATION",
      public: "Tous",
      animateur: "",
      lyceeId: lycees.length > 0 ? lycees[0].id : "",
      ordre: programmes.length > 0 ? Math.max(...programmes.map(p => p.ordre)) + 1 : 0,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (programme: ProgrammeLycee) => {
    setEditingProgramme(programme);
    setFormData({
      titre: programme.titre,
      description: programme.description,
      heure: programme.heure,
      duree: programme.duree,
      lieu: programme.lieu,
      type: programme.type,
      public: programme.public,
      animateur: programme.animateur,
      lyceeId: programme.lyceeId,
      ordre: programme.ordre,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const shouldDelete = await confirm({
      title: "Supprimer le programme",
      description: "Êtes-vous sûr de vouloir supprimer ce programme ? Cette action est irréversible.",
      confirmText: "Supprimer",
      cancelText: "Annuler",
      variant: "destructive",
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("adminToken");
          const response = await fetch(`/api/admin/programmes-lycees/${id}`, {
            method: 'DELETE',
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });

          if (response.ok) {
            await fetchData();
          } else {
            alert('Erreur lors de la suppression du programme');
          }
        } catch (error) {
          console.error('Erreur lors de la suppression:', error);
          alert('Erreur lors de la suppression du programme');
        }
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingProgramme 
        ? `/api/admin/programmes-lycees/${editingProgramme.id}`
        : '/api/admin/programmes-lycees';
      
      const method = editingProgramme ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${localStorage.getItem("adminToken")}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsDialogOpen(false);
        await fetchData();
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors de l\'enregistrement');
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      alert('Erreur lors de l\'enregistrement');
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ACCUEIL': return 'bg-blue-100 text-blue-800';
      case 'PRESENTATION': return 'bg-green-100 text-green-800';
      case 'VISITE': return 'bg-purple-100 text-purple-800';
      case 'ATELIER': return 'bg-orange-100 text-orange-800';
      case 'RENCONTRE': return 'bg-pink-100 text-pink-800';
      case 'REPAS': return 'bg-yellow-100 text-yellow-800';
      case 'DEMONSTRATION': return 'bg-indigo-100 text-indigo-800';
      case 'FORUM': return 'bg-red-100 text-red-800';
      case 'INFORMATION': return 'bg-gray-100 text-gray-800';
      case 'CLOTURE': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des programmes...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Shield className="h-6 w-6 text-blue-600" />
                Authentification Requise
              </CardTitle>
              <CardDescription>
                Vous devez être connecté pour accéder à la gestion des programmes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Compte de démonstration :</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <div><strong>Email:</strong> admin@atlantisevents.ma</div>
                  <div><strong>Mot de passe:</strong> admin123</div>
                </div>
              </div>
              <div className="space-y-2">
                <Button 
                  onClick={() => window.location.href = "/admin/login"} 
                  className="w-full"
                >
                  Se connecter
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = "/admin"} 
                  className="w-full"
                >
                  Retour au tableau de bord
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => router.push("/admin")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Gestion des Programmes de Lycées</h1>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un programme
            </Button>
          </div>
        </div>
      </header>

      {/* Filtres */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher un programme..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={lyceeFilter} onValueChange={setLyceeFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Lycée" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TOUS">Tous les lycées</SelectItem>
                  {lycees.map((lycee) => (
                    <SelectItem key={lycee.id} value={lycee.id}>
                      {lycee.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full lg:w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TOUS">Tous les types</SelectItem>
                  <SelectItem value="ACCUEIL">Accueil</SelectItem>
                  <SelectItem value="PRESENTATION">Présentation</SelectItem>
                  <SelectItem value="VISITE">Visite</SelectItem>
                  <SelectItem value="ATELIER">Atelier</SelectItem>
                  <SelectItem value="RENCONTRE">Rencontre</SelectItem>
                  <SelectItem value="REPAS">Repas</SelectItem>
                  <SelectItem value="DEMONSTRATION">Démonstration</SelectItem>
                  <SelectItem value="FORUM">Forum</SelectItem>
                  <SelectItem value="INFORMATION">Information</SelectItem>
                  <SelectItem value="CLOTURE">Clôture</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-gray-600 w-full lg:w-auto text-center lg:text-left">
              {filteredProgrammes.length} programme{filteredProgrammes.length > 1 ? 's' : ''} trouvé{filteredProgrammes.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Liste des programmes */}
        {filteredProgrammes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {programmes.length === 0 ? "Aucun programme disponible" : "Aucun programme trouvé"}
              </h3>
              <p className="text-gray-500">
                {programmes.length === 0 
                  ? "Commencez par ajouter des programmes pour les lycées" 
                  : "Essayez de modifier vos critères de recherche"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredProgrammes.map((programme, index) => (
              <Card key={programme.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className={getTypeColor(programme.type)}>
                          {programme.type}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {programme.lycee.nom}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <span className="font-semibold">#{programme.ordre}</span>
                        </Badge>
                      </div>
                      
                      <h3 className="text-lg font-semibold mb-2">{programme.titre}</h3>
                      <p className="text-gray-600 mb-3">{programme.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{programme.heure} ({programme.duree})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{programme.lieu}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{programme.public}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{programme.animateur}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(programme)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(programme.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Dialogue pour ajouter/modifier un programme */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProgramme ? 'Modifier le programme' : 'Ajouter un programme'}
            </DialogTitle>
            <DialogDescription>
              {editingProgramme 
                ? 'Modifiez les informations du programme ci-dessous'
                : 'Remplissez les informations pour créer un nouveau programme'
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="titre">Titre *</Label>
                <Input
                  id="titre"
                  value={formData.titre}
                  onChange={(e) => setFormData({...formData, titre: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="lyceeId">Lycée *</Label>
                <Select value={formData.lyceeId} onValueChange={(value) => setFormData({...formData, lyceeId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un lycée" />
                  </SelectTrigger>
                  <SelectContent>
                    {lycees.map((lycee) => (
                      <SelectItem key={lycee.id} value={lycee.id}>
                        {lycee.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="heure">Heure *</Label>
                <Input
                  id="heure"
                  type="time"
                  value={formData.heure}
                  onChange={(e) => setFormData({...formData, heure: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="duree">Durée *</Label>
                <Input
                  id="duree"
                  placeholder="ex: 30 min, 1h, 1h30"
                  value={formData.duree}
                  onChange={(e) => setFormData({...formData, duree: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="lieu">Lieu *</Label>
                <Input
                  id="lieu"
                  value={formData.lieu}
                  onChange={(e) => setFormData({...formData, lieu: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="type">Type *</Label>
                <Select value={formData.type} onValueChange={(value: any) => setFormData({...formData, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACCUEIL">Accueil</SelectItem>
                    <SelectItem value="PRESENTATION">Présentation</SelectItem>
                    <SelectItem value="VISITE">Visite</SelectItem>
                    <SelectItem value="ATELIER">Atelier</SelectItem>
                    <SelectItem value="RENCONTRE">Rencontre</SelectItem>
                    <SelectItem value="REPAS">Repas</SelectItem>
                    <SelectItem value="DEMONSTRATION">Démonstration</SelectItem>
                    <SelectItem value="FORUM">Forum</SelectItem>
                    <SelectItem value="INFORMATION">Information</SelectItem>
                    <SelectItem value="CLOTURE">Clôture</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="public">Public</Label>
                <Input
                  id="public"
                  value={formData.public}
                  onChange={(e) => setFormData({...formData, public: e.target.value})}
                  placeholder="ex: Tous, Élèves, Parents..."
                />
              </div>
              
              <div>
                <Label htmlFor="animateur">Animateur</Label>
                <Input
                  id="animateur"
                  value={formData.animateur}
                  onChange={(e) => setFormData({...formData, animateur: e.target.value})}
                  placeholder="Nom de l'animateur"
                />
              </div>
              
              <div>
                <Label htmlFor="ordre">Ordre</Label>
                <Input
                  id="ordre"
                  type="number"
                  value={formData.ordre}
                  onChange={(e) => setFormData({...formData, ordre: parseInt(e.target.value) || 0})}
                  min="0"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                required
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                {editingProgramme ? 'Mettre à jour' : 'Créer'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <ConfirmDialog />
    </Layout>
  );
}