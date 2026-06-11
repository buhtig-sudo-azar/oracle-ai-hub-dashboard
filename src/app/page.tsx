"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Brain,
  Cpu,
  Database,
  Globe,
  Search,
  BookOpen,
  GraduationCap,
  Bot,
  TreePine,
  Lightbulb,
  Zap,
  BarChart3,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Layers,
  GitBranch,
  MessageSquare,
  Shield,
  Calculator,
  FileSearch,
  Network,
  Wrench,
  Package,
  ChevronDown,
  Filter,
  Cloud,
} from "lucide-react";

import {
  CoTChainWidget,
  ToTTreeWidget,
  ReActWidget,
  SelfReflectionWidget,
  ConsistencyWidget,
  DecomposedWidget,
  LeastToMostWidget,
  RefinementWidget,
  DebateWidget,
  MCTSWidget,
  AnalogicalWidget,
  SocraticWidget,
  MetaReasoningWidget,
  StrategyComparisonWidget,
  ArchitectureWidget,
} from "@/components/widgets";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

type Runnability = "fully_local" | "partial_local" | "cloud_required";

interface Project {
  id: string;
  name: string;
  category: "app" | "notebook" | "workshop" | "guide";
  description: string;
  longDescription: string;
  stack: string[];
  runnability: Runnability;
  hasWebUI: boolean;
  requiresOracleDB: boolean;
  requiresOCI: boolean;
  requiresLLMAPI: boolean;
  requiresOllama: boolean;
  localLLM: boolean;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  features: string[];
  architecture: string;
  githubPath: string;
  liveUrl?: string;
}

