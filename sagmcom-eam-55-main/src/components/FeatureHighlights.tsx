import { 
  LifeBuoy, 
  Calendar, 
  Activity, 
  Package2,
  ArrowRight,
  Zap,
  Shield,
  BarChart3
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const FeatureHighlights = () => {
  const features = [
    {
      title: "Asset Lifecycle Management",
      description: "Track assets from procurement to disposal with comprehensive lifecycle management tools and automated maintenance scheduling.",
      icon: LifeBuoy,
      benefits: ["Reduce downtime by 40%", "Extend asset lifespan", "Predictive maintenance"],
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Work Order Scheduling",
      description: "Streamline maintenance operations with intelligent scheduling, resource allocation, and real-time progress tracking.",
      icon: Calendar,
      benefits: ["Smart scheduling", "Resource optimization", "Mobile workforce"],
      gradient: "from-green-500 to-emerald-500"
    },
    {
      title: "Real-time Equipment Monitoring",
      description: "Monitor equipment performance with IoT sensors, receive instant alerts, and prevent costly failures before they occur.",
      icon: Activity,
      benefits: ["24/7 monitoring", "Instant alerts", "Prevent failures"],
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Inventory Tracking",
      description: "Maintain optimal inventory levels with automated reordering, supplier management, and cost optimization tools.",
      icon: Package2,
      benefits: ["Automated reordering", "Cost optimization", "Supplier management"],
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Powerful <span className="gradient-text">Features</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Comprehensive tools designed to optimize your asset management processes 
            and drive operational excellence across your enterprise.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="glass-card border-white/10 hover:border-white/20 group">
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-white/70 mb-6 leading-relaxed">
                      {feature.description}
                    </p>
                    
                    <div className="space-y-2 mb-6">
                      {feature.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                          <span className="text-sm text-white/60">{benefit}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      className="text-primary hover:text-primary-glow hover:bg-primary/10 p-0 h-auto group"
                    >
                      Learn more
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Stats Section */}
        <div className="mt-20 glass-card p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 text-yellow-400" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Lightning Fast</h4>
              <p className="text-white/60">
                Process thousands of work orders with sub-second response times
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-green-400" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Enterprise Security</h4>
              <p className="text-white/60">
                Bank-grade security with SOC 2 compliance and data encryption
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <BarChart3 className="w-8 h-8 text-blue-400" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Advanced Analytics</h4>
              <p className="text-white/60">
                AI-powered insights and predictive analytics for better decisions
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;