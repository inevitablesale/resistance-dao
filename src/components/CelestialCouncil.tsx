
import React, { useEffect, useRef, useState } from 'react';
import { Orbit, Star, Moon, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

interface CelestialRole {
  title: string;
  role: string;
  description: string;
  icon: React.ElementType;
  color: string;
  responsibilities: string[];
}

const celestialRoles: CelestialRole[] = [
  {
    title: "Architects of Reality",
    role: "Managing Partners",
    description: "Shape the very fabric of our digital universe by guiding the DAO's collective vision",
    icon: Orbit,
    color: "yellow",
    responsibilities: [
      "Strategic vision development",
      "Community leadership",
      "Resource allocation",
      "Partnership cultivation"
    ]
  },
  {
    title: "Celestial Pathfinders",
    role: "M&A Specialists",
    description: "Chart courses through unexplored opportunities in the vast expanse of accounting practices",
    icon: Star,
    color: "teal",
    responsibilities: [
      "Practice identification",
      "Due diligence",
      "Valuation analysis",
      "Deal structuring"
    ]
  },
  {
    title: "Harmony Weavers",
    role: "Operations Experts",
    description: "Orchestrate the cosmic dance of operations across our growing constellation of practices",
    icon: Moon,
    color: "yellow",
    responsibilities: [
      "Practice integration",
      "Process optimization",
      "Quality assurance",
      "Team development"
    ]
  },
  {
    title: "Quantum Pioneers",
    role: "Technology Leaders",
    description: "Pioneer technologies beyond current horizons, forging the future of accounting",
    icon: Rocket,
    color: "teal",
    responsibilities: [
      "Tech stack development",
      "Innovation leadership",
      "System integration",
      "Digital transformation"
    ]
  }
];

export const CelestialCouncil = () => {
  const [activeRole, setActiveRole] = useState<number>(0);
  const [isOrbiting, setIsOrbiting] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const roleRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = roleRefs.current.findIndex(ref => ref === entry.target);
            if (index !== -1) {
              setActiveRole(index);
              setIsOrbiting(false);
            }
          }
        });
      },
      { threshold: 0.7 }
    );

    roleRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative min-h-screen bg-black/90 py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-200 to-yellow-300 mb-6">
            The Celestial Council
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Join the visionaries who guide our protocol's future. As a token holder, you help select the leaders who will shape the future of decentralized accounting firm ownership.
          </p>
        </motion.div>

        <div className="celestial-section" ref={sectionRef}>
          <div className="celestial-slide">
            <div className="celestial-container">
              <div 
                className="celestial-orbit"
                style={{ 
                  '--orbit-state': isOrbiting ? 'running' : 'paused'
                } as React.CSSProperties}
              >
                {celestialRoles.map((role, index) => (
                  <motion.div
                    key={role.title}
                    className="planet"
                    style={{ 
                      '--rotation': `${(index / celestialRoles.length) * 360}deg`
                    } as React.CSSProperties}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <div className="planet-content">
                      <div className={`p-6 rounded-lg backdrop-blur-sm relative overflow-hidden
                                    bg-black/40 border-${role.color}-500/20 hover:border-${role.color}-500/40 
                                    transition-all duration-300 group cursor-pointer`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-teal-500/5" />
                        <div className="relative z-10">
                          <div className={`w-12 h-12 mb-4 rounded-full flex items-center justify-center
                                        bg-${role.color}-500/20`}>
                            <role.icon className={`w-6 h-6 text-${role.color}-500`} />
                          </div>
                          <h3 className="text-lg font-bold text-white">{role.title}</h3>
                          <p className="text-sm text-white/60">{role.role}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {celestialRoles.map((role, index) => (
            <div 
              key={role.title}
              ref={el => roleRefs.current[index] = el}
              className="celestial-slide"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="container mx-auto px-4 h-full flex items-center"
              >
                <div className="max-w-3xl mx-auto text-center">
                  <div className={`w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center
                                bg-${role.color}-500/20`}>
                    <role.icon className={`w-10 h-10 text-${role.color}-500`} />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">{role.title}</h3>
                  <p className="text-xl text-white/80 mb-8">{role.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {role.responsibilities.map((resp, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-4 rounded-lg bg-white/5 backdrop-blur-sm"
                      >
                        <p className="text-white/80">{resp}</p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex justify-center gap-4">
                    <button className="px-6 py-2 rounded-lg bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 transition-colors">
                      Apply
                    </button>
                    <button className="px-6 py-2 rounded-lg bg-teal-500/20 text-teal-500 hover:bg-teal-500/30 transition-colors">
                      Nominate
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Shape the Future?</h3>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            Your voice matters in selecting the leaders who will steer LedgerFund toward its mission of democratizing accounting firm ownership.
          </p>
          <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-teal-500 text-white font-semibold hover:opacity-90 transition-opacity">
            Join the Council
          </button>
        </motion.div>
      </div>
    </section>
  );
};

