
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Orbit, Star, Moon, Rocket } from 'lucide-react';

interface BoardRole {
  title: string;
  role: string;
  description: string;
  icon: React.ElementType;
  color: string;
  responsibilities: string[];
}

const boardRoles: BoardRole[] = [
  {
    title: "Managing Partners",
    role: "Strategic Leadership",
    description: "Guide the DAO's vision and strategic direction through industry expertise",
    icon: Orbit,
    color: "yellow",
    responsibilities: [
      "Strategic planning",
      "Community leadership",
      "Resource allocation",
      "Partnership development"
    ]
  },
  {
    title: "M&A Specialists",
    role: "Practice Acquisition",
    description: "Identify and evaluate optimal acquisition targets for the protocol",
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
    title: "Operations Leaders",
    role: "Practice Integration",
    description: "Streamline operations and scale practices while maintaining service excellence",
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
    title: "Technology Directors",
    role: "Digital Innovation",
    description: "Drive technological advancement and integration across the network",
    icon: Rocket,
    color: "teal",
    responsibilities: [
      "Tech stack development",
      "Innovation strategy",
      "System integration",
      "Digital transformation"
    ]
  }
];

export const CelestialCouncil = () => {
  const [activeRole, setActiveRole] = useState<number>(0);
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
            The Board of Directors
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            As a token holder, you help select the leaders who will guide LedgerFund's future. Our board brings together expertise in management, M&A, operations, and technology to drive the protocol's success.
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute inset-0 opacity-30">
            <svg className="w-full h-full" viewBox="0 0 800 600">
              <path
                className="text-yellow-500 stroke-current"
                d="M200,300 L400,150 L600,300 L400,450 Z"
                fill="none"
                strokeWidth="1"
              />
              <circle cx="200" cy="300" r="4" className="fill-current text-yellow-500" />
              <circle cx="400" cy="150" r="4" className="fill-current text-teal-500" />
              <circle cx="600" cy="300" r="4" className="fill-current text-yellow-500" />
              <circle cx="400" cy="450" r="4" className="fill-current text-teal-500" />
            </svg>
          </div>

          <div className="grid md:grid-cols-2 gap-8 relative z-10">
            {boardRoles.map((role, index) => (
              <motion.div
                key={role.title}
                ref={el => roleRefs.current[index] = el}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className={`p-6 rounded-lg backdrop-blur-sm bg-black/40 border border-${role.color}-500/20 
                              hover:border-${role.color}-500/40 transition-all duration-300`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-teal-500/5 rounded-lg" />
                  <div className="relative z-10">
                    <div className={`w-12 h-12 mb-4 rounded-full flex items-center justify-center bg-${role.color}-500/20`}>
                      <role.icon className={`w-6 h-6 text-${role.color}-500`} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{role.title}</h3>
                    <p className="text-sm text-white/60 mb-4">{role.description}</p>
                    
                    <div className="space-y-2">
                      {role.responsibilities.map((resp, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-white/80">
                          <div className={`w-1.5 h-1.5 rounded-full bg-${role.color}-500`} />
                          <span>{resp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Shape the Future?</h3>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            Join us in selecting the leaders who will steer LedgerFund toward its mission of democratizing accounting firm ownership.
          </p>
          <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-teal-500 text-white font-semibold hover:opacity-90 transition-opacity">
            Join the Board
          </button>
        </motion.div>
      </div>
    </section>
  );
};
