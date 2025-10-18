# DataMaker MCP Server

The Automators DataMaker MCP (Model Context Protocol) server provides a seamless integration between DataMaker and the Model Context Protocol, enabling AI models to interact with DataMaker's powerful data generation capabilities.

## 🚀 Features

- Generate synthetic data using DataMaker templates
- Fetch and manage DataMaker templates
- Fetch and manage DataMaker connections
- Push data to DataMaker connections
- **Large dataset handling**: Automatically stores large endpoint datasets to S3 and provides summary with view links
- **MCP Prompts**: Pre-built prompts to help you get started and guide you through common workflows

## 📦 Installation

Add the following to your `mcp.json` file:

```json
{
  "mcpServers": {
    "datamaker": {
      "command": "npx",
      "args": ["-y", "@automators/datamaker-mcp"],
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
- AWS S3 bucket and credentials (for large dataset storage)

## 🏃‍♂️ Usage

### MCP Prompts

The DataMaker MCP server includes helpful prompts to guide you through common workflows. These prompts can be accessed through any MCP-compatible client that supports prompts.

Available prompts:

1. **`getting-started`** - Complete introduction to DataMaker and its capabilities
2. **`generate-synthetic-data`** - Guide for generating synthetic data from templates
3. **`export-data-workflow`** - Guide for exporting data to endpoints
4. **`endpoint-data-workflow`** - Guide for fetching and working with endpoint data
5. **`template-management`** - Guide for understanding and managing templates
6. **`connection-management`** - Guide for managing database connections
7. **`scenario-workflow`** - Guide for working with DataMaker scenarios (Python code execution)

These prompts provide step-by-step instructions and automatically suggest which tools to use for your specific task.

### Large Dataset Handling

The `get_endpoints` tool automatically detects when a large dataset is returned (more than 10 endpoints) and:

1. **Stores the complete dataset** to your configured S3 bucket
2. **Returns a summary** showing only the first 5 endpoints
3. **Provides a secure link** to view the complete dataset (expires in 24 hours)

This prevents overwhelming responses while maintaining access to all data.

### Development Mode

Create a `.env` file in your project root. You can copy from `env.example`:

```bash
cp env.example .env
```

Then edit `.env` with your actual values:

```env
DATAMAKER_URL="https://dev.datamaker.app"
DATAMAKER_API_KEY="your-datamaker-api-key"

# S3 Configuration (optional, for large dataset storage)
S3_BUCKET="your-s3-bucket-name"
S3_REGION="us-east-1"
S3_ACCESS_KEY_ID="your-aws-access-key"
S3_SECRET_ACCESS_KEY="your-aws-secret-key"
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
