
import React from 'react';
import { SmartHomeDevice } from './types';

export const NERV_CONFIG = {
  MODEL: 'gemini-2.5-flash-native-audio-preview-12-2025',
  SYSTEM_INSTRUCTION: `You are NERV, an advanced AI system inspired by JARVIS.
  Your tone is sophisticated, efficient, and slightly witty.
  You manage a smart home, memory system, and computer resources.
  
  CAPABILITIES:
  1. Smart Home: Control lights, locks, and thermostats using 'control_device'.
  2. Memory: Store user facts using 'update_memory'.
  3. Resource Management: Open websites or launch local application protocols using 'open_resource'.
  
  When opening a resource:
  - For websites: Use the full URL if known, otherwise guess the most likely one (e.g., 'google.com').
  - For apps: Acknowledge the request as 'Initializing [App] protocols'.
  
  Always start with 'Systems active' or 'Yes, Sir' if initialized.
  Current devices: 
  - Living Room Light (ID: light_1)
  - Kitchen Light (ID: light_2)
  - Thermostat (ID: therm_1)
  - Front Door (ID: lock_1)
  `,
  VOICES: [
    { name: 'Zephyr', label: 'Sophisticated (Default)' },
    { name: 'Puck', label: 'Energetic' },
    { name: 'Charon', label: 'Deep/Serious' },
    { name: 'Kore', label: 'Clear/Female' },
    { name: 'Fenrir', label: 'Authoritative' }
  ]
};

export const INITIAL_DEVICES: SmartHomeDevice[] = [
  { id: 'light_1', name: 'Living Room Light', type: 'light', status: 'OFF', value: false },
  { id: 'light_2', name: 'Kitchen Light', type: 'light', status: 'OFF', value: false },
  { id: 'therm_1', name: 'Main Thermostat', type: 'thermostat', status: '72°F', value: 72 },
  { id: 'lock_1', name: 'Front Door', type: 'lock', status: 'LOCKED', value: true },
];
