"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Users, Mail, Phone, Clock } from "lucide-react";
import Link from "next/link";
import Layout from "@/components/layout/Layout";
import CompteARebours from "@/components/compte-a-rebours/CompteARebours";
import PartenairesList from "@/components/partenaires/PartenairesList";

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-4 md:mb-6 animate-fadeInUp">
            Tour de Portes Ouvertes
            <span className="text-blue-600 block animate-fadeInUp animate-delay-100">pour l'Orientation</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-3xl mx-auto px-4 animate-fadeInUp animate-delay-200">
            ATLANTIS EVENTS en partenariat avec l'AMCOPE Tanger-Asilah vous invite à découvrir les opportunités de formation dans les lycées de Tanger.
          </p>
          
          {/* Compte à rebours dynamique */}
          <div className="mb-8 md:mb-12 animate-fadeInUp animate-delay-300 max-w-2xl mx-auto">
            <CompteARebours />
          </div>

          {/* Call-to-action */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4 animate-fadeInUp animate-delay-400">
            <Link href="/programme">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto button-animate">
                <CalendarDays className="mr-2 h-5 w-5" />
                Voir le programme
              </Button>
            </Link>
            <Link href="/inscription">
              <Button variant="outline" size="lg" className="w-full sm:w-auto button-animate hover-lift">
                <Users className="mr-2 h-5 w-5" />
                S'inscrire
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Organisateurs */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12 animate-fadeIn">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Organisateurs</h2>
            <p className="text-base md:text-lg text-gray-600">Un partenariat au service de l'orientation des jeunes</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <Card className="text-center card-animate hover-lift">
              <CardHeader>
                <div className="w-16 h-16 md:w-24 md:h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4 animate-pulse-gentle">
                  <span className="text-xl md:text-2xl font-bold text-blue-600">AE</span>
                </div>
                <CardTitle className="text-lg md:text-xl">ATLANTIS EVENTS</CardTitle>
                <CardDescription className="text-sm md:text-base">Société organisatrice d'événements spécialisée dans l'orientation et la formation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap justify-center gap-1 md:gap-2">
                  <Badge variant="secondary" className="text-xs badge-animate">Événements</Badge>
                  <Badge variant="secondary" className="text-xs badge-animate animate-delay-100">Formation</Badge>
                  <Badge variant="secondary" className="text-xs badge-animate animate-delay-200">Orientation</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center card-animate hover-lift">
              <CardHeader>
                <div className="w-16 h-16 md:w-24 md:h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4 animate-pulse-gentle">
                  <span className="text-xl md:text-2xl font-bold text-green-600">AM</span>
                </div>
                <CardTitle className="text-lg md:text-xl">AMCOPE Tanger-Asilah</CardTitle>
                <CardDescription className="text-sm md:text-base">Association pour la promotion de l'enseignement et de la culture</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap justify-center gap-1 md:gap-2">
                  <Badge variant="secondary" className="text-xs badge-animate">Éducation</Badge>
                  <Badge variant="secondary" className="text-xs badge-animate animate-delay-100">Culture</Badge>
                  <Badge variant="secondary" className="text-xs badge-animate animate-delay-200">Développement</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Informations clés */}
      <section className="py-12 md:py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12 animate-fadeIn">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Pourquoi participer ?</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <Card className="card-animate hover-lift">
              <CardHeader className="text-center">
                <MapPin className="h-10 w-10 md:h-12 md:w-12 text-blue-600 mb-4 mx-auto animate-bounce-gentle" />
                <CardTitle className="text-base md:text-lg">Découverte des établissements</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm md:text-base text-gray-600 text-center">
                  Visitez les plus prestigieux lycées de Tanger et découvrez leurs infrastructures et programmes.
                </p>
              </CardContent>
            </Card>

            <Card className="card-animate hover-lift">
              <CardHeader className="text-center">
                <Users className="h-10 w-10 md:h-12 md:w-12 text-blue-600 mb-4 mx-auto animate-bounce-gentle animate-delay-100" />
                <CardTitle className="text-base md:text-lg">Rencontre avec les experts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm md:text-base text-gray-600 text-center">
                  Échangez directement avec les représentants des instituts et écoles de formation.
                </p>
              </CardContent>
            </Card>

            <Card className="card-animate hover-lift">
              <CardHeader className="text-center">
                <Clock className="h-10 w-10 md:h-12 md:w-12 text-blue-600 mb-4 mx-auto animate-bounce-gentle animate-delay-200" />
                <CardTitle className="text-base md:text-lg">Orientation personnalisée</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm md:text-base text-gray-600 text-center">
                  Bénéficiez de conseils d'orientation adaptés à votre profil et vos aspirations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Partenaires */}
      <PartenairesList />
    </Layout>
  );
}