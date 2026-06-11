"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  Folder,
  FolderOpen,
  File,
  ChevronRight,
  Github,
  Code2,
  BookOpen,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  FolderTree,
} from "lucide-react";

interface FileEntry {
  name: string;
  path: string;
  type: "file" | "directory";
  size?: number;
  extension?: string;
  children?: FileEntry[];
}

interface FileData {
  content: string;
  size: number;
  extension: string;
  truncated?: boolean;
}

interface ProjectData {
  id: string;
  repoPath: string;
  type: "app" | "workshop" | "notebook";
  readme: string;
  fileTree: FileEntry[];
  fullTree: FileEntry[];
  files: Record<string, FileData>;
  stats: { totalFiles: number };
  githubUrl: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function getFileIcon(name: string, type: "file" | "directory") {
  if (type === "directory") return <Folder className="h-4 w-4 text-amber-500 shrink-0" />;
  const ext = name.split(".").pop()?.toLowerCase() || "";
  const iconMap: Record<string, string> = {
    py: "🐍", js: "🟨", ts: "🔷", tsx: "🔷", jsx: "🟨", md: "📝",
    json: "📋", yaml: "⚙️", yml: "⚙️", sql: "🗄️", html: "🌐", css: "🎨",
    go: "🔵", java: "☕", tf: "🏗️", toml: "⚙️",
  };
  const emoji = iconMap[ext];
  if (emoji) return <span className="text-sm shrink-0">{emoji}</span>;
  return <File className="h-4 w-4 text-muted-foreground shrink-0" />;
}

function renderMarkdown(md: string): string {
  let html = md;
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_m, lang, code) =>
    `<pre class="bg-muted rounded-lg p-4 overflow-x-auto text-sm my-3 border border-border/50"><code class="language-${lang || "text"}">${escapeHtml(code.trim())}</code></pre>`
  );
  html = html.replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-orange-600 dark:text-orange-400">$1</code>');
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-6 mb-2 text-foreground">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-8 mb-3 text-foreground border-b border-border/50 pb-2">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-4 text-foreground">$1</h1>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-600 underline underline-offset-2">$1</a>');
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<span class="text-muted-foreground text-sm italic">[Image: $1]</span>');
  html = html.replace(/^---$/gm, '<hr class="border-border/50 my-4" />');
  html = html.replace(/^[-*] (.+)$/gm, '<li class="ml-4 list-disc text-muted-foreground">$1</li>');
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal text-muted-foreground">$1</li>');
  html = html.replace(/^(?!<[huplo]|<li|<hr|<pre|<code|<span|<strong|<em|<a|<div)(.+)$/gm, '<p class="text-muted-foreground leading-relaxed my-1">$1</p>');
  html = html.replace(/<img[^>]*shields\.io[^>]*>/g, '');
  return html;
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Flatten the tree to get files at a specific "path"
function getFilesAt(tree: FileEntry[], dirPath: string): FileEntry[] {
  if (!dirPath) return tree;
  const parts = dirPath.split("/");
  let current = tree;
  for (const part of parts) {
    const dir = current.find(e => e.type === "directory" && e.name === part);
    if (dir && dir.children) {
      current = dir.children;
    } else {
      return [];
    }
  }
  return current;
}

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // File browser state
  const [currentDir, setCurrentDir] = useState("");
  const [viewingFile, setViewingFile] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/data/${projectId}.json`)
      .then(res => {
        if (!res.ok) throw new Error("Project not found");
        return res.json();
      })
      .then(data => {
        setProject(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [projectId]);

  const handleCopy = () => {
    if (viewingFile && project?.files[viewingFile]) {
      navigator.clipboard.writeText(project.files[viewingFile].content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Current directory entries
  const currentEntries = project ? getFilesAt(project.fullTree, currentDir) : [];
  // Sort: directories first
  const sortedEntries = [...currentEntries].sort((a, b) => {
    if (a.type === "directory" && b.type !== "directory") return -1;
    if (a.type !== "directory" && b.type === "directory") return 1;
    return a.name.localeCompare(b.name);
  });

  // Breadcrumb
  const pathParts = currentDir ? currentDir.split("/").filter(Boolean) : [];

  // Currently viewing file data
  const fileData = viewingFile && project?.files[viewingFile] ? project.files[viewingFile] : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Загрузка проекта...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <h2 className="text-xl font-semibold">Проект не найден</h2>
          <p className="text-muted-foreground">{error || "Проект не существует"}</p>
          <Button variant="outline" onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> На главную
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Главная
            </Button>
            <div className="h-5 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {project.type === "app" ? "Приложение" : project.type === "workshop" ? "Воркшоп" : "Ноутбук"}
              </Badge>
              <h1 className="text-lg font-bold capitalize">{projectId.replace(/-/g, " ")}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Github className="h-4 w-4" /> GitHub
              </Button>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary"><FileText className="h-4 w-4" /></div>
              <div>
                <div className="text-xl font-bold">{project.stats.totalFiles}+</div>
                <div className="text-xs text-muted-foreground">Файлов и директорий</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary"><Code2 className="h-4 w-4" /></div>
              <div>
                <div className="text-xl font-bold">{Object.keys(project.files).length}</div>
                <div className="text-xs text-muted-foreground">Исходных файлов</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50 hidden md:flex">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary"><Folder className="h-4 w-4" /></div>
              <div>
                <div className="text-xl font-bold text-sm">{project.repoPath}</div>
                <div className="text-xs text-muted-foreground">Путь в репозитории</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="readme" className="space-y-4">
          <TabsList className="bg-card/50">
            <TabsTrigger value="readme" className="gap-1.5"><BookOpen className="h-4 w-4" /> README</TabsTrigger>
            <TabsTrigger value="files" className="gap-1.5"><FolderTree className="h-4 w-4" /> Файлы</TabsTrigger>
            <TabsTrigger value="source" className="gap-1.5"><Code2 className="h-4 w-4" /> Исходный код</TabsTrigger>
          </TabsList>

          {/* README Tab */}
          <TabsContent value="readme">
            <Card className="border-border/50">
              <CardContent className="p-6">
                {project.readme ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: renderMarkdown(project.readme) }} />
                ) : (
                  <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
                    <FileText className="h-10 w-10" />
                    <p>README не найден</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Files Tab */}
          <TabsContent value="files">
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2"><FolderOpen className="h-5 w-5" /> Обзор файлов</CardTitle>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground flex-wrap">
                    <button onClick={() => { setCurrentDir(""); setViewingFile(null); }} className="hover:text-foreground transition-colors">root</button>
                    {pathParts.map((part, i) => (
                      <span key={i} className="flex items-center gap-1">
                        <ChevronRight className="h-3 w-3" />
                        <button onClick={() => { setCurrentDir(pathParts.slice(0, i + 1).join("/")); setViewingFile(null); }} className="hover:text-foreground transition-colors">{part}</button>
                      </span>
                    ))}
                    {viewingFile && (
                      <span className="flex items-center gap-1">
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-foreground">{viewingFile.split("/").pop()}</span>
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {viewingFile && fileData ? (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Code2 className="h-4 w-4" />
                        <span className="font-mono">{viewingFile}</span>
                        {fileData.size && <span>({formatBytes(fileData.size)})</span>}
                      </div>
                      <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-1">
                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        {copied ? "Скопировано" : "Копировать"}
                      </Button>
                    </div>
                    <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm leading-relaxed border border-border/50 max-h-[600px] overflow-y-auto">
                      <code>{fileData.content}</code>
                    </pre>
                    {fileData.truncated && (
                      <p className="text-xs text-muted-foreground mt-2 italic">Файл обрезан. Полная версия на GitHub.</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    {/* Back button */}
                    {currentDir && (
                      <button
                        onClick={() => { setCurrentDir(pathParts.slice(0, -1).join("/")); setViewingFile(null); }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 transition-colors text-sm text-muted-foreground"
                      >
                        <Folder className="h-4 w-4" /> ..
                      </button>
                    )}
                    {sortedEntries.map((entry) => (
                      <button
                        key={entry.path}
                        onClick={() => {
                          if (entry.type === "directory") {
                            setCurrentDir(entry.path);
                            setViewingFile(null);
                          } else {
                            // Check if we have this file in our pre-loaded data
                            if (project.files[entry.path]) {
                              setViewingFile(entry.path);
                            } else {
                              // Open on GitHub
                              window.open(`${project.githubUrl}/${entry.path}`, "_blank");
                            }
                          }
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 transition-colors text-sm group"
                      >
                        {getFileIcon(entry.name, entry.type)}
                        <span className="flex-1 text-left group-hover:text-foreground transition-colors">{entry.name}</span>
                        {entry.size && <span className="text-xs text-muted-foreground">{formatBytes(entry.size)}</span>}
                        {entry.type === "directory" && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
                        {entry.type === "file" && !project.files[entry.path] && <ExternalLink className="h-3 w-3 text-muted-foreground" />}
                      </button>
                    ))}
                    {sortedEntries.length === 0 && (
                      <p className="text-sm text-muted-foreground py-4 text-center">Пустая директория</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Source Code Tab */}
          <TabsContent value="source">
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Quick access to key files */}
                {["README.md", "pyproject.toml", "requirements.txt", "docker-compose.yml", "Dockerfile", "Makefile", "config.yaml", "package.json", "main.py"]
                  .filter(name => project.files[name])
                  .map(name => (
                    <Card key={name} className="border-border/50 hover:border-border transition-colors cursor-pointer" onClick={() => { setViewingFile(name); }}>
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary"><Code2 className="h-4 w-4" /></div>
                        <div>
                          <div className="font-medium font-mono text-sm">{name}</div>
                          <div className="text-xs text-muted-foreground">{formatBytes(project.files[name].size)}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>

              {/* File viewer */}
              {viewingFile && fileData && (
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-mono">{viewingFile}</CardTitle>
                      <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-1">
                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        {copied ? "Скопировано" : "Копировать"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm leading-relaxed border border-border/50 max-h-[500px] overflow-y-auto">
                      <code>{fileData.content}</code>
                    </pre>
                  </CardContent>
                </Card>
              )}

              {/* Key directories */}
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2"><FolderTree className="h-5 w-5" /> Директории проекта</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-0.5">
                    {project.fileTree
                      .filter(f => f.type === "directory")
                      .map((dir) => (
                        <button key={dir.path} onClick={() => { setCurrentDir(dir.path); setViewingFile(null); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 transition-colors text-sm group">
                          <Folder className="h-4 w-4 text-amber-500 shrink-0" />
                          <span className="flex-1 text-left group-hover:text-foreground transition-colors font-medium">{dir.name}/</span>
                          <ChevronRight className="h-3 w-3 text-muted-foreground" />
                        </button>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
