import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Search, 
  Filter, 
  Download, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  MoreHorizontal
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

interface TableUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "pending";
  lastLogin: string;
  avatar?: string;
}

const users: TableUser[] = [
  {
    id: "1",
    name: "Marie Dubois",
    email: "marie.dubois@sagemcom.com",
    role: "ChefOp",
    status: "active",
    lastLogin: "Il y a 5 min"
  },
  {
    id: "2",
    name: "Pierre Martin",
    email: "pierre.martin@sagemcom.com",
    role: "ChefTech",
    status: "active",
    lastLogin: "Il y a 12 min"
  },
  {
    id: "3",
    name: "Sophie Leroy",
    email: "sophie.leroy@sagemcom.com",
    role: "Technicien",
    status: "active",
    lastLogin: "Il y a 1h"
  },
  {
    id: "4",
    name: "Jean Dupont",
    email: "jean.dupont@sagemcom.com",
    role: "Technicien",
    status: "inactive",
    lastLogin: "Il y a 2 jours"
  },
  {
    id: "5",
    name: "Isabelle Moreau",
    email: "isabelle.moreau@sagemcom.com",
    role: "Admin",
    status: "pending",
    lastLogin: "Jamais"
  }
];

const getRoleColor = (role: string) => {
  switch (role) {
    case "Admin": return "bg-red-500/20 text-red-400 border-red-500/30";
    case "ChefOp": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "ChefTech": return "bg-green-500/20 text-green-400 border-green-500/30";
    case "Technicien": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
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

export function ManagementTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <Card className="glass-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-white">
            <Users className="h-5 w-5" />
            <span>Gestion des utilisateurs</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/80">
              <Plus className="h-4 w-4 mr-2" />
              Nouvel utilisateur
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
              placeholder="Rechercher un utilisateur..."
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
              <SelectItem value="Admin" className="text-white hover:bg-white/10">Admin</SelectItem>
              <SelectItem value="ChefOp" className="text-white hover:bg-white/10">ChefOp</SelectItem>
              <SelectItem value="ChefTech" className="text-white hover:bg-white/10">ChefTech</SelectItem>
              <SelectItem value="Technicien" className="text-white hover:bg-white/10">Technicien</SelectItem>
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
                <TableHead className="text-white/80 font-medium">Rôle</TableHead>
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
                      <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-white">{user.name}</div>
                        <div className="text-sm text-white/60">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("border", getRoleColor(user.role))}>
                      {user.role}
                    </Badge>
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
                        <DropdownMenuItem className="text-white hover:bg-white/10">
                          <Eye className="mr-2 h-4 w-4" />
                          Voir détails
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-white hover:bg-white/10">
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">
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
  );
}