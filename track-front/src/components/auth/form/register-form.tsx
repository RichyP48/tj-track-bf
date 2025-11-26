import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authService } from '@/lib/auth-service';
import { UserRole } from '@/lib/api-types';
import '../../../index.css';
import type { UserRoleType, ProfileRequest } from '@/lib/api-types';
import { validateEmail, validatePhone } from '@/lib/utils';
import { toast } from 'sonner';
import { Eye, EyeOff, User, Mail, Lock, MapPin, Phone, Building, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

export function RegisterForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password: string;
    role: UserRoleType;
    town: string;
    address: string;
    phoneNumber: string;
    shopName: string;
    latitude: string;
    longitude: string;
  }>({
    name: '',
    email: '',
    password: '',
    role: UserRole.CLIENT,
    town: '',
    address: '',
    phoneNumber: '',
    shopName: '',
    latitude: '',
    longitude: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { id: 1, title: 'Informations personnelles', icon: User },
    { id: 2, title: 'Type de compte', icon: Building },
    { id: 3, title: 'Localisation', icon: MapPin }
  ];

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Base validation
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';

    // Role-specific validation
    if (([UserRole.CLIENT, UserRole.LIVREUR, UserRole.COMMERCANT, UserRole.FOURNISSEUR] as UserRoleType[]).includes(formData.role)) {
      if (!formData.town.trim()) newErrors.town = 'Town is required';
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
      else if (!validatePhone(formData.phoneNumber)) newErrors.phoneNumber = 'Invalid phone number format';
    }

    if (([UserRole.COMMERCANT, UserRole.FOURNISSEUR] as UserRoleType[]).includes(formData.role)) {
      if (!formData.shopName.trim()) newErrors.shopName = 'Shop/Company name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const profileRequest: ProfileRequest = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };

      if (formData.role === UserRole.CLIENT) {
        profileRequest.clientInfo = {
          town: formData.town,
          address: formData.address,
          phoneNumber: formData.phoneNumber,
          latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
          longitude: formData.longitude ? parseFloat(formData.longitude) : undefined
        };
      } else if (formData.role === UserRole.LIVREUR) {
        profileRequest.deliveryInfo = {
          town: formData.town,
          address: formData.address,
          phoneNumber: formData.phoneNumber,
          latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
          longitude: formData.longitude ? parseFloat(formData.longitude) : undefined
        };
      } else if (formData.role === UserRole.COMMERCANT) {
        profileRequest.merchantInfo = {
          shopName: formData.shopName,
          town: formData.town,
          address: formData.address,
          phoneNumber: formData.phoneNumber,
          latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
          longitude: formData.longitude ? parseFloat(formData.longitude) : undefined
        };
      } else if (formData.role === UserRole.FOURNISSEUR) {
        profileRequest.supplierInfo = {
          shopName: formData.shopName,
          town: formData.town,
          address: formData.address,
          phoneNumber: formData.phoneNumber,
          latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
          longitude: formData.longitude ? parseFloat(formData.longitude) : undefined
        };
      }

      const response = await authService.register(profileRequest);
      toast.success(response.message);
      
      // Navigate to OTP verification
      navigate('/auth/verify-otp', { 
        state: { 
          email: formData.email, 
          type: 'registration' 
        } 
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const requiresLocationInfo = ([UserRole.CLIENT, UserRole.LIVREUR, UserRole.COMMERCANT, UserRole.FOURNISSEUR] as UserRoleType[]).includes(formData.role);
  const requiresShopName = ([UserRole.COMMERCANT, UserRole.FOURNISSEUR] as UserRoleType[]).includes(formData.role);

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.name.trim()) newErrors.name = 'Nom requis';
      if (!formData.email.trim()) newErrors.email = 'Email requis';
      else if (!validateEmail(formData.email)) newErrors.email = 'Format email invalide';
      if (!formData.password) newErrors.password = 'Mot de passe requis';
      else if (formData.password.length < 8) newErrors.password = 'Minimum 8 caractères';
    } else if (currentStep === 2) {
      if (requiresShopName && !formData.shopName.trim()) {
        newErrors.shopName = formData.role === UserRole.FOURNISSEUR ? 'Nom entreprise requis' : 'Nom magasin requis';
      }
    } else if (currentStep === 3 && requiresLocationInfo) {
      if (!formData.town.trim()) newErrors.town = 'Ville requise';
      if (!formData.address.trim()) newErrors.address = 'Adresse requise';
      if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Téléphone requis';
      else if (!validatePhone(formData.phoneNumber)) newErrors.phoneNumber = 'Format téléphone invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep === 2 && !requiresLocationInfo) {
        handleSubmit(new Event('submit') as any);
      } else {
        setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      }
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="registerform-container h-150 w-100 bg-gradient-to-br from-light via-primary-50 to-secondary-50 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Form-specific filaments */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 800 600" fill="none">
          <defs>
            <linearGradient id="formFilament1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="0.03" />
            </linearGradient>
            <linearGradient id="formFilament2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path d="M-50,100 Q200,50 400,200 Q600,150 850,300" stroke="url(#formFilament1)" strokeWidth="1" fill="none" className="animate-pulse" style={{animationDelay: '1.5s'}} />
          <path d="M-100,400 Q150,300 350,450 Q550,350 800,500" stroke="url(#formFilament2)" strokeWidth="0.8" fill="none" className="animate-pulse" style={{animationDelay: '2.3s'}} />
          <path d="M100,-20 Q300,150 500,80 Q700,250 900,180" stroke="url(#formFilament1)" strokeWidth="0.6" fill="none" className="animate-pulse" style={{animationDelay: '3.1s'}} />
          <circle cx="200" cy="200" r="1.5" fill="#6366F1" fillOpacity="0.12" className="animate-bounce" style={{animationDelay: '1.2s'}} />
          <circle cx="600" cy="400" r="1.2" fill="#EC4899" fillOpacity="0.1" className="animate-bounce" style={{animationDelay: '2.8s'}} />
          <circle cx="400" cy="100" r="1" fill="#10B981" fillOpacity="0.08" className="animate-bounce" style={{animationDelay: '0.9s'}} />
        </svg>
      </div>
      
      <div className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-2xl w-full max-w-lg mx-auto h-fit overflow-y-auto relative z-10">
        {/* Header */}
        <div className="text-center p-6 pb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
            <img src="/G logo.png" alt="TJ-Track Logo" className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-dark font-heading bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-1">
            Créer un compte
          </h1>
          <p className="text-sm text-neutral-600">Rejoignez la plateforme TJ-Track</p>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pb-4">
          <div className="w-full bg-neutral-200 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-neutral-600 text-center">
            Étape {currentStep}/3: {steps[currentStep - 1]?.title}
          </p>
        </div>

        {/* Form Content */}
        <div className="px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                    <User className="h-4 w-4 text-primary-500" />
                    Nom complet
                  </label>
                  <Input
                    placeholder="Votre nom complet"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`h-12 pl-4 pr-4 bg-white border-neutral-300 text-gray-900 focus:border-primary-400 focus:ring-primary-400/20 transition-all rounded-xl ${errors.name ? 'border-red-400 focus:border-red-400' : ''}`}
                    disabled={loading}
                  />
                  {errors.name && <p className="text-red-500 text-sm flex items-center gap-1"><span className="text-xs">⚠️</span>{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary-500" />
                    Adresse email
                  </label>
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`h-12 pl-4 pr-4 bg-white border-neutral-300 text-gray-900 focus:border-primary-400 focus:ring-primary-400/20 transition-all rounded-xl ${errors.email ? 'border-red-400 focus:border-red-400' : ''}`}
                    disabled={loading}
                  />
                  {errors.email && <p className="text-red-500 text-sm flex items-center gap-1"><span className="text-xs">⚠️</span>{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                    <Lock className="h-4 w-4 text-primary-500" />
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimum 8 caractères"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`h-12 pl-4 pr-12 bg-white border-neutral-300 text-gray-900 focus:border-primary-400 focus:ring-primary-400/20 transition-all rounded-xl ${errors.password ? 'border-red-400 focus:border-red-400' : ''}`}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm flex items-center gap-1"><span className="text-xs">⚠️</span>{errors.password}</p>}
                </div>
              </div>
            )}

            {/* Step 2: Account Type */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                    <Building className="h-4 w-4 text-primary-500" />
                    Type de compte
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value as UserRoleType)}
                    className="h-12 w-full rounded-xl border border-neutral-300 bg-white text-gray-900 px-4 py-2 text-sm focus:border-primary-400 focus:ring-primary-400/20 transition-all"
                    disabled={loading}
                  >
                    <option value={UserRole.CLIENT}>📱 Client</option>
                    <option value={UserRole.COMMERCANT}>🏢 Commerçant</option>
                    <option value={UserRole.FOURNISSEUR}>🏭 Fournisseur</option>
                    <option value={UserRole.LIVREUR}>🚚 Livreur</option>
                    <option value={UserRole.MANAGER}>💼 Manager</option>
                    <option value={UserRole.ADMIN}>⚙️ Admin</option>
                  </select>
                </div>

                {requiresShopName && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                      <Building className="h-4 w-4 text-secondary-500" />
                      {formData.role === UserRole.FOURNISSEUR ? "Nom de l'entreprise" : "Nom du magasin"}
                    </label>
                    <Input
                      placeholder={formData.role === UserRole.FOURNISSEUR ? "Nom de votre entreprise" : "Nom de votre magasin"}
                      value={formData.shopName}
                      onChange={(e) => handleInputChange('shopName', e.target.value)}
                      className={`h-12 pl-4 pr-4 bg-neutral-50/50 border-neutral-200 focus:border-secondary-400 focus:ring-secondary-400/20 transition-all rounded-xl ${errors.shopName ? 'border-red-400 focus:border-red-400' : ''}`}
                      disabled={loading}
                    />
                    {errors.shopName && <p className="text-red-500 text-sm flex items-center gap-1"><span className="text-xs">⚠️</span>{errors.shopName}</p>}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Location Info */}
            {currentStep === 3 && requiresLocationInfo && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-500" />
                    Ville
                  </label>
                  <Input
                    placeholder="Votre ville"
                    value={formData.town}
                    onChange={(e) => handleInputChange('town', e.target.value)}
                    className={`h-12 pl-4 pr-4 bg-neutral-50/50 border-neutral-200 focus:border-green-400 focus:ring-green-400/20 transition-all rounded-xl ${errors.town ? 'border-red-400 focus:border-red-400' : ''}`}
                    disabled={loading}
                  />
                  {errors.town && <p className="text-red-500 text-sm flex items-center gap-1"><span className="text-xs">⚠️</span>{errors.town}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-500" />
                    Adresse (Quartier)
                  </label>
                  <Input
                    placeholder="Votre quartier ou adresse"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`h-12 pl-4 pr-4 bg-neutral-50/50 border-neutral-200 focus:border-green-400 focus:ring-green-400/20 transition-all rounded-xl ${errors.address ? 'border-red-400 focus:border-red-400' : ''}`}
                    disabled={loading}
                  />
                  {errors.address && <p className="text-red-500 text-sm flex items-center gap-1"><span className="text-xs">⚠️</span>{errors.address}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-500" />
                    Numéro de téléphone
                  </label>
                  <Input
                    placeholder="Votre numéro de téléphone"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className={`h-12 pl-4 pr-4 bg-neutral-50/50 border-neutral-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all rounded-xl ${errors.phoneNumber ? 'border-red-400 focus:border-red-400' : ''}`}
                    disabled={loading}
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-sm flex items-center gap-1"><span className="text-xs">⚠️</span>{errors.phoneNumber}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-600 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-neutral-400" />
                    Coordonnées GPS (optionnel)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="number"
                      step="any"
                      placeholder="Latitude"
                      value={formData.latitude}
                      onChange={(e) => handleInputChange('latitude', e.target.value)}
                      className="h-12 pl-4 pr-4 bg-neutral-50/30 border-neutral-200 focus:border-neutral-400 focus:ring-neutral-400/20 transition-all rounded-xl"
                      disabled={loading}
                    />
                    <Input
                      type="number"
                      step="any"
                      placeholder="Longitude"
                      value={formData.longitude}
                      onChange={(e) => handleInputChange('longitude', e.target.value)}
                      className="h-12 pl-4 pr-4 bg-neutral-50/30 border-neutral-200 focus:border-neutral-400 focus:ring-neutral-400/20 transition-all rounded-xl"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-6">
              {currentStep > 1 && (
                <Button 
                  type="button"
                  onClick={prevStep}
                  className="flex-1 h-12 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 font-semibold rounded-xl transition-all"
                  disabled={loading}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Précédent
                </Button>
              )}
              
              {currentStep < totalSteps && (currentStep !== 2 || requiresLocationInfo) ? (
                <Button 
                  type="button"
                  onClick={nextStep}
                  className="flex-1 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  disabled={loading}
                >
                  Suivant
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  type="submit"
                  className="flex-1 h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Création...
                    </>
                  ) : (
                    'Créer mon compte'
                  )}
                </Button>
              )}
            </div>

            <div className="text-center pt-4">
              <p className="text-neutral-600">
                Déjà un compte ?{' '}
                <Link 
                  to="/auth/login" 
                  className="text-primary-600 hover:text-primary-500 font-semibold transition-colors"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}