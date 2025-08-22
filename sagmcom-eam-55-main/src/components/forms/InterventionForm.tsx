import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Intervention } from "@/pages/Interventions";

interface InterventionFormProps {
  intervention?: Intervention;
  onSubmit: (interventionData: Intervention) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

// Mock data for work orders and users
const workOrders = [
  {
    id: "WO-001",
    title: "Maintenance préventive Ligne A1",
    machine: { nom: "Ligne Production A1", emplacement: "Atelier A - Zone 1" }
  },
  {
    id: "WO-002",
    title: "Réparation Robot Soudure",
    machine: { nom: "Robot Soudure R1", emplacement: "Atelier B - Zone 2" }
  },
  {
    id: "WO-003",
    title: "Inspection Convoyeur",
    machine: { nom: "Convoyeur Principal", emplacement: "Atelier A - Central" }
  }
];

const users = [
  { id: "1", nom: "Marie Dubois", role: "Chef Opérateur" },
  { id: "2", nom: "Pierre Martin", role: "Chef Technicien" },
  { id: "3", nom: "Sophie Leroy", role: "Technicien" },
  { id: "4", nom: "Jean Dupont", role: "Technicien" },
  { id: "5", nom: "Isabelle Moreau", role: "Administrateur" },
  
];

export const InterventionForm = ({ intervention, onSubmit, onCancel, isLoading }: InterventionFormProps) => {
  const [formData, setFormData] = useState<Intervention>({
    id: "",
    dateIntervention: "",
    description: "",
    rapport: "",
    statut: "PLANIFIEE",
    ordreTravail: {
      id: "",
      title: "",
      machine: {
        nom: "",
        emplacement: ""
      }
    },
    technicien: {
      id: "",
      nom: "",
      role: ""
    },
    duree: undefined,
    createdAt: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (intervention) {
      setFormData(intervention);
    }
  }, [intervention]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = "La description est requise";
    }

    if (!formData.dateIntervention) {
      newErrors.dateIntervention = "La date d'intervention est requise";
    }

    if (!formData.ordreTravail.id) {
      newErrors.ordreTravail = "Un ordre de travail doit être sélectionné";
    }

    if (!formData.technicien.id) {
      newErrors.technicien = "Un technicien doit être assigné";
    }

    if (formData.duree !== undefined && formData.duree < 0) {
      newErrors.duree = "La durée doit être positive";
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

  const handleWorkOrderChange = (workOrderId: string) => {
    const selectedWorkOrder = workOrders.find(wo => wo.id === workOrderId);
    if (selectedWorkOrder) {
      setFormData({
        ...formData,
        ordreTravail: selectedWorkOrder
      });
    }
  };

  const handleTechnicienChange = (userId: string) => {
    const selectedUser = users.find(u => u.id === userId);
    if (selectedUser) {
      setFormData({
        ...formData,
        technicien: selectedUser
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Description */}
        <div className="md:col-span-2">
          <Label htmlFor="description" className="text-white">Description de l'intervention</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
            placeholder="Décrivez l'intervention à effectuer..."
            rows={3}
          />
          {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* Ordre de travail */}
        <div>
          <Label htmlFor="ordreTravail" className="text-white">Ordre de travail</Label>
          <Select value={formData.ordreTravail.id} onValueChange={handleWorkOrderChange}>
            <SelectTrigger className="mt-1 bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Sélectionner un ordre de travail" />
            </SelectTrigger>
            <SelectContent className="glass border-white/20">
              {workOrders.map((workOrder) => (
                <SelectItem key={workOrder.id} value={workOrder.id} className="text-white hover:bg-white/10">
                  <div>
                    <div className="font-medium">{workOrder.title}</div>
                    <div className="text-sm text-white/60">{workOrder.machine.nom}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.ordreTravail && <p className="text-red-400 text-sm mt-1">{errors.ordreTravail}</p>}
        </div>

        {/* Technicien */}
        <div>
          <Label htmlFor="technicien" className="text-white">Technicien assigné</Label>
          <Select value={formData.technicien.id} onValueChange={handleTechnicienChange}>
            <SelectTrigger className="mt-1 bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Sélectionner un technicien" />
            </SelectTrigger>
            <SelectContent className="glass border-white/20">
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id} className="text-white hover:bg-white/10">
                  <div>
                    <div className="font-medium">{user.nom}</div>
                    <div className="text-sm text-white/60">{user.role}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.technicien && <p className="text-red-400 text-sm mt-1">{errors.technicien}</p>}
        </div>

        {/* Date d'intervention */}
        <div>
          <Label htmlFor="dateIntervention" className="text-white">Date d'intervention</Label>
          <div className="relative">
            <Input
              id="dateIntervention"
              type="date"
              value={formData.dateIntervention}
              onChange={(e) => setFormData({ ...formData, dateIntervention: e.target.value })}
              className="mt-1 bg-white/10 border-white/20 text-white"
            />
            <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60 pointer-events-none" />
          </div>
          {errors.dateIntervention && <p className="text-red-400 text-sm mt-1">{errors.dateIntervention}</p>}
        </div>

        {/* Durée */}
        <div>
          <Label htmlFor="duree" className="text-white">Durée estimée (heures)</Label>
          <Input
            id="duree"
            type="number"
            step="0.5"
            min="0"
            value={formData.duree || ""}
            onChange={(e) => setFormData({ 
              ...formData, 
              duree: e.target.value ? parseFloat(e.target.value) : undefined 
            })}
            className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
            placeholder="Ex: 2.5"
          />
          {errors.duree && <p className="text-red-400 text-sm mt-1">{errors.duree}</p>}
        </div>

        {/* Statut */}
        <div>
          <Label htmlFor="statut" className="text-white">Statut</Label>
          <Select value={formData.statut} onValueChange={(value: any) => setFormData({ ...formData, statut: value })}>
            <SelectTrigger className="mt-1 bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass border-white/20">
              <SelectItem value="PLANIFIEE" className="text-white hover:bg-white/10">Planifiée</SelectItem>
              <SelectItem value="EN_COURS" className="text-white hover:bg-white/10">En cours</SelectItem>
              <SelectItem value="TERMINEE" className="text-white hover:bg-white/10">Terminée</SelectItem>
              <SelectItem value="ANNULEE" className="text-white hover:bg-white/10">Annulée</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Rapport (only for completed interventions) */}
        {(formData.statut === "TERMINEE" || formData.rapport) && (
          <div className="md:col-span-2">
            <Label htmlFor="rapport" className="text-white">Rapport d'intervention</Label>
            <Textarea
              id="rapport"
              value={formData.rapport}
              onChange={(e) => setFormData({ ...formData, rapport: e.target.value })}
              className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              placeholder="Décrivez les actions effectuées, les problèmes rencontrés, les pièces remplacées..."
              rows={4}
            />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-white/20">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-white/20 text-white hover:bg-white/10"
        >
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-primary hover:bg-primary/80"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {intervention ? "Modifier" : "Créer"}
        </Button>
      </div>
    </form>
  );
};