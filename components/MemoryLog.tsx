
import React from 'react';
import { MemoryEntry } from '../types';

interface MemoryLogProps {
  entries: MemoryEntry[];
}

const MemoryLog: React.FC<MemoryLogProps> = ({ entries }) => {
  return (
    <div className="glass-panel rounded-lg p-4 h-full flex flex-col overflow-hidden">
      <h3 className="font-orbitron text-sm mb-4 border-b border-cyan-500/30 pb-2 flex justify-between items-center">
        <span>NEURAL MEMORY BANK</span>
        <span className="text-[10px] text-cyan-400/60">SECT-09</span>
      </h3>
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {entries.length === 0 && (
          <div className="text-cyan-500/30 text-xs italic">No neural patterns recorded...</div>
        )}
        {entries.map((entry) => (
          <div key={entry.id} className="text-xs border-l-2 border-cyan-500/40 pl-3 py-1 bg-cyan-500/5 hover:bg-cyan-500/10 transition-colors">
            <div className="flex justify-between text-[10px] text-cyan-400/50 mb-1">
              <span className="uppercase">{entry.type} LOG</span>
              <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
            </div>
            <p className="text-cyan-200">{entry.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemoryLog;
