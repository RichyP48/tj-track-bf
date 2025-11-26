import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';
import { DashboardLayout } from '../layout/DashboardLayout';

export default function ComingSoonPage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-yellow-500/10 rounded-full w-fit">
              <Construction className="h-12 w-12 text-yellow-500" />
            </div>
            <CardTitle className="text-2xl">Coming Soon</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600">
              This feature is coming soon! Stay tuned for exciting updates.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}