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
import { Textarea } from "@/components/ui/textarea";
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
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  Save,
  X,
  Search,
  ExternalLink,
  Globe,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  ConfirmDialog,
  useConfirmDialog,
} from "@/components/ui/confirm-dialog";

interface Exposant {
  id: string;
  nom: string;
  description: string;
  domaine: string;
  logo?: string;
  siteWeb?: string;
  statutConfirmation: "CONFIRME" | "EN_ATTENTE";
  actif?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ExposantFormData {
  nom: string;
  description: string;
  domaine: string;
  logo: string;
  siteWeb: string;
  statutConfirmation: "CONFIRME" | "EN_ATTENTE" | "";
  actif?: boolean;
}

export default function AdminExposantsPage() {
  const { confirm, ConfirmDialog } = useConfirmDialog();
  const [exposants, setExposants] = useState<Exposant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [domaineFilter, setDomaineFilter] = useState<string>("TOUS");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExposant, setEditingExposant] = useState<Exposant | null>(null);
  const [formData, setFormData] = useState<ExposantFormData>({
    nom: "",
    description: "",
    domaine: "",
    logo: "",
    siteWeb: "",
    statutConfirmation: "",
    actif: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Vérifier l'authentification
    const token = localStorage.getItem("adminToken");
    console.log("Initial token check:", token ? "Found" : "Not found");

    if (!token) {
      console.log("No token found, but continuing with test token");
      // Don't redirect for now, let's test with a fallback token
    }

    fetchExposants();
  }, [router]);

  const fetchExposants = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      console.log("Token from localStorage:", token ? "Found" : "Not found");

      const response = await fetch("/api/admin/exposants", {
        headers: {
          Authorization: `Bearer ${token || "test-token"}`,
        },
      });

