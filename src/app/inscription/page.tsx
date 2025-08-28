"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, CalendarDays, MapPin, Mail, Phone, Send, CheckCircle, AlertCircle } from "lucide-react";
import Layout from "@/components/layout/Layout";

interface FormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  evenementId: string;
  typeParticipant: string;
  etablissement: string;
  niveau: string;
  branche?: string;
  interets: string;
  message: string;
}

interface FormErrors {
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  evenementId?: string;
  typeParticipant?: string;
  branche?: string;
}

interface Evenement {
  id: string;
  nom?: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  lycee: {
    nom: string;
  };
  ville?: string;
}

export default function InscriptionPage() {
  const [formData, setFormData] = useState<FormData>({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    evenementId: "",
    typeParticipant: "",
    etablissement: "",
    niveau: "",
    branche: "",
    interets: "",
    message: ""
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [loadingEvenements, setLoadingEvenements] = useState(true);

  // Charger les événements au chargement de la page
  useEffect(() => {
    // Demander la permission pour les notifications
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    
    fetchEvenements();
  }, []);

  const fetchEvenements = async () => {
    try {
      const response = await fetch('/api/evenements-public');
      if (response.ok) {
        const data = await response.json();
        setEvenements(data.data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error);
    } finally {
      setLoadingEvenements(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est requis";
    }

    if (!formData.prenom.trim()) {
      newErrors.prenom = "Le prénom est requis";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
    }

    if (!formData.telephone.trim()) {
      newErrors.telephone = "Le téléphone est requis";
    } else if (!/^[+]?[\d\s-]{10,}$/.test(formData.telephone)) {
      newErrors.telephone = "Le numéro de téléphone n'est pas valide";
    }

    if (!formData.evenementId) {
      newErrors.evenementId = "Veuillez sélectionner un événement";
    }

    if (!formData.typeParticipant) {
      newErrors.typeParticipant = "Veuillez sélectionner votre type";
    }

    // Validation conditionnelle pour la branche si niveau est 2ème Bac
    if (formData.niveau === "2eme-bac" && !formData.branche) {
      newErrors.branche = "Veuillez sélectionner votre branche";
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
      const response = await fetch("/api/inscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          nom: "",
          prenom: "",
          email: "",
          telephone: "",
          evenementId: "",
          typeParticipant: "",
          etablissement: "",
          niveau: "",
          branche: "",
          interets: "",
          message: ""
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
    // Si le niveau change et n'est plus "2eme-bac", on vide le champ branche
    if (field === "niveau" && value !== "2eme-bac") {
      setFormData(prev => ({ ...prev, [field]: value, branche: "" }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatHeure = (heure: string) => {
    return heure.slice(0, 5);
  };

  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Inscription aux Portes Ouvertes</h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Réservez votre place pour découvrir les opportunités de formation dans les lycées de Tanger
          </p>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulaire d'inscription */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Formulaire d'inscription
                </CardTitle>
                <CardDescription>
                  Remplissez ce formulaire pour vous inscrire à l'événement de votre choix
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Status messages */}
                  {submitStatus === "success" && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <p className="text-green-800 text-sm">
                        Votre inscription a été enregistrée avec succès ! Vous recevrez un email de confirmation.
                      </p>
                    </div>
                  )}

                  {submitStatus === "error" && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <p className="text-red-800 text-sm">
                        Une erreur s'est produite. Veuillez réessayer plus tard.
                      </p>
                    </div>
                  )}

                  {/* Informations personnelles */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Informations personnelles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nom">Nom *</Label>
                        <Input
                          id="nom"
                          type="text"
                          value={formData.nom}
                          onChange={(e) => handleInputChange("nom", e.target.value)}
                          placeholder="Votre nom"
                          className={errors.nom ? "border-red-500" : ""}
                        />
                        {errors.nom && (
                          <p className="text-red-500 text-sm">{errors.nom}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="prenom">Prénom *</Label>
                        <Input
                          id="prenom"
                          type="text"
                          value={formData.prenom}
                          onChange={(e) => handleInputChange("prenom", e.target.value)}
                          placeholder="Votre prénom"
                          className={errors.prenom ? "border-red-500" : ""}
                        />
                        {errors.prenom && (
                          <p className="text-red-500 text-sm">{errors.prenom}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="votre@email.com"
                          className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm">{errors.email}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="telephone">Téléphone *</Label>
                        <Input
                          id="telephone"
                          type="tel"
                          value={formData.telephone}
                          onChange={(e) => handleInputChange("telephone", e.target.value)}
                          placeholder="+212 6XX-XXXXXX"
                          className={errors.telephone ? "border-red-500" : ""}
                        />
                        {errors.telephone && (
                          <p className="text-red-500 text-sm">{errors.telephone}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sélection de l'événement */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Sélection de l'événement</h3>
                    <div className="space-y-2">
                      <Label htmlFor="evenementId">Événement *</Label>
                      <Select value={formData.evenementId} onValueChange={(value) => handleInputChange("evenementId", value)}>
                        <SelectTrigger className={errors.evenementId ? "border-red-500" : ""}>
                          <SelectValue placeholder="Choisissez un événement" />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingEvenements ? (
                            <SelectItem value="loading" disabled>Chargement...</SelectItem>
                          ) : evenements.length === 0 ? (
                            <SelectItem value="none" disabled>Aucun événement disponible</SelectItem>
                          ) : (
                            evenements.map((evenement) => (
                              <SelectItem key={evenement.id} value={evenement.id}>
                                {formatDate(evenement.date)} - {formatHeure(evenement.heureDebut)}-{formatHeure(evenement.heureFin)} - {evenement.lycee.nom}
                                {evenement.ville && ` (${evenement.ville})`}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      {errors.evenementId && (
                        <p className="text-red-500 text-sm">{errors.evenementId}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="typeParticipant">Type de participant *</Label>
                      <Select value={formData.typeParticipant} onValueChange={(value) => handleInputChange("typeParticipant", value)}>
                        <SelectTrigger className={errors.typeParticipant ? "border-red-500" : ""}>
                          <SelectValue placeholder="Vous êtes..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="etudiant">Étudiant(e)</SelectItem>
                          <SelectItem value="parent">Parent d'élève</SelectItem>
                          <SelectItem value="enseignant">Enseignant(e)</SelectItem>
                          <SelectItem value="professionnel">Professionnel</SelectItem>
                          <SelectItem value="autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.typeParticipant && (
                        <p className="text-red-500 text-sm">{errors.typeParticipant}</p>
                      )}
                    </div>
                  </div>

                  {/* Informations complémentaires */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Informations complémentaires</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="etablissement">Établissement actuel</Label>
                        <Input
                          id="etablissement"
                          type="text"
                          value={formData.etablissement}
                          onChange={(e) => handleInputChange("etablissement", e.target.value)}
                          placeholder="Nom de votre établissement"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="niveau">Niveau d'études</Label>
                        <Select value={formData.niveau} onValueChange={(value) => handleInputChange("niveau", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Votre niveau" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="college">Collège</SelectItem>
                            <SelectItem value="tronc-commun">Tronc commun</SelectItem>
                            <SelectItem value="1er-bac">1er Bac</SelectItem>
                            <SelectItem value="2eme-bac">2ème Bac</SelectItem>
                            <SelectItem value="supérieur">Études supérieures</SelectItem>
                            <SelectItem value="professionnel">Formation professionnelle</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Champ branche conditionnel pour 2ème Bac */}
                      {formData.niveau === "2eme-bac" && (
                        <div className="space-y-2">
                          <Label htmlFor="branche">Branche *</Label>
                          <Select value={formData.branche} onValueChange={(value) => handleInputChange("branche", value)}>
                            <SelectTrigger className={errors.branche ? "border-red-500" : ""}>
                              <SelectValue placeholder="Choisissez votre branche" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sciences-math-A">Sciences math A</SelectItem>
                              <SelectItem value="sciences-math-B">Sciences math B</SelectItem>
                              <SelectItem value="sciences-physique">Sciences physique</SelectItem>
                              <SelectItem value="STM">STM</SelectItem>
                              <SelectItem value="STE">STE</SelectItem>
                              <SelectItem value="G-economie">G. économie</SelectItem>
                              <SelectItem value="G-comptabilite">G. comptabilité</SelectItem>
                              <SelectItem value="SVT">SVT</SelectItem>
                              <SelectItem value="Lettre">Lettre</SelectItem>
                              <SelectItem value="sciences-humaines">Sciences humaines</SelectItem>
                              <SelectItem value="art-plastic">Art plastic</SelectItem>
                              <SelectItem value="bac-pro">Bac pro</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.branche && (
                            <p className="text-red-500 text-sm">{errors.branche}</p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="interets">Centres d'intérêt</Label>
                      <Select value={formData.interets} onValueChange={(value) => handleInputChange("interets", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez vos centres d'intérêt" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sciences-sante">🔬 Sciences, santé et recherche</SelectItem>
                          <SelectItem value="sciences-humaines">🏛️ Sciences humaines, sociales et juridiques</SelectItem>
                          <SelectItem value="ingenierie-technologies">🏗️ Ingénierie, architecture et technologies</SelectItem>
                          <SelectItem value="arts-communication">🎨 Arts, lettres et communication</SelectItem>
                          <SelectItem value="sciences-appliquees">🌍 Sciences appliquées à la société</SelectItem>
                          <SelectItem value="etudes-etranger">✈️ Études à l'étranger</SelectItem>
                        </SelectContent>
                      </Select>
                      {formData.interets && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm">
                          <div className="font-medium mb-2">Détails de cette catégorie :</div>
                          {formData.interets === 'sciences-sante' && (
                            <div className="space-y-1 text-gray-600">
                              <div>• Médecine et soins de santé</div>
                              <div>• Pharmacie et biologie médicale</div>
                              <div>• Recherche scientifique (biologie, chimie, physique)</div>
                              <div>• Sciences de la vie et de la terre</div>
                              <div>• Psychologie et sciences cognitives</div>
                              <div>• Santé publique et prévention</div>
                            </div>
                          )}
                          {formData.interets === 'sciences-humaines' && (
                            <div className="space-y-1 text-gray-600">
                              <div>• Droit et sciences politiques</div>
                              <div>• Économie et gestion</div>
                              <div>• Sociologie, anthropologie</div>
                              <div>• Philosophie et éthique</div>
                              <div>• Histoire et géopolitique</div>
                              <div>• Éducation, pédagogie</div>
                            </div>
                          )}
                          {formData.interets === 'ingenierie-technologies' && (
                            <div className="space-y-1 text-gray-600">
                              <div>• Architecture et urbanisme</div>
                              <div>• Ingénierie (civile, mécanique, électrique, industrielle)</div>
                              <div>• Informatique et intelligence artificielle</div>
                              <div>• Robotique et électronique</div>
                              <div>• Sciences de l'environnement et développement durable</div>
                              <div>• Aéronautique et spatial</div>
                            </div>
                          )}
                          {formData.interets === 'arts-communication' && (
                            <div className="space-y-1 text-gray-600">
                              <div>• Littérature et écriture</div>
                              <div>• Arts plastiques, design, graphisme</div>
                              <div>• Cinéma, audiovisuel, multimédia</div>
                              <div>• Communication, journalisme</div>
                              <div>• Langues et cultures étrangères</div>
                              <div>• Mode et stylisme</div>
                            </div>
                          )}
                          {formData.interets === 'sciences-appliquees' && (
                            <div className="space-y-1 text-gray-600">
                              <div>• Commerce international et relations économiques</div>
                              <div>• Management, entrepreneuriat</div>
                              <div>• Tourisme, hôtellerie, restauration</div>
                              <div>• Sciences du sport et éducation physique</div>
                              <div>• Relations internationales, diplomatie</div>
                              <div>• Sciences environnementales et écologie</div>
                            </div>
                          )}
                          {formData.interets === 'etudes-etranger' && (
                            <div className="space-y-1 text-gray-600">
                              <div>• Programmes d'échange universitaire</div>
                              <div>• Bourses d'études internationales</div>
                              <div>• Formations diplômantes à l'étranger</div>
                              <div>• Langues étrangères appliquées</div>
                              <div>• Expériences culturelles internationales</div>
                              <div>• Carrières internationales et diplomatie</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message (optionnel)</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        placeholder="Questions spécifiques ou commentaires..."
                        rows={3}
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Inscription en cours...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        S'inscrire à l'événement
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Informations complémentaires */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pourquoi s'inscrire ?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Accès prioritaire</div>
                    <div className="text-gray-600 text-xs">
                      Les inscrits ont un accès prioritaire aux conférences et ateliers.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Documentation personnalisée</div>
                    <div className="text-gray-600 text-xs">
                      Recevez des informations adaptées à votre profil.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Rappels automatiques</div>
                    <div className="text-gray-600 text-xs">
                      Recevez des rappels avant l'événement.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Certificat de participation</div>
                    <div className="text-gray-600 text-xs">
                      Obtenez un certificat à la fin de l'événement.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Événements à venir</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingEvenements ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : evenements.length === 0 ? (
                  <p className="text-gray-600 text-sm text-center py-4">
                    Aucun événement à venir pour le moment.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {evenements.slice(0, 3).map((evenement) => (
                      <div key={evenement.id} className="border-l-4 border-blue-500 pl-3 py-2">
                        <div className="font-medium text-sm">{evenement.lycee.nom}</div>
                        <div className="text-gray-600 text-xs">
                          {formatDate(evenement.date)} - {formatHeure(evenement.heureDebut)}-{formatHeure(evenement.heureFin)}
                        </div>
                        {evenement.ville && (
                          <div className="text-gray-500 text-xs">{evenement.ville}</div>
                        )}
                      </div>
                    ))}
                    {evenements.length > 3 && (
                      <p className="text-gray-600 text-xs text-center mt-2">
                        Et {evenements.length - 3} autre{evenements.length - 3 > 1 ? 's' : ''} événement{evenements.length - 3 > 1 ? 's' : ''}...
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">info@atlantisevents.ma</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">+212 539-34-56-78</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}