
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Gavel } from 'lucide-react';

export const SettlementsNavBar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path);
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Settlements</h1>
        <p className="text-gray-400 max-w-2xl">
          Discover and support settlements being built in the wasteland. Sentinels can contribute ETH to fund and govern promising projects.
        </p>
      </div>
      <div className="flex gap-2">
        <Link to="/governance">
          <Button variant="outline" className="gap-2">
            <Gavel className="w-4 h-4" />
            Governance
          </Button>
        </Link>
        <Link to="/thesis">
          <Button className="bg-blue-500 hover:bg-blue-600 gap-2">
            <Plus className="w-4 h-4" />
            Create Settlement
          </Button>
        </Link>
      </div>
    </div>
  );
};
