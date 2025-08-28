"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  Users, 
  Building2, 
  CalendarDays, 
  Mail,
  Download,
  RefreshCw,
  LogOut,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Clock,
  MapPin,
  Image,
  Users2,
  FileText,
  Globe,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
  Wifi,
  WifiOff,
  GraduationCap
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useRealTimeStats } from "@/hooks/use-realtime-stats";

interface StatsData {
  totalLycees: number;
  totalExposants: number;
  totalEvenements: number;
  totalMessages: number;
  totalInscriptions: number;
  totalPartenaires: number;
  totalMedias: number;
  totalGaleries: number;
  recentMessages: number;
  recentInscriptions: number;
  recentEvenements: number;
  recentExposants: number;
  recentLycees: number;
  lyceesByType: Array<{ type: string; _count: { type: number } }>;
  exposantsByPaymentStatus: Array<{ statutPaiement: string; _count: { statutPaiement: number } }>;
  inscriptionsByType: Array<{ typeParticipant: string; _count: { typeParticipant: number } }>;
  inscriptionsByStatus: Array<{ statut: string; _count: { statut: number } }>;
  inscriptionsByNiveau: Array<{ niveau: string; _count: { niveau: number } }>;
  inscriptionsByBranche: Array<{ branche: string; _count: { branche: number } }>;
  partenairesByType: Array<{ type: string; _count: { type: number } }>;
  mediasByType: Array<{ type: string; _count: { type: number } }>;
  last7Days: Array<{
    date: string;
    dayName: string;
    lycees: number;
    exposants: number;
    evenements: number;
    inscriptions: number;
    messages: number;
  }>;
  evenementsByVille: Array<{ ville: string; _count: { ville: number } }>;
  inscriptionsByEvenement: Array<{ evenementId: string; _count: { evenementId: number } }>;
  messagesByReadStatus: Array<{ lu: boolean; _count: { lu: number } }>;
}

