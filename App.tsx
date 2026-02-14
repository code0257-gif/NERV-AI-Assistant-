
import React, { useState, useEffect, useRef } from 'react';
import { SystemStatus, MemoryEntry, SmartHomeDevice, TranscriptionItem } from './types';
import { NERV_CONFIG, INITIAL_DEVICES } from './constants';
import JarvisHUD from './components/JarvisHUD';
import MemoryLog from './components/MemoryLog';
import SmartHomeControl from './components/SmartHomeControl';

declare global {
  interface Window {
    pywebview?: {
      api: {
        save_neural_pattern: (pattern: string) => Promise<string>;
        get_neural_history: () => Promise<any[]>;
      }
    };
    // Python-to-JS Bridges
    updateStatus: (status: string) => void;
    addTranscription: (text: string, isUser: boolean) => void;
  }
}

const App: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus>(SystemStatus.LISTENING);
  const [memory, setMemory] = useState<MemoryEntry[]>([]);
  const [devices, setDevices] = useState<SmartHomeDevice[]>(INITIAL_DEVICES);
  const [transcriptions, setTranscriptions] = useState<TranscriptionItem[]>([]);
  const [isLocalBridgeActive, setIsLocalBridgeActive] = useState(false);

  useEffect(() => {
    // Expose functions for the Python backend to call
    window.updateStatus = (newStatus: string) => {
      setStatus(newStatus as SystemStatus);
    };

    window.addTranscription = (text: string, isUser: boolean) => {
      setTranscriptions(prev => [...prev, { text, isUser }].slice(-8));
    };

    const checkBridge = setInterval(() => {
      if (window.pywebview) {
        setIsLocalBridgeActive(true);
        clearInterval(checkBridge);
        // Initial history load
        (window as any).get_neural_history().then((history: any[]) => {
          const mapped: MemoryEntry[] = history.map((h, i) => ({
            id: `local-${i}`,
            timestamp: h.timestamp ? new Date(h.timestamp).getTime() : Date.now(),
            content: h.content,
            type: 'learning'
          }));
          setMemory(mapped);
        });
      }
    }, 500);

    return () => clearInterval(checkBridge);
  }, []);

  return (
    <div className="h-screen w-screen bg-black overflow-hidden flex flex-col p-6 space-y-6 relative select-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,40,80,0.15)_0%,_transparent_70%)] pointer-events-none"></div>

      <header className="flex justify-between items-center z-10">
        <div className="flex flex-col">
          <h1 className="font-orbitron text-2xl font-black tracking-tighter text-cyan-400 drop-shadow-[0_0_10px_#00f2ff]">NERV.OS</h1>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full bg-green-500 animate-pulse`}></div>
            <span className="text-[10px] text-cyan-500/80 font-bold uppercase tracking-widest">LOCAL NEURAL LINK ESTABLISHED</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="glass-panel px-4 py-2 rounded flex flex-col items-end border-green-500/30">
             <span className="text-[10px] text-green-500/60 uppercase">Neural Engine</span>
             <span className="text-[10px] font-bold text-green-400">OLLAMA / LLAMA3</span>
          </div>

          <div className="glass-panel px-4 py-2 rounded flex flex-col items-end">
             <span className="text-[10px] text-cyan-500/60 uppercase">Mode</span>
             <span className="text-[10px] font-bold text-cyan-400">OFFLINE_AUTONOMOUS</span>
          </div>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-12 gap-6 relative z-10 overflow-hidden">
        {/* HUD & Transcripts */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="glass-panel flex-1 rounded-lg overflow-hidden flex flex-col p-4 relative">
             <JarvisHUD status={status} />
             <div className="mt-auto border-t border-cyan-500/20 pt-4 max-h-48 overflow-y-auto custom-scrollbar">
                {transcriptions.length === 0 && <div className="text-[10px] text-cyan-500/40 uppercase italic">Listening for "NERV"...</div>}
                {transcriptions.map((t, idx) => (
                  <div key={idx} className={`mb-2 text-xs flex flex-col ${t.isUser ? 'items-end' : 'items-start'}`}>
                    <span className="text-[9px] text-cyan-500/40 uppercase font-bold mb-0.5">{t.isUser ? 'USER' : 'NERV'}</span>
                    <p className={`${t.isUser ? 'text-cyan-200 text-right' : 'text-cyan-400'} max-w-[90%] bg-cyan-500/5 px-2 py-1 rounded border border-cyan-500/10`}>
                        {t.text}
                    </p>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Dashboard */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          <SmartHomeControl devices={devices} />
          <div className="glass-panel rounded-lg p-4 flex-1">
            <h3 className="font-orbitron text-sm mb-4 border-b border-cyan-500/30 pb-2 flex justify-between">
                <span>SYSTEM TELEMETRY</span>
                <span className="text-cyan-500/40 text-[10px]">LOCAL CORE v2.1</span>
            </h3>
            <div className="grid grid-cols-3 gap-4 h-full">
               <div className="flex flex-col items-center justify-center p-2 border border-cyan-500/10 rounded text-center">
                  <div className="text-2xl font-bold text-cyan-400">100%</div>
                  <div className="text-[10px] text-cyan-500/50 uppercase">Offline Ready</div>
               </div>
               <div className="flex flex-col items-center justify-center p-2 border border-cyan-500/10 rounded text-center">
                  <div className="text-2xl font-bold text-cyan-400">0.00ms</div>
                  <div className="text-[10px] text-cyan-500/50 uppercase">External Lag</div>
               </div>
               <div className="flex flex-col items-center justify-center p-2 border border-cyan-500/10 rounded text-center">
                  <div className="text-2xl font-bold text-cyan-400">FP16</div>
                  <div className="text-[10px] text-cyan-500/50 uppercase">Quantization</div>
               </div>
               <div className="col-span-3 mt-4 border-t border-cyan-500/10 pt-4">
                  <div className="flex justify-between items-center text-[10px] text-cyan-500/60 font-bold">
                    <span>NEURAL CACHE LOAD</span>
                    <span className="text-green-400">OPTIMIZED</span>
                  </div>
                  <div className="w-full bg-cyan-900/30 h-1 mt-1">
                    <div className="bg-cyan-400 h-full w-[100%]"></div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Memory */}
        <div className="col-span-12 lg:col-span-3">
          <MemoryLog entries={memory} />
        </div>
      </main>

      <footer className="z-10 flex justify-between items-end border-t border-cyan-500/20 pt-2">
        <div className="flex gap-8 text-[10px] text-cyan-500/40 uppercase">
          <div className="flex flex-col"><span>Autonomy</span><span className="text-cyan-400">LEVEL_5</span></div>
          <div className="flex flex-col"><span>Core Temp</span><span className="text-cyan-400">42°C</span></div>
          <div className="flex flex-col"><span>Security</span><span className="text-green-400">LOCAL_ISOLATION</span></div>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[10px] text-cyan-500/40 font-bold uppercase tracking-widest">Protocol: Neural_Autonomy_V1</span>
           <div className="flex gap-0.5">
              {[...Array(8)].map((_, i) => <div key={i} className={`w-1 h-3 ${status === SystemStatus.LISTENING ? 'bg-cyan-400 animate-pulse' : 'bg-cyan-950'}`} style={{ animationDelay: `${i * 0.1}s` }}></div>)}
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
