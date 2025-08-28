"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  CalendarDays, 
  Image as ImageIcon, 
  Mail, 
  Settings, 
  LogOut,
  TrendingUp,
  Plus,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Clock,
  BarChart3
} from "lucide-react";
import Layout from "@/components/layout/Layout";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "SUPER_ADMIN";
}

interface DashboardStats {
  totalLycees: number;
  totalExposants: number;
  totalEvenements: number;
  totalMessages: number;
  recentMessages: number;
  totalInscriptions: number;
  recentInscriptions: number;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalLycees: 0,
    totalExposants: 0,
    totalEvenements: 0,
    totalMessages: 0,
    recentMessages: 0,
    totalInscriptions: 0,
    recentInscriptions: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem("adminToken");
    const userData = localStorage.getItem("adminUser");
    
    if (!token || !userData) {
      router.push("/admin/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Charger les statistiques depuis l'API
      const fetchStats = async () => {
        try {
          const response = await fetch('/api/admin/dashboard', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setStats(data);
          } else {
            setError("Erreur lors du chargement des statistiques");
            setStats({
              totalLycees: 0,
              totalExposants: 0,
              totalEvenements: 0,
              totalMessages: 0,
              recentMessages: 0,
              totalInscriptions: 0,
              recentInscriptions: 0
            });
          }
        } catch (error) {
          console.error("Erreur lors du chargement des statistiques:", error);
          setError("Erreur de connexion au serveur");
          setStats({
            totalLycees: 0,
            totalExposants: 0,
            totalEvenements: 0,
            totalMessages: 0,
            recentMessages: 0,
            totalInscriptions: 0,
            recentInscriptions: 0
          });
        } finally {
          setLoading(false);
        }
      };
      
      fetchStats();
    } catch (error) {
      console.error("Erreur lors du chargement des données utilisateur:", error);
      router.push("/admin/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    router.push("/admin/login");
  };

  const refreshStats = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;
    
    setRefreshing(true);
    try {
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
        setError(null);
      } else {
        setError("Erreur lors du rafraîchissement des statistiques");
      }
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des statistiques:", error);
      setError("Erreur de connexion au serveur");
    } finally {
      setRefreshing(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  if (loading) {
    return (
      <Layout isAdmin>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement du tableau de bord...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout isAdmin>
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
            <p className="text-gray-600 mt-1">
              {getGreeting()}, {user?.name} - Voici un aperçu de votre plateforme
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={user?.role === "SUPER_ADMIN" ? "default" : "secondary"}>
              {user?.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshStats}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Actualisation...' : 'Actualiser'}
            </Button>
          </div>
        </div>
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <Card className={`hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-blue-500 ${refreshing ? 'opacity-75' : ''}`} onClick={() => !refreshing && router.push('/admin/lycees')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Lycées</CardTitle>
              <Building2 className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {refreshing ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                ) : (
                  stats.totalLycees
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Établissements participants
              </p>
            </CardContent>
          </Card>

          <Card className={`hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-green-500 ${refreshing ? 'opacity-75' : ''}`} onClick={() => !refreshing && router.push('/admin/exposants')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Exposants</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {refreshing ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                ) : (
                  stats.totalExposants
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Instituts participants
              </p>
            </CardContent>
          </Card>

          <Card className={`hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-purple-500 ${refreshing ? 'opacity-75' : ''}`} onClick={() => !refreshing && router.push('/admin/evenements')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Événements</CardTitle>
              <CalendarDays className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {refreshing ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                ) : (
                  stats.totalEvenements
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Sessions programmées
              </p>
            </CardContent>
          </Card>

          <Card className={`hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-orange-500 ${refreshing ? 'opacity-75' : ''}`} onClick={() => !refreshing && router.push('/admin/inscriptions')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Inscriptions</CardTitle>
              <Users className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {refreshing ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                ) : (
                  stats.totalInscriptions
                )}
              </div>
              <p className="text-xs text-green-600 mt-1">
                +{stats.recentInscriptions} récentes
              </p>
            </CardContent>
          </Card>

          <Card className={`hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-red-500 ${refreshing ? 'opacity-75' : ''}`} onClick={() => !refreshing && router.push('/admin/contact-messages')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Messages</CardTitle>
              <Mail className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {refreshing ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                ) : (
                  stats.totalMessages
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Total des messages
              </p>
            </CardContent>
          </Card>

          <Card className={`hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-cyan-500 ${refreshing ? 'opacity-75' : ''}`} onClick={() => !refreshing && router.push('/admin/contact-messages')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Nouveaux</CardTitle>
              <TrendingUp className="h-4 w-4 text-cyan-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {refreshing ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                ) : (
                  stats.recentMessages
                )}
              </div>
              <p className="text-xs text-green-600 mt-1">
                Messages récents
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions Rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-all duration-200 group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <Building2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  Lycées
                </CardTitle>
                <CardDescription className="text-sm">
                  Gérez les établissements participants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => router.push('/admin/lycees?action=add')}>
                    <Plus className="h-3 w-3 mr-1" />
                    Ajouter
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => router.push('/admin/lycees')}>
                    <Eye className="h-3 w-3 mr-1" />
                    Voir
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-200 group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <Users className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  Exposants
                </CardTitle>
                <CardDescription className="text-sm">
                  Gérez les instituts participants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => router.push('/admin/exposants?action=add')}>
                    <Plus className="h-3 w-3 mr-1" />
                    Ajouter
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => router.push('/admin/exposants')}>
                    <Eye className="h-3 w-3 mr-1" />
                    Voir
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-200 group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-600">
                  <CalendarDays className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  Événements
                </CardTitle>
                <CardDescription className="text-sm">
                  Planifiez les sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => router.push('/admin/evenements?action=add')}>
                    <Plus className="h-3 w-3 mr-1" />
                    Ajouter
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => router.push('/admin/evenements')}>
                    <Eye className="h-3 w-3 mr-1" />
                    Voir
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-200 group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <Users className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  Inscriptions
                </CardTitle>
                <CardDescription className="text-sm">
                  Validez les participants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => router.push('/admin/inscriptions')}>
                    <Eye className="h-3 w-3 mr-1" />
                    Voir
                  </Button>
                  {stats.recentInscriptions > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {stats.recentInscriptions} nouveau{stats.recentInscriptions > 1 ? 'x' : ''}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Autres Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-all duration-200 group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Mail className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  Messages
                </CardTitle>
                <CardDescription className="text-sm">
                  Consultez les messages des visiteurs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => router.push('/admin/contact-messages')}>
                    <Eye className="h-3 w-3 mr-1" />
                    Voir
                  </Button>
                  {stats.recentMessages > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {stats.recentMessages} nouveau{stats.recentMessages > 1 ? 'x' : ''}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-200 group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-600">
                  <Clock className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  Compte à Rebours
                </CardTitle>
                <CardDescription className="text-sm">
                  Gérez les comptes à rebours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => router.push('/admin/compte-a-rebours?action=add')}>
                    <Plus className="h-3 w-3 mr-1" />
                    Ajouter
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => router.push('/admin/compte-a-rebours')}>
                    <Eye className="h-3 w-3 mr-1" />
                    Voir
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-200 group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-teal-600">
                  <Users className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  Contacts Exposants
                </CardTitle>
                <CardDescription className="text-sm">
                  Gérez les contacts et convocations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => router.push('/admin/contacts-exposants?action=add')}>
                    <Plus className="h-3 w-3 mr-1" />
                    Ajouter
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => router.push('/admin/contacts-exposants')}>
                    <Eye className="h-3 w-3 mr-1" />
                    Voir
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-200 group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-pink-600">
                  <BarChart3 className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  Statistiques
                </CardTitle>
                <CardDescription className="text-sm">
                  Consultez les rapports et stats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => router.push('/admin/statistiques')}>
                    <Eye className="h-3 w-3 mr-1" />
                    Voir
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Activité récente</CardTitle>
                  <CardDescription>
                    Dernières actions effectuées dans le système
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => router.push('/admin/activities')}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Voir tout
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Nouvelle inscription</p>
                    <p className="text-xs text-gray-500">Il y a 5 minutes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Nouveau lycée ajouté</p>
                    <p className="text-xs text-gray-500">Il y a 1 heure</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Mail className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Nouveau message reçu</p>
                    <p className="text-xs text-gray-500">Il y a 2 heures</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>
                    État actuel de la plateforme
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={refreshStats}
                  disabled={refreshing}
                >
                  <RefreshCw className={`h-3 w-3 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
                  Check
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">API Status</span>
                  </div>
                  <span className="text-xs text-green-600">Operational</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Database</span>
                  </div>
                  <span className="text-xs text-green-600">Connected</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium">Real-time Updates</span>
                  </div>
                  <span className="text-xs text-blue-600">Active</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span className="text-sm font-medium">Storage</span>
                  </div>
                  <span className="text-xs text-gray-600">85% used</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
    </Layout>
  );
}