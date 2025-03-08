
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, Clock, Shield, ExternalLink } from 'lucide-react';
import { Card } from './card';
import { cn } from '@/lib/utils';

// Mock data for survivor notifications
const mockNotifications = [
  { id: 1, name: "CryptoRebel_92", timestamp: "5m ago", action: "Joined the Resistance" },
  { id: 2, name: "WastelandWanderer", timestamp: "12m ago", action: "Pledged to Settlement #7" },
  { id: 3, name: "RadiatedRachel", timestamp: "25m ago", action: "Recovered 25k resources" },
  { id: 4, name: "DecentralizedDan", timestamp: "42m ago", action: "Completed tech recovery mission" },
  { id: 5, name: "HashHunter", timestamp: "1h ago", action: "Joined bounty hunt #127" },
];

export function SurvivorNotifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [visibleNotifications, setVisibleNotifications] = useState<number[]>([1, 2, 3]);
  
  // Simulate new notifications periodically
  useEffect(() => {
    const interval = setInterval(() => {
      // 20% chance of adding a new notification
      if (Math.random() < 0.2) {
        const newId = notifications.length + 1;
        const names = ["WastelandWarrior", "ChainBreaker", "TokenSalvager", "CryptoNomad", "BlockExplorer"];
        const actions = ["Joined the Resistance", "Pledged to a Settlement", "Recovered resources", "Completed a mission"];
        
        const newNotification = {
          id: newId,
          name: names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 100),
          timestamp: "Just now",
          action: actions[Math.floor(Math.random() * actions.length)]
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        setVisibleNotifications(prev => [newId, ...prev.slice(0, 2)]);
      } 
      // Otherwise, update timestamps
      else {
        setNotifications(prev => 
          prev.map(n => {
            // Update timestamps to seem more real-time
            if (n.timestamp === "Just now") return { ...n, timestamp: "1m ago" };
            if (n.timestamp === "1m ago") return { ...n, timestamp: "5m ago" };
            if (n.timestamp === "5m ago") return { ...n, timestamp: "12m ago" };
            if (n.timestamp === "12m ago") return { ...n, timestamp: "25m ago" };
            if (n.timestamp === "25m ago") return { ...n, timestamp: "42m ago" };
            if (n.timestamp === "42m ago") return { ...n, timestamp: "1h ago" };
            return n;
          })
        );
      }
    }, 15000);
    
    return () => clearInterval(interval);
  }, [notifications]);
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="mb-6"
    >
      <Card className={cn(
        "bg-black/90 border-toxic-neon/30 overflow-hidden",
        "border-[1px]"
      )}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-toxic-neon" />
              <h3 className="text-toxic-neon font-mono text-lg">SURVIVOR ACTIVITY</h3>
            </div>
            <button 
              className="text-toxic-neon hover:bg-toxic-neon/20 p-1 rounded"
            >
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {notifications
                .filter(n => visibleNotifications.includes(n.id))
                .map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "p-2 bg-black border border-toxic-neon/20 rounded flex items-center justify-between cursor-pointer hover:bg-toxic-neon/10",
                      index === 0 && "bg-toxic-neon/5" // Highlight the newest notification
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-toxic-neon flex-shrink-0" />
                      <div>
                        <span className="text-toxic-neon text-sm font-mono">{notification.name}</span>
                        <p className="text-white/70 text-xs">{notification.action}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-white/50 text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {notification.timestamp}
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
            
            <div className="text-center mt-3">
              <button className="text-toxic-neon text-xs hover:underline font-mono">
                VIEW ALL SURVIVOR ACTIVITIES
              </button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
