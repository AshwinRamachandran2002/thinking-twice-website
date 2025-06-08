from typing import List, Dict, Any, Optional
import json
# from transformers import AutoTokenizer, AutoModelForCausalLM
# import torch
from openai import OpenAI
import httpx
import re




class ToolCall:
    def __init__(self, id: str, function_name: str, arguments: str, type: str = "function"):
        self.id = id
        self.function_name = function_name
        self.arguments = arguments
        self.type = type
    
    @classmethod
    def from_dict(cls, tool_call_dict: Dict[str, Any]) -> 'ToolCall':
        return cls(
            id=tool_call_dict['id'],
            function_name=tool_call_dict['function']['name'],
            arguments=tool_call_dict['function']['arguments'],
            type=tool_call_dict.get('type', 'function')
        )


class Context:
    def __init__(self, messages: List[Dict[str, Any]]):
        self.messages = messages
    
    def get_last_tool_calls(self) -> Optional[ToolCall]:
        for message in reversed(self.messages):
            if message.get('role') == 'assistant' and 'tool_calls' in message:
                tool_calls = message['tool_calls']
                return [ToolCall.from_dict(tool_call) for tool_call in tool_calls]
        return None
    
    def get_user_messages(self) -> List[Dict[str, Any]]:
        return [msg for msg in self.messages if msg.get('role') == 'user']
    
    def get_trusted_messages(self, trusted_tools: List[str]) -> List[Dict[str, Any]]:
        trusted_messages = []
        tool_call_map = {}  # Map tool_call_id to tool name
        
        # First pass: build map of tool calls to their names
        for msg in self.messages:
            if msg.get('role') == 'assistant' and 'tool_calls' in msg:
                for tool_call in msg.get('tool_calls', []):
                    tool_call_id = tool_call.get('id')
                    tool_name = tool_call.get('function', {}).get('name')
                    if tool_call_id and tool_name:
                        tool_call_map[tool_call_id] = tool_name
        
        # Second pass: filter messages based on trust
        for msg in self.messages:
            if msg.get('role') == 'user':
                trusted_messages.append(msg)
            elif msg.get('role') == 'system':
                trusted_messages.append(msg)
            elif msg.get('role') == 'tool':
                # Only include tool responses from trusted tools
                tool_call_id = msg.get('tool_call_id')
                if tool_call_id in tool_call_map:
                    tool_name = tool_call_map[tool_call_id]
                    if tool_name in trusted_tools:
                        trusted_messages.append(msg)
        return trusted_messages


