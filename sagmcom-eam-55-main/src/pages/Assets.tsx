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
  Package,
  MoreHorizontal,
  Wrench,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Settings,
  MapPin
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
import { AssetForm } from "@/components/forms/AssetForm";
import { AssetDetailModal } from "@/components/forms/AssetDetailModal";
import { DeleteConfirmationDialog } from "@/components/forms/DeleteConfirmationDialog";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { api } from "@/lib/api";

interface Asset {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  type: string;
  location: string;
  status: "operational" | "maintenance" | "down" | "retired";
  condition: "excellent" | "good" | "fair" | "poor";
  lastMaintenance: string;
  nextMaintenance: string;
  installedDate: string;
  manufacturer: string;
  criticality: "low" | "medium" | "high" | "critical";
}

const initialAssets: Asset[] = [
  {
    id: "AST-001",
    name: "Ligne Production A1",
    model: "ProLine-5000",
    serialNumber: "PL5000-2023-001",
    type: "Ligne de production",
    location: "Atelier A - Zone 1",
    status: "operational",
    condition: "excellent",
    lastMaintenance: "15/01/2024",
    nextMaintenance: "15/04/2024",
    installedDate: "20/03/2023",
    manufacturer: "TechProd Solutions",
    criticality: "critical"
  },
  {
    id: "AST-002",
    name: "Robot Soudure R1",
    model: "WeldBot-300",
    serialNumber: "WB300-2022-045",
    type: "Robot de soudure",
    location: "Atelier B - Zone 2",
    status: "maintenance",
    condition: "good",
    lastMaintenance: "22/01/2024",
    nextMaintenance: "22/02/2024",
    installedDate: "15/06/2022",
    manufacturer: "RoboWeld Inc.",
    criticality: "high"
  },
  {
    id: "AST-003",
    name: "Convoyeur Principal",
    model: "ConveyMax-2000",
    serialNumber: "CM2000-2021-112",
    type: "Système de convoyage",
    location: "Atelier A - Central",
    status: "operational",
    condition: "good",
    lastMaintenance: "10/01/2024",
    nextMaintenance: "10/03/2024",
    installedDate: "05/09/2021",
    manufacturer: "ConveyTech Ltd",
    criticality: "high"
  },
  {
    id: "AST-004",
    name: "Presse Hydraulique P1",
    model: "HydroPress-800",
    serialNumber: "HP800-2020-089",
    type: "Presse hydraulique",
    location: "Atelier C - Zone 1",
    status: "down",
    condition: "fair",
    lastMaintenance: "05/12/2023",
    nextMaintenance: "05/02/2024",
    installedDate: "12/11/2020",
    manufacturer: "HydroPower Systems",
    criticality: "medium"
  },
  {
    id: "AST-005",
    name: "Tour CNC T1",
    model: "CNCMaster-450",
    serialNumber: "CNM450-2023-025",
    type: "Tour CNC",
    location: "Atelier D - Zone 1",
    status: "operational",
    condition: "excellent",
    lastMaintenance: "28/12/2023",
    nextMaintenance: "28/03/2024",
    installedDate: "10/01/2023",
    manufacturer: "CNC Innovations",
    criticality: "medium"
  },
  {
    id: "AST-006",
    name: "Compresseur Air C1",
    model: "AirMax-1500",
    serialNumber: "AM1500-2019-234",
    type: "Compresseur",
    location: "Salle des machines",
    status: "operational",
    condition: "fair",
    lastMaintenance: "18/01/2024",
    nextMaintenance: "18/04/2024",
    installedDate: "25/08/2019",
    manufacturer: "AirTech Solutions",
    criticality: "high"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "operational": return "bg-green-500/20 text-green-400 border-green-500/30";
    case "maintenance": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "down": return "bg-red-500/20 text-red-400 border-red-500/30";
    case "retired": return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

const getConditionColor = (condition: string) => {
  switch (condition) {
    case "excellent": return "bg-green-500/20 text-green-400 border-green-500/30";
    case "good": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "fair": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "poor": return "bg-red-500/20 text-red-400 border-red-500/30";
    default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

const getCriticalityColor = (criticality: string) => {
  switch (criticality) {
    case "critical": return "bg-red-500/20 text-red-400 border-red-500/30";
    case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "low": return "bg-green-500/20 text-green-400 border-green-500/30";
    default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "operational": return <CheckCircle className="h-4 w-4" />;
    case "maintenance": return <Wrench className="h-4 w-4" />;
    case "down": return <XCircle className="h-4 w-4" />;
    case "retired": return <AlertTriangle className="h-4 w-4" />;
    default: return <AlertTriangle className="h-4 w-4" />;
  }
};

const AssetsPage = () => {
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
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [criticalityFilter, setCriticalityFilter] = useState<string>("all");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load assets from backend on mount
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await api.assets.list();
        const mapped: Asset[] = (data || []).map((m: any) => ({
          id: String(m.id),
          name: m.nom,
          model: m.model ?? "",
          serialNumber: m.serialNumber ?? "",
          type: m.type,
          location: m.emplacement,
          status: (m.assetStatus || "OPERATIONAL").toString().toLowerCase() as Asset["status"],
          condition: (m.condition || "GOOD").toString().toLowerCase() as Asset["condition"],
          lastMaintenance: m.dateDernièreMaintenance ? new Date(m.dateDernièreMaintenance).toLocaleDateString("fr-FR") : "",
          nextMaintenance: m.dateProchaineMainenance ? new Date(m.dateProchaineMainenance).toLocaleDateString("fr-FR") : "",
          installedDate: m.installedDate ? new Date(m.installedDate).toLocaleDateString("fr-FR") : "",
          manufacturer: m.manufacturer ?? "",
          criticality: (m.criticality || "MEDIUM").toString().toLowerCase() as Asset["criticality"],
        }));
        setAssets(mapped);
      } catch (e: any) {
        setError(e?.message || "Erreur de chargement des assets");
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  
  // Modal states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || asset.status === statusFilter;
    const matchesType = typeFilter === "all" || asset.type === typeFilter;
    const matchesCriticality = criticalityFilter === "all" || asset.criticality === criticalityFilter;
    return matchesSearch && matchesStatus && matchesType && matchesCriticality;
  });

  // CRUD operations
  const handleCreateAsset = async (assetData: Asset) => {
    setIsLoading(true);
    try {
      // map form -> backend Machine
      const payload: any = {
        nom: assetData.name,
        model: assetData.model,
        serialNumber: assetData.serialNumber,
        type: assetData.type,
        emplacement: assetData.location,
        assetStatus: assetData.status.toUpperCase(),
        condition: assetData.condition.toUpperCase(),
        dateDernièreMaintenance: assetData.lastMaintenance ? new Date(assetData.lastMaintenance.split('/').reverse().join('-')).toISOString() : null,
        dateProchaineMainenance: assetData.nextMaintenance ? new Date(assetData.nextMaintenance.split('/').reverse().join('-')).toISOString() : null,
        installedDate: assetData.installedDate ? new Date(assetData.installedDate.split('/').reverse().join('-')).toISOString() : null,
        manufacturer: assetData.manufacturer,
        criticality: assetData.criticality.toUpperCase(),
      };
      const created = await api.assets.create(payload);
      const createdVm: Asset = {
        id: String(created.id),
        name: created.nom,
        model: created.model ?? "",
        serialNumber: created.serialNumber ?? "",
        type: created.type,
        location: created.emplacement,
        status: (created.assetStatus || "OPERATIONAL").toString().toLowerCase(),
        condition: (created.condition || "GOOD").toString().toLowerCase(),
        lastMaintenance: created.dateDernièreMaintenance ? new Date(created.dateDernièreMaintenance).toLocaleDateString("fr-FR") : "",
        nextMaintenance: created.dateProchaineMainenance ? new Date(created.dateProchaineMainenance).toLocaleDateString("fr-FR") : "",
        installedDate: created.installedDate ? new Date(created.installedDate).toLocaleDateString("fr-FR") : "",
        manufacturer: created.manufacturer ?? "",
        criticality: (created.criticality || "MEDIUM").toString().toLowerCase(),
      } as Asset;
      setAssets([...assets, createdVm]);
      setIsCreateDialogOpen(false);
      toast({
        title: "Équipement créé",
        description: `L'équipement ${assetData.name} a été créé avec succès.`
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'équipement.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAsset = async (assetData: Asset) => {
    setIsLoading(true);
    try {
      const payload: any = {
        id: Number(assetData.id),
        nom: assetData.name,
        model: assetData.model,
        serialNumber: assetData.serialNumber,
        type: assetData.type,
        emplacement: assetData.location,
        assetStatus: assetData.status.toUpperCase(),
        condition: assetData.condition.toUpperCase(),
        dateDernièreMaintenance: assetData.lastMaintenance ? new Date(assetData.lastMaintenance.split('/').reverse().join('-')).toISOString() : null,
        dateProchaineMainenance: assetData.nextMaintenance ? new Date(assetData.nextMaintenance.split('/').reverse().join('-')).toISOString() : null,
        installedDate: assetData.installedDate ? new Date(assetData.installedDate.split('/').reverse().join('-')).toISOString() : null,
        manufacturer: assetData.manufacturer,
        criticality: assetData.criticality.toUpperCase(),
      };
      const updated = await api.assets.update(payload);
      const updatedVm: Asset = {
        id: String(updated.id),
        name: updated.nom,
        model: updated.model ?? "",
        serialNumber: updated.serialNumber ?? "",
        type: updated.type,
        location: updated.emplacement,
        status: (updated.assetStatus || "OPERATIONAL").toString().toLowerCase(),
        condition: (updated.condition || "GOOD").toString().toLowerCase(),
        lastMaintenance: updated.dateDernièreMaintenance ? new Date(updated.dateDernièreMaintenance).toLocaleDateString("fr-FR") : "",
        nextMaintenance: updated.dateProchaineMainenance ? new Date(updated.dateProchaineMainenance).toLocaleDateString("fr-FR") : "",
        installedDate: updated.installedDate ? new Date(updated.installedDate).toLocaleDateString("fr-FR") : "",
        manufacturer: updated.manufacturer ?? "",
        criticality: (updated.criticality || "MEDIUM").toString().toLowerCase(),
      } as Asset;
      setAssets(assets.map(asset => asset.id === assetData.id ? updatedVm : asset));
      setIsEditDialogOpen(false);
      setSelectedAsset(null);
      toast({
        title: "Équipement modifié",
        description: `L'équipement ${assetData.name} a été modifié avec succès.`
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification de l'équipement.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAsset = async () => {
    if (!selectedAsset) return;
    
    setIsLoading(true);
    try {
      await api.assets.remove(Number(selectedAsset.id));
      setAssets(assets.filter(asset => asset.id !== selectedAsset.id));
      setIsDeleteDialogOpen(false);
      setSelectedAsset(null);
      toast({
        title: "Équipement supprimé",
        description: `L'équipement ${selectedAsset.name} a été supprimé avec succès.`
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'équipement.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeAssetStatus = async (asset: Asset, newStatus: "operational" | "maintenance" | "down" | "retired") => {
    try {
      const updatedAsset = { ...asset, status: newStatus };
      // optimistic UI
      setAssets(assets.map(a => a.id === asset.id ? updatedAsset : a));
      // push update to backend
      await api.assets.update({ id: Number(asset.id), assetStatus: newStatus.toUpperCase() });
      toast({
        title: "Statut modifié",
        description: `L'équipement ${asset.name} est maintenant ${
          newStatus === "operational" ? "opérationnel" :
          newStatus === "maintenance" ? "en maintenance" :
          newStatus === "down" ? "hors service" : "retiré"
        }.`
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
    { title: "Total Assets", value: assets.length, color: "blue" },
    { title: "Opérationnels", value: assets.filter(a => a.status === "operational").length, color: "green" },
    { title: "En maintenance", value: assets.filter(a => a.status === "maintenance").length, color: "yellow" },
    { title: "Hors service", value: assets.filter(a => a.status === "down").length, color: "red" }
  ];

  const uniqueTypes = [...new Set(assets.map(asset => asset.type))];

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
                  Gestion des Assets (Machines)
                </h1>
                <p className="text-white/70">
                  Suivez et gérez vos équipements industriels
                </p>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/80">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvel asset
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-white/20 max-w-4xl">
                  <DialogHeader>
                    <DialogTitle className="text-white">Nouvel asset</DialogTitle>
                    <DialogDescription className="text-white/70">
                      Enregistrer un nouvel équipement dans le système.
                    </DialogDescription>
                  </DialogHeader>
                  <AssetForm
                    onSubmit={handleCreateAsset}
                    onCancel={() => setIsCreateDialogOpen(false)}
                    isLoading={isLoading}
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
                        stat.color === "yellow" ? "bg-yellow-500/20" :
                        "bg-red-500/20"
                      }`}>
                        <Package className={`h-6 w-6 ${
                          stat.color === "blue" ? "text-blue-400" :
                          stat.color === "green" ? "text-green-400" :
                          stat.color === "yellow" ? "text-yellow-400" :
                          "text-red-400"
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
                    <Package className="h-5 w-5" />
                    <span>Liste des assets</span>
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
                <div className="flex items-center space-x-4 mb-6 flex-wrap gap-2">
                  <div className="relative flex-1 min-w-64 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                    <Input
                      placeholder="Rechercher par nom, modèle, localisation..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/20">
                      <SelectItem value="all" className="text-white hover:bg-white/10">Tous</SelectItem>
                      <SelectItem value="operational" className="text-white hover:bg-white/10">Opérationnel</SelectItem>
                      <SelectItem value="maintenance" className="text-white hover:bg-white/10">Maintenance</SelectItem>
                      <SelectItem value="down" className="text-white hover:bg-white/10">Hors service</SelectItem>
                      <SelectItem value="retired" className="text-white hover:bg-white/10">Retiré</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/20">
                      <SelectItem value="all" className="text-white hover:bg-white/10">Tous les types</SelectItem>
                      {uniqueTypes.map(type => (
                        <SelectItem key={type} value={type} className="text-white hover:bg-white/10">{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={criticalityFilter} onValueChange={setCriticalityFilter}>
                    <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Criticité" />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/20">
                      <SelectItem value="all" className="text-white hover:bg-white/10">Toutes</SelectItem>
                      <SelectItem value="critical" className="text-white hover:bg-white/10">Critique</SelectItem>
                      <SelectItem value="high" className="text-white hover:bg-white/10">Élevée</SelectItem>
                      <SelectItem value="medium" className="text-white hover:bg-white/10">Moyenne</SelectItem>
                      <SelectItem value="low" className="text-white hover:bg-white/10">Faible</SelectItem>
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
                        <TableHead className="text-white/80 font-medium">Asset</TableHead>
                        <TableHead className="text-white/80 font-medium">Type & Localisation</TableHead>
                        <TableHead className="text-white/80 font-medium">Statut</TableHead>
                        <TableHead className="text-white/80 font-medium">État</TableHead>
                        <TableHead className="text-white/80 font-medium">Criticité</TableHead>
                        <TableHead className="text-white/80 font-medium">Prochaine maintenance</TableHead>
                        <TableHead className="text-white/80 font-medium text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAssets.map((asset) => (
                        <TableRow key={asset.id} className="border-b border-white/5 hover:bg-white/5">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                                <Package className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <div className="font-medium text-white">{asset.name}</div>
                                <div className="text-sm text-white/60">{asset.model} • {asset.serialNumber}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-white/80">{asset.type}</div>
                              <div className="flex items-center space-x-2 text-white/60">
                                <MapPin className="h-3 w-3" />
                                <span className="text-sm">{asset.location}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn("border flex items-center space-x-1", getStatusColor(asset.status))}>
                              {getStatusIcon(asset.status)}
                              <span>
                                {asset.status === "operational" ? "Opérationnel" : 
                                 asset.status === "maintenance" ? "Maintenance" :
                                 asset.status === "down" ? "Hors service" : "Retiré"}
                              </span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn("border", getConditionColor(asset.condition))}>
                              {asset.condition === "excellent" ? "Excellent" :
                               asset.condition === "good" ? "Bon" :
                               asset.condition === "fair" ? "Moyen" : "Mauvais"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn("border", getCriticalityColor(asset.criticality))}>
                              {asset.criticality === "critical" ? "Critique" :
                               asset.criticality === "high" ? "Élevée" :
                               asset.criticality === "medium" ? "Moyenne" : "Faible"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white/80">{asset.nextMaintenance}</TableCell>
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
                                    setSelectedAsset(asset);
                                    setIsDetailModalOpen(true);
                                  }}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  Voir détails
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-white hover:bg-white/10"
                                  onClick={() => {
                                    setSelectedAsset(asset);
                                    setIsEditDialogOpen(true);
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Modifier
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-white/20" />
                                <DropdownMenuItem 
                                  className="text-white hover:bg-white/10"
                                  onClick={() => handleChangeAssetStatus(asset, "maintenance")}
                                  disabled={asset.status === "maintenance"}
                                >
                                  <Wrench className="mr-2 h-4 w-4" />
                                  Planifier maintenance
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-white hover:bg-white/10"
                                  onClick={() => handleChangeAssetStatus(asset, asset.status === "operational" ? "down" : "operational")}
                                >
                                  {asset.status === "operational" ? (
                                    <>
                                      <XCircle className="mr-2 h-4 w-4" />
                                      Marquer hors service
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Marquer opérationnel
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-white/20" />
                                <DropdownMenuItem 
                                  className="text-red-400 hover:bg-red-500/10"
                                  onClick={() => {
                                    setSelectedAsset(asset);
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
                    Affichage de {filteredAssets.length} sur {assets.length} assets
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

      {/* Edit Asset Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="glass border-white/20 max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-white">Modifier l'équipement</DialogTitle>
            <DialogDescription className="text-white/70">
              Modifier les informations de l'équipement.
            </DialogDescription>
          </DialogHeader>
          {selectedAsset && (
            <AssetForm
              asset={selectedAsset}
              onSubmit={handleEditAsset}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedAsset(null);
              }}
              isLoading={isLoading}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Asset Detail Modal */}
      <AssetDetailModal
        asset={selectedAsset}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedAsset(null);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedAsset(null);
        }}
        onConfirm={handleDeleteAsset}
        title="Supprimer l'équipement"
        description="Êtes-vous sûr de vouloir supprimer cet équipement ?"
        itemName={selectedAsset?.name || ""}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AssetsPage;