"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  MapPin,
  Users,
  Mail,
  Phone,
  Clock,
  GraduationCap,
  Building2,
  Star,
} from "lucide-react";
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
            Portes Ouvertes
            <span className="text-blue-600 block animate-fadeInUp animate-delay-100">
              pour l'Orientation
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-3xl mx-auto px-4 animate-fadeInUp animate-delay-200">
            ATLANTIS EVENTS en partenariat avec l'AMCOPE vous invite à découvrir
            les opportunités de formation d’excellence offertes par les
            instituts et écoles supérieures.
          </p>

          {/* Compte à rebours dynamique */}
          <div className="mb-8 md:mb-12 animate-fadeInUp animate-delay-300 max-w-2xl mx-auto">
            <CompteARebours />
          </div>

          {/* Call-to-action */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4 animate-fadeInUp animate-delay-400">
            <Link href="/programme">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto button-animate"
              >
                <CalendarDays className="mr-2 h-5 w-5 text-amber-50" />
                <span className="text-amber-50">Voir le programme</span>
              </Button>
            </Link>
            <Link href="/inscription">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto button-animate hover-lift"
              >
                <Users className="mr-2 h-5 w-5 text-amber-50" />
                <span className="text-amber-50">S'inscrire</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Organisateurs */}
      <section className="py-0 md:py-0 bg-white">
        <div className="py-4 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Organisateurs
              </h2>
              <p className="text-lg text-gray-600">
                Un partenariat pour l'avenir des jeunes
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* ATLANTIS EVENTS */}
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                    <Building2 size={40} className="text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  ATLANTIS EVENTS
                </h3>
                <p className="text-gray-600 mb-4">
                  Société organisatrice d'événements spécialisée dans
                  l'orientation et la formation
                </p>
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Organisateur principal
                </div>
              </div>

              {/* AMCOPE */}
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center">
                    <GraduationCap size={40} className="text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  AMCOPE
                </h3>
                <p className="text-gray-600 mb-4">
                  Association Marocaine des Cadres d'Orientation et de
                  Planification de l'Education
                </p>
                <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Partenaire officiel
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Informations clés */}
      <section className="pt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi participer ?
            </h2>
            <p className="text-lg text-gray-600">
              Une opportunité unique pour faire les bons choix d'orientation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Rencontrez les Experts
              </h3>
              <p className="text-gray-600">
                Échangez directement avec les représentants des meilleures
                écoles et instituts de formation
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Conseils Personnalisés
              </h3>
              <p className="text-gray-600">
                Bénéficiez de conseils d'orientation adaptés à votre profil et à
                vos aspirations
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap size={32} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Découvrez les Métiers
              </h3>
              <p className="text-gray-600">
                Explorez les différentes filières et débouchés professionnels
                dans tous les domaines
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partenaires */}
      <PartenairesList />
    </Layout>
  );
}
