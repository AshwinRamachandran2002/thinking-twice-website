fly apps create c9
fly secrets set PASSWORD=contextfort2025

# Prompt for OpenAI API key instead of hardcoding it
echo "Please enter your OpenAI API key (it will not be stored in the script):"
read -s OPENAI_API_KEY
fly secrets set OPENAI_API_KEY="$OPENAI_API_KEY"

fly deploy