"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
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
  Play,
  Sun,
  Moon,
  Menu,
  X,
  Download,
  Copy,
  Check,
  ArrowLeft,
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
    name: "Агентные рассуждения",
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
      "Интерактивный обозреватель Next.js",
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
    name: "Агентный RAG",
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
    name: "Финансовый ИИ-агент",
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
    name: "OCI Генеративный ИИ JET UI",
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
      "Бэкенд на Spring Boot",
      "OCI GenAI чат + суммаризация",
      "Kubernetes деплой",
      "Terraform IaC",
      "Wallet автономной БД",
    ],
    architecture: "Oracle JET → Spring Boot → OCI GenAI + Oracle ADB",
    githubPath: "apps/oci-generative-ai-jet-ui",
  },
  {
    id: "tanstack-shoe-store",
    name: "TanStack Обувной магазин",
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
      "Несколько LLM-провайдеров",
      "Oracle Autonomous DB",
      "Сервер разработки Vite",
    ],
    architecture: "TanStack Start → Oracle Select AI → LLM (NL→SQL) → Autonomous DB",
    githubPath: "apps/tanstack-shoe-store",
  },
  {
    id: "oracle-data-migration",
    name: "Инструмент миграции данных",
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
      "Без расходов на облачные API",
    ],
    architecture: "Streamlit UI → LangChain → Oracle AI DB (embeddings + HNSW) + Ollama",
    githubPath: "apps/oracle-rag",
  },
  {
    id: "supplychain-agent",
    name: "Агент цепочки поставок",
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
      "Семантический LLM-кэш",
      "Чекпоинты на поток",
      "FastAPI + React UI",
    ],
    architecture: "React UI → FastAPI → LangGraph Supervisor → Specialists → Oracle AI DB",
    githubPath: "apps/supplychain-demand-planning-agent",
  },
  {
    id: "oracle-java-memory",
    name: "Память Java-агента",
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
    name: "RAG → Системы памяти",
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
      "Типизированные хранилища памяти",
      "CLI интерфейс",
      "Плавная деградация",
    ],
    architecture: "CLI → MemoryManager → 5 Memory Stores → Oracle AI DB (+ SimulatedModel fallback)",
    githubPath: "apps/rag-to-memory-systems-demo",
  },
  {
    id: "oracle-vector-search",
    name: "Векторный поиск (Spring)",
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
      "API семантического поиска",
      "Эмбеддинги OpenAI",
      "Векторное хранилище Oracle DB",
      "REST API",
      "Spring Boot",
    ],
    architecture: "REST API → Spring Boot → Oracle DB (vectors) + OpenAI (embeddings)",
    githubPath: "apps/oracle-database-vector-search",
  },
  {
    id: "limitless-workflow",
    name: "Безграничный рабочий процесс",
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
      "Oracle DB на OCI",
      "Понимание кода",
      "Граф знаний",
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
    name: "Поиск информации до RAG",
    description: "Постройте ассистента для научных статей по 200 ArXiv papers, реализуя 5 стратегий поиска (keyword, vector, hybrid, graph) и полный RAG-пайплайн.",
    stack: ["Oracle AI DB", "sentence-transformers", "OCI GenAI"],
    difficulty: "Начальный" as const,
    githubPath: "workshops/information_retrieval_to_RAG",
  },
  {
    id: "rag-to-agents",
    name: "От RAG к агентам",
    description: "Расширьте RAG-пайплайн до мульти-агентной системы — оберните retrieval как инструменты агента, добавьте оркестрацию и персистентную память на Oracle.",
    stack: ["Oracle AI DB", "OpenAI API", "openai-agents"],
    difficulty: "Средний" as const,
    githubPath: "workshops/from_rag_to_agents_workshop",
  },
  {
    id: "agent-memory-ws",
    name: "Воркшоп по памяти агента",
    description: "Постройте агентов с памятью: реализуйте MemoryManager с 6 типами памяти в Oracle, примените context-engineering техники.",
    stack: ["Oracle AI DB", "langchain-oracledb", "OCI GenAI", "Tavily"],
    difficulty: "Средний" as const,
    githubPath: "workshops/agent_memory_workshop",
  },
  {
    id: "enterprise-harness",
    name: "Каркас корпоративного агента данных",
    description: "Постройте enterprise data agent на Oracle AI DB 26ai с OAMP, hybrid search, JSON Duality Views, Deep Data Security и DBMS_SCHEDULER. Живой Flask + React UI.",
    stack: ["Oracle AI DB 26ai", "OAMP", "Flask", "React"],
    difficulty: "Продвинутый" as const,
    githubPath: "workshops/enterprise-data-agent-harness-workshop",
  },
  {
    id: "supplychain-ws",
    name: "Агент спроса в цепочке поставок",
    description: "Мульти-агентный помощник с LangGraph supervisor, векторными знаниями, долгосрочной памятью и семантическим кэшем. FastAPI + React чат с анимированной топологией.",
    stack: ["Oracle AI DB", "LangGraph", "FastAPI", "React"],
    difficulty: "Продвинутый" as const,
    githubPath: "workshops/supplychain_demand_agent_workshop",
  },
];

