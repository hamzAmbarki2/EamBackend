import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Activity, 
  Settings, 
  Database, 
  Wrench,
  Calendar,
  BarChart3,
  Server,
  HardDrive,
  Zap,
  TrendingUp,
  Bell,
  UserPlus,
  Plus,
  FileText,
  Download,
  BarChart,
  Package,
  Shield
} from "lucide-react";

// Import custom components
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminHeader } from "@/components/AdminHeader";
import { StatCard } from "@/components/StatCard";
import { ActivityFeed } from "@/components/ActivityFeed";
import { ManagementTable } from "@/components/ManagementTable";

const AdminDashboard = () => {
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

  // Dashboard statistics
  const stats = [
    {
      title: "Utilisateurs totaux",
      value: "234",
      subtitle: "Sessions actives: 45",
      icon: Users,
      trend: { value: "+12%", isPositive: true }
    },
    {
      title: "Machines/Assets",
      value: "156", 
      subtitle: "153 opérationnelles",
      icon: Package,
      trend: { value: "3 en maintenance", isPositive: false }
    },
    {
      title: "Ordres de travail ouverts",
      value: "23",
      subtitle: "12 complétés aujourd'hui",
      icon: FileText,
      trend: { value: "+8%", isPositive: true }
    },
    {
      title: "Ordres d'intervention",
      value: "8",
      subtitle: "2 urgents",
      icon: Wrench,
      trend: { value: "2 critiques", isPositive: false }
    },
    {
      title: "Documents archivés",
      value: "892",
      subtitle: "Fichiers stockés", 
      icon: Database,
      trend: { value: "Normal", isPositive: true }
    },
    {
      title: "Uptime système",
      value: "99.9%",
      subtitle: "Dernière panne: 12j",
      icon: Server,
      trend: { value: "Excellent", isPositive: true }
    },
    {
      title: "Plannings",
      value: "47",
      subtitle: "Cette semaine",
      icon: Calendar,
      trend: { value: "+5%", isPositive: true }
    },
    {
      title: "Notifications",
      value: "12",
      subtitle: "3 non lues",
      icon: Bell,
      trend: { value: "Nouvelles", isPositive: false }
    }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Sidebar */}
      <AdminSidebar sidebarSize={sidebarSize} />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 ${
        sidebarSize === "mini" ? "ml-16" : 
        sidebarSize === "compact" ? "ml-48" : 
        sidebarSize === "normal" ? "ml-64" : "ml-80"
      }`}>
        {/* Header */}
        <AdminHeader 
          onSidebarSizeChange={handleSidebarSizeChange}
          sidebarSize={sidebarSize}
        />
        
        {/* Main Dashboard Content */}
        <main className="pt-16 p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Title */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">
                Sagemcom EAM Admin Panel
              </h1>
              <p className="text-white/70 text-lg">
                Système de gestion des actifs et contrôles administratifs
              </p>
            </div>

            {/* Quick Actions */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Zap className="w-5 h-5" />
                  <span>Actions rapides</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <Button variant="outline" className="h-auto p-4 flex-col glass-hover border-white/20 text-white hover:bg-white/10">
                    <UserPlus className="w-6 h-6 mb-2" />
                    <span className="text-sm">Nouvel utilisateur</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex-col glass-hover border-white/20 text-white hover:bg-white/10">
                    <Plus className="w-6 h-6 mb-2" />
                    <span className="text-sm">Nouvelle machine</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex-col glass-hover border-white/20 text-white hover:bg-white/10">
                    <FileText className="w-6 h-6 mb-2" />
                    <span className="text-sm">Nouvel ordre</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex-col glass-hover border-white/20 text-white hover:bg-white/10">
                    <Download className="w-6 h-6 mb-2" />
                    <span className="text-sm">Sauvegarde</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex-col glass-hover border-white/20 text-white hover:bg-white/10">
                    <BarChart className="w-6 h-6 mb-2" />
                    <span className="text-sm">Rapport audit</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex-col glass-hover border-white/20 text-white hover:bg-white/10">
                    <Calendar className="w-6 h-6 mb-2" />
                    <span className="text-sm">Planning urgence</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>

            {/* Main Dashboard Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Section - Performance Overview */}
              <div className="lg:col-span-2 space-y-6">
                {/* Performance Analytics */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-white">
                      <BarChart3 className="w-5 h-5" />
                      <span>Performance du système</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-medium text-white">Efficacité système</h4>
                        <Progress value={92} className="h-3" />
                        <p className="text-sm text-white/70">92% - Excellent</p>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-medium text-white">Ordres complétés</h4>
                        <Progress value={78} className="h-3" />
                        <p className="text-sm text-white/70">78% du planning</p>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-medium text-white">Disponibilité machines</h4>
                        <Progress value={85} className="h-3" />
                        <p className="text-sm text-white/70">85% opérationnelles</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Management Table */}
                <ManagementTable />
              </div>

              {/* Right Section - Activity Feed */}
              <div className="space-y-6">
                <ActivityFeed />
                
                {/* System Status */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-white">
                      <Shield className="w-5 h-5" />
                      <span>État du système</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/20">
                      <span className="text-white font-medium">Statut général</span>
                      <span className="text-green-400 font-semibold">Opérationnel</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/20">
                      <span className="text-white font-medium">Performances</span>
                      <span className="text-blue-400 font-semibold">Optimales</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/20">
                      <span className="text-white font-medium">Alertes</span>
                      <span className="text-yellow-400 font-semibold">2 mineures</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Footer */}
            <footer className="glass rounded-2xl p-6 text-center mt-12">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">S</span>
                  </div>
                  <span className="text-white font-medium">Sagemcom EAM</span>
                </div>
                <p className="text-white/60 text-sm">
                  © 2024 Sagemcom. Tous droits réservés.
                </p>
                <div className="flex items-center space-x-4 text-sm text-white/60">
                  <button className="hover:text-white transition-colors">Aide</button>
                  <button className="hover:text-white transition-colors">Conditions</button>
                  <button className="hover:text-white transition-colors">Confidentialité</button>
                </div>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;