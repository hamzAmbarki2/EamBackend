import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Plus, 
  Search, 
  Download,
  Calendar,
  TrendingUp,
  BarChart3,
  PieChart,
  Users,
  Wrench
} from "lucide-react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminHeader } from "@/components/AdminHeader";

interface Rapport {
  identifiantRapport: string;
  titre: string;
  dateGeneration: string;
  contenu: string;
  type: "performance" | "maintenance" | "activite" | "audit" | "financier";
  generePar: string;
  taille?: string;
}

const Rapports = () => {
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

  // Données de rapports basées sur le diagramme de classe
  const rapports: Rapport[] = [
    {
      identifiantRapport: "RPT-001",
      titre: "Rapport de performance mensuel - Janvier 2024",
      dateGeneration: "2024-01-31",
      contenu: "Analyse des performances des équipements et indicateurs KPI",
      type: "performance",
      generePar: "Système automatique",
      taille: "2.4 MB"
    },
    {
      identifiantRapport: "RPT-002",
      titre: "Rapport maintenance préventive Q4 2023",
      dateGeneration: "2024-01-15",
      contenu: "Synthèse des interventions de maintenance préventive du quatrième trimestre",
      type: "maintenance",
      generePar: "Jean Dupont",
      taille: "1.8 MB"
    },
    {
      identifiantRapport: "RPT-003",
      titre: "Audit sécurité ligne de production A",
      dateGeneration: "2024-01-20",
      contenu: "Évaluation complète des procédures de sécurité et conformité",
      type: "audit",
      generePar: "Marie Martin",
      taille: "5.2 MB"
    },
    {
      identifiantRapport: "RPT-004",
      titre: "Activité utilisateurs - Semaine 3",
      dateGeneration: "2024-01-22",
      contenu: "Rapport d'activité des utilisateurs et utilisation du système",
      type: "activite",
      generePar: "Système automatique",
      taille: "892 KB"
    },
    {
      identifiantRapport: "RPT-005",
      titre: "Analyse financière maintenance 2023",
      dateGeneration: "2024-01-10",
      contenu: "Coûts de maintenance et retour sur investissement",
      type: "financier",
      generePar: "Pierre Dubois",
      taille: "3.1 MB"
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "performance": return <TrendingUp className="w-5 h-5" />;
      case "maintenance": return <Wrench className="w-5 h-5" />;
      case "activite": return <Users className="w-5 h-5" />;
      case "audit": return <BarChart3 className="w-5 h-5" />;
      case "financier": return <PieChart className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "performance": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "maintenance": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "activite": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "audit": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "financier": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const filteredRapports = rapports.filter(rapport => {
    const matchesSearch = rapport.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rapport.identifiantRapport.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "tous" || rapport.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const statsData = [
    {
      title: "Total rapports",
      value: rapports.length.toString(),
      icon: FileText,
      color: "text-blue-400"
    },
    {
      title: "Ce mois",
      value: rapports.filter(r => new Date(r.dateGeneration).getMonth() === new Date().getMonth()).length.toString(),
      icon: Calendar,
      color: "text-green-400"
    },
    {
      title: "Performance",
      value: rapports.filter(r => r.type === "performance").length.toString(),
      icon: TrendingUp,
      color: "text-purple-400"
    },
    {
      title: "Maintenance",
      value: rapports.filter(r => r.type === "maintenance").length.toString(),
      icon: Wrench,
      color: "text-orange-400"
    }
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
            {/* En-tête */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Gestion des Rapports
                </h1>
                <p className="text-white/70">
                  Génération et consultation des rapports système
                </p>
              </div>
              <Button className="bg-primary hover:bg-primary/80">
                <Plus className="w-4 h-4 mr-2" />
                Générer rapport
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
                        placeholder="Rechercher un rapport..."
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
                    <option value="performance">Performance</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="activite">Activité</option>
                    <option value="audit">Audit</option>
                    <option value="financier">Financier</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {statsData.map((stat, index) => (
                <Card key={index} className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                      <div>
                        <p className="text-white/70 text-sm">{stat.title}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Actions rapides */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto p-4 flex-col border-white/20 text-white hover:bg-white/10">
                    <TrendingUp className="w-6 h-6 mb-2" />
                    <span>Rapport performance</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex-col border-white/20 text-white hover:bg-white/10">
                    <Wrench className="w-6 h-6 mb-2" />
                    <span>Rapport maintenance</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex-col border-white/20 text-white hover:bg-white/10">
                    <BarChart3 className="w-6 h-6 mb-2" />
                    <span>Analyse personnalisée</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Liste des rapports */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">Rapports disponibles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRapports.map((rapport) => (
                    <div key={rapport.identifiantRapport} className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-3 lg:space-y-0">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              <div className="p-2 rounded-lg bg-white/10">
                                {getTypeIcon(rapport.type)}
                              </div>
                              <span className="font-semibold text-white">{rapport.identifiantRapport}</span>
                            </div>
                            <Badge className={getTypeColor(rapport.type)}>
                              {rapport.type}
                            </Badge>
                          </div>
                          <h3 className="text-lg font-medium text-white">{rapport.titre}</h3>
                          <p className="text-white/70">{rapport.contenu}</p>
                          <div className="flex items-center space-x-4 text-sm text-white/60">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(rapport.dateGeneration).toLocaleDateString('fr-FR')}</span>
                            </div>
                            <span>•</span>
                            <span>Généré par: {rapport.generePar}</span>
                            {rapport.taille && (
                              <>
                                <span>•</span>
                                <span>{rapport.taille}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" className="bg-primary hover:bg-primary/80">
                            <Download className="w-4 h-4 mr-2" />
                            Télécharger
                          </Button>
                          <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                            Prévisualiser
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

export default Rapports;