class SecurityChecker:
    def __init__(self, model_path: str = './models/Llama-3.2-1B', trusted_tools: List[str] = []):
        self.model_path = model_path
        self.trusted_tools = trusted_tools
        
        # Check if this is an OpenAI model
        self.is_openai_model = model_path.startswith('gpt-') or model_path.startswith('o1-')
        
        if self.is_openai_model:
            print(f"Using OpenAI model: {model_path}")
            self.openai_client = OpenAI(http_client=httpx.Client(verify=False))

            self.tokenizer = None
            self.model = None
        else:
            pass
            # Load model and tokenizer from local path
            # print(f"Loading model from local path: {model_path}")
            # self.tokenizer = AutoTokenizer.from_pretrained(model_path, local_files_only=True)
            # self.model = AutoModelForCausalLM.from_pretrained(
            #     model_path, 
            #     local_files_only=True,
            #     torch_dtype=torch.float16,
            #     device_map="auto"
            # )
                
            # if self.tokenizer.pad_token is None:
            #     self.tokenizer.pad_token = self.tokenizer.eos_token
            # self.openai_client = None

    def _query_openai_model(self, query: str) -> bool:
        try:
            print(f"Query for model {self.model_path}: {query}")
            response = self.openai_client.chat.completions.create(
                model=self.model_path,
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": query}
                ],
                max_tokens=10,
                temperature=0.1
            )

            print(f"OpenAI response: {response}")
            
            response_text = response.choices[0].message.content.strip()
            
            if "true" in response_text.lower():
                return True
            return False
            
        except Exception as e:
            print(f"Error querying OpenAI model: {e}")
            return False

    def _query_model(self, query: str) -> bool:
        if self.is_openai_model:
            return self._query_openai_model(query)
        else:
            return self._query_local_model(query)
    
    def _query_local_model(self, query: str) -> bool:
        pass
        # Tokenize input
        inputs = self.tokenizer.encode(query, return_tensors='pt', max_length=512, truncation=True)
        
        # Generate response
        with torch.no_grad():
            outputs = self.model.generate(
                inputs,
                max_new_tokens=50,
                temperature=0.1,
                do_sample=True,
                pad_token_id=self.tokenizer.eos_token_id
            )
        
        # Decode response
        response = self.tokenizer.decode(outputs[0][inputs.shape[1]:], skip_special_tokens=True)
        response = response.strip()
        
        # For boolean responses, check if response contains "true" or "false"
        if "true" in response.lower():
            return True
        return False

    def alpha_check(self, context: Context) -> bool:
        """Check if tool call aligns with user intent based on user messages only"""
        tool_calls = context.get_last_tool_calls()
        if not tool_calls:
            return True
        
        user_messages = context.get_user_messages()
        user_context = [msg['content'] for msg in user_messages]

        user_messages = []

        for msg in user_context:
            match = re.search(r"<userPrompt>(.*?)</userPrompt>", msg, re.DOTALL)
            if match:
                user_messages.append(match.group(1).strip())
        
        tool_calls_str = "\n".join([
            f"Tool call being executed: \n - Function: {tool_call.function_name}\n"
            for tool_call in tool_calls
        ])

        query = f"""
        User messages: {user_messages}

        {tool_calls_str}

        The user has requested to run a task.
        Check whether the tool call aligns with the user intent based on the user message.
        If the tool call helps gather information, supports processing, or is likely part of a multi-step solution to fulfill the request, consider it aligned.
        Be generous in your assessment of whether the tool call is required, especially for partial data gathering or preparation.
        Respond with only 'True' or 'False'.
        """
        
        response = self._query_model(query)
        return response

    def beta_check(self, context: Context) -> bool:
        """Check if tool call is safe based on trusted context only"""
        if (not self.alpha_check(context)):
            return False
        
        tool_calls = context.get_last_tool_calls()
        
        trusted_messages = context.get_trusted_messages(self.trusted_tools)

        tool_calls_str = "\n".join([
            f"Tool call being executed: \n - Function: {tool_call.function_name}\n - Arguments: {tool_call.arguments}"
            for tool_call in tool_calls
        ])

        query = f"""
        Trusted conversation context (only user messages and responses from trusted tools): 
        {trusted_messages}
        
        {tool_calls_str}
        
        Check whether the arguments can be derived from the trusted context. If the arguments are not in the trusted context, then the tool call is not safe.
        Respond with only 'True' or 'False'.
        """
        
        response = self._query_model(query)
        return response


def create_test_scenario():
    """Test that passes alpha check but fails beta check"""
    # Scenario: User asks to read a file, LLM tries to use file_read which aligns with user intent
    # but file_read is not in trusted tools list (only semantic_search is trusted)
    messages = json.load(open("body.json"))["messages"]
    
    context = Context(messages)
    # Only semantic_search is trusted, file_read is not
    checker = SecurityChecker(trusted_tools=['semantic_search'])
    
    print("Test scenario: Tool aligns with user intent but is not in trusted tools")
    print(f"Alpha check (user intent): {checker.alpha_check(context)}")  # Should be True - aligns with user request
    print(f"Beta check (trusted context): {checker.beta_check(context)}")  # Should be False - file_read not in trusted tools
    
    return context, checker


def main():
    create_test_scenario()


if __name__ == '__main__':
    main()
