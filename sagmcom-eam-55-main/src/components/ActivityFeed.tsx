import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  User, 
  Plus, 
  Edit, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  time: string;
  type: "create" | "edit" | "login" | "validate" | "warning" | "info";
  details?: string;
}

const activities: ActivityItem[] = [
  {
    id: "1",
    user: "Marie Dubois",
    action: "Création ordre de travail #OT-2024-001",
    time: "Il y a 5 min",
    type: "create",
    details: "Machine: Presse hydraulique A"
  },
  {
    id: "2",
    user: "Pierre Martin",
    action: "Connexion au système",
    time: "Il y a 12 min",
    type: "login"
  },
  {
    id: "3",
    user: "Admin",
    action: "Modification rôle utilisateur",
    time: "Il y a 25 min",
    type: "edit",
    details: "Sophie Leroy: Technicien → ChefTech"
  },
  {
    id: "4",
    user: "Sophie Leroy",
    action: "Validation maintenance préventive",
    time: "Il y a 1h",
    type: "validate",
    details: "Machine: Convoyeur principal"
  },
  {
    id: "5",
    user: "Système",
    action: "Alerte maintenance programmée",
    time: "Il y a 2h",
    type: "warning",
    details: "Robot soudure - Maintenance due"
  }
];

const getActivityIcon = (type: string) => {
  switch (type) {
    case "create": return Plus;
    case "edit": return Edit;
    case "login": return User;
    case "validate": return CheckCircle;
    case "warning": return AlertTriangle;
    default: return Activity;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case "create": return "text-green-400";
    case "edit": return "text-blue-400";
    case "login": return "text-purple-400";
    case "validate": return "text-emerald-400";
    case "warning": return "text-yellow-400";
    default: return "text-gray-400";
  }
};

export function ActivityFeed() {
  return (
    <Card className="glass-card h-fit">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-white">
            <Activity className="h-5 w-5" />
            <span>Activité récente</span>
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">
            <Eye className="h-4 w-4 mr-1" />
            Tout voir
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const Icon = getActivityIcon(activity.type);
          return (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                "bg-white/10 backdrop-blur-sm"
              )}>
                <Icon className={cn("h-4 w-4", getActivityColor(activity.type))} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-white text-sm">{activity.user}</span>
                  <Badge variant="outline" className="text-xs border-white/20 text-white/60">
                    {activity.type}
                  </Badge>
                </div>
                <p className="text-sm text-white/80 mb-1">{activity.action}</p>
                {activity.details && (
                  <p className="text-xs text-white/60 mb-1">{activity.details}</p>
                )}
                <div className="flex items-center space-x-1 text-xs text-white/50">
                  <Clock className="h-3 w-3" />
                  <span>{activity.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}