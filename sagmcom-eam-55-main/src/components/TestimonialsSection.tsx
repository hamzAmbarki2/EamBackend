import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Operations Director",
      company: "Global Manufacturing Corp",
      quote: "Sagemcom's EAM platform reduced our equipment downtime by 60% and saved us millions in maintenance costs. The predictive analytics are game-changing.",
      rating: 5,
      image: "SC"
    },
    {
      name: "Michael Rodriguez",
      role: "Facility Manager",
      company: "TechScale Industries",
      quote: "The real-time monitoring capabilities have transformed how we manage our assets. We can now prevent failures before they happen.",
      rating: 5,
      image: "MR"
    },
    {
      name: "Dr. Emily Watson",
      role: "Chief Technology Officer",
      company: "Innovation Labs",
      quote: "Implementation was seamless, and the ROI was evident within the first quarter. Our technicians love the mobile interface.",
      rating: 5,
      image: "EW"
    }
  ];

  const stats = [
    { label: "Average Cost Reduction", value: "45%" },
    { label: "Downtime Improvement", value: "60%" },
    { label: "Customer Satisfaction", value: "98%" },
    { label: "Implementation Success", value: "100%" }
  ];

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Trusted by <span className="gradient-text">Industry Leaders</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Join thousands of enterprises worldwide who have transformed their 
            asset management with our proven platform.
          </p>
        </div>

        {/* Impact Stats */}
        <div className="glass-card p-8 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-white/60 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="glass-card border-white/10 hover:border-white/20 h-full">
              <CardContent className="p-8 flex flex-col h-full">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <div className="flex-1 mb-6">
                  <Quote className="w-8 h-8 text-primary/40 mb-4" />
                  <p className="text-white/80 leading-relaxed italic">
                    "{testimonial.quote}"
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-white font-bold">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-white/60">
                      {testimonial.role}
                    </div>
                    <div className="text-sm text-white/40">
                      {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;