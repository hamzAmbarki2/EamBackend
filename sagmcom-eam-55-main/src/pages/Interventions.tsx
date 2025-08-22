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
  Wrench,
  MoreHorizontal,
  Calendar,
  User,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle
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
import { InterventionForm } from "@/components/forms/InterventionForm";
import { InterventionDetailModal } from "@/components/forms/InterventionDetailModal";
import { DeleteConfirmationDialog } from "@/components/forms/DeleteConfirmationDialog";
import { useToast } from "@/hooks/use-toast";
import { AlertBanner } from "@/components/AlertBanner";
import { useEffect } from "react";
import { api } from "@/lib/api";

export interface Intervention {
  id: string;
  dateIntervention: string;
  description: string;
  rapport: string;
  statut: "PLANIFIEE" | "EN_COURS" | "TERMINEE" | "ANNULEE";
  ordreTravail: {
    id: string;
    title: string;
    machine: {
      nom: string;
      emplacement: string;
    };
  };
  technicien: {
    id: string;
    nom: string;
    role: string;
  };
  duree?: number; // en heures
  createdAt: string;
}

const initialInterventions: Intervention[] = [
  {
    id: "INT-001",
    dateIntervention: "2024-02-10",
    description: "Contrôle des filtres de la ligne A1",
    rapport: "Remplacement de 3 filtres usagés. Système opérationnel.",
    statut: "TERMINEE",
    ordreTravail: {
      id: "WO-001",
      title: "Maintenance préventive Ligne A1",
      machine: {
        nom: "Ligne Production A1",
        emplacement: "Atelier A - Zone 1"
      }
    },
    technicien: {
      id: "2",
      nom: "Pierre Martin",
      role: "Chef Technicien"
    },
    duree: 2.5,
    createdAt: "2024-02-08"
  },
  {
    id: "INT-002",
    dateIntervention: "2024-02-11",
    description: "Vérification système hydraulique",
    rapport: "Contrôle pression OK. Niveaux fluides ajustés.",
    statut: "TERMINEE",
    ordreTravail: {
      id: "WO-001",
      title: "Maintenance préventive Ligne A1",
      machine: {
        nom: "Ligne Production A1",
        emplacement: "Atelier A - Zone 1"
      }
    },
    technicien: {
      id: "3",
      nom: "Sophie Leroy",
      role: "Technicien"
    },
    duree: 1.5,
    createdAt: "2024-02-09"
  },
  {
    id: "INT-003",
    dateIntervention: "2024-02-12",
    description: "Diagnostic axes X et Y du robot",
    rapport: "",
    statut: "EN_COURS",
    ordreTravail: {
      id: "WO-002",
      title: "Réparation Robot Soudure",
      machine: {
        nom: "Robot Soudure R1",
        emplacement: "Atelier B - Zone 2"
      }
    },
    technicien: {
      id: "3",
      nom: "Sophie Leroy",
      role: "Technicien"
    },
    duree: undefined,
    createdAt: "2024-02-10"
  },
  {
    id: "INT-004",
    dateIntervention: "2024-02-15",
    description: "Inspection convoyeur principal",
    rapport: "",
    statut: "PLANIFIEE",
    ordreTravail: {
      id: "WO-003",
      title: "Inspection Convoyeur",
      machine: {
        nom: "Convoyeur Principal",
        emplacement: "Atelier A - Central"
      }
    },
    technicien: {
      id: "6",
      nom: "Thomas Bernard",
      role: "Opérateur"
    },
    duree: undefined,
    createdAt: "2024-02-12"
  }
];

