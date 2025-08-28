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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Plus, Edit, Trash2, Play, Pause } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { ConfirmDialog, useConfirmDialog } from "@/components/ui/confirm-dialog";

interface CompteARebours {
  id: string;
  titre: string;
  description?: string;
  lieu?: string;
  ville?: string;
  dateCible: string;
  dateDebut?: string;
  dateFin?: string;
  actif: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CompteAReboursPage() {
  const { confirm, ConfirmDialog } = useConfirmDialog();
  const [comptesARebours, setComptesARebours] = useState<CompteARebours[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompte, setEditingCompte] = useState<CompteARebours | null>(null);
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    lieu: "",
    ville: "",
    dateCible: "",
    dateDebut: "",
    dateFin: "",
    actif: true
  });

  // Récupérer les données depuis l'API
  useEffect(() => {
    fetchComptesARebours();
  }, []);

  const fetchComptesARebours = async () => {
    try {
      const response = await fetch('/api/admin/compte-a-rebours');
      if (response.ok) {
        const data = await response.json();
        setComptesARebours(data.data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des comptes à rebours:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Prepare form data, filtering out empty date fields
      const submitData = { ...formData };
      
      // Remove empty date fields to avoid invalid Date objects
      if (!submitData.dateDebut) {
        delete submitData.dateDebut;
      }
      if (!submitData.dateFin) {
        delete submitData.dateFin;
      }
      
      const url = editingCompte 
        ? `/api/admin/compte-a-rebours/${editingCompte.id}`
        : '/api/admin/compte-a-rebours';
      
      const method = editingCompte ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        await fetchComptesARebours();
        setIsDialogOpen(false);
        resetForm();
      } else {
        // Handle error response
        const errorData = await response.json();
        console.error('Erreur de soumission:', errorData);
        alert(`Erreur: ${errorData.error || 'Une erreur est survenue lors de la sauvegarde'}`);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur de connexion au serveur. Veuillez réessayer.');
    }
  };

  const handleEdit = (compte: CompteARebours) => {
    setEditingCompte(compte);
    setFormData({
      titre: compte.titre,
      description: compte.description || "",
      lieu: compte.lieu || "",
      ville: compte.ville || "",
      dateCible: new Date(compte.dateCible).toISOString().slice(0, 16),
      dateDebut: compte.dateDebut ? new Date(compte.dateDebut).toISOString().slice(0, 16) : "",
      dateFin: compte.dateFin ? new Date(compte.dateFin).toISOString().slice(0, 16) : "",
      actif: compte.actif
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const shouldDelete = await confirm({
      title: "Supprimer le compte à rebours",
      description: "Êtes-vous sûr de vouloir supprimer ce compte à rebours ? Cette action est irréversible.",
      confirmText: "Supprimer",
      cancelText: "Annuler",
      variant: "destructive",
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/admin/compte-a-rebours/${id}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            await fetchComptesARebours();
          }
        } catch (error) {
          console.error('Erreur lors de la suppression:', error);
        }
      }
    });
  };

  const handleToggleActif = async (id: string, currentActif: boolean) => {
    try {
      const response = await fetch(`/api/admin/compte-a-rebours/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ actif: !currentActif }),
      });

      if (response.ok) {
        await fetchComptesARebours();
      }
    } catch (error) {
      console.error('Erreur lors de la modification du statut:', error);
    }
  };

  const resetForm = () => {
    setEditingCompte(null);
    setFormData({
      titre: "",
      description: "",
      lieu: "",
      ville: "",
      dateCible: "",
      dateDebut: "",
      dateFin: "",
      actif: true
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
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Comptes à Rebours</h1>
            <p className="text-gray-600">Configurez les comptes à rebours pour les événements importants</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Compte à Rebours
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingCompte ? 'Modifier le Compte à Rebours' : 'Nouveau Compte à Rebours'}
                  </DialogTitle>
                  <DialogDescription>
                    Configurez un compte à rebours pour un événement important
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="titre">Titre *</Label>
                    <Input
                      id="titre"
                      value={formData.titre}
                      onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                      placeholder="Ex: Journée Portes Ouvertes 2025"
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Description de l'événement..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="lieu">Lieu</Label>
                    <Input
                      id="lieu"
                      value={formData.lieu}
                      onChange={(e) => setFormData({ ...formData, lieu: e.target.value })}
                      placeholder="Ex: Lycée Jean Jaurès"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="ville">Ville</Label>
                    <Input
                      id="ville"
                      value={formData.ville}
                      onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                      placeholder="Ex: Paris"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="dateCible">Date Cible *</Label>
                    <Input
                      id="dateCible"
                      type="datetime-local"
                      value={formData.dateCible}
                      onChange={(e) => setFormData({ ...formData, dateCible: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="dateDebut">Date de Début (optionnel)</Label>
                    <Input
                      id="dateDebut"
                      type="datetime-local"
                      value={formData.dateDebut}
                      onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="dateFin">Date de Fin (optionnel)</Label>
                    <Input
                      id="dateFin"
                      type="datetime-local"
                      value={formData.dateFin}
                      onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="actif"
                      checked={formData.actif}
                      onCheckedChange={(checked) => setFormData({ ...formData, actif: checked })}
                    />
                    <Label htmlFor="actif">Actif</Label>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">
                    {editingCompte ? 'Mettre à jour' : 'Créer'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tableau des comptes à rebours */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des Comptes à Rebours</CardTitle>
            <CardDescription>
              Gérez tous les comptes à rebours configurés
            </CardDescription>
          </CardHeader>
          <CardContent>
            {comptesARebours.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun compte à rebours</h3>
                <p className="text-gray-500 mb-4">Créez votre premier compte à rebours</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Lieu</TableHead>
                    <TableHead>Date Cible</TableHead>
                    <TableHead>Date de Début</TableHead>
                    <TableHead>Date de Fin</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Créé le</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comptesARebours.map((compte) => (
                    <TableRow key={compte.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{compte.titre}</div>
                          {compte.description && (
                            <div className="text-sm text-gray-500">{compte.description}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          {compte.lieu && (
                            <div className="font-medium">{compte.lieu}</div>
                          )}
                          {compte.ville && (
                            <div className="text-sm text-gray-500">{compte.ville}</div>
                          )}
                          {!compte.lieu && !compte.ville && (
                            <span className="text-gray-400">Non défini</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          {formatDate(compte.dateCible)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {compte.dateDebut ? (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            {formatDate(compte.dateDebut)}
                          </div>
                        ) : (
                          <span className="text-gray-400">Non définie</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {compte.dateFin ? (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            {formatDate(compte.dateFin)}
                          </div>
                        ) : (
                          <span className="text-gray-400">Non définie</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant={compte.actif ? "default" : "secondary"}>
                            {compte.actif ? "Actif" : "Inactif"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatDate(compte.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleActif(compte.id, compte.actif)}
                          >
                            {compte.actif ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(compte)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(compte.id)}
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
      <ConfirmDialog />
    </Layout>
  );
}