const COLAB_BASE = "https://colab.research.google.com/github/oracle-devrel/oracle-ai-developer-hub/blob/main";
const GITHUB_BASE = "https://github.com/oracle-devrel/oracle-ai-developer-hub/tree/main";

const notebooks = [
  {
    id: "agentic-rag-langchain",
    name: "Агентный RAG с LangChain",
    description: "Демонстрация агентного RAG с LangChain и Oracle AI Database — векторный поиск, генерация ответов, интеграция с Ollama",
    stack: ["Oracle AI DB", "langchain-oracledb", "Ollama"],
    filePath: "notebooks/agentic_rag_langchain_oracledb_demo.ipynb",
    category: "rag" as const,
  },
  {
    id: "fs-vs-db-memory",
    name: "Файловая система vs БД памяти агента",
    description: "Сравнение файловой системы и Oracle AI DB для хранения памяти агента — бенчмарки производительности и точности",
    stack: ["LangChain", "Oracle AI DB", "OpenAI"],
    filePath: "notebooks/fs_vs_dbs.ipynb",
    category: "agents" as const,
  },
  {
    id: "memory-context-eng",
    name: "Инженерия контекста памяти",
    description: "Инженерия контекста памяти для агентов — долгосрочная память, семантический кэш, интеграция с Tavily",
    stack: ["LangChain", "Oracle AI DB", "OpenAI", "Tavily"],
    filePath: "notebooks/memory_context_engineering_agents.ipynb",
    category: "agents" as const,
  },
  {
    id: "oracle-langchain-example",
    name: "Пример Oracle LangChain",
    description: "Пример использования LangChain с Oracle AI Database — эмбеддинги, векторный поиск, RAG пайплайн",
    stack: ["Oracle AI DB", "langchain-oracledb", "HuggingFace"],
    filePath: "notebooks/oracle_langchain_example.ipynb",
    category: "rag" as const,
  },
  {
    id: "rag-zero-to-hero",
    name: "RAG-агенты с нуля до профи",
    description: "Полное руководство по RAG-агентам — от базового векторного поиска до мульти-агентных систем с OpenAI Agents SDK",
    stack: ["Oracle AI DB", "OpenAI", "OpenAI Agents SDK"],
    filePath: "notebooks/oracle_rag_agents_zero_to_hero.ipynb",
    category: "rag" as const,
  },
  {
    id: "rag-with-evals",
    name: "RAG с оценкой качества",
    description: "RAG-пайплайн с оценкой качества — BEIR бенчмарки, Galileo мониторинг, метрики релевантности",
    stack: ["Oracle AI DB", "OpenAI", "BEIR", "Galileo"],
    filePath: "notebooks/oracle_rag_with_evals.ipynb",
    category: "rag" as const,
  },
  {
    id: "agent-reasoning-demo",
    name: "Демо агентных рассуждений",
    description: "Демонстрация 11 когнитивных архитектур рассуждений — Chain-of-Thought, Tree of Thoughts, ReAct и другие",
    stack: ["Ollama", "11 cognitive architectures"],
    filePath: "notebooks/agent_reasoning_demo.ipynb",
    category: "agents" as const,
  },
  {
    id: "hybrid-search-agentic-rag",
    name: "Гибридный поиск (агентный RAG)",
    description: "Гибридный поиск в агентном RAG — комбинация ключевого и векторного поиска с LangGraph оркестрацией",
    stack: ["Oracle AI DB", "langchain-oracledb", "LangGraph"],
    filePath: "notebooks/oracle_agentic_rag_hybrid_search.ipynb",
    category: "rag" as const,
  },
  {
    id: "f1-miami-strategy",
    name: "Стратегия F1 Майами (Oracle 26ai)",
    description: "Анализ стратегии F1 Miami GP с Oracle 23ai — визуализация телеметрии, Select AI для запросов на естественном языке",
    stack: ["Oracle AI DB", "FastF1", "Plotly"],
    filePath: "notebooks/f1_miami_strategy_oracle_26ai.ipynb",
    category: "analytics" as const,
  },
  {
    id: "oamp-developer-guide",
    name: "Руководство разработчика OAMP",
    description: "Руководство разработчика Oracle AI Database Memory Protocol — интеграция с LiteLLM, паттерны использования",
    stack: ["OAMP", "LiteLLM"],
    filePath: "notebooks/agent_memory/oracle_agent_memory_developer_guide.ipynb",
    category: "agents" as const,
  },
  {
    id: "deep-research-agent",
    name: "Агент глубокого исследования",
    description: "Глубокий исследовательский агент — OpenAI Agents SDK для автоматического поиска, анализа и синтеза информации",
    stack: ["OpenAI Agents SDK", "Tavily", "OAMP"],
    filePath: "notebooks/agent_memory/01_deep_research_openai_agents.ipynb",
    category: "agents" as const,
  },
  {
    id: "supply-chain-claude",
    name: "Цепочка поставок (Claude SDK)",
    description: "Мульти-агентная система управления цепочками поставок — Claude Agent SDK с MCP инструментами и Oracle AI Memory",
    stack: ["Claude Agent SDK", "MCP", "OAMP"],
    filePath: "notebooks/agent_memory/02_supply_chain_claude_agent_sdk.ipynb",
    category: "agents" as const,
  },
  {
    id: "mortgage-workflow-langgraph",
    name: "Ипотечный процесс (LangGraph)",
    description: "Автоматизация ипотечного процесса с LangGraph — графовый воркфлоу с состоянием, оркестрация шагов одобрения",
    stack: ["LangGraph", "OAMP"],
    filePath: "notebooks/agent_memory/03_mortgage_workflow_langgraph.ipynb",
    category: "agents" as const,
  },
  {
    id: "agent-loop-foundations",
    name: "Основы агентного цикла",
    description: "Основы агентного цикла — пошаговое построение агента от простого чата до автономного цикла рассуждение-действие",
    stack: ["Oracle AI DB", "LangChain"],
    filePath: "notebooks/agent_loop_foundations.ipynb",
    category: "agents" as const,
  },
  {
    id: "agent-with-memory",
    name: "Агент с памятью",
    description: "Агент с памятью — добавление краткосрочной и долгосрочной памяти к агенту, семантический поиск по истории",
    stack: ["Oracle AI DB", "LangChain"],
    filePath: "notebooks/agent_with_memory.ipynb",
    category: "agents" as const,
  },
  {
    id: "unified-agent-memory",
    name: "Единая память агента",
    description: "Единая система памяти агента — Oracle AI Database для хранения контекста, эпизодической и процедурной памяти",
    stack: ["Oracle AI DB", "LangChain"],
    filePath: "notebooks/unified_agent_memory_oracle_ai_database.ipynb",
    category: "agents" as const,
  },
  {
    id: "oracle-agent-memory-long",
    name: "Длинные диалоги с памятью агента",
    description: "Обработка длинных диалогов в памяти агента — суммаризация, скользящее окно, семантическое сжатие",
    stack: ["Oracle AI DB", "LangChain"],
    filePath: "notebooks/oracle_agent_memory_long_conversations.ipynb",
    category: "agents" as const,
  },
  {
    id: "oracle-26ai-select-ai",
    name: "Oracle 23ai Select AI",
    description: "Select AI в Oracle Database 23ai — запросы к базе данных на естественном языке, интеграция с LLM провайдерами",
    stack: ["Oracle 23ai", "Select AI"],
    filePath: "notebooks/oracle_26ai_select_ai.ipynb",
    category: "database" as const,
  },
  {
    id: "oracle-26ai-unique-features",
    name: "Уникальные возможности Oracle 23ai",
    description: "Уникальные возможности Oracle 23ai — AI Vector Search, Select AI, JSON-реляционная двойственность",
    stack: ["Oracle 23ai", "AI Vector Search"],
    filePath: "notebooks/oracle_26ai_unique_features_demo.ipynb",
    category: "database" as const,
  },
  {
    id: "claude-mcp-oracle",
    name: "Claude MCP + Oracle AI DB Memory",
    description: "Интеграция Claude MCP с Oracle AI Database Memory — Model Context Protocol для подключения инструментов к агенту",
    stack: ["Claude", "MCP", "Oracle AI DB", "LangChain"],
    filePath: "notebooks/claude_mcp_oracle_ai_database_memory_langchain.ipynb",
    category: "agents" as const,
  },
  {
    id: "onnx-embeddings",
    name: "Эмбеддинги ONNX в Oracle AI DB",
    description: "Оптимизированные ONNX эмбеддинги в Oracle AI Database — ускорение векторного поиска с помощью ONNX Runtime",
    stack: ["Oracle AI DB", "ONNX", "HuggingFace"],
    filePath: "notebooks/onnx_embeddings_oracle_ai_database.ipynb",
    category: "database" as const,
  },
  {
    id: "enterprise-data-agent",
    name: "Корпоративный агент данных",
    description: "Корпоративный агент данных — доступ к бизнес-данным через естественный язык, SQL генерация, векторный поиск",
    stack: ["Oracle AI DB", "LangChain"],
    filePath: "notebooks/enterprise_data_agent.ipynb",
    category: "agents" as const,
  },
  {
    id: "image-similarity-openclip",
    name: "Поиск похожих изображений (OpenCLIP)",
    description: "Поиск похожих изображений с OpenCLIP и Oracle AI Database — мультимодальные эмбеддинги, визуальный поиск",
    stack: ["Oracle AI DB", "OpenCLIP", "PIL"],
    filePath: "notebooks/oracle_image_similarity_openclip.ipynb",
    category: "multimodal" as const,
  },
  {
    id: "pipeline-failure-intelligence",
    name: "Интеллектуальный анализ отказов конвейера",
    description: "Интеллектуальный анализ отказов конвейера — предиктивное обслуживание с ML и Oracle AI Database",
    stack: ["Oracle AI DB", "scikit-learn", "Plotly"],
    filePath: "notebooks/pipeline_failure_intelligence.ipynb",
    category: "analytics" as const,
  },
  {
    id: "multitenant-schema-walkthrough",
    name: "Обзор мультитенантной схемы",
    description: "Пошаговое руководство по мультитенантной архитектуре Oracle — изоляция данных, общие схемы, CDB/PDB",
    stack: ["Oracle Database", "Multitenant"],
    filePath: "notebooks/multitenant_schema_walkthrough.ipynb",
    category: "database" as const,
  },
  {
    id: "oracle-data-migration-harness",
    name: "Обзор инструмента миграции данных",
    description: "Руководство по Data Migration Harness — миграция данных с AI-помощником, автоматическое преобразование схем",
    stack: ["Oracle AI DB", "Migration"],
    filePath: "notebooks/oracle_data_migration_harness_walkthrough.ipynb",
    category: "database" as const,
  },
  {
    id: "agent-memory-benchmarks",
    name: "Бенчмарки памяти агента",
    description: "Бенчмарки памяти агента — сравнение производительности различных стратегий хранения контекста",
    stack: ["Oracle AI DB", "LangChain", "Benchmarks"],
    filePath: "notebooks/agent_memory/oracle_agent_memory_benchmarks.ipynb",
    category: "agents" as const,
  },
  {
    id: "deep-research-oci-agents",
    name: "Глубокое исследование (OCI Agents)",
    description: "Вариант Deep Research агента на OCI Agents SDK — облачная инфраструктура Oracle для автономного исследования",
    stack: ["OCI Agents SDK", "Tavily", "OAMP"],
    filePath: "notebooks/agent_memory/01_deep_research_oci_agents.ipynb",
    category: "agents" as const,
  },
  {
    id: "supply-chain-oci-sdk",
    name: "Цепочка поставок (OCI SDK)",
    description: "Supply Chain агент на OCI SDK — нативная интеграция с облачными сервисами Oracle",
    stack: ["OCI SDK", "OAMP"],
    filePath: "notebooks/agent_memory/02_supply_chain_oci_sdk.ipynb",
    category: "agents" as const,
  },
  {
    id: "mortgage-workflow-oci",
    name: "Ипотечный процесс (OCI)",    
    description: "Ипотечный воркфлоу на OCI — облачная версия с LangGraph и Oracle Cloud Infrastructure",
    stack: ["LangGraph", "OCI", "OAMP"],
    filePath: "notebooks/agent_memory/03_mortgage_workflow_langgraph_oci.ipynb",
    category: "agents" as const,
  },
  {
    id: "agent-memory-benchmarks-oci",
    name: "Бенчмарки памяти агента (OCI)",
    description: "Бенчмарки памяти агента на OCI — облачное сравнение стратегий хранения",
    stack: ["OCI", "Oracle AI DB", "Benchmarks"],
    filePath: "notebooks/agent_memory/oracle_agent_memory_benchmarks_oci.ipynb",
    category: "agents" as const,
  },
  {
    id: "oamp-developer-guide-oci",
    name: "Руководство разработчика OAMP (OCI)",
    description: "Руководство разработчика OAMP для OCI — облачная версия с интеграцией OCI GenAI",
    stack: ["OAMP", "OCI GenAI"],
    filePath: "notebooks/agent_memory/oracle_agent_memory_developer_guide_oci.ipynb",
    category: "agents" as const,
  },
  {
    id: "enterprise-agent-heavyweight",
    name: "Корпоративный агент данных (расширенный)",
    description: "Расширенная версия корпоративного агента — полный набор инструментов, чат-интерфейс, векторный поиск",
    stack: ["Oracle AI DB", "LangChain", "FastAPI"],
    filePath: "notebooks/agent_harness/enterprise_data_agent_heavyweight.ipynb",
    category: "agents" as const,
  },
  {
    id: "colab-agent-memory",
    name: "Память агента (Colab)",
    description: "Запуск агента с памятью в Google Colab — настройка среды, подключение к Oracle Cloud",
    stack: ["Oracle AI DB", "Colab", "LangChain"],
    filePath: "notebooks/multicloud/oracle_agent_memory_colab.ipynb",
    category: "multicloud" as const,
  },
  {
    id: "colab-similarity-search",
    name: "Поиск по сходству (Colab)",
    description: "Семантический поиск в Google Colab — векторные эмбеддинги и поиск похожих документов",
    stack: ["Oracle AI DB", "Colab", "Embeddings"],
    filePath: "notebooks/multicloud/similaritysearch-colab.ipynb",
    category: "multicloud" as const,
  },
  {
    id: "colab-aws-agent-memory",
    name: "Память агента AWS (Colab)",
    description: "Мультиоблачный агент с памятью — Oracle AI DB + AWS Bedrock в Google Colab",
    stack: ["Oracle AI DB", "AWS Bedrock", "Colab"],
    filePath: "notebooks/multicloud/oracle_agent_memory_aws_colab.ipynb",
    category: "multicloud" as const,
  },
  {
    id: "colab-rag-agent-devkit",
    name: "RAG-чатбот с Agent DevKit (Colab)",
    description: "RAG-чатбот с Agent Development Kit в Colab — интерактивный поиск по документам",
    stack: ["Oracle AI DB", "Agent DevKit", "Colab"],
    filePath: "notebooks/multicloud/RAGChatbotwithAgentDevelopmentKit.ipynb",
    category: "multicloud" as const,
  },
  {
    id: "colab-google-agent-memory",
    name: "Память агента в Google Cloud (Colab)",
    description: "Создание памяти агента в Google Cloud — Oracle AI DB + GCP Vertex AI интеграция",
    stack: ["Oracle AI DB", "Google Cloud", "Colab"],
    filePath: "notebooks/multicloud/create_ai_agent_memory_google.ipynb",
    category: "multicloud" as const,
  },
  {
    id: "aws-similarity-search",
    name: "Поиск по сходству AWS",
    description: "Векторный поиск Oracle + AWS — мультитенантная архитектура с Bedrock эмбеддингами",
    stack: ["Oracle AI DB", "AWS Bedrock", "LangChain"],
    filePath: "notebooks/multicloud/oracle-aws-similarity-search.ipynb",
    category: "multicloud" as const,
  },
  {
    id: "azure-similarity-search",
    name: "Поиск по сходству Azure",
    description: "Векторный поиск Oracle + Azure — интеграция с Azure OpenAI для эмбеддингов",
    stack: ["Oracle AI DB", "Azure OpenAI", "LangChain"],
    filePath: "notebooks/multicloud/oracle-azure-similarity-search.ipynb",
    category: "multicloud" as const,
  },
  {
    id: "aws-bedrock-rag",
    name: "Oracle DB + AWS Bedrock RAG",
    description: "RAG-пайплайн Oracle Database + AWS Bedrock — мультитенантный поиск с Bedrock генерацией",
    stack: ["Oracle DB", "AWS Bedrock", "LangChain"],
    filePath: "notebooks/multicloud/oracle-db-aws-bedrock.ipynb",
    category: "multicloud" as const,
  },
  {
    id: "colab-unesco-selectai",
    name: "Объекты UNESCO через SelectAI (Colab)",
    description: "Анализ объектов UNESCO через SelectAI — запросы на естественном языке к данным в Oracle",
    stack: ["Oracle 23ai", "Select AI", "Colab"],
    filePath: "notebooks/multicloud/unesco-sites-selectai-colab.ipynb",
    category: "multicloud" as const,
  },
  {
    id: "fs-vs-dbs-oci-genai",
    name: "Файловая vs БД память (OCI GenAI)",
    description: "Сравнение файловой и БД памяти агента с OCI GenAI — облачный вариант бенчмарков",
    stack: ["Oracle AI DB", "OCI GenAI", "LangChain"],
    filePath: "notebooks/fs_vs_dbs_oci_genai.ipynb",
    category: "agents" as const,
  },
  {
    id: "mongodb-customers",
    name: "Интеграция клиентов MongoDB",
    description: "Интеграция MongoDB с Oracle AI Database — синхронизация данных, кросс-БД запросы",
    stack: ["MongoDB", "Oracle AI DB", "Python"],
    filePath: "notebooks/multicloud/mongodb_create_customers.ipynb",
    category: "multicloud" as const,
  },
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
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
      {[
        { label: "Приложений", value: apps.length, icon: <Cpu className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> },
        { label: "Ноутбуков", value: notebooks.length, icon: <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> },
        { label: "Локально", value: local + partial, icon: <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> },
        { label: "С веб-UI", value: withUI, icon: <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> },
      ].map((s) => (
        <Card key={s.label} className="bg-card/50 backdrop-blur border-border/50">
          <CardContent className="p-2.5 sm:p-4 flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 text-primary">{s.icon}</div>
            <div>
              <div className="text-lg sm:text-2xl font-bold">{s.value}</div>
              <div className="text-[10px] sm:text-xs text-muted-foreground leading-tight">{s.label}</div>
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
    { name: "Ключ LLM API", needed: project.requiresLLMAPI },
    { name: "Ollama", needed: project.requiresOllama },
    { name: "Локальный LLM", needed: project.localLLM },
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
      <CardHeader className="relative pb-2 sm:pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className={`p-1.5 sm:p-2 rounded-lg bg-muted ${project.color} shrink-0`}>{project.icon}</div>
            <div className="min-w-0">
              <Link href={`/project/${project.id}`} className="hover:underline">
                <CardTitle className="text-sm sm:text-lg leading-tight group-hover:text-primary transition-colors">{project.name}</CardTitle>
              </Link>
              <div className="mt-1">{runnabilityBadge(project.runnability)}</div>
            </div>
          </div>
          {project.hasWebUI && (
            <Badge variant="outline" className="gap-1 text-[10px] sm:text-xs shrink-0">
              <Globe className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> Web
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="relative space-y-3 sm:space-y-4">
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{project.description}</p>

        <div className="flex flex-wrap gap-1 sm:gap-1.5">
          {project.stack.slice(0, 4).map((s) => (
            <Badge key={s} variant="secondary" className="text-[10px] sm:text-xs font-normal">
              {s}
            </Badge>
          ))}
          {project.stack.length > 4 && (
            <Badge variant="secondary" className="text-[10px] sm:text-xs font-normal">
              +{project.stack.length - 4}
            </Badge>
          )}
        </div>

        <DependencyRadar project={project} />

        {/* Action buttons - real clickable links */}
        <div className="flex flex-wrap gap-2 pt-1">
          <Link href={`/project/${project.id}`}>
            <Button size="sm" className="gap-1.5 text-xs bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0">
              <FileSearch className="h-3 w-3" /> Открыть проект
            </Button>
          </Link>

          <a
            href={`https://github.com/oracle-devrel/oracle-ai-developer-hub/tree/main/${project.githubPath}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <ExternalLink className="h-3 w-3" /> GitHub
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
                <Link href={`/project/${project.id}`}>
                  <Button size="sm" className="gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0">
                    <FileSearch className="h-3.5 w-3.5" /> Открыть проект
                  </Button>
                </Link>
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="gap-1.5">
                      <Globe className="h-3.5 w-3.5" /> Live демо
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
      <CardHeader className="pb-2 sm:pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm sm:text-base leading-tight flex items-center gap-1.5 sm:gap-2 min-w-0">
            <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
            <Link href={`/project/${workshop.id}`} className="hover:underline hover:text-primary transition-colors">
              {workshop.name}
            </Link>
          </CardTitle>
          <Badge className={`${difficultyColor(workshop.difficulty)} shrink-0 text-[10px] sm:text-xs`}>
            {workshop.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-3">
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{workshop.description}</p>
        <div className="flex flex-wrap gap-1 sm:gap-1.5">
          {workshop.stack.map((s) => (
            <Badge key={s} variant="secondary" className="text-[10px] sm:text-xs font-normal">
              {s}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <Link href={`/project/${workshop.id}`}>
            <Button size="sm" className="gap-1 text-[10px] sm:text-xs h-7 sm:h-8 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0">
              <FileSearch className="h-3 w-3" /> Открыть
            </Button>
          </Link>
          <a
            href={`https://github.com/oracle-devrel/oracle-ai-developer-hub/tree/main/${workshop.githubPath}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="gap-1 text-[10px] sm:text-xs h-7 sm:h-8">
              <ExternalLink className="h-3 w-3" /> GitHub
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

function NotebookCard({ notebook }: { notebook: (typeof notebooks)[0] }) {
  const colabUrl = `${COLAB_BASE}/${notebook.filePath}`;
  const githubUrl = `${GITHUB_BASE}/${notebook.filePath}`;
  const rawUrl = `https://raw.githubusercontent.com/oracle-devrel/oracle-ai-developer-hub/main/${notebook.filePath}`;
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(colabUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = rawUrl;
    a.download = notebook.filePath.split("/").pop() || "notebook.ipynb";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const categoryLabel: Record<string, string> = {
    rag: "RAG",
    agents: "Агенты",
    database: "БД",
    analytics: "Аналитика",
    multimodal: "Мульти",
    multicloud: "Мультиобл.",
  };

  const categoryLabelFull: Record<string, string> = {
    rag: "RAG",
    agents: "Агенты",
    database: "База данных",
    analytics: "Аналитика",
    multimodal: "Мультимодальный",
    multicloud: "Мультиоблако",
  };

  const categoryColor: Record<string, string> = {
    rag: "bg-blue-500/15 text-blue-600 border-blue-500/25",
    agents: "bg-purple-500/15 text-purple-600 border-purple-500/25",
    database: "bg-emerald-500/15 text-emerald-600 border-emerald-500/25",
    analytics: "bg-amber-500/15 text-amber-600 border-amber-500/25",
    multimodal: "bg-pink-500/15 text-pink-600 border-pink-500/25",
    multicloud: "bg-cyan-500/15 text-cyan-600 border-cyan-500/25",
  };

  return (
    <Card className="border-border/50 hover:border-border transition-all duration-300 hover:shadow-md group">
      <CardHeader className="pb-2 sm:pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm sm:text-base leading-tight flex items-center gap-1.5 sm:gap-2 min-w-0">
            <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-500 shrink-0" />
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-orange-500 transition-colors"
            >
              {notebook.name}
            </a>
          </CardTitle>
          <Badge className={`${categoryColor[notebook.category] || "bg-gray-500/15 text-gray-600 border-gray-500/25"} shrink-0 text-[10px] sm:text-xs`}>
            {categoryLabelFull[notebook.category] || notebook.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-3">
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{notebook.description}</p>
        <div className="flex flex-wrap gap-1 sm:gap-1.5">
          {notebook.stack.map((s) => (
            <Badge key={s} variant="secondary" className="text-[10px] sm:text-xs font-normal">
              {s}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <a href={colabUrl} target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="gap-1 text-[10px] sm:text-xs h-7 sm:h-8 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0">
              <Play className="h-3 w-3" /> <span className="sm:hidden">Colab</span><span className="hidden sm:inline">Открыть в Colab</span>
            </Button>
          </a>
          <Button
            variant="outline"
            size="sm"
            className="gap-1 text-[10px] sm:text-xs h-7 sm:h-8"
            onClick={handleDownload}
          >
            <Download className="h-3 w-3" /> <span className="sm:hidden">.ipynb</span><span className="hidden sm:inline">Скачать .ipynb</span>
          </Button>
          <a href={githubUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="gap-1 text-[10px] sm:text-xs h-7 sm:h-8">
              <ExternalLink className="h-3 w-3" /> GitHub
            </Button>
          </a>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-[10px] sm:text-xs h-7 sm:h-8 px-2"
                  onClick={handleCopyLink}
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Скопировать ссылку Colab</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
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
  const [notebookFilter, setNotebookFilter] = useState<string>("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => { setMounted(true); }, []);

  const filteredApps = useMemo(() => {
    const apps = projects.filter((p) => p.category === "app");
    if (filter === "all") return apps;
    return apps.filter((p) => p.runnability === filter);
  }, [filter]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2">
                <div className="p-1 sm:p-1.5 rounded-lg bg-primary/10 shrink-0">
                  <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <span className="gradient-text truncate">Oracle AI Developer Hub</span>
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 hidden sm:block">
                15+ AI проектов, ноутбуков и воркшопов — изучайте, запускайте, вдохновляйтесь
              </p>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Back to Portfolio */}
              <a
                href="https://buhtig-sudo-azar.github.io/folio-portfolio/projects/"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex"
              >
                <Button variant="outline" size="sm" className="gap-1.5 text-xs hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all duration-200">
                  <ArrowLeft className="h-3.5 w-3.5" /> Портфолио
                </Button>
              </a>
              {/* Theme toggle */}
              {mounted && (
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 sm:h-9 sm:w-9"
                  onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                  title={resolvedTheme === "dark" ? "Светлая тема" : "Тёмная тема"}
                >
                  {resolvedTheme === "dark" ? (
                    <Sun className="h-4 w-4 text-amber-400" />
                  ) : (
                    <Moon className="h-4 w-4 text-slate-700" />
                  )}
                </Button>
              )}
              <a
                href="https://github.com/oracle-devrel/oracle-ai-developer-hub"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex"
              >
                <Button variant="outline" size="sm" className="gap-2">
                  <ExternalLink className="h-3.5 w-3.5" /> GitHub
                </Button>
              </a>
              {/* Mobile menu toggle */}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 sm:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden mt-3 pt-3 border-t border-border/50 flex items-center gap-2">
              <a
                href="https://buhtig-sudo-azar.github.io/folio-portfolio/projects/"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm" className="gap-1.5 text-xs hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all duration-200">
                  <ArrowLeft className="h-3.5 w-3.5" /> Портфолио
                </Button>
              </a>
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
          )}
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Stats */}
        <HeroStats />

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RunnabilityChart />
          <StackCloud />
        </div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab} className="space-y-4">
          <TabsList className="flex w-full overflow-x-auto sm:grid sm:grid-cols-4 sm:overflow-visible">
            <TabsTrigger value="apps" className="gap-1 text-xs sm:text-sm px-2 sm:px-3 whitespace-nowrap flex-shrink-0 sm:flex-shrink">
              <Cpu className="h-3.5 w-3.5 shrink-0" /> Приложения ({projects.filter((p) => p.category === "app").length})
            </TabsTrigger>
            <TabsTrigger value="workshops" className="gap-1 text-xs sm:text-sm px-2 sm:px-3 whitespace-nowrap flex-shrink-0 sm:flex-shrink">
              <GraduationCap className="h-3.5 w-3.5 shrink-0" /> Воркшопы ({workshops.length})
            </TabsTrigger>
            <TabsTrigger value="notebooks" className="gap-1 text-xs sm:text-sm px-2 sm:px-3 whitespace-nowrap flex-shrink-0 sm:flex-shrink">
              <BookOpen className="h-3.5 w-3.5 shrink-0" /> Ноутбуки ({notebooks.length})
            </TabsTrigger>
            <TabsTrigger value="explorer" className="gap-1 text-xs sm:text-sm px-2 sm:px-3 whitespace-nowrap flex-shrink-0 sm:flex-shrink">
              <Brain className="h-3.5 w-3.5 shrink-0" /> Explorer
            </TabsTrigger>
          </TabsList>

          {/* Apps tab */}
          <TabsContent value="apps" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              <span className="text-xs sm:text-sm text-muted-foreground">Фильтр:</span>
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
                  className="text-[10px] sm:text-xs h-6 sm:h-7 px-2 sm:px-3"
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                </Button>
              ))}
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {workshops.map((w) => (
                <WorkshopCard key={w.id} workshop={w} />
              ))}
            </div>
          </TabsContent>

          {/* Notebooks tab */}
          <TabsContent value="notebooks" className="space-y-4">
            {/* Category filter */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 items-center">
              <span className="text-xs sm:text-sm text-muted-foreground mr-0.5">Кат:</span>
              {[
                { key: "all", label: "Все", labelShort: "Все" },
                { key: "rag", label: "RAG", labelShort: "RAG" },
                { key: "agents", label: "Агенты", labelShort: "Аг." },
                { key: "database", label: "БД", labelShort: "БД" },
                { key: "analytics", label: "Аналитика", labelShort: "Ан." },
                { key: "multimodal", label: "Мультимодальный", labelShort: "Мульт." },
                { key: "multicloud", label: "Мультиоблако", labelShort: "Обл." },
              ].map((cat) => (
                <Button
                  key={cat.key}
                  variant={notebookFilter === cat.key ? "default" : "outline"}
                  size="sm"
                  className="text-[10px] sm:text-xs h-6 sm:h-7 px-1.5 sm:px-3"
                  onClick={() => setNotebookFilter(cat.key)}
                >
                  <span className="hidden sm:inline">{cat.label}</span>
                  <span className="sm:hidden">{cat.labelShort}</span>
                  <span className="ml-0.5 sm:ml-1 opacity-60">
                    {cat.key === "all"
                      ? notebooks.length
                      : notebooks.filter((n) => n.category === cat.key).length}
                  </span>
                </Button>
              ))}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground mb-2">
              Нажмите на название ноутбука или кнопку «Colab», чтобы запустить его в Google Colab
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {notebooks
                .filter((nb) => notebookFilter === "all" || nb.category === notebookFilter)
                .map((nb) => (
                  <NotebookCard key={nb.id} notebook={nb} />
                ))}
            </div>
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