const projects: Project[] = [
  {
    id: "agent-reasoning",
    name: "Agent Reasoning",
    category: "app",
    description:
      "16 когнитивных архитектур (CoT, ToT, ReAct, Self-Reflection и др.) превращают LLM в надёжных решателей задач.",
    longDescription:
      "Agent Reasoning — это «мыслительный слой» AI-стека. Вместо того чтобы просить модель сразу выдать ответ, система оборачивает LLM в когнитивные архитектуры: Chain-of-Thought (пошаговое рассуждение), Tree of Thoughts (поиск по дереву), ReAct (рассуждение + действия с инструментами), Self-Reflection (черновик → критика → улучшение), Self-Consistency (мажоритарное голосование), Decomposition, MCTS, Socratic, Debate и другие. Каждый агент реализован как класс-наследник BaseAgent с единым интерфейсом stream(query). Система работает как прокси-сервер, совместимый с Ollama API — достаточно добавить +strategy к имени модели (например, gemma3+cot).",
    stack: ["Python", "Ollama", "FastAPI", "Next.js", "Go", "Rich"],
    runnability: "fully_local",
    hasWebUI: true,
    requiresOracleDB: false,
    requiresOCI: false,
    requiresLLMAPI: false,
    requiresOllama: true,
    localLLM: true,
    icon: <Brain className="h-5 w-5" />,
    color: "text-orange-500",
    gradient: "from-orange-500/20 to-amber-500/10",
    features: [
      "16 стратегий рассуждений",
      "Next.js Interactive Explorer",
      "Go TUI с Bubble Tea",
      "Python CLI с Rich",
      "Прокси-сервер (Ollama-совместимый)",
      "Бенчмарки: GSM8K, MMLU, ARC",
    ],
    architecture: "ReasoningInterceptor → AGENT_MAP → BaseAgent.stream() → OllamaClient",
    githubPath: "apps/agent-reasoning",
    liveUrl: "/?XTransformPort=3001",
  },
  {
    id: "picooraclaw",
    name: "PicoOraclaw",
    category: "app",
    description:
      "Ультракомпактный Go-агент с персистентной памятью, семантическим векторным поиском и мульти-канальным чатом.",
    longDescription:
      "PicoOraclaw — минималистичный AI-ассистент на Go с постоянной памятью и векторным поиском. Поддерживает два режима LLM: OCI GenAI (облачный) и Ollama (локальный). Для хранения данных может использовать Oracle AI Database или файловую систему (graceful fallback). Поддерживает каналы Telegram, Discord и CLI-режим. Векторный поиск работает через эмбеддинги даже без Oracle DB — через локальные файлы.",
    stack: ["Go", "Ollama", "OCI GenAI", "Oracle AI DB"],
    runnability: "fully_local",
    hasWebUI: false,
    requiresOracleDB: false,
    requiresOCI: false,
    requiresLLMAPI: false,
    requiresOllama: true,
    localLLM: true,
    icon: <Zap className="h-5 w-5" />,
    color: "text-cyan-500",
    gradient: "from-cyan-500/20 to-blue-500/10",
    features: [
      "Go-реализация",
      "Векторный поиск (файловый fallback)",
      "Telegram / Discord каналы",
      "Ollama или OCI GenAI",
      "Graceful fallback без Oracle DB",
      "Постоянная память агента",
    ],
    architecture: "Config → Provider (Ollama/OCI) → Storage (Oracle/File) → Channels",
    githubPath: "apps/picooraclaw",
  },
  {
    id: "agentic-rag",
    name: "Agentic RAG",
    category: "app",
    description:
      "Интеллектуальная RAG-система с мульти-агентным CoT, обработкой PDF/Web/Repo и интеграцией Oracle AI DB.",
    longDescription:
      "Agentic RAG объединяет retrieval-augmented generation с мульти-агентной архитектурой Chain-of-Thought. Система обрабатывает PDF-документы, веб-страницы и репозитории кода, создавая векторный индекс для семантического поиска. Поддерживает два бэкенда эмбеддингов: Oracle AI Database (полный функционал) и ChromaDB (локальный fallback). Включает Gradio UI, Open WebUI и FastAPI REST API. Реализует A2A протокол для агент-агентного взаимодействия.",
    stack: ["Python", "Oracle AI DB", "ChromaDB", "Ollama", "Gradio", "FastAPI"],
    runnability: "partial_local",
    hasWebUI: true,
    requiresOracleDB: false,
    requiresOCI: false,
    requiresLLMAPI: false,
    requiresOllama: true,
    localLLM: true,
    icon: <Search className="h-5 w-5" />,
    color: "text-emerald-500",
    gradient: "from-emerald-500/20 to-green-500/10",
    features: [
      "PDF / Web / Repo обработка",
      "ChromaDB fallback (без Oracle)",
      "3 варианта UI: Gradio, Open WebUI, REST API",
      "A2A протокол",
      "Мульти-агентный CoT",
      "Гибридный поиск (вектор + ключевое слово)",
    ],
    architecture: "Document Loader → Embeddings (Oracle/ChromaDB) → Retriever → CoT Agents → UI",
    githubPath: "apps/agentic_rag",
  },
  {
    id: "finance-ai-agent",
    name: "Finance AI Agent",
    category: "app",
    description:
      "Финансовый AI-агент с Oracle AI DB как единым ядром памяти для векторных, графовых, пространственных и реляционных запросов.",
    longDescription:
      "Полноценный финансовый AI-агент, демонстрирующий Oracle AI Database как унифицированное ядро памяти. Выполняет векторный поиск по транзакциям, графовые запросы по связям компаний, пространственные запросы по геолокации офисов, JSON-запросы к документам и гибридный поиск. Включает впечатляющий 3-панельный UI: чат, просмотрщик SQL-запросов к БД в реальном времени, и инспектор контекстного окна. Требует Oracle DB в Docker и OpenAI API ключ.",
    stack: ["Python", "Oracle AI DB", "OpenAI", "React", "Tailwind"],
    runnability: "cloud_required",
    hasWebUI: true,
    requiresOracleDB: true,
    requiresOCI: false,
    requiresLLMAPI: true,
    requiresOllama: false,
    localLLM: false,
    icon: <BarChart3 className="h-5 w-5" />,
    color: "text-purple-500",
    gradient: "from-purple-500/20 to-violet-500/10",
    features: [
      "3-панельный UI (чат + SQL + контекст)",
      "Векторный + графовый + пространственный поиск",
      "JSON Relational Duality Views",
      "Hybrid Search в одном SQL",
      "Live query inspector",
      "Tavily web search fallback",
    ],
    architecture: "React UI → FastAPI → Oracle AI DB (vector + graph + spatial + JSON) + OpenAI",
    githubPath: "apps/finance-ai-agent-demo",
  },
  {
    id: "fittracker",
    name: "FitTracker",
    category: "app",
    description:
      "Геймированная фитнес-платформа на Oracle 26ai JSON Duality Views (FastAPI + Redis), созданная на вебинаре в реальном времени.",
    longDescription:
      "FitTracker — это фитнес-приложение с игровой механикой: пользователи зарабатывают очки за активность и тратят их на розыгрыши призов. Построено на Oracle 26ai JSON Duality Views для хранения данных, FastAPI для REST API и Redis для кэширования. Опционально интегрируется с Terra API для получения данных с фитнес-трекеров. Запускается через Docker Compose с Oracle DB и Redis.",
    stack: ["Python", "FastAPI", "Oracle 26ai", "Redis", "Docker"],
    runnability: "partial_local",
    hasWebUI: false,
    requiresOracleDB: true,
    requiresOCI: false,
    requiresLLMAPI: false,
    requiresOllama: false,
    localLLM: false,
    icon: <Zap className="h-5 w-5" />,
    color: "text-lime-500",
    gradient: "from-lime-500/20 to-green-500/10",
    features: [
      "JSON Duality Views",
      "FastAPI REST API",
      "Redis кэширование",
      "Docker Compose запуск",
      "Terra API интеграция",
      "Геймированная механика",
    ],
    architecture: "FastAPI → Oracle 26ai (JSON Duality) + Redis Cache",
    githubPath: "apps/FitTracker",
  },
  {
    id: "oci-genai-jet",
    name: "OCI Generative AI JET UI",
    category: "app",
    description:
      "Full-stack AI приложение с Oracle JET UI, OCI Generative AI, Kubernetes и Terraform инфраструктурой.",
    longDescription:
      "Полноценное enterprise-приложение с Oracle JET (React-based) фронтендом, Spring Boot бэкендом и OCI Generative AI для чата и суммаризации. Включает Terraform для инфраструктуры как кода, Kubernetes манифесты для деплоя и Oracle Autonomous DB для трекинга взаимодействий. Требует OCI credentials, ADB wallet и OCI GenAI model OCIDs.",
    stack: ["Oracle JET", "Spring Boot", "OCI GenAI", "Kubernetes", "Terraform"],
    runnability: "cloud_required",
    hasWebUI: true,
    requiresOracleDB: true,
    requiresOCI: true,
    requiresLLMAPI: false,
    requiresOllama: false,
    localLLM: false,
    icon: <Cloud className="h-5 w-5" />,
    color: "text-red-500",
    gradient: "from-red-500/20 to-rose-500/10",
    features: [
      "Oracle JET UI",
      "Spring Boot backend",
      "OCI GenAI чат + суммаризация",
      "Kubernetes деплой",
      "Terraform IaC",
      "Autonomous DB wallet",
    ],
    architecture: "Oracle JET → Spring Boot → OCI GenAI + Oracle ADB",
    githubPath: "apps/oci-generative-ai-jet-ui",
  },
  {
    id: "tanstack-shoe-store",
    name: "TanStack Shoe Store",
    category: "app",
    description:
      "AI чат-приложение на TanStack Start для запросов к БД обувного магазина на естественном языке через Oracle 26ai Select AI.",
    longDescription:
      "Элегантное приложение на TanStack Start (React framework), позволяющее общаться с базой данных обувного магазина на естественном языке. Использует Oracle 26ai Select AI для преобразования вопросов в SQL-запросы. Требует Oracle Autonomous DB на OCI (даже Free Tier) и API ключ Anthropic, OpenAI или Gemini для NL→SQL.",
    stack: ["TanStack Start", "Oracle 26ai Select AI", "Anthropic/OpenAI", "React"],
    runnability: "cloud_required",
    hasWebUI: true,
    requiresOracleDB: true,
    requiresOCI: true,
    requiresLLMAPI: true,
    requiresOllama: false,
    localLLM: false,
    icon: <MessageSquare className="h-5 w-5" />,
    color: "text-pink-500",
    gradient: "from-pink-500/20 to-rose-500/10",
    features: [
      "TanStack Start (React)",
      "Select AI (NL→SQL)",
      "Естественный язык → SQL",
      "Multiple LLM providers",
      "Oracle Autonomous DB",
      "Vite dev server",
    ],
    architecture: "TanStack Start → Oracle Select AI → LLM (NL→SQL) → Autonomous DB",
    githubPath: "apps/tanstack-shoe-store",
  },
  {
    id: "oracle-data-migration",
    name: "Data Migration Harness",
    category: "app",
    description:
      "AI-агент для миграции RAG-корпуса из MongoDB в Oracle AI Database 26ai с сохранением векторного поиска и SQL/JSON Duality запросов.",
    longDescription:
      "Инструмент миграции, который переносит RAG-корпус из MongoDB в Oracle AI Database 26ai, сохраняя векторный поиск и разблокируя SQL/JSON Duality запросы. Включает split-pane React UI для сравнения «до/после» миграции. Требует Oracle DB, MongoDB 7 и OCI GenAI — самое зависимое приложение в репозитории.",
    stack: ["Python", "Oracle AI DB", "MongoDB", "OCI GenAI", "React"],
    runnability: "cloud_required",
    hasWebUI: true,
    requiresOracleDB: true,
    requiresOCI: true,
    requiresLLMAPI: false,
    requiresOllama: false,
    localLLM: false,
    icon: <Database className="h-5 w-5" />,
    color: "text-amber-500",
    gradient: "from-amber-500/20 to-yellow-500/10",
    features: [
      "MongoDB → Oracle миграция",
      "Векторный паритет",
      "Split-pane UI (до/после)",
      "JSON Relational Duality",
      "Верификация данных",
      "OCI GenAI (Grok 3 Fast)",
    ],
    architecture: "MongoDB → Migration Agent → Oracle AI DB (vector + JSON Duality)",
    githubPath: "apps/oracle-data-migration-harness",
  },
  {
    id: "oracle-rag",
    name: "Oracle RAG",
    category: "app",
    description:
      "RAG на Oracle AI Database 26ai — in-DB эмбеддинги, HNSW векторный поиск и LangChain чат. Полностью локально через Docker.",
    longDescription:
      "Классический RAG-пайплайн на Oracle AI Database 26ai с in-database эмбеддингами и HNSW векторным индексом. Использует LangChain для чата и Streamlit для UI. Oracle DB запускается в Docker контейнере (~10GB образ), Ollama — локально. Никаких облачных API не требуется — полностью локальный запуск, zero external API spend.",
    stack: ["Python", "Oracle AI DB", "Ollama", "LangChain", "Streamlit"],
    runnability: "partial_local",
    hasWebUI: true,
    requiresOracleDB: true,
    requiresOCI: false,
    requiresLLMAPI: false,
    requiresOllama: true,
    localLLM: true,
    icon: <FileSearch className="h-5 w-5" />,
    color: "text-teal-500",
    gradient: "from-teal-500/20 to-cyan-500/10",
    features: [
      "In-DB эмбеддинги",
      "HNSW векторный индекс",
      "LangChain интеграция",
      "Streamlit чат UI",
      "Docker Compose запуск",
      "Zero cloud API spend",
    ],
    architecture: "Streamlit UI → LangChain → Oracle AI DB (embeddings + HNSW) + Ollama",
    githubPath: "apps/oracle-rag",
  },
  {
    id: "supplychain-agent",
    name: "Supply Chain Agent",
    category: "app",
    description:
      "Мульти-агентный помощник планирования спроса с LangGraph supervisor, векторной памятью и семантическим кэшем на Oracle AI DB.",
    longDescription:
      "Мульти-агентная система планирования спроса с LangGraph supervisor над двумя специалистами. Векторные знания, долгосрочная cross-thread память, per-thread чекпоинты, семантический LLM-кэш и история чата — всё в одной Oracle AI Database. Поставляется как workshop ноутбуки, так и live FastAPI + React чат-приложение с per-agent контекстом и анимированной топологией.",
    stack: ["Python", "Oracle AI DB", "LangGraph", "FastAPI", "React", "OCI GenAI"],
    runnability: "cloud_required",
    hasWebUI: true,
    requiresOracleDB: true,
    requiresOCI: false,
    requiresLLMAPI: true,
    requiresOllama: false,
    localLLM: false,
    icon: <Network className="h-5 w-5" />,
    color: "text-sky-500",
    gradient: "from-sky-500/20 to-blue-500/10",
    features: [
      "LangGraph supervisor",
      "2 specialist агента",
      "Анимированная топология",
      "Semantic LLM cache",
      "Per-thread checkpoints",
      "FastAPI + React UI",
    ],
    architecture: "React UI → FastAPI → LangGraph Supervisor → Specialists → Oracle AI DB",
    githubPath: "apps/supplychain-demand-planning-agent",
  },
  {
    id: "oracle-java-memory",
    name: "Java Agent Memory",
    category: "app",
    description:
      "Spring AI агент с 3 слоями памяти (эпизодическая, семантическая, процедурная) на Oracle AI DB. Docker + Ollama, без облака.",
    longDescription:
      "Spring AI агент с тремя типами персистентной памяти: эпизодическая (история взаимодействий), семантическая (факты и знания) и процедурная (навыки и правила). Oracle AI Database выступает как единое хранилище для всех типов памяти. Запускается полностью локально: Oracle DB в Docker, Ollama для чата. Streamlit UI для визуализации памяти и взаимодействия с агентом.",
    stack: ["Java", "Spring AI", "Oracle AI DB", "Ollama", "Streamlit", "Docker"],
    runnability: "partial_local",
    hasWebUI: true,
    requiresOracleDB: true,
    requiresOCI: false,
    requiresLLMAPI: false,
    requiresOllama: true,
    localLLM: true,
    icon: <Layers className="h-5 w-5" />,
    color: "text-indigo-500",
    gradient: "from-indigo-500/20 to-blue-500/10",
    features: [
      "3 слоя памяти",
      "Spring AI framework",
      "Эпизодическая + семантическая + процедурная",
      "Streamlit визуализация",
      "Docker Compose",
      "Ollama (локальный LLM)",
    ],
    architecture: "Streamlit UI → Spring Boot → Oracle AI DB (3 memory types) + Ollama",
    githubPath: "apps/oracle-database-java-agent-memory",
  },
  {
    id: "rag-to-memory",
    name: "RAG → Memory Systems",
    category: "app",
    description:
      "Демо 5 типизированных хранилищ памяти (policy, preference, fact, episodic, trace) на Oracle AI DB с SimulatedModel fallback.",
    longDescription:
      "Демонстрация 5 типов хранилищ памяти для AI-агентов: policy (политики), preference (предпочтения), fact (факты), episodic (эпизоды), trace (трассировки). Уникальная особенность — флаг --simulated, который заменяет OpenAI на RuleBasedExtractor, позволяя запустить систему без API ключей. Oracle DB всё ещё требуется, но LLM может быть симулирован.",
    stack: ["Python", "Oracle AI DB", "OpenAI", "Simulated LLM"],
    runnability: "partial_local",
    hasWebUI: false,
    requiresOracleDB: true,
    requiresOCI: false,
    requiresLLMAPI: false,
    requiresOllama: false,
    localLLM: false,
    icon: <GitBranch className="h-5 w-5" />,
    color: "text-violet-500",
    gradient: "from-violet-500/20 to-purple-500/10",
    features: [
      "5 типов памяти",
      "Simulated LLM (без API ключа)",
      "RuleBasedExtractor",
      "Typed memory stores",
      "CLI интерфейс",
      "Graceful degradation",
    ],
    architecture: "CLI → MemoryManager → 5 Memory Stores → Oracle AI DB (+ SimulatedModel fallback)",
    githubPath: "apps/rag-to-memory-systems-demo",
  },
  {
    id: "oracle-vector-search",
    name: "Vector Search (Spring)",
    category: "app",
    description:
      "Spring Boot + GraalVM семантический поиск по каталогу питомцев с Oracle DB и OpenAI эмбеддингами.",
    longDescription:
      "Демонстрация семантического поиска на Spring Boot с GraalVM native image. Поиск по каталогу питомцев с использованием Oracle DB для векторного хранения и OpenAI для генерации эмбеддингов. REST API для поиска по естественным запросам. Требует Oracle DB (Docker или ADB) и OpenAI API ключ.",
    stack: ["Java", "Spring Boot", "GraalVM", "Oracle DB", "OpenAI"],
    runnability: "cloud_required",
    hasWebUI: false,
    requiresOracleDB: true,
    requiresOCI: false,
    requiresLLMAPI: true,
    requiresOllama: false,
    localLLM: false,
    icon: <Search className="h-5 w-5" />,
    color: "text-fuchsia-500",
    gradient: "from-fuchsia-500/20 to-pink-500/10",
    features: [
      "GraalVM native image",
      "Semantic search API",
      "OpenAI embeddings",
      "Oracle DB vector storage",
      "REST API",
      "Spring Boot",
    ],
    architecture: "REST API → Spring Boot → Oracle DB (vectors) + OpenAI (embeddings)",
    githubPath: "apps/oracle-database-vector-search",
  },
  {
    id: "limitless-workflow",
    name: "Limitless Workflow",
    category: "app",
    description:
      "Claude Code-first машина понимания с Oracle AI Database на OCI и Obsidian vault для визуализации.",
    longDescription:
      "Инструмент для понимания кодовой базы, использующий Claude Code для анализа и Oracle AI Database на OCI для хранения знаний. Результаты визуализируются в Obsidian vault. Специализирован для работы с Oracle AI Database, развёрнутым на OCI (не локально). CLI-ориентированный, без веб-интерфейса.",
    stack: ["Claude Code", "Oracle AI DB on OCI", "Obsidian"],
    runnability: "cloud_required",
    hasWebUI: false,
    requiresOracleDB: true,
    requiresOCI: true,
    requiresLLMAPI: false,
    requiresOllama: false,
    localLLM: false,
    icon: <Wrench className="h-5 w-5" />,
    color: "text-stone-500",
    gradient: "from-stone-500/20 to-neutral-500/10",
    features: [
      "Claude Code интеграция",
      "Obsidian визуализация",
      "OCI-deployed Oracle DB",
      "Code understanding",
      "Knowledge graph",
      "CLI-ориентированный",
    ],
    architecture: "Claude Code → Oracle AI DB (OCI) → Obsidian Vault",
    githubPath: "apps/limitless-workflow",
  },
  {
    id: "vecdb",
    name: "VecDB",
    category: "app",
    description:
      "Информационная страница об Oracle Autonomous AI Vector Database (Limited Availability). Не является запускаемым приложением.",
    longDescription:
      "Это не приложение, а маркетинговая/информационная страница о Oracle Autonomous AI Vector Database. Содержит описание возможностей векторной БД, но не содержит исполняемого кода.",
    stack: ["N/A"],
    runnability: "cloud_required",
    hasWebUI: false,
    requiresOracleDB: false,
    requiresOCI: false,
    requiresLLMAPI: false,
    requiresOllama: false,
    localLLM: false,
    icon: <Package className="h-5 w-5" />,
    color: "text-gray-500",
    gradient: "from-gray-500/20 to-slate-500/10",
    features: [
      "Информационная страница",
      "Не запускаемое приложение",
      "Описание Oracle Vector DB",
    ],
    architecture: "N/A — маркетинговая страница",
    githubPath: "apps/vecdb",
  },
];

