import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Asset {
  id?: string;
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

interface AssetFormProps {
  asset?: Asset;
  onSubmit: (asset: Asset) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const assetTypes = [
  "Ligne de production",
  "Robot de soudure",
  "Système de convoyage",
  "Presse hydraulique",
  "Tour CNC",
  "Compresseur",
  "Équipement de test",
  "Système électrique",
  "Autre"
];

const locations = [
  "Atelier A - Zone 1",
  "Atelier A - Zone 2",
  "Atelier A - Central",
  "Atelier B - Zone 1",
  "Atelier B - Zone 2",
  "Atelier C - Zone 1",
  "Atelier D - Zone 1",
  "Salle des machines",
  "Extérieur",
  "Entrepôt"
];

export const AssetForm = ({ asset, onSubmit, onCancel, isLoading = false }: AssetFormProps) => {
  const [formData, setFormData] = useState<Asset>({
    name: asset?.name || "",
    model: asset?.model || "",
    serialNumber: asset?.serialNumber || "",
    type: asset?.type || "",
    location: asset?.location || "",
    status: asset?.status || "operational",
    condition: asset?.condition || "good",
    lastMaintenance: asset?.lastMaintenance || "",
    nextMaintenance: asset?.nextMaintenance || "",
    installedDate: asset?.installedDate || "",
    manufacturer: asset?.manufacturer || "",
    criticality: asset?.criticality || "medium",
    description: asset?.description || "",
    ...asset
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lastMaintenanceDate, setLastMaintenanceDate] = useState<Date | undefined>(
    asset?.lastMaintenance ? new Date(asset.lastMaintenance.split('/').reverse().join('-')) : undefined
  );
  const [nextMaintenanceDate, setNextMaintenanceDate] = useState<Date | undefined>(
    asset?.nextMaintenance ? new Date(asset.nextMaintenance.split('/').reverse().join('-')) : undefined
  );
  const [installedDate, setInstalledDate] = useState<Date | undefined>(
    asset?.installedDate ? new Date(asset.installedDate.split('/').reverse().join('-')) : undefined
  );

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    }

    if (!formData.model.trim()) {
      newErrors.model = "Le modèle est requis";
    }

    if (!formData.serialNumber.trim()) {
      newErrors.serialNumber = "Le numéro de série est requis";
    }

    if (!formData.type) {
      newErrors.type = "Le type est requis";
    }

    if (!formData.location) {
      newErrors.location = "La localisation est requise";
    }

    if (!formData.manufacturer.trim()) {
      newErrors.manufacturer = "Le fabricant est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof Asset, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleDateChange = (date: Date | undefined, field: 'lastMaintenance' | 'nextMaintenance' | 'installedDate') => {
    if (date) {
      const formattedDate = format(date, "dd/MM/yyyy");
      setFormData(prev => ({ ...prev, [field]: formattedDate }));
      
      if (field === 'lastMaintenance') setLastMaintenanceDate(date);
      else if (field === 'nextMaintenance') setNextMaintenanceDate(date);
      else if (field === 'installedDate') setInstalledDate(date);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">Nom de l'équipement *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            placeholder="Ex: Ligne Production A1"
            disabled={isLoading}
          />
          {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="model" className="text-white">Modèle *</Label>
          <Input
            id="model"
            value={formData.model}
            onChange={(e) => handleInputChange("model", e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            placeholder="Ex: ProLine-5000"
            disabled={isLoading}
          />
          {errors.model && <p className="text-destructive text-sm">{errors.model}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="serialNumber" className="text-white">Numéro de série *</Label>
          <Input
            id="serialNumber"
            value={formData.serialNumber}
            onChange={(e) => handleInputChange("serialNumber", e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            placeholder="Ex: PL5000-2023-001"
            disabled={isLoading}
          />
          {errors.serialNumber && <p className="text-destructive text-sm">{errors.serialNumber}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="manufacturer" className="text-white">Fabricant *</Label>
          <Input
            id="manufacturer"
            value={formData.manufacturer}
            onChange={(e) => handleInputChange("manufacturer", e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            placeholder="Ex: TechProd Solutions"
            disabled={isLoading}
          />
          {errors.manufacturer && <p className="text-destructive text-sm">{errors.manufacturer}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type" className="text-white">Type d'équipement *</Label>
          <Select 
            value={formData.type} 
            onValueChange={(value) => handleInputChange("type", value)}
            disabled={isLoading}
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent className="glass border-white/20">
              {assetTypes.map(type => (
                <SelectItem key={type} value={type} className="text-white hover:bg-white/10">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && <p className="text-destructive text-sm">{errors.type}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="text-white">Localisation *</Label>
          <Select 
            value={formData.location} 
            onValueChange={(value) => handleInputChange("location", value)}
            disabled={isLoading}
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Sélectionner une localisation" />
            </SelectTrigger>
            <SelectContent className="glass border-white/20">
              {locations.map(location => (
                <SelectItem key={location} value={location} className="text-white hover:bg-white/10">
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.location && <p className="text-destructive text-sm">{errors.location}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status" className="text-white">Statut</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value: "operational" | "maintenance" | "down" | "retired") => handleInputChange("status", value)}
            disabled={isLoading}
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass border-white/20">
              <SelectItem value="operational" className="text-white hover:bg-white/10">Opérationnel</SelectItem>
              <SelectItem value="maintenance" className="text-white hover:bg-white/10">En maintenance</SelectItem>
              <SelectItem value="down" className="text-white hover:bg-white/10">Hors service</SelectItem>
              <SelectItem value="retired" className="text-white hover:bg-white/10">Retiré</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="condition" className="text-white">État</Label>
          <Select 
            value={formData.condition} 
            onValueChange={(value: "excellent" | "good" | "fair" | "poor") => handleInputChange("condition", value)}
            disabled={isLoading}
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass border-white/20">
              <SelectItem value="excellent" className="text-white hover:bg-white/10">Excellent</SelectItem>
              <SelectItem value="good" className="text-white hover:bg-white/10">Bon</SelectItem>
              <SelectItem value="fair" className="text-white hover:bg-white/10">Correct</SelectItem>
              <SelectItem value="poor" className="text-white hover:bg-white/10">Mauvais</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="criticality" className="text-white">Criticité</Label>
          <Select 
            value={formData.criticality} 
            onValueChange={(value: "low" | "medium" | "high" | "critical") => handleInputChange("criticality", value)}
            disabled={isLoading}
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass border-white/20">
              <SelectItem value="low" className="text-white hover:bg-white/10">Faible</SelectItem>
              <SelectItem value="medium" className="text-white hover:bg-white/10">Moyenne</SelectItem>
              <SelectItem value="high" className="text-white hover:bg-white/10">Élevée</SelectItem>
              <SelectItem value="critical" className="text-white hover:bg-white/10">Critique</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-white">Date d'installation</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/10",
                  !installedDate && "text-white/60"
                )}
                disabled={isLoading}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {installedDate ? format(installedDate, "dd/MM/yyyy") : "Sélectionner une date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 glass border-white/20" align="start">
              <Calendar
                mode="single"
                selected={installedDate}
                onSelect={(date) => handleDateChange(date, 'installedDate')}
                initialFocus
                locale={fr}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label className="text-white">Dernière maintenance</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/10",
                  !lastMaintenanceDate && "text-white/60"
                )}
                disabled={isLoading}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {lastMaintenanceDate ? format(lastMaintenanceDate, "dd/MM/yyyy") : "Sélectionner une date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 glass border-white/20" align="start">
              <Calendar
                mode="single"
                selected={lastMaintenanceDate}
                onSelect={(date) => handleDateChange(date, 'lastMaintenance')}
                initialFocus
                locale={fr}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label className="text-white">Prochaine maintenance</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/10",
                  !nextMaintenanceDate && "text-white/60"
                )}
                disabled={isLoading}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {nextMaintenanceDate ? format(nextMaintenanceDate, "dd/MM/yyyy") : "Sélectionner une date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 glass border-white/20" align="start">
              <Calendar
                mode="single"
                selected={nextMaintenanceDate}
                onSelect={(date) => handleDateChange(date, 'nextMaintenance')}
                initialFocus
                locale={fr}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-white">Description (optionnel)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/60 min-h-[100px]"
          placeholder="Description détaillée de l'équipement..."
          disabled={isLoading}
        />
      </div>

      <DialogFooter className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="border-white/20 text-white hover:bg-white/10"
        >
          <X className="h-4 w-4 mr-2" />
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-primary hover:bg-primary/80"
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Enregistrement..." : asset ? "Modifier" : "Créer"}
        </Button>
      </DialogFooter>
    </form>
  );
};