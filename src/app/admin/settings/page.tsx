"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Globe, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Users,
  Building2,
  LogOut
} from "lucide-react";
import Layout from "@/components/layout/Layout";

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  eventDate: string;
  maxParticipants: number;
  registrationOpen: boolean;
  maintenanceMode: boolean;
}

export default function AdminSettings() {
  const [user, setUser] = useState<any>(null);
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "Tour de Portes Ouvertes pour l'Orientation",
    siteDescription: "ATLANTIS EVENTS en partenariat avec l'AMCOPE Tanger-Asilah vous invite à découvrir les opportunités de formation dans les lycées de Tanger.",
    contactEmail: "contact@atlantis-events.com",
    contactPhone: "+212 5XX-XXXXXX",
    contactAddress: "Tanger, Maroc",
    eventDate: "2024-06-15",
    maxParticipants: 1000,
    registrationOpen: true,
    maintenanceMode: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
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
      setLoading(false);
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

  const handleSaveSettings = async () => {
    setSaving(true);
    setSuccess(false);
    
    // Simuler une sauvegarde
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };

  const handleInputChange = (field: keyof SiteSettings, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <Layout isAdmin>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des paramètres...</p>
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
            <h2 className="text-3xl font-bold text-gray-900">Paramètres du site</h2>
            <p className="text-gray-600 mt-2">
              Configurez les paramètres généraux du site et de l'événement.
            </p>
            {success && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-600">Paramètres sauvegardés avec succès !</p>
              </div>
            )}
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
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Paramètres principaux */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations générales */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Informations générales
                </CardTitle>
                <CardDescription>
                  Nom et description du site
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="siteName">Nom du site</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => handleInputChange('siteName', e.target.value)}
                    placeholder="Nom du site"
                  />
                </div>
                <div>
                  <Label htmlFor="siteDescription">Description du site</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                    placeholder="Description du site"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Informations de contact
                </CardTitle>
                <CardDescription>
                  Coordonnées de contact pour l'événement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="contactEmail">Email de contact</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Téléphone</Label>
                  <Input
                    id="contactPhone"
                    value={settings.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    placeholder="+212 XXX-XXXXXX"
                  />
                </div>
                <div>
                  <Label htmlFor="contactAddress">Adresse</Label>
                  <Input
                    id="contactAddress"
                    value={settings.contactAddress}
                    onChange={(e) => handleInputChange('contactAddress', e.target.value)}
                    placeholder="Adresse complète"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Événement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Paramètres de l'événement
                </CardTitle>
                <CardDescription>
                  Configuration de l'événement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="eventDate">Date de l'événement</Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={settings.eventDate}
                    onChange={(e) => handleInputChange('eventDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="maxParticipants">Nombre maximum de participants</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    value={settings.maxParticipants}
                    onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value) || 0)}
                    placeholder="1000"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Paramètres système */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Paramètres système
                </CardTitle>
                <CardDescription>
                  Options de configuration du système
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Inscriptions ouvertes</Label>
                    <p className="text-sm text-gray-500">Autoriser les nouvelles inscriptions</p>
                  </div>
                  <Button
                    variant={settings.registrationOpen ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleInputChange('registrationOpen', !settings.registrationOpen)}
                  >
                    {settings.registrationOpen ? "Activé" : "Désactivé"}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Maintenance</Label>
                    <p className="text-sm text-gray-500">Mode maintenance du site</p>
                  </div>
                  <Button
                    variant={settings.maintenanceMode ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => handleInputChange('maintenanceMode', !settings.maintenanceMode)}
                  >
                    {settings.maintenanceMode ? "Activé" : "Désactivé"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
                <CardDescription>
                  Liens vers d'autres fonctionnalités
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/admin')}>
                  <Building2 className="h-4 w-4 mr-2" />
                  Retour au tableau de bord
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/admin/lycees')}>
                  <Building2 className="h-4 w-4 mr-2" />
                  Gérer les lycées
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/admin/exposants')}>
                  <Users className="h-4 w-4 mr-2" />
                  Gérer les exposants
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/admin/evenements')}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Gérer les événements
                </Button>
              </CardContent>
            </Card>

            {/* Sauvegarder */}
            <Card>
              <CardHeader>
                <CardTitle>Sauvegarder les modifications</CardTitle>
                <CardDescription>
                  Enregistrez tous les paramètres modifiés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  onClick={handleSaveSettings}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Sauvegarde en cours...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Sauvegarder les paramètres
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}