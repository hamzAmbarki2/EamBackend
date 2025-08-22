import { useState } from "react";
import { 
  Menu, 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut,
  RefreshCw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Minimize2,
  Maximize2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type SidebarSize = "mini" | "compact" | "normal" | "wide";

interface AdminHeaderProps {
  onSidebarSizeChange: (direction: "prev" | "next" | "collapse" | "expand") => void;
  sidebarSize: SidebarSize;
}

export function AdminHeader({ onSidebarSizeChange, sidebarSize }: AdminHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useState(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const getLeftPosition = () => {
    switch (sidebarSize) {
      case "mini": return "left-16";
      case "compact": return "left-48";
      case "normal": return "left-64";
      case "wide": return "left-80";
      default: return "left-64";
    }
  };

  return (
    <header className={cn(
      "glass fixed top-0 right-0 z-30 h-16 transition-all duration-300",
      getLeftPosition(),
      isScrolled && "shadow-xl"
    )}>
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onSidebarSizeChange(sidebarSize === "mini" ? "expand" : "collapse")}
              className="text-white hover:bg-white/10 h-8 w-8 p-0"
              title={sidebarSize === "mini" ? "Agrandir la sidebar" : "Réduire la sidebar"}
            >
              {sidebarSize === "mini" ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
          </div>
          
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold text-white">
              Sagemcom EAM Admin Panel
            </h1>
            <p className="text-sm text-white/60">
              Système de gestion des actifs et maintenance
            </p>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="hidden lg:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
            <Input
              placeholder="Rechercher dans le système..."
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Refresh Button */}
          <Button 
            variant="ghost" 
            size="sm"
            className="text-white hover:bg-white/10"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative text-white hover:bg-white/10"
          >
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-destructive text-xs">
              3
            </Badge>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center space-x-2 text-white hover:bg-white/10"
              >
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="hidden md:block">Admin</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass border-white/20">
              <DropdownMenuLabel className="text-white">Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem className="text-white hover:bg-white/10">
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-white/10">
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem className="text-white hover:bg-white/10">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}