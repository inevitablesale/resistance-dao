import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

const GovernanceVoting = () => {
  const { primaryWallet } = useDynamicContext();
  const navigate = useNavigate();

  useEffect(() => {
    const checkWallet = async () => {
      if (!primaryWallet || !(await primaryWallet.isConnected())) {
        navigate('/');
      }
    };
    checkWallet();
  }, [primaryWallet, navigate]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-white to-polygon-primary bg-clip-text text-transparent">
          Governance Board Elections
        </h1>
        <p className="text-center text-gray-400">
          As a LedgerFren NFT holder, you can now vote for members to join the governance board.
        </p>
        
        {/* Placeholder for voting interface - to be implemented */}
        <div className="p-8 rounded-xl bg-white/5 border border-white/10">
          <p className="text-center text-gray-400">
            Voting functionality coming soon. Stay tuned!
          </p>
        </div>
      </div>
    </div>
  );
};

export default GovernanceVoting;