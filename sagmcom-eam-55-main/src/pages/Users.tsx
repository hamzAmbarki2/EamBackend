import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminHeader } from "@/components/AdminHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  MoreHorizontal,
  UserCheck,
  UserX,
  Mail,
  Phone
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { UserForm } from "@/components/forms/UserForm";
import { UserDetailModal } from "@/components/forms/UserDetailModal";
import { DeleteConfirmationDialog } from "@/components/forms/DeleteConfirmationDialog";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { api } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  cin: string;
  role: string;
  department: string;
  status: "active" | "inactive" | "pending";
  lastLogin: string;
  createdAt: string;
  avatar?: string;
}

const initialUsers: User[] = [
  {
    id: "1",
    name: "Marie Dubois",
    email: "marie.dubois@sagemcom.com",
    phone: "+33 1 23 45 67 89",
    cin: "12345678",
    role: "Chef Opérateur",
    department: "Production",
    status: "active",
    lastLogin: "Il y a 5 min",
    createdAt: "15/01/2024"
  },
  {
    id: "2",
    name: "Pierre Martin",
    email: "pierre.martin@sagemcom.com",
    phone: "+33 1 23 45 67 90",
    cin: "23456789",
    role: "Chef Technicien",
    department: "Maintenance",
    status: "active",
    lastLogin: "Il y a 12 min",
    createdAt: "20/12/2023"
  },
  {
    id: "3",
    name: "Sophie Leroy",
    email: "sophie.leroy@sagemcom.com",
    phone: "+33 1 23 45 67 91",
    cin: "34567890",
    role: "Technicien",
    department: "Maintenance",
    status: "active",
    lastLogin: "Il y a 1h",
    createdAt: "05/02/2024"
  },
  {
    id: "4",
    name: "Jean Dupont",
    email: "jean.dupont@sagemcom.com",
    phone: "+33 1 23 45 67 92",
    cin: "45678901",
    role: "Technicien",
    department: "Production",
    status: "inactive",
    lastLogin: "Il y a 2 jours",
    createdAt: "10/11/2023"
  },
  {
    id: "5",
    name: "Isabelle Moreau",
    email: "isabelle.moreau@sagemcom.com",
    phone: "+33 1 23 45 67 93",
    cin: "56789012",
    role: "Administrateur",
    department: "IT",
    status: "pending",
    lastLogin: "Jamais",
    createdAt: "22/01/2024"
  },
  {
    id: "6",
    name: "Thomas Bernard",
    email: "thomas.bernard@sagemcom.com",
    phone: "+33 1 23 45 67 94",
    cin: "67890123",
    role: "Opérateur",
    department: "Production",
    status: "active",
    lastLogin: "Il y a 2h",
    createdAt: "08/03/2024"
  }
];

