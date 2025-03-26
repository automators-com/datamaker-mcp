# DataMaker MCP Server

The Automators DataMaker MCP (Model Context Protocol) server provides a seamless integration between DataMaker and the Model Context Protocol, enabling AI models to interact with DataMaker's powerful data generation capabilities.

## 🚀 Features

- Generate synthetic data using DataMaker templates
- Fetch and manage DataMaker templates
- Fetch and manage DataMaker connections
- Push data to DataMaker connections

## 📦 Installation

Add the following to your `mcp.json` file:

```json
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

This will start the MCP server and launch the MCP Inspector interface at `http://localhost:5173`.


## 🔧 Available Scripts

- `pnpm build` - Build the TypeScript code
- `pnpm dev` - Start the development server with MCP Inspector
- `pnpm changeset` - Create a new changeset
- `pnpm version` - Update versions and changelogs
- `pnpm release` - Build and publish the package

## 🚢 Release Process

This project uses [Changesets](https://github.com/changesets/changesets) to manage versions, create changelogs, and publish to npm. Here's how to make a change:

1. Create a new branch
2. Make your changes
3. Create a changeset:
   ```bash
   pnpm changeset
   ```
4. Follow the prompts to describe your changes
5. Commit the changeset file along with your changes
6. Push to your branch
7. Create a PR on GitHub

The GitHub Actions workflow will automatically:
- Create a PR with version updates and changelog
- Publish to npm when the PR is merged

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - See [LICENSE](LICENSE) for details. 