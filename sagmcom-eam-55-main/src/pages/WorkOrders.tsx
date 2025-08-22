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
  ClipboardList,
  MoreHorizontal,
  Calendar,
  User,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Settings
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
import { WorkOrderForm } from "@/components/forms/WorkOrderForm";
import { WorkOrderDetailModal } from "@/components/forms/WorkOrderDetailModal";
import { DeleteConfirmationDialog } from "@/components/forms/DeleteConfirmationDialog";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { api } from "@/lib/api";

export interface WorkOrder {
  id: string;
  title: string;
  description: string;
  dateEcheance: string;
  priorite: "BASSE" | "MOYENNE" | "ELEVEE" | "URGENTE";
  machine: {
    id: string;
    nom: string;
    emplacement: string;
  };
  assigneA: {
    id: string;
    nom: string;
    role: string;
  };
  statut: "EN_ATTENTE" | "EN_COURS" | "TERMINE" | "ANNULE";
  createdAt: string;
  interventionsCount?: number;
}

const initialWorkOrders: WorkOrder[] = [
  {
    id: "WO-001",
    title: "Maintenance préventive Ligne A1",
    description: "Contrôle général et remplacement des filtres",
    dateEcheance: "2024-02-15",
    priorite: "MOYENNE",
    machine: {
      id: "AST-001",
      nom: "Ligne Production A1",
      emplacement: "Atelier A - Zone 1"
    },
    assigneA: {
      id: "2",
      nom: "Pierre Martin",
      role: "Chef Technicien"
    },
    statut: "EN_COURS",
    createdAt: "2024-01-15",
    interventionsCount: 2
  },
  {
    id: "WO-002",
    title: "Réparation Robot Soudure",
    description: "Problème de calibrage des axes X et Y",
    dateEcheance: "2024-02-10",
    priorite: "URGENTE",
    machine: {
      id: "AST-002",
      nom: "Robot Soudure R1",
      emplacement: "Atelier B - Zone 2"
    },
    assigneA: {
      id: "3",
      nom: "Sophie Leroy",
      role: "Technicien"
    },
    statut: "EN_ATTENTE",
    createdAt: "2024-02-05",
    interventionsCount: 0
  },
  {
    id: "WO-003",
    title: "Inspection Convoyeur",
    description: "Vérification de l'alignement et des courroies",
    dateEcheance: "2024-02-20",
    priorite: "BASSE",
    machine: {
      id: "AST-003",
      nom: "Convoyeur Principal",
      emplacement: "Atelier A - Central"
    },
    assigneA: {
      id: "6",
      nom: "Thomas Bernard",
      role: "Opérateur"
    },
    statut: "TERMINE",
    createdAt: "2024-01-20",
    interventionsCount: 1
  }
];

