import os
from mitmproxy import http
from datetime import datetime
import json
from check import SecurityChecker, Context

# Define the folder where logs will be stored
LOG_FOLDER = "copilot_logs"
if not os.path.exists(LOG_FOLDER):
    os.makedirs(LOG_FOLDER)

# Define the path you want to intercept (e.g., Copilot Chat completions)
INTERCEPTED_PATH = "/chat/completions"
FILTER_API_URL = "http://localhost:8000/filter"


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

def perform_security_check(request_data: dict, response_data: dict):
    """Perform security check using SecurityChecker class directly."""
    try:
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
        
        beta_result = checker.beta_check(context)

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
                if perform_security_check(request_data, response_data):
                    print("✅ Security check passed")
                else:
                    flow.response = http.HTTPResponse.make(
                        403,
                        b"Blocked by Copilot Proxy: Security check failed.",
                        {"Content-Type": "text/plain"}
                    )
                    print("❌ Response blocked due to failed security check")
            else:
                print("❌ No corresponding request file found")
                
        except Exception as e:
            print(f"❌ Error processing tool call context: {e}")

def request(flow: http.HTTPFlow):
    """Intercept and log Copilot requests."""
    if "githubcopilot.com" in flow.request.pretty_host or "individual.githubcopilot.com" in flow.request.pretty_host:
        if flow.request.path.startswith(INTERCEPTED_PATH):
            log_request(flow)

def response(flow: http.HTTPFlow):
    """Intercept and log Copilot responses."""
    if "githubcopilot.com" in flow.request.pretty_host or "individual.githubcopilot.com" in flow.request.pretty_host:
        if flow.request.path.startswith(INTERCEPTED_PATH):
            log_response(flow)
