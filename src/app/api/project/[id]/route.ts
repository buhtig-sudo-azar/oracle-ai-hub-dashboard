import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const REPO_ROOT = path.join(process.cwd(), "oracle-ai-developer-hub");

interface FileEntry {
  name: string;
  path: string;
  type: "file" | "directory";
  size?: number;
  extension?: string;
}

// Shallow scan - only top 2 levels, skip heavy dirs
function getDirectoryTree(dirPath: string, maxDepth = 1, currentDepth = 0, prefix = ""): FileEntry[] {
  if (currentDepth >= maxDepth) return [];
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const result: FileEntry[] = [];
    for (const entry of entries) {
      if (entry.name.startsWith(".") || entry.name === "node_modules" || entry.name === "__pycache__" || entry.name === ".git" || entry.name === "out" || entry.name === "dist" || entry.name === "build" || entry.name === ".next") continue;
      const fullPath = path.join(dirPath, entry.name);
      const relPath = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        result.push({ name: entry.name, path: relPath, type: "directory" });
      } else {
        try {
          const stat = fs.statSync(fullPath);
          result.push({ name: entry.name, path: relPath, type: "file", size: stat.size, extension: path.extname(entry.name).toLowerCase() });
        } catch { /* skip */ }
      }
    }
    return result;
  } catch {
    return [];
  }
}

const PROJECT_MAP: Record<string, { repoPath: string; type: "app" | "workshop" | "notebook" }> = {
  "agent-reasoning": { repoPath: "apps/agent-reasoning", type: "app" },
  "picooraclaw": { repoPath: "apps/picooraclaw", type: "app" },
  "agentic-rag": { repoPath: "apps/agentic_rag", type: "app" },
  "finance-ai-agent": { repoPath: "apps/finance-ai-agent-demo", type: "app" },
  "fittracker": { repoPath: "apps/FitTracker", type: "app" },
  "oci-genai-jet": { repoPath: "apps/oci-generative-ai-jet-ui", type: "app" },
  "tanstack-shoe-store": { repoPath: "apps/tanstack-shoe-store", type: "app" },
  "oracle-data-migration": { repoPath: "apps/oracle-data-migration-harness", type: "app" },
  "oracle-rag": { repoPath: "apps/oracle-rag", type: "app" },
  "supplychain-agent": { repoPath: "apps/supplychain-demand-planning-agent", type: "app" },
  "oracle-java-memory": { repoPath: "apps/oracle-database-java-agent-memory", type: "app" },
  "rag-to-memory": { repoPath: "apps/rag-to-memory-systems-demo", type: "app" },
  "oracle-vector-search": { repoPath: "apps/oracle-database-vector-search", type: "app" },
  "limitless-workflow": { repoPath: "apps/limitless-workflow", type: "app" },
  "vecdb": { repoPath: "apps/vecdb", type: "app" },
  "ir-to-rag": { repoPath: "workshops/information_retrieval_to_RAG", type: "workshop" },
  "rag-to-agents": { repoPath: "workshops/from_rag_to_agents_workshop", type: "workshop" },
  "agent-memory-ws": { repoPath: "workshops/agent_memory_workshop", type: "workshop" },
  "enterprise-harness": { repoPath: "workshops/enterprise-data-agent-harness-workshop", type: "workshop" },
  "supplychain-ws": { repoPath: "workshops/supplychain_demand_agent_workshop", type: "workshop" },
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectInfo = PROJECT_MAP[id];

    if (!projectInfo) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const projectDir = path.join(REPO_ROOT, projectInfo.repoPath);

    if (!fs.existsSync(projectDir)) {
      return NextResponse.json({ error: "Project directory not found on disk", path: projectInfo.repoPath }, { status: 404 });
    }

    // Read README (limit size)
    let readme = "";
    const readmeNames = ["README.md", "readme.md", "Readme.md"];
    for (const name of readmeNames) {
      const readmePath = path.join(projectDir, name);
      if (fs.existsSync(readmePath)) {
        try {
          const buf = fs.readFileSync(readmePath, { encoding: "utf-8" });
          readme = buf.substring(0, 50000); // Cap at 50KB
        } catch { /* skip */ }
        break;
      }
    }

    // Get file tree (shallow - 1 level)
    const fileTree = getDirectoryTree(projectDir, 1, 0);

    // Simple file count (top level only)
    let totalFiles = 0;
    try {
      const entries = fs.readdirSync(projectDir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.name.startsWith(".") && entry.name !== "node_modules") totalFiles++;
      }
    } catch { /* skip */ }

    return NextResponse.json({
      id,
      repoPath: projectInfo.repoPath,
      type: projectInfo.type,
      readme,
      fileTree,
      stats: {
        totalFiles,
        totalSize: 0,
        totalSizeFormatted: "N/A",
      },
      githubUrl: `https://github.com/oracle-devrel/oracle-ai-developer-hub/tree/main/${projectInfo.repoPath}`,
    });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Internal server error", details: String(err) }, { status: 500 });
  }
}
