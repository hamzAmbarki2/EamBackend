import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  User,
  Settings,
  MapPin,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X
} from "lucide-react";
import { WorkOrder } from "@/pages/WorkOrders";
import { cn } from "@/lib/utils";

interface WorkOrderDetailModalProps {
  workOrder: WorkOrder;
  isOpen: boolean;
  onClose: () => void;
}

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

export const WorkOrderDetailModal = ({
  workOrder,
  isOpen,
  onClose,
}: WorkOrderDetailModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass border-white/20 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-white text-xl">{workOrder.title}</DialogTitle>
              <DialogDescription className="text-white/70">
                Ordre de travail #{workOrder.id}
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Priority */}
          <div className="flex items-center space-x-4">
            <Badge className={cn("border flex items-center gap-2", getStatutColor(workOrder.statut))}>
              {getStatutIcon(workOrder.statut)}
              {workOrder.statut.replace('_', ' ')}
            </Badge>
            <Badge className={cn("border", getPrioriteColor(workOrder.priorite))}>
              Priorité: {workOrder.priorite}
            </Badge>
          </div>

          {/* Main Information */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-white/80 text-sm font-medium mb-1">Description</h4>
                <p className="text-white">{workOrder.description}</p>
              </div>

              <Separator className="bg-white/20" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white/80 text-sm font-medium mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Dates
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/60">Créé le:</span>
                      <span className="text-white">
                        {new Date(workOrder.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Échéance:</span>
                      <span className="text-white">
                        {new Date(workOrder.dateEcheance).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-white/80 text-sm font-medium mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Assignation
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/60">Assigné à:</span>
                      <span className="text-white">{workOrder.assigneA.nom}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Rôle:</span>
                      <span className="text-white">{workOrder.assigneA.role}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Machine Information */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Machine/Équipement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white/80 text-sm font-medium mb-1">Nom de la machine</h4>
                  <p className="text-white">{workOrder.machine.nom}</p>
                </div>
                <div>
                  <h4 className="text-white/80 text-sm font-medium mb-1 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Emplacement
                  </h4>
                  <p className="text-white">{workOrder.machine.emplacement}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interventions Summary */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Interventions
                </div>
                <Badge variant="outline" className="border-white/20 text-white">
                  {workOrder.interventionsCount || 0} intervention(s)
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {workOrder.interventionsCount && workOrder.interventionsCount > 0 ? (
                <div className="text-white/70">
                  <p>Cet ordre de travail contient {workOrder.interventionsCount} intervention(s).</p>
                  <p className="text-sm mt-2">
                    Consultez la section "Interventions" pour voir les détails de chaque intervention.
                  </p>
                </div>
              ) : (
                <div className="text-white/70">
                  <p>Aucune intervention n'a encore été planifiée pour cet ordre de travail.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline or Progress Indicator */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Statut de progression
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Progression estimée</span>
                  <span className="text-white">
                    {workOrder.statut === "EN_ATTENTE" && "0%"}
                    {workOrder.statut === "EN_COURS" && "50%"}
                    {workOrder.statut === "TERMINE" && "100%"}
                    {workOrder.statut === "ANNULE" && "Annulé"}
                  </span>
                </div>
                
                {workOrder.statut !== "ANNULE" && (
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        workOrder.statut === "EN_ATTENTE" ? "w-0 bg-blue-500" :
                        workOrder.statut === "EN_COURS" ? "w-1/2 bg-yellow-500" :
                        "w-full bg-green-500"
                      }`}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end pt-6 border-t border-white/20">
          <Button onClick={onClose} className="bg-primary hover:bg-primary/80">
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};