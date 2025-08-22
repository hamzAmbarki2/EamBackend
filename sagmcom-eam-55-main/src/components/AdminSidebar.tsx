import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Package, 
  FileText, 
  BarChart3, 
  Calendar,
  Database,
  Bell,
  Wrench,
  ClipboardList,
  Activity
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

type SidebarSize = "mini" | "compact" | "normal" | "wide";

interface AdminSidebarProps {
  sidebarSize: SidebarSize;
}

export function AdminSidebar({ sidebarSize }: AdminSidebarProps) {
  const location = useLocation();
  
  const getSidebarWidth = () => {
    switch (sidebarSize) {
      case "mini": return "w-16";
      case "compact": return "w-48";
      case "normal": return "w-64";
      case "wide": return "w-80";
      default: return "w-64";
    }
  };
  
  const shouldShowText = sidebarSize !== "mini";
  const shouldShowFullText = sidebarSize === "normal" || sidebarSize === "wide";

  const menuItems = [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    { title: "Utilisateurs", url: "/admin/users", icon: Users },
    { title: "Assets", url: "/admin/assets", icon: Package },
    { title: "Ordres de travail", url: "/admin/work-orders", icon: FileText },
    { title: "Archive", url: "/admin/archive", icon: Database },
    { title: "Plannings", url: "/admin/plannings", icon: Calendar },
    { title: "Interventions", url: "/admin/interventions", icon: Wrench },
    { title: "Rapports", url: "/admin/rapports", icon: BarChart3 },
    { title: "Activité", url: "/admin/activity", icon: Activity },
    { title: "Notifications", url: "/admin/notifications", icon: Bell },
    { title: "Paramètres", url: "/admin/settings", icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={cn(
      "glass fixed left-0 top-0 z-40 h-screen transition-all duration-300",
      getSidebarWidth()
    )}>
      {/* Logo Section */}
      <div className="flex items-center justify-center h-16 border-b border-white/10">
        {shouldShowText ? (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            {shouldShowFullText && (
              <div className="text-white">
                <div className="font-bold text-sm">Sagemcom</div>
                <div className="text-xs opacity-75">EAM Admin</div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.title}
                to={item.url}
                className={cn(
                  "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                  "hover:bg-white/10 hover:shadow-lg",
                  isActive(item.url) 
                    ? "bg-primary/20 text-white shadow-lg border border-primary/30" 
                    : "text-white/80 hover:text-white"
                )}
              >
                <Icon className={cn("h-5 w-5", shouldShowText && "mr-3")} />
                {shouldShowText && (
                  <span className={cn(
                    "transition-all duration-300",
                    sidebarSize === "compact" && "text-xs"
                  )}>
                    {sidebarSize === "compact" ? item.title.split(" ")[0] : item.title}
                  </span>
                )}
                {isActive(item.url) && shouldShowText && (
                  <div className="ml-auto w-2 h-2 bg-primary rounded-full"></div>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* User Profile Section */}
      {shouldShowText && (
        <div className="absolute bottom-4 left-0 right-0 px-3">
          <div className="glass-card p-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
              {shouldShowFullText && (
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white">Admin</div>
                  <div className="text-xs text-white/60 truncate">admin@sagemcom.com</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}