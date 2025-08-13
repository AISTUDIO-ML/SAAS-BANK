
import React from 'react';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Link, useLocation } from 'react-router-dom';
import { Wallet, Shield, BarChart3 } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  
  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SB</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SAAS BANK
          </span>
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-6 w-[400px]">
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                    <Wallet className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-sm font-medium">Superfluid Streams</div>
                      <div className="text-xs text-gray-600">Real-time crypto subscriptions</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                    <Shield className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="text-sm font-medium">Sablier Locks</div>
                      <div className="text-xs text-gray-600">Time-locked payments</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="text-sm font-medium">AI Monitoring</div>
                      <div className="text-xs text-gray-600">Smart access control</div>
                    </div>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center space-x-4">
          <Link 
            to="/dashboard" 
            className={`hidden md:inline-flex text-sm ${location.pathname === '/dashboard' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/admin" 
            className={`hidden md:inline-flex text-sm ${location.pathname === '/admin' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Admin
          </Link>
          <Button variant="outline" size="sm">
            Connect Wallet
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