const getStatutColor = (statut: string) => {
  switch (statut) {
    case "PLANIFIEE": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "EN_COURS": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "TERMINEE": return "bg-green-500/20 text-green-400 border-green-500/30";
    case "ANNULEE": return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

const getStatutIcon = (statut: string) => {
  switch (statut) {
    case "PLANIFIEE": return <Clock className="h-4 w-4" />;
    case "EN_COURS": return <Wrench className="h-4 w-4" />;
    case "TERMINEE": return <CheckCircle2 className="h-4 w-4" />;
    case "ANNULEE": return <AlertTriangle className="h-4 w-4" />;
    default: return <Clock className="h-4 w-4" />;
  }
};

const InterventionsPage = () => {
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
  const [statutFilter, setStatutFilter] = useState<string>("all");
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();

  // Load interventions from backend on mount
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await api.interventions.list();
        const mapped: Intervention[] = (data || []).map((i: any) => ({
          id: String(i.id),
          dateIntervention: i.dateIntervention ? new Date(i.dateIntervention).toISOString().split('T')[0] : "",
          description: i.description,
          rapport: i.rapport || "",
          statut: (i.statut || "EN_COURS") as Intervention["statut"],
          ordreTravail: i.ordreTravail ? {
            id: String(i.ordreTravail.id),
            title: i.ordreTravail.titre || "",
            machine: { nom: i.ordreTravail.machine?.nom || "", emplacement: i.ordreTravail.machine?.emplacement || "" }
          } : { id: "", title: "", machine: { nom: "", emplacement: "" } },
          technicien: { id: "", nom: "", role: "" },
          duree: undefined,
          createdAt: i.dateCreation ? new Date(i.dateCreation).toISOString().split('T')[0] : "",
        }));
        setInterventions(mapped);
      } catch (e: any) {
        setError(e?.message || "Erreur de chargement des interventions");
      } finally {
        setLoading(false);
      }
    })();
  }, []);
 
  const filteredInterventions = interventions.filter(intervention => {
    const matchesSearch = intervention.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         intervention.ordreTravail.machine.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         intervention.technicien.nom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatut = statutFilter === "all" || intervention.statut === statutFilter;
    return matchesSearch && matchesStatut;
  });
 
  // CRUD operations
  const handleCreateIntervention = async (interventionData: Intervention) => {
    setIsLoading(true);
    try {
      const payload: any = {
        titre: interventionData.description?.slice(0, 60) || "Intervention",
        description: interventionData.description,
        dateCreation: new Date().toISOString(),
        priorité: "MOYENNE",
        statut: (interventionData.statut === "PLANIFIEE" ? "EN_ATTENTE" : interventionData.statut === "TERMINEE" ? "TERMINE" : interventionData.statut === "ANNULEE" ? "ANNULE" : "EN_COURS"),
        rapport: interventionData.rapport,
        dateIntervention: interventionData.dateIntervention ? new Date(interventionData.dateIntervention).toISOString() : null,
        ordreTravailId: interventionData.ordreTravail?.id ? Number(interventionData.ordreTravail.id) : null,
      };
      const created = await api.interventions.create(payload);
      const mapped: Intervention = {
        id: String(created.id),
        dateIntervention: created.dateIntervention ? new Date(created.dateIntervention).toISOString().split('T')[0] : "",
        description: created.description,
        rapport: created.rapport || "",
        statut: (created.statut === "EN_ATTENTE" ? "PLANIFIEE" : created.statut === "TERMINE" ? "TERMINEE" : created.statut === "ANNULE" ? "ANNULEE" : "EN_COURS"),
        ordreTravail: created.ordreTravail ? {
          id: String(created.ordreTravail.id),
          title: created.ordreTravail.titre || "",
          machine: { nom: created.ordreTravail.machine?.nom || "", emplacement: created.ordreTravail.machine?.emplacement || "" }
        } : { id: "", title: "", machine: { nom: "", emplacement: "" } },
        technicien: { id: "", nom: "", role: "" },
        duree: undefined,
        createdAt: created.dateCreation ? new Date(created.dateCreation).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      };
      setInterventions([...interventions, mapped]);
      setIsCreateDialogOpen(false);
      toast({
        title: "Intervention créée",
        description: `L'intervention a été créée avec succès.`
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'intervention.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
 
  const handleEditIntervention = async (interventionData: Intervention) => {
    setIsLoading(true);
    try {
      const payload: any = {
        id: Number(interventionData.id),
        titre: interventionData.description?.slice(0, 60) || "Intervention",
        description: interventionData.description,
        dateCreation: new Date(interventionData.createdAt || new Date()).toISOString(),
        priorité: "MOYENNE",
        statut: (interventionData.statut === "PLANIFIEE" ? "EN_ATTENTE" : interventionData.statut === "TERMINEE" ? "TERMINE" : interventionData.statut === "ANNULEE" ? "ANNULE" : "EN_COURS"),
        rapport: interventionData.rapport,
        dateIntervention: interventionData.dateIntervention ? new Date(interventionData.dateIntervention).toISOString() : null,
        ordreTravailId: interventionData.ordreTravail?.id ? Number(interventionData.ordreTravail.id) : null,
      };
      const updated = await api.interventions.update(payload);
      const mapped: Intervention = {
        id: String(updated.id),
        dateIntervention: updated.dateIntervention ? new Date(updated.dateIntervention).toISOString().split('T')[0] : interventionData.dateIntervention,
        description: updated.description,
        rapport: updated.rapport || interventionData.rapport,
        statut: (updated.statut === "EN_ATTENTE" ? "PLANIFIEE" : updated.statut === "TERMINE" ? "TERMINEE" : updated.statut === "ANNULE" ? "ANNULEE" : "EN_COURS"),
        ordreTravail: updated.ordreTravail ? {
          id: String(updated.ordreTravail.id),
          title: updated.ordreTravail.titre || interventionData.ordreTravail.title,
          machine: { nom: updated.ordreTravail.machine?.nom || "", emplacement: updated.ordreTravail.machine?.emplacement || "" }
        } : interventionData.ordreTravail,
        technicien: interventionData.technicien,
        duree: interventionData.duree,
        createdAt: updated.dateCreation ? new Date(updated.dateCreation).toISOString().split('T')[0] : interventionData.createdAt,
      };
      setInterventions(interventions.map(int => int.id === interventionData.id ? mapped : int));
      setIsEditDialogOpen(false);
      setSelectedIntervention(null);
      toast({
        title: "Intervention modifiée",
        description: `L'intervention a été modifiée avec succès.`
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification de l'intervention.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
 
  const handleDeleteIntervention = async () => {
    if (!selectedIntervention) return;
    
    setIsLoading(true);
    try {
      await api.interventions.remove(Number(selectedIntervention.id));
      setInterventions(interventions.filter(int => int.id !== selectedIntervention.id));
      setIsDeleteDialogOpen(false);
      setSelectedIntervention(null);
      toast({
        title: "Intervention supprimée",
        description: `L'intervention a été supprimée avec succès.`
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'intervention.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    { title: "Total Interventions", value: interventions.length, color: "blue" },
    { title: "Planifiées", value: interventions.filter(int => int.statut === "PLANIFIEE").length, color: "blue" },
    { title: "En cours", value: interventions.filter(int => int.statut === "EN_COURS").length, color: "yellow" },
    { title: "Terminées", value: interventions.filter(int => int.statut === "TERMINEE").length, color: "green" }
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
            {error && (
              <AlertBanner message={error} onRetry={() => location.reload()} />
            )}
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Interventions
                </h1>
                <p className="text-white/70">
                  Gérez les interventions techniques sur les équipements
                </p>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/80">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle intervention
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-white/20 max-w-4xl">
                  <DialogHeader>
                    <DialogTitle className="text-white">Nouvelle intervention</DialogTitle>
                    <DialogDescription className="text-white/70">
                      Planifier une nouvelle intervention technique.
                    </DialogDescription>
                  </DialogHeader>
                  <InterventionForm
                    onSubmit={handleCreateIntervention}
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
                        <Wrench className={`h-6 w-6 ${
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
                    <Wrench className="h-5 w-5" />
                    <span>Liste des interventions</span>
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
                      placeholder="Rechercher par description, machine ou technicien..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                  </div>
                  <Select value={statutFilter} onValueChange={setStatutFilter}>
                    <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/20">
                      <SelectItem value="all" className="text-white hover:bg.white/10">Tous</SelectItem>
                      <SelectItem value="PLANIFIEE" className="text-white hover:bg-white/10">Planifiée</SelectItem>
                      <SelectItem value="EN_COURS" className="text-white hover:bg-white/10">En cours</SelectItem>
                      <SelectItem value="TERMINEE" className="text-white hover:bg-white/10">Terminée</SelectItem>
                      <SelectItem value="ANNULEE" className="text.white hover:bg-white/10">Annulée</SelectItem>
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
                        <TableHead className="text-white/80 font-medium">Intervention</TableHead>
                        <TableHead className="text-white/80 font-medium">Ordre de travail</TableHead>
                        <TableHead className="text-white/80 font-medium">Technicien</TableHead>
                        <TableHead className="text-white/80 font-medium">Date</TableHead>
                        <TableHead className="text-white/80 font-medium">Statut</TableHead>
                        <TableHead className="text-white/80 font-medium">Durée</TableHead>
                        <TableHead className="text-white/80 font-medium">Rapport</TableHead>
                        <TableHead className="text-white/80 font-medium text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInterventions.map((intervention) => (
                        <TableRow key={intervention.id} className="border-b border-white/5 hover:bg-white/5">
                          <TableCell>
                            <div>
                              <div className="font-medium text-white">{intervention.description}</div>
                              <div className="text-sm text-white/60">#{intervention.id}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="text-white text-sm">{intervention.ordreTravail.title}</div>
                              <div className="text-white/60 text-xs">{intervention.ordreTravail.machine.nom}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-medium">
                                  {intervention.technicien.nom.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <div className="text-white text-sm">{intervention.technicien.nom}</div>
                                <div className="text-white/60 text-xs">{intervention.technicien.role}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items.center space-x-1 text-white">
                              <Calendar className="h-4 w-4 text-white/60" />
                              <span>{new Date(intervention.dateIntervention).toLocaleDateString('fr-FR')}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn("border flex items-center gap-1", getStatutColor(intervention.statut))}>
                              {getStatutIcon(intervention.statut)}
                              {intervention.statut.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-white">
                              {intervention.duree ? `${intervention.duree}h` : '-'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <FileText className="h-4 w-4 text-white/60" />
                              <span className="text-white text-sm">
                                {intervention.rapport ? 'Complété' : 'En attente'}
                              </span>
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
                                      setSelectedIntervention(intervention);
                                      setIsDetailModalOpen(true);
                                    }}
                                    className="text-white hover:bg-white/10"
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    Voir détails
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      setSelectedIntervention(intervention);
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
                                      setSelectedIntervention(intervention);
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

                {filteredInterventions.length === 0 && (
                  <div className="text-center py-8 text-white/60">
                    Aucune intervention trouvée
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
            <DialogTitle className="text-white">Modifier l'intervention</DialogTitle>
            <DialogDescription className="text-white/70">
              Modifiez les informations de l'intervention.
            </DialogDescription>
          </DialogHeader>
          {selectedIntervention && (
            <InterventionForm
              intervention={selectedIntervention}
              onSubmit={handleEditIntervention}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedIntervention(null);
              }}
              isLoading={isLoading}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Detail Modal */}
      {selectedIntervention && (
        <InterventionDetailModal
          intervention={selectedIntervention}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedIntervention(null);
          }}
        />
      )}

      {/* Delete Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedIntervention(null);
        }}
        onConfirm={handleDeleteIntervention}
        title="Supprimer l'intervention"
        description={`Êtes-vous sûr de vouloir supprimer cette intervention ? Cette action est irréversible.`}
        itemName={selectedIntervention?.description || ""}
        isLoading={isLoading}
      />
    </div>
  );
};

export default InterventionsPage;