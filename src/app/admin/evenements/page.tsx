"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Label } from "@/components/ui/label";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ConfirmDialog,
  useConfirmDialog,
} from "@/components/ui/confirm-dialog";
import {
  CalendarDays,
  Plus,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  Save,
  X,
  Search,
  Building2,
  Users,
  Clock,
  Power,
  PowerOff,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Evenement {
  id: string;
  nom: string | null;
  date: string;
  dateDebut: string | null;
  dateFin: string | null;
  heureDebut: string;
  heureFin: string;
  ville: string | null;
  actif: boolean;
  lyceeId: string;
  createdAt: string;
  updatedAt: string;
  lycee: {
    id: string;
    nom: string;
    adresse: string;
    type: "PUBLIC" | "PRIVE";
  };
  evenementExposants: Array<{
    id: string;
    evenementId: string;
    exposantId: string;
    exposant: {
      id: string;
      nom: string;
      domaine: string;
    };
  }>;
}

interface Lycee {
  id: string;
  nom: string;
  type: "PUBLIC" | "PRIVE";
}

interface Exposant {
  id: string;
  nom: string;
  domaine: string;
}

interface EvenementFormData {
  nom: string;
  date: string;
  dateDebut: string;
  dateFin: string;
  heureDebut: string;
  heureFin: string;
  ville: string;
  lyceeId: string;
  exposantIds: string[];
}

export default function AdminEvenementsPage() {
  const { confirm, ConfirmDialog } = useConfirmDialog();
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [lycees, setLycees] = useState<Lycee[]>([]);
  const [exposants, setExposants] = useState<Exposant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvenement, setEditingEvenement] = useState<Evenement | null>(
    null
  );
  const [formData, setFormData] = useState<EvenementFormData>({
    nom: "",
    date: "",
    dateDebut: "",
    dateFin: "",
    heureDebut: "",
    heureFin: "",
    ville: "",
    lyceeId: "",
    exposantIds: [],
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

    fetchEvenements();
  }, [router]);

  const fetchEvenements = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/evenements", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEvenements(data.data);
        setLycees(data.lycees);
        setExposants(data.exposants);
      } else {
        toast({
          title: "Erreur",
          description: "Erreur lors du chargement des événements",
          variant: "destructive",
        });
      }
    } catch (error) {
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
      const url = editingEvenement
        ? `/api/admin/evenements/${editingEvenement.id}`
        : "/api/admin/evenements";

      const method = editingEvenement ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Succès",
          description: editingEvenement
            ? "Événement mis à jour avec succès"
            : "Événement créé avec succès",
          variant: "default",
        });
        fetchEvenements();
        resetForm();
        setIsDialogOpen(false);
      } else {
        toast({
          title: "Erreur",
          description: data.error || "Une erreur s'est produite",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur de connexion au serveur",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (evenement: Evenement) => {
    setEditingEvenement(evenement);
    setFormData({
      nom: evenement.nom || "",
      date: evenement.date,
      dateDebut: evenement.dateDebut || "",
      dateFin: evenement.dateFin || "",
      heureDebut: evenement.heureDebut,
      heureFin: evenement.heureFin,
      ville: evenement.ville || "",
      lyceeId: evenement.lyceeId,
      exposantIds: evenement.evenementExposants.map((ee) => ee.exposantId),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const shouldDelete = await confirm({
      title: "Supprimer l'événement",
      description:
        "Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.",
      confirmText: "Supprimer",
      cancelText: "Annuler",
      variant: "destructive",
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("adminToken");
          const response = await fetch(`/api/admin/evenements/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            toast({
              title: "Succès",
              description: "Événement supprimé avec succès",
              variant: "default",
            });
            fetchEvenements();
          } else {
            const data = await response.json();
            toast({
              title: "Erreur",
              description: data.error || "Erreur lors de la suppression",
              variant: "destructive",
            });
          }
        } catch (error) {
          toast({
            title: "Erreur",
            description: "Erreur de connexion au serveur",
            variant: "destructive",
          });
        }
      },
    });
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const action = currentStatus ? "désactiver" : "activer";
    const shouldToggle = await confirm({
      title: `${currentStatus ? "Désactiver" : "Activer"} l'événement`,
      description: `Êtes-vous sûr de vouloir ${action} cet événement ?`,
      confirmText: currentStatus ? "Désactiver" : "Activer",
      cancelText: "Annuler",
      variant: currentStatus ? "destructive" : "default",
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("adminToken");
          const response = await fetch(`/api/admin/evenements/${id}/toggle`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ actif: !currentStatus }),
          });

          if (response.ok) {
            toast({
              title: "Succès",
              description: `Événement ${
                !currentStatus ? "activé" : "désactivé"
              } avec succès`,
              variant: "default",
            });
            fetchEvenements();
          } else {
            const data = await response.json();
            toast({
              title: "Erreur",
              description: data.error || "Erreur lors de la modification",
              variant: "destructive",
            });
          }
        } catch (error) {
          toast({
            title: "Erreur",
            description: "Erreur de connexion au serveur",
            variant: "destructive",
          });
        }
      },
    });
  };

  const handleExposantToggle = (exposantId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      exposantIds: checked
        ? [...prev.exposantIds, exposantId]
        : prev.exposantIds.filter((id) => id !== exposantId),
    }));
  };

  const resetForm = () => {
    setEditingEvenement(null);
    setFormData({
      nom: "",
      date: "",
      dateDebut: "",
      dateFin: "",
      heureDebut: "",
      heureFin: "",
      ville: "",
      lyceeId: "",
      exposantIds: [],
    });
  };

  const filteredEvenements = evenements.filter(
    (evenement) =>
      evenement.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evenement.lycee.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evenement.date.includes(searchTerm)
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    // Si la valeur est vide, nulle ou indéfinie, retourner une valeur par défaut
    if (!timeString || timeString.trim() === "") {
      return "--:--";
    }

    // Si le format est déjà HH:MM (comme "08:30", "14:25"), le retourner directement
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (timeRegex.test(timeString)) {
      return timeString;
    }

    // Pour les autres cas, essayer de parser comme Date
    try {
      const date = new Date(timeString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    } catch (error) {
      // Ignorer les erreurs de parsing
    }

    // Si tout échoue, retourner la chaîne originale ou une valeur par défaut
    return timeString.includes("Invalid") ? "--:--" : timeString;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des événements...</p>
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/admin")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                Gestion des Événements
              </h1>
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un événement
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
                placeholder="Rechercher un événement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tableau des événements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Liste des événements ({filteredEvenements.length})
            </CardTitle>
            <CardDescription>
              Gérez les sessions de l'événement avec leurs lycées et exposants
              associés
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredEvenements.length === 0 ? (
              <div className="text-center py-12">
                <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun événement trouvé
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm
                    ? "Aucun événement ne correspond à votre recherche."
                    : "Commencez par ajouter un événement."}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter le premier événement
                  </Button>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Horaires</TableHead>
                    <TableHead>Lycée hôte</TableHead>
                    <TableHead>Ville</TableHead>
                    <TableHead>Exposants</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvenements.map((evenement) => (
                    <TableRow key={evenement.id}>
                      <TableCell className="font-medium">
                        {evenement.nom || (
                          <span className="text-gray-400 italic">Sans nom</span>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatDate(evenement.date)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-gray-500" />
                          <span className="text-sm">
                            {formatTime(evenement.heureDebut)} -{" "}
                            {formatTime(evenement.heureFin)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gray-500" />
                          <div>
                            <div className="font-medium">
                              {evenement.lycee.nom}
                            </div>
                            <div className="text-xs text-gray-500">
                              {evenement.lycee.adresse}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {evenement.ville || (
                          <span className="text-gray-400 italic">
                            Non spécifiée
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {evenement.evenementExposants
                            .slice(0, 2)
                            .map((ee) => (
                              <Badge
                                key={ee.id}
                                variant="outline"
                                className="text-xs mr-1"
                              >
                                {ee.exposant.domaine}
                              </Badge>
                            ))}
                          {evenement.evenementExposants.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{evenement.evenementExposants.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            evenement.lycee.type === "PUBLIC"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {evenement.lycee.type === "PUBLIC"
                            ? "Public"
                            : "Privé"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={evenement.actif ? "default" : "secondary"}
                          className="flex items-center gap-1 w-fit"
                        >
                          {evenement.actif ? (
                            <>
                              <Power className="h-3 w-3" />
                              Actif
                            </>
                          ) : (
                            <>
                              <PowerOff className="h-3 w-3" />
                              Inactif
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant={evenement.actif ? "outline" : "default"}
                            size="sm"
                            onClick={() =>
                              handleToggleActive(evenement.id, evenement.actif)
                            }
                            className={
                              evenement.actif
                                ? ""
                                : "bg-green-600 hover:bg-green-700"
                            }
                          >
                            {evenement.actif ? (
                              <PowerOff className="h-3 w-3" />
                            ) : (
                              <Power className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(evenement)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(evenement.id)}
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

      {/* Dialog pour ajouter/modifier un événement */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEvenement
                ? "Modifier un événement"
                : "Ajouter un événement"}
            </DialogTitle>
            <DialogDescription>
              {editingEvenement
                ? "Modifiez les informations de l'événement ci-dessous"
                : "Remplissez les informations pour ajouter un nouvel événement"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom de l'événement *</Label>
              <Input
                id="nom"
                type="text"
                placeholder="Ex: Journée Portes Ouvertes, Salon de l'Étudiant..."
                value={formData.nom}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, nom: e.target.value }))
                }
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date principale *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, date: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateDebut">Date de début (optionnel)</Label>
                <Input
                  id="dateDebut"
                  type="date"
                  value={formData.dateDebut}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dateDebut: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateFin">Date de fin (optionnel)</Label>
                <Input
                  id="dateFin"
                  type="date"
                  value={formData.dateFin}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dateFin: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="heureDebut">Heure de début *</Label>
                <Input
                  id="heureDebut"
                  type="time"
                  value={formData.heureDebut}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      heureDebut: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="heureFin">Heure de fin *</Label>
                <Input
                  id="heureFin"
                  type="time"
                  value={formData.heureFin}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      heureFin: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lycee">Lycée hôte *</Label>
              <Select
                value={formData.lyceeId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, lyceeId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le lycée hôte" />
                </SelectTrigger>
                <SelectContent>
                  {lycees.map((lycee) => (
                    <SelectItem key={lycee.id} value={lycee.id}>
                      {lycee.nom} ({lycee.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ville">Ville</Label>
              <Input
                id="ville"
                type="text"
                placeholder="Ex: Paris, Lyon, Marseille..."
                value={formData.ville}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, ville: e.target.value }))
                }
              />
            </div>

            <div className="space-y-4">
              <Label>Exposants participants</Label>
              <div className="grid md:grid-cols-2 gap-3 max-h-60 overflow-y-auto border rounded-lg p-4">
                {exposants.map((exposant) => (
                  <div
                    key={exposant.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`exposant-${exposant.id}`}
                      checked={formData.exposantIds.includes(exposant.id)}
                      onCheckedChange={(checked) =>
                        handleExposantToggle(exposant.id, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`exposant-${exposant.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      <div>{exposant.nom}</div>
                      <div className="text-xs text-gray-500">
                        {exposant.domaine}
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                {formData.exposantIds.length} exposant
                {formData.exposantIds.length > 1 ? "s" : ""} sélectionné
                {formData.exposantIds.length > 1 ? "s" : ""}
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {editingEvenement ? "Mise à jour..." : "Création..."}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {editingEvenement ? "Mettre à jour" : "Créer"}
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
      <ConfirmDialog />
    </div>
  );
}
