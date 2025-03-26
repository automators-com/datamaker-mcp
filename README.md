# DataMaker MCP Server

The Automators DataMaker MCP (Model Context Protocol) server provides a seamless integration between DataMaker and the AI agents such as Datamaker Chat, Cursor, Claude Code etc.

## 🚀 Features

- Generate synthetic data using existing DataMaker templates
- Fetch and manage DataMaker templates
- Fetch and manage DataMaker connections
- Push data to DataMaker connections

## 📦 Installation

```json
// cursor mcp.json
{
  "mcpServers": {
    "datamaker": {
      "command": "npx",
      "args": [
        "-y",
        "@automators/datamaker-mcp"
      ],
      "env": {
        "DATAMAKER_API_KEY": "your-datamaker-api-key"
      }
    }
  }
}

```

## 📋 Prerequisites

- [Node.js](https://nodejs.org/en/download/) (LTS version recommended)
- [pnpm](https://pnpm.io/) package manager (v10.5.2 or later)
- A DataMaker account with API access


## 🏃‍♂️ Usage

### Development Mode

Create a `.env` file in your project root:

```env
DATAMAKER_URL="https://dev.datamaker.app"
DATAMAKER_API_KEY="your-datamaker-api-key"
```

Run the server with the MCP Inspector for debugging:

```bash
pnpm dev
```
## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

ISC License - See [LICENSE](LICENSE) for details. 