const workshops = [
  {
    id: "ir-to-rag",
    name: "Information Retrieval to RAG",
    description: "Постройте ассистента для научных статей по 200 ArXiv papers, реализуя 5 стратегий поиска (keyword, vector, hybrid, graph) и полный RAG-пайплайн.",
    stack: ["Oracle AI DB", "sentence-transformers", "OCI GenAI"],
    difficulty: "Начальный" as const,
    githubPath: "workshops/information_retrieval_to_RAG",
  },
  {
    id: "rag-to-agents",
    name: "From RAG to Agents",
    description: "Расширьте RAG-пайплайн до мульти-агентной системы — оберните retrieval как инструменты агента, добавьте оркестрацию и персистентную память на Oracle.",
    stack: ["Oracle AI DB", "OpenAI API", "openai-agents"],
    difficulty: "Средний" as const,
    githubPath: "workshops/from_rag_to_agents_workshop",
  },
  {
    id: "agent-memory-ws",
    name: "Agent Memory Workshop",
    description: "Постройте агентов с памятью: реализуйте MemoryManager с 6 типами памяти в Oracle, примените context-engineering техники.",
    stack: ["Oracle AI DB", "langchain-oracledb", "OCI GenAI", "Tavily"],
    difficulty: "Средний" as const,
    githubPath: "workshops/agent_memory_workshop",
  },
  {
    id: "enterprise-harness",
    name: "Enterprise Data Agent Harness",
    description: "Постройте enterprise data agent на Oracle AI DB 26ai с OAMP, hybrid search, JSON Duality Views, Deep Data Security и DBMS_SCHEDULER. Живой Flask + React UI.",
    stack: ["Oracle AI DB 26ai", "OAMP", "Flask", "React"],
    difficulty: "Продвинутый" as const,
    githubPath: "workshops/enterprise-data-agent-harness-workshop",
  },
  {
    id: "supplychain-ws",
    name: "Supply-Chain Demand Agent",
    description: "Мульти-агентный помощник с LangGraph supervisor, векторными знаниями, долгосрочной памятью и семантическим кэшем. FastAPI + React чат с анимированной топологией.",
    stack: ["Oracle AI DB", "LangGraph", "FastAPI", "React"],
    difficulty: "Продвинутый" as const,
    githubPath: "workshops/supplychain_demand_agent_workshop",
  },
];

