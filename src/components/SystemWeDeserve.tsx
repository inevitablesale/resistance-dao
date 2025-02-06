
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
            <p>A protocol built for professional growth.</p>
            <p>A platform powered by smart contracts.</p>
            <p>A network owned by the community.</p>
          </div>

          <div className="mb-12">
            <p className="text-xl text-gray-300">
              What we need is a protocol that works for everyone—a system that leverages blockchain technology to automate treasury management and reward distribution.
            </p>
          </div>

          <div className="space-y-6">
            <p className="text-xl text-gray-300">
              LedgerFund is that protocol. A transparent, blockchain-powered platform that enables automated treasury management and professional service coordination.
            </p>
            <p className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">Building the infrastructure for professional services.</p>
            <p className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-yellow-500 to-teal-400">Powering decentralized firm operations.</p>
            <p className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-teal-600">Creating a community-owned platform.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
