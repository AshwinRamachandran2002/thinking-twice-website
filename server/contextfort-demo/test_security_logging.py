#!/usr/bin/env python3
"""
Test script for the security decision logging
"""

import os
import json
import sys
from datetime import datetime

# Add security decision log entry to test our dashboard
LOG_FOLDER = "/tmp/contextfort_logs"
SECURITY_LOG_FOLDER = os.path.join(LOG_FOLDER, "security_decisions")

# Create folders if they don't exist
os.makedirs(SECURITY_LOG_FOLDER, exist_ok=True)

# Create a test security decision
timestamp = datetime.now().isoformat()
decision_id = f"decision_{timestamp.replace(':', '-').replace('.', '-')}"
log_file = os.path.join(SECURITY_LOG_FOLDER, f"{decision_id}.json")

# Create tool call data
tool_calls = [
    {
        "id": "test-id-1",
        "type": "function",
        "function": {
            "name": "run_in_terminal",
            "arguments": json.dumps({
                "command": "rm -rf /",
                "explanation": "Wipe the disk",
                "isBackground": False
            })
        }
    }
]

# Create decision data
decision_data = {
    "timestamp": timestamp,
    "request_url": "https://api.github.com/copilot/v1/chat/completions",
    "tool_calls": tool_calls,
    "decision": "blocked",
    "reason": "Dangerous command detected - rm -rf /"
}

# Write decision to file
with open(log_file, "w") as f:
    json.dump(decision_data, f, indent=2)
    
# Set permissions
os.chmod(log_file, 0o644)

print(f"Created test security decision log: {log_file}")

# Also create an allowed test entry
timestamp = datetime.now().isoformat()
decision_id = f"decision_{timestamp.replace(':', '-').replace('.', '-')}"
log_file = os.path.join(SECURITY_LOG_FOLDER, f"{decision_id}.json")

# Safe tool call
tool_calls = [
    {
        "id": "test-id-2",
        "type": "function",
        "function": {
            "name": "read_file",
            "arguments": json.dumps({
                "filePath": "/home/user/test.txt",
                "startLineNumberBaseZero": 0,
                "endLineNumberBaseZero": 10
            })
        }
    }
]

# Create decision data
decision_data = {
    "timestamp": timestamp,
    "request_url": "https://api.github.com/copilot/v1/chat/completions",
    "tool_calls": tool_calls,
    "decision": "allowed",
    "reason": None
}

# Write decision to file
with open(log_file, "w") as f:
    json.dump(decision_data, f, indent=2)
    
# Set permissions
os.chmod(log_file, 0o644)

print(f"Created test security decision log: {log_file}")
print("Test data created successfully - reload the dashboard to see the entries")
