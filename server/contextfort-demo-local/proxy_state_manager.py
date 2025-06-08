#!/usr/bin/env python3
# Script to make the proxy script aware of the enabled/disabled state

import os
import json
import time
from pathlib import Path
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Path to the state file that the extension will update
STATE_FILE = "/home/ashwin/Desktop/thinking-twice-website/server/contextfort-demo-local/contextfort_proxy_state.json"
LOG_DIR = "/home/ashwin/Desktop/thinking-twice-website/server/contextfort-demo-local/contextfort_logs"

# Ensure log directory exists
os.makedirs(LOG_DIR, exist_ok=True)

# Global flag to track if proxy filtering is enabled
proxy_enabled = True

def log_message(msg):
    """Log a message to the state manager log file"""
    with open(os.path.join(LOG_DIR, "state_manager.log"), "a") as f:
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
        f.write(f"[{timestamp}] {msg}\n")
    print(msg)

class StateFileHandler(FileSystemEventHandler):
    def on_modified(self, event):
        global proxy_enabled
        if not event.is_directory and Path(event.src_path).name == Path(STATE_FILE).name:
            try:
                with open(STATE_FILE, 'r') as f:
                    state = json.load(f)
                    proxy_enabled = state.get('enabled', True)
                    log_message(f"Proxy filtering {'enabled' if proxy_enabled else 'disabled'}")
            except Exception as e:
                log_message(f"Error reading state file: {e}")
                proxy_enabled = True  # Default to enabled on error

def is_proxy_filtering_enabled():
    """Function that can be imported by the proxy script to check if filtering is enabled"""
    global proxy_enabled
    return proxy_enabled

def create_default_state_file():
    """Create the default state file if it doesn't exist"""
    if not os.path.exists(STATE_FILE):
        with open(STATE_FILE, 'w') as f:
            json.dump({"enabled": True, "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S")}, f)
        os.chmod(STATE_FILE, 0o644)  # Make it readable by all users
        log_message(f"Created default state file at {STATE_FILE}")

if __name__ == "__main__":
    create_default_state_file()
    
    # Set up file watcher
    event_handler = StateFileHandler()
    observer = Observer()
    observer.schedule(event_handler, path=str(Path(STATE_FILE).parent), recursive=False)
    observer.start()
    
    try:
        log_message(f"Monitoring {STATE_FILE} for changes...")
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
