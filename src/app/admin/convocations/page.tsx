"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Search, 
  Filter, 
  RefreshCw, 
  Mail,
  CalendarDays,
  MapPin,
  Building,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Users,
  ArrowLeft,
  ChevronRight,
  Eye
} from "lucide-react";
import Layout from "@/components/layout/Layout";

interface Convocation {
  id: string;
  sujet: string;
  message: string;
  dateEnvoi: string;
  statutEnvoi: 'EN_ATTENTE' | 'ENVOYE' | 'EN_ERREUR' | 'ANNULE';
  dateEnvoiReel?: string;
  erreurEnvoi?: string;
  evenement: {
    id: string;
    nom: string;
    date: string;
    ville?: string;
    lycee: {
      nom: string;
    };
  };
  destinataires: Array<{
    id: string;
    statut: 'EN_ATTENTE' | 'ENVOYE' | 'OUVERT' | 'REPONDU' | 'ERREUR';
    contact: {
      id: string;
      nom: string;
      prenom: string;
      email: string;
    };
  }>;
}

interface ConvocationsResponse {
  success: boolean;
  data: Convocation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: {
    search: string;
    statut: string;
  };
}

const statutEnvoiLabels: Record<Convocation['statutEnvoi'], string> = {
  EN_ATTENTE: 'En attente',
  ENVOYE: 'Envoyé',
  EN_ERREUR: 'En erreur',
  ANNULE: 'Annulé'
};

const statutEnvoiColors: Record<Convocation['statutEnvoi'], string> = {
  EN_ATTENTE: 'bg-yellow-100 text-yellow-800',
  ENVOYE: 'bg-green-100 text-green-800',
  EN_ERREUR: 'bg-red-100 text-red-800',
  ANNULE: 'bg-gray-100 text-gray-800'
};

const statutDestinataireLabels: Record<Convocation['destinataires'][0]['statut'], string> = {
  EN_ATTENTE: 'En attente',
  ENVOYE: 'Envoyé',
  OUVERT: 'Ouvert',
  REPONDU: 'Répondu',
  ERREUR: 'En erreur'
};

const statutDestinataireColors: Record<Convocation['destinataires'][0]['statut'], string> = {
  EN_ATTENTE: 'bg-yellow-100 text-yellow-800',
  ENVOYE: 'bg-blue-100 text-blue-800',
  OUVERT: 'bg-green-100 text-green-800',
  REPONDU: 'bg-purple-100 text-purple-800',
  ERREUR: 'bg-red-100 text-red-800'
};

