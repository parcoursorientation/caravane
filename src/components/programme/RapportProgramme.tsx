"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Download,
  FileText,
  Calendar,
  MapPin,
  Clock,
  Users,
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "@/hooks/use-toast";

interface EvenementData {
  id: string;
  nom?: string;
  date: string;
  dateDebut?: string;
  dateFin?: string;
  heureDebut: string;
  heureFin: string;
  ville?: string;
  lycee: {
    id: string;
    nom: string;
    adresse: string;
  };
}

interface RapportProgrammeProps {
  evenements: EvenementData[];
}

export default function RapportProgramme({
  evenements,
}: RapportProgrammeProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const generatePDF = async () => {
    if (!evenements || evenements.length === 0) {
      toast({
        title: "Aucune sélection",
        description:
          "Veuillez sélectionner au moins un événement à inclure dans le PDF.",
        variant: "destructive",
      });
      return;
    }
    setIsGeneratingPDF(true);
    try {
      const element = document.getElementById("rapport-programme");
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `programme-evenements-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      // Fallback: try with a simpler approach
      try {
        const element = document.getElementById("rapport-programme");
        if (!element) return;

        // Create a clean clone of the element
        const clone = element.cloneNode(true) as HTMLElement;
        clone.style.display = "block";
        clone.style.position = "absolute";
        clone.style.left = "-9999px";
        clone.style.top = "-9999px";
        document.body.appendChild(clone);

        const canvas = await html2canvas(clone, {
          scale: 2,
          backgroundColor: "#ffffff",
          logging: false,
        });

        document.body.removeChild(clone);

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        const fileName = `programme-evenements-${
          new Date().toISOString().split("T")[0]
        }.pdf`;
        pdf.save(fileName);
      } catch (fallbackError) {
        console.error("Fallback PDF generation also failed:", fallbackError);
      }
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const daysSpan = (start: string, end: string) => {
    const d1 = new Date(start);
    const d2 = new Date(end);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    return (
      Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)) + 1
    );
  };

  const formatHeure = (heure: string) => {
    return heure.slice(0, 5); // Format HH:MM
  };

  // Trier les événements par date
  const sortedEvenements = [...evenements].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Bouton de téléchargement */}
      <div className="flex justify-end">
        <Button
          onClick={generatePDF}
          disabled={isGeneratingPDF || evenements.length === 0}
          className="flex items-center gap-2 bg-black text-white hover:bg-gray-800 cursor-pointer"
        >
          {isGeneratingPDF ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Génération...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Télécharger en PDF
            </>
          )}
        </Button>
      </div>

      {/* Rapport professionnel */}
      <div
        id="rapport-programme"
        className="bg-white shadow-lg rounded-lg overflow-hidden pdf-generation"
      >
        {/* En-tête simple */}
        <div className="bg-gray-100 p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Programme des Événements
            </h1>
            <div className="text-gray-600">
              Document généré le {new Date().toLocaleDateString("fr-FR")}
            </div>
          </div>
        </div>

        {/* Liste des événements */}
        <div className="p-6">
          <h2 style={{ color: "#111827" }} className="text-2xl font-bold mb-6">
            Calendrier des Événements
          </h2>

          <div className="space-y-3">
            {sortedEvenements.map((evenement, index) => (
              <div
                key={evenement.id}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {evenement.dateDebut &&
                    evenement.dateFin &&
                    evenement.dateDebut !== evenement.dateFin ? (
                      <>
                        {formatDate(evenement.dateDebut)}
                        <span className="mx-1">→</span>
                        {formatDate(evenement.dateFin)}
                      </>
                    ) : (
                      formatDate(evenement.date)
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {evenement.nom ||
                      `Portes Ouvertes - ${evenement.lycee.nom}`}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">
                      {formatHeure(evenement.heureDebut)}
                    </span>
                    {evenement.dateDebut &&
                      evenement.dateFin &&
                      evenement.dateDebut !== evenement.dateFin && (
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 text-xs border border-blue-300 text-blue-800 rounded">
                            {formatDateShort(evenement.dateDebut)} →{" "}
                            {formatDateShort(evenement.dateFin)}
                          </span>
                          <span className="px-2 py-0.5 text-xs border border-purple-300 text-purple-800 rounded">
                            {daysSpan(evenement.dateDebut, evenement.dateFin)}{" "}
                            jours
                          </span>
                        </div>
                      )}
                    <span className="text-gray-500">-</span>
                    <span className="font-medium">
                      {formatHeure(evenement.heureFin)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{evenement.lycee.nom}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pied de page */}
        <div className="bg-gray-100 p-6">
          <div className="mt-6 border-t border-gray-300 pt-6">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800">
                ATLANTIS EVENTS SARL
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
