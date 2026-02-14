
export enum SystemStatus {
  OFFLINE = 'OFFLINE',
  INITIALIZING = 'INITIALIZING',
  LISTENING = 'LISTENING',
  PROCESSING = 'PROCESSING',
  SPEAKING = 'SPEAKING',
  ERROR = 'ERROR'
}

export interface MemoryEntry {
  id: string;
  timestamp: number;
  content: string;
  type: 'user' | 'system' | 'learning';
}

export interface SmartHomeDevice {
  id: string;
  name: string;
  type: 'light' | 'thermostat' | 'lock' | 'security';
  status: string;
  value: number | boolean;
}

export interface TranscriptionItem {
  text: string;
  isUser: boolean;
}
