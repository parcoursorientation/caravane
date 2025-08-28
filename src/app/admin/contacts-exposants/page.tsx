"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Search, 
  Filter, 
  RefreshCw, 
  Plus, 
  Edit, 
  Trash2, 
  Mail,
  User,
  Phone,
  Building,
  Briefcase,
  CalendarDays,
  MapPin,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Users,
  ArrowLeft,
  ChevronRight
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { ConfirmDialog, useConfirmDialog } from "@/components/ui/confirm-dialog";

interface ContactExposant {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  fonction?: string;
  entreprise?: string;
  exposantId?: string;
  statut: 'ACTIF' | 'INACTIF' | 'EN_ATTENTE';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  exposant?: {
    id: string;
    nom: string;
    domaine: string;
  };
}

interface Evenement {
  id: string;
  nom: string;
  date: string;
  ville?: string;
  lycee: {
    nom: string;
  };
}

interface ContactsResponse {
  success: boolean;
  data: ContactExposant[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  stats: {
    actifs: number;
    inactifs: number;
    enAttente: number;
  };
  filters: {
    search: string;
    statut: string;
    exposantId: string;
  };
}

const statutLabels: Record<ContactExposant['statut'], string> = {
  ACTIF: 'Actif',
  INACTIF: 'Inactif',
  EN_ATTENTE: 'En attente'
};

const statutColors: Record<ContactExposant['statut'], string> = {
  ACTIF: 'bg-green-100 text-green-800',
  INACTIF: 'bg-red-100 text-red-800',
  EN_ATTENTE: 'bg-yellow-100 text-yellow-800'
};

export default function ContactsExposantsPage() {
  const { confirm, ConfirmDialog } = useConfirmDialog();
  const [contacts, setContacts] = useState<ContactExposant[]>([]);
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatut, setSelectedStatut] = useState<string>('ALL');
  const [selectedExposant, setSelectedExposant] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);
  const [stats, setStats] = useState({ actifs: 0, inactifs: 0, enAttente: 0 });
  
  // États pour la création/modification de contact
  const [showContactModal, setShowContactModal] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactExposant | null>(null);
  const [contactForm, setContactForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    fonction: '',
    entreprise: '',
    exposantId: 'NONE',
    statut: 'ACTIF' as ContactExposant['statut'],
    notes: ''
  });
  
  // États pour l'envoi de convocations
  const [showConvocationModal, setShowConvocationModal] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [convocationForm, setConvocationForm] = useState({
    sujet: '',
    message: '',
    evenementId: '',
    envoiImmediat: true
  });
  const [sendingConvocation, setSendingConvocation] = useState(false);
  
  const router = useRouter();
  const limit = 20;

  useEffect(() => {
    fetchContacts();
    fetchEvenements();
  }, [currentPage, selectedStatut, selectedExposant]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchContacts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const fetchContacts = async () => {
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

      if (selectedExposant && selectedExposant !== 'ALL') {
        params.append('exposantId', selectedExposant);
      }

      const response = await fetch(`/api/admin/contacts-exposants?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data: ContactsResponse = await response.json();
        setContacts(data.data);
        setTotalPages(data.pagination.pages);
        setTotalContacts(data.pagination.total);
        setStats(data.stats);
        setError(null);
      } else {
        setError("Erreur lors du chargement des contacts");
        setContacts([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des contacts:", error);
      setError("Erreur de connexion au serveur");
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvenements = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    try {
      const response = await fetch('/api/evenements-public', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEvenements(data.data || []);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des événements:", error);
    }
  };

  const refreshContacts = async () => {
    setRefreshing(true);
    await fetchContacts();
    setRefreshing(false);
  };

  const handleContactSubmit = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    try {
      const url = editingContact 
        ? `/api/admin/contacts-exposants/${editingContact.id}`
        : '/api/admin/contacts-exposants';
      
      const method = editingContact ? 'PUT' : 'POST';
      
      // Convert "NONE" back to empty string for API compatibility
      const formData = {
        ...contactForm,
        exposantId: contactForm.exposantId === 'NONE' ? '' : contactForm.exposantId
      };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchContacts();
        setShowContactModal(false);
        resetContactForm();
      } else {
        const error = await response.json();
        setError(error.error || "Erreur lors de l'enregistrement du contact");
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du contact:", error);
      setError("Erreur de connexion au serveur");
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    const shouldDelete = await confirm({
      title: "Supprimer le contact",
      description: "Êtes-vous sûr de vouloir supprimer ce contact ? Cette action est irréversible.",
      confirmText: "Supprimer",
      cancelText: "Annuler",
      variant: "destructive",
      onConfirm: async () => {
        const token = localStorage.getItem("adminToken");
        if (!token) return;

        try {
          const response = await fetch(`/api/admin/contacts-exposants/${contactId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            await fetchContacts();
          } else {
            setError("Erreur lors de la suppression du contact");
          }
        } catch (error) {
          console.error("Erreur lors de la suppression du contact:", error);
          setError("Erreur de connexion au serveur");
        }
      }
    });
  };

  const handleSendConvocation = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    if (selectedContacts.length === 0) {
      setError("Veuillez sélectionner au moins un contact");
      return;
    }

    setSendingConvocation(true);
    try {
      const response = await fetch('/api/admin/convocations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...convocationForm,
          contactIds: selectedContacts
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        setShowConvocationModal(false);
        resetConvocationForm();
        setSelectedContacts([]);
      } else {
        const error = await response.json();
        setError(error.error || "Erreur lors de l'envoi de la convocation");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de la convocation:", error);
      setError("Erreur de connexion au serveur");
    } finally {
      setSendingConvocation(false);
    }
  };

  const resetContactForm = () => {
    setContactForm({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      fonction: '',
      entreprise: '',
      exposantId: 'NONE',
      statut: 'ACTIF',
      notes: ''
    });
    setEditingContact(null);
  };

  const resetConvocationForm = () => {
    setConvocationForm({
      sujet: '',
      message: '',
      evenementId: '',
      envoiImmediat: true
    });
  };

  const toggleContactSelection = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const selectAllContacts = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map(c => c.id));
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatut('ALL');
    setSelectedExposant('ALL');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm || (selectedStatut && selectedStatut !== 'ALL') || (selectedExposant && selectedExposant !== 'ALL');

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
              <h1 className="text-3xl font-bold text-gray-900">Contacts Exposants</h1>
              <p className="text-gray-600 mt-1">
                Gérez les contacts des exposants et envoyez des convocations
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshContacts}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Actualisation...' : 'Actualiser'}
            </Button>
            
            {selectedContacts.length > 0 && (
              <Button 
                size="sm" 
                onClick={() => setShowConvocationModal(true)}
              >
                <Send className="h-4 w-4 mr-2" />
                Envoyer convocation ({selectedContacts.length})
              </Button>
            )}
            
            <Button size="sm" onClick={() => setShowContactModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un contact
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total des contacts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalContacts}</div>
              <p className="text-xs text-muted-foreground">
                Contacts enregistrés
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contacts actifs</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.actifs}</div>
              <p className="text-xs text-muted-foreground">
                Prêts à recevoir des convocations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En attente</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.enAttente}</div>
              <p className="text-xs text-muted-foreground">
                En cours de validation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactifs</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inactifs}</div>
              <p className="text-xs text-muted-foreground">
                Contacts désactivés
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
              
              <Select value={selectedStatut} onValueChange={setSelectedStatut}>
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tous les statuts</SelectItem>
                  <SelectItem value="ACTIF">Actif</SelectItem>
                  <SelectItem value="INACTIF">Inactif</SelectItem>
                  <SelectItem value="EN_ATTENTE">En attente</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedExposant} onValueChange={setSelectedExposant}>
                <SelectTrigger>
                  <SelectValue placeholder="Exposant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tous les exposants</SelectItem>
                  <SelectItem value="exposant-1">École d'Ingénieurs ParisTech</SelectItem>
                  <SelectItem value="exposant-2">Institut Technologique Supérieur</SelectItem>
                  <SelectItem value="exposant-3">École de Commerce Internationale</SelectItem>
                  <SelectItem value="exposant-4">École Supérieure des Arts</SelectItem>
                  <SelectItem value="exposant-5">Institut des Sciences de la Santé</SelectItem>
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

        {/* Contacts List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Liste des contacts</CardTitle>
                <CardDescription>
                  {totalContacts} contact{totalContacts > 1 ? 's' : ''} trouvé{totalContacts > 1 ? 's' : ''}
                </CardDescription>
              </div>
              {contacts.length > 0 && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedContacts.length === contacts.length}
                    onChange={selectAllContacts}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-600">
                    Tout sélectionner ({selectedContacts.length})
                  </span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucun contact trouvé</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors ${
                      selectedContacts.includes(contact.id) ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedContacts.includes(contact.id)}
                      onChange={() => toggleContactSelection(contact.id)}
                      className="mt-1 rounded border-gray-300"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium text-gray-900">
                            {contact.prenom} {contact.nom}
                          </h3>
                          <Badge variant="outline" className={statutColors[contact.statut]}>
                            {statutLabels[contact.statut]}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingContact(contact);
                              setContactForm({
                                ...contact,
                                exposantId: contact.exposantId || 'NONE'
                              });
                              setShowContactModal(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteContact(contact.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>{contact.email}</span>
                        </div>
                        {contact.telephone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{contact.telephone}</span>
                          </div>
                        )}
                        {contact.entreprise && (
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            <span>{contact.entreprise}</span>
                          </div>
                        )}
                        {contact.fonction && (
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            <span>{contact.fonction}</span>
                          </div>
                        )}
                      </div>
                      
                      {contact.exposant && (
                        <div className="mt-2 text-sm text-gray-500">
                          Exposant: {contact.exposant.nom} ({contact.exposant.domaine})
                        </div>
                      )}
                      
                      <div className="mt-2 text-xs text-gray-400">
                        Ajouté {formatRelativeTime(contact.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <div className="text-sm text-gray-700">
                  Affichage de {(currentPage - 1) * limit + 1} à {Math.min(currentPage * limit, totalContacts)} sur {totalContacts} contacts
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

        {/* Contact Modal */}
        <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingContact ? 'Modifier le contact' : 'Ajouter un contact'}
              </DialogTitle>
              <DialogDescription>
                {editingContact 
                  ? 'Modifiez les informations du contact'
                  : 'Ajoutez un nouveau contact à votre liste'
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Nom *</label>
                  <Input
                    value={contactForm.nom}
                    onChange={(e) => setContactForm({...contactForm, nom: e.target.value})}
                    placeholder="Nom du contact"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Prénom *</label>
                  <Input
                    value={contactForm.prenom}
                    onChange={(e) => setContactForm({...contactForm, prenom: e.target.value})}
                    placeholder="Prénom du contact"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Email *</label>
                  <Input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    placeholder="Email du contact"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Téléphone</label>
                  <Input
                    value={contactForm.telephone}
                    onChange={(e) => setContactForm({...contactForm, telephone: e.target.value})}
                    placeholder="Téléphone"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Fonction</label>
                  <Input
                    value={contactForm.fonction}
                    onChange={(e) => setContactForm({...contactForm, fonction: e.target.value})}
                    placeholder="Fonction"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Entreprise</label>
                  <Input
                    value={contactForm.entreprise}
                    onChange={(e) => setContactForm({...contactForm, entreprise: e.target.value})}
                    placeholder="Entreprise"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Exposant</label>
                  <Select value={contactForm.exposantId} onValueChange={(value) => setContactForm({...contactForm, exposantId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un exposant" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NONE">Aucun exposant</SelectItem>
                      <SelectItem value="exposant-1">École d'Ingénieurs ParisTech</SelectItem>
                      <SelectItem value="exposant-2">Institut Technologique Supérieur</SelectItem>
                      <SelectItem value="exposant-3">École de Commerce Internationale</SelectItem>
                      <SelectItem value="exposant-4">École Supérieure des Arts</SelectItem>
                      <SelectItem value="exposant-5">Institut des Sciences de la Santé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Statut</label>
                  <Select value={contactForm.statut} onValueChange={(value: any) => setContactForm({...contactForm, statut: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIF">Actif</SelectItem>
                      <SelectItem value="INACTIF">Inactif</SelectItem>
                      <SelectItem value="EN_ATTENTE">En attente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Notes</label>
                <Textarea
                  value={contactForm.notes}
                  onChange={(e) => setContactForm({...contactForm, notes: e.target.value})}
                  placeholder="Notes supplémentaires..."
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowContactModal(false)}>
                  Annuler
                </Button>
                <Button onClick={handleContactSubmit}>
                  {editingContact ? 'Modifier' : 'Ajouter'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Convocation Modal */}
        <Dialog open={showConvocationModal} onOpenChange={setShowConvocationModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Envoyer une convocation</DialogTitle>
              <DialogDescription>
                Envoyez une convocation à {selectedContacts.length} contact{selectedContacts.length > 1 ? 's' : ''} sélectionné{selectedContacts.length > 1 ? 's' : ''}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Sujet *</label>
                <Input
                  value={convocationForm.sujet}
                  onChange={(e) => setConvocationForm({...convocationForm, sujet: e.target.value})}
                  placeholder="Sujet de la convocation"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Événement *</label>
                <Select value={convocationForm.evenementId} onValueChange={(value) => setConvocationForm({...convocationForm, evenementId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un événement" />
                  </SelectTrigger>
                  <SelectContent>
                    {evenements.map((evenement) => (
                      <SelectItem key={evenement.id} value={evenement.id}>
                        {evenement.nom} - {new Date(evenement.date).toLocaleDateString('fr-FR')} - {evenement.lycee.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Message *</label>
                <Textarea
                  value={convocationForm.message}
                  onChange={(e) => setConvocationForm({...convocationForm, message: e.target.value})}
                  placeholder="Message de la convocation..."
                  rows={6}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="envoiImmediat"
                  checked={convocationForm.envoiImmediat}
                  onChange={(e) => setConvocationForm({...convocationForm, envoiImmediat: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <label htmlFor="envoiImmediat" className="text-sm text-gray-700">
                  Envoyer immédiatement
                </label>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Destinataires :</strong> {selectedContacts.length} contact{selectedContacts.length > 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowConvocationModal(false)}>
                  Annuler
                </Button>
                <Button 
                  onClick={handleSendConvocation}
                  disabled={sendingConvocation || !convocationForm.sujet || !convocationForm.message || !convocationForm.evenementId}
                >
                  {sendingConvocation ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Envoyer
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <ConfirmDialog />
    </Layout>
  );
}