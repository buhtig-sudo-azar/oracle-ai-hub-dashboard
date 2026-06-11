"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
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
  Cpu,
  Database,
  Globe,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  PROJECT META (synced with main page)                              */
/* ------------------------------------------------------------------ */

interface ProjectMeta {
  name: string;
  description: string;
  longDescription: string;
  stack: string[];
  runnability: "fully_local" | "partial_local" | "cloud_required";
  hasWebUI: boolean;
  requiresOracleDB: boolean;
  requiresOCI: boolean;
  requiresLLMAPI: boolean;
  requiresOllama: boolean;
  localLLM: boolean;
  features: string[];
  architecture: string;
}

const projectMeta: Record<string, ProjectMeta> = {
  "agent-reasoning": {
    name: "Agent Reasoning",
    description: "16 когнитивных архитектур (CoT, ToT, ReAct, Self-Reflection и др.) превращают LLM в надёжных решателей задач.",
    longDescription: "Agent Reasoning — это «мыслительный слой» AI-стека. Вместо того чтобы просить модель сразу выдать ответ, система оборачивает LLM в когнитивные архитектуры: Chain-of-Thought, Tree of Thoughts, ReAct, Self-Reflection, Self-Consistency, Decomposition, MCTS, Socratic, Debate и другие.",
    stack: ["Python", "Ollama", "FastAPI", "Next.js", "Go", "Rich"],
    runnability: "fully_local", hasWebUI: true, requiresOracleDB: false, requiresOCI: false, requiresLLMAPI: false, requiresOllama: true, localLLM: true,
    features: ["16 стратегий рассуждений", "Next.js Interactive Explorer", "Go TUI с Bubble Tea", "Python CLI с Rich", "Прокси-сервер (Ollama-совместимый)", "Бенчмарки: GSM8K, MMLU, ARC"],
    architecture: "ReasoningInterceptor → AGENT_MAP → BaseAgent.stream() → OllamaClient",
  },
  picooraclaw: {
    name: "PicoOraclaw",
    description: "Ультракомпактный Go-агент с персистентной памятью, семантическим векторным поиском и мульти-канальным чатом.",
    longDescription: "PicoOraclaw — минималистичный AI-ассистент на Go с постоянной памятью и векторным поиском. Поддерживает два режима LLM: OCI GenAI (облачный) и Ollama (локальный).",
    stack: ["Go", "Ollama", "OCI GenAI", "Oracle AI DB"],
    runnability: "fully_local", hasWebUI: false, requiresOracleDB: false, requiresOCI: false, requiresLLMAPI: false, requiresOllama: true, localLLM: true,
    features: ["Go-реализация", "Векторный поиск (файловый fallback)", "Telegram / Discord каналы", "Ollama или OCI GenAI", "Graceful fallback без Oracle DB", "Постоянная память агента"],
    architecture: "Config → Provider (Ollama/OCI) → Storage (Oracle/File) → Channels",
  },
  "agentic-rag": {
    name: "Agentic RAG",
    description: "Интеллектуальная RAG-система с мульти-агентным CoT, обработкой PDF/Web/Repo и интеграцией Oracle AI DB.",
    longDescription: "Agentic RAG объединяет retrieval-augmented generation с мульти-агентной архитектурой Chain-of-Thought. Система обрабатывает PDF-документы, веб-страницы и репозитории кода.",
    stack: ["Python", "Oracle AI DB", "ChromaDB", "Ollama", "Gradio", "FastAPI"],
    runnability: "partial_local", hasWebUI: true, requiresOracleDB: false, requiresOCI: false, requiresLLMAPI: false, requiresOllama: true, localLLM: true,
    features: ["PDF / Web / Repo обработка", "ChromaDB fallback (без Oracle)", "3 варианта UI: Gradio, Open WebUI, REST API", "A2A протокол", "Мульти-агентный CoT", "Гибридный поиск (вектор + ключевое слово)"],
    architecture: "Document Loader → Embeddings (Oracle/ChromaDB) → Retriever → CoT Agents → UI",
  },
  "finance-ai-agent": {
    name: "Finance AI Agent",
    description: "Финансовый AI-агент с Oracle AI DB как единым ядром памяти для векторных, графовых, пространственных и реляционных запросов.",
    longDescription: "Полноценный финансовый AI-агент, демонстрирующий Oracle AI Database как унифицированное ядро памяти. Выполняет векторный поиск, графовые запросы, пространственные запросы, JSON-запросы и гибридный поиск.",
    stack: ["Python", "Oracle AI DB", "OpenAI", "React", "Tailwind"],
    runnability: "cloud_required", hasWebUI: true, requiresOracleDB: true, requiresOCI: false, requiresLLMAPI: true, requiresOllama: false, localLLM: false,
    features: ["3-панельный UI (чат + SQL + контекст)", "Векторный + графовый + пространственный поиск", "JSON Relational Duality Views", "Hybrid Search в одном SQL", "Live query inspector", "Tavily web search fallback"],
    architecture: "React UI → FastAPI → Oracle AI DB (vector + graph + spatial + JSON) + OpenAI",
  },
  fittracker: {
    name: "FitTracker",
    description: "Геймированная фитнес-платформа на Oracle 26ai JSON Duality Views (FastAPI + Redis).",
    longDescription: "FitTracker — это фитнес-приложение с игровой механикой: пользователи зарабатывают очки за активность и тратят их на розыгрыши призов.",
    stack: ["Python", "FastAPI", "Oracle 26ai", "Redis", "Docker"],
    runnability: "partial_local", hasWebUI: false, requiresOracleDB: true, requiresOCI: false, requiresLLMAPI: false, requiresOllama: false, localLLM: false,
    features: ["JSON Duality Views", "FastAPI REST API", "Redis кэширование", "Docker Compose запуск", "Terra API интеграция", "Геймированная механика"],
    architecture: "FastAPI → Oracle 26ai (JSON Duality) + Redis Cache",
  },
  "oci-genai-jet": {
    name: "OCI Generative AI JET UI",
    description: "Full-stack AI приложение с Oracle JET UI, OCI Generative AI, Kubernetes и Terraform инфраструктурой.",
    longDescription: "Полноценное enterprise-приложение с Oracle JET фронтендом, Spring Boot бэкендом и OCI Generative AI для чата и суммаризации.",
    stack: ["Oracle JET", "Spring Boot", "OCI GenAI", "Kubernetes", "Terraform"],
    runnability: "cloud_required", hasWebUI: true, requiresOracleDB: true, requiresOCI: true, requiresLLMAPI: false, requiresOllama: false, localLLM: false,
    features: ["Oracle JET UI", "Spring Boot backend", "OCI GenAI чат + суммаризация", "Kubernetes деплой", "Terraform IaC", "Autonomous DB wallet"],
    architecture: "Oracle JET → Spring Boot → OCI GenAI + Oracle ADB",
  },
  "tanstack-shoe-store": {
    name: "TanStack Shoe Store",
    description: "AI чат-приложение на TanStack Start для запросов к БД обувного магазина на естественном языке через Oracle 26ai Select AI.",
    longDescription: "Элегантное приложение на TanStack Start, позволяющее общаться с базой данных обувного магазина на естественном языке.",
    stack: ["TanStack Start", "Oracle 26ai Select AI", "Anthropic/OpenAI", "React"],
    runnability: "cloud_required", hasWebUI: true, requiresOracleDB: true, requiresOCI: true, requiresLLMAPI: true, requiresOllama: false, localLLM: false,
    features: ["TanStack Start (React)", "Select AI (NL→SQL)", "Естественный язык → SQL", "Multiple LLM providers", "Oracle Autonomous DB", "Vite dev server"],
    architecture: "TanStack Start → Oracle Select AI → LLM (NL→SQL) → Autonomous DB",
  },
  "oracle-data-migration": {
    name: "Data Migration Harness",
    description: "AI-агент для миграции RAG-корпуса из MongoDB в Oracle AI Database 26ai с сохранением векторного поиска и SQL/JSON Duality запросов.",
    longDescription: "Инструмент миграции, который переносит RAG-корпус из MongoDB в Oracle AI Database 26ai, сохраняя векторный поиск и разблокируя SQL/JSON Duality запросы.",
    stack: ["Python", "Oracle AI DB", "MongoDB", "OCI GenAI", "React"],
    runnability: "cloud_required", hasWebUI: true, requiresOracleDB: true, requiresOCI: true, requiresLLMAPI: false, requiresOllama: false, localLLM: false,
    features: ["MongoDB → Oracle миграция", "Векторный паритет", "Split-pane UI (до/после)", "JSON Relational Duality", "Верификация данных", "OCI GenAI (Grok 3 Fast)"],
    architecture: "MongoDB → Migration Agent → Oracle AI DB (vector + JSON Duality)",
  },
  "oracle-rag": {
    name: "Oracle RAG",
    description: "RAG на Oracle AI Database 26ai — in-DB эмбеддинги, HNSW векторный поиск и LangChain чат. Полностью локально через Docker.",
    longDescription: "Классический RAG-пайплайн на Oracle AI Database 26ai с in-database эмбеддингами и HNSW векторным индексом.",
    stack: ["Python", "Oracle AI DB", "Ollama", "LangChain", "Streamlit"],
    runnability: "partial_local", hasWebUI: true, requiresOracleDB: true, requiresOCI: false, requiresLLMAPI: false, requiresOllama: true, localLLM: true,
    features: ["In-DB эмбеддинги", "HNSW векторный индекс", "LangChain интеграция", "Streamlit чат UI", "Docker Compose запуск", "Zero cloud API spend"],
    architecture: "Streamlit UI → LangChain → Oracle AI DB (embeddings + HNSW) + Ollama",
  },
  "supplychain-agent": {
    name: "Supply Chain Agent",
    description: "Мульти-агентный помощник планирования спроса с LangGraph supervisor, векторной памятью и семантическим кэшем на Oracle AI DB.",
    longDescription: "Мульти-агентная система планирования спроса с LangGraph supervisor над двумя специалистами. Векторные знания, долгосрочная память, чекпоинты и семантический кэш — всё в Oracle AI Database.",
    stack: ["Python", "Oracle AI DB", "LangGraph", "FastAPI", "React", "OCI GenAI"],
    runnability: "cloud_required", hasWebUI: true, requiresOracleDB: true, requiresOCI: false, requiresLLMAPI: true, requiresOllama: false, localLLM: false,
    features: ["LangGraph supervisor", "2 specialist агента", "Анимированная топология", "Semantic LLM cache", "Per-thread checkpoints", "FastAPI + React UI"],
    architecture: "React UI → FastAPI → LangGraph Supervisor → Specialists → Oracle AI DB",
  },
  "oracle-java-memory": {
    name: "Java Agent Memory",
    description: "Spring AI агент с 3 слоями памяти (эпизодическая, семантическая, процедурная) на Oracle AI DB.",
    longDescription: "Spring AI агент с тремя типами персистентной памяти: эпизодическая, семантическая и процедурная. Oracle AI Database выступает как единое хранилище для всех типов памяти.",
    stack: ["Java", "Spring AI", "Oracle AI DB", "Ollama", "Streamlit", "Docker"],
    runnability: "partial_local", hasWebUI: true, requiresOracleDB: true, requiresOCI: false, requiresLLMAPI: false, requiresOllama: true, localLLM: true,
    features: ["3 слоя памяти", "Spring AI framework", "Эпизодическая + семантическая + процедурная", "Streamlit визуализация", "Docker Compose", "Ollama (локальный LLM)"],
    architecture: "Streamlit UI → Spring Boot → Oracle AI DB (3 memory types) + Ollama",
  },
  "rag-to-memory": {
    name: "RAG → Memory Systems",
    description: "Демо 5 типизированных хранилищ памяти (policy, preference, fact, episodic, trace) на Oracle AI DB с SimulatedModel fallback.",
    longDescription: "5 типов хранилищ памяти для AI-агентов: policy, preference, fact, episodic, trace. Уникальная особенность — флаг --simulated, который заменяет OpenAI на RuleBasedExtractor.",
    stack: ["Python", "Oracle AI DB", "OpenAI", "Simulated LLM"],
    runnability: "partial_local", hasWebUI: false, requiresOracleDB: true, requiresOCI: false, requiresLLMAPI: false, requiresOllama: false, localLLM: false,
    features: ["5 типов памяти", "Simulated LLM (без API ключа)", "RuleBasedExtractor", "Typed memory stores", "CLI интерфейс", "Graceful degradation"],
    architecture: "CLI → MemoryManager → 5 Memory Stores → Oracle AI DB (+ SimulatedModel fallback)",
  },
  "oracle-vector-search": {
    name: "Vector Search (Spring)",
    description: "Spring Boot + GraalVM семантический поиск по каталогу питомцев с Oracle DB и OpenAI эмбеддингами.",
    longDescription: "Демонстрация семантического поиска на Spring Boot с GraalVM native image. Поиск по каталогу питомцев с использованием Oracle DB для векторного хранения.",
    stack: ["Java", "Spring Boot", "GraalVM", "Oracle DB", "OpenAI"],
    runnability: "cloud_required", hasWebUI: false, requiresOracleDB: true, requiresOCI: false, requiresLLMAPI: true, requiresOllama: false, localLLM: false,
    features: ["GraalVM native image", "Semantic search API", "OpenAI embeddings", "Oracle DB vector storage", "REST API", "Spring Boot"],
    architecture: "REST API → Spring Boot → Oracle DB (vectors) + OpenAI (embeddings)",
  },
  "limitless-workflow": {
    name: "Limitless Workflow",
    description: "Claude Code-first машина понимания с Oracle AI Database на OCI и Obsidian vault для визуализации.",
    longDescription: "Инструмент для понимания кодовой базы, использующий Claude Code для анализа и Oracle AI Database на OCI для хранения знаний.",
    stack: ["Claude Code", "Oracle AI DB on OCI", "Obsidian"],
    runnability: "cloud_required", hasWebUI: false, requiresOracleDB: true, requiresOCI: true, requiresLLMAPI: false, requiresOllama: false, localLLM: false,
    features: ["Claude Code интеграция", "Obsidian визуализация", "OCI-deployed Oracle DB", "Code understanding", "Knowledge graph", "CLI-ориентированный"],
    architecture: "Claude Code → Oracle AI DB (OCI) → Obsidian Vault",
  },
  vecdb: {
    name: "VecDB",
    description: "Информационная страница об Oracle Autonomous AI Vector Database (Limited Availability).",
    longDescription: "Это не приложение, а маркетинговая/информационная страница о Oracle Autonomous AI Vector Database.",
    stack: ["N/A"],
    runnability: "cloud_required", hasWebUI: false, requiresOracleDB: false, requiresOCI: false, requiresLLMAPI: false, requiresOllama: false, localLLM: false,
    features: ["Информационная страница", "Описание Oracle Vector DB"],
    architecture: "N/A — маркетинговая страница",
  },
};

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

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

