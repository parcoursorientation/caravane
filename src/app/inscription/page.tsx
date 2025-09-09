"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/layout/Layout";
import {
  CalendarDays,
  Clock,
  MapPin,
  Building,
  User,
  Mail,
  Phone,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface Evenement {
  id: string;
  nom?: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  lycee: {
    id: string;
    nom: string;
    adresse: string;
  };
}

interface FormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  typeParticipant: string;
  etablissement: string;
  niveau: string;
  branche: string;
  interets: string;
  message: string;
  accepteConditions: boolean;
  souhaiteNewsletter: boolean;
}

function InscriptionContent() {
  const searchParams = useSearchParams();
  const evenementId = searchParams.get("evenement");

  const [evenement, setEvenement] = useState<Evenement | null>(null);
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    typeParticipant: "",
    etablissement: "",
    niveau: "",
    branche: "",
    interets: "",
    message: "",
    accepteConditions: false,
    souhaiteNewsletter: false,
  });

  const [selectedEvenementName, setSelectedEvenementName] =
    useState<string>("");
  const [selectedEvenementId, setSelectedEvenementId] = useState<string>(
    evenementId || ""
  );

  useEffect(() => {
    fetchEvenements();
    if (evenementId) {
      fetchEvenement();
    }
  }, [evenementId]);

  const fetchEvenements = async () => {
    try {
      const response = await fetch("/api/evenements-public");
      if (response.ok) {
        const data = await response.json();
        const list: Evenement[] = data.data;
        setEvenements(list);
        // Pré-sélectionne le nom si un ID est dans l'URL
        if (evenementId) {
          const evt = list.find((e) => e.id === evenementId);
          if (evt) setSelectedEvenementName(evt.nom || "Portes Ouvertes");
        }
      } else {
        setError("Erreur lors du chargement des événements");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des événements:", error);
      setError("Erreur lors du chargement des événements");
    } finally {
      setLoading(false);
    }
  };

  const fetchEvenement = async () => {
    try {
      const response = await fetch(`/api/evenements-public/${evenementId}`);
      if (response.ok) {
        const data = await response.json();
        setEvenement(data.data);
      } else {
        setError("Événement non trouvé");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'événement:", error);
      setError("Erreur lors du chargement de l'événement");
    }
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };

      // Réinitialiser la branche si le niveau change et n'est pas "2ème Bac"
      if (field === "niveau" && value !== "2eme-bac") {
        newData.branche = "";
      }

      return newData;
    });
  };

  const validateForm = () => {
    const requiredFields = [
      "nom",
      "prenom",
      "email",
      "telephone",
      "typeParticipant",
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof FormData]) {
        return `Le champ ${field} est requis`;
      }
    }

    if (!formData.accepteConditions) {
      return "Vous devez accepter les conditions d'utilisation";
    }

    if (!selectedEvenementId) {
      return "Vous devez sélectionner un événement";
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return "Format d'email invalide";
    }

    // Validation téléphone
    const phoneRegex = /^[0-9+\-\s()]{10,}$/;
    if (!phoneRegex.test(formData.telephone)) {
      return "Format de téléphone invalide";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/inscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          evenementId: selectedEvenementId,
          evenementNom: selectedEvenementName, // utile côté admin/email si besoin
        }),
      });

      if (response.ok) {
        setSuccess(true);
        // Reset form
        setFormData({
          nom: "",
          prenom: "",
          email: "",
          telephone: "",
          typeParticipant: "",
          etablissement: "",
          niveau: "",
          branche: "",
          interets: "",
          message: "",
          accepteConditions: false,
          souhaiteNewsletter: false,
        });
        setSelectedEvenementName("");
        setSelectedEvenementId("");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Erreur lors de l'inscription");
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      setError("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
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

  const formatHeure = (heure: string) => {
    return heure.slice(0, 5);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (success) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-16">
          <Card className="text-center">
            <CardContent className="pt-6">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Inscription confirmée !
              </h2>
              <p className="text-gray-600 mb-6">
                Votre inscription a été enregistrée avec succès. Vous recevrez
                un email de confirmation dans quelques minutes.
              </p>
              <div className="space-y-2">
                <Button
                  onClick={() => (window.location.href = "/programme")}
                  className="w-full"
                >
                  Retour au programme
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSuccess(false);
                    setFormData({
                      nom: "",
                      prenom: "",
                      email: "",
                      telephone: "",
                      typeParticipant: "",
                      etablissement: "",
                      niveau: "",
                      branche: "",
                      interets: "",
                      message: "",
                      accepteConditions: false,
                      souhaiteNewsletter: false,
                    });
                  }}
                  className="w-full"
                >
                  Nouvelle inscription
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-safe text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Inscription</h1>
          <p className="text-xl text-blue-100">
            {evenement
              ? `Inscrivez-vous à l'événement ${
                  evenement.nom || `Portes Ouvertes - ${evenement.lycee.nom}`
                }`
              : "Inscrivez-vous aux portes ouvertes"}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Informations événement */}
          {evenement && (
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    Détails de l'événement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">Événement</h4>
                    <p className="text-gray-600 text-sm">
                      {evenement.nom ||
                        `Portes Ouvertes - ${evenement.lycee.nom}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">
                      {formatDate(evenement.date)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span className="text-sm">
                      {formatHeure(evenement.heureDebut)} -{" "}
                      {formatHeure(evenement.heureFin)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">{evenement.lycee.nom}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-red-600" />
                    <span className="text-sm">{evenement.lycee.adresse}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Formulaire d'inscription */}
          <div className={evenement ? "lg:col-span-2" : "lg:col-span-3"}>
            <Card>
              <CardHeader>
                <CardTitle>Formulaire d'inscription</CardTitle>
                <CardDescription>
                  Remplissez ce formulaire pour vous inscrire. Les champs
                  marqués d'un * sont obligatoires.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert className="mb-6 border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Sélection d'événement */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      Sélection de l'événement
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="evenement">Événement *</Label>
                        <Select
                          value={selectedEvenementName}
                          onValueChange={(name) => {
                            setSelectedEvenementName(name);
                            // réinitialiser l'occurrence sélectionnée lorsque le nom change
                            setSelectedEvenementId("");
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choisissez un événement" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from(
                              new Map(
                                evenements.map((e) => [
                                  (e.nom || "Portes Ouvertes").trim(),
                                  (e.nom || "Portes Ouvertes").trim(),
                                ])
                              ).values()
                            ).map((name) => (
                              <SelectItem key={name} value={name}>
                                {name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="occurrence">Lycée et date *</Label>
                        <Select
                          value={selectedEvenementId}
                          onValueChange={setSelectedEvenementId}
                          disabled={!selectedEvenementName}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                selectedEvenementName
                                  ? "Choisissez le lycée et la date"
                                  : "D'abord sélectionner l'événement"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {evenements
                              .filter(
                                (e) =>
                                  (e.nom || "Portes Ouvertes").trim() ===
                                  selectedEvenementName
                              )
                              .map((evt) => (
                                <SelectItem key={evt.id} value={evt.id}>
                                  {`${evt.lycee.nom} — ${new Date(
                                    evt.date
                                  ).toLocaleDateString("fr-FR")} ${formatHeure(
                                    evt.heureDebut
                                  )}-${formatHeure(evt.heureFin)}`}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Affichage des détails de l'événement sélectionné */}
                      {selectedEvenementId &&
                        evenements.find(
                          (e) => e.id === selectedEvenementId
                        ) && (
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            {(() => {
                              const selectedEvent = evenements.find(
                                (e) => e.id === selectedEvenementId
                              );
                              return selectedEvent ? (
                                <div className="space-y-2">
                                  <h4 className="font-medium text-blue-900">
                                    {selectedEvenementName}
                                  </h4>
                                  <div className="flex items-center gap-4 text-sm text-blue-700">
                                    <div className="flex items-center gap-1">
                                      <CalendarDays className="h-4 w-4" />
                                      {new Date(
                                        selectedEvent.date
                                      ).toLocaleDateString("fr-FR", {
                                        weekday: "long",
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                      })}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-4 w-4" />
                                      {selectedEvent.heureDebut} -{" "}
                                      {selectedEvent.heureFin}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1 text-sm text-blue-700">
                                    <MapPin className="h-4 w-4" />
                                    {selectedEvent.lycee.nom} -{" "}
                                    {selectedEvent.lycee.adresse}
                                  </div>
                                </div>
                              ) : null;
                            })()}
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Informations personnelles */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      Informations personnelles
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="prenom">Prénom *</Label>
                        <Input
                          id="prenom"
                          value={formData.prenom}
                          onChange={(e) =>
                            handleInputChange("prenom", e.target.value)
                          }
                          placeholder="Votre prénom"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="nom">Nom *</Label>
                        <Input
                          id="nom"
                          value={formData.nom}
                          onChange={(e) =>
                            handleInputChange("nom", e.target.value)
                          }
                          placeholder="Votre nom"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          placeholder="votre.email@exemple.com"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="telephone">Téléphone *</Label>
                        <Input
                          id="telephone"
                          type="tel"
                          value={formData.telephone}
                          onChange={(e) =>
                            handleInputChange("telephone", e.target.value)
                          }
                          placeholder="06 12 34 56 78"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Type de participant */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Profil</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="typeParticipant">
                          Type de participant *
                        </Label>
                        <Select
                          value={formData.typeParticipant}
                          onValueChange={(value) =>
                            handleInputChange("typeParticipant", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez votre profil" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="eleve">Élève</SelectItem>
                            <SelectItem value="parent">Parent</SelectItem>
                            <SelectItem value="enseignant">
                              Enseignant
                            </SelectItem>
                            <SelectItem value="professionnel">
                              Professionnel de l'éducation
                            </SelectItem>
                            <SelectItem value="autre">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {(formData.typeParticipant === "eleve" ||
                        formData.typeParticipant === "parent") && (
                        <>
                          <div>
                            <Label htmlFor="etablissement">
                              Établissement actuel
                            </Label>
                            <Input
                              id="etablissement"
                              value={formData.etablissement}
                              onChange={(e) =>
                                handleInputChange(
                                  "etablissement",
                                  e.target.value
                                )
                              }
                              placeholder="Nom de votre établissement"
                            />
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="niveau">Niveau</Label>
                              <Select
                                value={formData.niveau}
                                onValueChange={(value) =>
                                  handleInputChange("niveau", value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Votre niveau" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="college">
                                    Collège
                                  </SelectItem>
                                  <SelectItem value="tronc-commun">
                                    Tronc commun
                                  </SelectItem>
                                  <SelectItem value="1er-bac">
                                    1er Bac
                                  </SelectItem>
                                  <SelectItem value="2eme-bac">
                                    2ème Bac
                                  </SelectItem>
                                  <SelectItem value="bac+1">Bac+1</SelectItem>
                                  <SelectItem value="bac+2">Bac+2</SelectItem>
                                  <SelectItem value="licence">
                                    Licence
                                  </SelectItem>
                                  <SelectItem value="master">Master</SelectItem>
                                  <SelectItem value="autres">Autres</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="branche">Filière/Branche</Label>
                              {formData.niveau === "2eme-bac" ? (
                                <Select
                                  value={formData.branche}
                                  onValueChange={(value) =>
                                    handleInputChange("branche", value)
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Choisissez votre filière" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="sciences-math-a">
                                      Sciences Math A
                                    </SelectItem>
                                    <SelectItem value="sciences-math-b">
                                      Sciences Math B
                                    </SelectItem>
                                    <SelectItem value="sciences-physique">
                                      Sciences Physique
                                    </SelectItem>
                                    <SelectItem value="stm">STM</SelectItem>
                                    <SelectItem value="ste">STE</SelectItem>
                                    <SelectItem value="g-economie">
                                      G.Économie
                                    </SelectItem>
                                    <SelectItem value="g-comptabilite">
                                      G.Comptabilité
                                    </SelectItem>
                                    <SelectItem value="svt">SVT</SelectItem>
                                    <SelectItem value="lettre">
                                      Lettre
                                    </SelectItem>
                                    <SelectItem value="sciences-humaines">
                                      Sciences Humaines
                                    </SelectItem>
                                    <SelectItem value="art-plastic">
                                      Art Plastic
                                    </SelectItem>
                                    <SelectItem value="bac-pro">
                                      Bac Pro
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Input
                                  id="branche"
                                  value={formData.branche}
                                  onChange={(e) =>
                                    handleInputChange("branche", e.target.value)
                                  }
                                  placeholder="Ex: Scientifique, Littéraire..."
                                />
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Centres d'intérêt */}
                  <div>
                    <Label htmlFor="interets">Centres d'intérêt</Label>
                    <Textarea
                      id="interets"
                      value={formData.interets}
                      onChange={(e) =>
                        handleInputChange("interets", e.target.value)
                      }
                      placeholder="Quels domaines vous intéressent le plus ? (Sciences, Littérature, Arts, Sport, etc.)"
                      rows={3}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <Label htmlFor="message">Message (optionnel)</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) =>
                        handleInputChange("message", e.target.value)
                      }
                      placeholder="Avez-vous des questions particulières ou des besoins spécifiques ?"
                      rows={3}
                    />
                  </div>

                  {/* Conditions */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="conditions"
                        checked={formData.accepteConditions}
                        onCheckedChange={(checked) =>
                          handleInputChange(
                            "accepteConditions",
                            checked as boolean
                          )
                        }
                      />
                      <Label htmlFor="conditions" className="text-sm leading-5">
                        J'accepte les conditions d'utilisation et la politique
                        de confidentialité *
                      </Label>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="newsletter"
                        checked={formData.souhaiteNewsletter}
                        onCheckedChange={(checked) =>
                          handleInputChange(
                            "souhaiteNewsletter",
                            checked as boolean
                          )
                        }
                      />
                      <Label htmlFor="newsletter" className="text-sm leading-5">
                        Je souhaite recevoir des informations sur les futurs
                        événements
                      </Label>
                    </div>
                  </div>

                  {/* Bouton de soumission */}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Inscription en cours...
                      </>
                    ) : (
                      "Confirmer mon inscription"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function InscriptionPage() {
  return (
    <Suspense
      fallback={
        <Layout>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </Layout>
      }
    >
      <InscriptionContent />
    </Suspense>
  );
}
