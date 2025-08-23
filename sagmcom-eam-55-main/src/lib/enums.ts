export type Option = { value: string; label: string };

export const roleOptions: Option[] = [
	{ value: "ADMIN", label: "Administrateur" },
	{ value: "CHEFOP", label: "Chef Opérateur" },
	{ value: "CHEFTECH", label: "Chef Technicien" },
	{ value: "TECHNICIEN", label: "Technicien" },
];

export const departmentOptions: Option[] = [
	{ value: "PRODUCTION", label: "Production" },
	{ value: "MAINTENANCE", label: "Maintenance" },
	{ value: "QUALITÉ", label: "Qualité" },
	{ value: "LOGISTIQUE", label: "Logistique" },
	{ value: "IT", label: "IT" },
];

export const userStatusOptions: Option[] = [
	{ value: "ACTIVE", label: "Actif" },
	{ value: "INACTIVE", label: "Inactif" },
	{ value: "PENDING", label: "En attente" },
	{ value: "SUSPENDED", label: "Suspendu" },
	{ value: "ARCHIVED", label: "Archivé" },
];

export const workOrderPriorityOptions: Option[] = [
	{ value: "BASSE", label: "Basse" },
	{ value: "MOYENNE", label: "Moyenne" },
	{ value: "ELEVEE", label: "Élevée" },
	{ value: "URGENTE", label: "Urgente" },
];

export const commonStatusOptions: Option[] = [
	{ value: "EN_ATTENTE", label: "En attente" },
	{ value: "EN_COURS", label: "En cours" },
	{ value: "TERMINE", label: "Terminé" },
	{ value: "ANNULE", label: "Annulé" },
];

export const assetStatusOptions: Option[] = [
	{ value: "OPERATIONAL", label: "Opérationnel" },
	{ value: "MAINTENANCE", label: "En maintenance" },
	{ value: "DOWN", label: "Hors service" },
	{ value: "RETIRED", label: "Retiré" },
];

export const conditionOptions: Option[] = [
	{ value: "EXCELLENT", label: "Excellent" },
	{ value: "GOOD", label: "Bon" },
	{ value: "FAIR", label: "Moyen" },
	{ value: "POOR", label: "Mauvais" },
];

export const criticalityOptions: Option[] = [
	{ value: "CRITICAL", label: "Critique" },
	{ value: "HIGH", label: "Élevée" },
	{ value: "MEDIUM", label: "Moyenne" },
	{ value: "LOW", label: "Faible" },
];

export function labelFor(options: Option[], value?: string): string {
	if (!value) return "";
	const found = options.find(o => o.value === value);
	return found ? found.label : value;
}