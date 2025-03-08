
import React from 'react';
import { motion } from 'framer-motion';

interface PostAuthLayoutProps {
  leftSidebar?: React.ReactNode;
  mainContent: React.ReactNode;
  rightSidebar?: React.ReactNode;
  onAppOpened?: () => void;
}

export function PostAuthLayout({ leftSidebar, mainContent, rightSidebar, onAppOpened }: PostAuthLayoutProps) {
  // Call onAppOpened on component mount if provided
  React.useEffect(() => {
    if (onAppOpened) {
      onAppOpened();
    }
  }, [onAppOpened]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-12 gap-4 w-full"
    >
      {/* Left sidebar section - simplified */}
      {leftSidebar && (
        <div className="md:col-span-3 space-y-4">
          {leftSidebar}
        </div>
      )}
      
      {/* Main content section - simplified */}
      <div 
        className={`
          ${leftSidebar && rightSidebar ? 'md:col-span-6' : 
           (leftSidebar || rightSidebar ? 'md:col-span-9' : 'md:col-span-12')}
        `}
      >
        {mainContent}
      </div>
      
      {/* Right sidebar section - simplified */}
      {rightSidebar && (
        <div className="md:col-span-3 space-y-4">
          {rightSidebar}
        </div>
      )}
    </motion.div>
  );
}
