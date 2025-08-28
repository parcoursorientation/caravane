"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Building, 
  Globe, 
  Mail, 
  Phone, 
  MapPin,
  Star,
  Upload,
  Image as ImageIcon,
  ExternalLink,
  AlertTriangle,
  Check
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPartenaire, setEditingPartenaire] = useState<Partenaire | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [partenaireToDelete, setPartenaireToDelete] = useState<Partenaire | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    type: "ORGANISATEUR",
    description: "",
    logo: "",
    siteWeb: "",
    email: "",
    telephone: "",
    adresse: "",
    ville: "",
    pays: "",
    statut: "ACTIF",
    ordre: 0
  });

  // Récupérer les données depuis l'API
  useEffect(() => {
    fetchPartenaires();
  }, []);

  const fetchPartenaires = async () => {
    try {
      const response = await fetch('/api/admin/partenaires');
      if (response.ok) {
        const data = await response.json();
        setPartenaires(data.data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des partenaires:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingPartenaire 
        ? `/api/admin/partenaires/${editingPartenaire.id}`
        : '/api/admin/partenaires';
      
      const method = editingPartenaire ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchPartenaires();
        setIsDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleEdit = (partenaire: Partenaire) => {
    setEditingPartenaire(partenaire);
    setFormData({
      nom: partenaire.nom,
      type: partenaire.type,
      description: partenaire.description || "",
      logo: partenaire.logo || "",
      siteWeb: partenaire.siteWeb || "",
      email: partenaire.email || "",
      telephone: partenaire.telephone || "",
      adresse: partenaire.adresse || "",
      ville: partenaire.ville || "",
      pays: partenaire.pays || "",
      statut: partenaire.statut,
      ordre: partenaire.ordre
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const partenaire = partenaires.find(p => p.id === id);
    if (partenaire) {
      setPartenaireToDelete(partenaire);
      setIsDeleteDialogOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!partenaireToDelete) return;

    try {
      const response = await fetch(`/api/admin/partenaires/${partenaireToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDeleteSuccess(true);
        setTimeout(() => {
          setIsDeleteDialogOpen(false);
          setPartenaireToDelete(null);
          setDeleteSuccess(false);
          fetchPartenaires();
        }, 1500);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setIsDeleteDialogOpen(false);
      setPartenaireToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setPartenaireToDelete(null);
    setDeleteSuccess(false);
  };

  const handleToggleStatut = async (id: string, currentStatut: string) => {
    try {
      const newStatut = currentStatut === "ACTIF" ? "INACTIF" : "ACTIF";
      const response = await fetch(`/api/admin/partenaires/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statut: newStatut }),
      });

      if (response.ok) {
        await fetchPartenaires();
      }
    } catch (error) {
      console.error('Erreur lors de la modification du statut:', error);
    }
  };

  const resetForm = () => {
    setEditingPartenaire(null);
    setFormData({
      nom: "",
      type: "ORGANISATEUR",
      description: "",
      logo: "",
      siteWeb: "",
      email: "",
      telephone: "",
      adresse: "",
      ville: "",
      pays: "",
      statut: "ACTIF",
      ordre: 0
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      ORGANISATEUR: 'Organisateur',
      PARTENAIRE: 'Partenaire',
      SPONSOR: 'Sponsor',
      MEDIA: 'Média',
      INSTITUTION: 'Institution'
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      ORGANISATEUR: 'bg-blue-100 text-blue-800',
      PARTENAIRE: 'bg-green-100 text-green-800',
      SPONSOR: 'bg-yellow-100 text-yellow-800',
      MEDIA: 'bg-purple-100 text-purple-800',
      INSTITUTION: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getStatutColor = (statut: string) => {
    const colors: Record<string, string> = {
      ACTIF: 'bg-green-100 text-green-800',
      INACTIF: 'bg-red-100 text-red-800',
      EN_ATTENTE: 'bg-yellow-100 text-yellow-800'
    };
    return colors[statut] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <Layout isAdmin>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout isAdmin>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Partenaires</h1>
            <p className="text-gray-600">Gérez les organisateurs, partenaires et sponsors de l'événement</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Partenaire
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingPartenaire ? 'Modifier le Partenaire' : 'Nouveau Partenaire'}
                  </DialogTitle>
                  <DialogDescription>
                    Ajoutez ou modifiez les informations d'un partenaire de l'événement
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nom">Nom *</Label>
                    <Input
                      id="nom"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      placeholder="Ex: ATLANTIS EVENTS"
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="type">Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as any })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ORGANISATEUR">Organisateur</SelectItem>
                        <SelectItem value="PARTENAIRE">Partenaire</SelectItem>
                        <SelectItem value="SPONSOR">Sponsor</SelectItem>
                        <SelectItem value="MEDIA">Média</SelectItem>
                        <SelectItem value="INSTITUTION">Institution</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Description du partenaire..."
                      rows={3}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="logo">Logo</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="logo"
                        type="url"
                        value={formData.logo}
                        onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                        placeholder="https://exemple.com/logo.png"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) {
                              // Dans une implémentation réelle, vous uploaderiez le fichier
                              // et obtiendriez l'URL. Pour l'instant, nous utilisons un placeholder.
                              const fileName = file.name;
                              setFormData({ ...formData, logo: `/uploads/${fileName}` });
                            }
                          };
                          input.click();
                        }}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500">URL du logo ou téléchargez une image</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="siteWeb">Site web</Label>
                      <Input
                        id="siteWeb"
                        type="url"
                        value={formData.siteWeb}
                        onChange={(e) => setFormData({ ...formData, siteWeb: e.target.value })}
                        placeholder="https://exemple.com"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="contact@exemple.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="telephone">Téléphone</Label>
                      <Input
                        id="telephone"
                        type="tel"
                        value={formData.telephone}
                        onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                        placeholder="+212 6XX-XXXXXX"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="ordre">Ordre d'affichage</Label>
                      <Input
                        id="ordre"
                        type="number"
                        value={formData.ordre}
                        onChange={(e) => setFormData({ ...formData, ordre: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="adresse">Adresse</Label>
                    <Input
                      id="adresse"
                      value={formData.adresse}
                      onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                      placeholder="123, Avenue Mohammed VI"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="ville">Ville</Label>
                      <Input
                        id="ville"
                        value={formData.ville}
                        onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                        placeholder="Tanger"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="pays">Pays</Label>
                      <Input
                        id="pays"
                        value={formData.pays}
                        onChange={(e) => setFormData({ ...formData, pays: e.target.value })}
                        placeholder="Maroc"
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="statut">Statut</Label>
                    <Select value={formData.statut} onValueChange={(value) => setFormData({ ...formData, statut: value as any })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIF">Actif</SelectItem>
                        <SelectItem value="INACTIF">Inactif</SelectItem>
                        <SelectItem value="EN_ATTENTE">En attente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">
                    {editingPartenaire ? 'Mettre à jour' : 'Créer'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Boîte de dialogue de confirmation de suppression */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {deleteSuccess ? (
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                  )}
                </div>
                <div>
                  <DialogTitle className={deleteSuccess ? "text-green-600" : "text-red-600"}>
                    {deleteSuccess ? "Suppression réussie" : "Confirmer la suppression"}
                  </DialogTitle>
                  <DialogDescription className="mt-1">
                    {deleteSuccess 
                      ? "Le partenaire a été supprimé avec succès."
                      : "Cette action est irréversible. Veuillez confirmer que vous souhaitez supprimer ce partenaire."
                    }
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {!deleteSuccess && partenaireToDelete && (
              <div className="space-y-4">
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    Vous êtes sur le point de supprimer définitivement le partenaire suivant :
                  </AlertDescription>
                </Alert>

                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Nom :</span>
                    <span className="text-sm font-semibold text-gray-900">{partenaireToDelete.nom}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Type :</span>
                    <Badge className={getTypeColor(partenaireToDelete.type)}>
                      {getTypeLabel(partenaireToDelete.type)}
                    </Badge>
                  </div>
                  {partenaireToDelete.description && (
                    <div className="flex items-start justify-between">
                      <span className="text-sm font-medium text-gray-600">Description :</span>
                      <span className="text-sm text-gray-900 max-w-xs text-right">
                        {partenaireToDelete.description}
                      </span>
                    </div>
                  )}
                  {partenaireToDelete.email && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Email :</span>
                      <span className="text-sm text-gray-900">{partenaireToDelete.email}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Statut :</span>
                    <Badge className={getStatutColor(partenaireToDelete.statut)}>
                      {partenaireToDelete.statut}
                    </Badge>
                  </div>
                </div>

                <Alert className="border-orange-200 bg-orange-50">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    <strong>Attention :</strong> Cette action ne peut pas être annulée. 
                    Toutes les données associées à ce partenaire seront perdues.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            <DialogFooter className="flex gap-2 sm:gap-0">
              {!deleteSuccess ? (
                <>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={cancelDelete}
                    className="sm:w-auto"
                  >
                    Annuler
                  </Button>
                  <Button 
                    type="button" 
                    variant="destructive" 
                    onClick={confirmDelete}
                    className="sm:w-auto"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer définitivement
                  </Button>
                </>
              ) : (
                <Button 
                  type="button" 
                  onClick={cancelDelete}
                  className="sm:w-auto bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4 mr-2" />
                  OK
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="text-center">
            <CardHeader>
              <Building className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">{partenaires.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Total</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">
                {partenaires.filter(p => p.type === 'ORGANISATEUR').length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Organisateurs</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <CardTitle className="text-lg">
                {partenaires.filter(p => p.type === 'PARTENAIRE').length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Partenaires</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Globe className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">
                {partenaires.filter(p => p.type === 'SPONSOR').length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Sponsors</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Building className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <CardTitle className="text-lg">
                {partenaires.filter(p => p.statut === 'ACTIF').length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Actifs</p>
            </CardContent>
          </Card>
        </div>

        {/* Tableau des partenaires */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des Partenaires</CardTitle>
            <CardDescription>
              Gérez tous les partenaires, organisateurs et sponsors de l'événement
            </CardDescription>
          </CardHeader>
          <CardContent>
            {partenaires.length === 0 ? (
              <div className="text-center py-8">
                <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun partenaire</h3>
                <p className="text-gray-500 mb-4">Créez votre premier partenaire</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Localisation</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Ordre</TableHead>
                    <TableHead>Créé le</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partenaires.map((partenaire) => (
                    <TableRow key={partenaire.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {partenaire.logo && (
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <ImageIcon className="h-4 w-4 text-gray-500" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{partenaire.nom}</div>
                            {partenaire.description && (
                              <div className="text-sm text-gray-500 max-w-xs truncate">
                                {partenaire.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(partenaire.type)}>
                          {getTypeLabel(partenaire.type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {partenaire.email && (
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="h-3 w-3 text-gray-500" />
                              <span className="truncate">{partenaire.email}</span>
                            </div>
                          )}
                          {partenaire.telephone && (
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="h-3 w-3 text-gray-500" />
                              <span>{partenaire.telephone}</span>
                            </div>
                          )}
                          {partenaire.siteWeb && (
                            <div className="flex items-center gap-1 text-sm">
                              <ExternalLink className="h-3 w-3 text-gray-500" />
                              <a 
                                href={partenaire.siteWeb} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline truncate"
                              >
                                Site web
                              </a>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {partenaire.ville && (
                            <div>{partenaire.ville}</div>
                          )}
                          {partenaire.pays && (
                            <div className="text-gray-500">{partenaire.pays}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatutColor(partenaire.statut)}>
                          {partenaire.statut}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{partenaire.ordre}</div>
                      </TableCell>
                      <TableCell>
                        {formatDate(partenaire.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStatut(partenaire.id, partenaire.statut)}
                            title={partenaire.statut === 'ACTIF' ? 'Désactiver' : 'Activer'}
                          >
                            <Switch checked={partenaire.statut === 'ACTIF'} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(partenaire)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(partenaire.id)}
                          >
                            <Trash2 className="h-4 w-4" />
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
    </Layout>
  );
}