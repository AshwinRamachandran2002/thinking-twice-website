# ContextFort Security Extension

ContextFort is a security extension for Visual Studio Code that provides monitoring and filtering capabilities for AI assistant interactions. It helps protect sensitive information by acting as a proxy between your code editor and AI coding assistants.

## Features

- **Proxy Filtering**: Intercept and filter requests to AI assistants to prevent sensitive data leakage
- **Security Dashboard**: Monitor all interactions and security decisions in real-time
- **Toggle Protection**: Easily enable or disable the security proxy with a keyboard shortcut
- **Detailed Logging**: Track all requests and security decisions for audit purposes

## Getting Started

1. Install the extension from the Visual Studio Code Marketplace
2. The extension will automatically activate and show the instructions panel
3. Use the commands or keyboard shortcuts to manage the extension

## Commands

- `Open ContextFort Instructions` (Ctrl+Alt+I): View detailed usage instructions
- `Toggle ContextFort Proxy Filtering` (Ctrl+Alt+P): Enable or disable the security proxy
- `Open ContextFort Security Dashboard` (Ctrl+Alt+D): View the security dashboard with logs of all interactions

## How It Works

ContextFort operates as a proxy between your editor and AI coding assistants. It monitors all requests and responses, applying security filters to prevent sensitive information from being sent to external AI services.

## Requirements

- Visual Studio Code version 1.100.0 or higher

## Extension Settings

This extension doesn't add any VS Code settings directly, but manages its configuration through commands and UI.

## Known Issues

Please report any issues on the GitHub repository.

## Release Notes

### 0.0.1

- Initial release of the ContextFort extension
- Basic proxy filtering functionality
- Security dashboard for monitoring
- Command palette integration
