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
  CalendarDays, 
  Download, 
  RefreshCw, 
  FileText, 
  Image as ImageIcon,
  Mail,
  LogOut,
  MapPin,
  Clock,
  Users,
  Building2,
  Settings,
  Filter
} from "lucide-react";
import Layout from "@/components/layout/Layout";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  type: "visite" | "presentation" | "atelier" | "conference";
  maxParticipants: number;
  currentParticipants: number;
}

export default function AdminCalendrier() {
  const [user, setUser] = useState<any>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportFormat, setExportFormat] = useState<"ics" | "json" | "csv">("ics");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    type: "",
    dateFrom: "",
    dateTo: ""
  });
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
      
      // Charger les événements (données simulées)
      const mockEvents: Event[] = [
        {
          id: "1",
          title: "Visite du Lycée Mohamed V",
          date: "2024-06-15",
          time: "09:00",
          location: "Lycée Mohamed V, Tanger",
          description: "Visite guidée des installations et présentation des filières",
          type: "visite",
          maxParticipants: 50,
          currentParticipants: 42
        },
        {
          id: "2",
          title: "Présentation École d'Ingénierie",
          date: "2024-06-15",
          time: "11:00",
          location: "Amphithéâtre A, Lycée Ibn Battouta",
          description: "Présentation des programmes d'ingénierie et débouchés",
          type: "presentation",
          maxParticipants: 100,
          currentParticipants: 78
        },
        {
          id: "3",
          title: "Atelier Orientation Universitaire",
          date: "2024-06-16",
          time: "14:00",
          location: "Salle polyvalente, Lycée des Sciences",
          description: "Atelier interactif sur les choix d'orientation et procédures d'inscription",
          type: "atelier",
          maxParticipants: 30,
          currentParticipants: 25
        },
        {
          id: "4",
          title: "Conférence Métiers d'Avenir",
          date: "2024-06-16",
          time: "16:00",
          location: "Auditorium principal, Lycée Mohamed V",
          description: "Conférence sur les métiers émergents et compétences du futur",
          type: "conference",
          maxParticipants: 200,
          currentParticipants: 156
        },
        {
          id: "5",
          title: "Visite Lycée des Sciences et Technologies",
          date: "2024-06-17",
          time: "10:00",
          location: "Lycée des Sciences et Technologies, Tanger",
          description: "Découverte des laboratoires et équipements techniques",
          type: "visite",
          maxParticipants: 40,
          currentParticipants: 35
        }
      ];
      
      setEvents(mockEvents);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      router.push("/admin/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    router.push("/admin/login");
  };

  const filteredEvents = events.filter(event => {
    if (filters.type && event.type !== filters.type) return false;
    if (filters.dateFrom && event.date < filters.dateFrom) return false;
    if (filters.dateTo && event.date > filters.dateTo) return false;
    return true;
  });

  const toggleEventSelection = (eventId: string) => {
    setSelectedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const selectAllEvents = () => {
    if (selectedEvents.length === filteredEvents.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(filteredEvents.map(event => event.id));
    }
  };

  const exportCalendar = () => {
    const eventsToExport = selectedEvents.length > 0 
      ? events.filter(event => selectedEvents.includes(event.id))
      : filteredEvents;

    if (eventsToExport.length === 0) {
      alert("Veuillez sélectionner au moins un événement à exporter.");
      return;
    }

    switch (exportFormat) {
      case "ics":
        exportToICS(eventsToExport);
        break;
      case "json":
        exportToJSON(eventsToExport);
        break;
      case "csv":
        exportToCSV(eventsToExport);
        break;
    }
  };

  const exportToICS = (eventsToExport: Event[]) => {
    let icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Tour de Portes Ouvertes//Calendrier//FR",
      "CALSCALE:GREGORIAN"
    ];

    eventsToExport.forEach(event => {
      const startDate = new Date(`${event.date}T${event.time}`);
      const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 heures de durée
      
      icsContent.push(
        "BEGIN:VEVENT",
        `UID:${event.id}@portesouvertes.com`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        `DTSTART:${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        `DTEND:${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${event.description}`,
        `LOCATION:${event.location}`,
        "END:VEVENT"
      );
    });

    icsContent.push("END:VCALENDAR");
    
    const blob = new Blob([icsContent.join('\n')], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calendrier_portes_ouvertes_${new Date().toISOString().split('T')[0]}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToJSON = (eventsToExport: Event[]) => {
    const data = {
      export_date: new Date().toISOString(),
      total_events: eventsToExport.length,
      events: eventsToExport
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calendrier_portes_ouvertes_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToCSV = (eventsToExport: Event[]) => {
    const headers = ["Titre", "Date", "Heure", "Lieu", "Type", "Description", "Participants max", "Participants actuels"];
    const rows = eventsToExport.map(event => [
      event.title,
      event.date,
      event.time,
      event.location,
      event.type,
      event.description.replace(/"/g, '""'),
      event.maxParticipants.toString(),
      event.currentParticipants.toString()
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calendrier_portes_ouvertes_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "visite": return "bg-blue-100 text-blue-800";
      case "presentation": return "bg-green-100 text-green-800";
      case "atelier": return "bg-purple-100 text-purple-800";
      case "conference": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case "visite": return "Visite";
      case "presentation": return "Présentation";
      case "atelier": return "Atelier";
      case "conference": return "Conférence";
      default: return type;
    }
  };

  if (loading) {
    return (
      <Layout isAdmin>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement du calendrier...</p>
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
            <h2 className="text-3xl font-bold text-gray-900">Export du calendrier</h2>
            <p className="text-gray-600 mt-2">
              Exportez le calendrier des événements dans différents formats.
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
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Filtres et options d'export */}
          <div className="space-y-6">
            {/* Filtres */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtres
                </CardTitle>
                <CardDescription>
                  Filtrer les événements à exporter
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="typeFilter">Type d'événement</Label>
                  <select
                    id="typeFilter"
                    value={filters.type}
                    onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tous les types</option>
                    <option value="visite">Visite</option>
                    <option value="presentation">Présentation</option>
                    <option value="atelier">Atelier</option>
                    <option value="conference">Conférence</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="dateFrom">Date de début</Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="dateTo">Date de fin</Label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                  />
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setFilters({ type: "", dateFrom: "", dateTo: "" })}
                >
                  Réinitialiser les filtres
                </Button>
              </CardContent>
            </Card>

            {/* Options d'export */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Options d'export
                </CardTitle>
                <CardDescription>
                  Choisissez le format d'export
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Format d'export</Label>
                  <div className="space-y-2 mt-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="format"
                        value="ics"
                        checked={exportFormat === "ics"}
                        onChange={() => setExportFormat("ics")}
                      />
                      <span>Calendrier (.ics) - Pour Outlook, Google Calendar, etc.</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="format"
                        value="json"
                        checked={exportFormat === "json"}
                        onChange={() => setExportFormat("json")}
                      />
                      <span>JSON - Pour intégration web</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="format"
                        value="csv"
                        checked={exportFormat === "csv"}
                        onChange={() => setExportFormat("csv")}
                      />
                      <span>CSV - Pour Excel, Google Sheets</span>
                    </label>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={exportCalendar}
                  disabled={filteredEvents.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exporter {selectedEvents.length > 0 ? `(${selectedEvents.length})` : `(${filteredEvents.length})`} événements
                </Button>
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
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Retour au tableau de bord
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/admin/evenements')}>
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Gérer les événements
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/admin/statistiques')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Voir les statistiques
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Liste des événements */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Événements à exporter</CardTitle>
                    <CardDescription>
                      {filteredEvents.length} événement{filteredEvents.length > 1 ? 's' : ''} trouvé{filteredEvents.length > 1 ? 's' : ''}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={selectAllEvents}>
                    {selectedEvents.length === filteredEvents.length ? "Tout désélectionner" : "Tout sélectionner"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredEvents.map((event) => (
                    <div 
                      key={event.id} 
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedEvents.includes(event.id) 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => toggleEventSelection(event.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={selectedEvents.includes(event.id)}
                            onChange={() => toggleEventSelection(event.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium">{event.title}</h3>
                              <Badge className={getEventTypeColor(event.type)}>
                                {getEventTypeLabel(event.type)}
                              </Badge>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <CalendarDays className="h-3 w-3" />
                                <span>{new Date(event.date).toLocaleDateString('fr-FR')} à {event.time}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-3 w-3" />
                                <span>{event.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="h-3 w-3" />
                                <span>{event.currentParticipants}/{event.maxParticipants} participants</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredEvents.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Aucun événement trouvé pour les filtres sélectionnés.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}