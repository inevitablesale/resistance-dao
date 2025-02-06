import { Eye, Users, HandshakeIcon } from "lucide-react";

export const SystemWeDeserve = () => {
  return (
    <section className="py-16 bg-black/30">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-8">
            The System We Deserve
          </h2>
          
          <div className="space-y-4 mb-12 text-xl text-gray-300">
            <p>We don't need private equity.</p>
            <p>We don't need their boardrooms.</p>
            <p>We don't need their short-term thinking.</p>
          </div>

          <div className="mb-12">
            <p className="text-xl text-gray-300">
              What we need is a system that works for us—a system that protects the relationships, trust, and expertise that make this industry thrive.
            </p>
          </div>

          <div className="space-y-6">
            <p className="text-xl text-gray-300">
              LedgerFund is that system. A transparent, blockchain-powered platform that empowers professionals to own, operate, and grow their firms without outside interference.
            </p>
            <p className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">It's time to stop letting them decide our future.</p>
            <p className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-yellow-500 to-teal-400">It's time to take ownership.</p>
            <p className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-teal-600">It's time to build something better.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
