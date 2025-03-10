
import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

interface TerminalTypewriterProps {
  lines: string[];
  typingSpeed?: number;
  pauseBetweenLines?: number;
  startDelay?: number;
  onComplete?: () => void;
  highlightColor?: string;
  loop?: boolean;
  waitForClick?: boolean;
  className?: string;
  autoStart?: boolean;
  interactive?: boolean;
  commands?: Record<string, (args: string[]) => string | Promise<string>>;
  initialPrompt?: string;
  compactMode?: boolean;
}

interface TerminalTypewriterCommands {
  [key: string]: (args: string[]) => string | Promise<string>;
}

export const TerminalTypewriter: React.FC<TerminalTypewriterProps> = ({
  lines,
  typingSpeed = 30,
  pauseBetweenLines = 800,
  startDelay = 500,
  onComplete,
  highlightColor = "#39ff14",
  loop = false,
  waitForClick = false,
  className = "",
  autoStart = true,
  interactive = false,
  commands = {},
  initialPrompt = "> ",
  compactMode = false
}) => {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [waitingForClick, setWaitingForClick] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [commandInput, setCommandInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyPosition, setHistoryPosition] = useState(-1);
  const [isProcessingCommand, setIsProcessingCommand] = useState(false);
  const [prompt, setPrompt] = useState(initialPrompt);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autoScrollRef = useRef<HTMLDivElement>(null);
  
  const defaultCommands: TerminalTypewriterCommands = {
    help: () => {
      const availableCmds = ["help", "clear", ...Object.keys(commands)];
      return `Available commands: ${availableCmds.join(", ")}`;
    },
    clear: () => {
      setVisibleLines([]);
      return "";
    }
  };
  
  const allCommands = { ...defaultCommands, ...commands };
  
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);
  
  useEffect(() => {
    if (interactive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [interactive, visibleLines]);
  
  useEffect(() => {
    // Auto-scroll to bottom
    if (autoScrollRef.current) {
      autoScrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [visibleLines]);
  
  useEffect(() => {
    if (autoStart) {
      const timer = setTimeout(() => {
        startTyping();
      }, startDelay);
      
      return () => clearTimeout(timer);
    }
  }, [autoStart]);
  
  const startTyping = () => {
    if (currentIndex < lines.length && !isTyping) {
      setIsTyping(true);
      typeNextChar();
    }
  };
  
  const typeNextChar = () => {
    if (currentIndex >= lines.length) {
      finishTyping();
      return;
    }
    
    const currentLine = lines[currentIndex];
    
    if (currentCharIndex < currentLine.length) {
      const timer = setTimeout(() => {
        setVisibleLines(prev => {
          const newLines = [...prev];
          const visiblePart = currentLine.substring(0, currentCharIndex + 1);
          
          if (newLines[currentIndex]) {
            newLines[currentIndex] = visiblePart;
          } else {
            newLines.push(visiblePart);
          }
          
          return newLines;
        });
        
        setCurrentCharIndex(currentCharIndex + 1);
        typeNextChar();
      }, typingSpeed);
      
      return () => clearTimeout(timer);
    } else {
      // Current line completed
      if (waitForClick && currentIndex < lines.length - 1) {
        setWaitingForClick(true);
        setIsTyping(false);
      } else {
        const timer = setTimeout(() => {
          setCurrentIndex(currentIndex + 1);
          setCurrentCharIndex(0);
          typeNextChar();
        }, pauseBetweenLines);
        
        return () => clearTimeout(timer);
      }
    }
  };
  
  const finishTyping = () => {
    setIsTyping(false);
    setCurrentIndex(0);
    setCurrentCharIndex(0);
    setCompleted(true);
    
    if (loop) {
      const timer = setTimeout(() => {
        setVisibleLines([]);
        setCompleted(false);
        startTyping();
      }, pauseBetweenLines * 2);
      
      return () => clearTimeout(timer);
    }
    
    if (onComplete) {
      onComplete();
    }
  };
  
  const handleClick = () => {
    if (waitingForClick) {
      setWaitingForClick(false);
      setCurrentIndex(currentIndex + 1);
      setCurrentCharIndex(0);
      setIsTyping(true);
      typeNextChar();
    } else if (!isTyping && !completed) {
      startTyping();
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommandInput(e.target.value);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      executeCommand();
    } else if (e.key === "ArrowUp") {
      // Navigate up through command history
      if (commandHistory.length > 0 && historyPosition < commandHistory.length - 1) {
        const newPosition = historyPosition + 1;
        setHistoryPosition(newPosition);
        setCommandInput(commandHistory[commandHistory.length - 1 - newPosition]);
      }
    } else if (e.key === "ArrowDown") {
      // Navigate down through command history
      if (historyPosition > 0) {
        const newPosition = historyPosition - 1;
        setHistoryPosition(newPosition);
        setCommandInput(commandHistory[commandHistory.length - 1 - newPosition]);
      } else if (historyPosition === 0) {
        setHistoryPosition(-1);
        setCommandInput("");
      }
    }
  };
  
  const executeCommand = async () => {
    if (commandInput.trim() === "") return;
    
    const fullCommand = commandInput.trim();
    const commandParts = fullCommand.split(" ");
    const command = commandParts[0].toLowerCase();
    const args = commandParts.slice(1);
    
    // Add command to visible lines
    const cmdDisplayLine = `${prompt}${fullCommand}`;
    setVisibleLines(prev => [...prev, cmdDisplayLine]);
    
    // Add to command history
    setCommandHistory(prev => [...prev, fullCommand]);
    setHistoryPosition(-1);
    setCommandInput("");
    
    // Process command
    setIsProcessingCommand(true);
    try {
      if (allCommands[command]) {
        const result = await allCommands[command](args);
        if (result) {
          // Split result by newlines and add each line
          const resultLines = result.split("\n");
          setVisibleLines(prev => [...prev, ...resultLines]);
        }
      } else {
        setVisibleLines(prev => [...prev, `Command not found: ${command}. Type 'help' for available commands.`]);
      }
    } catch (error) {
      console.error("Error executing command:", error);
      setVisibleLines(prev => [...prev, `Error executing command: ${error}`]);
    } finally {
      setIsProcessingCommand(false);
    }
  };
  
  const formatLine = (line: string, index: number) => {
    // Process any highlight markers like <<highlight>>text<<>>
    return line.replace(/<<highlight>>(.*?)<<>>/g, `<span style="color: ${highlightColor}">$1</span>`);
  };
  
  const getCompactClass = () => {
    return compactMode ? "terminal-compact" : "";
  };
  
  return (
    <div 
      ref={containerRef}
      className={`terminal-container ${getCompactClass()} ${className}`} 
      onClick={handleClick}
      tabIndex={0}
    >
      <div className="terminal-content">
        {visibleLines.map((line, index) => (
          <div 
            key={index} 
            className="terminal-line"
            dangerouslySetInnerHTML={{ __html: formatLine(line, index) }}
          />
        ))}
        
        {waitingForClick && (
          <div className="terminal-prompt">
            <span className="terminal-prompt-text">Click to continue...</span>
          </div>
        )}
        
        {interactive && (
          <div className="terminal-input-container">
            <span className="terminal-prompt-text">{prompt}</span>
            <input
              ref={inputRef}
              type="text"
              className="terminal-input"
              value={commandInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isProcessingCommand}
              aria-label="Terminal command input"
            />
            {isProcessingCommand && (
              <Loader2 className="terminal-loading-indicator animate-spin" />
            )}
          </div>
        )}
        
        <div ref={autoScrollRef} />
      </div>
    </div>
  );
};