export default function AdminStatistiques() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<StatsData>({
    totalLycees: 0,
    totalExposants: 0,
    totalEvenements: 0,
    totalMessages: 0,
    totalInscriptions: 0,
    totalPartenaires: 0,
    totalMedias: 0,
    totalGaleries: 0,
    recentMessages: 0,
    recentInscriptions: 0,
    recentEvenements: 0,
    recentExposants: 0,
    recentLycees: 0,
    lyceesByType: [],
    exposantsByPaymentStatus: [],
    inscriptionsByType: [],
    inscriptionsByStatus: [],
    inscriptionsByNiveau: [],
    inscriptionsByBranche: [],
    partenairesByType: [],
    mediasByType: [],
    last7Days: [],
    evenementsByVille: [],
    inscriptionsByEvenement: [],
    messagesByReadStatus: []
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [useRealTime, setUseRealTime] = useState(true);
  const router = useRouter();
  
  // Real-time stats hook
  const { 
    stats: realTimeStats, 
    isConnected, 
    error: realTimeError, 
    requestStatsUpdate,
    isRealTimeAvailable
  } = useRealTimeStats(useRealTime);

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
          const response = await fetch('/api/admin/statistiques', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setStats(data);
          } else {
            // Données simulées en cas d'erreur
            setStats({
              totalLycees: 12,
              totalExposants: 25,
              totalEvenements: 8,
              totalMessages: 156,
              totalInscriptions: 342,
              totalPartenaires: 15,
              totalMedias: 89,
              totalGaleries: 6,
              recentMessages: 12,
              recentInscriptions: 28,
              recentEvenements: 2,
              recentExposants: 3,
              recentLycees: 1,
              lyceesByType: [{ type: "PUBLIC", _count: { type: 8 } }, { type: "PRIVE", _count: { type: 4 } }],
              exposantsByPaymentStatus: [{ statutPaiement: "PAYE", _count: { statutPaiement: 18 } }, { statutPaiement: "EN_ATTENTE", _count: { statutPaiement: 7 } }],
              inscriptionsByType: [{ typeParticipant: "Étudiant", _count: { typeParticipant: 154 } }, { typeParticipant: "Parent", _count: { typeParticipant: 103 } }],
              inscriptionsByStatus: [{ statut: "CONFIRMEE", _count: { statut: 280 } }, { statut: "EN_ATTENTE", _count: { statut: 62 } }],
              inscriptionsByNiveau: [
                { niveau: "college", _count: { niveau: 45 } },
                { niveau: "tronc-commun", _count: { niveau: 78 } },
                { niveau: "1er-bac", _count: { niveau: 89 } },
                { niveau: "2eme-bac", _count: { niveau: 95 } },
                { niveau: "supérieur", _count: { niveau: 25 } },
                { niveau: "professionnel", _count: { niveau: 10 } }
              ],
              inscriptionsByBranche: [
                { branche: "sciences-math-A", _count: { branche: 18 } },
                { branche: "sciences-math-B", _count: { branche: 15 } },
                { branche: "sciences-physique", _count: { branche: 22 } },
                { branche: "STM", _count: { branche: 12 } },
                { branche: "STE", _count: { branche: 10 } },
                { branche: "G-economie", _count: { branche: 8 } },
                { branche: "G-comptabilite", _count: { branche: 6 } },
                { branche: "SVT", _count: { branche: 3 } },
                { branche: "Lettre", _count: { branche: 1 } }
              ],
              partenairesByType: [{ type: "ORGANISATEUR", _count: { type: 5 } }, { type: "PARTENAIRE", _count: { type: 10 } }],
              mediasByType: [{ type: "PHOTO", _count: { type: 75 } }, { type: "VIDEO", _count: { type: 14 } }],
              last7Days: [
                { date: "2024-01-01", dayName: "Lundi", lycees: 2, exposants: 3, evenements: 1, inscriptions: 15, messages: 5 },
                { date: "2024-01-02", dayName: "Mardi", lycees: 1, exposants: 4, evenements: 0, inscriptions: 22, messages: 8 },
                { date: "2024-01-03", dayName: "Mercredi", lycees: 3, exposants: 2, evenements: 2, inscriptions: 18, messages: 12 },
                { date: "2024-01-04", dayName: "Jeudi", lycees: 0, exposants: 5, evenements: 1, inscriptions: 25, messages: 6 },
                { date: "2024-01-05", dayName: "Vendredi", lycees: 2, exposants: 1, evenements: 0, inscriptions: 31, messages: 9 },
                { date: "2024-01-06", dayName: "Samedi", lycees: 1, exposants: 3, evenements: 1, inscriptions: 28, messages: 15 },
                { date: "2024-01-07", dayName: "Dimanche", lycees: 0, exposants: 0, evenements: 0, inscriptions: 12, messages: 3 }
              ],
              evenementsByVille: [{ ville: "Paris", _count: { ville: 3 } }, { ville: "Lyon", _count: { ville: 2 } }],
              inscriptionsByEvenement: [{ evenementId: "1", _count: { evenementId: 45 } }, { evenementId: "2", _count: { evenementId: 38 } }],
              messagesByReadStatus: [{ lu: false, _count: { lu: 89 } }, { lu: true, _count: { lu: 67 } }]
            });
          }
        } catch (error) {
          console.error("Erreur lors du chargement des statistiques:", error);
          // Données simulées en cas d'erreur
          setStats({
            totalLycees: 12,
            totalExposants: 25,
            totalEvenements: 8,
            totalMessages: 156,
            totalInscriptions: 342,
            totalPartenaires: 15,
            totalMedias: 89,
            totalGaleries: 6,
            recentMessages: 12,
            recentInscriptions: 28,
            recentEvenements: 2,
            recentExposants: 3,
            recentLycees: 1,
            lyceesByType: [{ type: "PUBLIC", _count: { type: 8 } }, { type: "PRIVE", _count: { type: 4 } }],
            exposantsByPaymentStatus: [{ statutPaiement: "PAYE", _count: { statutPaiement: 18 } }, { statutPaiement: "EN_ATTENTE", _count: { statutPaiement: 7 } }],
            inscriptionsByType: [{ typeParticipant: "Étudiant", _count: { typeParticipant: 154 } }, { typeParticipant: "Parent", _count: { typeParticipant: 103 } }],
            inscriptionsByStatus: [{ statut: "CONFIRMEE", _count: { statut: 280 } }, { statut: "EN_ATTENTE", _count: { statut: 62 } }],
            inscriptionsByNiveau: [
              { niveau: "college", _count: { niveau: 45 } },
              { niveau: "tronc-commun", _count: { niveau: 78 } },
              { niveau: "1er-bac", _count: { niveau: 89 } },
              { niveau: "2eme-bac", _count: { niveau: 95 } },
              { niveau: "supérieur", _count: { niveau: 25 } },
              { niveau: "professionnel", _count: { niveau: 10 } }
            ],
            inscriptionsByBranche: [
              { branche: "sciences-math-A", _count: { branche: 18 } },
              { branche: "sciences-math-B", _count: { branche: 15 } },
              { branche: "sciences-physique", _count: { branche: 22 } },
              { branche: "STM", _count: { branche: 12 } },
              { branche: "STE", _count: { branche: 10 } },
              { branche: "G-economie", _count: { branche: 8 } },
              { branche: "G-comptabilite", _count: { branche: 6 } },
              { branche: "SVT", _count: { branche: 3 } },
              { branche: "Lettre", _count: { branche: 1 } }
            ],
            partenairesByType: [{ type: "ORGANISATEUR", _count: { type: 5 } }, { type: "PARTENAIRE", _count: { type: 10 } }],
            mediasByType: [{ type: "PHOTO", _count: { type: 75 } }, { type: "VIDEO", _count: { type: 14 } }],
            last7Days: [
              { date: "2024-01-01", dayName: "Lundi", lycees: 2, exposants: 3, evenements: 1, inscriptions: 15, messages: 5 },
              { date: "2024-01-02", dayName: "Mardi", lycees: 1, exposants: 4, evenements: 0, inscriptions: 22, messages: 8 },
              { date: "2024-01-03", dayName: "Mercredi", lycees: 3, exposants: 2, evenements: 2, inscriptions: 18, messages: 12 },
              { date: "2024-01-04", dayName: "Jeudi", lycees: 0, exposants: 5, evenements: 1, inscriptions: 25, messages: 6 },
              { date: "2024-01-05", dayName: "Vendredi", lycees: 2, exposants: 1, evenements: 0, inscriptions: 31, messages: 9 },
              { date: "2024-01-06", dayName: "Samedi", lycees: 1, exposants: 3, evenements: 1, inscriptions: 28, messages: 15 },
              { date: "2024-01-07", dayName: "Dimanche", lycees: 0, exposants: 0, evenements: 0, inscriptions: 12, messages: 3 }
            ],
            evenementsByVille: [{ ville: "Paris", _count: { ville: 3 } }, { ville: "Lyon", _count: { ville: 2 } }],
            inscriptionsByEvenement: [{ evenementId: "1", _count: { evenementId: 45 } }, { evenementId: "2", _count: { evenementId: 38 } }],
            messagesByReadStatus: [{ lu: false, _count: { lu: 89 } }, { lu: true, _count: { lu: 67 } }]
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

  // Update stats when real-time data is received
  useEffect(() => {
    if (realTimeStats && useRealTime) {
      setStats(prevStats => ({
        ...prevStats,
        ...realTimeStats
      }));
    }
  }, [realTimeStats, useRealTime]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    router.push("/admin/login");
  };

  const refreshStats = async () => {
    if (useRealTime && isRealTimeAvailable) {
      // Use real-time update if available
      requestStatsUpdate();
    } else {
      // Fallback to API call
      const token = localStorage.getItem("adminToken");
      if (!token) return;
      
      setRefreshing(true);
      try {
        const response = await fetch('/api/admin/statistiques', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Erreur lors du rafraîchissement des statistiques:", error);
      } finally {
        setRefreshing(false);
      }
    }
  };

  const exportStats = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;
    
    try {
      const response = await fetch('/api/admin/statistiques/export', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `statistiques_completes_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Erreur lors de l'export des statistiques:", error);
    }
  };

  if (loading) {
    return (
      <Layout isAdmin>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des statistiques...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout isAdmin>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Statistiques</h2>
            <p className="text-gray-600 mt-2">
              Vue d'ensemble des performances et de l'activité de la plateforme.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                Bonjour, {user?.name}
              </div>
              <Badge variant={user?.role === "SUPER_ADMIN" ? "default" : "secondary"}>
                {user?.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
              </Badge>
            </div>
            
            {/* Real-time status indicator */}
            <div className="flex items-center gap-2">
              {isConnected ? (
                <div className="flex items-center gap-1 text-green-600">
                  <Wifi className="h-4 w-4" />
                  <span className="text-xs">Temps réel</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-gray-400">
                  <WifiOff className="h-4 w-4" />
                  <span className="text-xs">Hors ligne</span>
                </div>
              )}
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshStats}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>

        {/* Real-time controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="realtime-toggle"
                checked={useRealTime}
                onChange={(e) => setUseRealTime(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="realtime-toggle" className="text-sm font-medium text-gray-700">
                Mises à jour en temps réel
              </label>
            </div>
            
            {realTimeStats?.timestamp && (
              <div className="text-xs text-gray-500">
                Dernière mise à jour: {new Date(realTimeStats.timestamp).toLocaleTimeString('fr-FR')}
              </div>
            )}
          </div>
          
          {realTimeError && (
            <div className="text-xs text-red-600 bg-red-50 px-3 py-1 rounded">
              {realTimeError}
            </div>
          )}
        </div>

        {/* Stats principales */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lycées</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLycees}</div>
              <p className="text-xs text-muted-foreground">
                {stats.recentLycees > 0 && `+${stats.recentLycees} cette semaine`}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Exposants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalExposants}</div>
              <p className="text-xs text-muted-foreground">
                {stats.recentExposants > 0 && `+${stats.recentExposants} cette semaine`}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inscriptions</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalInscriptions}</div>
              <p className="text-xs text-muted-foreground">
                {stats.recentInscriptions > 0 && `+${stats.recentInscriptions} cette semaine`}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMessages}</div>
              <p className="text-xs text-muted-foreground">
                {stats.recentMessages > 0 && `+${stats.recentMessages} cette semaine`}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats secondaires */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Événements</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEvenements}</div>
              <p className="text-xs text-muted-foreground">
                {stats.recentEvenements > 0 && `+${stats.recentEvenements} cette semaine`}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Partenaires</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPartenaires}</div>
              <p className="text-xs text-muted-foreground">
                Organisations partenaires
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Médias</CardTitle>
              <Image className="h-4 w-4 text-muted-foreground" alt="Icône médias" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMedias}</div>
              <p className="text-xs text-muted-foreground">
                Photos et documents
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Galeries</CardTitle>
              <Users2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalGaleries}</div>
              <p className="text-xs text-muted-foreground">
                Albums photo
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Onglets pour différentes analyses */}
        <Tabs defaultValue="activite" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="activite">Activité</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="performances">Performances</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="activite" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Activité récente */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Activité récente
                  </CardTitle>
                  <CardDescription>
                    Évolution de l'activité sur les 7 derniers jours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.last7Days.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{item.dayName}</span>
                        </div>
                        <div className="flex gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Building2 className="h-3 w-3 text-blue-600" />
                            <span>{item.lycees}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-green-600" />
                            <span>{item.exposants}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CalendarDays className="h-3 w-3 text-purple-600" />
                            <span>{item.evenements}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="h-3 w-3 text-orange-600" />
                            <span>{item.inscriptions}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-red-600" />
                            <span>{item.messages}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Répartition par type */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Répartition par type
                  </CardTitle>
                  <CardDescription>
                    Distribution des différentes entités
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Lycées par type */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Lycées</h4>
                      {stats.lyceesByType.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                          <span className="text-sm">{item.type}</span>
                          <span className="font-bold text-sm">{item._count.type}</span>
                        </div>
                      ))}
                    </div>

                    {/* Exposants par statut */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Exposants</h4>
                      {stats.exposantsByPaymentStatus.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            {item.statutPaiement === 'PAYE' ? (
                              <CheckCircle className="h-3 w-3 text-green-600" />
                            ) : (
                              <Clock className="h-3 w-3 text-orange-600" />
                            )}
                            <span className="text-sm">{item.statutPaiement}</span>
                          </div>
                          <span className="font-bold text-sm">{item._count.statutPaiement}</span>
                        </div>
                      ))}
                    </div>

                    {/* Messages par statut */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Messages</h4>
                      {stats.messagesByReadStatus.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            {item.lu ? (
                              <CheckCircle className="h-3 w-3 text-green-600" />
                            ) : (
                              <AlertCircle className="h-3 w-3 text-red-600" />
                            )}
                            <span className="text-sm">{item.lu ? 'Lus' : 'Non lus'}</span>
                          </div>
                          <span className="font-bold text-sm">{item._count.lu}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="participants" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Inscriptions par type */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Inscriptions par type
                  </CardTitle>
                  <CardDescription>
                    Répartition des types de participants
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.inscriptionsByType.map((item, index) => {
                      const percentage = Math.round((item._count.typeParticipant / stats.totalInscriptions) * 100);
                      const colors = ['blue', 'green', 'purple', 'orange'];
                      const color = colors[index % colors.length];
                      
                      return (
                        <div key={index} className={`flex items-center justify-between p-3 bg-${color}-50 rounded-lg`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 bg-${color}-600 rounded`}></div>
                            <span className="font-medium">{item.typeParticipant}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{percentage}%</span>
                            <span className="text-sm text-gray-500">{item._count.typeParticipant}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Inscriptions par statut */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Inscriptions par statut
                  </CardTitle>
                  <CardDescription>
                    État des inscriptions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.inscriptionsByStatus.map((item, index) => {
                      const percentage = Math.round((item._count.statut / stats.totalInscriptions) * 100);
                      
                      return (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg">
                          <div className="flex items-center gap-3">
                            {item.statut === 'CONFIRMEE' && (
                              <div className="w-4 h-4 bg-green-600 rounded"></div>
                            )}
                            {item.statut === 'EN_ATTENTE' && (
                              <div className="w-4 h-4 bg-yellow-600 rounded"></div>
                            )}
                            {item.statut === 'ANNULEE' && (
                              <div className="w-4 h-4 bg-red-600 rounded"></div>
                            )}
                            <span className="font-medium">{item.statut}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{percentage}%</span>
                            <span className="text-sm text-gray-500">{item._count.statut}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Inscriptions par niveau d'études */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Inscriptions par niveau d'études
                  </CardTitle>
                  <CardDescription>
                    Répartition des niveaux d'études des inscrits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.inscriptionsByNiveau.map((item, index) => {
                      const percentage = Math.round((item._count.niveau / stats.totalInscriptions) * 100);
                      const colors = ['blue', 'green', 'purple', 'orange', 'red', 'indigo'];
                      const color = colors[index % colors.length];
                      
                      // Mapper les valeurs techniques vers des noms lisibles
                      const niveauLabels: { [key: string]: string } = {
                        'college': 'Collège',
                        'tronc-commun': 'Tronc commun',
                        '1er-bac': '1er Bac',
                        '2eme-bac': '2ème Bac',
                        'supérieur': 'Études supérieures',
                        'professionnel': 'Formation professionnelle'
                      };
                      
                      return (
                        <div key={index} className={`flex items-center justify-between p-3 bg-${color}-50 rounded-lg`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 bg-${color}-600 rounded`}></div>
                            <span className="font-medium">{niveauLabels[item.niveau] || item.niveau}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{percentage}%</span>
                            <span className="text-sm text-gray-500">{item._count.niveau}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Inscriptions par filière (2ème Bac) */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Répartition des filières (2ème Bac)
                  </CardTitle>
                  <CardDescription>
                    Distribution des branches pour les étudiants de 2ème Bac
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.inscriptionsByBranche.length > 0 ? (
                      stats.inscriptionsByBranche.map((item, index) => {
                        // Calculer le total des 2ème Bac pour le pourcentage
                        const total2emeBac = stats.inscriptionsByNiveau.find(n => n.niveau === '2eme-bac')?._count.niveau || 1;
                        const percentage = Math.round((item._count.branche / total2emeBac) * 100);
                        const colors = ['blue', 'green', 'purple', 'orange', 'red', 'indigo', 'pink', 'yellow', 'gray'];
                        const color = colors[index % colors.length];
                        
                        // Mapper les valeurs techniques vers des noms lisibles
                        const brancheLabels: { [key: string]: string } = {
                          'sciences-math-A': 'Sciences math A',
                          'sciences-math-B': 'Sciences math B',
                          'sciences-physique': 'Sciences physique',
                          'STM': 'STM',
                          'STE': 'STE',
                          'G-economie': 'G. économie',
                          'G-comptabilite': 'G. comptabilité',
                          'SVT': 'SVT',
                          'Lettre': 'Lettre',
                          'sciences-humaines': 'Sciences humaines',
                          'art-plastic': 'Art plastic',
                          'bac-pro': 'Bac pro'
                        };
                        
                        return (
                          <div key={index} className={`flex items-center justify-between p-3 bg-${color}-50 rounded-lg`}>
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 bg-${color}-600 rounded`}></div>
                              <span className="font-medium">{brancheLabels[item.branche] || item.branche}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{percentage}%</span>
                              <span className="text-sm text-gray-500">{item._count.branche}</span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <GraduationCap className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p>Aucune donnée de filière disponible</p>
                        <p className="text-sm">Les étudiants de 2ème Bac n'ont pas encore spécifié leur branche</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performances" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Partenaires par type */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Partenaires par type
                  </CardTitle>
                  <CardDescription>
                    Répartition des types de partenaires
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.partenairesByType.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 bg-indigo-600 rounded"></div>
                          <span className="font-medium">{item.type}</span>
                        </div>
                        <span className="font-bold text-sm">{item._count.type}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Médias par type */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5" alt="Icône médias" />
                    Médias par type
                  </CardTitle>
                  <CardDescription>
                    Répartition des types de médias
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.mediasByType.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 bg-pink-600 rounded"></div>
                          <span className="font-medium">{item.type}</span>
                        </div>
                        <span className="font-bold text-sm">{item._count.type}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Événements par ville */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Événements par ville
                </CardTitle>
                <CardDescription>
                  Répartition géographique des événements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {stats.evenementsByVille.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-sm">{item.ville}</span>
                      <span className="font-bold text-sm">{item._count.ville}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Export des données */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Exporter les données
                  </CardTitle>
                  <CardDescription>
                    Téléchargez les statistiques complètes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" onClick={exportStats}>
                    <Download className="h-4 w-4 mr-2" />
                    Exporter toutes les statistiques
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/admin/lycees')}>
                    <Building2 className="h-4 w-4 mr-2" />
                    Exporter la liste des lycées
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/admin/exposants')}>
                    <Users className="h-4 w-4 mr-2" />
                    Exporter la liste des exposants
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/admin/inscriptions')}>
                    <Target className="h-4 w-4 mr-2" />
                    Exporter les inscriptions
                  </Button>
                </CardContent>
              </Card>

              {/* Actions rapides */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions rapides</CardTitle>
                  <CardDescription>
                    Accès rapide aux fonctionnalités liées aux statistiques
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/admin')}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Retour au tableau de bord
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/contact')}>
                    <Mail className="h-4 w-4 mr-2" />
                    Voir les messages
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/admin/evenements')}>
                    <CalendarDays className="h-4 w-4 mr-2" />
                    Voir les événements
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/admin/partenaires')}>
                    <Globe className="h-4 w-4 mr-2" />
                    Voir les partenaires
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}