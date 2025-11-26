import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '@/lib/auth-service';
import { UserRole } from '@/lib/api-types';
import type { UserRoleType, ProfileRequest } from '@/lib/api-types';
import { validateEmail, validatePhone } from '@/lib/utils';
import { toast } from 'sonner';

export function RegisterForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Join TJ-Track platform</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Base Fields */}
          <div>
            <Input
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <Input
              type="password"
              placeholder="Password (min 8 characters)"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Role Selection */}
          <div>
            <select
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value as UserRoleType)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value={UserRole.CLIENT}>Client</option>
              <option value={UserRole.COMMERCANT}>Merchant</option>
              <option value={UserRole.FOURNISSEUR}>Supplier</option>
              <option value={UserRole.LIVREUR}>Delivery</option>
              <option value={UserRole.MANAGER}>Manager</option>
              <option value={UserRole.ADMIN}>Admin</option>
            </select>
          </div>

          {requiresShopName && (
            <div>
              <Input
                placeholder={formData.role === UserRole.FOURNISSEUR ? "Company Name" : "Shop Name"}
                value={formData.shopName}
                onChange={(e) => handleInputChange('shopName', e.target.value)}
                className={errors.shopName ? 'border-red-500' : ''}
              />
              {errors.shopName && <p className="text-red-500 text-sm mt-1">{errors.shopName}</p>}
            </div>
          )}

          {requiresLocationInfo && (
            <>
              <div>
                <Input
                  placeholder="Town"
                  value={formData.town}
                  onChange={(e) => handleInputChange('town', e.target.value)}
                  className={errors.town ? 'border-red-500' : ''}
                />
                {errors.town && <p className="text-red-500 text-sm mt-1">{errors.town}</p>}
              </div>

              <div>
                <Input
                  placeholder="Address (Quartier)"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              <div>
                <Input
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className={errors.phoneNumber ? 'border-red-500' : ''}
                />
                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  step="any"
                  placeholder="Latitude (optional)"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                />
                <Input
                  type="number"
                  step="any"
                  placeholder="Longitude (optional)"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                />
              </div>
            </>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/auth/login')}
              className="text-primary hover:underline"
            >
              Sign in
            </button>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}