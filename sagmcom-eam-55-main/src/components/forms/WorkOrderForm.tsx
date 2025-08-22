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
import { WorkOrder } from "@/pages/WorkOrders";

interface WorkOrderFormProps {
  workOrder?: WorkOrder;
  onSubmit: (workOrderData: WorkOrder) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

// Mock data for machines and users
const machines = [
  { id: "AST-001", nom: "Ligne Production A1", emplacement: "Atelier A - Zone 1" },
  { id: "AST-002", nom: "Robot Soudure R1", emplacement: "Atelier B - Zone 2" },
  { id: "AST-003", nom: "Convoyeur Principal", emplacement: "Atelier A - Central" },
  { id: "AST-004", nom: "Presse Hydraulique P1", emplacement: "Atelier C - Zone 1" },
  { id: "AST-005", nom: "Tour CNC T1", emplacement: "Atelier D - Zone 1" },
  { id: "AST-006", nom: "Compresseur Air C1", emplacement: "Salle des machines" }
];

const users = [
  { id: "1", nom: "Marie Dubois", role: "Chef Opérateur" },
  { id: "2", nom: "Pierre Martin", role: "Chef Technicien" },
  { id: "3", nom: "Sophie Leroy", role: "Technicien" },
  { id: "4", nom: "Jean Dupont", role: "Technicien" },
  { id: "5", nom: "Isabelle Moreau", role: "Administrateur" }
];

export const WorkOrderForm = ({ workOrder, onSubmit, onCancel, isLoading }: WorkOrderFormProps) => {
  const [formData, setFormData] = useState<WorkOrder>({
    id: "",
    title: "",
    description: "",
    dateEcheance: "",
    priorite: "MOYENNE",
    machine: {
      id: "",
      nom: "",
      emplacement: ""
    },
    assigneA: {
      id: "",
      nom: "",
      role: ""
    },
    statut: "EN_ATTENTE",
    createdAt: "",
    interventionsCount: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (workOrder) {
      setFormData(workOrder);
    }
  }, [workOrder]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Le titre est requis";
    }

    if (!formData.description.trim()) {
      newErrors.description = "La description est requise";
    }

    if (!formData.dateEcheance) {
      newErrors.dateEcheance = "La date d'échéance est requise";
    }

    if (!formData.machine.id) {
      newErrors.machine = "Une machine doit être sélectionnée";
    }

    if (!formData.assigneA.id) {
      newErrors.assigneA = "Un technicien doit être assigné";
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

  const handleMachineChange = (machineId: string) => {
    const selectedMachine = machines.find(m => m.id === machineId);
    if (selectedMachine) {
      setFormData({
        ...formData,
        machine: selectedMachine
      });
    }
  };

  const handleUserChange = (userId: string) => {
    const selectedUser = users.find(u => u.id === userId);
    if (selectedUser) {
      setFormData({
        ...formData,
        assigneA: selectedUser
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Titre */}
        <div className="md:col-span-2">
          <Label htmlFor="title" className="text-white">Titre de l'ordre de travail</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
            placeholder="Ex: Maintenance préventive..."
          />
          {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <Label htmlFor="description" className="text-white">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
            placeholder="Décrivez les travaux à effectuer..."
            rows={3}
          />
          {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* Machine */}
        <div>
          <Label htmlFor="machine" className="text-white">Machine/Équipement</Label>
          <Select value={formData.machine.id} onValueChange={handleMachineChange}>
            <SelectTrigger className="mt-1 bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Sélectionner une machine" />
            </SelectTrigger>
            <SelectContent className="glass border-white/20">
              {machines.map((machine) => (
                <SelectItem key={machine.id} value={machine.id} className="text-white hover:bg-white/10">
                  <div>
                    <div className="font-medium">{machine.nom}</div>
                    <div className="text-sm text-white/60">{machine.emplacement}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.machine && <p className="text-red-400 text-sm mt-1">{errors.machine}</p>}
        </div>

        {/* Assigné à */}
        <div>
          <Label htmlFor="assigneA" className="text-white">Assigné à</Label>
          <Select value={formData.assigneA.id} onValueChange={handleUserChange}>
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
          {errors.assigneA && <p className="text-red-400 text-sm mt-1">{errors.assigneA}</p>}
        </div>

        {/* Date d'échéance */}
        <div>
          <Label htmlFor="dateEcheance" className="text-white">Date d'échéance</Label>
          <div className="relative">
            <Input
              id="dateEcheance"
              type="date"
              value={formData.dateEcheance}
              onChange={(e) => setFormData({ ...formData, dateEcheance: e.target.value })}
              className="mt-1 bg-white/10 border-white/20 text-white"
            />
            <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60 pointer-events-none" />
          </div>
          {errors.dateEcheance && <p className="text-red-400 text-sm mt-1">{errors.dateEcheance}</p>}
        </div>

        {/* Priorité */}
        <div>
          <Label htmlFor="priorite" className="text-white">Priorité</Label>
          <Select value={formData.priorite} onValueChange={(value: any) => setFormData({ ...formData, priorite: value })}>
            <SelectTrigger className="mt-1 bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass border-white/20">
              <SelectItem value="BASSE" className="text-white hover:bg-white/10">Basse</SelectItem>
              <SelectItem value="MOYENNE" className="text-white hover:bg-white/10">Moyenne</SelectItem>
              <SelectItem value="ELEVEE" className="text-white hover:bg-white/10">Élevée</SelectItem>
              <SelectItem value="URGENTE" className="text-white hover:bg-white/10">Urgente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Statut (only for edit mode) */}
        {workOrder && (
          <div>
            <Label htmlFor="statut" className="text-white">Statut</Label>
            <Select value={formData.statut} onValueChange={(value: any) => setFormData({ ...formData, statut: value })}>
              <SelectTrigger className="mt-1 bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass border-white/20">
                <SelectItem value="EN_ATTENTE" className="text-white hover:bg-white/10">En attente</SelectItem>
                <SelectItem value="EN_COURS" className="text-white hover:bg-white/10">En cours</SelectItem>
                <SelectItem value="TERMINE" className="text-white hover:bg-white/10">Terminé</SelectItem>
                <SelectItem value="ANNULE" className="text-white hover:bg-white/10">Annulé</SelectItem>
              </SelectContent>
            </Select>
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
          {workOrder ? "Modifier" : "Créer"}
        </Button>
      </div>
    </form>
  );
};