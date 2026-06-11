// Build script: generates static project data from the cloned repo
const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.join(__dirname, "..", "oracle-ai-developer-hub");
const OUTPUT_DIR = path.join(__dirname, "..", "public", "data");

const PROJECT_MAP = {
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

const SKIP_DIRS = new Set([".git", "node_modules", "__pycache__", ".next", "out", "dist", "build", ".cache", "target"]);

const TEXT_EXTENSIONS = new Set([
  ".py", ".js", ".ts", ".tsx", ".jsx", ".md", ".txt", ".json", ".yaml", ".yml",
  ".toml", ".cfg", ".ini", ".sh", ".bash", ".sql", ".html", ".css",
  ".svg", ".go", ".java", ".tf", ".tfvars", ".xml", ".env", ".gitignore",
  ".dockerignore", ".editorconfig",
]);

function getDirectoryTree(dirPath, maxDepth = 2, currentDepth = 0, prefix = "") {
  if (currentDepth >= maxDepth) return [];
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const result = [];
    for (const entry of entries) {
      if (entry.name.startsWith(".") || SKIP_DIRS.has(entry.name)) continue;
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
  } catch { return []; }
}

function getFullTree(dirPath, maxDepth = 4, currentDepth = 0, prefix = "") {
  if (currentDepth >= maxDepth) return [];
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const result = [];
    for (const entry of entries) {
      if (entry.name.startsWith(".") || SKIP_DIRS.has(entry.name)) continue;
      const fullPath = path.join(dirPath, entry.name);
      const relPath = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        const children = getFullTree(fullPath, maxDepth, currentDepth + 1, relPath);
        result.push({ name: entry.name, path: relPath, type: "directory", children });
      } else {
        try {
          const stat = fs.statSync(fullPath);
          result.push({ name: entry.name, path: relPath, type: "file", size: stat.size, extension: path.extname(entry.name).toLowerCase() });
        } catch { /* skip */ }
      }
    }
    return result;
  } catch { return []; }
}

function collectTextFiles(dirPath, maxDepth = 3, currentDepth = 0, prefix = "") {
  if (currentDepth >= maxDepth) return {};
  const files = {};
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith(".") || SKIP_DIRS.has(entry.name)) continue;
      const fullPath = path.join(dirPath, entry.name);
      const relPath = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        Object.assign(files, collectTextFiles(fullPath, maxDepth, currentDepth + 1, relPath));
      } else {
        const ext = path.extname(entry.name).toLowerCase();
        const basename = entry.name;
        const isText = TEXT_EXTENSIONS.has(ext) || basename === "Dockerfile" || basename === "Makefile" || basename === "LICENSE" || basename.startsWith(".env");
        if (isText) {
          try {
            const stat = fs.statSync(fullPath);
            if (stat.size <= 100 * 1024) {
              const content = fs.readFileSync(fullPath, "utf-8");
              files[relPath] = { content: content.substring(0, 30000), size: stat.size, extension: ext };
              if (content.length > 30000) files[relPath].truncated = true;
            }
          } catch { /* skip */ }
        }
      }
    }
  } catch { /* skip */ }
  return files;
}

// Generate
console.log("Generating project data...");
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const indexData = {};

for (const [id, info] of Object.entries(PROJECT_MAP)) {
  const projectDir = path.join(REPO_ROOT, info.repoPath);
  console.log(`  ${id}...`);
  if (!fs.existsSync(projectDir)) { console.log(`    SKIP`); continue; }

  let readme = "";
  for (const name of ["README.md", "readme.md"]) {
    const p = path.join(projectDir, name);
    if (fs.existsSync(p)) { try { readme = fs.readFileSync(p, "utf-8").substring(0, 50000); } catch {} break; }
  }

  const fileTree = getDirectoryTree(projectDir, 2);
  const fullTree = getFullTree(projectDir, 4);
  const files = collectTextFiles(projectDir, 3);

  let totalFiles = 0;
  try { totalFiles = fs.readdirSync(projectDir).filter(n => !n.startsWith(".") && !SKIP_DIRS.has(n)).length; } catch {}

  indexData[id] = {
    id, repoPath: info.repoPath, type: info.type, readme, fileTree, fullTree, files,
    stats: { totalFiles },
    githubUrl: `https://github.com/oracle-devrel/oracle-ai-developer-hub/tree/main/${info.repoPath}`,
  };
  console.log(`    OK - README: ${readme.length}, files: ${Object.keys(files).length}`);
}

fs.writeFileSync(path.join(OUTPUT_DIR, "projects.json"), JSON.stringify(indexData));
console.log(`\nDone! Size: ${(JSON.stringify(indexData).length / 1024 / 1024).toFixed(1)} MB`);
