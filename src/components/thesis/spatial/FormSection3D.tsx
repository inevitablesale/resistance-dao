
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Scene3D } from "./Scene3D";
import { FloatingPanel } from "./FloatingPanel";

interface FormSection3DProps {
  children: ReactNode;
  isActive: boolean;
}

export const FormSection3D = ({ children, isActive }: FormSection3DProps) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ 
        scale: isActive ? 1 : 0.95,
        opacity: isActive ? 1 : 0.5,
        z: isActive ? 0 : -100
      }}
      className="relative w-full rounded-xl overflow-hidden backdrop-blur-xl border border-white/10"
    >
      <Scene3D>
        <FloatingPanel isActive={isActive} />
      </Scene3D>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-yellow-500/10" />
      <div className="relative z-10 p-6">
        {children}
      </div>
    </motion.div>
  );
};
