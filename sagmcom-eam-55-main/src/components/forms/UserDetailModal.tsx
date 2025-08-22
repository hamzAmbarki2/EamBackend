import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, Calendar, MapPin, Shield, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: "active" | "inactive" | "pending";
  lastLogin: string;
  createdAt: string;
  avatar?: string;
}

interface UserDetailModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

const getRoleColor = (role: string) => {
  switch (role) {
    case "Administrateur": return "bg-red-500/20 text-red-400 border-red-500/30";
    case "Chef Opérateur": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "Chef Technicien": return "bg-green-500/20 text-green-400 border-green-500/30";
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

const getStatusLabel = (status: string) => {
  switch (status) {
    case "active": return "Actif";
    case "inactive": return "Inactif";
    case "pending": return "En attente";
    default: return status;
  }
};

export const UserDetailModal = ({ user, isOpen, onClose }: UserDetailModalProps) => {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="glass border-white/20 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Profil utilisateur</DialogTitle>
          <DialogDescription className="text-white/70">
            Détails complets de l'utilisateur
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header avec avatar et informations principales */}
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-2xl font-bold text-white">{user.name}</h3>
                  <div className="flex items-center space-x-4">
                    <Badge className={cn("border", getRoleColor(user.role))}>
                      {user.role}
                    </Badge>
                    <Badge className={cn("border", getStatusColor(user.status))}>
                      {getStatusLabel(user.status)}
                    </Badge>
                  </div>
                  <p className="text-white/70">ID: #{user.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations de contact */}
          <Card className="glass-card">
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Informations de contact
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-white/60" />
                  <div>
                    <p className="text-white/60 text-sm">Email</p>
                    <p className="text-white">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-white/60" />
                  <div>
                    <p className="text-white/60 text-sm">Téléphone</p>
                    <p className="text-white">{user.phone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations professionnelles */}
          <Card className="glass-card">
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Informations professionnelles
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-white/60" />
                  <div>
                    <p className="text-white/60 text-sm">Rôle</p>
                    <p className="text-white">{user.role}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-white/60" />
                  <div>
                    <p className="text-white/60 text-sm">Département</p>
                    <p className="text-white">{user.department}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations système */}
          <Card className="glass-card">
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Informations système
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-white/60" />
                  <div>
                    <p className="text-white/60 text-sm">Dernière connexion</p>
                    <p className="text-white">{user.lastLogin}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-white/60" />
                  <div>
                    <p className="text-white/60 text-sm">Date de création</p>
                    <p className="text-white">{user.createdAt}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Permissions et accès (exemple de données supplémentaires) */}
          <Card className="glass-card">
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Permissions et accès</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Accès administration</span>
                  <Badge variant={user.role === "Administrateur" ? "default" : "secondary"}>
                    {user.role === "Administrateur" ? "Autorisé" : "Non autorisé"}
                  </Badge>
                </div>
                <Separator className="bg-white/20" />
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Gestion des utilisateurs</span>
                  <Badge variant={["Administrateur", "Chef Opérateur"].includes(user.role) ? "default" : "secondary"}>
                    {["Administrateur", "Chef Opérateur"].includes(user.role) ? "Autorisé" : "Non autorisé"}
                  </Badge>
                </div>
                <Separator className="bg-white/20" />
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Maintenance des équipements</span>
                  <Badge variant={["Administrateur", "Chef Technicien", "Technicien"].includes(user.role) ? "default" : "secondary"}>
                    {["Administrateur", "Chef Technicien", "Technicien"].includes(user.role) ? "Autorisé" : "Non autorisé"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};