import { Building2, Home, LayoutDashboard, Package, Wrench, FileText, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
  const navItems = [
    { name: "Home", icon: Home, href: "/" },
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Assets", icon: Package, href: "/assets" },
    { name: "Work Orders", icon: Wrench, href: "/work-orders" },
    { name: "Reports", icon: FileText, href: "/reports" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <Building2 className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-white">Sagemcom</h1>
              <p className="text-xs text-muted-foreground">EAM Platform</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className="text-white/80 hover:text-white hover:bg-white/10 transition-all"
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.name}
              </Button>
            ))}
          </nav>

          {/* Login Button */}
          <Link to="/signin">
            <Button className="glass-button text-white border-white/20 hover:bg-white/20">
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;