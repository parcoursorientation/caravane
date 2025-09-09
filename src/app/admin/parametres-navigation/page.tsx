"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings, Save, CheckCircle, XCircle } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { toast } from "sonner";

interface ParametresNavigation {
  afficherPartenaires: boolean;
  afficherExposants: boolean;
}

export default function ParametresNavigationPage() {
  const [parametres, setParametres] = useState<ParametresNavigation>({
    afficherPartenaires: true,
    afficherExposants: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchParametres();
  }, []);

  const fetchParametres = async () => {
    try {
      const response = await fetch("/api/admin/parametres", {
        headers: {
          Authorization: "Bearer admin-token",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setParametres({
          afficherPartenaires: data.data.afficherPartenaires === "true",
          afficherExposants: data.data.afficherExposants === "true",
        });
      }
    } catch (error) {
      console.error("Erreur lors du chargement des paramètres:", error);
      toast.error("Erreur lors du chargement des paramètres");
    } finally {
      setLoading(false);
    }
  };

  const handleSauvegarder = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/parametres", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer admin-token",
        },
        body: JSON.stringify({
          parametres: {
            afficherPartenaires: String(parametres.afficherPartenaires),
            afficherExposants: String(parametres.afficherExposants),
          },
        }),
      });

      if (response.ok) {
        toast.success("Paramètres sauvegardés avec succès");
      } else {
        throw new Error("Erreur lors de la sauvegarde");
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast.error("Erreur lors de la sauvegarde des paramètres");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleParametre = (cle: keyof ParametresNavigation) => {
    setParametres((prev) => ({
      ...prev,
      [cle]: !prev[cle],
    }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Settings className="h-6 w-6" />
              Paramètres de Navigation
            </h1>
            <p className="text-gray-600 mt-1">
              Contrôlez l'affichage des éléments dans la barre de navigation
            </p>
          </div>
          <Button
            onClick={handleSauvegarder}
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
        </div>

        {/* Paramètres de navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Partenaires */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {parametres.afficherPartenaires ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                Page Partenaires
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="afficher-partenaires">
                    Afficher "Partenaires" dans le menu
                  </Label>
                  <p className="text-sm text-gray-500">
                    Contrôle l'affichage du lien "Partenaires" dans la
                    navigation principale
                  </p>
                </div>
                <Switch
                  id="afficher-partenaires"
                  checked={parametres.afficherPartenaires}
                  onCheckedChange={() =>
                    handleToggleParametre("afficherPartenaires")
                  }
                />
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Statut actuel:</strong>{" "}
                  {parametres.afficherPartenaires
                    ? "Le lien 'Partenaires' est visible dans la navigation"
                    : "Le lien 'Partenaires' est masqué dans la navigation"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Exposants */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {parametres.afficherExposants ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                Page Exposants
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="afficher-exposants">
                    Afficher "Exposants" dans le menu
                  </Label>
                  <p className="text-sm text-gray-500">
                    Contrôle l'affichage du lien "Exposants" dans la navigation
                    principale
                  </p>
                </div>
                <Switch
                  id="afficher-exposants"
                  checked={parametres.afficherExposants}
                  onCheckedChange={() =>
                    handleToggleParametre("afficherExposants")
                  }
                />
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Statut actuel:</strong>{" "}
                  {parametres.afficherExposants
                    ? "Le lien 'Exposants' est visible dans la navigation"
                    : "Le lien 'Exposants' est masqué dans la navigation"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Aperçu de l'impact */}
        <Card>
          <CardHeader>
            <CardTitle>Aperçu de l'impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <h4 className="font-medium">Éléments de navigation visibles :</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Accueil
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Programme
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Inscription
                </span>
                {parametres.afficherPartenaires && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Partenaires
                  </span>
                )}
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Lycées
                </span>
                {parametres.afficherExposants && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Exposants
                  </span>
                )}
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Galerie
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Contact
                </span>
              </div>
              {(!parametres.afficherPartenaires ||
                !parametres.afficherExposants) && (
                <p className="text-sm text-amber-600 mt-2">
                  ⚠️ Certains éléments sont masqués et n'apparaîtront pas dans
                  la navigation publique.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
