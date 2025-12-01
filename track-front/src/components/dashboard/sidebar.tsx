import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { authService } from '@/lib/auth-service';
import { 
  Home, 
  Package, 
  Users, 
  BarChart3, 
  Settings, 
  Truck,
  ShoppingCart,
  MapPin,
  User
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

interface MenuItem {
  icon: any;
  label: string;
  path: string;
  adminOnly?: boolean;
}

const menuItems: MenuItem[] = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: Package, label: 'Orders', path: '/orders' },
  { icon: ShoppingCart, label: 'Products', path: '/products' },
  { icon: Truck, label: 'Deliveries', path: '/deliveries' },
  { icon: Users, label: 'Customers', path: '/customers' },
  { icon: Users, label: 'Users', path: '/users', adminOnly: true },
  { icon: Package, label: 'Stock', path: '/stock' },
  { icon: ShoppingCart, label: 'E-commerce', path: '/ecommerce' },
  { icon: Package, label: 'Catalogue', path: '/catalog' },
  { icon: ShoppingCart, label: 'Mon Panier', path: '/cart' },
  { icon: MapPin, label: 'Tracking', path: '/tracking' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar({ className }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = authService.getCurrentUser();
  const isAdmin = currentUser?.roles?.includes('ADMIN') || currentUser?.roles?.includes('MANAGER');

  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {menuItems.map((item) => {
              // Skip admin-only items for non-admin users
              if (item.adminOnly && !isAdmin) {
                return null;
              }
              
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}