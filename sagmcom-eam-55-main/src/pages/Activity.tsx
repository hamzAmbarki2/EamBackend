import { useState } from "react";
import { AdminHeader } from "@/components/AdminHeader";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { 
  Search, 
  Filter, 
  Download, 
  Calendar as CalendarIcon,
  User,
  Settings,
  FileText,
  AlertTriangle,
  CheckCircle,
  Info,
  UserPlus,
  Edit,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  time: string;
  type: "create" | "edit" | "login" | "validate" | "warning" | "info";
  details?: string;
  entity?: string;
  entityId?: string;
}

type SidebarSize = "mini" | "compact" | "normal" | "wide";

const activities: ActivityItem[] = [
  {
    id: "1",
    user: "Marie Dupont",
    action: "a créé un nouvel asset",
    time: "Il y a 5 minutes",
    type: "create",
    details: "Compresseur d'air CAT-001",
    entity: "Asset",
    entityId: "CAT-001"
  },
  {
    id: "2",
    user: "Jean Martin",
    action: "a modifié un ordre de travail",
    time: "Il y a 12 minutes",
    type: "edit",
    details: "OT-2024-001 - Maintenance préventive",
    entity: "WorkOrder",
    entityId: "OT-2024-001"
  },
  {
    id: "3",
    user: "Sophie Bernard",
    action: "s'est connecté au système",
    time: "Il y a 30 minutes",
    type: "login",
    entity: "User",
    entityId: "sophie.bernard"
  },
  {
    id: "4",
    user: "Admin Système",
    action: "a validé une intervention",
    time: "Il y a 45 minutes",
    type: "validate",
    details: "INT-2024-005 - Réparation urgente",
    entity: "Intervention",
    entityId: "INT-2024-005"
  },
  {
    id: "5",
    user: "Pierre Moreau",
    action: "a signalé une alerte",
    time: "Il y a 1 heure",
    type: "warning",
    details: "Température élevée détectée",
    entity: "Alert",
    entityId: "ALT-001"
  },
  {
    id: "6",
    user: "Système",
    action: "a généré un rapport",
    time: "Il y a 2 heures",
    type: "info",
    details: "Rapport mensuel de maintenance",
    entity: "Report",
    entityId: "RPT-2024-03"
  },
  {
    id: "7",
    user: "Admin",
    action: "a ajouté un nouvel utilisateur",
    time: "Il y a 3 heures",
    type: "create",
    details: "Lucas Dubois - Technicien",
    entity: "User",
    entityId: "lucas.dubois"
  },
  {
    id: "8",
    user: "Anne Petit",
    action: "a mis à jour les informations d'un asset",
    time: "Il y a 4 heures",
    type: "edit",
    details: "Pompe hydraulique PMP-005",
    entity: "Asset",
    entityId: "PMP-005"
  }
];

