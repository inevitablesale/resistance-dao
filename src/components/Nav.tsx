
import { Link, useLocation } from 'react-router-dom';
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';
import { useCustomWallet } from '@/hooks/useCustomWallet';

const Nav = () => {
  const { isConnected } = useCustomWallet();
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-white font-bold">
            Resistance DAO
          </Link>
          
          <div className="flex items-center gap-4">
            {isConnected && <DynamicWidget />}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
