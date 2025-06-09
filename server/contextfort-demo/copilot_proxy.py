import os
from mitmproxy import http
from datetime import datetime
import json
import sys
import dotenv
from mitmproxy.http import Response


dotenv.load_dotenv()

# Add the path where the proxy_state_manager is located
sys.path.append('/opt/contextfort')

# Try to import the proxy state manager
try:
    from proxy_state_manager import is_proxy_filtering_enabled
    check_proxy_enabled = is_proxy_filtering_enabled
except ImportError:
    # Default to always enabled if the module isn't available
    def check_proxy_enabled():
        print("Warning: Could not import proxy_state_manager, defaulting to enabled")
        return True

# Import the security checker
from check import SecurityChecker, Context

# Path to intercept for Copilot completions
INTERCEPTED_PATH = "/chat/completions"

# Define the folder where logs will be stored
LOG_FOLDER = "/tmp/contextfort_logs"
if not os.path.exists(LOG_FOLDER):
    os.makedirs(LOG_FOLDER)

# Create an additional folder for security decisions
SECURITY_LOG_FOLDER = os.path.join(LOG_FOLDER, "security_decisions")
if not os.path.exists(SECURITY_LOG_FOLDER):
    os.makedirs(SECURITY_LOG_FOLDER)

def log_request(flow: http.HTTPFlow):
    """Logs the request details to a file."""
    # Get timestamp for the log file
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    log_filename = os.path.join(LOG_FOLDER, f"request_{timestamp}.json")
    
    # Prepare request data to log
    request_data = {
        "method": flow.request.method,
        "url": flow.request.pretty_url,
        "headers": dict(flow.request.headers),
        "body": flow.request.get_text(),  # Limit long bodies
        "timestamp": timestamp
    }

    # Write request data to log file
    with open(log_filename, "w") as log_file:
        json.dump(request_data, log_file, indent=4)
    print(f"🔍 Intercepted request at {timestamp}")


def extract_tool_calls_from_response(response_body: str) -> list:
    """Extract tool calls from the response body."""
    tool_calls = []
    current_tool_call = None
    
    try:
        # Split the SSE data into individual lines
        lines = response_body.split('\n')
        
        for line in lines:
            line = line.strip()
            if line.startswith('data: ') and line != 'data: [DONE]':
                try:
                    # Extract JSON from the data line
                    json_data = line[6:]  # Remove 'data: ' prefix
                    data = json.loads(json_data)
                    
                    # Check if any choice has tool_calls in delta
                    if 'choices' in data:
                        for choice in data['choices']:
                            if 'delta' in choice and 'tool_calls' in choice['delta']:
                                delta_tool_calls = choice['delta']['tool_calls']
                                
                                for delta_tool_call in delta_tool_calls:
                                    tool_call_id = delta_tool_call.get('id')
                                    tool_call_index = delta_tool_call.get('index', 0)
                                    
                                    # If this is a new tool call, create it
                                    if tool_call_id and (not current_tool_call or current_tool_call.get('id') != tool_call_id):
                                        if current_tool_call:
                                            tool_calls.append(current_tool_call)
                                        
                                        current_tool_call = {
                                            'id': tool_call_id,
                                            'type': delta_tool_call.get('type', 'function'),
                                            'function': {
                                                'name': '',
                                                'arguments': ''
                                            }
                                        }
                                    
                                    # Update function details
                                    if current_tool_call and 'function' in delta_tool_call:
                                        function_data = delta_tool_call['function']
                                        if 'name' in function_data:
                                            current_tool_call['function']['name'] = function_data['name']
                                        if 'arguments' in function_data:
                                            current_tool_call['function']['arguments'] += function_data['arguments']
                                
                except json.JSONDecodeError:
                    continue
        
        # Add the last tool call if it exists
        if current_tool_call:
            tool_calls.append(current_tool_call)
                    
        return tool_calls
    except Exception as e:
        print(f"❌ Error extracting tool calls: {e}")
        return []

def detect_tool_calls_in_response(response_body: str) -> bool:
    """Check if the response body contains tool calls."""
    tool_calls = extract_tool_calls_from_response(response_body)
    return len(tool_calls) > 0
import time


def perform_security_check(request_data: dict, response_data: dict):
    """Perform security check using SecurityChecker class directly."""
    try:
        start_time = time.time()  # Start timer
        # Extract messages from request body

        request_body = json.loads(request_data['body'])
        messages = request_body.get('messages', [])
        
        if not messages:
            print("❌ No messages found in request")
            return
            
        # Extract tool calls from response data
        response_tool_calls = extract_tool_calls_from_response(response_data['body'])
        
        if not response_tool_calls:
            print("ℹ️  No tool calls found in response")
            return
            
        print(f"🔍 Processing context with {len(messages)} messages")
        print(f"🔧 Found {len(response_tool_calls)} tool calls in response:")
        
        for tool_call in response_tool_calls:
            print(f"  - {tool_call['function']['name']}: {tool_call['function']['arguments']}")
        
        # Add assistant message with tool calls to context
        assistant_message = {
            "role": "assistant",
            "content": None,
            "tool_calls": response_tool_calls
        }
        
        # Create updated messages list with the tool call
        updated_messages = messages + [assistant_message]
        
        # Create context and security checker
        context = Context(updated_messages)
        checker = SecurityChecker(model_path='gpt-4o')
        
        # beta_result = checker.beta_check(context)
        beta_result = checker.alpha_check(context)
        # Calculate elapsed time
        elapsed_time = time.time() - start_time
        print(f"⏱️ Security check took {elapsed_time:.3f} seconds")
        
        # Log the security decision with detailed information
        security_log = {
            "timestamp": datetime.now().strftime("%Y-%m-%d_%H-%M-%S"),
            "request_url": request_data["url"],
            "tool_calls": response_tool_calls,
            "decision": "allowed" if beta_result else "blocked",
            "reason": "Security check passed" if beta_result else "Security check failed",
            "time_taken_seconds": elapsed_time
        }
        
        # Save the decision log
        security_log_path = os.path.join(
            SECURITY_LOG_FOLDER, 
            f"decision_{security_log['timestamp']}.json"
        )
        with open(security_log_path, "w") as log_file:
            json.dump(security_log, log_file, indent=4)

        return beta_result
            
    except Exception as e:
        print(f"❌ Error performing security check: {e}")

