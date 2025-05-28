import React, { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';;

const Terminal = ({ output, onInputProvide, isRunning }) => {
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const fitAddonRef = useRef(null);
  const [inputBuffer, setInputBuffer] = useState('');
  const [waitingForInput, setWaitingForInput] = useState(false);

  useEffect(() => {
    if (!xtermRef.current && terminalRef.current) {
      const term = new XTerm({
        theme: {
          background: '#1e1e1e',
          foreground: '#d4d4d4',
          cursor: '#d4d4d4',
          black: '#000000',
          red: '#cd3131',
          green: '#0dbc79',
          yellow: '#e5e510',
          blue: '#2472c8',
          magenta: '#bc3fbc',
          cyan: '#11a8cd',
          white: '#e5e5e5',
        },
        fontFamily: 'Consolas, "Courier New", monospace',
        fontSize: 14,
        cursorBlink: true,
        convertEol: true,
      });

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      
      term.open(terminalRef.current);
      fitAddon.fit();

      xtermRef.current = term;
      fitAddonRef.current = fitAddon;

      // Handle input
      term.onData((data) => {
        if (waitingForInput) {
          if (data === '\r') { // Enter key
            term.write('\r\n');
            onInputProvide(inputBuffer + '\n');
            setInputBuffer('');
            setWaitingForInput(false);
          } else if (data === '\x7f') { // Backspace
            if (inputBuffer.length > 0) {
              term.write('\b \b');
              setInputBuffer(prev => prev.slice(0, -1));
            }
          } else {
            term.write(data);
            setInputBuffer(prev => prev + data);
          }
        }
      });

      // Initial welcome message
      term.writeln('🚀 Welcome to Coding Playground Terminal!');
      term.writeln('Press Ctrl+Enter to run your code\n');
    }

    return () => {
      if (xtermRef.current) {
        xtermRef.current.dispose();
        xtermRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (xtermRef.current && output) {
      // Check if output contains input prompt
      if (output.includes('input(') || output.includes('?') || output.includes(':')) {
        setWaitingForInput(true);
      }
      
      // Write output to terminal
      const lines = output.split('\n');
      lines.forEach((line, index) => {
        if (index > 0) xtermRef.current.write('\r\n');
        xtermRef.current.write(line);
      });
    }
  }, [output]);

  useEffect(() => {
    if (xtermRef.current && !isRunning) {
      xtermRef.current.writeln('\n\n✅ Execution completed.');
    }
  }, [isRunning]);

  useEffect(() => {
    const handleResize = () => {
      if (fitAddonRef.current) {
        fitAddonRef.current.fit();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <span className="terminal-title">Terminal</span>
        <div className="terminal-status">
          {isRunning && <span className="running-indicator">● Running</span>}
        </div>
      </div>
      <div ref={terminalRef} className="terminal-content" />
    </div>
  );
};

export default Terminal;