      console.log("API Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("API Response data:", data);
        setExposants(data.data);
      } else {
        console.error("API Error:", response.status, response.statusText);
        const errorData = await response.json();
        console.error("API Error data:", errorData);
        toast({
          title: "Erreur",
          description: "Erreur lors du chargement des exposants",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
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
      const url = editingExposant
        ? `/api/admin/exposants/${editingExposant.id}`
        : "/api/admin/exposants";

      const method = editingExposant ? "PUT" : "POST";

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
          description: editingExposant
            ? "Exposant mis à jour avec succès"
            : "Exposant créé avec succès",
          variant: "default",
        });
        fetchExposants();
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

  const handleEdit = (exposant: Exposant) => {
    setEditingExposant(exposant);
    setFormData({
      nom: exposant.nom,
      description: exposant.description,
      domaine: exposant.domaine,
      logo: exposant.logo || "",
      siteWeb: exposant.siteWeb || "",
      statutConfirmation: exposant.statutConfirmation,
      actif: exposant.actif ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const shouldDelete = await confirm({
      title: "Supprimer l'exposant",
      description:
        "Êtes-vous sûr de vouloir supprimer cet exposant ? Cette action est irréversible.",
      confirmText: "Supprimer",
      cancelText: "Annuler",
      variant: "destructive",
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("adminToken");
          const response = await fetch(`/api/admin/exposants/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            toast({
              title: "Succès",
              description: "Exposant supprimé avec succès",
              variant: "default",
            });
            fetchExposants();
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

  const resetForm = () => {
    setEditingExposant(null);
    setFormData({
      nom: "",
      description: "",
      domaine: "",
      logo: "",
      siteWeb: "",
      statutConfirmation: "",
    });
  };

  const getUniqueDomaines = () => {
    const domaines = exposants.map((exposant) => exposant.domaine);
    return [...new Set(domaines)];
  };

  const filteredExposants = exposants.filter((exposant) => {
    const matchesSearch =
      exposant.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exposant.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exposant.domaine.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDomaine =
      domaineFilter === "TOUS" || exposant.domaine === domaineFilter;

    return matchesSearch && matchesDomaine;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des exposants...</p>
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
                Gestion des Exposants
              </h1>
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un exposant
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtres */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher un exposant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={domaineFilter} onValueChange={setDomaineFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Domaine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TOUS">Tous les domaines</SelectItem>
                  {getUniqueDomaines().map((domaine) => (
                    <SelectItem key={domaine} value={domaine}>
                      {domaine}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tableau des exposants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Liste des exposants ({filteredExposants.length})
            </CardTitle>
            <CardDescription>
              Gérez les exposants participants à l'événement
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredExposants.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun exposant trouvé
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || domaineFilter !== "TOUS"
                    ? "Aucun exposant ne correspond à vos critères de recherche."
                    : "Commencez par ajouter un exposant."}
                </p>
                {!searchTerm && domaineFilter === "TOUS" && (
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter le premier exposant
                  </Button>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Domaine</TableHead>
                    <TableHead>Site web</TableHead>
                    <TableHead>Statut confirmation</TableHead>
                    <TableHead>Actif</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Créé le</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExposants.map((exposant) => (
                    <TableRow key={exposant.id}>
                      <TableCell className="font-medium">
                        {exposant.nom}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{exposant.domaine}</Badge>
                      </TableCell>
                      <TableCell>
                        {exposant.siteWeb ? (
                          <a
                            href={exposant.siteWeb}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                          >
                            <Globe className="h-3 w-3" />
                            <span className="text-sm">Visiter</span>
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            exposant.statutConfirmation === "CONFIRME"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {exposant.statutConfirmation === "CONFIRME"
                            ? "Confirmé"
                            : "En attente"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={exposant.actif ?? true}
                          onChange={async (e) => {
                            const next = e.target.checked;
                            try {
                              const token = localStorage.getItem("adminToken");
                              const res = await fetch(
                                `/api/admin/exposants/${exposant.id}`,
                                {
                                  method: "PUT",
                                  headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${token}`,
                                  },
                                  body: JSON.stringify({
                                    nom: exposant.nom,
                                    description: exposant.description,
                                    domaine: exposant.domaine,
                                    logo: exposant.logo || "",
                                    siteWeb: exposant.siteWeb || "",
                                    statutConfirmation:
                                      exposant.statutConfirmation,
                                    actif: next,
                                  }),
                                }
                              );
                              if (res.ok) {
                                setExposants((prev) =>
                                  prev.map((x) =>
                                    x.id === exposant.id
                                      ? { ...x, actif: next }
                                      : x
                                  )
                                );
                              }
                            } catch {}
                          }}
                        />
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {exposant.description}
                      </TableCell>
                      <TableCell>
                        {new Date(exposant.createdAt).toLocaleDateString(
                          "fr-FR"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(exposant)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(exposant.id)}
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

      {/* Dialog pour ajouter/modifier un exposant */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingExposant ? "Modifier un exposant" : "Ajouter un exposant"}
            </DialogTitle>
            <DialogDescription>
              {editingExposant
                ? "Modifiez les informations de l'exposant ci-dessous"
                : "Remplissez les informations pour ajouter un nouvel exposant"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, nom: e.target.value }))
                  }
                  placeholder="Nom de l'établissement"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="domaine">Domaine *</Label>
                <Input
                  id="domaine"
                  value={formData.domaine}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      domaine: e.target.value,
                    }))
                  }
                  placeholder="Ex: Ingénierie, Commerce, Art..."
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Description de l'établissement et des formations proposées"
                rows={4}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="siteWeb">Site web</Label>
                <Input
                  id="siteWeb"
                  type="url"
                  value={formData.siteWeb}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      siteWeb: e.target.value,
                    }))
                  }
                  placeholder="https://exemple.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="statutConfirmation">
                  Statut de confirmation *
                </Label>
                <Select
                  value={formData.statutConfirmation}
                  onValueChange={(value: "CONFIRME" | "EN_ATTENTE") =>
                    setFormData((prev) => ({
                      ...prev,
                      statutConfirmation: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CONFIRME">Confirmé</SelectItem>
                    <SelectItem value="EN_ATTENTE">En attente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">URL du logo</Label>
              <Input
                id="logo"
                type="url"
                value={formData.logo}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, logo: e.target.value }))
                }
                placeholder="URL du logo (facultatif)"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {editingExposant ? "Mise à jour..." : "Création..."}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {editingExposant ? "Mettre à jour" : "Créer"}
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