def log_response(flow: http.HTTPFlow):
    """Logs the response details to a file."""
    # Get timestamp for the log file
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    log_filename = os.path.join(LOG_FOLDER, f"response_{timestamp}.json")
    
    # Prepare response data to log
    response_data = {
        "status_code": flow.response.status_code,
        "url": flow.request.pretty_url,
        "headers": dict(flow.response.headers),
        "body": flow.response.get_text(),  # Limit long bodies
        "timestamp": timestamp
    }

    # Write response data to log file
    with open(log_filename, "w") as log_file:
        json.dump(response_data, log_file, indent=4)
    
    # Check for tool calls in the response
    if detect_tool_calls_in_response(response_data["body"]):
        print("🔧 Tool call detected in response!")
        
        # Check if proxy filtering is enabled
        if not check_proxy_enabled():
            print("ℹ️  Proxy filtering is disabled, skipping security check")
            return
            
        # Get the corresponding request data
        try:
            # Find the most recent request file
            request_files = [f for f in os.listdir(LOG_FOLDER) if f.startswith("request_")]
            if request_files:
                latest_request = sorted(request_files)[-1]
                request_path = os.path.join(LOG_FOLDER, latest_request)
                
                with open(request_path, "r") as f:
                    request_data = json.load(f)
                
                # Perform security check with both request and response context
                tool_calls = extract_tool_calls_from_response(response_data['body'])
                
                if check_proxy_enabled():
                    # Only perform security check if proxy filtering is enabled
                    security_passed = perform_security_check(request_data, response_data)
                    
                    if security_passed:
                        print("✅ Security check passed")
                        log_security_decision(
                            request_data['url'], 
                            tool_calls, 
                            "allowed"
                        )
                    else:
                        # Create a proper chat response indicating tool execution was blocked
                        blocked_message = {
                            "id": "contextfort-security-block",
                            "object": "chat.completion",
                            "created": int(datetime.now().timestamp()),
                            "model": "gpt-4",
                            "choices": [{
                                "index": 0,
                                "message": {
                                    "role": "assistant",
                                    "content": "🔒 Tool execution blocked by ContextFort security assessment. The requested action was determined to be potentially unsafe and will not be executed."
                                },
                                "finish_reason": "stop"
                            }],
                            "usage": {
                                "prompt_tokens": 0,
                                "completion_tokens": 0,
                                "total_tokens": 0
                            }
                        }
                        
                        flow.response = Response.make(
                            200,
                            json.dumps(blocked_message).encode(),
                            {"Content-Type": "application/json"}
                        )
                        print("❌ Response blocked due to failed security check - returning security message")
                        log_security_decision(
                            request_data['url'], 
                            tool_calls, 
                            "blocked", 
                            "Security check failed"
                        )
                else:
                    # If proxy filtering is disabled, just log the decision as allowed
                    print("ℹ️ Proxy filtering disabled, skipping security check")
                    if tool_calls:
                        log_security_decision(
                            request_data['url'],
                            tool_calls,
                            "allowed",
                            "Proxy filtering disabled"
                        )
                    
            else:
                print("❌ No corresponding request file found")
                
        except Exception as e:
            print(f"❌ Error processing tool call context: {e}")

def request(flow: http.HTTPFlow):
    """Intercept and log Copilot requests."""
    if "openai.com" in flow.request.pretty_host:
        return
    if "githubcopilot.com" in flow.request.pretty_host or "individual.githubcopilot.com" in flow.request.pretty_host:
        if flow.request.path.startswith(INTERCEPTED_PATH):
            # Always log requests regardless of proxy state
            log_request(flow)

def response(flow: http.HTTPFlow):
    """Intercept and log Copilot responses."""
    if "openai.com" in flow.request.pretty_host:
        return
    if "githubcopilot.com" in flow.request.pretty_host or "individual.githubcopilot.com" in flow.request.pretty_host:
        if flow.request.path.startswith(INTERCEPTED_PATH):
            # Always log responses regardless of proxy state
            log_response(flow)

def log_security_decision(request_url, tool_calls, decision, reason=None):
    """
    Log a security decision for displaying in the dashboard
    
    Args:
        request_url: The URL that was requested
        tool_calls: Array of tool calls that were detected
        decision: "allowed" or "blocked"
        reason: Reason for blocking (if decision is "blocked")
    """
    try:
        timestamp = datetime.now().isoformat()
        decision_id = f"decision_{timestamp.replace(':', '-').replace('.', '-')}"
        log_file = os.path.join(SECURITY_LOG_FOLDER, f"{decision_id}.json")
        
        decision_data = {
            "timestamp": timestamp,
            "request_url": request_url,
            "tool_calls": tool_calls,
            "decision": decision,
            "reason": reason
        }
        
        with open(log_file, "w") as f:
            json.dump(decision_data, f, indent=2)
            
        # Make the file readable by all users
        os.chmod(log_file, 0o644)
        
        print(f"Security decision logged: {decision} for {request_url}")
    except Exception as e:
        print(f"Error logging security decision: {e}")

# Define the rules and contexts
