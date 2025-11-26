import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '@/lib/auth-service';
import { toast } from 'sonner';

export function VerifyOtpForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const email = location.state?.email || '';
  const fromLogin = location.state?.fromLogin || false;
  const type = fromLogin ? 'login' : 'registration';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp.trim()) {
      setError('OTP is required');
      return;
    }

    if (!email) {
      toast.error('Email not found. Please try again.');
      navigate('/auth/login');
      return;
    }

    setLoading(true);
    try {
      if (type === 'registration') {
        const response = await authService.verifyRegistrationOtp(email, otp);
        toast.success(response.message);
        navigate('/auth/login', { 
          state: { 
            message: 'Registration verified! You can now sign in.' 
          } 
        });
      } else {
        // Login OTP verification
        const response = await authService.verifyOtp(email, otp);
        if (response.token) {
          toast.success('Connexion réussie!');
          navigate('/dashboard');
        } else {
          toast.success('Vérification réussie!');
          navigate('/auth/login');
        }
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) return;
    
    try {
      // For registration, we would need a resend registration OTP endpoint
      // For now, just show a message
      toast.info('Please check your email for the OTP code');
    } catch (error: any) {
      toast.error('Failed to resend OTP');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Verify Your Email</CardTitle>
        <CardDescription>
          Enter the 6-digit code sent to {email}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
                setError('');
              }}
              className={error ? 'border-red-500' : ''}
              maxLength={6}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-sm text-primary hover:underline"
            >
              Didn't receive the code? Resend
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/auth/login')}
              className="text-sm text-muted-foreground hover:underline"
            >
              Back to login
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}