const notebooks = [
  { name: "Agentic RAG with LangChain", stack: "Oracle AI DB + langchain-oracledb + Ollama" },
  { name: "FS vs DB Agent Memory", stack: "LangChain + Oracle AI DB + OpenAI" },
  { name: "Memory Context Engineering", stack: "LangChain + Oracle AI DB + OpenAI + Tavily" },
  { name: "Oracle LangChain Example", stack: "Oracle AI DB + langchain-oracledb + HuggingFace" },
  { name: "RAG Agents Zero to Hero", stack: "Oracle AI DB + OpenAI + OpenAI Agents SDK" },
  { name: "RAG with Evals", stack: "Oracle AI DB + OpenAI + BEIR + Galileo" },
  { name: "Agent Reasoning Demo", stack: "Ollama + 11 cognitive architectures" },
  { name: "Hybrid Search (Agentic RAG)", stack: "Oracle AI DB + langchain-oracledb + LangGraph" },
  { name: "F1 Miami Strategy (Oracle 26ai)", stack: "Oracle AI DB + FastF1 + Plotly" },
  { name: "OAMP Developer Guide", stack: "OAMP + LiteLLM" },
  { name: "Deep Research Agent", stack: "OpenAI Agents SDK + Tavily + OAMP" },
  { name: "Supply Chain (Claude SDK)", stack: "Claude Agent SDK + MCP + OAMP" },
  { name: "Mortgage Workflow (LangGraph)", stack: "LangGraph + OAMP" },
];

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

