# DataMaker MCP Server

The Automators DataMaker MCP (Model Context Protocol) server provides a seamless integration between DataMaker and the Model Context Protocol, enabling AI models to interact with DataMaker's powerful data generation capabilities.

## 🚀 Features

- Generate synthetic data using DataMaker templates
- Fetch and manage DataMaker templates
- Fetch and manage DataMaker connections
- Push data to DataMaker connections
- **Large dataset handling**: Automatically stores large endpoint datasets to S3 and provides summary with view links
- **Execute Python scripts**: Dynamically execute Python code by saving scripts to S3 and running them using the DataMaker runner

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

### Large Dataset Handling

The `get_endpoints` tool automatically detects when a large dataset is returned (more than 10 endpoints) and:

1. **Stores the complete dataset** to your configured S3 bucket
2. **Returns a summary** showing only the first 5 endpoints
3. **Provides a secure link** to view the complete dataset (expires in 24 hours)

This prevents overwhelming responses while maintaining access to all data.

### Python Script Execution

The `execute_python_script` tool allows you to dynamically execute Python code:

1. **Saves the script** to S3 using the `/api/script/save` endpoint
2. **Executes the script** using the DataMaker runner via the `/api/script/run` endpoint
3. **Returns the execution output** once the script completes

**Usage Example:**
```python
# The tool accepts Python script code and a filename
execute_python_script(
  script="print('Hello from DataMaker!')",
  filename="hello.py"
)
```

This enables AI models to write and execute custom Python scripts for data processing, transformation, or any other computational tasks within the DataMaker environment.

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
