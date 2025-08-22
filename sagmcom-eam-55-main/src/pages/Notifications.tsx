import { useState } from "react";
import { AdminHeader } from "@/components/AdminHeader";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { 
  Search, 
  Download, 
  Bell,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "urgent" | "warning" | "info" | "success";
  time: string;
  read: boolean;
  actionUrl?: string;
}

type SidebarSize = "mini" | "compact" | "normal" | "wide";

const notifications: Notification[] = [
  {
    id: "1",
    title: "Maintenance urgente requise",
    message: "Le compresseur CAT-001 nécessite une maintenance immédiate",
    type: "urgent",
    time: "Il y a 2 minutes",
    read: false,
    actionUrl: "/admin/assets/CAT-001"
  },
  {
    id: "2",
    title: "Ordre de travail en retard",
    message: "OT-2024-001 dépasse la date d'échéance prévue",
    type: "warning",
    time: "Il y a 15 minutes",
    read: false,
    actionUrl: "/admin/work-orders/OT-2024-001"
  },
  {
    id: "3",
    title: "Rapport généré avec succès",
    message: "Le rapport mensuel de maintenance a été généré",
    type: "success",
    time: "Il y a 1 heure",
    read: true,
    actionUrl: "/admin/rapports"
  },
  {
    id: "4",
    title: "Nouvelle intervention planifiée",
    message: "INT-2024-006 programmée pour demain",
    type: "info",
    time: "Il y a 2 heures",
    read: true,
    actionUrl: "/admin/interventions"
  },
  {
    id: "5",
    title: "Température élevée détectée",
    message: "Capteur de température anormale sur la ligne 3",
    type: "warning",
    time: "Il y a 3 heures",
    read: false,
    actionUrl: "/admin/assets"
  }
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "urgent": return AlertTriangle;
    case "warning": return AlertCircle;
    case "info": return Info;
    case "success": return CheckCircle;
    default: return Bell;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case "urgent": return "text-red-600 bg-red-100 border-red-200";
    case "warning": return "text-orange-600 bg-orange-100 border-orange-200";
    case "info": return "text-blue-600 bg-blue-100 border-blue-200";
    case "success": return "text-green-600 bg-green-100 border-green-200";
    default: return "text-gray-600 bg-gray-100 border-gray-200";
  }
};

