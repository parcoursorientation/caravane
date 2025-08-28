"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Partenaire {
  id: string;
  nom: string;
  type: string;
  description?: string;
  logo?: string;
  siteWeb?: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  ville?: string;
  pays?: string;
  statut: string;
  ordre: number;
  createdAt: string;
  updatedAt: string;
}

export default function PartenairesList() {
  const [partenaires, setPartenaires] = useState<Partenaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPartenaires();
  }, []);

  const fetchPartenaires = async () => {
    try {
      const response = await fetch('/api/partenaires-public');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des partenaires');
      }
      const data = await response.json();
      setPartenaires(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Erreur lors du chargement des partenaires</p>
      </div>
    );
  }

  if (partenaires.length === 0) {
    return null; // Ne pas afficher la section s'il n'y a pas de partenaires
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'ORGANISATEUR': return 'Organisateur';
      case 'PARTENAIRE': return 'Partenaire';
      case 'SPONSOR': return 'Sponsor';
      case 'MEDIA': return 'Média';
      case 'INSTITUTION': return 'Institution';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ORGANISATEUR': return 'bg-blue-100 text-blue-800';
      case 'PARTENAIRE': return 'bg-green-100 text-green-800';
      case 'SPONSOR': return 'bg-purple-100 text-purple-800';
      case 'MEDIA': return 'bg-orange-100 text-orange-800';
      case 'INSTITUTION': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12 animate-fadeIn">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Nos Partenaires</h2>
          <p className="text-base md:text-lg text-gray-600">
            Découvrez nos partenaires qui contribuent au succès de cet événement
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {partenaires.map((partenaire, index) => (
            <Card 
              key={partenaire.id} 
              className="text-center card-animate hover-lift group"
            >
              <CardContent className="p-6">
                {/* Logo */}
                <div className="mb-4 flex justify-center">
                  {partenaire.logo ? (
                    <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center overflow-hidden p-2">
                      <img 
                        src={partenaire.logo} 
                        alt={partenaire.nom}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-blue-600">
                        {partenaire.nom.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Nom */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {partenaire.nom}
                </h3>
                
                {/* Type */}
                <Badge 
                  variant="secondary" 
                  className={`${getTypeColor(partenaire.type)} text-xs font-medium mb-3`}
                >
                  {getTypeLabel(partenaire.type)}
                </Badge>
                
                {/* Description si elle existe */}
                {partenaire.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {partenaire.description}
                  </p>
                )}
                
                {/* Site web si il existe */}
                {partenaire.siteWeb && (
                  <a 
                    href={partenaire.siteWeb} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 mt-2 inline-block"
                  >
                    Visiter le site →
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}