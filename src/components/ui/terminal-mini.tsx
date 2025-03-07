
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, ChevronDown, ChevronUp, Minimize, Maximize } from 'lucide-react';
import { Card } from './card';

interface TerminalMiniProps {
  minimized?: boolean;
  onToggleMinimize?: () => void;
}

export function TerminalMini({ minimized = false, onToggleMinimize }: TerminalMiniProps) {
  const [terminalLines, setTerminalLines] = useState<string[]>([
    ">> RESISTANCE NETWORK TERMINAL v2.3",
    ">> RESTRICTED ACCESS MODE",
    ">> Type 'help' for available commands"
  ]);
  const [inputValue, setInputValue] = useState("");
  
  // Add new line to terminal output
  const addLine = (line: string) => {
    setTerminalLines(prev => [...prev, line]);
  };
  
  // Handle command input
  const handleCommand = (cmd: string) => {
    const lowerCmd = cmd.toLowerCase().trim();
    
    addLine(`${'>'}' ${cmd}`);
    
    // Basic command responses
    switch(lowerCmd) {
      case "help":
        addLine("Available commands: help, status, info, clear");
        break;
      case "status":
        addLine("NETWORK STATUS: CRITICAL");
        addLine("SETTLEMENTS: 23 [OPERATIONAL]");
        addLine("ACTIVE HUNTERS: 782");
        addLine("THREAT LEVEL: ELEVATED");
        break;
      case "info":
        addLine("The RESISTANCE NETWORK was formed after the cryptocolypse");
        addLine("Our mission is to rebuild what was lost and recover stolen assets");
        addLine("Full access requires role authentication");
        break;
      case "clear":
        setTerminalLines([
          ">> RESISTANCE NETWORK TERMINAL v2.3",
          ">> RESTRICTED ACCESS MODE"
        ]);
        break;
      default:
        addLine(`Command '${cmd}' not recognized or unavailable in restricted mode`);
        addLine("Authenticate with a role to unlock full terminal capabilities");
    }
  };
  
  // Handle input submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      handleCommand(inputValue);
      setInputValue("");
    }
  };
  
  // Auto-scroll terminal to bottom when new lines are added
  useEffect(() => {
    const terminal = document.getElementById('terminal-output');
    if (terminal) {
      terminal.scrollTop = terminal.scrollHeight;
    }
  }, [terminalLines]);
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="mb-6"
    >
      <Card className="bg-black/80 border-toxic-neon/30 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-toxic-neon" />
              <h3 className="text-toxic-neon font-mono text-lg">TERMINAL</h3>
            </div>
            <button 
              className="text-toxic-neon hover:bg-toxic-neon/20 p-1 rounded"
              onClick={onToggleMinimize}
            >
              {minimized ? <Maximize className="h-4 w-4" /> : <Minimize className="h-4 w-4" />}
            </button>
          </div>
          
          {!minimized && (
            <>
              <div 
                id="terminal-output"
                className="bg-black border border-toxic-neon/30 rounded p-2 h-40 overflow-y-auto mb-2 font-mono text-sm"
              >
                {terminalLines.map((line, i) => (
                  <div key={i} className={line.startsWith('>') ? 'text-white' : (line.startsWith('>>') ? 'text-toxic-neon' : 'text-white/70')}>
                    {line}
                  </div>
                ))}
              </div>
              
              <form onSubmit={handleSubmit} className="flex">
                <span className="text-toxic-neon mr-2 font-mono">{`>`}</span>
                <input
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  className="bg-transparent border-none outline-none text-white flex-1 font-mono text-sm"
                  placeholder="Enter command..."
                />
              </form>
            </>
          )}
          
          {minimized && (
            <div className="bg-black border border-toxic-neon/30 rounded p-2 font-mono text-sm text-toxic-neon">
              {`>>`} Terminal in standby mode. Click to interact.
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
