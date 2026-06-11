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
}

interface ProjectData {
  id: string;
  repoPath: string;
  type: "app" | "workshop" | "notebook";
  readme: string;
  fileTree: FileEntry[];
  stats: {
    totalFiles: number;
    totalSize: number;
    totalSizeFormatted: string;
  };
  githubUrl: string;
}

interface FileContent {
  type: "file" | "directory";
  content?: string;
  files?: FileEntry[];
  path: string;
  size?: number;
  extension?: string;
  truncated?: boolean;
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
    py: "🐍",
    js: "🟨",
    ts: "🔷",
    tsx: "🔷",
    jsx: "🟨",
    md: "📝",
    json: "📋",
    yaml: "⚙️",
    yml: "⚙️",
    sql: "🗄️",
    html: "🌐",
    css: "🎨",
    go: "🔵",
    java: "☕",
    tf: "🏗️",
    toml: "⚙️",
  };
  const emoji = iconMap[ext];
  if (emoji) return <span className="text-sm shrink-0">{emoji}</span>;
  return <File className="h-4 w-4 text-muted-foreground shrink-0" />;
}

function getLanguageFromExt(ext: string): string {
  const map: Record<string, string> = {
    py: "python",
    js: "javascript",
    ts: "typescript",
    tsx: "typescript",
    jsx: "javascript",
    md: "markdown",
    json: "json",
    yaml: "yaml",
    yml: "yaml",
    sql: "sql",
    html: "html",
    css: "css",
    go: "go",
    java: "java",
    tf: "hcl",
    toml: "toml",
    sh: "bash",
    txt: "text",
    xml: "xml",
    svg: "xml",
  };
  return map[ext.replace(".", "")] || "text";
}