function runnabilityBadge(r: "fully_local" | "partial_local" | "cloud_required") {
  switch (r) {
    case "fully_local":
      return (
        <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/25 hover:bg-emerald-500/20 gap-1">
          <CheckCircle2 className="h-3 w-3" /> Полностью локально
        </Badge>
      );
    case "partial_local":
      return (
        <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/25 hover:bg-amber-500/20 gap-1">
          <AlertTriangle className="h-3 w-3" /> Частично локально
        </Badge>
      );
    case "cloud_required":
      return (
        <Badge className="bg-red-500/15 text-red-600 border-red-500/25 hover:bg-red-500/20 gap-1">
          <XCircle className="h-3 w-3" /> Требует облако
        </Badge>
      );
  }
}

/* ------------------------------------------------------------------ */
/*  PAGE COMPONENT                                                     */
/* ------------------------------------------------------------------ */

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentDir, setCurrentDir] = useState("");
  const [viewingFile, setViewingFile] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const meta = projectMeta[projectId];

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

  const currentEntries = project ? getFilesAt(project.fullTree, currentDir) : [];
  const sortedEntries = [...currentEntries].sort((a, b) => {
    if (a.type === "directory" && b.type !== "directory") return -1;
    if (a.type !== "directory" && b.type === "directory") return 1;
    return a.name.localeCompare(b.name);
  });

  const pathParts = currentDir ? currentDir.split("/").filter(Boolean) : [];
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
      {/* Top nav bar */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Главная
            </Button>
            <div className="h-5 w-px bg-border" />
            <Badge variant="outline" className="text-xs">
              {project.type === "app" ? "Приложение" : project.type === "workshop" ? "Воркшоп" : "Ноутбук"}
            </Badge>
          </div>
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Github className="h-4 w-4" /> GitHub
            </Button>
          </a>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={`/images/projects/${projectId}.png`}
            alt={meta?.name || projectId}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-8 sm:py-12 md:py-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3">
              {meta && runnabilityBadge(meta.runnability)}
              {meta?.hasWebUI && (
                <Badge variant="outline" className="gap-1 text-xs">
                  <Globe className="h-3 w-3" /> Web UI
                </Badge>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 leading-tight">
              {meta?.name || projectId.replace(/-/g, " ")}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
              {meta?.longDescription || meta?.description || project.repoPath}
            </p>

            {/* Stack tags */}
            {meta && (
              <div className="flex flex-wrap gap-1.5 mb-5">
                {meta.stack.map((s) => (
                  <Badge key={s} variant="secondary" className="text-xs font-normal">
                    {s}
                  </Badge>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Button className="gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0">
                  <Github className="h-4 w-4" /> Открыть на GitHub
                </Button>
              </a>
              {meta && (
                <div className="flex flex-wrap gap-2">
                  {meta.requiresOracleDB && (
                    <Badge variant="outline" className="gap-1 text-xs h-9 px-3">
                      <Database className="h-3.5 w-3.5" /> Oracle DB
                    </Badge>
                  )}
                  {meta.requiresOllama && (
                    <Badge variant="outline" className="gap-1 text-xs h-9 px-3">
                      <Cpu className="h-3.5 w-3.5" /> Ollama
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Features + Stats row */}
        {meta && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Features */}
            <Card className="bg-card/50 border-border/50 md:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-orange-500" /> Ключевые возможности
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {meta.features.map((f) => (
                    <div key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{f}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stats + Architecture */}
            <div className="space-y-4">
              <Card className="bg-card/50 border-border/50">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary"><FileText className="h-4 w-4" /></div>
                  <div>
                    <div className="text-xl font-bold">{project.stats.totalFiles}+</div>
                    <div className="text-xs text-muted-foreground">Файлов</div>
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
              <Card className="bg-card/50 border-border/50">
                <CardContent className="p-4">
                  <div className="text-xs text-muted-foreground mb-1">Архитектура</div>
                  <div className="text-sm font-mono text-foreground leading-relaxed">
                    {meta.architecture}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Fallback stats when no meta */}
        {!meta && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary"><FileText className="h-4 w-4" /></div>
                <div>
                  <div className="text-xl font-bold">{project.stats.totalFiles}+</div>
                  <div className="text-xs text-muted-foreground">Файлов</div>
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
          </div>
        )}

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
                            if (project.files[entry.path]) {
                              setViewingFile(entry.path);
                            } else {
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
