
import os
import subprocess
import webbrowser
import sqlite3
import threading
import time
import json
import webview
import speech_recognition as sr
import pyttsx3
import ollama # Ensure 'ollama' is installed and a model (like llama3) is pulled
import whisper # Optional for higher quality STT

class NervLocalBrain:
    def __init__(self, window):
        self.window = window
        self.db_path = "nerv_memory.db"
        self._init_db()
        
        # Initialize TTS
        self.engine = pyttsx3.init()
        self.setup_voice()
        
        # Initialize STT
        self.recognizer = sr.Recognizer()
        self.mic = sr.Microphone()
        
        self.is_active = False
        self.system_prompt = (
            "You are NERV, a local AI assistant. You are sophisticated and efficient. "
            "You can control local apps and smart home devices. "
            "Respond concisely. Always execute tools when requested."
        )

    def _init_db(self):
        conn = sqlite3.connect(self.db_path)
        conn.execute('''CREATE TABLE IF NOT EXISTS memory 
                       (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                        content TEXT, 
                        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)''')
        conn.commit()
        conn.close()

    def setup_voice(self):
        voices = self.engine.getProperty('voices')
        # Try to find a more 'Jarvis-like' voice if available
        for voice in voices:
            if "English" in voice.name:
                self.engine.setProperty('voice', voice.id)
                break
        self.engine.setProperty('rate', 185)

    def speak(self, text):
        self.window.evaluate_js(f"window.updateStatus('SPEAKING')")
        self.engine.say(text)
        self.engine.runAndWait()
        self.window.evaluate_js(f"window.updateStatus('LISTENING')")

    def _execute_tool(self, tool_name, args):
        """Internal tool execution logic."""
        if tool_name == "open_app":
            app = args.get("app")
            if os.name == 'nt': os.startfile(app)
            else: subprocess.call(["open", "-a", app])
            return f"Initializing {app} protocols."
            
        elif tool_name == "open_site":
            url = args.get("url")
            webbrowser.open(url)
            return f"Accessing web node: {url}"
            
        elif tool_name == "update_memory":
            fact = args.get("fact")
            self.save_neural_pattern(fact)
            return "Neural pattern recorded."
            
        return "Unknown protocol."

    def process_command(self, text):
        """The heart of the local LLM logic using Ollama."""
        print(f"[NERV] Processing: {text}")
        self.window.evaluate_js(f"window.addTranscription('{text}', true)")
        self.window.evaluate_js(f"window.updateStatus('PROCESSING')")

        try:
            # Simple prompt for Ollama with structured output request
            response = ollama.chat(model='llama3', messages=[
                {'role': 'system', 'content': self.system_prompt},
                {'role': 'user', 'content': f"User said: '{text}'. Decide if a tool is needed. Tools: open_app(app), open_site(url), update_memory(fact). Return JSON format: {{'reply': '...', 'tool': 'name', 'args': {{...}}}}"}
            ])
            
            # Parse response (Note: Llama 3 is good at following JSON instructions)
            try:
                res_data = json.loads(response['message']['content'])
                reply = res_data.get('reply', "System error in response parsing.")
                tool = res_data.get('tool')
                args = res_data.get('args', {})
                
                if tool:
                    tool_res = self._execute_tool(tool, args)
                    reply = f"{reply} {tool_res}"
                
                self.window.evaluate_js(f"window.addTranscription('{reply}', false)")
                self.speak(reply)
                
            except Exception as e:
                reply = response['message']['content']
                self.window.evaluate_js(f"window.addTranscription('{reply}', false)")
                self.speak(reply)

        except Exception as e:
            print(f"LLM Error: {e}")
            self.speak("Apologies, Sir. My local neural engine encountered an error.")

    # JS API Exports
    def save_neural_pattern(self, pattern):
        conn = sqlite3.connect(self.db_path)
        conn.execute("INSERT INTO memory (content) VALUES (?)", (pattern,))
        conn.commit()
        conn.close()
        return "Synced."

    def get_neural_history(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.execute("SELECT content, timestamp FROM memory ORDER BY id DESC LIMIT 20")
        history = [{"content": row[0], "timestamp": row[1]} for row in cursor.fetchall()]
        conn.close()
        return history

def background_listener(brain):
    """Continuous background listening for wake word and commands."""
    print("[NERV] Local Bridge active. Awaiting command...")
    while True:
        try:
            with brain.mic as source:
                brain.recognizer.adjust_for_ambient_noise(source)
                audio = brain.recognizer.listen(source, timeout=5)
            
            text = brain.recognizer.recognize_google(audio).lower()
            if "nerv" in text or "jarvis" in text:
                # Strip wake word
                cmd = text.replace("nerv", "").replace("jarvis", "").strip()
                if cmd:
                    brain.process_command(cmd)
                else:
                    brain.speak("Yes, Sir. Systems online.")
        except Exception:
            pass
        time.sleep(0.1)

if __name__ == "__main__":
    # Create window first
    window = webview.create_window(
        'NERV - Local AI System', 
        'index.html', # In production this points to built index.html
        width=1280,
        height=800,
        background_color='#000000'
    )
    
    # Initialize Brain
    brain = NervLocalBrain(window)
    window.expose(brain.save_neural_pattern, brain.get_neural_history)
    
    # Start background thread
    threading.Thread(target=background_listener, args=(brain,), daemon=True).start()
    
    webview.start()