const getPrioriteColor = (priorite: string) => {
  switch (priorite) {
    case "URGENTE": return "bg-red-500/20 text-red-400 border-red-500/30";
    case "ELEVEE": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    case "MOYENNE": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "BASSE": return "bg-green-500/20 text-green-400 border-green-500/30";
    default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

const getStatutColor = (statut: string) => {
  switch (statut) {
    case "EN_ATTENTE": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "EN_COURS": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "TERMINE": return "bg-green-500/20 text-green-400 border-green-500/30";
    case "ANNULE": return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

const getStatutIcon = (statut: string) => {
  switch (statut) {
    case "EN_ATTENTE": return <Clock className="h-4 w-4" />;
    case "EN_COURS": return <Settings className="h-4 w-4" />;
    case "TERMINE": return <CheckCircle2 className="h-4 w-4" />;
    case "ANNULE": return <AlertTriangle className="h-4 w-4" />;
    default: return <Clock className="h-4 w-4" />;
  }
};

const WorkOrdersPage = () => {
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
  const [prioriteFilter, setPrioriteFilter] = useState<string>("all");
  const [statutFilter, setStatutFilter] = useState<string>("all");
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(initialWorkOrders);
  // Load work orders from backend on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await api.workOrders.list();
        const mapped: WorkOrder[] = (data || []).map((w: any) => ({
          id: String(w.id),
          title: w.titre,
          description: w.description,
          dateEcheance: w.dateCreation ? new Date(w.dateCreation).toISOString().split('T')[0] : "",
          priorite: w.priorité || "MOYENNE",
          machine: { id: "", nom: "", emplacement: "" },
          assigneA: { id: w.assignedTo ? String(w.assignedTo) : "", nom: "", role: "" },
          statut: w.statut || "EN_ATTENTE",
          createdAt: w.dateCreation ? new Date(w.dateCreation).toISOString().split('T')[0] : "",
          interventionsCount: (w.ordreInterventions && Array.isArray(w.ordreInterventions)) ? w.ordreInterventions.length : 0,
        }));
        if (mapped.length) setWorkOrders(mapped);
      } catch (_) {
        // keep fallback
      }
    })();
  }, []);
  
  // Modal states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();

  const filteredWorkOrders = workOrders.filter(workOrder => {
    const matchesSearch = workOrder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workOrder.machine.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workOrder.assigneA.nom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriorite = prioriteFilter === "all" || workOrder.priorite === prioriteFilter;
    const matchesStatut = statutFilter === "all" || workOrder.statut === statutFilter;
    return matchesSearch && matchesPriorite && matchesStatut;
  });

  // CRUD operations
  const handleCreateWorkOrder = async (workOrderData: WorkOrder) => {
    setIsLoading(true);
    try {
      const payload: any = {
        titre: workOrderData.title,
        description: workOrderData.description,
        dateCreation: new Date().toISOString(),
        priorité: workOrderData.priorite,
        statut: workOrderData.statut || "EN_ATTENTE",
        assignedTo: workOrderData.assigneA?.id ? Number(workOrderData.assigneA.id) : null,
      };
      const created = await api.workOrders.create(payload);
      const mapped: WorkOrder = {
        id: String(created.id),
        title: created.titre,
        description: created.description,
        dateEcheance: created.dateCreation ? new Date(created.dateCreation).toISOString().split('T')[0] : "",
        priorite: created.priorité || "MOYENNE",
        machine: { id: "", nom: "", emplacement: "" },
        assigneA: { id: created.assignedTo ? String(created.assignedTo) : "", nom: "", role: "" },
        statut: created.statut || "EN_ATTENTE",
        createdAt: created.dateCreation ? new Date(created.dateCreation).toISOString().split('T')[0] : "",
        interventionsCount: (created.ordreInterventions && Array.isArray(created.ordreInterventions)) ? created.ordreInterventions.length : 0,
      };
      setWorkOrders([...workOrders, mapped]);
      setIsCreateDialogOpen(false);
      toast({
        title: "Ordre de travail créé",
        description: `L'ordre de travail ${workOrderData.title} a été créé avec succès.`
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'ordre de travail.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditWorkOrder = async (workOrderData: WorkOrder) => {
    setIsLoading(true);
    try {
      const payload: any = {
        id: Number(workOrderData.id),
        titre: workOrderData.title,
        description: workOrderData.description,
        dateCreation: new Date(workOrderData.createdAt || new Date()).toISOString(),
        priorité: workOrderData.priorite,
        statut: workOrderData.statut,
        assignedTo: workOrderData.assigneA?.id ? Number(workOrderData.assigneA.id) : null,
      };
      const updated = await api.workOrders.update(payload);
      const mapped: WorkOrder = {
        id: String(updated.id),
        title: updated.titre,
        description: updated.description,
        dateEcheance: updated.dateCreation ? new Date(updated.dateCreation).toISOString().split('T')[0] : workOrderData.dateEcheance,
        priorite: updated.priorité || workOrderData.priorite,
        machine: { id: "", nom: "", emplacement: "" },
        assigneA: { id: updated.assignedTo ? String(updated.assignedTo) : workOrderData.assigneA.id, nom: "", role: "" },
        statut: updated.statut || workOrderData.statut,
        createdAt: updated.dateCreation ? new Date(updated.dateCreation).toISOString().split('T')[0] : workOrderData.createdAt,
        interventionsCount: (updated.ordreInterventions && Array.isArray(updated.ordreInterventions)) ? updated.ordreInterventions.length : (workOrderData.interventionsCount || 0),
      };
      setWorkOrders(workOrders.map(wo => wo.id === workOrderData.id ? mapped : wo));
      setIsEditDialogOpen(false);
      setSelectedWorkOrder(null);
      toast({
        title: "Ordre de travail modifié",
        description: `L'ordre de travail ${workOrderData.title} a été modifié avec succès.`
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification de l'ordre de travail.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWorkOrder = async () => {
    if (!selectedWorkOrder) return;
    
    setIsLoading(true);
    try {
      await api.workOrders.remove(Number(selectedWorkOrder.id));
      setWorkOrders(workOrders.filter(wo => wo.id !== selectedWorkOrder.id));
      setIsDeleteDialogOpen(false);
      setSelectedWorkOrder(null);
      toast({
        title: "Ordre de travail supprimé",
        description: `L'ordre de travail ${selectedWorkOrder.title} a été supprimé avec succès.`
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'ordre de travail.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    { title: "Total Ordres", value: workOrders.length, color: "blue" },
    { title: "En attente", value: workOrders.filter(wo => wo.statut === "EN_ATTENTE").length, color: "blue" },
    { title: "En cours", value: workOrders.filter(wo => wo.statut === "EN_COURS").length, color: "yellow" },
    { title: "Terminés", value: workOrders.filter(wo => wo.statut === "TERMINE").length, color: "green" }
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
                  Ordres de Travail
                </h1>
                <p className="text-white/70">
                  Gérez les ordres de travail et leurs interventions
                </p>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/80">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvel ordre
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-white/20 max-w-4xl">
                  <DialogHeader>
                    <DialogTitle className="text-white">Nouvel ordre de travail</DialogTitle>
                    <DialogDescription className="text-white/70">
                      Créer un nouvel ordre de travail dans le système.
                    </DialogDescription>
                  </DialogHeader>
                  <WorkOrderForm
                    onSubmit={handleCreateWorkOrder}
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
                        <ClipboardList className={`h-6 w-6 ${
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
                    <ClipboardList className="h-5 w-5" />
                    <span>Liste des ordres de travail</span>
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
                      placeholder="Rechercher par titre, machine ou assigné..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                  </div>
                  <Select value={prioriteFilter} onValueChange={setPrioriteFilter}>
                    <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Priorité" />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/20">
                      <SelectItem value="all" className="text-white hover:bg-white/10">Toutes</SelectItem>
                      <SelectItem value="URGENTE" className="text-white hover:bg-white/10">Urgente</SelectItem>
                      <SelectItem value="ELEVEE" className="text-white hover:bg-white/10">Élevée</SelectItem>
                      <SelectItem value="MOYENNE" className="text-white hover:bg-white/10">Moyenne</SelectItem>
                      <SelectItem value="BASSE" className="text-white hover:bg-white/10">Basse</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statutFilter} onValueChange={setStatutFilter}>
                    <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/20">
                      <SelectItem value="all" className="text-white hover:bg-white/10">Tous</SelectItem>
                      <SelectItem value="EN_ATTENTE" className="text-white hover:bg-white/10">En attente</SelectItem>
                      <SelectItem value="EN_COURS" className="text-white hover:bg-white/10">En cours</SelectItem>
                      <SelectItem value="TERMINE" className="text-white hover:bg-white/10">Terminé</SelectItem>
                      <SelectItem value="ANNULE" className="text-white hover:bg-white/10">Annulé</SelectItem>
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
                        <TableHead className="text-white/80 font-medium">Ordre</TableHead>
                        <TableHead className="text-white/80 font-medium">Machine</TableHead>
                        <TableHead className="text-white/80 font-medium">Assigné à</TableHead>
                        <TableHead className="text-white/80 font-medium">Priorité</TableHead>
                        <TableHead className="text-white/80 font-medium">Statut</TableHead>
                        <TableHead className="text-white/80 font-medium">Échéance</TableHead>
                        <TableHead className="text-white/80 font-medium">Interventions</TableHead>
                        <TableHead className="text-white/80 font-medium text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredWorkOrders.map((workOrder) => (
                        <TableRow key={workOrder.id} className="border-b border-white/5 hover:bg-white/5">
                          <TableCell>
                            <div>
                              <div className="font-medium text-white">{workOrder.title}</div>
                              <div className="text-sm text-white/60">#{workOrder.id}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="text-white">{workOrder.machine.nom}</div>
                              <div className="text-sm text-white/60">{workOrder.machine.emplacement}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-medium">
                                  {workOrder.assigneA.nom.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <div className="text-white text-sm">{workOrder.assigneA.nom}</div>
                                <div className="text-white/60 text-xs">{workOrder.assigneA.role}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn("border", getPrioriteColor(workOrder.priorite))}>
                              {workOrder.priorite}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn("border flex items-center gap-1", getStatutColor(workOrder.statut))}>
                              {getStatutIcon(workOrder.statut)}
                              {workOrder.statut.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1 text-white">
                              <Calendar className="h-4 w-4 text-white/60" />
                              <span>{new Date(workOrder.dateEcheance).toLocaleDateString('fr-FR')}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-white text-center">
                              {workOrder.interventionsCount || 0}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end space-x-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0 text-white hover:bg-white/10">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="glass border-white/20">
                                  <DropdownMenuLabel className="text-white">Actions</DropdownMenuLabel>
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      setSelectedWorkOrder(workOrder);
                                      setIsDetailModalOpen(true);
                                    }}
                                    className="text-white hover:bg-white/10"
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    Voir détails
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      setSelectedWorkOrder(workOrder);
                                      setIsEditDialogOpen(true);
                                    }}
                                    className="text-white hover:bg-white/10"
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Modifier
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="bg-white/20" />
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      setSelectedWorkOrder(workOrder);
                                      setIsDeleteDialogOpen(true);
                                    }}
                                    className="text-red-400 hover:bg-red-500/10"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Supprimer
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {filteredWorkOrders.length === 0 && (
                  <div className="text-center py-8 text-white/60">
                    Aucun ordre de travail trouvé
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="glass border-white/20 max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-white">Modifier l'ordre de travail</DialogTitle>
            <DialogDescription className="text-white/70">
              Modifiez les informations de l'ordre de travail.
            </DialogDescription>
          </DialogHeader>
          {selectedWorkOrder && (
            <WorkOrderForm
              workOrder={selectedWorkOrder}
              onSubmit={handleEditWorkOrder}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedWorkOrder(null);
              }}
              isLoading={isLoading}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Detail Modal */}
      {selectedWorkOrder && (
        <WorkOrderDetailModal
          workOrder={selectedWorkOrder}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedWorkOrder(null);
          }}
        />
      )}

      {/* Delete Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedWorkOrder(null);
        }}
        onConfirm={handleDeleteWorkOrder}
        title="Supprimer l'ordre de travail"
        description={`Êtes-vous sûr de vouloir supprimer l'ordre de travail "${selectedWorkOrder?.title}" ? Cette action est irréversible.`}
        itemName={selectedWorkOrder?.title || ""}
        isLoading={isLoading}
      />
    </div>
  );
};

export default WorkOrdersPage;