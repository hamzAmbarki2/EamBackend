import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Building2, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    cin: "",
    password: "",
    confirmPassword: "",
    role: "",
    department: "",
    agreeToTerms: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Simulate existing CINs in database
  const existingCINs = [
    "12345678", "23456789", "34567890", "45678901", "56789012", "67890123"
  ];

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumberOrSymbol = /[\d\W]/.test(password);
    
    return {
      isValid: minLength && hasUppercase && hasLowercase && hasNumberOrSymbol,
      requirements: {
        minLength,
        hasUppercase,
        hasLowercase,
        hasNumberOrSymbol
      }
    };
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Le prénom est requis";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Le nom est requis";
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
    } else if (existingCINs.includes(formData.cin)) {
      newErrors.cin = "Ce CIN est déjà utilisé";
    }

    if (!formData.role) {
      newErrors.role = "Le rôle est requis";
    }

    if (!formData.department) {
      newErrors.department = "Le département est requis";
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = "Le mot de passe ne respecte pas les critères requis";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!formData.agreeToTerms) {
      toast({
        title: "Conditions requises",
        description: "Veuillez accepter les conditions d'utilisation.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Compte créé avec succès",
        description: "Bienvenue sur la plateforme Sagemcom EAM !",
      });
      // In a real app, redirect to dashboard or email verification
    }, 2000);
  };

  const roles = [
    "Asset Manager",
    "Maintenance Technician", 
    "Operations Manager",
    "Facility Manager",
    "Administrator",
    "Other"
  ];

  const departments = [
    "Operations",
    "Maintenance", 
    "Engineering",
    "Facilities",
    "IT",
    "Other"
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        {/* Back Button */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Sign Up Card */}
        <Card className="glass-card border-white/10">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Building2 className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-white">Sagemcom</h1>
                <p className="text-xs text-muted-foreground">EAM Platform</p>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Create Your Account
            </CardTitle>
            <p className="text-white/70">
              Join the Sagemcom EAM Platform and start managing your assets
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-white">
                    Prénom *
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Entrez votre prénom"
                    className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-white/40 focus:outline-none focus:border-primary focus:bg-white/15 transition-all ${
                      errors.firstName ? 'border-red-500' : 'border-white/20'
                    }`}
                    required
                  />
                  {errors.firstName && <p className="text-red-400 text-sm">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-white">
                    Nom *
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Entrez votre nom"
                    className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-white/40 focus:outline-none focus:border-primary focus:bg-white/15 transition-all ${
                      errors.lastName ? 'border-red-500' : 'border-white/20'
                    }`}
                    required
                  />
                  {errors.lastName && <p className="text-red-400 text-sm">{errors.lastName}</p>}
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-white">
                  Adresse email professionnelle *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Entrez votre email professionnel"
                  className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-white/40 focus:outline-none focus:border-primary focus:bg-white/15 transition-all ${
                    errors.email ? 'border-red-500' : 'border-white/20'
                  }`}
                  required
                />
                {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
              </div>

              {/* Phone and CIN Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-white">
                    Téléphone *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+33 1 23 45 67 89"
                    className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-white/40 focus:outline-none focus:border-primary focus:bg-white/15 transition-all ${
                      errors.phone ? 'border-red-500' : 'border-white/20'
                    }`}
                    required
                  />
                  {errors.phone && <p className="text-red-400 text-sm">{errors.phone}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="cin" className="text-sm font-medium text-white">
                    CIN *
                  </label>
                  <input
                    id="cin"
                    name="cin"
                    type="text"
                    value={formData.cin}
                    onChange={handleInputChange}
                    placeholder="12345678"
                    className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-white/40 focus:outline-none focus:border-primary focus:bg-white/15 transition-all ${
                      errors.cin ? 'border-red-500' : 'border-white/20'
                    }`}
                    required
                  />
                  {errors.cin && <p className="text-red-400 text-sm">{errors.cin}</p>}
                </div>
              </div>

              {/* Role and Department */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium text-white">
                    Rôle *
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white focus:outline-none focus:border-primary focus:bg-white/15 transition-all ${
                      errors.role ? 'border-red-500' : 'border-white/20'
                    }`}
                    required
                  >
                    <option value="" className="bg-slate-800">Sélectionnez votre rôle</option>
                    {roles.map(role => (
                      <option key={role} value={role} className="bg-slate-800">{role}</option>
                    ))}
                  </select>
                  {errors.role && <p className="text-red-400 text-sm">{errors.role}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="department" className="text-sm font-medium text-white">
                    Département *
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white focus:outline-none focus:border-primary focus:bg-white/15 transition-all ${
                      errors.department ? 'border-red-500' : 'border-white/20'
                    }`}
                    required
                  >
                    <option value="" className="bg-slate-800">Sélectionnez le département</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept} className="bg-slate-800">{dept}</option>
                    ))}
                  </select>
                  {errors.department && <p className="text-red-400 text-sm">{errors.department}</p>}
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-white">
                    Mot de passe *
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Créez un mot de passe"
                      className={`w-full px-4 py-3 pr-12 rounded-xl bg-white/10 border text-white placeholder-white/40 focus:outline-none focus:border-primary focus:bg-white/15 transition-all ${
                        errors.password ? 'border-red-500' : 'border-white/20'
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-white">
                    Confirmer le mot de passe *
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirmez votre mot de passe"
                      className={`w-full px-4 py-3 pr-12 rounded-xl bg-white/10 border text-white placeholder-white/40 focus:outline-none focus:border-primary focus:bg-white/15 transition-all ${
                        errors.confirmPassword ? 'border-red-500' : 'border-white/20'
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Password Requirements */}
              <div className="glass p-4 rounded-xl">
                <p className="text-sm text-white/70 mb-2">Le mot de passe doit contenir :</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {(() => {
                    const validation = validatePassword(formData.password);
                    return (
                      <>
                        <div className="flex items-center space-x-2">
                          <Check className={`w-4 h-4 ${validation.requirements.minLength ? 'text-green-400' : 'text-gray-400'}`} />
                          <span className={validation.requirements.minLength ? 'text-white/80' : 'text-white/60'}>Au moins 8 caractères</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Check className={`w-4 h-4 ${validation.requirements.hasUppercase ? 'text-green-400' : 'text-gray-400'}`} />
                          <span className={validation.requirements.hasUppercase ? 'text-white/80' : 'text-white/60'}>Une lettre majuscule</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Check className={`w-4 h-4 ${validation.requirements.hasLowercase ? 'text-green-400' : 'text-gray-400'}`} />
                          <span className={validation.requirements.hasLowercase ? 'text-white/80' : 'text-white/60'}>Une lettre minuscule</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Check className={`w-4 h-4 ${validation.requirements.hasNumberOrSymbol ? 'text-green-400' : 'text-gray-400'}`} />
                          <span className={validation.requirements.hasNumberOrSymbol ? 'text-white/80' : 'text-white/60'}>Un chiffre ou symbole</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-3">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="mt-1 rounded bg-white/10 border-white/20 text-primary focus:ring-primary"
                  required
                />
                <label htmlFor="agreeToTerms" className="text-sm text-white/70 leading-relaxed">
                  I agree to the{" "}
                  <Link to="/terms" className="text-primary hover:text-primary-glow">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-primary hover:text-primary-glow">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Sign Up Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full glass-button text-white py-3 font-semibold"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>

              {/* Sign In Link */}
              <div className="text-center">
                <span className="text-white/70">Already have an account? </span>
                <Link to="/signin" className="text-primary hover:text-primary-glow font-medium">
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;