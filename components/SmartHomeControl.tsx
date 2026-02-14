
import React from 'react';
import { SmartHomeDevice } from '../types';

interface SmartHomeControlProps {
  devices: SmartHomeDevice[];
}

const SmartHomeControl: React.FC<SmartHomeControlProps> = ({ devices }) => {
  return (
    <div className="glass-panel rounded-lg p-4 h-full">
      <h3 className="font-orbitron text-sm mb-4 border-b border-cyan-500/30 pb-2 flex justify-between items-center">
        <span>HOUSE INTEGRATION</span>
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-green-500 rounded-full animate-ping"></div>
          <span className="text-[10px] text-green-400">SYNCED</span>
        </div>
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {devices.map((device) => (
          <div key={device.id} className="p-3 bg-cyan-950/40 border border-cyan-500/20 rounded hover:border-cyan-400/50 transition-all cursor-default group">
            <div className="text-[10px] text-cyan-500/60 mb-1 font-orbitron uppercase">{device.type}</div>
            <div className="text-sm font-bold text-cyan-100 group-hover:text-white transition-colors">{device.name}</div>
            <div className="mt-2 flex items-center justify-between">
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${device.value ? 'bg-cyan-500/20 text-cyan-400' : 'bg-red-500/20 text-red-400'}`}>
                {device.status}
              </span>
              <div className={`w-2 h-2 rounded-full ${device.value ? 'bg-cyan-400 shadow-[0_0_5px_#22d3ee]' : 'bg-red-500'}`}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartHomeControl;