// Simple markdown-to-HTML renderer for README
function renderMarkdown(md: string): string {
  let html = md;

  // Code blocks with language
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_match, lang, code) => {
    return `<pre class="bg-muted rounded-lg p-4 overflow-x-auto text-sm my-3 border border-border/50"><code class="language-${lang || "text"}">${escapeHtml(code.trim())}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-orange-600 dark:text-orange-400">$1</code>');

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-6 mb-2 text-foreground">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-8 mb-3 text-foreground border-b border-border/50 pb-2">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-4 text-foreground">$1</h1>');

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');

  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-600 underline underline-offset-2">$1</a>');

  // Images (convert to links since we can't serve local images)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<span class="text-muted-foreground text-sm italic">[Image: $1]</span>');

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr class="border-border/50 my-4" />');

  // Unordered lists
  html = html.replace(/^[-*] (.+)$/gm, '<li class="ml-4 list-disc text-muted-foreground">$1</li>');

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal text-muted-foreground">$1</li>');

  // Paragraphs - wrap non-tagged lines
  html = html.replace(/^(?!<[huplo]|<li|<hr|<pre|<code|<span|<strong|<em|<a|<div)(.+)$/gm, '<p class="text-muted-foreground leading-relaxed my-1">$1</p>');

  // Table support (basic)
  html = html.replace(/^\|(.+)\|$/gm, (match) => {
    return match;
  });

  // Badges/images - remove img shields.io
  html = html.replace(/<img[^>]*shields\.io[^>]*>/g, '');

  return html;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // File browser state
  const [currentPath, setCurrentPath] = useState("");
  const [currentFile, setCurrentFile] = useState<FileContent | null>(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Breadcrumb path
  const pathParts = currentPath ? currentPath.split("/").filter(Boolean) : [];

  useEffect(() => {
    fetch(`/api/project/${projectId}`)
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

  const browsePath = async (filePath: string) => {
    setFileLoading(true);
    setCurrentPath(filePath);
    setCurrentFile(null);
    try {
      const res = await fetch(`/api/file?projectId=${projectId}&path=${encodeURIComponent(filePath)}`);
      const data = await res.json();
      setCurrentFile(data);
    } catch {
      setCurrentFile({ type: "file", content: "Error loading file", path: filePath });
    } finally {
      setFileLoading(false);
    }
  };

  const handleCopy = () => {
    if (currentFile?.content) {
      navigator.clipboard.writeText(currentFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
              <h1 className="text-lg font-bold">{projectId.replace(/-/g, " ")}</h1>
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
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xl font-bold">{project.stats.totalFiles}</div>
                <div className="text-xs text-muted-foreground">Файлов</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Folder className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xl font-bold">{project.stats.totalSizeFormatted}</div>
                <div className="text-xs text-muted-foreground">Размер проекта</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Code2 className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xl font-bold">{project.repoPath.split("/").pop()}</div>
                <div className="text-xs text-muted-foreground">Путь в репозитории</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content with tabs */}
        <Tabs defaultValue="readme" className="space-y-4">
          <TabsList className="bg-card/50">
            <TabsTrigger value="readme" className="gap-1.5">
              <BookOpen className="h-4 w-4" /> README
            </TabsTrigger>
            <TabsTrigger value="files" className="gap-1.5">
              <FolderTree className="h-4 w-4" /> Файлы
            </TabsTrigger>
            <TabsTrigger value="source" className="gap-1.5">
              <Code2 className="h-4 w-4" /> Исходный код
            </TabsTrigger>
          </TabsList>

          {/* README Tab */}
          <TabsContent value="readme">
            <Card className="border-border/50">
              <CardContent className="p-6">
                {project.readme ? (
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(project.readme) }}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
                    <FileText className="h-10 w-10" />
                    <p>README не найден для этого проекта</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Files Tab - File Browser */}
          <TabsContent value="files">
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FolderOpen className="h-5 w-5" />
                    Обзор файлов
                  </CardTitle>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <button
                      onClick={() => browsePath("")}
                      className="hover:text-foreground transition-colors"
                    >
                      root
                    </button>
                    {pathParts.map((part, i) => (
                      <span key={i} className="flex items-center gap-1">
                        <ChevronRight className="h-3 w-3" />
                        <button
                          onClick={() => browsePath(pathParts.slice(0, i + 1).join("/"))}
                          className="hover:text-foreground transition-colors"
                        >
                          {part}
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {fileLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : currentFile?.type === "directory" && currentFile.files ? (
                  <div className="space-y-0.5">
                    {/* Back button */}
                    {currentPath && (
                      <button
                        onClick={() => {
                          const parentParts = currentPath.split("/").filter(Boolean);
                          parentParts.pop();
                          browsePath(parentParts.join("/"));
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 transition-colors text-sm text-muted-foreground"
                      >
                        <Folder className="h-4 w-4" />
                        ..
                      </button>
                    )}
                    {currentFile.files.map((file) => (
                      <button
                        key={file.path}
                        onClick={() => browsePath(file.path)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 transition-colors text-sm group"
                      >
                        {getFileIcon(file.name, file.type)}
                        <span className="flex-1 text-left group-hover:text-foreground transition-colors">
                          {file.name}
                        </span>
                        {file.size && (
                          <span className="text-xs text-muted-foreground">
                            {formatBytes(file.size)}
                          </span>
                        )}
                        {file.type === "directory" && (
                          <ChevronRight className="h-3 w-3 text-muted-foreground" />
                        )}
                      </button>
                    ))}
                  </div>
                ) : currentFile?.type === "file" && currentFile.content ? (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Code2 className="h-4 w-4" />
                        <span className="font-mono">{currentPath}</span>
                        {currentFile.size && (
                          <span>({formatBytes(currentFile.size)})</span>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-1">
                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        {copied ? "Скопировано" : "Копировать"}
                      </Button>
                    </div>
                    <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm leading-relaxed border border-border/50">
                      <code>{currentFile.content}</code>
                    </pre>
                    {currentFile.truncated && (
                      <p className="text-xs text-muted-foreground mt-2 italic">
                        Файл слишком большой, показана только часть. Полный файл доступен на GitHub.
                      </p>
                    )}
                  </div>
                ) : (
                  /* Default: show file tree from project data */
                  <div className="space-y-0.5">
                    {project.fileTree.map((file) => (
                      <button
                        key={file.path}
                        onClick={() => browsePath(file.path)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 transition-colors text-sm group"
                      >
                        {getFileIcon(file.name, file.type)}
                        <span className="flex-1 text-left group-hover:text-foreground transition-colors">
                          {file.name}
                        </span>
                        {file.size && (
                          <span className="text-xs text-muted-foreground">
                            {formatBytes(file.size)}
                          </span>
                        )}
                        {file.type === "directory" && (
                          <ChevronRight className="h-3 w-3 text-muted-foreground" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Source Code Tab - Quick access to key files */}
          <TabsContent value="source">
            <div className="grid gap-4">
              {/* Quick access cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-border/50 hover:border-border transition-colors cursor-pointer" onClick={() => browsePath("README.md")}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">README.md</div>
                      <div className="text-xs text-muted-foreground">Документация проекта</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 hover:border-border transition-colors cursor-pointer" onClick={() => browsePath("pyproject.toml")}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">pyproject.toml</div>
                      <div className="text-xs text-muted-foreground">Зависимости и конфигурация</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 hover:border-border transition-colors cursor-pointer" onClick={() => browsePath("requirements.txt")}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">requirements.txt</div>
                      <div className="text-xs text-muted-foreground">Python зависимости</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 hover:border-border transition-colors cursor-pointer" onClick={() => browsePath("docker-compose.yml")}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">docker-compose.yml</div>
                      <div className="text-xs text-muted-foreground">Docker конфигурация</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 hover:border-border transition-colors cursor-pointer" onClick={() => browsePath("Dockerfile")}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">Dockerfile</div>
                      <div className="text-xs text-muted-foreground">Docker образ</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 hover:border-border transition-colors cursor-pointer" onClick={() => browsePath("Makefile")}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">Makefile</div>
                      <div className="text-xs text-muted-foreground">Команды сборки</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Source code directories */}
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Code2 className="h-5 w-5" /> Ключевые директории
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-0.5">
                    {project.fileTree
                      .filter(f => f.type === "directory")
                      .map((dir) => (
                        <button
                          key={dir.path}
                          onClick={() => browsePath(dir.path)}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 transition-colors text-sm group"
                        >
                          <Folder className="h-4 w-4 text-amber-500 shrink-0" />
                          <span className="flex-1 text-left group-hover:text-foreground transition-colors font-medium">
                            {dir.name}/
                          </span>
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
