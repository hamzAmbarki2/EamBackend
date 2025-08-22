import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Package, MapPin, Calendar, Wrench, AlertTriangle, CheckCircle, XCircle, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

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
  description?: string;
}

interface AssetDetailModalProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
}

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

const getStatusLabel = (status: string) => {
  switch (status) {
    case "operational": return "Opérationnel";
    case "maintenance": return "En maintenance";
    case "down": return "Hors service";
    case "retired": return "Retiré";
    default: return status;
  }
};

const getConditionLabel = (condition: string) => {
  switch (condition) {
    case "excellent": return "Excellent";
    case "good": return "Bon";
    case "fair": return "Correct";
    case "poor": return "Mauvais";
    default: return condition;
  }
};

const getCriticalityLabel = (criticality: string) => {
  switch (criticality) {
    case "critical": return "Critique";
    case "high": return "Élevée";
    case "medium": return "Moyenne";
    case "low": return "Faible";
    default: return criticality;
  }
};

export const AssetDetailModal = ({ asset, isOpen, onClose }: AssetDetailModalProps) => {
  if (!asset) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="glass border-white/20 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Détails de l'équipement</DialogTitle>
          <DialogDescription className="text-white/70">
            Informations complètes sur l'équipement
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header avec informations principales */}
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Package className="h-10 w-10 text-white" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-2xl font-bold text-white">{asset.name}</h3>
                  <div className="flex items-center space-x-4 flex-wrap gap-2">
                    <Badge className={cn("border flex items-center space-x-1", getStatusColor(asset.status))}>
                      {getStatusIcon(asset.status)}
                      <span>{getStatusLabel(asset.status)}</span>
                    </Badge>
                    <Badge className={cn("border", getConditionColor(asset.condition))}>
                      État: {getConditionLabel(asset.condition)}
                    </Badge>
                    <Badge className={cn("border", getCriticalityColor(asset.criticality))}>
                      Criticité: {getCriticalityLabel(asset.criticality)}
                    </Badge>
                  </div>
                  <p className="text-white/70">ID: {asset.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informations techniques */}
            <Card className="glass-card">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Informations techniques
                </h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-white/60 text-sm">Modèle</p>
                    <p className="text-white font-medium">{asset.model}</p>
                  </div>
                  <Separator className="bg-white/20" />
                  <div>
                    <p className="text-white/60 text-sm">Numéro de série</p>
                    <p className="text-white font-medium">{asset.serialNumber}</p>
                  </div>
                  <Separator className="bg-white/20" />
                  <div>
                    <p className="text-white/60 text-sm">Type d'équipement</p>
                    <p className="text-white font-medium">{asset.type}</p>
                  </div>
                  <Separator className="bg-white/20" />
                  <div>
                    <p className="text-white/60 text-sm">Fabricant</p>
                    <p className="text-white font-medium">{asset.manufacturer}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Localisation et statut */}
            <Card className="glass-card">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Localisation et statut
                </h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-white/60 text-sm">Localisation</p>
                    <p className="text-white font-medium">{asset.location}</p>
                  </div>
                  <Separator className="bg-white/20" />
                  <div>
                    <p className="text-white/60 text-sm">Statut opérationnel</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusIcon(asset.status)}
                      <span className="text-white font-medium">{getStatusLabel(asset.status)}</span>
                    </div>
                  </div>
                  <Separator className="bg-white/20" />
                  <div>
                    <p className="text-white/60 text-sm">État général</p>
                    <p className="text-white font-medium">{getConditionLabel(asset.condition)}</p>
                  </div>
                  <Separator className="bg-white/20" />
                  <div>
                    <p className="text-white/60 text-sm">Niveau de criticité</p>
                    <p className="text-white font-medium">{getCriticalityLabel(asset.criticality)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informations de maintenance */}
          <Card className="glass-card">
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Wrench className="h-5 w-5 mr-2" />
                Maintenance et dates importantes
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-white/60" />
                  <div>
                    <p className="text-white/60 text-sm">Date d'installation</p>
                    <p className="text-white font-medium">{asset.installedDate}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Wrench className="h-5 w-5 text-white/60" />
                  <div>
                    <p className="text-white/60 text-sm">Dernière maintenance</p>
                    <p className="text-white font-medium">{asset.lastMaintenance}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-white/60" />
                  <div>
                    <p className="text-white/60 text-sm">Prochaine maintenance</p>
                    <p className="text-white font-medium">{asset.nextMaintenance}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description (si disponible) */}
          {asset.description && (
            <Card className="glass-card">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Description</h4>
                <p className="text-white/80 leading-relaxed">{asset.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Historique de maintenance (exemple de données supplémentaires) */}
          <Card className="glass-card">
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Historique récent</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <div>
                      <p className="text-white text-sm">Maintenance préventive</p>
                      <p className="text-white/60 text-xs">{asset.lastMaintenance}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Terminé</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Wrench className="h-4 w-4 text-blue-400" />
                    <div>
                      <p className="text-white text-sm">Inspection de routine</p>
                      <p className="text-white/60 text-xs">05/01/2024</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Terminé</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-yellow-400" />
                    <div>
                      <p className="text-white text-sm">Maintenance programmée</p>
                      <p className="text-white/60 text-xs">{asset.nextMaintenance}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
                    Planifié
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