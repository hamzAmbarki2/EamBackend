import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter,
  Clock,
  User,
  MapPin,
  CheckCircle,
  AlertCircle,
  Calendar as CalendarIcon
} from "lucide-react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminHeader } from "@/components/AdminHeader";

interface Planning {
  identifiantPlanning: string;
  dateDebut: string;
  dateFin: string;
  type: string;
  assigneA: string[];
  status: "planifie" | "en_cours" | "termine" | "annule";
  description: string;
  priority: "basse" | "moyenne" | "elevee" | "urgente";
  ordresTravail: string[];
}

const Plannings = () => {
  const [sidebarSize, setSidebarSize] = useState<"mini" | "compact" | "normal" | "wide">("normal");
  
  const handleSidebarSizeChange = (direction: "prev" | "next") => {
    const sizes = ["mini", "compact", "normal", "wide"] as const;
    const currentIndex = sizes.indexOf(sidebarSize);
    
    if (direction === "next" && currentIndex < sizes.length - 1) {
      setSidebarSize(sizes[currentIndex + 1]);
    } else if (direction === "prev" && currentIndex > 0) {
      setSidebarSize(sizes[currentIndex - 1]);
    }
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("tous");

  // Données de plannings basées sur le diagramme de classe
  const plannings: Planning[] = [
    {
      identifiantPlanning: "PLN-001",
      dateDebut: "2024-01-15",
      dateFin: "2024-01-20",
      type: "maintenance_preventive",
      assigneA: ["USR-001", "USR-003"],
      status: "planifie",
      description: "Maintenance préventive des machines de production ligne A",
      priority: "moyenne",
      ordresTravail: ["WO-001", "WO-002"]
    },
    {
      identifiantPlanning: "PLN-002", 
      dateDebut: "2024-01-16",
      dateFin: "2024-01-16",
      type: "intervention_urgente",
      assigneA: ["USR-002"],
      status: "en_cours",
      description: "Réparation urgente machine M-205",
      priority: "urgente",
      ordresTravail: ["WO-008"]
    },
    {
      identifiantPlanning: "PLN-003",
      dateDebut: "2024-01-10",
      dateFin: "2024-01-12",
      type: "maintenance_corrective",
      assigneA: ["USR-001", "USR-004"],
      status: "termine",
      description: "Correction défauts ligne B",
      priority: "elevee",
      ordresTravail: ["WO-005", "WO-006"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planifie": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "en_cours": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "termine": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "annule": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "basse": return "bg-green-500/20 text-green-400";
      case "moyenne": return "bg-blue-500/20 text-blue-400";
      case "elevee": return "bg-orange-500/20 text-orange-400";
      case "urgente": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const filteredPlannings = plannings.filter(planning => {
    const matchesSearch = planning.identifiantPlanning.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         planning.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "tous" || planning.type === filterType;
    return matchesSearch && matchesFilter;
  });

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
            {/* En-tête */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Gestion des Plannings
                </h1>
                <p className="text-white/70">
                  Planification et suivi des interventions
                </p>
              </div>
              <Button className="bg-primary hover:bg-primary/80">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau planning
              </Button>
            </div>

            {/* Filtres et recherche */}
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                      <Input
                        placeholder="Rechercher un planning..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                  </div>
                  <select 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
                  >
                    <option value="tous">Tous les types</option>
                    <option value="maintenance_preventive">Maintenance préventive</option>
                    <option value="maintenance_corrective">Maintenance corrective</option>
                    <option value="intervention_urgente">Intervention urgente</option>
                  </select>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtres
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <CalendarIcon className="w-8 h-8 text-blue-400" />
                    <div>
                      <p className="text-white/70 text-sm">Planifiés</p>
                      <p className="text-2xl font-bold text-white">
                        {plannings.filter(p => p.status === "planifie").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-8 h-8 text-yellow-400" />
                    <div>
                      <p className="text-white/70 text-sm">En cours</p>
                      <p className="text-2xl font-bold text-white">
                        {plannings.filter(p => p.status === "en_cours").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                    <div>
                      <p className="text-white/70 text-sm">Terminés</p>
                      <p className="text-2xl font-bold text-white">
                        {plannings.filter(p => p.status === "termine").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-8 h-8 text-red-400" />
                    <div>
                      <p className="text-white/70 text-sm">Urgents</p>
                      <p className="text-2xl font-bold text-white">
                        {plannings.filter(p => p.priority === "urgente").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Liste des plannings */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">Plannings actifs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPlannings.map((planning) => (
                    <div key={planning.identifiantPlanning} className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-3 lg:space-y-0">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <span className="font-semibold text-white">{planning.identifiantPlanning}</span>
                            <Badge className={getStatusColor(planning.status)}>
                              {planning.status.replace('_', ' ')}
                            </Badge>
                            <Badge className={getPriorityColor(planning.priority)}>
                              {planning.priority}
                            </Badge>
                          </div>
                          <p className="text-white/80">{planning.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-white/60">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{planning.dateDebut} - {planning.dateFin}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>{planning.assigneA.length} assigné(s)</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{planning.ordresTravail.length} ordre(s) de travail</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                            Voir détails
                          </Button>
                          <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                            Modifier
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Plannings;