const getActivityIcon = (type: string) => {
  switch (type) {
    case "create":
      return UserPlus;
    case "edit":
      return Edit;
    case "login":
      return User;
    case "validate":
      return CheckCircle;
    case "warning":
      return AlertTriangle;
    case "info":
      return Info;
    default:
      return FileText;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case "create":
      return "text-green-600 bg-green-100";
    case "edit":
      return "text-blue-600 bg-blue-100";
    case "login":
      return "text-purple-600 bg-purple-100";
    case "validate":
      return "text-emerald-600 bg-emerald-100";
    case "warning":
      return "text-orange-600 bg-orange-100";
    case "info":
      return "text-gray-600 bg-gray-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

const getActivityBadgeVariant = (type: string) => {
  switch (type) {
    case "create":
      return "default";
    case "edit":
      return "secondary";
    case "login":
      return "outline";
    case "validate":
      return "default";
    case "warning":
      return "destructive";
    case "info":
      return "secondary";
    default:
      return "outline";
  }
};

const getSidebarWidth = (size: SidebarSize) => {
  switch (size) {
    case "mini": return "w-16";
    case "compact": return "w-48";
    case "normal": return "w-64";
    case "wide": return "w-80";
    default: return "w-64";
  }
};

export default function Activity() {
  const [sidebarSize, setSidebarSize] = useState<SidebarSize>("normal");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterUser, setFilterUser] = useState<string>("all");
  const [dateRange, setDateRange] = useState<Date | undefined>(undefined);

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.details?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || activity.type === filterType;
    const matchesUser = filterUser === "all" || activity.user === filterUser;
    
    return matchesSearch && matchesType && matchesUser;
  });

  const uniqueUsers = Array.from(new Set(activities.map(a => a.user)));

  const handleSidebarSizeChange = (direction: "prev" | "next" | "collapse" | "expand") => {
    const sizes: SidebarSize[] = ["mini", "compact", "normal", "wide"];
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

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <AdminSidebar sidebarSize={sidebarSize} />
      
      <div className={cn(
        "transition-all duration-300",
        sidebarSize === "mini" && "ml-16",
        sidebarSize === "compact" && "ml-48", 
        sidebarSize === "normal" && "ml-64",
        sidebarSize === "wide" && "ml-80"
      )}>
        <AdminHeader 
          onSidebarSizeChange={handleSidebarSizeChange}
          sidebarSize={sidebarSize}
        />
        
        <main className="pt-16 p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Journal d'Activité</h1>
                <p className="text-white/70">
                  Suivez toutes les actions et modifications du système
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="gap-2 border-white/20 text-white hover:bg-white/10">
                  <Download className="h-4 w-4" />
                  Exporter
                </Button>
              </div>
            </div>

            {/* Filters */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg text-white">Filtres</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                    <Input
                      placeholder="Rechercher une activité..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                  </div>

                  {/* Type Filter */}
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Type d'activité" />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/20">
                      <SelectItem value="all" className="text-white hover:bg-white/10">Tous les types</SelectItem>
                      <SelectItem value="create" className="text-white hover:bg-white/10">Création</SelectItem>
                      <SelectItem value="edit" className="text-white hover:bg-white/10">Modification</SelectItem>
                      <SelectItem value="login" className="text-white hover:bg-white/10">Connexion</SelectItem>
                      <SelectItem value="validate" className="text-white hover:bg-white/10">Validation</SelectItem>
                      <SelectItem value="warning" className="text-white hover:bg-white/10">Alerte</SelectItem>
                      <SelectItem value="info" className="text-white hover:bg-white/10">Information</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* User Filter */}
                  <Select value={filterUser} onValueChange={setFilterUser}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Utilisateur" />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/20">
                      <SelectItem value="all" className="text-white hover:bg-white/10">Tous les utilisateurs</SelectItem>
                      {uniqueUsers.map(user => (
                        <SelectItem key={user} value={user} className="text-white hover:bg-white/10">{user}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Date Filter */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal border-white/20 text-white hover:bg-white/10",
                          !dateRange && "text-white/60"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange ? format(dateRange, "PPP") : "Sélectionner une date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 glass border-white/20">
                      <Calendar
                        mode="single"
                        selected={dateRange}
                        onSelect={setDateRange}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>

            {/* Activity List */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Filter className="h-5 w-5" />
                  Activités Récentes ({filteredActivities.length})
                </CardTitle>
                <CardDescription className="text-white/70">
                  Liste chronologique de toutes les activités du système
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredActivities.map((activity) => {
                    const Icon = getActivityIcon(activity.type);
                    
                    return (
                      <div
                        key={activity.id}
                        className="flex items-start gap-4 p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className={cn("p-2 rounded-full", 
                          activity.type === "create" ? "bg-green-500/20 text-green-400" :
                          activity.type === "edit" ? "bg-blue-500/20 text-blue-400" :
                          activity.type === "login" ? "bg-purple-500/20 text-purple-400" :
                          activity.type === "validate" ? "bg-emerald-500/20 text-emerald-400" :
                          activity.type === "warning" ? "bg-orange-500/20 text-orange-400" :
                          "bg-gray-500/20 text-gray-400"
                        )}>
                          <Icon className="h-4 w-4" />
                        </div>
                        
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-white">{activity.user}</span>
                            <span className="text-white/70">{activity.action}</span>
                            <Badge variant={getActivityBadgeVariant(activity.type)} className="bg-white/10 text-white/90 border-white/20">
                              {activity.type}
                            </Badge>
                          </div>
                          
                          {activity.details && (
                            <p className="text-sm text-white/60">
                              {activity.details}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-2 text-sm text-white/60">
                            <span>{activity.time}</span>
                            {activity.entity && activity.entityId && (
                              <>
                                <span>•</span>
                                <span>{activity.entity}: {activity.entityId}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {filteredActivities.length === 0 && (
                    <div className="text-center py-8">
                      <Settings className="h-12 w-12 text-white/60 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2 text-white">Aucune activité trouvée</h3>
                      <p className="text-white/70">
                        Aucune activité ne correspond à vos critères de recherche.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}