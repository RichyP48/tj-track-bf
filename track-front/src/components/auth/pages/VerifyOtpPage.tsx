import React from 'react';
import { VerifyOtpForm } from '@/components/auth/form/verify-otp-form';
import { Truck } from 'lucide-react';

export default function VerifyOtpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Truck className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold text-white">TJ-Track</h1>
          </div>
          <p className="text-gray-400">Verify your email to continue</p>
        </div>

        {/* OTP Form */}
        <VerifyOtpForm />
      </div>
    </div>
  );
}