export default function Notifications() {
  const [sidebarSize, setSidebarSize] = useState<SidebarSize>("normal");
  const [notificationSearch, setNotificationSearch] = useState("");
  const [notificationFilter, setNotificationFilter] = useState<string>("all");
  const [notificationsList, setNotificationsList] = useState(notifications);

  const filteredNotifications = notificationsList.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(notificationSearch.toLowerCase()) ||
                         notification.message.toLowerCase().includes(notificationSearch.toLowerCase());
    const matchesFilter = notificationFilter === "all" || 
                         (notificationFilter === "unread" && !notification.read) ||
                         (notificationFilter === "read" && notification.read) ||
                         notification.type === notificationFilter;
    
    return matchesSearch && matchesFilter;
  });

  const unreadCount = notificationsList.filter(n => !n.read).length;

  const handleSidebarSizeChange = (direction: "prev" | "next" | "collapse" | "expand") => {
    const sizes: SidebarSize[] = ["mini", "compact", "normal", "wide"];
    const currentIndex = sizes.indexOf(sidebarSize);
    
    if (direction === "next" && currentIndex < sizes.length - 1) {
      setSidebarSize(sizes[currentIndex + 1]);
    } else if (direction === "prev" && currentIndex > 0) {
      setSidebarSize(sizes[currentIndex - 1]);
    } else if (direction === "collapse") {
      setSidebarSize("mini");
    } else if (direction === "expand") {
      setSidebarSize("normal");
    }
  };

  const markAsRead = (id: string) => {
    setNotificationsList(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotificationsList(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotificationsList(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <AdminSidebar sidebarSize={sidebarSize} />
      
      <div className={cn(
        "transition-all duration-300",
        sidebarSize === "mini" && "ml-16",
        sidebarSize === "compact" && "ml-48", 
        sidebarSize === "normal" && "ml-64",
        sidebarSize === "wide" && "ml-80"
      )}>
        <AdminHeader 
          onSidebarSizeChange={handleSidebarSizeChange}
          sidebarSize={sidebarSize}
        />
        
        <main className="pt-16 p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
                <p className="text-white/70">
                  Gérez et suivez toutes vos notifications système
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="gap-2 border-white/20 text-white hover:bg-white/10">
                  <Download className="h-4 w-4" />
                  Exporter
                </Button>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Notifications Section */}
              <div className="lg:col-span-2">
                <Card className="glass-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg flex items-center gap-2 text-white">
                      <Bell className="h-5 w-5" />
                      Notifications ({unreadCount} non lues)
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={markAllAsRead}
                      disabled={unreadCount === 0}
                      className="text-white hover:bg-white/10"
                    >
                      Tout marquer comme lu
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Notification Filters */}
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                          <Input
                            placeholder="Rechercher..."
                            value={notificationSearch}
                            onChange={(e) => setNotificationSearch(e.target.value)}
                            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                          />
                        </div>
                        <Select value={notificationFilter} onValueChange={setNotificationFilter}>
                          <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="glass border-white/20">
                            <SelectItem value="all" className="text-white hover:bg-white/10">Toutes</SelectItem>
                            <SelectItem value="unread" className="text-white hover:bg-white/10">Non lues</SelectItem>
                            <SelectItem value="read" className="text-white hover:bg-white/10">Lues</SelectItem>
                            <SelectItem value="urgent" className="text-white hover:bg-white/10">Urgentes</SelectItem>
                            <SelectItem value="warning" className="text-white hover:bg-white/10">Alertes</SelectItem>
                            <SelectItem value="info" className="text-white hover:bg-white/10">Info</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Notifications List */}
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {filteredNotifications.map((notification) => {
                          const Icon = getNotificationIcon(notification.type);
                          
                          return (
                            <div
                              key={notification.id}
                              className={cn(
                                "flex items-start gap-3 p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all",
                                !notification.read && "bg-white/10"
                              )}
                            >
                              <div className={cn("p-1.5 rounded-full", 
                                notification.type === "urgent" ? "bg-red-500/20 text-red-400" :
                                notification.type === "warning" ? "bg-orange-500/20 text-orange-400" :
                                notification.type === "info" ? "bg-blue-500/20 text-blue-400" :
                                notification.type === "success" ? "bg-green-500/20 text-green-400" :
                                "bg-gray-500/20 text-gray-400"
                              )}>
                                <Icon className="h-3 w-3" />
                              </div>
                              
                              <div className="flex-1 space-y-1">
                                <div className="flex items-start justify-between">
                                  <h4 className={cn(
                                    "text-sm font-medium text-white",
                                    !notification.read && "font-semibold"
                                  )}>
                                    {notification.title}
                                  </h4>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeNotification(notification.id)}
                                    className="h-6 w-6 p-0 text-white/60 hover:text-white hover:bg-white/10"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                                
                                <p className="text-sm text-white/70">
                                  {notification.message}
                                </p>
                                
                                <div className="flex items-center justify-between text-xs text-white/60">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{notification.time}</span>
                                  </div>
                                  
                                  <div className="flex gap-1">
                                    {!notification.read && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => markAsRead(notification.id)}
                                        className="h-6 px-2 text-xs text-white/60 hover:text-white hover:bg-white/10"
                                      >
                                        Marquer comme lu
                                      </Button>
                                    )}
                                    {notification.actionUrl && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 px-2 text-xs text-white/60 hover:text-white hover:bg-white/10"
                                      >
                                        Voir
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        
                        {filteredNotifications.length === 0 && (
                          <div className="text-center py-8">
                            <Bell className="h-12 w-12 text-white/60 mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2 text-white">Aucune notification</h3>
                            <p className="text-white/70">
                              Aucune notification ne correspond à vos critères.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats */}
              <div>
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">Statistiques</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="text-center p-3 bg-white/10 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{unreadCount}</div>
                        <div className="text-sm text-white/70">Non lues</div>
                      </div>
                      <div className="text-center p-3 bg-white/10 rounded-lg">
                        <div className="text-2xl font-bold text-green-400">
                          {notificationsList.filter(n => n.type === "success").length}
                        </div>
                        <div className="text-sm text-white/70">Succès</div>
                      </div>
                      <div className="text-center p-3 bg-white/10 rounded-lg">
                        <div className="text-2xl font-bold text-orange-400">
                          {notificationsList.filter(n => n.type === "warning").length}
                        </div>
                        <div className="text-sm text-white/70">Alertes</div>
                      </div>
                      <div className="text-center p-3 bg-white/10 rounded-lg">
                        <div className="text-2xl font-bold text-red-400">
                          {notificationsList.filter(n => n.type === "urgent").length}
                        </div>
                        <div className="text-sm text-white/70">Urgentes</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}