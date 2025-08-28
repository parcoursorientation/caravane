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
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Mail,
  User,
  Building2,
  CalendarDays,
  BookOpen,
  Users,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowLeft,
  ChevronRight
} from "lucide-react";
import Layout from "@/components/layout/Layout";

interface Activity {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'MESSAGE' | 'INSCRIPTION';
  entityType: 'LYCEE' | 'EXPOSANT' | 'EVENEMENT' | 'PROGRAMME' | 'USER' | 'CONTACT' | 'INSCRIPTION';
  entityId: string;
  entityName: string;
  description: string;
  userEmail?: string;
  createdAt: string;
  metadata?: any;
}

interface ActivitiesResponse {
  success: boolean;
  data: Activity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

const typeLabels: Record<Activity['type'], string> = {
  CREATE: 'Création',
  UPDATE: 'Modification',
  DELETE: 'Suppression',
  LOGIN: 'Connexion',
  MESSAGE: 'Message',
  INSCRIPTION: 'Inscription'
};

const entityTypeLabels: Record<Activity['entityType'], string> = {
  LYCEE: 'Lycée',
  EXPOSANT: 'Exposant',
  EVENEMENT: 'Événement',
  PROGRAMME: 'Programme',
  USER: 'Utilisateur',
  CONTACT: 'Contact',
  INSCRIPTION: 'Inscription'
};

const typeIcons: Record<Activity['type'], React.ComponentType<any>> = {
  CREATE: Plus,
  UPDATE: Edit,
  DELETE: Trash2,
  LOGIN: User,
  MESSAGE: Mail,
  INSCRIPTION: Users
};

const entityTypeIcons: Record<Activity['entityType'], React.ComponentType<any>> = {
  LYCEE: Building2,
  EXPOSANT: Users,
  EVENEMENT: CalendarDays,
  PROGRAMME: BookOpen,
  USER: User,
  CONTACT: Mail,
  INSCRIPTION: Users
};

const typeColors: Record<Activity['type'], string> = {
  CREATE: 'bg-green-100 text-green-800',
  UPDATE: 'bg-blue-100 text-blue-800',
  DELETE: 'bg-red-100 text-red-800',
  LOGIN: 'bg-purple-100 text-purple-800',
  MESSAGE: 'bg-orange-100 text-orange-800',
  INSCRIPTION: 'bg-indigo-100 text-indigo-800'
};

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedEntityType, setSelectedEntityType] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalActivities, setTotalActivities] = useState(0);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  const router = useRouter();
  const limit = 20;

  useEffect(() => {
    fetchActivities();
  }, [currentPage, selectedType, selectedEntityType]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchActivities();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const fetchActivities = async () => {
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

      if (selectedType) {
        params.append('type', selectedType);
      }

      if (selectedEntityType) {
        params.append('entityType', selectedEntityType);
      }

      const response = await fetch(`/api/admin/activities?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data: ActivitiesResponse = await response.json();
        setActivities(data.data);
        setTotalPages(data.pagination.pages);
        setTotalActivities(data.pagination.total);
        setError(null);
      } else {
        setError("Erreur lors du chargement des activités");
        setActivities([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des activités:", error);
      setError("Erreur de connexion au serveur");
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshActivities = async () => {
    setRefreshing(true);
    await fetchActivities();
    setRefreshing(false);
  };

  const handleActivityClick = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowDetailModal(true);
  };

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

  const getTypeIcon = (type: Activity['type']) => {
    const IconComponent = typeIcons[type];
    return <IconComponent className="h-4 w-4" />;
  };

  const getEntityTypeIcon = (entityType: Activity['entityType']) => {
    const IconComponent = entityTypeIcons[entityType];
    return <IconComponent className="h-4 w-4" />;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setSelectedEntityType('');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm || selectedType || selectedEntityType;

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
              <h1 className="text-3xl font-bold text-gray-900">Activité récente</h1>
              <p className="text-gray-600 mt-1">
                Dernières actions effectuées dans le système
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshActivities}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Actualisation...' : 'Actualiser'}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total des activités</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalActivities}</div>
              <p className="text-xs text-muted-foreground">
                Actions enregistrées
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Créations</CardTitle>
              <Plus className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activities.filter(a => a.type === 'CREATE').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Nouveaux éléments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Modifications</CardTitle>
              <Edit className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activities.filter(a => a.type === 'UPDATE').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Éléments mis à jour
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <Mail className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activities.filter(a => a.type === 'MESSAGE').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Contacts reçus
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Type d'action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les types</SelectItem>
                  <SelectItem value="CREATE">Création</SelectItem>
                  <SelectItem value="UPDATE">Modification</SelectItem>
                  <SelectItem value="DELETE">Suppression</SelectItem>
                  <SelectItem value="LOGIN">Connexion</SelectItem>
                  <SelectItem value="MESSAGE">Message</SelectItem>
                  <SelectItem value="INSCRIPTION">Inscription</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedEntityType} onValueChange={setSelectedEntityType}>
                <SelectTrigger>
                  <SelectValue placeholder="Type d'entité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les entités</SelectItem>
                  <SelectItem value="LYCEE">Lycée</SelectItem>
                  <SelectItem value="EXPOSANT">Exposant</SelectItem>
                  <SelectItem value="EVENEMENT">Événement</SelectItem>
                  <SelectItem value="PROGRAMME">Programme</SelectItem>
                  <SelectItem value="USER">Utilisateur</SelectItem>
                  <SelectItem value="CONTACT">Contact</SelectItem>
                  <SelectItem value="INSCRIPTION">Inscription</SelectItem>
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

        {/* Activities List */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des activités</CardTitle>
            <CardDescription>
              {totalActivities} activité{totalActivities > 1 ? 's' : ''} trouvée{totalActivities > 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucune activité trouvée</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => {
                  const TypeIcon = typeIcons[activity.type];
                  const EntityTypeIcon = entityTypeIcons[activity.entityType];
                  
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleActivityClick(activity)}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${typeColors[activity.type]}`}>
                        <TypeIcon className="h-5 w-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900 truncate">
                            {activity.entityName}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            <EntityTypeIcon className="h-3 w-3 mr-1" />
                            {entityTypeLabels[activity.entityType]}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {typeLabels[activity.type]}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          {activity.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-4">
                            {activity.userEmail && (
                              <span>par {activity.userEmail}</span>
                            )}
                            <span>{formatRelativeTime(activity.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <div className="text-sm text-gray-700">
                  Affichage de {(currentPage - 1) * limit + 1} à {Math.min(currentPage * limit, totalActivities)} sur {totalActivities} activités
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

        {/* Activity Detail Modal */}
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Détails de l'activité</DialogTitle>
              <DialogDescription>
                Informations complètes sur cette action
              </DialogDescription>
            </DialogHeader>
            
            {selectedActivity && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Type d'action</label>
                    <div className="mt-1">
                      <Badge className={typeColors[selectedActivity.type]}>
                        {getTypeIcon(selectedActivity.type)}
                        <span className="ml-2">{typeLabels[selectedActivity.type]}</span>
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Type d'entité</label>
                    <div className="mt-1">
                      <Badge variant="outline">
                        {getEntityTypeIcon(selectedActivity.entityType)}
                        <span className="ml-2">{entityTypeLabels[selectedActivity.entityType]}</span>
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Nom de l'entité</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedActivity.entityName}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedActivity.description}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Utilisateur</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedActivity.userEmail || 'Système'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Date et heure</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedActivity.createdAt).toLocaleString('fr-FR')}
                  </p>
                </div>

                {selectedActivity.metadata && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Métadonnées</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md">
                      <pre className="text-xs text-gray-700 overflow-auto">
                        {JSON.stringify(selectedActivity.metadata, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}