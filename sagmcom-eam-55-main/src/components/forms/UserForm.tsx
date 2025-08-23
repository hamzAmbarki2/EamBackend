import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { User, Save, X } from "lucide-react";
import { roleOptions, departmentOptions, userStatusOptions } from "@/lib/enums";

interface User {
  id?: string;
  name: string;
  email: string;
  phone: string;
  cin: string;
  password?: string;
  role: string;
  department: string;
  status: "active" | "inactive" | "pending";
  lastLogin?: string;
  createdAt?: string;
  avatar?: string;
}

interface UserFormProps {
  user?: User;
  onSubmit: (user: User) => void;
  onCancel: () => void;
  isLoading?: boolean;
  existingUsers?: User[];
}

const roles = roleOptions;
const departments = departmentOptions;
const statuses = userStatusOptions;

export const UserForm = ({ user, onSubmit, onCancel, isLoading = false, existingUsers = [] }: UserFormProps) => {
  const [formData, setFormData] = useState<User>({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    cin: user?.cin || "",
    password: user?.password || "",
    role: user?.role || "",
    department: user?.department || "",
    status: user?.status || "pending",
    ...user
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Le téléphone est requis";
    }

    if (!formData.cin.trim()) {
      newErrors.cin = "Le CIN est requis";
    } else if (!/^\d{8}$/.test(formData.cin)) {
      newErrors.cin = "Le CIN doit contenir 8 chiffres";
    } else {
      // Check if CIN is already used by another user
      const cinExists = existingUsers.some(u => 
        u.cin === formData.cin && u.id !== formData.id
      );
      if (cinExists) {
        newErrors.cin = "Ce CIN est déjà utilisé";
      }
    }

    if (!user && !formData.password?.trim()) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password && formData.password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
    }

    if (!formData.role) {
      newErrors.role = "Le rôle est requis";
    }

    if (!formData.department) {
      newErrors.department = "Le département est requis";
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

  const handleInputChange = (field: keyof User, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">Nom complet *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            placeholder="Ex: Marie Dubois"
            disabled={isLoading}
          />
          {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            placeholder="marie.dubois@sagemcom.com"
            disabled={isLoading}
          />
          {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-white">Téléphone *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            placeholder="+33 1 23 45 67 89"
            disabled={isLoading}
          />
          {errors.phone && <p className="text-destructive text-sm">{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cin" className="text-white">CIN *</Label>
          <Input
            id="cin"
            value={formData.cin}
            onChange={(e) => handleInputChange("cin", e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            placeholder="12345678"
            disabled={isLoading}
          />
          {errors.cin && <p className="text-destructive text-sm">{errors.cin}</p>}
        </div>

        {!user && (
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Mot de passe *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password || ""}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              placeholder="Mot de passe"
              disabled={isLoading}
            />
            {errors.password && <p className="text-destructive text-sm">{errors.password}</p>}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="role" className="text-white">Rôle *</Label>
          <Select 
            value={formData.role} 
            onValueChange={(value) => handleInputChange("role", value)}
            disabled={isLoading}
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Sélectionner un rôle" />
            </SelectTrigger>
            <SelectContent className="glass border-white/20">
              {roles.map(r => (
                <SelectItem key={r.value} value={r.value} className="text-white hover:bg-white/10">
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.role && <p className="text-destructive text-sm">{errors.role}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="department" className="text-white">Département *</Label>
          <Select 
            value={formData.department} 
            onValueChange={(value) => handleInputChange("department", value)}
            disabled={isLoading}
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Sélectionner un département" />
            </SelectTrigger>
            <SelectContent className="glass border-white/20">
              {departments.map(d => (
                <SelectItem key={d.value} value={d.value} className="text-white hover:bg-white/10">
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.department && <p className="text-destructive text-sm">{errors.department}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status" className="text-white">Statut</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value: "active" | "inactive" | "pending") => handleInputChange("status", value)}
            disabled={isLoading}
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass border-white/20">
              {statuses.map(s => (
                <SelectItem key={s.value} value={s.value.toLowerCase()} className="text-white hover:bg-white/10">
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
          {isLoading ? "Enregistrement..." : user ? "Modifier" : "Créer"}
        </Button>
      </DialogFooter>
    </form>
  );
};