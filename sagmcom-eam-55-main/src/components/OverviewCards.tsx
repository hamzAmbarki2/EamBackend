import { Package, Wrench, AlertTriangle, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const OverviewCards = () => {
  const metrics = [
    {
      title: "Total Assets",
      value: "12,847",
      change: "+2.5%",
      icon: Package,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Active Work Orders",
      value: "1,234",
      change: "+12%",
      icon: Wrench,
      color: "text-green-400",
      bgColor: "bg-green-500/10"
    },
    {
      title: "Inventory Alerts",
      value: "47",
      change: "-8%",
      icon: AlertTriangle,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10"
    },
    {
      title: "Assigned Technicians",
      value: "523",
      change: "+5%",
      icon: Users,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10"
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Real-time <span className="gradient-text">Asset Overview</span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Monitor your enterprise assets with comprehensive metrics and insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <Card key={index} className="glass-card border-white/10 hover:border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${metric.bgColor}`}>
                    <metric.icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                  <span className={`text-sm font-medium ${
                    metric.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {metric.change}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {metric.value}
                  </h3>
                  <p className="text-sm text-white/60">
                    {metric.title}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OverviewCards;