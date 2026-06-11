import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const REPO_ROOT = path.join(process.cwd(), "oracle-ai-developer-hub");

const TEXT_EXTENSIONS = new Set([
  ".py", ".js", ".ts", ".tsx", ".jsx", ".md", ".txt", ".json", ".yaml", ".yml",
  ".toml", ".cfg", ".ini", ".sh", ".bash", ".sql", ".html", ".css",
  ".svg", ".go", ".java", ".tf", ".tfvars", ".xml",
]);

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get("path");
    const projectId = searchParams.get("projectId");

    if (!filePath || !projectId) {
      return NextResponse.json({ error: "Missing path or projectId" }, { status: 400 });
    }

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

    const stat = fs.statSync(normalized);
    if (stat.isDirectory()) {
      // Return directory listing (shallow)
      const entries = fs.readdirSync(normalized, { withFileTypes: true });
      const files = entries
        .filter(e => !e.name.startsWith(".") && e.name !== "node_modules" && e.name !== "__pycache__" && e.name !== ".git")
        .map(e => ({
          name: e.name,
          type: e.isDirectory() ? "directory" : "file",
          path: filePath ? `${filePath}/${e.name}` : e.name,
          extension: e.isFile() ? path.extname(e.name).toLowerCase() : undefined,
          size: e.isFile() ? fs.statSync(path.join(normalized, e.name)).size : undefined,
        }));
      return NextResponse.json({ type: "directory", files, path: filePath });
    }

    // Check if it's a text file
    const ext = path.extname(normalized).toLowerCase();
    const basename = path.basename(normalized);
    const isText = TEXT_EXTENSIONS.has(ext) || basename === "Dockerfile" || basename === "Makefile" || basename === "LICENSE" || basename.startsWith(".env");

    if (!isText) {
      return NextResponse.json({ error: "Binary file", type: "binary", size: stat.size }, { status: 400 });
    }

    // Limit file size to 200KB
    if (stat.size > 200 * 1024) {
      const content = fs.readFileSync(normalized, "utf-8").substring(0, 50000);
      return NextResponse.json({ type: "file", content: content + "\n\n... (truncated)", path: filePath, size: stat.size, extension: ext, truncated: true });
    }

    const content = fs.readFileSync(normalized, "utf-8");
    return NextResponse.json({ type: "file", content, path: filePath, size: stat.size, extension: ext });
  } catch (err) {
    console.error("File API Error:", err);
    return NextResponse.json({ error: "Internal server error", details: String(err) }, { status: 500 });
  }
}
