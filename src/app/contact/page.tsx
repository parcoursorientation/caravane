"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Users,
} from "lucide-react";
import Layout from "@/components/layout/Layout";

interface FormData {
  nom: string;
  email: string;
  sujet: string;
  message: string;
  typeDemande: string;
}

interface FormErrors {
  nom?: string;
  email?: string;
  sujet?: string;
  message?: string;
  typeDemande?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    nom: "",
    email: "",
    sujet: "",
    message: "",
    typeDemande: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est requis";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
    }

    if (!formData.sujet.trim()) {
      newErrors.sujet = "Le sujet est requis";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Le message est requis";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Le message doit contenir au moins 10 caractères";
    }

    if (!formData.typeDemande) {
      newErrors.typeDemande = "Veuillez sélectionner un type de demande";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom: formData.nom,
          email: formData.email,
          message: `Sujet: ${formData.sujet}\n\nType: ${formData.typeDemande}\n\n${formData.message}`,
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          nom: "",
          email: "",
          sujet: "",
          message: "",
          typeDemande: "",
        });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const getTempsReponse = () => {
    const now = new Date();
    const jour = now.getDay();
    const heure = now.getHours();

    // Jours ouvrables: Lundi(1) à Vendredi(5)
    if (jour >= 1 && jour <= 5 && heure >= 9 && heure < 18) {
      return "moins d'une heure";
    } else if (jour >= 1 && jour <= 5) {
      return "le jour ouvrable suivant";
    } else {
      return "le lundi matin";
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-safe text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contactez-nous
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Une question sur l'événement ? Besoin d'informations ? Notre équipe
            est à votre disposition
          </p>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Formulaire de contact */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Envoyez-nous un message
                </CardTitle>
                <CardDescription>
                  Remplissez le formulaire ci-dessous et nous vous répondrons
                  dans les plus brefs délais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Status messages */}
                  {submitStatus === "success" && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <p className="text-green-800 text-sm">
                        Votre message a été envoyé avec succès ! Nous vous
                        répondrons {getTempsReponse()}.
                      </p>
                    </div>
                  )}

                  {submitStatus === "error" && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <p className="text-red-800 text-sm">
                        Une erreur s'est produite. Veuillez réessayer plus tard
                        ou nous contacter par téléphone.
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nom">Nom complet *</Label>
                      <Input
                        id="nom"
                        type="text"
                        value={formData.nom}
                        onChange={(e) =>
                          handleInputChange("nom", e.target.value)
                        }
                        placeholder="Votre nom et prénom"
                        className={errors.nom ? "border-red-500" : ""}
                      />
                      {errors.nom && (
                        <p className="text-red-500 text-sm">{errors.nom}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Adresse email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="votre@email.com"
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="typeDemande">Type de demande *</Label>
                      <Select
                        value={formData.typeDemande}
                        onValueChange={(value) =>
                          handleInputChange("typeDemande", value)
                        }
                      >
                        <SelectTrigger
                          className={errors.typeDemande ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="Sélectionnez..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="information">
                            Demande d'information
                          </SelectItem>
                          <SelectItem value="inscription">
                            Inscription exposant
                          </SelectItem>
                          <SelectItem value="partenariat">
                            Partenariat
                          </SelectItem>
                          <SelectItem value="presse">Presse/Médias</SelectItem>
                          <SelectItem value="technique">
                            Problème technique
                          </SelectItem>
                          <SelectItem value="autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.typeDemande && (
                        <p className="text-red-500 text-sm">
                          {errors.typeDemande}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sujet">Sujet *</Label>
                      <Input
                        id="sujet"
                        type="text"
                        value={formData.sujet}
                        onChange={(e) =>
                          handleInputChange("sujet", e.target.value)
                        }
                        placeholder="Sujet de votre message"
                        className={errors.sujet ? "border-red-500" : ""}
                      />
                      {errors.sujet && (
                        <p className="text-red-500 text-sm">{errors.sujet}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) =>
                        handleInputChange("message", e.target.value)
                      }
                      placeholder="Décrivez votre demande en détail..."
                      rows={6}
                      className={errors.message ? "border-red-500" : ""}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm">{errors.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Envoyer le message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Informations de contact */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations de contact</CardTitle>
                <CardDescription>
                  Retrouvez toutes les coordonnées d'ATLANTIS EVENTS
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-gray-600">info@atlantis-events.pro</div>
                    <div className="text-gray-600 text-sm">
                      contact@atlantis-events.pro
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Téléphone</div>
                    <div className="text-gray-600">+212 679-55-28-24</div>
                    <div className="text-gray-600 text-sm">
                      +212 628-47-31-53
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Adresse</div>
                    <div className="text-gray-600">
                      123, Avenue Mohammed VI
                      <br />
                      Tanger 90000, Maroc
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Horaires d'ouverture</div>
                    <div className="text-gray-600">
                      Lundi - Vendredi: 09:00 - 18:00
                      <br />
                      Samedi: 09:00 - 13:00
                    </div>
                    <div className="text-sm text-green-600 mt-1">
                      Temps de réponse estimé: {getTempsReponse()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informations utiles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Pour les exposants
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Vous souhaitez participer à l'événement en tant qu'exposant
                    ? Contactez-nous pour connaître les modalités et tarifs.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Pour les lycées
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Votre établissement souhaite accueillir une session de
                    portes ouvertes ? Nous serions ravis de collaborer avec
                    vous.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Temps de réponse
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Nous nous engageons à répondre à toutes vos demandes dans un
                    délai maximum de 48 heures ouvrées.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Questions fréquentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-1">
                    L'inscription est-elle gratuite ?
                  </h4>
                  <p className="text-gray-600 text-xs">
                    Oui, l'inscription aux portes ouvertes est totalement
                    gratuite pour les visiteurs.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-1">
                    Comment devenir exposant ?
                  </h4>
                  <p className="text-gray-600 text-xs">
                    Contactez-nous via le formulaire en sélectionnant
                    "Inscription exposant" ou par téléphone.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-1">
                    Les lycées sont-ils accessibles ?
                  </h4>
                  <p className="text-gray-600 text-xs">
                    Tous les lycées participants sont accessibles aux personnes
                    à mobilité réduite.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-1">
                    Puis-je visiter plusieurs lycées ?
                  </h4>
                  <p className="text-gray-600 text-xs">
                    Oui, vous pouvez vous inscrire à plusieurs événements dans
                    différents lycées.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Suivez-nous</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  Restez informé des dernières actualités et événements en nous
                  suivant sur les réseaux sociaux.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    Facebook
                  </Button>
                  <Button variant="outline" size="sm">
                    Instagram
                  </Button>
                  <Button variant="outline" size="sm">
                    LinkedIn
                  </Button>
                  <Button variant="outline" size="sm">
                    Twitter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
