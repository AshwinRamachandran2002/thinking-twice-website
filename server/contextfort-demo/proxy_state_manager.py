#!/usr/bin/env python3
# Script to make the proxy script aware of the enabled/disabled state

import os
import json
import time
from pathlib import Path
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Path to the state file that the extension will update
SCRIPT_DIR = Path(__file__).parent
STATE_FILE = SCRIPT_DIR / "proxy_state.json"

# Global flag to track if proxy filtering is enabled
proxy_enabled = True

class StateFileHandler(FileSystemEventHandler):
    def on_modified(self, event):
        global proxy_enabled
        if not event.is_directory and Path(event.src_path).name == STATE_FILE.name:
            try:
                with open(STATE_FILE, 'r') as f:
                    state = json.load(f)
                    proxy_enabled = state.get('enabled', True)
                    print(f"Proxy filtering {'enabled' if proxy_enabled else 'disabled'}")
            except Exception as e:
                print(f"Error reading state file: {e}")
                proxy_enabled = True  # Default to enabled on error

def is_proxy_filtering_enabled():
    """Function that can be imported by the proxy script to check if filtering is enabled"""
    global proxy_enabled
    return proxy_enabled

def create_default_state_file():
    """Create the default state file if it doesn't exist"""
    if not STATE_FILE.exists():
        with open(STATE_FILE, 'w') as f:
            json.dump({"enabled": True, "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S")}, f)

if __name__ == "__main__":
    create_default_state_file()
    
    # Set up file watcher
    event_handler = StateFileHandler()
    observer = Observer()
    observer.schedule(event_handler, path=str(SCRIPT_DIR), recursive=False)
    observer.start()
    
    try:
        print(f"Monitoring {STATE_FILE} for changes...")
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
