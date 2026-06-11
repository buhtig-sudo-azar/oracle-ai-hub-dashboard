import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const REPO_ROOT = path.join(process.cwd(), "oracle-ai-developer-hub");

// Text file extensions that we can display
const TEXT_EXTENSIONS = new Set([
  ".py", ".js", ".ts", ".tsx", ".jsx", ".md", ".txt", ".json", ".yaml", ".yml",
  ".toml", ".cfg", ".ini", ".sh", ".bash", ".zsh", ".sql", ".html", ".css",
  ".scss", ".less", ".xml", ".svg", ".go", ".java", ".rs", ".rb", ".php",
  ".c", ".cpp", ".h", ".hpp", ".cs", ".swift", ".kt", ".scala", ".r",
  ".R", ".m", ".mm", ".pl", ".pm", ".lua", ".vim", ".el", ".clj", ".hs",
  ".ml", ".ex", ".exs", ".erl", ".hrl", ".dart", ".groovy", ".gradle",
  ".dockerfile", ".makefile", ".cmake", ".proto", ".graphql", ".gql",
  ".env", ".gitignore", ".dockerignore", ".editorconfig", ".prettierrc",
  ".eslintrc", ".babelrc", ".tsconfig", ".webpack", ".vite",
  ".tf", ".tfvars", ".hcl",
]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filePath = searchParams.get("path");
  const projectId = searchParams.get("projectId");

  if (!filePath || !projectId) {
    return NextResponse.json({ error: "Missing path or projectId" }, { status: 400 });
  }

  // Project ID to repo path mapping (same as project API)
  const PROJECT_MAP: Record<string, string> = {
    "agent-reasoning": "apps/agent-reasoning",
    "picooraclaw": "apps/picooraclaw",
    "agentic-rag": "apps/agentic_rag",
    "finance-ai-agent": "apps/finance-ai-agent-demo",
    "fittracker": "apps/FitTracker",
    "oci-genai-jet": "apps/oci-generative-ai-jet-ui",
    "tanstack-shoe-store": "apps/tanstack-shoe-store",
    "oracle-data-migration": "apps/oracle-data-migration-harness",
    "oracle-rag": "apps/oracle-rag",
    "supplychain-agent": "apps/supplychain-demand-planning-agent",
    "oracle-java-memory": "apps/oracle-database-java-agent-memory",
    "rag-to-memory": "apps/rag-to-memory-systems-demo",
    "oracle-vector-search": "apps/oracle-database-vector-search",
    "limitless-workflow": "apps/limitless-workflow",
    "vecdb": "apps/vecdb",
    "ir-to-rag": "workshops/information_retrieval_to_RAG",
    "rag-to-agents": "workshops/from_rag_to_agents_workshop",
    "agent-memory-ws": "workshops/agent_memory_workshop",
    "enterprise-harness": "workshops/enterprise-data-agent-harness-workshop",
    "supplychain-ws": "workshops/supplychain_demand_agent_workshop",
  };

  const repoPath = PROJECT_MAP[projectId];
  if (!repoPath) {
    return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
  }

  // Security: prevent path traversal
  const fullPath = path.join(REPO_ROOT, repoPath, filePath);
  const normalized = path.normalize(fullPath);
  if (!normalized.startsWith(path.normalize(REPO_ROOT))) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  if (!fs.existsSync(normalized)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  // Check if it's a directory
  const stat = fs.statSync(normalized);
  if (stat.isDirectory()) {
    // Return directory listing
    const entries = fs.readdirSync(normalized, { withFileTypes: true });
    const files = entries
      .filter(e => !e.name.startsWith(".") && e.name !== "node_modules" && e.name !== "__pycache__")
      .sort((a, b) => {
        if (a.isDirectory() && !b.isDirectory()) return -1;
        if (!a.isDirectory() && b.isDirectory()) return 1;
        return a.name.localeCompare(b.name);
      })
      .map(e => ({
        name: e.name,
        type: e.isDirectory() ? "directory" : "file",
        path: path.join(filePath, e.name),
        extension: e.isFile() ? path.extname(e.name).toLowerCase() : undefined,
        size: e.isFile() ? fs.statSync(path.join(normalized, e.name)).size : undefined,
      }));
    return NextResponse.json({ type: "directory", files, path: filePath });
  }

  // Check if it's a text file
  const ext = path.extname(normalized).toLowerCase();
  const isText = TEXT_EXTENSIONS.has(ext) || 
    path.basename(normalized).startsWith(".env") ||
    path.basename(normalized) === "Dockerfile" ||
    path.basename(normalized) === "Makefile" ||
    path.basename(normalized) === "LICENSE";

  if (!isText) {
    return NextResponse.json({ error: "Binary file - cannot display", type: "binary", size: stat.size }, { status: 400 });
  }

  // Limit file size to 500KB
  if (stat.size > 500 * 1024) {
    const content = fs.readFileSync(normalized, "utf-8").substring(0, 50000);
    return NextResponse.json({
      type: "file",
      content: content + "\n\n... (file truncated, too large to display completely)",
      path: filePath,
      size: stat.size,
      extension: ext,
      truncated: true,
    });
  }

  const content = fs.readFileSync(normalized, "utf-8");
  return NextResponse.json({
    type: "file",
    content,
    path: filePath,
    size: stat.size,
    extension: ext,
  });
}
