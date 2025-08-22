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
  Wrench,
  MapPin,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
  ClipboardList,
  Timer
} from "lucide-react";
import { Intervention } from "@/pages/Interventions";
import { cn } from "@/lib/utils";

interface InterventionDetailModalProps {
  intervention: Intervention;
  isOpen: boolean;
  onClose: () => void;
}

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

export const InterventionDetailModal = ({
  intervention,
  isOpen,
  onClose,
}: InterventionDetailModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass border-white/20 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-white text-xl">{intervention.description}</DialogTitle>
              <DialogDescription className="text-white/70">
                Intervention #{intervention.id}
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
          {/* Status */}
          <div className="flex items-center space-x-4">
            <Badge className={cn("border flex items-center gap-2", getStatutColor(intervention.statut))}>
              {getStatutIcon(intervention.statut)}
              {intervention.statut.replace('_', ' ')}
            </Badge>
            {intervention.duree && (
              <Badge variant="outline" className="border-white/20 text-white flex items-center gap-1">
                <Timer className="h-3 w-3" />
                {intervention.duree}h
              </Badge>
            )}
          </div>

          {/* Main Information */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Détails de l'intervention
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-white/80 text-sm font-medium mb-1">Description</h4>
                <p className="text-white">{intervention.description}</p>
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
                      <span className="text-white/60">Planifiée le:</span>
                      <span className="text-white">
                        {new Date(intervention.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Date d'intervention:</span>
                      <span className="text-white">
                        {new Date(intervention.dateIntervention).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    {intervention.duree && (
                      <div className="flex justify-between">
                        <span className="text-white/60">Durée:</span>
                        <span className="text-white">{intervention.duree} heures</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-white/80 text-sm font-medium mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Technicien
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/60">Nom:</span>
                      <span className="text-white">{intervention.technicien.nom}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Rôle:</span>
                      <span className="text-white">{intervention.technicien.role}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work Order Information */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Ordre de travail associé
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white/80 text-sm font-medium mb-1">Titre de l'ordre</h4>
                  <p className="text-white">{intervention.ordreTravail.title}</p>
                  <p className="text-white/60 text-sm">#{intervention.ordreTravail.id}</p>
                </div>
                <div>
                  <h4 className="text-white/80 text-sm font-medium mb-1">Machine</h4>
                  <p className="text-white">{intervention.ordreTravail.machine.nom}</p>
                  <p className="text-white/60 text-sm flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {intervention.ordreTravail.machine.emplacement}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rapport */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Rapport d'intervention
              </CardTitle>
            </CardHeader>
            <CardContent>
              {intervention.rapport ? (
                <div>
                  <p className="text-white">{intervention.rapport}</p>
                </div>
              ) : (
                <div className="text-white/70">
                  <p>
                    {intervention.statut === "PLANIFIEE" 
                      ? "Le rapport sera disponible une fois l'intervention terminée."
                      : intervention.statut === "EN_COURS"
                      ? "L'intervention est en cours. Le rapport sera disponible à la fin."
                      : "Aucun rapport n'a été rédigé pour cette intervention."
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline or Progress Indicator */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="h-5 w-5" />
                État d'avancement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Progression</span>
                  <span className="text-white">
                    {intervention.statut === "PLANIFIEE" && "En attente de démarrage"}
                    {intervention.statut === "EN_COURS" && "En cours d'exécution"}
                    {intervention.statut === "TERMINEE" && "Intervention terminée"}
                    {intervention.statut === "ANNULEE" && "Intervention annulée"}
                  </span>
                </div>
                
                {intervention.statut !== "ANNULEE" && (
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        intervention.statut === "PLANIFIEE" ? "w-0 bg-blue-500" :
                        intervention.statut === "EN_COURS" ? "w-1/2 bg-yellow-500" :
                        "w-full bg-green-500"
                      }`}
                    />
                  </div>
                )}

                {/* Additional info based on status */}
                <div className="text-sm text-white/60">
                  {intervention.statut === "PLANIFIEE" && (
                    <p>L'intervention est planifiée et en attente de démarrage par le technicien.</p>
                  )}
                  {intervention.statut === "EN_COURS" && (
                    <p>L'intervention est actuellement en cours d'exécution.</p>
                  )}
                  {intervention.statut === "TERMINEE" && (
                    <p>L'intervention a été complétée avec succès.</p>
                  )}
                  {intervention.statut === "ANNULEE" && (
                    <p>Cette intervention a été annulée.</p>
                  )}
                </div>
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