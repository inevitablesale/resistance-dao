
import React from 'react';
import { motion } from 'framer-motion';

interface PostAuthLayoutProps {
  leftSidebar?: React.ReactNode;
  mainContent: React.ReactNode;
  rightSidebar?: React.ReactNode;
}

export function PostAuthLayout({ leftSidebar, mainContent, rightSidebar }: PostAuthLayoutProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full"
    >
      {/* Left sidebar section */}
      {leftSidebar && (
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-3 space-y-6"
        >
          {leftSidebar}
        </motion.div>
      )}
      
      {/* Main content section */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={`
          ${leftSidebar && rightSidebar ? 'md:col-span-6' : 
           (leftSidebar || rightSidebar ? 'md:col-span-9' : 'md:col-span-12')}
        `}
      >
        {mainContent}
      </motion.div>
      
      {/* Right sidebar section */}
      {rightSidebar && (
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-3 space-y-6"
        >
          {rightSidebar}
        </motion.div>
      )}
    </motion.div>
  );
}
