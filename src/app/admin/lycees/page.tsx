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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  ArrowLeft,
  Save,
  X,
  Search
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Lycee {
  id: string;
  nom: string;
  adresse: string;
  type: "PUBLIC" | "PRIVE";
  description?: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
}

interface LyceeFormData {
  nom: string;
  adresse: string;
  type: "PUBLIC" | "PRIVE" | "";
  description: string;
  logo: string;
}

export default function AdminLyceesPage() {
  const [lycees, setLycees] = useState<Lycee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingLycee, setEditingLycee] = useState<Lycee | null>(null);
  const [deletingLycee, setDeletingLycee] = useState<Lycee | null>(null);
  const [formData, setFormData] = useState<LyceeFormData>({
    nom: "",
    adresse: "",
    type: "",
    description: "",
    logo: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Vérifier l'authentification
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    fetchLycees();
  }, [router]);

  const fetchLycees = async () => {
    try {
      console.log('🔄 Récupération des lycées depuis l\'API...');
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/lycees", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${data.data.length} lycées récupérés depuis l'API`);
        setLycees(data.data);
      } else {
        console.error('❌ Erreur lors de la récupération des lycées:', response.status);
        toast({
          title: "Erreur",
          description: "Erreur lors du chargement des lycées",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ Erreur de connexion au serveur:', error);
      toast({
        title: "Erreur",
        description: "Erreur de connexion au serveur",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("adminToken");
      const url = editingLycee 
        ? `/api/admin/lycees/${editingLycee.id}`
        : "/api/admin/lycees";
      
      const method = editingLycee ? "PUT" : "POST";
      
      console.log(`🔄 ${method} ${url} - Envoi des données...`);
      console.log('📝 Données envoyées:', formData);
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        console.log(`✅ ${editingLycee ? 'Mise à jour' : 'Création'} réussie`);
        toast({
          title: "Succès",
          description: editingLycee ? "Lycée mis à jour avec succès" : "Lycée créé avec succès",
          variant: "default",
        });
        fetchLycees();
        resetForm();
        setIsDialogOpen(false);
      } else {
        console.error(`❌ Erreur lors de ${editingLycee ? 'la mise à jour' : 'la création'}:`, data.error);
        toast({
          title: "Erreur",
          description: data.error || "Une erreur s'est produite",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ Erreur de connexion au serveur:', error);
      toast({
        title: "Erreur",
        description: "Erreur de connexion au serveur",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (lycee: Lycee) => {
    setEditingLycee(lycee);
    setFormData({
      nom: lycee.nom,
      adresse: lycee.adresse,
      type: lycee.type,
      description: lycee.description || "",
      logo: lycee.logo || ""
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (lycee: Lycee) => {
    setDeletingLycee(lycee);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingLycee) return;

    try {
      console.log(`🔄 DELETE /api/admin/lycees/${deletingLycee.id} - Suppression du lycée...`);
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/lycees/${deletingLycee.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        console.log(`✅ Lycée supprimé avec succès: ${deletingLycee.nom}`);
        toast({
          title: "Succès",
          description: "Lycée supprimé avec succès",
          variant: "default",
        });
        fetchLycees();
      } else {
        const data = await response.json();
        console.error('❌ Erreur lors de la suppression:', data.error);
        toast({
          title: "Erreur",
          description: data.error || "Erreur lors de la suppression",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ Erreur de connexion au serveur:', error);
      toast({
        title: "Erreur",
        description: "Erreur de connexion au serveur",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingLycee(null);
    }
  };

  const resetForm = () => {
    setEditingLycee(null);
    setFormData({
      nom: "",
      adresse: "",
      type: "",
      description: "",
      logo: ""
    });
  };

  const filteredLycees = lycees.filter(lycee =>
    lycee.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lycee.adresse.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des lycées...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => router.push("/admin")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Gestion des Lycées</h1>
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un lycée
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barre de recherche */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher un lycée..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tableau des lycées */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Liste des lycées ({filteredLycees.length})
            </CardTitle>
            <CardDescription>
              Gérez les lycées participants à l'événement
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredLycees.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun lycée trouvé</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm ? "Aucun lycée ne correspond à votre recherche." : "Commencez par ajouter un lycée."}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter le premier lycée
                  </Button>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Adresse</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Créé le</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLycees.map((lycee) => (
                    <TableRow key={lycee.id}>
                      <TableCell className="font-medium">{lycee.nom}</TableCell>
                      <TableCell>{lycee.adresse}</TableCell>
                      <TableCell>
                        <Badge variant={lycee.type === "PUBLIC" ? "default" : "secondary"}>
                          {lycee.type === "PUBLIC" ? "Public" : "Privé"}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {lycee.description || "-"}
                      </TableCell>
                      <TableCell>
                        {new Date(lycee.createdAt).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(lycee)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClick(lycee)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog pour ajouter/modifier un lycée */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingLycee ? "Modifier un lycée" : "Ajouter un lycée"}
            </DialogTitle>
            <DialogDescription>
              {editingLycee 
                ? "Modifiez les informations du lycée ci-dessous"
                : "Remplissez les informations pour ajouter un nouveau lycée"
              }
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                  placeholder="Nom du lycée"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select value={formData.type} onValueChange={(value: "PUBLIC" | "PRIVE") => 
                  setFormData(prev => ({ ...prev, type: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PUBLIC">Public</SelectItem>
                    <SelectItem value="PRIVE">Privé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adresse">Adresse *</Label>
              <Textarea
                id="adresse"
                value={formData.adresse}
                onChange={(e) => setFormData(prev => ({ ...prev, adresse: e.target.value }))}
                placeholder="Adresse complète du lycée"
                rows={2}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description du lycée (facultatif)"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">URL du logo</Label>
              <Input
                id="logo"
                value={formData.logo}
                onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.value }))}
                placeholder="URL du logo (facultatif)"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {editingLycee ? "Mise à jour..." : "Création..."}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {editingLycee ? "Mettre à jour" : "Créer"}
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* AlertDialog pour confirmer la suppression */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le lycée "{deletingLycee?.nom}" ? 
              Cette action est irréversible et supprimera définitivement toutes les données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}