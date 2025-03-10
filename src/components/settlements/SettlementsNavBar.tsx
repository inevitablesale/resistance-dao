
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Gavel, ShieldCheck, Building2 } from 'lucide-react';

export const SettlementsNavBar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">Settlements</h1>
        <p className="text-gray-300 max-w-2xl">
          Discover and support settlements being built in the wasteland. Sentinels can contribute ETH to fund and govern promising projects.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link to="/settlements">
          <Button 
            variant={isActive("/settlements") ? "default" : "outline"} 
            className={`gap-2 ${isActive("/settlements") ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-gray-300 border-white/10 hover:bg-white/5"}`}
          >
            <Building2 className="w-4 h-4" />
            All Settlements
          </Button>
        </Link>
        <Link to="/governance">
          <Button 
            variant={isActive("/governance") ? "default" : "outline"} 
            className={`gap-2 ${isActive("/governance") ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-gray-300 border-white/10 hover:bg-white/5"}`}
          >
            <Gavel className="w-4 h-4" />
            Governance
          </Button>
        </Link>
        <Link to="/my-settlements">
          <Button 
            variant={isActive("/my-settlements") ? "default" : "outline"} 
            className={`gap-2 ${isActive("/my-settlements") ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-gray-300 border-white/10 hover:bg-white/5"}`}
          >
            <ShieldCheck className="w-4 h-4" />
            My Contributions
          </Button>
        </Link>
        <Link to="/thesis">
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2 text-white">
            <Plus className="w-4 h-4" />
            Create Settlement
          </Button>
        </Link>
      </div>
    </div>
  );
};
