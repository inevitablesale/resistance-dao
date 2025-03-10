
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
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-toxic-neon">Settlements</h1>
        <p className="text-gray-400 max-w-2xl">
          Discover and support settlements being built in the wasteland. Sentinels can contribute ETH to fund and govern promising projects.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link to="/settlements">
          <Button 
            variant={isActive("/settlements") ? "default" : "outline"} 
            className={`gap-2 ${isActive("/settlements") ? "bg-toxic-dark border border-toxic-neon/60 text-toxic-neon shadow-[0_0_10px_rgba(57,255,20,0.3)]" : "text-gray-300 border-white/10 hover:bg-white/5"}`}
          >
            <Building2 className="w-4 h-4" />
            All Settlements
          </Button>
        </Link>
        <Link to="/governance">
          <Button 
            variant={isActive("/governance") ? "default" : "outline"} 
            className={`gap-2 ${isActive("/governance") ? "bg-toxic-dark border border-toxic-neon/60 text-toxic-neon shadow-[0_0_10px_rgba(57,255,20,0.3)]" : "text-gray-300 border-white/10 hover:bg-white/5"}`}
          >
            <Gavel className="w-4 h-4" />
            Governance
          </Button>
        </Link>
        <Link to="/my-settlements">
          <Button 
            variant={isActive("/my-settlements") ? "default" : "outline"} 
            className={`gap-2 ${isActive("/my-settlements") ? "bg-toxic-dark border border-toxic-neon/60 text-toxic-neon shadow-[0_0_10px_rgba(57,255,20,0.3)]" : "text-gray-300 border-white/10 hover:bg-white/5"}`}
          >
            <ShieldCheck className="w-4 h-4" />
            My Contributions
          </Button>
        </Link>
        <Link to="/thesis">
          <Button className="bg-toxic-dark/70 text-toxic-neon border-2 border-toxic-neon font-bold shadow-[0_0_20px_rgba(57,255,20,0.7)] hover:bg-toxic-dark/50 hover:shadow-[0_0_30px_rgba(57,255,20,0.8)] gap-2">
            <Plus className="w-4 h-4" />
            Create Settlement
          </Button>
        </Link>
      </div>
    </div>
  );
};
