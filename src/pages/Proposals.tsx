
import { ProposalsHistory } from "@/components/proposals/ProposalsHistory";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Proposals = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-polygon-primary/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-polygon-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white">Investment Proposals</h1>
        </div>
        <Button 
          onClick={() => navigate('/thesis')} 
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Proposal
        </Button>
      </div>
      <ProposalsHistory />
    </div>
  );
};

export default Proposals;
