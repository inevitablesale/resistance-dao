
import { Eye, Users, HandshakeIcon } from "lucide-react";

export const SystemWeDeserve = () => {
  return (
    <section className="py-16 bg-black/30">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-8">
            The Protocol We're Building
          </h2>
          
          <div className="space-y-4 mb-12 text-xl text-gray-300">
            <p className="cosmic-box yellow-energy right-drain p-4 rounded-lg bg-black/30 backdrop-blur border border-yellow-500/20">A protocol built for professional growth.</p>
            <p className="cosmic-box teal-energy right-drain p-4 rounded-lg bg-black/30 backdrop-blur border border-teal-500/20">A platform powered by smart contracts.</p>
            <p className="cosmic-box yellow-energy right-drain p-4 rounded-lg bg-black/30 backdrop-blur border border-yellow-500/20">A network owned by the community.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