const getRoleColor = (role: string) => {
  switch (role) {
    case "Administrateur": return "bg-red-500/20 text-red-400 border-red-500/30";
    case "Chef Opérateur": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "Chef Technicien": return "bg-green-500/20 text-green-400 border-green-500/30";
    case "Technicien": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "Opérateur": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-green-500/20 text-green-400 border-green-500/30";
    case "inactive": return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    case "pending": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

const UsersPage = () => {
  const [sidebarSize, setSidebarSize] = useState<"mini" | "compact" | "normal" | "wide">("normal");
  
  const handleSidebarSizeChange = (direction: "prev" | "next" | "collapse" | "expand") => {
    const sizes = ["mini", "compact", "normal", "wide"] as const;
    const currentIndex = sizes.indexOf(sidebarSize);
    
    if (direction === "next" && currentIndex < sizes.length - 1) {
      setSidebarSize(sizes[currentIndex + 1]);
    } else if (direction === "prev" && currentIndex > 0) {
      setSidebarSize(sizes[currentIndex - 1]);
    } else if (direction === "collapse") {
      setSidebarSize("mini");
    } else if (direction === "expand") {
      setSidebarSize("normal");
    }
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [users, setUsers] = useState<User[]>(initialUsers);
  // Load users from backend on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await api.users.list();
        const mapped: User[] = (data || []).map((u: any) => ({
          id: String(u.id),
          name: u.name || "",
          email: u.email,
          phone: u.phone || "",
          cin: u.cin || u.CIN || "",
          role: u.role || "Technicien",
          department: u.department || "Maintenance",
          status: (u.status || "ACTIVE").toString().toLowerCase(),
          lastLogin: u.lastLogin ? new Date(u.lastLogin).toLocaleString("fr-FR") : "Jamais",
          createdAt: u.createdAt ? new Date(u.createdAt).toLocaleDateString("fr-FR") : "",
          avatar: u.avatar,
        }));
        if (mapped.length) setUsers(mapped);
      } catch (_) {
        // fallback to mock
      }
    })();
  }, []);
  
  // Modal states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // CRUD operations
  const handleCreateUser = async (userData: User) => {
    setIsLoading(true);
    try {
      const payload: any = {
        email: userData.email,
        password: userData.status === "pending" ? "changeme123" : "changeme123",
        role: userData.role?.toUpperCase().replace(" ", "") || "TECHNICIEN",
        phone: userData.phone,
        CIN: userData.cin,
        department: userData.department?.toUpperCase(),
        status: userData.status?.toUpperCase(),
        avatar: userData.avatar,
        name: userData.name,
      };
      const created = await api.users.create(payload);
      const mapped: User = {
        id: String(created.id),
        name: created.name || "",
        email: created.email,
        phone: created.phone || "",
        cin: created.cin || created.CIN || "",
        role: created.role || "Technicien",
        department: created.department || "Maintenance",
        status: (created.status || "ACTIVE").toString().toLowerCase(),
        lastLogin: created.lastLogin ? new Date(created.lastLogin).toLocaleString("fr-FR") : "Jamais",
        createdAt: created.createdAt ? new Date(created.createdAt).toLocaleDateString("fr-FR") : new Date().toLocaleDateString('fr-FR'),
        avatar: created.avatar,
      };
      setUsers([...users, mapped]);
      setIsCreateDialogOpen(false);
      toast({
        title: "Utilisateur créé",
        description: `L'utilisateur ${userData.name} a été créé avec succès.`
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'utilisateur.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = async (userData: User) => {
    setIsLoading(true);
    try {
      const payload: any = {
        id: Number(userData.id),
        email: userData.email,
        role: userData.role?.toUpperCase().replace(" ", ""),
        phone: userData.phone,
        CIN: userData.cin,
        department: userData.department?.toUpperCase(),
        status: userData.status?.toUpperCase(),
        avatar: userData.avatar,
        name: userData.name,
      };
      const updated = await api.users.update(payload);
      const mapped: User = {
        id: String(updated.id),
        name: updated.name || "",
        email: updated.email,
        phone: updated.phone || "",
        cin: updated.cin || updated.CIN || "",
        role: updated.role || "Technicien",
        department: updated.department || "Maintenance",
        status: (updated.status || "ACTIVE").toString().toLowerCase(),
        lastLogin: updated.lastLogin ? new Date(updated.lastLogin).toLocaleString("fr-FR") : "Jamais",
        createdAt: updated.createdAt ? new Date(updated.createdAt).toLocaleDateString("fr-FR") : userData.createdAt,
        avatar: updated.avatar,
      };
      setUsers(users.map(user => user.id === userData.id ? mapped : user));
      setIsEditDialogOpen(false);
      setSelectedUser(null);
      toast({
        title: "Utilisateur modifié",
        description: `L'utilisateur ${userData.name} a été modifié avec succès.`
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification de l'utilisateur.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    setIsLoading(true);
    try {
      await api.users.remove(Number(selectedUser.id));
      setUsers(users.filter(user => user.id !== selectedUser.id));
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      toast({
        title: "Utilisateur supprimé",
        description: `L'utilisateur ${selectedUser.name} a été supprimé avec succès.`
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'utilisateur.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleUserStatus = async (user: User) => {
    try {
      const newStatus = user.status === "active" ? "inactive" : "active";
      const updatedUser = { ...user, status: newStatus as "active" | "inactive" | "pending" };
      setUsers(users.map(u => u.id === user.id ? updatedUser : u));
      await api.users.update({ id: Number(user.id), status: newStatus.toUpperCase() });
      toast({
        title: "Statut modifié",
        description: `L'utilisateur ${user.name} est maintenant ${newStatus === "active" ? "actif" : "inactif"}.`
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification du statut.",
        variant: "destructive"
      });
    }
  };

  const stats = [
    { title: "Total Utilisateurs", value: users.length, color: "blue" },
    { title: "Actifs", value: users.filter(u => u.status === "active").length, color: "green" },
    { title: "Inactifs", value: users.filter(u => u.status === "inactive").length, color: "gray" },
    { title: "En attente", value: users.filter(u => u.status === "pending").length, color: "yellow" }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <AdminSidebar sidebarSize={sidebarSize} />
      
      <div className={`transition-all duration-300 ${
        sidebarSize === "mini" ? "ml-16" : 
        sidebarSize === "compact" ? "ml-48" : 
        sidebarSize === "normal" ? "ml-64" : "ml-80"
      }`}>
        <AdminHeader 
          onSidebarSizeChange={handleSidebarSizeChange}
          sidebarSize={sidebarSize}
        />
        
        <main className="pt-16 p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Gestion des Utilisateurs
                </h1>
                <p className="text-white/70">
                  Gérez les comptes utilisateurs et leurs permissions
                </p>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/80">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvel utilisateur
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-white/20 max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-white">Nouvel utilisateur</DialogTitle>
                    <DialogDescription className="text-white/70">
                      Créer un nouveau compte utilisateur dans le système.
                    </DialogDescription>
                  </DialogHeader>
                  <UserForm
                    onSubmit={handleCreateUser}
                    onCancel={() => setIsCreateDialogOpen(false)}
                    isLoading={isLoading}
                    existingUsers={users}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm font-medium">{stat.title}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        stat.color === "blue" ? "bg-blue-500/20" :
                        stat.color === "green" ? "bg-green-500/20" :
                        stat.color === "gray" ? "bg-gray-500/20" :
                        "bg-yellow-500/20"
                      }`}>
                        <Users className={`h-6 w-6 ${
                          stat.color === "blue" ? "text-blue-400" :
                          stat.color === "green" ? "text-green-400" :
                          stat.color === "gray" ? "text-gray-400" :
                          "text-yellow-400"
                        }`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main Content */}
            <Card className="glass-card">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Users className="h-5 w-5" />
                    <span>Liste des utilisateurs</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                      <Download className="h-4 w-4 mr-2" />
                      Exporter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                    <Input
                      placeholder="Rechercher par nom, email ou département..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Filtrer par rôle" />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/20">
                      <SelectItem value="all" className="text-white hover:bg-white/10">Tous les rôles</SelectItem>
                      <SelectItem value="Administrateur" className="text-white hover:bg-white/10">Administrateur</SelectItem>
                      <SelectItem value="Chef Opérateur" className="text-white hover:bg-white/10">Chef Opérateur</SelectItem>
                      <SelectItem value="Chef Technicien" className="text-white hover:bg-white/10">Chef Technicien</SelectItem>
                      <SelectItem value="Technicien" className="text-white hover:bg-white/10">Technicien</SelectItem>
                      <SelectItem value="Opérateur" className="text-white hover:bg-white/10">Opérateur</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/20">
                      <SelectItem value="all" className="text-white hover:bg-white/10">Tous les statuts</SelectItem>
                      <SelectItem value="active" className="text-white hover:bg-white/10">Actif</SelectItem>
                      <SelectItem value="inactive" className="text-white hover:bg-white/10">Inactif</SelectItem>
                      <SelectItem value="pending" className="text-white hover:bg-white/10">En attente</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>

                {/* Table */}
                <div className="rounded-lg overflow-hidden bg-white/5 backdrop-blur-sm">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-white/10 hover:bg-white/5">
                        <TableHead className="text-white/80 font-medium">Utilisateur</TableHead>
                        <TableHead className="text-white/80 font-medium">Contact</TableHead>
                        <TableHead className="text-white/80 font-medium">CIN</TableHead>
                        <TableHead className="text-white/80 font-medium">Rôle</TableHead>
                        <TableHead className="text-white/80 font-medium">Département</TableHead>
                        <TableHead className="text-white/80 font-medium">Statut</TableHead>
                        <TableHead className="text-white/80 font-medium">Dernière connexion</TableHead>
                        <TableHead className="text-white/80 font-medium text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id} className="border-b border-white/5 hover:bg-white/5">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                  {user.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-white">{user.name}</div>
                                <div className="text-sm text-white/60">#{user.id}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2 text-white/80">
                                <Mail className="h-3 w-3" />
                                <span className="text-sm">{user.email}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-white/60">
                                <Phone className="h-3 w-3" />
                                <span className="text-sm">{user.phone}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-white/80 font-mono">{user.cin}</span>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn("border", getRoleColor(user.role))}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-white/80">{user.department}</span>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn("border", getStatusColor(user.status))}>
                              {user.status === "active" ? "Actif" : 
                               user.status === "inactive" ? "Inactif" : "En attente"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white/80">{user.lastLogin}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="glass border-white/20">
                                <DropdownMenuLabel className="text-white">Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-white/20" />
                                <DropdownMenuItem 
                                  className="text-white hover:bg-white/10"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setIsDetailModalOpen(true);
                                  }}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  Voir profil
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-white hover:bg-white/10"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setIsEditDialogOpen(true);
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Modifier
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-white hover:bg-white/10"
                                  onClick={() => handleToggleUserStatus(user)}
                                >
                                  {user.status === "active" ? (
                                    <>
                                      <UserX className="mr-2 h-4 w-4" />
                                      Désactiver
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck className="mr-2 h-4 w-4" />
                                      Activer
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-white/20" />
                                <DropdownMenuItem 
                                  className="text-red-400 hover:bg-red-500/10"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Results count */}
                <div className="flex items-center justify-between mt-4 text-sm text-white/60">
                  <span>
                    Affichage de {filteredUsers.length} sur {users.length} utilisateurs
                  </span>
                  <div className="flex items-center space-x-2">
                    <span>Lignes par page: 10</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="glass border-white/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Modifier l'utilisateur</DialogTitle>
            <DialogDescription className="text-white/70">
              Modifier les informations de l'utilisateur.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <UserForm
              user={selectedUser}
              onSubmit={handleEditUser}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedUser(null);
              }}
              isLoading={isLoading}
              existingUsers={users}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* User Detail Modal */}
      <UserDetailModal
        user={selectedUser}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedUser(null);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleDeleteUser}
        title="Supprimer l'utilisateur"
        description="Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
        itemName={selectedUser?.name || ""}
        isLoading={isLoading}
      />
    </div>
  );
};

export default UsersPage;