export default function ConvocationsPage() {
  const [convocations, setConvocations] = useState<Convocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatut, setSelectedStatut] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalConvocations, setTotalConvocations] = useState(0);
  const [selectedConvocation, setSelectedConvocation] = useState<Convocation | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  const router = useRouter();
  const limit = 20;

  useEffect(() => {
    fetchConvocations();
  }, [currentPage, selectedStatut]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchConvocations();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const fetchConvocations = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      if (selectedStatut && selectedStatut !== 'ALL') {
        params.append('statut', selectedStatut);
      }

      const response = await fetch(`/api/admin/convocations?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data: ConvocationsResponse = await response.json();
        setConvocations(data.data);
        setTotalPages(data.pagination.pages);
        setTotalConvocations(data.pagination.total);
        setError(null);
      } else {
        setError("Erreur lors du chargement des convocations");
        setConvocations([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des convocations:", error);
      setError("Erreur de connexion au serveur");
      setConvocations([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshConvocations = async () => {
    setRefreshing(true);
    await fetchConvocations();
    setRefreshing(false);
  };

  const handleConvocationClick = (convocation: Convocation) => {
    setSelectedConvocation(convocation);
    setShowDetailModal(true);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatut('ALL');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm || (selectedStatut && selectedStatut !== 'ALL');

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'à l\'instant';
    if (diffMinutes < 60) return `il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
    if (diffHours < 24) return `il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    
    return date.toLocaleDateString('fr-FR');
  };

  const getStatutIcon = (statut: Convocation['statutEnvoi']) => {
    switch (statut) {
      case 'ENVOYE':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'EN_ERREUR':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'EN_ATTENTE':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'ANNULE':
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <Mail className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <Layout isAdmin>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push('/admin')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Historique des Convocations</h1>
              <p className="text-gray-600 mt-1">
                Suivez l'historique des convocations envoyées aux exposants
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshConvocations}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Actualisation...' : 'Actualiser'}
            </Button>
            <Button size="sm" onClick={() => router.push('/admin/contacts-exposants')}>
              <Users className="h-4 w-4 mr-2" />
              Gérer les contacts
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total des convocations</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalConvocations}</div>
              <p className="text-xs text-muted-foreground">
                Convocations envoyées
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Envoyées</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {convocations.filter(c => c.statutEnvoi === 'ENVOYE').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Envoyées avec succès
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En attente</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {convocations.filter(c => c.statutEnvoi === 'EN_ATTENTE').length}
              </div>
              <p className="text-xs text-muted-foreground">
                En attente d'envoi
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En erreur</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {convocations.filter(c => c.statutEnvoi === 'EN_ERREUR').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Échecs d'envoi
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedStatut} onValueChange={setSelectedStatut}>
                <SelectTrigger>
                  <SelectValue placeholder="Statut d'envoi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tous les statuts</SelectItem>
                  <SelectItem value="EN_ATTENTE">En attente</SelectItem>
                  <SelectItem value="ENVOYE">Envoyé</SelectItem>
                  <SelectItem value="EN_ERREUR">En erreur</SelectItem>
                  <SelectItem value="ANNULE">Annulé</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  Effacer les filtres
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Convocations List */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des convocations</CardTitle>
            <CardDescription>
              {totalConvocations} convocation{totalConvocations > 1 ? 's' : ''} trouvée{totalConvocations > 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : convocations.length === 0 ? (
              <div className="text-center py-8">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucune convocation trouvée</p>
              </div>
            ) : (
              <div className="space-y-4">
                {convocations.map((convocation) => (
                  <div
                    key={convocation.id}
                    className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleConvocationClick(convocation)}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getStatutIcon(convocation.statutEnvoi)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900 truncate">
                          {convocation.sujet}
                        </h3>
                        <Badge variant="outline" className={statutEnvoiColors[convocation.statutEnvoi]}>
                          {statutEnvoiLabels[convocation.statutEnvoi]}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4" />
                          <span>{new Date(convocation.evenement.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{convocation.evenement.lycee.nom}</span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-500 mb-2">
                        Événement: {convocation.evenement.nom}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-4">
                          <span>{convocation.destinataires.length} destinataire{convocation.destinataires.length > 1 ? 's' : ''}</span>
                          <span>
                            {convocation.dateEnvoiReel 
                              ? `Envoyée ${formatRelativeTime(convocation.dateEnvoiReel)}`
                              : `Créée ${formatRelativeTime(convocation.dateEnvoi)}`
                            }
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      
                      {convocation.erreurEnvoi && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                          <strong>Erreur:</strong> {convocation.erreurEnvoi}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <div className="text-sm text-gray-700">
                  Affichage de {(currentPage - 1) * limit + 1} à {Math.min(currentPage * limit, totalConvocations)} sur {totalConvocations} convocations
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                  >
                    Précédent
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Convocation Detail Modal */}
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Détails de la convocation</DialogTitle>
              <DialogDescription>
                Informations complètes sur cette convocation
              </DialogDescription>
            </DialogHeader>
            
            {selectedConvocation && (
              <div className="space-y-6">
                {/* En-tête */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Sujet</label>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{selectedConvocation.sujet}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Statut</label>
                    <div className="mt-1">
                      <Badge className={statutEnvoiColors[selectedConvocation.statutEnvoi]}>
                        {getStatutIcon(selectedConvocation.statutEnvoi)}
                        <span className="ml-2">{statutEnvoiLabels[selectedConvocation.statutEnvoi]}</span>
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Événement */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Événement</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900">{selectedConvocation.evenement.nom}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        <span>{new Date(selectedConvocation.evenement.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{selectedConvocation.evenement.lycee.nom}</span>
                      </div>
                      {selectedConvocation.evenement.ville && (
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          <span>{selectedConvocation.evenement.ville}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Message</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedConvocation.message}</p>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Date de création</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedConvocation.dateEnvoi).toLocaleString('fr-FR')}
                    </p>
                  </div>
                  
                  {selectedConvocation.dateEnvoiReel && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Date d'envoi</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(selectedConvocation.dateEnvoiReel).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  )}
                </div>

                {/* Erreur */}
                {selectedConvocation.erreurEnvoi && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Erreur d'envoi</label>
                    <div className="mt-1 p-3 bg-red-50 border border-red-200 rounded">
                      <p className="text-sm text-red-700">{selectedConvocation.erreurEnvoi}</p>
                    </div>
                  </div>
                )}

                {/* Destinataires */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Destinataires ({selectedConvocation.destinataires.length})
                  </label>
                  <div className="mt-1 space-y-2 max-h-60 overflow-y-auto">
                    {selectedConvocation.destinataires.map((destinataire) => (
                      <div key={destinataire.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {destinataire.contact.prenom} {destinataire.contact.nom}
                            </p>
                            <p className="text-xs text-gray-500">{destinataire.contact.email}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={statutDestinataireColors[destinataire.statut]}>
                          {statutDestinataireLabels[destinataire.statut]}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}