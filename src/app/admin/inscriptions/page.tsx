"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Users, 
  Search, 
  ArrowLeft,
  CalendarDays,
  Mail,
  Phone,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  Filter,
  Trash2,
  Square,
  CheckSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';

interface Inscription {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  typeParticipant: string;
  etablissement?: string;
  niveau?: string;
  branche?: string;
  statut: "EN_ATTENTE" | "CONFIRMEE" | "ANNULEE";
  createdAt: string;
  evenement: {
    id: string;
    nom?: string;
    date: string;
    heureDebut: string;
    heureFin: string;
    lycee: {
      nom: string;
    };
  };
}

export default function AdminInscriptionsPage() {
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [inscriptionToDelete, setInscriptionToDelete] = useState<Inscription | null>(null);
  const [selectedInscriptions, setSelectedInscriptions] = useState<Set<string>>(new Set());
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Vérifier l'authentification
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    fetchInscriptions();
  }, [router]);

  const fetchInscriptions = async () => {
    try {
      console.log('🔄 Récupération des inscriptions depuis l\'API...');
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/inscriptions", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${data.data.length} inscriptions récupérées depuis l'API`);
        setInscriptions(data.data);
      } else {
        console.error('❌ Erreur lors de la récupération des inscriptions:', response.status);
        toast({
          title: "Erreur",
          description: "Erreur lors du chargement des inscriptions",
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

  const filteredInscriptions = inscriptions.filter(inscription => {
    const matchesSearch = 
      inscription.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inscription.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inscription.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inscription.evenement.lycee.nom.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || inscription.statut === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const deleteInscription = async (id: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/inscriptions/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Inscription supprimée avec succès",
          variant: "default",
        });
        fetchInscriptions();
      } else {
        toast({
          title: "Erreur",
          description: "Erreur lors de la suppression de l'inscription",
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
  };

  const confirmDelete = (inscription: Inscription) => {
    setInscriptionToDelete(inscription);
  };

  const handleDelete = async () => {
    if (inscriptionToDelete) {
      await deleteInscription(inscriptionToDelete.id);
      setInscriptionToDelete(null);
    }
  };

  // Fonctions pour la sélection multiple
  const toggleSelectInscription = (id: string) => {
    const newSelected = new Set(selectedInscriptions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedInscriptions(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedInscriptions.size === filteredInscriptions.length) {
      setSelectedInscriptions(new Set());
    } else {
      const allIds = filteredInscriptions.map(i => i.id);
      setSelectedInscriptions(new Set(allIds));
    }
  };

  const deleteSelectedInscriptions = async () => {
    if (selectedInscriptions.size === 0) {
      toast({
        title: "Aucune sélection",
        description: "Veuillez sélectionner au moins une inscription à supprimer",
        variant: "destructive",
      });
      return;
    }

    setShowBulkDeleteDialog(true);
  };

  const confirmBulkDelete = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const deletePromises = Array.from(selectedInscriptions).map(id =>
        fetch(`/api/admin/inscriptions/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
      );

      const responses = await Promise.all(deletePromises);
      const allSuccessful = responses.every(response => response.ok);

      if (allSuccessful) {
        toast({
          title: "Succès",
          description: `${selectedInscriptions.size} inscription(s) supprimée(s) avec succès`,
          variant: "default",
        });
        setSelectedInscriptions(new Set());
        fetchInscriptions();
      } else {
        toast({
          title: "Erreur",
          description: "Certaines inscriptions n'ont pas pu être supprimées",
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
      setShowBulkDeleteDialog(false);
    }
  };

  const updateInscriptionStatus = async (id: string, statut: "EN_ATTENTE" | "CONFIRMEE" | "ANNULEE") => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/inscriptions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ statut })
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: `Statut de l'inscription mis à jour`,
          variant: "default",
        });
        fetchInscriptions();
      } else {
        toast({
          title: "Erreur",
          description: "Erreur lors de la mise à jour du statut",
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
  };

  const exportInscriptions = () => {
    // Préparer les données pour l'export
    const headers = ["Nom", "Prénom", "Email", "Téléphone", "Niveau d'études", "Filière", "Établissement actuel"];
    const data = filteredInscriptions.map(inscription => [
      inscription.nom,
      inscription.prenom,
      inscription.email,
      inscription.telephone,
      inscription.niveau || "",
      inscription.branche || "",
      inscription.etablissement || ""
    ]);

    // Créer un nouveau classeur
    const wb = XLSX.utils.book_new();
    
    // Créer la feuille de calcul avec les en-têtes et les données
    const wsData = [headers, ...data];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Définir la largeur des colonnes pour une meilleure présentation
    ws['!cols'] = [
      { wch: 20 },  // Nom
      { wch: 20 },  // Prénom
      { wch: 30 },  // Email
      { wch: 15 },  // Téléphone
      { wch: 15 },  // Niveau d'études
      { wch: 15 },  // Filière
      { wch: 25 }   // Établissement actuel
    ];

    // Appliquer des styles aux en-têtes
    const headerRange = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!ws[cellAddress]) ws[cellAddress] = {};
      ws[cellAddress].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4F46E5" } }, // Couleur de fond bleue
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } }
        }
      };
    }

    // Appliquer des styles aux données
    for (let row = 1; row <= data.length; row++) {
      for (let col = 0; col < headers.length; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!ws[cellAddress]) ws[cellAddress] = {};
        ws[cellAddress].s = {
          font: { color: { rgb: "374151" } },
          alignment: { horizontal: "left", vertical: "center", wrapText: true },
          border: {
            top: { style: "thin", color: { rgb: "E5E7EB" } },
            bottom: { style: "thin", color: { rgb: "E5E7EB" } },
            left: { style: "thin", color: { rgb: "E5E7EB" } },
            right: { style: "thin", color: { rgb: "E5E7EB" } }
          }
        };
      }
    }

    // Ajouter la feuille au classeur
    XLSX.utils.book_append_sheet(wb, ws, "Participants");

    // Générer le fichier Excel
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    
    // Créer le Blob et le lien de téléchargement
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `liste_participants_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.xlsx`;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Afficher une notification de succès
    toast({
      title: "Export réussi",
      description: `Le fichier Excel contenant ${filteredInscriptions.length} participants a été généré avec succès`,
      variant: "default",
    });
  };

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "CONFIRMEE":
        return <Badge className="bg-green-100 text-green-800">Confirmée</Badge>;
      case "ANNULEE":
        return <Badge className="bg-red-100 text-red-800">Annulée</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
    }
  };

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case "CONFIRMEE":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "ANNULEE":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des inscriptions...</p>
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
              <h1 className="text-xl font-semibold text-gray-900">Gestion des Inscriptions</h1>
            </div>
            <Button onClick={exportInscriptions} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inscriptions.length}</div>
              <p className="text-xs text-muted-foreground">
                Inscriptions totales
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En attente</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {inscriptions.filter(i => i.statut === "EN_ATTENTE").length}
              </div>
              <p className="text-xs text-muted-foreground">
                À traiter
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmées</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {inscriptions.filter(i => i.statut === "CONFIRMEE").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Validées
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Annulées</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {inscriptions.filter(i => i.statut === "ANNULEE").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Annulées
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher une inscription..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="EN_ATTENTE">En attente</option>
                  <option value="CONFIRMEE">Confirmées</option>
                  <option value="ANNULEE">Annulées</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tableau des inscriptions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Liste des inscriptions ({filteredInscriptions.length})
                  {selectedInscriptions.size > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {selectedInscriptions.size} sélectionnée(s)
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Gérez les inscriptions aux événements des portes ouvertes
                </CardDescription>
              </div>
              {selectedInscriptions.size > 0 && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => setSelectedInscriptions(new Set())}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    Effacer la sélection
                  </Button>
                  <Button
                    onClick={deleteSelectedInscriptions}
                    variant="destructive"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Supprimer ({selectedInscriptions.size})
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {filteredInscriptions.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune inscription trouvée</h3>
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== "all" 
                    ? "Aucune inscription ne correspond à vos critères de recherche." 
                    : "Aucune inscription n'a été enregistrée pour le moment."
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <button
                          onClick={toggleSelectAll}
                          className="flex items-center justify-center w-full h-full"
                          title={selectedInscriptions.size === filteredInscriptions.length ? "Désélectionner tout" : "Sélectionner tout"}
                        >
                          {selectedInscriptions.size === filteredInscriptions.length && filteredInscriptions.length > 0 ? (
                            <CheckSquare className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Square className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </TableHead>
                      <TableHead>Participant</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Événement</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInscriptions.map((inscription) => (
                      <TableRow key={inscription.id} className={selectedInscriptions.has(inscription.id) ? "bg-blue-50" : ""}>
                        <TableCell>
                          <button
                            onClick={() => toggleSelectInscription(inscription.id)}
                            className="flex items-center justify-center w-full h-full"
                            title={`Sélectionner ${inscription.nom} ${inscription.prenom}`}
                          >
                            {selectedInscriptions.has(inscription.id) ? (
                              <CheckSquare className="h-4 w-4 text-blue-600" />
                            ) : (
                              <Square className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {inscription.nom} {inscription.prenom}
                            </div>
                            <div className="text-sm text-gray-500">
                              {inscription.typeParticipant}
                              {inscription.etablissement && ` • ${inscription.etablissement}`}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span>{inscription.email}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <span>{inscription.telephone}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {inscription.evenement.lycee.nom}
                            </div>
                            <div className="text-sm text-gray-500">
                              {inscription.evenement.nom || 'Portes Ouvertes'}
                            </div>
                            <div className="text-xs text-gray-400">
                              {inscription.evenement.heureDebut}-{inscription.evenement.heureFin}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="flex items-center gap-1">
                              <CalendarDays className="h-3 w-3 text-gray-400" />
                              <span>
                                {new Date(inscription.evenement.date).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              Inscrit le {new Date(inscription.createdAt).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(inscription.statut)}
                            {getStatusBadge(inscription.statut)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            {inscription.statut === "EN_ATTENTE" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateInscriptionStatus(inscription.id, "CONFIRMEE")}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <CheckCircle className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateInscriptionStatus(inscription.id, "ANNULEE")}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <XCircle className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                            {inscription.statut === "CONFIRMEE" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateInscriptionStatus(inscription.id, "ANNULEE")}
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="h-3 w-3" />
                              </Button>
                            )}
                            {inscription.statut === "ANNULEE" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateInscriptionStatus(inscription.id, "CONFIRMEE")}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="h-3 w-3" />
                              </Button>
                            )}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => confirmDelete(inscription)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir supprimer l'inscription de <strong>{inscription.nom} {inscription.prenom}</strong> pour l'événement <strong>{inscription.evenement.lycee.nom}</strong> ?<br />
                                    Cette action est irréversible et supprimera définitivement toutes les données associées à cette inscription.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={handleDelete}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AlertDialog pour la suppression multiple */}
      <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression multiple</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer <strong>{selectedInscriptions.size}</strong> inscription(s) ?<br />
              Cette action est irréversible et supprimera définitivement toutes les données associées à ces inscriptions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmBulkDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer ({selectedInscriptions.size})
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}