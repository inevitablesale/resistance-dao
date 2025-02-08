
import { Trophy, UserCircle, Vote, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

const boardRequirements = [
  {
    title: "Governance Power",
    description: "Must hold at least 100,000 LGR tokens to be eligible",
    icon: Vote
  },
  {
    title: "Industry Experience",
    description: "Minimum 5 years accounting or MSP experience",
    icon: Trophy
  },
  {
    title: "Active Participation",
    description: "Regular participation in DAO governance",
    icon: UserCircle
  },
  {
    title: "Technical Knowledge",
    description: "Understanding of Web3 and DeFi fundamentals",
    icon: Zap
  }
];

const boardSeats = [
  { id: 1, row: 1, status: "vacant" },
  { id: 2, row: 1, status: "vacant" },
  { id: 3, row: 1, status: "vacant" },
  { id: 4, row: 2, status: "vacant" },
  { id: 5, row: 2, status: "vacant" },
  { id: 6, row: 2, status: "vacant" },
  { id: 7, row: 3, status: "vacant" },
  { id: 8, row: 3, status: "vacant" },
  { id: 9, row: 3, status: "vacant" },
  { id: 10, row: 3, status: "vacant" }
];

export const BoardSeats = () => {
  const { toast } = useToast();
  const { primaryWallet, setShowAuthFlow } = useDynamicContext();

  const handleAction = (action: "vote" | "nominate" | "apply") => {
    if (!primaryWallet) {
      setShowAuthFlow?.(true);
      return;
    }

    toast({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Action`,
      description: `${action.charAt(0).toUpperCase() + action.slice(1)} functionality coming soon!`,
      duration: 3000,
    });
  };

  return (
    <div className="py-24 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/40" />
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(234, 179, 8, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(20, 184, 166, 0.15) 0%, transparent 50%)
          `
        }}
      />
      
      <div className="container mx-auto px-4 relative">
        <h2 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-12">
          Board Seats
        </h2>

        {/* Board Requirements */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {boardRequirements.map((req) => (
            <div 
              key={req.title}
              className="relative group p-6 rounded-xl bg-black/30 border border-yellow-500/20 backdrop-blur-sm transition-all duration-300 hover:border-yellow-500/40"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-teal-500/5 rounded-xl blur-sm group-hover:blur-md transition-all duration-300" />
              <div className="relative">
                <req.icon className="w-8 h-8 mb-4 text-yellow-500" />
                <h3 className="text-lg font-semibold text-white mb-2">{req.title}</h3>
                <p className="text-gray-400 text-sm">{req.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Board Seats Visualization */}
        <div className="perspective-3000 mb-16">
          {[1, 2, 3].map((row) => (
            <div 
              key={row}
              className="flex justify-center gap-4 mb-8"
              style={{
                transform: `translateZ(${(3 - row) * 50}px) translateY(${(row - 1) * 20}px)`
              }}
            >
              {boardSeats
                .filter((seat) => seat.row === row)
                .map((seat) => (
                  <div
                    key={seat.id}
                    className="relative group w-20 h-20 perspective-3000"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-teal-500/20 rounded-full blur-md transform group-hover:scale-110 transition-all duration-300" />
                    <div 
                      className="relative w-full h-full bg-black/60 rounded-full border border-yellow-500/30 backdrop-blur-sm flex items-center justify-center transform transition-all duration-300 group-hover:border-yellow-500/60"
                    >
                      <div className="text-2xl font-bold text-yellow-500/80 animate-pulse">?</div>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 flex-wrap">
          <Button
            onClick={() => handleAction("vote")}
            className="bg-gradient-to-r from-yellow-500 to-teal-500 text-white hover:from-yellow-600 hover:to-teal-600 transition-all duration-300"
          >
            Vote for Board Member
          </Button>
          <Button
            onClick={() => handleAction("nominate")}
            variant="outline"
            className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10 transition-all duration-300"
          >
            Nominate Candidate
          </Button>
          <Button
            onClick={() => handleAction("apply")}
            variant="outline"
            className="border-teal-500/50 text-teal-500 hover:bg-teal-500/10 transition-all duration-300"
          >
            Apply for Board Seat
          </Button>
        </div>
      </div>
    </div>
  );
};