function runnabilityBadge(r: Runnability) {
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

function difficultyColor(d: "Начальный" | "Средний" | "Продвинутый") {
  switch (d) {
    case "Начальный":
      return "bg-emerald-500/15 text-emerald-600 border-emerald-500/25";
    case "Средний":
      return "bg-amber-500/15 text-amber-600 border-amber-500/25";
    case "Продвинутый":
      return "bg-red-500/15 text-red-600 border-red-500/25";
  }
}

/* ------------------------------------------------------------------ */
/*  COMPONENTS                                                         */
/* ------------------------------------------------------------------ */

function HeroStats() {
  const apps = projects.filter((p) => p.category === "app");
  const local = apps.filter((p) => p.runnability === "fully_local").length;
  const partial = apps.filter((p) => p.runnability === "partial_local").length;
  const withUI = apps.filter((p) => p.hasWebUI).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: "Приложений", value: apps.length, icon: <Cpu className="h-4 w-4" /> },
        { label: "Ноутбуков", value: notebooks.length, icon: <BookOpen className="h-4 w-4" /> },
        { label: "Локально запускаемых", value: local + partial, icon: <CheckCircle2 className="h-4 w-4" /> },
        { label: "С веб-интерфейсом", value: withUI, icon: <Globe className="h-4 w-4" /> },
      ].map((s) => (
        <Card key={s.label} className="bg-card/50 backdrop-blur border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">{s.icon}</div>
            <div>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function DependencyRadar({ project }: { project: Project }) {
  const deps = [
    { name: "Oracle DB", needed: project.requiresOracleDB },
    { name: "OCI Cloud", needed: project.requiresOCI },
    { name: "LLM API Key", needed: project.requiresLLMAPI },
    { name: "Ollama", needed: project.requiresOllama },
    { name: "Local LLM", needed: project.localLLM },
    { name: "Web UI", needed: project.hasWebUI },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {deps.map((d) => (
        <div key={d.name} className="flex items-center gap-2 text-xs">
          {d.needed ? (
            <div className="h-2 w-2 rounded-full bg-orange-500" />
          ) : (
            <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
          )}
          <span className={d.needed ? "text-foreground" : "text-muted-foreground"}>
            {d.name}
          </span>
        </div>
      ))}
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const staggerClass = `animate-stagger-${Math.min(index + 1, 6)}`;
  return (
    <Card className={`group card-glow relative overflow-hidden border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg animate-fade-in-up ${staggerClass}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      <CardHeader className="relative pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-muted ${project.color}`}>{project.icon}</div>
            <div>
              <CardTitle className="text-lg leading-tight">{project.name}</CardTitle>
              <div className="mt-1">{runnabilityBadge(project.runnability)}</div>
            </div>
          </div>
          {project.hasWebUI && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="outline" className="gap-1 text-xs">
                    <Globe className="h-3 w-3" /> Web UI
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>Есть веб-интерфейс</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardHeader>
      <CardContent className="relative space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>

        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <Badge key={s} variant="secondary" className="text-xs font-normal">
              {s}
            </Badge>
          ))}
        </div>

        <DependencyRadar project={project} />

        {/* Action buttons - real clickable links */}
        <div className="flex flex-wrap gap-2 pt-1">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="gap-1.5 text-xs">
                <Globe className="h-3 w-3" /> Открыть Live
              </Button>
            </a>
          )}
          <a
            href={`https://github.com/oracle-devrel/oracle-ai-developer-hub/tree/main/${project.githubPath}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <ExternalLink className="h-3 w-3" /> Исходный код
            </Button>
          </a>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                <Sparkles className="h-3 w-3" /> Подробнее
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-xl">
                <div className={`p-2 rounded-lg bg-muted ${project.color}`}>{project.icon}</div>
                {project.name}
              </DialogTitle>
              <DialogDescription className="sr-only">Подробности о проекте {project.name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-5 mt-2">
              <div>{runnabilityBadge(project.runnability)}</div>
              <p className="text-sm leading-relaxed text-muted-foreground">{project.longDescription}</p>
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" /> Ключевые особенности
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {project.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" /> Архитектура
                </h4>
                <div className="bg-muted/50 rounded-lg p-3 font-mono text-xs text-muted-foreground">
                  {project.architecture}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-primary" /> Зависимости
                </h4>
                <DependencyRadar project={project} />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {project.stack.map((s) => (
                  <Badge key={s} variant="secondary" className="text-xs font-normal">
                    {s}
                  </Badge>
                ))}
              </div>
              {/* Links in dialog */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="gap-1.5">
                      <Globe className="h-3.5 w-3.5" /> Открыть Live демо
                    </Button>
                  </a>
                )}
                <a
                  href={`https://github.com/oracle-devrel/oracle-ai-developer-hub/tree/main/${project.githubPath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <ExternalLink className="h-3.5 w-3.5" /> GitHub
                  </Button>
                </a>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

function WorkshopCard({ workshop }: { workshop: (typeof workshops)[0] }) {
  return (
    <Card className="border-border/50 hover:border-border transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-tight flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary shrink-0" />
            {workshop.name}
          </CardTitle>
          <Badge className={`${difficultyColor(workshop.difficulty)} shrink-0`}>
            {workshop.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground leading-relaxed">{workshop.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {workshop.stack.map((s) => (
            <Badge key={s} variant="secondary" className="text-xs font-normal">
              {s}
            </Badge>
          ))}
        </div>
        <a
          href={`https://github.com/oracle-devrel/oracle-ai-developer-hub/tree/main/${workshop.githubPath}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block"
        >
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <ExternalLink className="h-3 w-3" /> Открыть на GitHub
          </Button>
        </a>
      </CardContent>
    </Card>
  );
}

function RunnabilityChart() {
  const apps = projects.filter((p) => p.category === "app");
  const local = apps.filter((p) => p.runnability === "fully_local").length;
  const partial = apps.filter((p) => p.runnability === "partial_local").length;
  const cloud = apps.filter((p) => p.runnability === "cloud_required").length;
  const total = apps.length;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" /> Запускаемость проектов
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {[
          { label: "Полностью локально", count: local, color: "bg-emerald-500", pct: Math.round((local / total) * 100) },
          { label: "Частично локально (Docker)", count: partial, color: "bg-amber-500", pct: Math.round((partial / total) * 100) },
          { label: "Требует облако / API ключи", count: cloud, color: "bg-red-500", pct: Math.round((cloud / total) * 100) },
        ].map((item) => (
          <div key={item.label} className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-medium">
                {item.count} / {total} ({item.pct}%)
              </span>
            </div>
            <Progress value={item.pct} className={`h-2 [&>div]:${item.color}`} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function StackCloud() {
  const allStacks = projects.flatMap((p) => p.stack);
  const freq = new Map<string, number>();
  allStacks.forEach((s) => freq.set(s, (freq.get(s) || 0) + 1));
  const sorted = [...freq.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" /> Стек технологий
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {sorted.map(([tech, count]) => {
            const size = count >= 4 ? "text-base" : count >= 2 ? "text-sm" : "text-xs";
            const opacity = Math.min(1, 0.4 + count * 0.15);
            return (
              <TooltipProvider key={tech}>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge
                      variant="outline"
                      className={`${size} transition-all hover:scale-105`}
                      style={{ opacity }}
                    >
                      {tech}
                      <span className="ml-1 text-muted-foreground text-xs">×{count}</span>
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    {tech} используется в {count} проект(ах)
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  const [filter, setFilter] = useState<"all" | "fully_local" | "partial_local" | "cloud_required">("all");
  const [tab, setTab] = useState("apps");

  const filteredApps = useMemo(() => {
    const apps = projects.filter((p) => p.category === "app");
    if (filter === "all") return apps;
    return apps.filter((p) => p.runnability === filter);
  }, [filter]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <span className="gradient-text">Oracle AI Developer Hub</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                15+ AI проектов, ноутбуков и воркшопов — изучайте, запускайте, вдохновляйтесь
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/oracle-devrel/oracle-ai-developer-hub"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm" className="gap-2">
                  <ExternalLink className="h-3.5 w-3.5" /> GitHub
                </Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
        {/* Stats */}
        <HeroStats />

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RunnabilityChart />
          <StackCloud />
        </div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 max-w-lg">
            <TabsTrigger value="apps" className="gap-1.5 text-xs sm:text-sm">
              <Cpu className="h-3.5 w-3.5" /> Приложения ({projects.filter((p) => p.category === "app").length})
            </TabsTrigger>
            <TabsTrigger value="workshops" className="gap-1.5 text-xs sm:text-sm">
              <GraduationCap className="h-3.5 w-3.5" /> Воркшопы ({workshops.length})
            </TabsTrigger>
            <TabsTrigger value="notebooks" className="gap-1.5 text-xs sm:text-sm">
              <BookOpen className="h-3.5 w-3.5" /> Ноутбуки ({notebooks.length})
            </TabsTrigger>
            <TabsTrigger value="explorer" className="gap-1.5 text-xs sm:text-sm">
              <Brain className="h-3.5 w-3.5" /> Explorer
            </TabsTrigger>
          </TabsList>

          {/* Apps tab */}
          <TabsContent value="apps" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Фильтр:</span>
              {[
                { key: "all" as const, label: "Все" },
                { key: "fully_local" as const, label: "Локально" },
                { key: "partial_local" as const, label: "Docker" },
                { key: "cloud_required" as const, label: "Облако" },
              ].map((f) => (
                <Button
                  key={f.key}
                  variant={filter === f.key ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                </Button>
              ))}
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredApps.map((project, idx) => (
                <ProjectCard key={project.id} project={project} index={idx} />
              ))}
            </div>

            {filteredApps.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <XCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                Нет проектов, соответствующих фильтру
              </div>
            )}
          </TabsContent>

          {/* Workshops tab */}
          <TabsContent value="workshops" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workshops.map((w) => (
                <WorkshopCard key={w.id} workshop={w} />
              ))}
            </div>
          </TabsContent>

          {/* Notebooks tab */}
          <TabsContent value="notebooks" className="space-y-4">
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" /> Jupyter Notebooks
                </CardTitle>
                <CardDescription>
                  Интерактивные ноутбуки для изучения AI/ML, Oracle Database AI, OCI сервисов и Agent-разработки
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-border/50">
                  {notebooks.map((nb, i) => (
                    <div key={i} className="py-3 flex items-start gap-3 first:pt-0 last:pb-0">
                      <div className="p-1.5 rounded bg-orange-500/10 text-orange-500 mt-0.5">
                        <BookOpen className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{nb.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{nb.stack}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Explorer tab - Agent Reasoning Interactive */}
          <TabsContent value="explorer" className="space-y-4">
            <div className="explorer-panel">
              <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight mb-2">
                  From <span className="text-s1">Next Token</span> to <span className="text-s2">Next Thought</span>
                </h2>
                <p className="text-sm" style={{ color: "var(--explorer-muted)" }}>
                  15 интерактивных виджетов — исследуйте 16 стратегий рассуждений, которые превращают LLM в агентов-решателей.
                  Нажимайте кнопки, двигайте слайдеры, изучайте когнитивные архитектуры.
                </p>
              </div>

              <section className="mb-8">
                <h2 className="text-lg font-bold mb-2"><span className="text-s1">01</span> Chain-of-Thought</h2>
                <p className="text-sm mb-2">Пошаговое рассуждение: вместо прямого ответа модель нумерует шаги (Step 1, Step 2...), что кардинально улучшает точность на математических и логических задачах.</p>
                <CoTChainWidget />
              </section>

              <section className="mb-8">
                <h2 className="text-lg font-bold mb-2"><span className="text-s2">02</span> Tree of Thoughts</h2>
                <p className="text-sm mb-2">Расширение CoT до дерева: модель генерирует несколько кандидатов, оценивает каждый, отсекает слабые и продолжает только лучшие ветки.</p>
                <ToTTreeWidget />
              </section>

              <section className="mb-8">
                <h2 className="text-lg font-bold mb-2"><span className="text-s2">03</span> ReAct: Reason + Act</h2>
                <p className="text-sm mb-2">Чередование внутреннего рассуждения (Thought) с вызовом инструментов (Action) и чтением результатов (Observation).</p>
                <ReActWidget />
              </section>

              <section className="mb-8">
                <h2 className="text-lg font-bold mb-2"><span className="text-s3">04</span> Self-Reflection</h2>
                <p className="text-sm mb-2">Цикл Черновик → Критика → Улучшение. Модель оценивает свой ответ и дорабатывает его.</p>
                <SelfReflectionWidget />
              </section>

              <section className="mb-8">
                <h2 className="text-lg font-bold mb-2"><span className="text-s3">05</span> Self-Consistency</h2>
                <p className="text-sm mb-2">Генерация k независимых рассуждений и мажоритарное голосование за лучший ответ.</p>
                <ConsistencyWidget />
              </section>

              <section className="mb-8">
                <h2 className="text-lg font-bold mb-2"><span className="text-s4">06</span> Decomposition</h2>
                <p className="text-sm mb-2">Разбиение сложной задачи на подзадачи, последовательное решение и синтез.</p>
                <DecomposedWidget />
              </section>

              <section className="mb-8">
                <h2 className="text-lg font-bold mb-2"><span className="text-s4">07</span> Least-to-Most</h2>
                <p className="text-sm mb-2">Упорядочение подзадач от простых к сложным — каждая решённая задача помогает следующей.</p>
                <LeastToMostWidget />
              </section>

              <section className="mb-8">
                <h2 className="text-lg font-bold mb-2"><span className="text-s5">08</span> Refinement Loop</h2>
                <p className="text-sm mb-2">Цикл Генератор → Критик (оценка 0.0–1.0) → Улучшатель с количественным контролем качества.</p>
                <RefinementWidget />
              </section>

              <section className="mb-8">
                <h2 className="text-lg font-bold mb-2"><span className="text-s6">09</span> Adversarial Debate</h2>
                <p className="text-sm mb-2">Две стороны (PRO и CON) спорят, судья оценивает каждый раунд.</p>
                <DebateWidget />
              </section>

              <section className="mb-8">
                <h2 className="text-lg font-bold mb-2"><span className="text-s6">10</span> MCTS</h2>
                <p className="text-sm mb-2">Monte Carlo Tree Search с UCB1 — тот же алгоритм, что powered AlphaGo.</p>
                <MCTSWidget />
              </section>

              <section className="mb-8">
                <h2 className="text-lg font-bold mb-2"><span className="text-s6">11</span> Analogical Reasoning</h2>
                <p className="text-sm mb-2">Решение через структурные аналогии из других предметных областей.</p>
                <AnalogicalWidget />
              </section>

              <section className="mb-8">
                <h2 className="text-lg font-bold mb-2"><span className="text-s6">12</span> Socratic Method</h2>
                <p className="text-sm mb-2">Построение понимания через последовательные вопросы.</p>
                <SocraticWidget />
              </section>

              <section className="mb-8">
                <h2 className="text-lg font-bold mb-2"><span className="text-s7">13</span> Meta-Reasoning</h2>
                <p className="text-sm mb-2">Автоматическая классификация запроса и маршрутизация к оптимальной стратегии.</p>
                <MetaReasoningWidget />
              </section>

              <section className="mb-8">
                <h2 className="text-lg font-bold mb-2"><span className="text-s7">14</span> Benchmarks</h2>
                <p className="text-sm mb-2">Сравнение стратегий по точности на GSM8K, MMLU и ARC-Challenge.</p>
                <StrategyComparisonWidget />
              </section>

              <section className="mb-4">
                <h2 className="text-lg font-bold mb-2"><span className="text-s7">15</span> Architecture</h2>
                <p className="text-sm mb-2">Системная архитектура: ReasoningInterceptor → AGENT_MAP → BaseAgent.</p>
                <ArchitectureWidget />
              </section>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            <span>Oracle AI Developer Hub — Project Explorer</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs">Source: github.com/oracle-devrel/oracle-ai-developer-hub</span>
            <Badge variant="outline" className="text-xs">
              UPL 1.0 License
            </Badge>
          </div>
        </div>
      </footer>
    </div>
  );
}
