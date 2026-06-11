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

function getDirectoryTree(dirPath: string, relativeTo: string, maxDepth = 2, currentDepth = 0): FileEntry[] {
  if (currentDepth >= maxDepth) return [];
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const result: FileEntry[] = [];
    // Sort: directories first, then files
    const sorted = entries.sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });
    for (const entry of sorted) {
      // Skip hidden dirs, node_modules, __pycache__, .git, etc.
      if (entry.name.startsWith(".") || entry.name === "node_modules" || entry.name === "__pycache__" || entry.name === ".git") continue;
      const fullPath = path.join(dirPath, entry.name);
      const relPath = path.relative(relativeTo, fullPath);
      if (entry.isDirectory()) {
        result.push({
          name: entry.name,
          path: relPath,
          type: "directory",
        });
      } else {
        const ext = path.extname(entry.name).toLowerCase();
        const stat = fs.statSync(fullPath);
        result.push({
          name: entry.name,
          path: relPath,
          type: "file",
          size: stat.size,
          extension: ext,
        });
      }
    }
    return result;
  } catch {
    return [];
  }
}

// Project ID to repo path mapping
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const projectInfo = PROJECT_MAP[id];

  if (!projectInfo) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const projectDir = path.join(REPO_ROOT, projectInfo.repoPath);

  if (!fs.existsSync(projectDir)) {
    return NextResponse.json({ error: "Project directory not found on disk", path: projectInfo.repoPath }, { status: 404 });
  }

  // Read README
  let readme = "";
  const readmeNames = ["README.md", "readme.md", "Readme.md"];
  for (const name of readmeNames) {
    const readmePath = path.join(projectDir, name);
    if (fs.existsSync(readmePath)) {
      readme = fs.readFileSync(readmePath, "utf-8");
      break;
    }
  }

  // Get file tree
  const fileTree = getDirectoryTree(projectDir, projectDir, 3);

  // Get project stats
  const totalFiles = countFiles(projectDir, 0);
  const totalSize = getDirSize(projectDir);

  return NextResponse.json({
    id,
    repoPath: projectInfo.repoPath,
    type: projectInfo.type,
    readme,
    fileTree,
    stats: {
      totalFiles,
      totalSize,
      totalSizeFormatted: formatBytes(totalSize),
    },
    githubUrl: `https://github.com/oracle-devrel/oracle-ai-developer-hub/tree/main/${projectInfo.repoPath}`,
  });
}

function countFiles(dirPath: string, depth: number): number {
  if (depth > 5) return 0;
  try {
    let count = 0;
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith(".") || entry.name === "node_modules" || entry.name === "__pycache__") continue;
      if (entry.isDirectory()) {
        count += countFiles(path.join(dirPath, entry.name), depth + 1);
      } else {
        count++;
      }
    }
    return count;
  } catch {
    return 0;
  }
}

function getDirSize(dirPath: string): number {
  try {
    let size = 0;
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith(".") || entry.name === "node_modules" || entry.name === "__pycache__") continue;
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        size += getDirSize(fullPath);
      } else {
        try {
          size += fs.statSync(fullPath).size;
        } catch { /* skip */ }
      }
    }
    return size;
  } catch {
    return 0;
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}
