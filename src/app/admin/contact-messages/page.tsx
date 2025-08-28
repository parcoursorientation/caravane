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
  Mail, 
  Search, 
  Filter, 
  Eye, 
  EyeOff, 
  Trash2, 
  Reply,
  Calendar,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  Inbox,
  MessageCircle,
  Square,
  CheckSquare2
} from "lucide-react";
import Layout from "@/components/layout/Layout";

interface ContactMessage {
  id: string;
  nom: string;
  email: string;
  message: string;
  lu: boolean;
  createdAt: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function ContactMessagesAdmin() {
  const { confirm, ConfirmDialog } = useConfirmDialog();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false
  });
  const [unreadCount, setUnreadCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());
  const [isSelectMode, setIsSelectMode] = useState(false);

  // Récupérer les messages
  const fetchMessages = async (page = 1, search = '', filterType = 'all') => {
    try {
      const token = localStorage.getItem("adminToken");
      
      if (!token) {
        console.error("Aucun token d'authentification trouvé");
        setLoading(false);
        return;
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        search,
        filter: filterType
      });

      const response = await fetch(`/api/admin/contact-messages?${params}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.data);
        setPagination(data.pagination);
        setUnreadCount(data.unreadCount);
      } else if (response.status === 401) {
        console.error("Token invalide ou expiré");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        window.location.href = "/admin/login";
        return;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchMessages(1, searchTerm, filter);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filter]);

  const handleMessageClick = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsDialogOpen(true);

    // Marquer comme lu si non lu
    if (!message.lu) {
      markAsRead(message.id);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      const response = await fetch('/api/admin/contact-messages', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id, lu: true })
      });

      if (response.ok) {
        setMessages(prev => prev.map(msg => 
          msg.id === id ? { ...msg, lu: true } : msg
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Erreur lors du marquage du message:', error);
    }
  };

  const markAsUnread = async (id: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      const response = await fetch('/api/admin/contact-messages', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id, lu: false })
      });

      if (response.ok) {
        setMessages(prev => prev.map(msg => 
          msg.id === id ? { ...msg, lu: false } : msg
        ));
        setUnreadCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Erreur lors du marquage du message:', error);
    }
  };

  const deleteMessage = async (id: string) => {
    const shouldDelete = await confirm({
      title: "Supprimer le message",
      description: "Êtes-vous sûr de vouloir supprimer ce message ? Cette action est irréversible.",
      confirmText: "Supprimer",
      cancelText: "Annuler",
      variant: "destructive",
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("adminToken");
          if (!token) return;

          const response = await fetch(`/api/admin/contact-messages?id=${id}`, {
            method: 'DELETE',
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });

          if (response.ok) {
            setMessages(prev => prev.filter(msg => msg.id !== id));
            setIsDialogOpen(false);
            setSelectedMessage(null);
            
            // Mettre à jour le compteur de messages non lus si nécessaire
            const deletedMessage = messages.find(msg => msg.id === id);
            if (deletedMessage && !deletedMessage.lu) {
              setUnreadCount(prev => Math.max(0, prev - 1));
            }
          }
        } catch (error) {
          console.error('Erreur lors de la suppression du message:', error);
        }
      }
    });
  };

  const refreshMessages = () => {
    setRefreshing(true);
    fetchMessages(pagination.page, searchTerm, filter);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Il y a quelques minutes';
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchMessages(newPage, searchTerm, filter);
    }
  };

  const toggleMessageSelection = (messageId: string) => {
    setSelectedMessages(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(messageId)) {
        newSelection.delete(messageId);
      } else {
        newSelection.add(messageId);
      }
      return newSelection;
    });
  };

  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    if (!isSelectMode) {
      setSelectedMessages(new Set());
    }
  };

  const selectAllMessages = () => {
    if (selectedMessages.size === messages.length) {
      setSelectedMessages(new Set());
    } else {
      setSelectedMessages(new Set(messages.map(msg => msg.id)));
    }
  };

  const deleteSelectedMessages = async () => {
    if (selectedMessages.size === 0) return;

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      const response = await fetch('/api/admin/contact-messages', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ ids: Array.from(selectedMessages) })
      });

      if (response.ok) {
        // Calculer combien de messages non lus ont été supprimés
        const deletedUnreadCount = messages.filter(msg => 
          selectedMessages.has(msg.id) && !msg.lu
        ).length;
        
        setMessages(prev => prev.filter(msg => !selectedMessages.has(msg.id)));
        setSelectedMessages(new Set());
        setIsSelectMode(false);
        setUnreadCount(prev => Math.max(0, prev - deletedUnreadCount));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression multiple des messages:', error);
    }
  };

  if (loading) {
    return (
      <Layout isAdmin>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des messages...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout isAdmin>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Messages de Contact</h1>
              <p className="text-blue-100 mt-2">
                Gérez les messages reçus depuis le formulaire de contact
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-blue-100">Messages non lus</div>
                <div className="text-2xl font-bold">{unreadCount}</div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshMessages}
                disabled={refreshing}
                className="text-blue-600 border-blue-400 hover:bg-blue-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Actualisation...' : 'Actualiser'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher un message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full lg:w-40">
                  <SelectValue placeholder="Filtrer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les messages</SelectItem>
                  <SelectItem value="unread">Non lus</SelectItem>
                  <SelectItem value="read">Lus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <Button
                variant={isSelectMode ? "default" : "outline"}
                size="sm"
                onClick={toggleSelectMode}
                className="flex items-center gap-2"
              >
                {isSelectMode ? (
                  <>
                    <CheckSquare2 className="h-4 w-4" />
                    Quitter la sélection
                  </>
                ) : (
                  <>
                    <Square className="h-4 w-4" />
                    Sélectionner
                  </>
                )}
              </Button>
              {isSelectMode && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={selectAllMessages}
                    className="flex items-center gap-2"
                  >
                    {selectedMessages.size === messages.length ? (
                      <>
                        <CheckSquare2 className="h-4 w-4" />
                        Tout désélectionner
                      </>
                    ) : (
                      <>
                        <Square className="h-4 w-4" />
                        Tout sélectionner
                      </>
                    )}
                  </Button>
                  {selectedMessages.size > 0 && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        const shouldDelete = await confirm({
                          title: "Supprimer plusieurs messages",
                          description: `Êtes-vous sûr de vouloir supprimer ${selectedMessages.size} message${selectedMessages.size > 1 ? 's' : ''} ? Cette action est irréversible.`,
                          confirmText: "Supprimer",
                          cancelText: "Annuler",
                          variant: "destructive",
                          onConfirm: deleteSelectedMessages
                        });
                      }}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Supprimer ({selectedMessages.size})
                    </Button>
                  )}
                </>
              )}
            </div>
            <div className="text-sm text-gray-600 w-full lg:w-auto text-center lg:text-left">
              {pagination.total} message{pagination.total > 1 ? 's' : ''} trouvé{pagination.total > 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Liste des messages */}
        {messages.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Inbox className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filter !== 'all' ? "Aucun message trouvé" : "Aucun message disponible"}
              </h3>
              <p className="text-gray-500">
                {searchTerm || filter !== 'all' 
                  ? "Essayez de modifier vos critères de recherche" 
                  : "Les messages de contact apparaîtront ici"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <Card 
                key={message.id} 
                className={`hover:shadow-md transition-shadow cursor-pointer ${
                  !message.lu ? 'border-l-4 border-l-blue-500' : ''
                } ${selectedMessages.has(message.id) ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => !isSelectMode && handleMessageClick(message)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {isSelectMode && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMessageSelection(message.id);
                          }}
                          className="p-0 h-6 w-6"
                        >
                          {selectedMessages.has(message.id) ? (
                            <CheckSquare2 className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Square className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="font-medium text-gray-900">{message.nom}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{message.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-500">{formatDate(message.createdAt)}</span>
                          </div>
                          {!message.lu && (
                            <Badge variant="destructive" className="text-xs">
                              Non lu
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-gray-600 line-clamp-2">
                          {message.message}
                        </p>
                      </div>
                    </div>
                    
                    {!isSelectMode && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMessageClick(message);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {!message.lu ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(message.id);
                            }}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsUnread(message.id);
                            }}
                          >
                            <EyeOff className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Page {pagination.page} sur {pagination.pages} ({pagination.total} messages)
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.hasPrev}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Précédent
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasNext}
              >
                Suivant
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Dialogue de visualisation des messages */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Message de {selectedMessage?.nom}
            </DialogTitle>
            <DialogDescription>
              {selectedMessage && (
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{selectedMessage.email}</span>
                  <span>•</span>
                  <span>{formatDate(selectedMessage.createdAt)}</span>
                  {!selectedMessage.lu && (
                    <Badge variant="destructive">Non lu</Badge>
                  )}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedMessage && (
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Message
                </Label>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-800 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  {!selectedMessage.lu ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markAsRead(selectedMessage.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Marquer comme lu
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markAsUnread(selectedMessage.id)}
                    >
                      <EyeOff className="h-4 w-4 mr-2" />
                      Marquer comme non lu
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      window.location.href = `mailto:${selectedMessage.email}?subject=Re: Message de contact`;
                    }}
                  >
                    <Reply className="h-4 w-4 mr-2" />
                      Répondre
                    </Button>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteMessage(selectedMessage.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <ConfirmDialog />
    </Layout>
  );
}