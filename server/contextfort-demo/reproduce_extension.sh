cd copilotproxy
npm run compile
vsce package
code --install-extension copilotproxy-0.0.1.vsix
cd ..
rm copilotproxy-0.0.1.vsix
mv copilotproxy/copilotproxy-0.0.1.vsix copilotproxy-0.0.1.vsix
echo "Extension packaged and installed as copilotproxy.vsix"