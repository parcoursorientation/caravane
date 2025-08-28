"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  LogOut,
  Shield,
  User,
  Mail,
  Calendar,
  X
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ConfirmDialog, useConfirmDialog } from "@/components/ui/confirm-dialog";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "SUPER_ADMIN";
  createdAt: string;
  updatedAt: string;
}

export default function AdminUsers() {
  const { confirm, ConfirmDialog } = useConfirmDialog();
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "ADMIN" as "ADMIN" | "SUPER_ADMIN"
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
      loadUsers();
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      router.push("/admin/login");
    }
  }, [router]);

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/utilisateurs', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("adminToken")}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des utilisateurs');
      }

      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      } else {
        throw new Error(data.error || 'Erreur inconnue');
      }
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
      toast.error("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    router.push("/admin/login");
  };

  const handleDeleteUser = async (userId: string) => {
    const shouldDelete = await confirm({
      title: "Supprimer l'utilisateur",
      description: "Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.",
      confirmText: "Supprimer",
      cancelText: "Annuler",
      variant: "destructive",
      onConfirm: async () => {
        setDeletingId(userId);
        
        try {
          const response = await fetch(`/api/admin/utilisateurs/${userId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem("adminToken")}`
            }
          });

          const data = await response.json();

          if (data.success) {
            toast.success("Utilisateur supprimé avec succès");
            loadUsers(); // Recharger la liste
          } else {
            toast.error(data.error || "Erreur lors de la suppression");
          }
        } catch (error) {
          console.error("Erreur lors de la suppression:", error);
          toast.error("Erreur lors de la suppression de l'utilisateur");
        } finally {
          setDeletingId(null);
        }
      }
    });
  };

  const handleEditUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setEditingUser(user);
      setIsEditDialogOpen(true);
    }
  };

  const handleAddUser = () => {
    setIsAddDialogOpen(true);
  };

  const handleCreateUser = async () => {
    // Validation
    if (!newUser.name.trim() || !newUser.email.trim() || !newUser.password.trim()) {
      toast.error("Tous les champs sont requis");
      return;
    }

    // Validation du nom (pas de caractères spéciaux)
    const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    if (!nameRegex.test(newUser.name.trim())) {
      toast.error("Le nom contient des caractères invalides");
      return;
    }

    if (!newUser.email.includes('@')) {
      toast.error("Veuillez entrer une adresse email valide");
      return;
    }

    if (newUser.password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    setIsAddingUser(true);
    
    try {
      const response = await fetch('/api/admin/utilisateurs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("adminToken")}`
        },
        body: JSON.stringify(newUser)
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Utilisateur créé avec succès");
        setIsAddDialogOpen(false);
        // Réinitialiser le formulaire
        setNewUser({
          name: "",
          email: "",
          password: "",
          role: "ADMIN"
        });
        loadUsers(); // Recharger la liste
      } else {
        toast.error(data.error || "Erreur lors de la création de l'utilisateur");
      }
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      toast.error("Erreur lors de la création de l'utilisateur");
    } finally {
      setIsAddingUser(false);
    }
  };

  const resetForm = () => {
    setNewUser({
      name: "",
      email: "",
      password: "",
      role: "ADMIN"
    });
    setIsAddDialogOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setNewUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditInputChange = (field: string, value: string) => {
    if (editingUser) {
      setEditingUser(prev => ({
        ...prev!,
        [field]: value
      }));
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    // Validation
    if (!editingUser.name.trim() || !editingUser.email.trim()) {
      toast.error("Le nom et l'email sont requis");
      return;
    }

    // Validation du nom (pas de caractères spéciaux)
    const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    if (!nameRegex.test(editingUser.name.trim())) {
      toast.error("Le nom contient des caractères invalides");
      return;
    }

    if (!editingUser.email.includes('@')) {
      toast.error("Veuillez entrer une adresse email valide");
      return;
    }

    setIsEditingUser(true);
    
    try {
      const response = await fetch(`/api/admin/utilisateurs/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("adminToken")}`
        },
        body: JSON.stringify({
          name: editingUser.name,
          email: editingUser.email,
          role: editingUser.role
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Utilisateur mis à jour avec succès");
        setIsEditDialogOpen(false);
        setEditingUser(null);
        loadUsers(); // Recharger la liste
      } else {
        toast.error(data.error || "Erreur lors de la mise à jour de l'utilisateur");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error("Erreur lors de la mise à jour de l'utilisateur");
    } finally {
      setIsEditingUser(false);
    }
  };

  const resetEditForm = () => {
    setIsEditDialogOpen(false);
    setEditingUser(null);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Réinitialiser la pagination quand la recherche change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const getRoleBadgeColor = (role: string) => {
    return role === "SUPER_ADMIN" ? "default" : "secondary";
  };

  const getRoleLabel = (role: string) => {
    return role === "SUPER_ADMIN" ? "Super Admin" : "Admin";
  };

  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    if (!password) return { strength: 0, label: "", color: "" };
    
    let strength = 0;
    
    // Longueur
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    
    // Complexité
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength <= 2) return { strength, label: "Faible", color: "text-red-500" };
    if (strength <= 3) return { strength, label: "Moyen", color: "text-yellow-500" };
    if (strength <= 4) return { strength, label: "Bon", color: "text-blue-500" };
    return { strength, label: "Fort", color: "text-green-500" };
  };

  const generateStrongPassword = () => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let password = '';
    
    // Assurer au moins un caractère de chaque type
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Ajouter des caractères aléatoires pour atteindre 12 caractères
    const allChars = lowercase + uppercase + numbers + symbols;
    for (let i = 4; i < 12; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Mélanger le mot de passe
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    handleInputChange("password", password);
  };

  if (loading) {
    return (
      <Layout isAdmin>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des utilisateurs...</p>
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
            <h2 className="text-3xl font-bold text-gray-900">Gestion des utilisateurs</h2>
            <p className="text-gray-600 mt-2">
              Gérez les comptes administrateurs et leurs permissions.
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

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                Comptes administrateurs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Super Admins</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => u.role === "SUPER_ADMIN").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Accès complet
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => u.role === "ADMIN").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Accès limité
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Actifs</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.length} {/* Tous les utilisateurs sont considérés comme actifs */}
              </div>
              <p className="text-xs text-muted-foreground">
                Comptes actifs
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAddUser}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un utilisateur
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
                  <DialogDescription>
                    Créez un nouveau compte administrateur avec les informations ci-dessous.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Nom complet
                    </Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="col-span-3"
                      placeholder="Ex: Jean Dupont"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="col-span-3"
                      placeholder="ex: nom@domaine.com"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                      Mot de passe
                    </Label>
                    <div className="col-span-3 space-y-1">
                      <div className="relative">
                        <Input
                          id="password"
                          type="password"
                          value={newUser.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          className="col-span-3"
                          placeholder="Minimum 8 caractères"
                        />
                        {newUser.password && (
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs">
                            {newUser.password.length >= 8 ? (
                              <span className="text-green-600">✓</span>
                            ) : (
                              <span className="text-red-500">✗</span>
                            )}
                          </div>
                        )}
                      </div>
                      {newUser.password && (
                        <div className="text-xs">
                          Force: <span className={getPasswordStrength(newUser.password).color}>
                            {getPasswordStrength(newUser.password).label}
                          </span>
                        </div>
                      )}
                      <div className="text-xs">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={generateStrongPassword}
                          className="h-5 px-1 text-xs"
                        >
                          Générer un mot de passe fort
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      Rôle
                    </Label>
                    <Select value={newUser.role} onValueChange={(value) => handleInputChange("role", value)}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={resetForm}>
                    Annuler
                  </Button>
                  <Button onClick={handleCreateUser} disabled={isAddingUser}>
                    {isAddingUser ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : null}
                    Créer l'utilisateur
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {/* Modal d'édition d'utilisateur */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Modifier l'utilisateur</DialogTitle>
                  <DialogDescription>
                    Mettez à jour les informations de l'utilisateur ci-dessous.
                  </DialogDescription>
                </DialogHeader>
                {editingUser && (
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-name" className="text-right">
                        Nom
                      </Label>
                      <Input
                        id="edit-name"
                        value={editingUser.name}
                        onChange={(e) => handleEditInputChange("name", e.target.value)}
                        className="col-span-3"
                        placeholder="Nom complet"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-email" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="edit-email"
                        type="email"
                        value={editingUser.email}
                        onChange={(e) => handleEditInputChange("email", e.target.value)}
                        className="col-span-3"
                        placeholder="adresse@email.com"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-role" className="text-right">
                        Rôle
                      </Label>
                      <Select value={editingUser.role} onValueChange={(value) => handleEditInputChange("role", value)}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={resetEditForm}>
                    Annuler
                  </Button>
                  <Button onClick={handleUpdateUser} disabled={isEditingUser || !editingUser}>
                    {isEditingUser ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : null}
                    Mettre à jour
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" onClick={() => router.push('/admin')}>
              Retour au tableau de bord
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>

        {/* Tableau des utilisateurs */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des utilisateurs</CardTitle>
            <CardDescription>
              {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''} trouvé{filteredUsers.length > 1 ? 's' : ''} 
              {filteredUsers.length > usersPerPage && ` (Page ${currentPage} sur ${totalPages})`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">
                            Créé le {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeColor(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUser(user.id)}
                          disabled={deletingId === user.id}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={deletingId === user.id}
                        >
                          {deletingId === user.id ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600"></div>
                          ) : (
                            <Trash2 className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {currentUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {filteredUsers.length === 0 ? "Aucun utilisateur trouvé pour votre recherche." : "Aucun utilisateur sur cette page."}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Précédent
            </Button>
            
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                <Button
                  key={number}
                  variant={currentPage === number ? "default" : "outline"}
                  size="sm"
                  onClick={() => paginate(number)}
                  className="w-10 h-10"
                >
                  {number}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Suivant
            </Button>
          </div>
        )}
      </div>
      <ConfirmDialog />
    </Layout>
  );
}