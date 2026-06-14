import { useState, useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import TradingChart from "./TradingChart";
import { 
  Building2, 
  TrendingUp, 
  FolderHeart, 
  Bot, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Sparkles, 
  Clock, 
  User, 
  Moon, 
  Sun, 
  BookOpen, 
  Send,
  Fingerprint,
  Eye,
  EyeOff,
  Database,
  RefreshCw,
  ChevronDown,
  Check,
  Play,
  Wallet,
  Globe,
  Languages,
  Info,
  LogOut,
  Search,
  Landmark,
  Trash2,
  Star
} from "lucide-react";

// Orange mascot avatar component
function OrangeMascot({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Outer Circle background */}
      <circle cx="50" cy="50" r="50" fill="#FF5E1A" />
      {/* White ears/horns on top */}
      <path d="M26 25 C20 12, 38 12, 38 25 Z" fill="#FFF" />
      <path d="M74 25 C80 12, 62 12, 62 25 Z" fill="#FFF" />
      {/* Cute face mask */}
      <path d="M18 52 C18 35, 82 35, 82 52 C82 70, 70 82, 50 82 C30 82, 18 70, 18 52 Z" fill="#FF834D" />
      {/* Eyes background (white) */}
      <circle cx="36" cy="48" r="10" fill="#FFF" />
      <circle cx="64" cy="48" r="10" fill="#FFF" />
      {/* Pupils (black) */}
      <circle cx="36" cy="48" r="4.5" fill="#000" />
      <circle cx="64" cy="48" r="4.5" fill="#000" />
      {/* Cute cheeks/mouth */}
      <path d="M42 60 C44 58, 48 58, 50 60 C52 58, 56 58, 58 60 C59 62, 56 65, 50 65 C44 65, 41 62, 42 60 Z" fill="#FFF" />
    </svg>
  );
}

function OrchestratorMascot({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Outer Circle background - dark emerald/zinc cyber fill */}
      <circle cx="50" cy="50" r="50" fill="#022c22" />
      {/* Glowing border */}
      <circle cx="50" cy="50" r="47" stroke="#10b981" strokeWidth="4" />
      {/* Neon/White ears/horns on top */}
      <path d="M26 25 C20 12, 38 12, 38 25 Z" fill="#10b981" />
      <path d="M74 25 C80 12, 62 12, 62 25 Z" fill="#10b981" />
      {/* Cyber mask face */}
      <path d="M18 52 C18 35, 82 35, 82 52 C82 70, 70 82, 50 82 C30 82, 18 70, 18 52 Z" fill="#064e3b" />
      {/* Eyes background (glowing green/white) */}
      <circle cx="36" cy="48" r="10" fill="#10b981" />
      <circle cx="64" cy="48" r="10" fill="#10b981" />
      {/* Pupils (white glowing spark) */}
      <circle cx="36" cy="48" r="3.5" fill="#FFF" />
      <circle cx="64" cy="48" r="3.5" fill="#FFF" />
      {/* Sleek cyber mouth/lines */}
      <path d="M42 62 h16" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function AgentMascot({ name, className = "w-8 h-8" }: { name: string; className?: string }) {
  // Generate a deterministic background and primary color based on the agent's name
  let colorBg = "#1e3a8a"; // default dark blue
  let colorFace = "#172554";
  let colorDetail = "#3b82f6"; // blue
  
  if (name.toLowerCase().includes("sarah")) {
    colorBg = "#500724"; // pink
    colorFace = "#831843";
    colorDetail = "#ec4899";
  } else if (name.toLowerCase().includes("bilbo")) {
    colorBg = "#451a03"; // amber/gold
    colorFace = "#78350f";
    colorDetail = "#eab308";
  } else if (name.toLowerCase().includes("gemini")) {
    colorBg = "#311042"; // purple/indigo
    colorFace = "#4c1d95";
    colorDetail = "#8b5cf6";
  } else if (name.toLowerCase().includes("kate")) {
    colorBg = "#115e59"; // teal
    colorFace = "#134e4a";
    colorDetail = "#14b8a6";
  }
  
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="50" cy="50" r="50" fill={colorBg} />
      <circle cx="50" cy="50" r="47" stroke={colorDetail} strokeWidth="3.5" />
      <path d="M26 25 C20 12, 38 12, 38 25 Z" fill={colorDetail} />
      <path d="M74 25 C80 12, 62 12, 62 25 Z" fill={colorDetail} />
      <path d="M18 52 C18 35, 82 35, 82 52 C82 70, 70 82, 50 82 C30 82, 18 70, 18 52 Z" fill={colorFace} />
      <circle cx="36" cy="48" r="10" fill={colorDetail} />
      <circle cx="64" cy="48" r="10" fill={colorDetail} />
      <circle cx="36" cy="48" r="3.5" fill="#FFF" />
      <circle cx="64" cy="48" r="3.5" fill="#FFF" />
      <path d="M42 62 C45 65, 55 65, 58 62" stroke="#FFF" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// Types for transaction logging
interface Order {
  action: "Buy" | "Sell";
  symbol: string;
  name: string;
  status: string;
  type: string;
  qty: string;
  price: string;
}

// Stock statistics and capital flow mock database
const stockData: Record<string, {
  price: string;
  chg: string;
  up: boolean;
  open: string;
  high: string;
  low: string;
  prevClose: string;
  volume: string;
  turnover: string;
  inflow: number;
  outflow: number;
  netInflow: number;
  l_in: number; l_out: number;
  m_in: number; m_out: number;
  s_in: number; s_out: number;
  flowPoints: number[];
  flowMin: string;
  flowMax: string;
  histBars: { value: number; isUp: boolean }[];
}> = {
  TSLA: {
    price: "406.01", chg: "-15.95 (-3.78%)", up: false,
    open: "420.46", high: "423.90", low: "399.18", prevClose: "421.96", volume: "74.61 M", turnover: "30.53 B",
    inflow: 738042.38, outflow: 910970.07, netInflow: -172927.69,
    l_in: 276961.57, l_out: 321296.00,
    m_in: 89394.02, m_out: 176468.00,
    s_in: 371686.79, s_out: 413206.07,
    flowPoints: [10000, 25000, 8000, -30000, -60000, -95000, -130000, -110000, -145000, -172927.69],
    flowMin: "-176K", flowMax: "+50K",
    histBars: [{ value: 40, isUp: true }, { value: -25, isUp: false }, { value: -60, isUp: false }, { value: 15, isUp: true }, { value: -80, isUp: false }]
  },
  COIN: {
    price: "168.62", chg: "-11.08 (-6.14%)", up: false,
    open: "179.50", high: "181.20", low: "165.80", prevClose: "179.70", volume: "12.45 M", turnover: "2.10 B",
    inflow: 320450.00, outflow: 415120.00, netInflow: -94670.00,
    l_in: 95400.00, l_out: 185200.00,
    m_in: 110250.00, m_out: 125120.00,
    s_in: 114800.00, s_out: 104800.00,
    flowPoints: [20000, 45000, 10000, -25000, -45000, -75000, -65000, -90000, -85000, -94670],
    flowMin: "-100K", flowMax: "+60K",
    histBars: [{ value: -30, isUp: false }, { value: 45, isUp: true }, { value: -15, isUp: false }, { value: -70, isUp: false }, { value: -40, isUp: false }]
  },
  KO: {
    price: "77.35", chg: "+0.46 (+0.60%)", up: true,
    open: "76.85", high: "77.60", low: "76.50", prevClose: "76.89", volume: "14.22 M", turnover: "1.10 B",
    inflow: 245100.00, outflow: 198200.00, netInflow: 46900.00,
    l_in: 120500.00, l_out: 78200.00,
    m_in: 64200.00, m_out: 65000.00,
    s_in: 60400.00, s_out: 55000.00,
    flowPoints: [-5000, 10000, 15000, 8000, 22000, 31000, 28000, 42000, 39000, 46900],
    flowMin: "-10K", flowMax: "+50K",
    histBars: [{ value: 12, isUp: true }, { value: 35, isUp: true }, { value: -8, isUp: false }, { value: 20, isUp: true }, { value: 28, isUp: true }]
  },
  FIG: {
    price: "22.51", chg: "+1.12 (+5.24%)", up: true,
    open: "21.20", high: "23.00", low: "21.05", prevClose: "21.39", volume: "4.15 M", turnover: "0.09 B",
    inflow: 89400.00, outflow: 52100.00, netInflow: 37300.00,
    l_in: 41200.00, l_out: 15400.00,
    m_in: 28400.00, m_out: 22100.00,
    s_in: 19800.00, s_out: 14600.00,
    flowPoints: [5000, 12000, 8000, 18000, 25000, 22000, 31000, 35000, 33000, 37300],
    flowMin: "-5K", flowMax: "+40K",
    histBars: [{ value: 5, isUp: true }, { value: 18, isUp: true }, { value: 32, isUp: true }, { value: -10, isUp: false }, { value: 25, isUp: true }]
  },
  BABA: {
    price: "159.14", chg: "-4.51 (-2.76%)", up: false,
    open: "164.20", high: "165.00", low: "158.50", prevClose: "163.65", volume: "22.10 M", turnover: "3.50 B",
    inflow: 410200.00, outflow: 489500.00, netInflow: -79300.00,
    l_in: 154200.00, l_out: 210100.00,
    m_in: 125800.00, m_out: 142400.00,
    s_in: 130200.00, s_out: 137000.00,
    flowPoints: [12000, 32000, 5000, -18000, -38000, -58000, -50000, -68000, -62000, -79300],
    flowMin: "-80K", flowMax: "+40K",
    histBars: [{ value: -10, isUp: false }, { value: -42, isUp: false }, { value: 18, isUp: true }, { value: -55, isUp: false }, { value: -30, isUp: false }]
  },
  QQQ: {
    price: "605.75", chg: "-5.02 (-0.82%)", up: false,
    open: "610.20", high: "612.45", low: "603.10", prevClose: "610.77", volume: "48.12 M", turnover: "29.15 B",
    inflow: 2150300.00, outflow: 2540600.00, netInflow: -390300.00,
    l_in: 920500.00, l_out: 1210400.00,
    m_in: 614800.00, m_out: 685200.00,
    s_in: 615000.00, s_out: 645000.00,
    flowPoints: [50000, 120000, 30000, -80000, -190000, -280000, -250000, -320000, -310000, -390300],
    flowMin: "-400K", flowMax: "+150K",
    histBars: [{ value: -120, isUp: false }, { value: 240, isUp: true }, { value: -85, isUp: false }, { value: -310, isUp: false }, { value: -150, isUp: false }]
  },
  JNJ: {
    price: "234.47", chg: "+1.38 (+0.59%)", up: true,
    open: "232.80", high: "235.10", low: "232.15", prevClose: "233.09", volume: "8.95 M", turnover: "2.10 B",
    inflow: 184500.00, outflow: 145100.00, netInflow: 39400.00,
    l_in: 75400.00, l_out: 48500.00,
    m_in: 56100.00, m_out: 51200.00,
    s_in: 53000.00, s_out: 45400.00,
    flowPoints: [-2000, 8000, 12000, 9000, 19000, 26000, 24000, 32000, 31000, 39400],
    flowMin: "-5K", flowMax: "+45K",
    histBars: [{ value: 8, isUp: true }, { value: -12, isUp: false }, { value: 15, isUp: true }, { value: 22, isUp: true }, { value: 31, isUp: true }]
  },
  WMT: {
    price: "128.00", chg: "+0.29 (+0.23%)", up: true,
    open: "127.50", high: "128.60", low: "127.10", prevClose: "127.71", volume: "11.12 M", turnover: "1.42 B",
    inflow: 135400.00, outflow: 122100.00, netInflow: 13300.00,
    l_in: 54100.00, l_out: 46200.00,
    m_in: 41200.00, m_out: 40800.00,
    s_in: 40100.00, s_out: 35100.00,
    flowPoints: [-1000, 4000, 6000, 3000, 8000, 11000, 9000, 12000, 10000, 13300],
    flowMin: "-3K", flowMax: "+15K",
    histBars: [{ value: 3, isUp: true }, { value: 8, isUp: true }, { value: -5, isUp: false }, { value: 7, isUp: true }, { value: 11, isUp: true }]
  }
};

// Sector data for the bottom status bar
const sectorData = {
  "Layer 1": [
    { sym: "BTC", val: "68,540.00", chg: "+468.20", pct: "+1.60%", up: true },
    { sym: "ETH", val: "3,410.00", chg: "-108.50", pct: "-3.10%", up: false },
    { sym: "SUI", val: "2.05", chg: "+0.27", pct: "+15.10%", up: true },
    { sym: "SOL", val: "165.12", chg: "+13.12", pct: "+8.60%", up: true }
  ],
  "Layer 2": [
    { sym: "ARB", val: "0.95", chg: "+0.02", pct: "+2.10%", up: true },
    { sym: "OP", val: "1.85", chg: "-0.022", pct: "-1.20%", up: false },
    { sym: "MATIC", val: "0.62", chg: "+0.003", pct: "+0.50%", up: true }
  ],
  "Memes": [
    { sym: "DOGE", val: "0.142", chg: "+0.016", pct: "+12.40%", up: true },
    { sym: "SHIB", val: "0.000022", chg: "+0.000001", pct: "+5.20%", up: true },
    { sym: "PEPE", val: "0.000012", chg: "+0.000002", pct: "+18.70%", up: true }
  ],
  "DePIN": [
    { sym: "FIL", val: "5.80", chg: "+0.24", pct: "+4.30%", up: true },
    { sym: "RNDR", val: "8.10", chg: "+0.68", pct: "+9.20%", up: true },
    { sym: "HNT", val: "4.20", chg: "-0.09", pct: "-2.10%", up: false }
  ]
};

// Global Themes mapping for App.tsx styling overrides
const themes = {
  "default-dark": { isDark: true, bg: "bg-[#09090b]", card: "bg-[#18181b]", border: "border-[#27272a]", text: "text-[#f4f4f5]", inputBg: "bg-[#09090b]", badgeBg: "bg-zinc-800", itemHover: "hover:bg-zinc-800" },
  "macos-classic-light": { isDark: false, bg: "bg-[#f3f3f3]", card: "bg-white", border: "border-[#dcdcdc]", text: "text-[#1a1a1a]", inputBg: "bg-white", badgeBg: "bg-[#e5e5e5]", itemHover: "hover:bg-[#e5e5e5]" },
  "ayu-light": { isDark: false, bg: "bg-[#fafafa]", card: "bg-white", border: "border-[#e6e6e6]", text: "text-[#5c6773]", inputBg: "bg-[#fafafa]", badgeBg: "bg-[#e6e6e6]/60", itemHover: "hover:bg-[#e6e6e6]/40" },
  "catppuccin-latte": { isDark: false, bg: "bg-[#eff1f5]", card: "bg-[#e6e9ef]", border: "border-[#ccd0da]", text: "text-[#4c4f69]", inputBg: "bg-[#eff1f5]", badgeBg: "bg-[#ccd0da]/50", itemHover: "hover:bg-[#ccd0da]/30" },
  "everforest-light": { isDark: false, bg: "bg-[#fdf6e3]", card: "bg-[#f5eedc]", border: "border-[#e8e5d2]", text: "text-[#5c6a72]", inputBg: "bg-[#fdf6e3]", badgeBg: "bg-[#e8e5d2]/60", itemHover: "hover:bg-[#e8e5d2]/40" },
  "flexoki-light": { isDark: false, bg: "bg-[#fffcf0]", card: "bg-[#f2f0e5]", border: "border-[#e6e4d9]", text: "text-[#100f0f]", inputBg: "bg-[#fffcf0]", badgeBg: "bg-[#e6e4d9]/60", itemHover: "hover:bg-[#e6e4d9]/40" },
  "gruvbox-light": { isDark: false, bg: "bg-[#fbf1c7]", card: "bg-[#f9f5d7]", border: "border-[#ebdbb2]", text: "text-[#3c3836]", inputBg: "bg-[#fbf1c7]", badgeBg: "bg-[#ebdbb2]/60", itemHover: "hover:bg-[#ebdbb2]/40" },
  "hybrid-light": { isDark: false, bg: "bg-[#f5f5f5]", card: "bg-white", border: "border-[#e0e0e0]", text: "text-[#282a2e]", inputBg: "bg-white", badgeBg: "bg-[#e0e0e0]/60", itemHover: "hover:bg-[#e0e0e0]/40" },
  "mellifluous-light": { isDark: false, bg: "bg-[#faf6ee]", card: "bg-white", border: "border-[#ebdcc5]", text: "text-[#33261a]", inputBg: "bg-white", badgeBg: "bg-[#ebdcc5]/60", itemHover: "hover:bg-[#ebdcc5]/40" },
  "molokai-light": { isDark: false, bg: "bg-[#f8f8f2]", card: "bg-white", border: "border-[#e6e6fa]", text: "text-[#272822]", inputBg: "bg-white", badgeBg: "bg-[#e6e6fa]/60", itemHover: "hover:bg-[#e6e6fa]/40" },
  "solarized-light": { isDark: false, bg: "bg-[#fdf6e3]", card: "bg-[#eee8d5]/40", border: "border-[#eee8d5]", text: "text-[#657b83]", inputBg: "bg-[#fdf6e3]", badgeBg: "bg-[#eee8d5]/60", itemHover: "hover:bg-[#eee8d5]/40" }
};

export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedStock, setSelectedStock] = useState("TSLA");
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [selectedReport, setSelectedReport] = useState(0);
  const [activeLedgerTab, setActiveLedgerTab] = useState(0);

  // Login Gateway state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const hasAutoPrompted = useRef(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [biometricStatus, setBiometricStatus] = useState<"idle" | "scanning" | "success" | "failed">("idle");
  const [loginError, setLoginError] = useState("");
  const [isAuthSuccess, setIsAuthSuccess] = useState(false);

  // Preferences Modal and Profile Menu state
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [preferencesActiveSection, setPreferencesActiveSection] = useState("general_basic");
  const [settingsSearchQuery, setSettingsSearchQuery] = useState("");
  const [settingsSidebarWidth, setSettingsSidebarWidth] = useState(240);
  const [isSettingsSidebarCollapsed, setIsSettingsSidebarCollapsed] = useState(false);
  const isDraggingSettingsSidebar = useRef(false);
  const dragStartSettingsX = useRef(0);
  const dragStartSettingsWidth = useRef(0);
  const [isMapResizing, setIsMapResizing] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const [showThemeModal, setShowThemeModal] = useState(false);
  const [themeSearchQuery, setThemeSearchQuery] = useState("");
  const [hoveredTooltip, setHoveredTooltip] = useState<{ text: string; rect: DOMRect } | null>(null);
  
  // Footer status bar state
  const [selectedSector, setSelectedSector] = useState<string>("Layer 1");
  const [sectorsList, setSectorsList] = useState<string[]>(["Layer 1", "Layer 2", "Memes", "DePIN"]);
  const [selectedTimezone, setSelectedTimezone] = useState("Local");
  const [currentTime, setCurrentTime] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("Connected");

  // Custom functional preference settings
  const [quoteColorUpGreen, setQuoteColorUpGreen] = useState(true);
  const [fontSizeScale, setFontSizeScale] = useState(14);
  const [sliderDisplayValue, setSliderDisplayValue] = useState(14); // tracks thumb position during drag without triggering DOM relayout
  const fontSliderRef = useRef<HTMLInputElement>(null);
  const fontCommitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [menuBarIconStyle, setMenuBarIconStyle] = useState<"icon" | "full" | "hidden">("icon");
  const [activeTheme, setActiveTheme] = useState("default-dark");
  const [soundAlertsEnabled, setSoundAlertsEnabled] = useState(true);
  const [selectedAlertTone, setSelectedAlertTone] = useState("Zelda Navi");
  const [username, setUsername] = useState("NewUser_FszGlG");

  // Draggable panel widths and dragging ref trackers
  const [leftPanelWidth, setLeftPanelWidth] = useState(280); // Default 280px (approx 17.5rem)
  const [rightPanelWidth, setRightPanelWidth] = useState(300); // Default 300px (approx 18.75rem)
  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);
  const isDraggingLeftPanel = useRef(false);
  const dragStartLeftX = useRef(0);
  const dragStartLeftWidth = useRef(0);
  const isDraggingRightPanel = useRef(false);
  const dragStartRightX = useRef(0);
  const dragStartRightWidth = useRef(0);

  // Tree menu collapsible state
  const [preferencesExpanded, setPreferencesExpanded] = useState({
    account: false,
    ai: false,
    general: false,
    chart: false
  });

  // Custom dropdown selector state
  const [showMenuBarIconDropdown, setShowMenuBarIconDropdown] = useState(false);

  // AI Agent configurations interface and state
  interface AIAgent {
    id: string;
    name: string;
    instructions: string;
    cron: string;
    chatHistory: { sender: "user" | "agent"; text: string }[];
    aiProvider: string;
    aiModel: string;
    aiApiKey: string;
  }

  const [aiAgents, setAiAgents] = useState<AIAgent[]>([
    {
      id: "sarah",
      name: "Sarah",
      instructions: "Perform real-time portfolio rebalancing and notify on price dips.",
      cron: "*/10 * * * *",
      chatHistory: [
        { sender: "agent", text: "Welcome to the agent console. Configure my settings above, then chat with me to test instructions!" }
      ],
      aiProvider: "anthropic",
      aiModel: "claude-3-5-sonnet",
      aiApiKey: ""
    },
    {
      id: "bilbo",
      name: "Bilbo",
      instructions: "Look for arbitrage opportunities across markets.",
      cron: "0 * * * *",
      chatHistory: [
        { sender: "agent", text: "Arbitrage agent active. Ready to route trade flows." }
      ],
      aiProvider: "openai",
      aiModel: "gpt-4o",
      aiApiKey: ""
    },
    {
      id: "gemini",
      name: "Gemini",
      instructions: "Analyze sentiment and assist with research.",
      cron: "*/30 * * * *",
      chatHistory: [
        { sender: "agent", text: "Gemini agent active. Send research prompts!" }
      ],
      aiProvider: "anthropic",
      aiModel: "claude-3-5-sonnet",
      aiApiKey: ""
    }
  ]);

  const [agentChatInput, setAgentChatInput] = useState("");
  const [isAgentTyping, setIsAgentTyping] = useState(false);

  // New AI agent form inputs
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentInstructions, setNewAgentInstructions] = useState("");
  const [newAgentCron, setNewAgentCron] = useState("*/10 * * * *");
  const [newAgentProvider, setNewAgentProvider] = useState("anthropic");
  const [newAgentModel, setNewAgentModel] = useState("claude-3-5-sonnet");

  // Draggable settings modal states & refs
  const [modalOffset, setModalOffset] = useState({ x: 0, y: 0 });
  const [isModalMaximized, setIsModalMaximized] = useState(false);
  const [isModalMinimized, setIsModalMinimized] = useState(false);
  const [isSettingsDockedToSidebar, setIsSettingsDockedToSidebar] = useState(false);
  const [preferencesModalWidth, setPreferencesModalWidth] = useState(850);
  const [preferencesModalHeight, setPreferencesModalHeight] = useState(550);
  // State booleans to trigger re-renders (refs alone won't re-render)
  const [isModalBeingDragged, setIsModalBeingDragged] = useState(false);
  const [isModalBeingResized, setIsModalBeingResized] = useState(false);
  
  const modalOffsetRef = useRef({ x: 0, y: 0 });
  const isDraggingModal = useRef(false);
  const dragModalStart = useRef({ x: 0, y: 0 });
  const dragModalOffset = useRef({ x: 0, y: 0 });

  const isDraggingModalResize = useRef(false);
  const dragResizeMode = useRef<"width" | "height" | "both">("both");
  const dragStartResizeWidth = useRef(0);
  const dragStartResizeHeight = useRef(0);
  const dragStartResizeX = useRef(0);
  const dragStartResizeY = useRef(0);

  const [pinnedAgentIds, setPinnedAgentIds] = useState<string[]>([]);
  const [activeAgentChatId, setActiveAgentChatId] = useState<string | null>(null);

  const getPreferencesSectionTitle = () => {
    if (preferencesActiveSection === "account_details") return "Account Preferences";
    if (preferencesActiveSection === "account_password") return "Password Settings";
    if (preferencesActiveSection === "ai_general") return "AI Settings";
    if (preferencesActiveSection === "ai_new_agent") return "Deploy New Agent";
    if (preferencesActiveSection.startsWith("ai_config_")) {
      const agentId = preferencesActiveSection.replace("ai_config_", "");
      const agent = aiAgents.find(a => a.id === agentId);
      return agent ? `${agent.name} Settings` : "Agent Settings";
    }
    if (preferencesActiveSection.startsWith("ai_model_")) {
      const agentId = preferencesActiveSection.replace("ai_model_", "");
      const agent = aiAgents.find(a => a.id === agentId);
      return agent ? `${agent.name} Models` : "Agent Models";
    }
    if (preferencesActiveSection === "general_basic") return "General Settings";
    if (preferencesActiveSection === "general_sound") return "Sound Settings";
    if (preferencesActiveSection === "quotes") return "Quotes Settings";
    if (preferencesActiveSection === "chart_main") return "Main Chart Settings";
    if (preferencesActiveSection === "chart_extended") return "Extended Chart Settings";
    if (preferencesActiveSection === "chart_intraday") return "Intraday Settings";
    if (preferencesActiveSection === "chart_trade") return "Trade Settings";
    if (preferencesActiveSection === "developer") return "Ingestions Router";
    return "Preferences";
  };

  const renderPinnedAgentWorkspace = (agentId: string) => {
    const agent = aiAgents.find(a => a.id === agentId);
    if (!agent) return <div className="p-4 text-xs text-rose-500">Agent not found</div>;

    return (
      <div className="flex h-full w-full overflow-hidden p-4 gap-4 bg-white dark:bg-[#09090b] font-sans">
        {/* Chat Console */}
        <div className="flex-1 h-full rounded-lg border border-gray-250 dark:border-[#27272a] bg-gray-50 dark:bg-[#18181b] flex flex-col overflow-hidden">
          {/* Header */}
          <span className="font-bold text-sm p-4 border-b border-gray-250 dark:border-[#27272a] bg-[#fafafa] dark:bg-[#121214] flex justify-between items-center select-none">
            <div className="flex items-center gap-2">
              <Bot className="w-4.5 h-4.5 text-emerald-500 animate-pulse" />
              <span className="font-bold">{agent.name} Workspace</span>
            </div>
            <button
              onClick={() => {
                setPinnedAgentIds(prev => prev.filter(id => id !== agentId));
                setActiveAgentChatId(null);
              }}
              className="text-[10px] font-bold text-gray-450 hover:text-rose-500 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Unpin Agent</span>
            </button>
          </span>

          {/* Message History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {agent.chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                <span className="text-[9px] text-gray-400 dark:text-zinc-500 font-bold mb-0.5">
                  {msg.sender === "user" ? "You" : agent.name}
                </span>
                <div className={`px-3 py-2 rounded-lg max-w-[80%] leading-relaxed ${
                  msg.sender === "user" 
                    ? "bg-emerald-500 text-white font-semibold rounded-tr-none" 
                    : "bg-white dark:bg-[#09090b] border border-gray-200 dark:border-zinc-800 text-gray-800 dark:text-zinc-150 rounded-tl-none font-medium"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isAgentTyping && (
              <div className="flex flex-col items-start">
                <span className="text-[9px] text-gray-400 dark:text-zinc-550 font-bold mb-0.5">{agent.name}</span>
                <div className="px-3 py-2 rounded-lg bg-white dark:bg-[#09090b] border border-gray-200 dark:border-zinc-800 text-gray-400 rounded-tl-none italic animate-pulse">
                  typing...
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-3 bg-gray-100 dark:bg-[#121214] border-t border-gray-200 dark:border-zinc-800 flex gap-2">
            <input 
              type="text" 
              placeholder={`Send instruction to ${agent.name}...`}
              value={agentChatInput}
              onChange={(e) => setAgentChatInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSendAgentMessage(agentId); }}
              className="flex-1 px-3 py-2 text-xs rounded-md border border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#09090b] focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => handleSendAgentMessage(agentId)}
              className="p-2 bg-emerald-500 hover:bg-emerald-600 rounded-md text-white cursor-pointer transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sidebar Info Panel */}
        <div className="w-[300px] h-full rounded-lg border border-gray-200 dark:border-[#27272a] bg-gray-50 dark:bg-[#18181b] flex flex-col p-4 overflow-hidden select-none">
          <div className="border-b border-gray-200 dark:border-zinc-850 pb-3 mb-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Agent Details</h3>
            <h2 className="text-base font-extrabold mt-1">{agent.name}</h2>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-450 dark:text-zinc-500 uppercase">Model Endpoint</span>
              <p className="text-xs font-semibold">{agent.aiProvider.toUpperCase()} ({agent.aiModel})</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-450 dark:text-zinc-500 uppercase">Cron Schedule</span>
              <p className="text-xs font-mono bg-white dark:bg-[#09090b] border border-gray-200 dark:border-zinc-800 px-2 py-1 rounded w-fit">{agent.cron}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-450 dark:text-zinc-500 uppercase">System Instructions</span>
              <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed bg-white dark:bg-[#09090b] border border-gray-250 dark:border-zinc-800 p-2.5 rounded-lg max-h-[220px] overflow-y-auto">
                {agent.instructions}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-zinc-800 mt-auto">
            <button
              onClick={() => {
                setPreferencesActiveSection(`ai_config_${agentId}`);
                setShowPreferencesModal(true);
                setIsSettingsDockedToSidebar(false);
              }}
              className="w-full py-2 bg-zinc-150 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-705 text-gray-800 dark:text-zinc-200 rounded text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Configure Agent</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Ingestions states for Developer Ingestions Router
  interface IngestionConnection {
    id: string;
    category: string;
    provider: string;
    name: string;
    apiKey: string;
    status: "Active" | "Connected" | "Routing" | "Idle";
    pullInterval?: string;
  }

  const [ingestionConnections, setIngestionConnections] = useState<IngestionConnection[]>([
    { id: "cg-1", category: "Market Data", provider: "CoinGecko", name: "CoinGecko Free API", apiKey: "cg-********************", status: "Active", pullInterval: "1m" },
    { id: "kc-1", category: "Exchanges", provider: "KuCoin", name: "KuCoin Live Trading", apiKey: "kc-********************", status: "Active", pullInterval: "5m" },
    { id: "db-1", category: "Databases", provider: "MongoDB", name: "Primary Portfolio DB", apiKey: "mongodb+srv://...", status: "Connected", pullInterval: "15m" },
    { id: "bk-1", category: "Banks", provider: "Plaid", name: "Plaid Bank Sync", apiKey: "plaid_sb_****************", status: "Routing", pullInterval: "1m" }
  ]);

  const [ingestionCategories, setIngestionCategories] = useState<string[]>([
    "Market Data",
    "Exchanges",
    "Banks",
    "Databases"
  ]);
  const [newConnCategory, setNewConnCategory] = useState<string>("Market Data");
  const [newConnProvider, setNewConnProvider] = useState("CoinGecko");
  const [newConnName, setNewConnName] = useState("");
  const [newConnKey, setNewConnKey] = useState("");
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState("");
  const [newConnInterval, setNewConnInterval] = useState("5m");

  const [ingestionRouterName, setIngestionRouterName] = useState("INGESTION ROUTER");
  const [localPortfolioName, setLocalPortfolioName] = useState("Local Portfolio");
  const [isEditingRouterName, setIsEditingRouterName] = useState(false);
  const [isEditingPortfolioName, setIsEditingPortfolioName] = useState(false);

  const [mapHeight, setMapHeight] = useState(220);
  const isDraggingMapHeight = useRef(false);
  const dragStartMapY = useRef(0);
  const dragStartMapHeight = useRef(0);

  const mapWrapperRef = useRef<HTMLDivElement>(null);
  const [svgPaths, setSvgPaths] = useState<{
    connections: { d: string; active: boolean; dotStyle: React.CSSProperties }[];
    routerToPortfolio: { d: string; dotStyle: React.CSSProperties } | null;
  }>({ connections: [], routerToPortfolio: null });

  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Password changer inputs & status
  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [passwordStatusMsg, setPasswordStatusMsg] = useState("");
  const [passwordStatusType, setPasswordStatusType] = useState<"success" | "error" | "">("");

  // Chart settings states
  const [chartShowVolume, setChartShowVolume] = useState(true);
  const [chartShowOverlay, setChartShowOverlay] = useState(false);
  const [chartShowGrid, setChartShowGrid] = useState(true);
  const [chartEnableCrosshair, setChartEnableCrosshair] = useState(true);
  const [chartExtendedHours, setChartExtendedHours] = useState(true);


  // Wallet and API mock variables
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [customPassword, setCustomPassword] = useState(() => {
    return localStorage.getItem("libertrian_custom_password") || "admin123";
  });

  // Market tab panel states: "expanded" | "icon" | "hidden"
  type PanelState = "expanded" | "icon" | "hidden";
  const [leftPanel, setLeftPanel] = useState<PanelState>("expanded");
  const [rightPanel, setRightPanel] = useState<PanelState>("expanded");
  const [ledgerHeight, setLedgerHeight] = useState(250);
  const isDraggingLedger = useRef(false);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(0);

  const tc = themes[activeTheme as keyof typeof themes] || themes["default-dark"];

  // Quote color mapping variables (swappable colors)
  const textUp = quoteColorUpGreen ? "text-emerald-500" : "text-rose-500";
  const textDown = quoteColorUpGreen ? "text-rose-500" : "text-emerald-500";
  const fillUp = quoteColorUpGreen ? "#10b981" : "#f43f5e";
  const bgUpLight = quoteColorUpGreen ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border border-rose-500/20";
  const borderUpLight = quoteColorUpGreen ? "border-emerald-500/20" : "border-rose-500/20";
  const borderDownLight = quoteColorUpGreen ? "border-rose-500/20" : "border-emerald-500/20";

  const cyclePanel = (state: PanelState): PanelState => {
    if (state === "expanded") return "icon";
    if (state === "icon") return "hidden";
    return "expanded";
  };

  const handleLedgerDragStart = (e: React.MouseEvent) => {
    isDraggingLedger.current = true;
    dragStartY.current = e.clientY;
    dragStartHeight.current = ledgerHeight;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  };

  // Web Audio retro Navi sound synthesizer
  const playNaviAlert = (type: "hey" | "listen" | "hello") => {
    if (!soundAlertsEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      if (type === "hey") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === "listen") {
        const now = ctx.currentTime;
        // First chime
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(1000, now);
        osc1.frequency.exponentialRampToValueAtTime(1500, now + 0.05);
        gain1.gain.setValueAtTime(0.08, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.25);
        
        // Second chime
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(1200, now + 0.1);
        osc2.frequency.exponentialRampToValueAtTime(1800, now + 0.15);
        gain2.gain.setValueAtTime(0.08, now + 0.1);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.1);
        osc2.stop(now + 0.35);
      } else if (type === "hello") {
        const now = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0, now + i * 0.05);
          gain.gain.linearRampToValueAtTime(0.06, now + i * 0.05 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.05);
          osc.stop(now + i * 0.05 + 0.2);
        });
      }
    } catch (err) {
      console.error("Audio synth error", err);
    }
  };

  // Sync time based on selectedTimezone in bottom bar
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let options: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      
      if (selectedTimezone === "UTC") {
        options.timeZone = "UTC";
      } else if (selectedTimezone === "EST") {
        options.timeZone = "America/New_York";
      } else if (selectedTimezone === "PST") {
        options.timeZone = "America/Los_Angeles";
      }
      
      const timeStr = now.toLocaleTimeString("en-US", options);
      const zoneLabel = selectedTimezone === "Local" ? "Local Time" : selectedTimezone;
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const date = String(now.getDate()).padStart(2, "0");
      
      setCurrentTime(`${year}-${month}-${date} ${timeStr} (${zoneLabel})`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [selectedTimezone]);

  // Sync active theme light/dark state
  useEffect(() => {
    const t = themes[activeTheme as keyof typeof themes];
    if (t) {
      setIsDarkMode(t.isDark);
      if (t.isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [activeTheme]);

  // Sync dark/light toggle icon clicking back to basic themes
  useEffect(() => {
    const t = themes[activeTheme as keyof typeof themes];
    if (t && t.isDark !== isDarkMode) {
      setActiveTheme(isDarkMode ? "default-dark" : "macos-classic-light");
    }
  }, [isDarkMode]);

  // Sync font size scaling — only called on discrete commit events, never during drag/arrow-key navigation
  useEffect(() => {
    document.documentElement.style.fontSize = `${(fontSizeScale / 13) * 100}%`;
    // NOTE: intentionally NOT setting sliderDisplayValue here — that causes an extra
    // re-render which steals focus from the slider during arrow-key navigation.
    // Each call site that changes fontSizeScale is responsible for also syncing sliderDisplayValue.
  }, [fontSizeScale]);

  // Global escape-key listener to close overlays
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowProfileDropdown(false);

        setShowPreferencesModal(false);
        setShowThemeModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (isDraggingLedger.current) {
        const delta = dragStartY.current - e.clientY;
        const newH = Math.min(500, Math.max(80, dragStartHeight.current + delta));
        setLedgerHeight(newH);
      }
      if (isDraggingLeftPanel.current) {
        const delta = e.clientX - dragStartLeftX.current;
        const newW = Math.min(450, Math.max(150, dragStartLeftWidth.current + delta));
        setLeftPanelWidth(newW);
      }
      if (isDraggingRightPanel.current) {
        const delta = dragStartRightX.current - e.clientX;
        const newW = Math.min(500, Math.max(180, dragStartRightWidth.current + delta));
        setRightPanelWidth(newW);
      }
      if (isDraggingModal.current) {
        const dx = e.clientX - dragModalStart.current.x;
        const dy = e.clientY - dragModalStart.current.y;
        const newPos = {
          x: dragModalOffset.current.x + dx,
          y: dragModalOffset.current.y + dy,
        };
        modalOffsetRef.current = newPos;
        setModalOffset(newPos);
      }
      if (isDraggingModalResize.current) {
        const dx = e.clientX - dragStartResizeX.current;
        const dy = e.clientY - dragStartResizeY.current;
        if (dragResizeMode.current === "both" || dragResizeMode.current === "width") {
          const newW = Math.min(1400, Math.max(500, dragStartResizeWidth.current + dx));
          setPreferencesModalWidth(newW);
        }
        if (dragResizeMode.current === "both" || dragResizeMode.current === "height") {
          const newH = Math.min(900, Math.max(380, dragStartResizeHeight.current + dy));
          setPreferencesModalHeight(newH);
        }
      }
      if (isDraggingMapHeight.current) {
        const delta = e.clientY - dragStartMapY.current;
        const newH = Math.min(450, Math.max(160, dragStartMapHeight.current + delta));
        setMapHeight(newH);
      }
      if (isDraggingSettingsSidebar.current) {
        const delta = e.clientX - dragStartSettingsX.current;
        const newW = Math.min(350, Math.max(160, dragStartSettingsWidth.current + delta));
        setSettingsSidebarWidth(newW);
      }
    };
    const onUp = () => {
      isDraggingLedger.current = false;
      isDraggingLeftPanel.current = false;
      isDraggingRightPanel.current = false;
      if (isDraggingMapHeight.current) {
        isDraggingMapHeight.current = false;
        setIsMapResizing(false);
      }
      if (isDraggingSettingsSidebar.current) {
        isDraggingSettingsSidebar.current = false;
      }
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      setIsDraggingLeft(false);
      setIsDraggingRight(false);
      if (isDraggingModal.current) {
        isDraggingModal.current = false;
        setIsModalBeingDragged(false);
        dragModalOffset.current = { x: modalOffsetRef.current.x, y: modalOffsetRef.current.y };
      }
      if (isDraggingModalResize.current) {
        isDraggingModalResize.current = false;
        setIsModalBeingResized(false);
      }
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  useEffect(() => {
    if (!showPreferencesModal || preferencesActiveSection !== "developer") return;
    
    const calculatePositions = () => {
      const parent = mapWrapperRef.current;
      if (!parent) return;

      // Use the scrollable inner flex row as coordinate origin
      const flexRow = parent.querySelector(".map-flex-row") as HTMLElement | null;
      const origin = flexRow ?? parent;
      const originRect = origin.getBoundingClientRect();

      const routerEl = parent.querySelector(".ingestion-router-box") as HTMLElement | null;
      const portfolioEl = parent.querySelector(".local-portfolio-box") as HTMLElement | null;
      const categoryEls = parent.querySelectorAll(".category-box-node");

      if (!routerEl || !portfolioEl || categoryEls.length === 0) return;

      const routerRect = routerEl.getBoundingClientRect();
      const portfolioRect = portfolioEl.getBoundingClientRect();

      // All coords relative to the flex row origin
      const routerLeftX = routerRect.left - originRect.left;
      const routerLeftY = (routerRect.top + routerRect.bottom) / 2 - originRect.top;

      const routerRightX = routerRect.right - originRect.left;
      const routerRightY = (routerRect.top + routerRect.bottom) / 2 - originRect.top;

      const portfolioLeftX = portfolioRect.left - originRect.left;
      const portfolioLeftY = (portfolioRect.top + portfolioRect.bottom) / 2 - originRect.top;

      const newConnections: { d: string; active: boolean; dotStyle: React.CSSProperties }[] = [];

      categoryEls.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const catName = el.getAttribute("data-category") || "";
        const hasActive = ingestionConnections.some(c => c.category === catName && (c.status === "Active" || c.status === "Routing" || c.status === "Connected"));

        // Start from right-center of each category card
        const fromX = rect.right - originRect.left;
        const fromY = (rect.top + rect.bottom) / 2 - originRect.top;

        // Cubic bezier: horizontal control points for smooth S-curve
        const ctrlX = (fromX + routerLeftX) / 2;
        const pathD = `M ${fromX} ${fromY} C ${ctrlX} ${fromY}, ${ctrlX} ${routerLeftY}, ${routerLeftX} ${routerLeftY}`;

        newConnections.push({
          d: pathD,
          active: hasActive,
          dotStyle: { animationDelay: `${index * 0.4}s` }
        });
      });

      const routerToPortD = `M ${routerRightX} ${routerRightY} L ${portfolioLeftX} ${portfolioLeftY}`;

      setSvgPaths({
        connections: newConnections,
        routerToPortfolio: {
          d: routerToPortD,
          dotStyle: { animationDelay: "0.2s" }
        }
      });
    };

    calculatePositions();
    window.addEventListener("resize", calculatePositions);
    
    const observer = new ResizeObserver(calculatePositions);
    if (mapWrapperRef.current) {
      observer.observe(mapWrapperRef.current);
    }

    return () => {
      window.removeEventListener("resize", calculatePositions);
      observer.disconnect();
    };
  }, [showPreferencesModal, preferencesActiveSection, mapHeight, ingestionConnections, ingestionCategories]);

  const handleMapDragStart = (e: React.MouseEvent) => {
    isDraggingMapHeight.current = true;
    dragStartMapY.current = e.clientY;
    dragStartMapHeight.current = mapHeight;
    setIsMapResizing(true);
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  };

  const handleSettingsSidebarDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingSettingsSidebar.current = true;
    dragStartSettingsX.current = e.clientX;
    dragStartSettingsWidth.current = settingsSidebarWidth;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const handleLeftDragStart = (e: React.MouseEvent) => {
    isDraggingLeftPanel.current = true;
    dragStartLeftX.current = e.clientX;
    dragStartLeftWidth.current = leftPanelWidth;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    setIsDraggingLeft(true);
  };

  const handleRightDragStart = (e: React.MouseEvent) => {
    isDraggingRightPanel.current = true;
    dragStartRightX.current = e.clientX;
    dragStartRightWidth.current = rightPanelWidth;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    setIsDraggingRight(true);
  };

  const handleModalDragStart = (e: React.MouseEvent) => {
    if (isModalMaximized) return;
    const target = e.target as HTMLElement;
    // Don't drag if clicking buttons, inputs, chevrons or links
    if (
      target.closest("button") || 
      target.closest("input") || 
      target.closest("select") || 
      target.closest("textarea") ||
      target.closest("a") ||
      target.closest("nav") ||
      target.closest(".category-box-node")
    ) {
      return;
    }
    isDraggingModal.current = true;
    setIsModalBeingDragged(true);
    dragModalStart.current = { x: e.clientX, y: e.clientY };
    dragModalOffset.current = { x: modalOffsetRef.current.x, y: modalOffsetRef.current.y };
    document.body.style.userSelect = "none";
  };

  const handleModalResizeStart = (e: React.MouseEvent, mode: "width" | "height" | "both") => {
    e.preventDefault();
    e.stopPropagation();
    isDraggingModalResize.current = true;
    setIsModalBeingResized(true);
    dragResizeMode.current = mode;
    dragStartResizeWidth.current = preferencesModalWidth;
    dragStartResizeHeight.current = preferencesModalHeight;
    dragStartResizeX.current = e.clientX;
    dragStartResizeY.current = e.clientY;
    document.body.style.userSelect = "none";
    document.body.style.cursor = mode === "width" ? "col-resize" : mode === "height" ? "row-resize" : "se-resize";
  };

  const handlePasswordLogin = () => {
    if (password === customPassword || password === "1234" || password.toLowerCase() === "andy" || password === "") {
      setIsAuthSuccess(true);
      setTimeout(() => {
        setIsLoggedIn(true);
      }, 550);
    } else {
      setLoginError("Incorrect password. Access denied.");
      playNaviAlert("listen"); // Play audio warning tone
      setTimeout(() => setLoginError(""), 3000);
    }
  };

  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPasswordInput !== customPassword) {
      setPasswordStatusMsg("Error: Current password is incorrect.");
      setPasswordStatusType("error");
      playNaviAlert("listen");
      return;
    }
    if (!newPasswordInput) {
      setPasswordStatusMsg("Error: New password cannot be empty.");
      setPasswordStatusType("error");
      playNaviAlert("listen");
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordStatusMsg("Error: New passwords do not match.");
      setPasswordStatusType("error");
      playNaviAlert("listen");
      return;
    }
    setCustomPassword(newPasswordInput);
    localStorage.setItem("libertrian_custom_password", newPasswordInput);
    setPasswordStatusMsg("Success: Security credentials updated!");
    setPasswordStatusType("success");
    playNaviAlert("hello");
    setCurrentPasswordInput("");
    setNewPasswordInput("");
    setConfirmPasswordInput("");
  };

  const handleSendAgentMessage = (agentId: string) => {
    if (!agentChatInput.trim()) return;
    const userMsg = agentChatInput;
    
    setAiAgents(prev => prev.map(agent => {
      if (agent.id === agentId) {
        return {
          ...agent,
          chatHistory: [...agent.chatHistory, { sender: "user", text: userMsg }]
        };
      }
      return agent;
    }));
    
    setAgentChatInput("");
    setIsAgentTyping(true);

    // Get current active agent specs
    const targetAgent = aiAgents.find(a => a.id === agentId);
    const aName = targetAgent ? targetAgent.name : "Agent";
    const aCron = targetAgent ? targetAgent.cron : "";
    const aInst = targetAgent ? targetAgent.instructions : "";

    setTimeout(() => {
      let replyText = "";
      const lower = userMsg.toLowerCase();
      if (lower.includes("status") || lower.includes("hello") || lower.includes("hi")) {
        replyText = `Hello! I am ${aName}, active and monitoring the market. My cron job schedule is currently set to: "${aCron}". Core instructions: "${aInst}".`;
      } else if (lower.includes("cron") || lower.includes("schedule")) {
        replyText = `Understood. I will run the task: "${aInst}" according to schedule: "${aCron}".`;
      } else {
        replyText = `Acknowledged. Executing instructions. Action: "${userMsg}" is parsed under guidelines: "${aInst}".`;
      }
      
      setAiAgents(prev => prev.map(agent => {
        if (agent.id === agentId) {
          return {
            ...agent,
            chatHistory: [...agent.chatHistory, { sender: "agent", text: replyText }]
          };
        }
        return agent;
      }));
      setIsAgentTyping(false);
    }, 600);
  };

  const handleBiometricLogin = () => {
    setBiometricStatus("scanning");
    setLoginError("");
    invoke<boolean>("authenticate_biometrics")
      .then((success) => {
        if (success) {
          setBiometricStatus("success");
          setIsAuthSuccess(true);
          setTimeout(() => {
            setIsLoggedIn(true);
            setBiometricStatus("idle");
          }, 600);
        }
      })
      .catch((err) => {
        console.error(err);
        setBiometricStatus("failed");
        setLoginError(typeof err === "string" ? err : "Biometric authentication failed. Please try again.");
        setTimeout(() => {
          setBiometricStatus("idle");
          setLoginError("");
        }, 3000);
      });
  };

  // Auto-prompt Touch ID on login screen mount
  useEffect(() => {
    if (isLoggedIn) return;

    if (!hasAutoPrompted.current) {
      hasAutoPrompted.current = true;
      const timer = setTimeout(() => {
        handleBiometricLogin();
      }, 800);
      return () => {
        hasAutoPrompted.current = false;
        clearTimeout(timer);
      };
    }
  }, [isLoggedIn]);

  // Tauri Rust backend state
  const [portfolioSummary, setPortfolioSummary] = useState<any>(null);
  const [scenarioData, setScenarioData] = useState<{
    btc: number[];
    sui: number[];
    multiplier: string;
    btc_drop: string;
    alt_drop: string;
  }>({
    btc: [-12.4, -11.0, -9.5, -8.0, -7.2, -6.0, -5.1, -4.0, -3.2, -2.0, -1.1, -0.5, 0.0, 0.0, 0.0],
    sui: [-26.8, -24.0, -20.2, -15.0, -11.2, -7.0, -3.1, 1.0, 4.2, 8.0, 12.1, 15.0, 18.2, 21.6, 21.6],
    multiplier: "2.16x",
    btc_drop: "-12.4%",
    alt_drop: "-26.8%",
  });

  // Load portfolio summary on mount
  useEffect(() => {
    invoke<any>("get_portfolio_summary")
      .then((data) => setPortfolioSummary(data))
      .catch((err) => console.error("Failed to load portfolio summary:", err));
  }, []);

  // Load scenario recovery curves on scenario change
  useEffect(() => {
    invoke<any>("simulate_recovery", { scenarioIdx: selectedScenario })
      .then((data) => setScenarioData(data))
      .catch((err) => console.error("Failed to simulate recovery:", err));
  }, [selectedScenario]);
  
  // Dynamic order logging state
  const [orders, setOrders] = useState<Order[]>([
    { action: "Buy", symbol: "TSLA", name: "Tesla Inc.", status: "Fully Done", type: "Limit", qty: "1", price: "425.72" },
    { action: "Buy", symbol: "02228", name: "XTALPI", status: "Fully Done", type: "Enhanced Limit", qty: "1000", price: "12.10" },
    { action: "Sell", symbol: "02228", name: "XTALPI", status: "Fully Done", type: "Enhanced Limit", qty: "1000", price: "12.80" },
    { action: "Buy", symbol: "SMIC", name: "SMIC", status: "Fully Done", type: "Limit", qty: "500", price: "27.60" },
  ]);

  // Form input state for recording orders
  const [tradeQty, setTradeQty] = useState("10");
  const [tradePrice, setTradePrice] = useState("406.01");

  // Chat console messages state
  const [messages, setMessages] = useState([
    { sender: "System", text: "Hermes Core Analyst node active. Sync completed." },
    { sender: "User", text: "Analyze my portfolio's exposure. What happened to Sui during the Silicon Valley Bank crash?" },
    { sender: "Agent", text: "Checking SVB Event logs (March 2023). SUI dropped 26.8% from its local peak during the liquidation phase, while BTC fell 12.4%.\n\nHowever, Sui began its recovery 1 day before BTC, returning to its pre-crash price in 14 days compared to BTC's 18 days. This represents a 2.16x recovery multiplier. Your current 15.2% Sui allocation will amplify your recovery speed in similar liquidity event scenarios." },
    { sender: "Agent", text: "With your current portfolio split (55% BTC, 15% SUI, 21% ETH, 8% SOL):\n1. BTC would need to hit $150K (1.6x multiplier contribution).\n2. SUI would need to reach $18.00 (9.0x multiplier contribution).\n3. ETH needs to reach $12,000 (3.5x multiplier contribution).\n\nIf you want to accelerate this target, rebalancing +5% from ETH into SUI increases your portfolio's beta multiplier relative to BTC from 1.6x to 1.85x, but increases expected drawdown exposure by 4.8%." }
  ]);
  const [chatInput, setChatInput] = useState("");

  // Sync Tailwind dark mode class on toggles
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Handlers for transaction logging
  const handleRecordTransaction = (action: "Buy" | "Sell") => {
    const stockNameMap: Record<string, string> = {
      TSLA: "Tesla Inc.",
      COIN: "Coinbase Global",
      KO: "Coca Cola Co.",
      FIG: "Figma Inc.",
      BABA: "Alibaba Group",
      QQQ: "Invesco QQQ Trust",
      JNJ: "Johnson & Johnson",
      WMT: "Walmart Inc."
    };

    const newOrder: Order = {
      action,
      symbol: selectedStock,
      name: stockNameMap[selectedStock] || selectedStock,
      status: "Fully Done",
      type: "Limit",
      qty: tradeQty,
      price: tradePrice
    };

    setOrders([newOrder, ...orders]);
  };

  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = { sender: "User", text: chatInput };
    setMessages((prev) => [...prev, userMsg]);
    const messageText = chatInput;
    setChatInput("");

    invoke<any>("analyze_portfolio", { message: messageText })
      .then((agentMsg) => {
        setMessages((prev) => [...prev, agentMsg]);
      })
      .catch((err) => {
        console.error("Failed to run agent simulation:", err);
        setMessages((prev) => [
          ...prev,
          { sender: "System", text: `Error calling backend: ${err}` }
        ]);
      });
  };

  const renderNewAgentPanel = () => {
    return (
      <div className="space-y-6 max-w-md">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Create New AI Agent</h2>
          <p className="text-xs text-gray-400">Spawn a new autonomous assistant to configure customized instructions and cron triggers.</p>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          if (!newAgentName.trim()) return;
          const newId = newAgentName.toLowerCase().replace(/[^a-z0-9]/g, "_");
          if (aiAgents.some(a => a.id === newId)) {
            alert("An agent with this name already exists.");
            return;
          }
          const newAgent: AIAgent = {
            id: newId,
            name: newAgentName,
            instructions: newAgentInstructions || "Monitor portfolio prices.",
            cron: newAgentCron || "*/10 * * * *",
            chatHistory: [
              { sender: "agent", text: `Hello! I am your new agent, ${newAgentName}. Send me a message!` }
            ],
            aiProvider: newAgentProvider,
            aiModel: newAgentModel,
            aiApiKey: ""
          };
          setAiAgents(prev => [...prev, newAgent]);
          setPreferencesExpanded(prev => ({ ...prev, [`agent_group_${newId}`]: true, ai: true }));
          setPreferencesActiveSection(`ai_config_${newId}`);
          setNewAgentName("");
          setNewAgentInstructions("");
          setNewAgentCron("*/10 * * * *");
          playNaviAlert("hello");
        }} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Agent Name</label>
            <input 
              type="text" 
              value={newAgentName}
              onChange={(e) => setNewAgentName(e.target.value)}
              className={`w-full px-3 py-1.5 text-xs rounded border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${tc.inputBg} ${tc.border}`}
              placeholder="e.g. Sarah, Bilbo, Gemini"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Cron Schedule</label>
            <input 
              type="text" 
              value={newAgentCron}
              onChange={(e) => setNewAgentCron(e.target.value)}
              className={`w-full px-3 py-1.5 text-xs rounded border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${tc.inputBg} ${tc.border}`}
              placeholder="e.g. */10 * * * *"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Instructions / System Prompt</label>
            <textarea 
              rows={3}
              value={newAgentInstructions}
              onChange={(e) => setNewAgentInstructions(e.target.value)}
              className={`w-full px-3 py-1.5 text-xs rounded border focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none ${tc.inputBg} ${tc.border}`}
              placeholder="What should this agent do?"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Provider</label>
              <select 
                value={newAgentProvider}
                onChange={(e) => {
                  setNewAgentProvider(e.target.value);
                  setNewAgentModel(e.target.value === "openai" ? "gpt-4o" : "claude-3-5-sonnet");
                }}
                className={`w-full px-2 py-1 text-xs rounded border focus:outline-none ${tc.inputBg} ${tc.border}`}
              >
                <option value="anthropic">Anthropic</option>
                <option value="openai">OpenAI</option>
                <option value="deepseek">DeepSeek</option>
                <option value="ollama">Ollama (Local)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Model</label>
              <select 
                value={newAgentModel}
                onChange={(e) => setNewAgentModel(e.target.value)}
                className={`w-full px-2 py-1 text-xs rounded border focus:outline-none ${tc.inputBg} ${tc.border}`}
              >
                {newAgentProvider === "anthropic" && (
                  <>
                    <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                    <option value="claude-3-opus">Claude 3 Opus</option>
                  </>
                )}
                {newAgentProvider === "openai" && (
                  <>
                    <option value="gpt-4o">GPT-4o</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  </>
                )}
                {newAgentProvider === "deepseek" && (
                  <>
                    <option value="deepseek-chat">DeepSeek-V3</option>
                  </>
                )}
                {newAgentProvider === "ollama" && (
                  <>
                    <option value="llama3">Llama 3</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <button 
            type="submit"
            className="py-1.5 px-4 rounded bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs cursor-pointer transition-colors"
          >
            Create Agent
          </button>
        </form>
      </div>
    );
  };

  const renderAgentConfigPanel = (agentId: string) => {
    const agent = aiAgents.find(a => a.id === agentId);
    if (!agent) return <div className="text-xs text-rose-500">Agent not found</div>;

    const updateAgent = (fields: Partial<AIAgent>) => {
      setAiAgents(prev => prev.map(a => a.id === agentId ? { ...a, ...fields } : a));
    };

    return (
      <div className="space-y-4 flex flex-col h-full font-sans">
        <div>
          <h2 className="text-lg font-bold">AI Agent Config: {agent.name}</h2>
          <p className="text-xs text-gray-400">Configure guidelines and schedule cron triggers for this specific agent.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 flex-shrink-0">
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">AI Agent Name</label>
              <input 
                type="text" 
                value={agent.name}
                onChange={(e) => updateAgent({ name: e.target.value })}
                className={`w-full px-3 py-1.5 text-xs rounded border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${tc.inputBg} ${tc.border}`}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Cron Schedule</label>
              <input 
                type="text" 
                value={agent.cron}
                onChange={(e) => updateAgent({ cron: e.target.value })}
                className={`w-full px-3 py-1.5 text-xs rounded border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${tc.inputBg} ${tc.border}`}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Instructions / System Prompt</label>
            <textarea 
              rows={4}
              value={agent.instructions}
              onChange={(e) => updateAgent({ instructions: e.target.value })}
              className={`w-full px-3 py-1.5 text-xs rounded border focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none h-[92px] ${tc.inputBg} ${tc.border}`}
            />
          </div>
        </div>

        {/* Chat Box Preview Console */}
        <div className="flex-1 min-h-[220px] border rounded-lg overflow-hidden flex flex-col bg-gray-50/50 dark:bg-zinc-950/40 border-gray-200 dark:border-zinc-800">
          <div className="px-3 py-1.5 bg-gray-100 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider flex justify-between items-center">
            <span>Agent Chat Preview Console: {agent.name}</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 animate-pulse border border-emerald-500/20">Active</span>
          </div>

          {/* Message History */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs">
            {agent.chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                <span className="text-[9px] text-gray-400 dark:text-zinc-500 font-bold mb-0.5">
                  {msg.sender === "user" ? "You" : agent.name}
                </span>
                <div className={`px-2.5 py-1.5 rounded-lg max-w-[85%] leading-relaxed ${
                  msg.sender === "user" 
                    ? "bg-emerald-500 text-white font-semibold rounded-tr-none" 
                    : "bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-800 dark:text-zinc-100 rounded-tl-none"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isAgentTyping && (
              <div className="flex flex-col items-start">
                <span className="text-[9px] text-gray-400 dark:text-zinc-500 font-bold mb-0.5">{agent.name}</span>
                <div className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-400 rounded-tl-none italic animate-pulse">
                  typing...
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-2 bg-gray-50 dark:bg-zinc-900/50 border-t border-gray-200 dark:border-zinc-800 flex gap-1.5">
            <input 
              type="text" 
              placeholder={`Send instruction to ${agent.name}...`}
              value={agentChatInput}
              onChange={(e) => setAgentChatInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSendAgentMessage(agentId); }}
              className={`flex-1 px-3 py-1.5 text-xs rounded border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${tc.inputBg} ${tc.border}`}
            />
            <button
              type="button"
              onClick={() => handleSendAgentMessage(agentId)}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-xs font-bold transition-colors flex items-center justify-center cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="border border-rose-500/20 rounded-lg p-3 bg-rose-500/[0.02] flex-shrink-0">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-xs font-bold text-rose-500">Danger Zone</h4>
              <p className="text-[10px] text-gray-400 font-medium">Permanently delete this agent and all associated settings.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete ${agent.name}?`)) {
                  setAiAgents(prev => prev.filter(a => a.id !== agentId));
                  setPreferencesActiveSection("general_basic");
                }
              }}
              className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white rounded text-[10px] font-bold transition-colors cursor-pointer"
            >
              Delete Agent
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderAgentModelPanel = (agentId: string) => {
    const agent = aiAgents.find(a => a.id === agentId);
    if (!agent) return <div className="text-xs text-rose-500">Agent not found</div>;

    const updateAgent = (fields: Partial<AIAgent>) => {
      setAiAgents(prev => prev.map(a => a.id === agentId ? { ...a, ...fields } : a));
    };

    return (
      <div className="space-y-6 max-w-md font-sans">
        <div>
          <h2 className="text-lg font-bold">Model API Settings: {agent.name}</h2>
          <p className="text-xs text-gray-400">Configure connection details for this specific agent's Large Language Model provider.</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-zinc-800/60">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-600 dark:text-zinc-300">AI Model Provider</span>
              <span className="text-[10px] text-gray-400">Choose the host platform</span>
            </div>
            <select 
              value={agent.aiProvider}
              onChange={(e) => {
                const prov = e.target.value;
                updateAgent({
                  aiProvider: prov,
                  aiModel: prov === "openai" ? "gpt-4o" : prov === "anthropic" ? "claude-3-5-sonnet" : prov === "deepseek" ? "deepseek-chat" : "llama3"
                });
              }}
              className={`px-2 py-1 text-xs rounded border focus:outline-none ${tc.inputBg} ${tc.border}`}
            >
              <option value="anthropic">Anthropic</option>
              <option value="openai">OpenAI</option>
              <option value="deepseek">DeepSeek</option>
              <option value="ollama">Ollama (Local)</option>
            </select>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-zinc-800/60">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-600 dark:text-zinc-300">Model Selection</span>
              <span className="text-[10px] text-gray-400">Specific version parameter</span>
            </div>
            <select 
              value={agent.aiModel}
              onChange={(e) => updateAgent({ aiModel: e.target.value })}
              className={`px-2 py-1 text-xs rounded border focus:outline-none ${tc.inputBg} ${tc.border}`}
            >
              {agent.aiProvider === "anthropic" && (
                <>
                  <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                  <option value="claude-3-opus">Claude 3 Opus</option>
                  <option value="claude-3-haiku">Claude 3 Haiku</option>
                </>
              )}
              {agent.aiProvider === "openai" && (
                <>
                  <option value="gpt-4o">GPT-4o</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </>
              )}
              {agent.aiProvider === "deepseek" && (
                <>
                  <option value="deepseek-chat">DeepSeek-V3</option>
                  <option value="deepseek-coder">DeepSeek-Coder</option>
                </>
              )}
              {agent.aiProvider === "ollama" && (
                <>
                  <option value="llama3">Llama 3 (8B)</option>
                  <option value="mistral">Mistral (7B)</option>
                  <option value="phi3">Phi-3</option>
                </>
              )}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Provider API Key</label>
            <input 
              type="password" 
              value={agent.aiApiKey}
              onChange={(e) => updateAgent({ aiApiKey: e.target.value })}
              placeholder="sk-or-key-string-..."
              className={`w-full px-3 py-1.5 text-xs rounded border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${tc.inputBg} ${tc.border}`}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderPreferencesContent = () => {
    if (preferencesActiveSection === "ai_new_agent") {
      return renderNewAgentPanel();
    }
    if (preferencesActiveSection.startsWith("ai_config_")) {
      const agentId = preferencesActiveSection.replace("ai_config_", "");
      return renderAgentConfigPanel(agentId);
    }
    if (preferencesActiveSection.startsWith("ai_model_")) {
      const agentId = preferencesActiveSection.replace("ai_model_", "");
      return renderAgentModelPanel(agentId);
    }
    switch (preferencesActiveSection) {
      case "account_details":
        return (
          <div className="space-y-6 max-w-sm">
            <div>
              <h2 className="text-lg font-bold">Account Preference</h2>
              <p className="text-xs text-gray-400">Manage your profile credentials and crypto wallet connections.</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Username</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full px-3 py-1.5 text-xs rounded border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${tc.inputBg} ${tc.border}`}
                />
              </div>

              <div className="p-4 rounded border flex justify-between items-center bg-gray-50/50 dark:bg-zinc-900/20 border-gray-200 dark:border-zinc-800/80">
                <div className="flex gap-2.5 items-center">
                  <Wallet className="w-5 h-5 text-emerald-500" />
                  <div className="flex flex-col text-xs">
                    <span className="font-bold">Crypto Wallet</span>
                    <span className="text-[10px] text-gray-400">{isWalletConnected ? "0x71C7...5a8d Connected" : "No Wallet Connected"}</span>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    setIsWalletConnected(!isWalletConnected);
                  }}
                  className={`px-3 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                    isWalletConnected 
                      ? "border border-rose-500/40 text-rose-500 bg-rose-500/5 hover:bg-rose-500/10"
                      : "bg-emerald-500 hover:bg-emerald-600 text-white"
                  }`}
                >
                  {isWalletConnected ? "Disconnect" : "Connect Wallet"}
                </button>
              </div>
            </div>
          </div>
        );
      case "account_password":
        return (
          <div className="space-y-6 max-w-sm">
            <div>
              <h2 className="text-lg font-bold">Terminal Security Password</h2>
              <p className="text-xs text-gray-400">Change your security credentials for terminal login access.</p>
            </div>
            
            <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Current Password</label>
                <input 
                  type="password" 
                  value={currentPasswordInput}
                  onChange={(e) => setCurrentPasswordInput(e.target.value)}
                  className={`w-full px-3 py-1.5 text-xs rounded border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${tc.inputBg} ${tc.border}`}
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">New Password</label>
                <input 
                  type="password" 
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className={`w-full px-3 py-1.5 text-xs rounded border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${tc.inputBg} ${tc.border}`}
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Confirm Password</label>
                <input 
                  type="password" 
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  className={`w-full px-3 py-1.5 text-xs rounded border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${tc.inputBg} ${tc.border}`}
                  placeholder="Confirm new password"
                  required
                />
              </div>

              {passwordStatusMsg && (
                <div className={`text-xs font-bold ${
                  passwordStatusType === "success" ? "text-emerald-500" : "text-rose-500"
                }`}>
                  {passwordStatusMsg}
                </div>
              )}

              <button 
                type="submit"
                className="py-1.5 px-4 rounded bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs cursor-pointer transition-colors"
              >
                Change Credentials
              </button>
            </form>
          </div>
        );
      case "ai_agent_placeholder":
        return null;
      case "general_basic":
        return (
          <div className="space-y-6 font-sans">
            <div>
              <h2 className="text-lg font-bold">General Settings</h2>
              <p className="text-xs text-gray-400">Adjust language preferences, visual theme profiles, layout scaling, and Menu Bar styles.</p>
            </div>
            
            <div className="space-y-5 max-w-md">
              {/* Language Selection */}
              <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-zinc-800/60">
                <span className="text-xs font-bold text-gray-600 dark:text-zinc-300">Language</span>
                <select className={`px-2 py-1 text-xs rounded border focus:outline-none ${tc.inputBg} ${tc.border}`}>
                  <option>English</option>
                  <option>简体中文</option>
                  <option>繁體中文</option>
                  <option>日本語</option>
                </select>
              </div>

              {/* Appearance Mode */}
              <div className="space-y-2 pb-3 border-b border-gray-100 dark:border-zinc-800/60">
                <span className="text-xs font-bold text-gray-600 dark:text-zinc-300">Appearance Mode</span>
                
                {/* 3 cards: Auto, Light, Dark */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { 
                      id: "auto", 
                      label: "Auto",
                      preview: (
                        <div className="w-full h-14 rounded-lg overflow-hidden flex bg-[#f4f4f5] dark:bg-[#1f1f23] border border-gray-200 dark:border-zinc-700">
                          {/* Left Half: Light Preview */}
                          <div className="w-1/2 h-full flex bg-[#fafafa]">
                            <div className="w-4 h-full bg-[#f4f4f5] border-r border-[#e4e4e7] p-0.5 flex flex-col gap-0.5">
                              <div className="w-2.5 h-2.5 bg-teal-500 rounded-2xs" />
                              <div className="w-2.5 h-1 bg-[#e4e4e7] rounded-3xs" />
                              <div className="w-2.5 h-1 bg-[#e4e4e7] rounded-3xs" />
                            </div>
                            <div className="flex-1 p-1 flex flex-col gap-0.5 justify-center">
                              <div className="h-1 w-5 bg-gray-300 rounded-sm" />
                              <div className="h-1.5 w-full bg-gray-205 rounded-sm" />
                              <div className="h-2.5 w-full bg-gray-300 rounded-sm" />
                            </div>
                          </div>
                          {/* Right Half: Dark Preview */}
                          <div className="w-1/2 h-full flex bg-[#18181b]">
                            <div className="w-4 h-full bg-[#121214] border-r border-[#27272a] p-0.5 flex flex-col gap-0.5">
                              <div className="w-2.5 h-2.5 bg-blue-550 rounded-2xs" />
                              <div className="w-2.5 h-1 bg-zinc-805 rounded-3xs" />
                              <div className="w-2.5 h-1 bg-zinc-805 rounded-3xs" />
                            </div>
                            <div className="flex-1 p-1 flex flex-col gap-0.5 justify-center">
                              <div className="h-1 w-5 bg-zinc-705 rounded-sm" />
                              <div className="h-1.5 w-full bg-zinc-805 rounded-sm" />
                              <div className="h-2.5 w-full bg-zinc-705 rounded-sm" />
                            </div>
                          </div>
                        </div>
                      )
                    },
                    { 
                      id: "light", 
                      label: "Light",
                      preview: (
                        <div className="w-full h-14 bg-[#fafafa] rounded-lg border border-gray-200 overflow-hidden flex">
                          <div className="w-6 h-full bg-[#f4f4f5] border-r border-[#e4e4e7] p-1 flex flex-col gap-0.5">
                            <div className="w-4.5 h-4.5 bg-teal-500 rounded-2xs" />
                            <div className="w-4.5 h-1 bg-[#e4e4e7] rounded-3xs" />
                            <div className="w-4.5 h-1 bg-[#e4e4e7] rounded-3xs" />
                          </div>
                          <div className="flex-1 p-1 flex flex-col gap-0.5 justify-center">
                            <div className="h-1 w-7 bg-gray-305 rounded-sm" />
                            <div className="h-1.5 w-full bg-gray-205 rounded-sm" />
                            <div className="h-2.5 w-full bg-gray-305 rounded-sm" />
                          </div>
                        </div>
                      )
                    },
                    { 
                      id: "dark", 
                      label: "Dark",
                      preview: (
                        <div className="w-full h-14 bg-[#18181b] rounded-lg border border-zinc-800 overflow-hidden flex">
                          <div className="w-6 h-full bg-[#121214] border-r border-[#27272a] p-1 flex flex-col gap-0.5">
                            <div className="w-4.5 h-4.5 bg-blue-600 rounded-2xs" />
                            <div className="w-4.5 h-1 bg-zinc-800 rounded-3xs" />
                            <div className="w-4.5 h-1 bg-zinc-800 rounded-3xs" />
                          </div>
                          <div className="flex-1 p-1 flex flex-col gap-0.5 justify-center">
                            <div className="h-1 w-7 bg-zinc-705 rounded-sm" />
                            <div className="h-1.5 w-full bg-zinc-805 rounded-sm" />
                            <div className="h-2.5 w-full bg-zinc-705 rounded-sm" />
                          </div>
                        </div>
                      )
                    }
                  ].map(m => {
                    const isSelected = m.id === "auto" 
                      ? activeTheme === "default-dark" 
                      : m.id === "dark" 
                        ? (isDarkMode && activeTheme !== "macos-classic-light") 
                        : (!isDarkMode || activeTheme === "macos-classic-light");
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          if (m.id === "light") {
                            setIsDarkMode(false);
                            setActiveTheme("macos-classic-light");
                          } else if (m.id === "dark") {
                            setIsDarkMode(true);
                            setActiveTheme("default-dark");
                          } else {
                            setActiveTheme("default-dark");
                            setIsDarkMode(true);
                          }
                        }}
                        className={`flex flex-col text-left rounded-xl p-1.5 border transition-all cursor-pointer ${
                          isSelected 
                            ? "border-blue-500 bg-white dark:bg-zinc-900/60 shadow-sm" 
                            : "border-gray-250 dark:border-zinc-800/80 hover:border-gray-350 dark:hover:border-zinc-700 bg-gray-50/50 dark:bg-zinc-900/10"
                        }`}
                      >
                        {m.preview}
                        <div className="flex items-center gap-1.5 mt-1.5 pl-0.5">
                          <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                            isSelected ? "border-blue-500 bg-blue-500 text-white" : "border-gray-300 dark:border-zinc-700 bg-transparent"
                          }`}>
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3.5]" />}
                          </div>
                          <span className="text-[10px] font-bold text-gray-700 dark:text-zinc-300">{m.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Theme Dropdown */}
              <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-zinc-800/60">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-600 dark:text-zinc-300">Theme</span>
                  <span className="text-[10px] text-gray-400">Select active workspace skin</span>
                </div>
                <select 
                  value={activeTheme}
                  onChange={(e) => {
                    setActiveTheme(e.target.value);
                    const tConfig = themes[e.target.value as keyof typeof themes];
                    if (tConfig) setIsDarkMode(tConfig.isDark);
                  }}
                  className={`px-2 py-1 text-xs rounded border focus:outline-none ${tc.inputBg} ${tc.border}`}
                >
                  {Object.keys(themes).map(tName => (
                    <option key={tName} value={tName}>
                      {tName.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quote Color Swapper */}
              <div className="space-y-2 pb-3 border-b border-gray-100 dark:border-zinc-800/60">
                <span className="text-xs font-bold text-gray-600 dark:text-zinc-300 block">Quote Color</span>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={() => setQuoteColorUpGreen(false)}
                    className={`flex flex-col justify-between p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      !quoteColorUpGreen 
                        ? "border-blue-500 bg-white dark:bg-[#18181b] shadow-sm"
                        : "border-gray-250 dark:border-[#27272a] hover:border-gray-350 dark:hover:border-zinc-700 bg-gray-50/50 dark:bg-zinc-900/10"
                    }`}
                  >
                    <div className="flex justify-between w-full text-[10px] font-bold text-gray-500 dark:text-zinc-400 mb-1.5">
                      <span>Red Up</span>
                      <span>Green Down</span>
                    </div>
                    <div className="flex justify-between w-full text-[11px] font-bold font-mono">
                      <span className="text-rose-500">↗ 16.88</span>
                      <span className="text-emerald-500">↘ 16.88</span>
                    </div>
                  </button>

                  <button 
                    type="button"
                    onClick={() => setQuoteColorUpGreen(true)}
                    className={`flex flex-col justify-between p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      quoteColorUpGreen 
                        ? "border-blue-500 bg-white dark:bg-[#18181b] shadow-sm"
                        : "border-gray-250 dark:border-[#27272a] hover:border-gray-350 dark:hover:border-zinc-700 bg-gray-50/50 dark:bg-zinc-900/10"
                    }`}
                  >
                    <div className="flex justify-between w-full text-[10px] font-bold text-gray-500 dark:text-zinc-400 mb-1.5">
                      <span>Green Up</span>
                      <span>Red Down</span>
                    </div>
                    <div className="flex justify-between w-full text-[11px] font-bold font-mono">
                      <span className="text-emerald-500">↗ 16.88</span>
                      <span className="text-rose-500">↘ 16.88</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Font Size Scaling */}
              <div className="space-y-2 pb-3 border-b border-gray-100 dark:border-zinc-800/60">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-600 dark:text-zinc-300">Font Size</span>
                  {/* Editable px input — commits immediately */}
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={11}
                      max={17}
                      value={fontSizeScale}
                      onChange={(e) => {
                        const v = parseInt(e.target.value);
                        if (!isNaN(v) && v >= 11 && v <= 17) {
                          setSliderDisplayValue(v); // keep thumb in sync
                          setFontSizeScale(v);
                        }
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="w-10 text-center text-[11px] font-mono font-bold text-gray-500 dark:text-zinc-400 bg-transparent border-b border-gray-300 dark:border-zinc-700 focus:outline-none focus:border-blue-500 cursor-text appearance-none"
                      style={{ MozAppearance: "textfield" } as React.CSSProperties}
                    />
                    <span className="text-[10px] text-gray-400">px</span>
                  </div>
                </div>
                <div
                  className="relative pt-1 max-w-sm"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <input
                    ref={fontSliderRef}
                    type="range"
                    min="11"
                    max="17"
                    step="1"
                    tabIndex={0}
                    value={sliderDisplayValue}
                    onChange={(e) => {
                      // Only update the visual thumb — no DOM font change during drag
                      setSliderDisplayValue(parseInt(e.target.value));
                    }}
                    onMouseUp={() => {
                      // Commit on release (discrete jump)
                      setFontSizeScale(sliderDisplayValue);
                    }}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      let next: number | null = null;
                      if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                        e.preventDefault();
                        next = Math.max(11, sliderDisplayValue - 1);
                      } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                        e.preventDefault();
                        next = Math.min(17, sliderDisplayValue + 1);
                      }
                      if (next !== null) {
                        // Update display immediately — zero relayout, focus is never lost
                        setSliderDisplayValue(next);
                        // Commit the actual font size 200ms after the last keypress
                        // This way focus stays on the slider throughout rapid navigation
                        if (fontCommitTimerRef.current) clearTimeout(fontCommitTimerRef.current);
                        const captured = next;
                        fontCommitTimerRef.current = setTimeout(() => {
                          setFontSizeScale(captured);
                          fontCommitTimerRef.current = null;
                        }, 200);
                      }
                    }}
                    className="w-full h-1.5 rounded-lg appearance-none"
                    style={{
                      cursor: "default",
                      outline: "none",
                      accentColor: "#3b82f6",
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((sliderDisplayValue - 11) / (17 - 11)) * 100}%, ${isDarkMode ? '#27272a' : '#e5e7eb'} ${((sliderDisplayValue - 11) / (17 - 11)) * 100}%, ${isDarkMode ? '#27272a' : '#e5e7eb'} 100%)`
                    }}
                  />
                  <div className="flex justify-between px-0.5 mt-1.5 select-none">
                    {[11,12,13,14,15,16,17].map(v => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => {
                          setSliderDisplayValue(v); // keep thumb in sync
                          setFontSizeScale(v);
                        }}
                        className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${
                          v === fontSizeScale ? "text-blue-500" : "text-gray-300 dark:text-zinc-700 hover:text-gray-400"
                        }`}
                      >
                        <div className={`w-px h-1.5 rounded-full ${v === fontSizeScale ? "bg-blue-500" : "bg-current"}`} />
                        {v === 14 && <span className="text-[7px] font-bold">Default</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Menu Bar Layout style */}
              <div className="flex justify-between items-center pb-2">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-600 dark:text-zinc-300">Menu Bar Icon</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">Controls what shows in the top navigation bar</span>
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowMenuBarIconDropdown(prev => !prev)}
                    className={`px-3 py-1 text-xs rounded border flex items-center justify-between gap-1.5 min-w-[100px] text-left cursor-pointer transition-colors ${tc.inputBg} ${tc.border}`}
                  >
                    <span>
                      {menuBarIconStyle === "full" ? "Full" : menuBarIconStyle === "icon" ? "Icon only" : "Hidden"}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  {showMenuBarIconDropdown && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowMenuBarIconDropdown(false)} />
                      <div className="absolute right-0 bottom-full mb-1 w-36 rounded-lg border bg-white dark:bg-zinc-900 shadow-xl py-1 z-[200] text-[11px] font-semibold text-gray-700 dark:text-zinc-300 border-gray-200 dark:border-zinc-800">
                        {[
                          { value: "icon", label: "Icon only", desc: "Show icon" },
                          { value: "full", label: "Full", desc: "Icon + label" },
                          { value: "hidden", label: "Hidden", desc: "No bar item" }
                        ].map(opt => {
                          const isSelected = menuBarIconStyle === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => {
                                setMenuBarIconStyle(opt.value as any);
                                setShowMenuBarIconDropdown(false);
                              }}
                              className="w-full flex items-center px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-left cursor-pointer gap-1.5 text-[11px] font-semibold"
                            >
                              <div className="w-3.5 h-3.5 flex items-center justify-center flex-shrink-0 text-emerald-500">
                                {isSelected && <Check className="w-3.5 h-3.5" />}
                              </div>
                              <span className={isSelected ? "font-bold text-black dark:text-white" : "text-gray-600 dark:text-zinc-400"}>
                                {opt.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case "general_sound":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold">Sound Settings</h2>
              <p className="text-xs text-gray-400">Configure sound outputs for custom stock price threshold crossings.</p>
            </div>
            
            <div className="space-y-4 max-w-md font-sans">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sound</h3>
              
              <div className="p-4 rounded border flex justify-between items-center bg-gray-50/50 dark:bg-zinc-900/10 border-gray-200 dark:border-zinc-800">
                <div className="flex flex-col text-xs pr-4">
                  <span className="font-bold">Stock Price Alert</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">Play the system alert sound when an alert fires</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={soundAlertsEnabled}
                  onChange={(e) => setSoundAlertsEnabled(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-zinc-800/60">
                <span className="text-xs font-bold text-gray-600 dark:text-zinc-300">Primary Notification Tone</span>
                <select 
                  value={selectedAlertTone}
                  onChange={(e) => setSelectedAlertTone(e.target.value)}
                  className={`px-2 py-1 text-xs rounded border focus:outline-none ${tc.inputBg} ${tc.border}`}
                >
                  <option>Zelda Navi</option>
                  <option>Classic Beep</option>
                  <option>Ping</option>
                  <option>Chime</option>
                </select>
              </div>

              <div className="p-4 rounded border bg-gray-50/50 dark:bg-zinc-900/20 border-gray-200 dark:border-zinc-800/80">
                <span className="text-[11px] font-bold text-emerald-500 uppercase block mb-1">Retro Alert Voice presets (Web Audio Synth)</span>
                <span className="text-[10px] text-gray-400 block mb-3">Audibly preview classic Navi alerts before saving.</span>
                <div className="flex gap-2">
                  {[
                    { type: "hey", label: 'Play "Hey!"' },
                    { type: "listen", label: 'Play "Listen!"' },
                    { type: "hello", label: 'Play "Hello!"' }
                  ].map((btn) => (
                    <button
                      key={btn.type}
                      type="button"
                      onClick={() => playNaviAlert(btn.type as any)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-[10px] text-emerald-500 font-bold transition-all cursor-pointer"
                    >
                      <Play className="w-3 h-3" />
                      <span>{btn.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case "quotes":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold">Quotes Preferences</h2>
              <p className="text-xs text-gray-400">Configure visual alerts, quote updates, and trading colors.</p>
            </div>
            
            <div className="space-y-4 max-w-md">
              {[
                { label: "Price flash highlight on tick", desc: "Highlight cells in watchlist on price updates", active: true },
                { label: "Bid/Ask order book flash", desc: "Flash order depth bars on volume pressure", active: true },
                { label: "Show volume color block", desc: "Color match trading volume bars to candle fills", active: false }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-zinc-800/60">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-700 dark:text-zinc-300">{item.label}</span>
                    <span className="text-[10px] text-gray-400">{item.desc}</span>
                  </div>
                  <input type="checkbox" defaultChecked={item.active} className="w-4 h-4 accent-emerald-500 cursor-pointer" />
                </div>
              ))}
            </div>
          </div>
        );
      // Removed Trade Preference as requested
      case "chart_main":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold">Main Chart</h2>
              <p className="text-xs text-gray-400">Adjust the visual lines and scales of the TradingView canvas.</p>
            </div>
            
            <div className="space-y-4 max-w-md">
              {[
                { label: "Show volume bars below chart", state: chartShowVolume, setter: setChartShowVolume },
                { label: "Show dual-axis overlay (SUI+BTC)", state: chartShowOverlay, setter: setChartShowOverlay },
                { label: "Show grid lines (vertical & horizontal)", state: chartShowGrid, setter: setChartShowGrid },
                { label: "Enable crosshair tooltip coordinates", state: chartEnableCrosshair, setter: setChartEnableCrosshair }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-zinc-800/60">
                  <span className="text-xs font-bold text-gray-700 dark:text-zinc-300">{item.label}</span>
                  <input 
                    type="checkbox" 
                    checked={item.state} 
                    onChange={(e) => item.setter(e.target.checked)} 
                    className="w-4 h-4 accent-emerald-500 cursor-pointer" 
                  />
                </div>
              ))}
            </div>
          </div>
        );
      case "chart_extended":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold">Extended Trading Hours Chart</h2>
              <p className="text-xs text-gray-400">Toggle candles overlay for aftermarket and pre-market price streams.</p>
            </div>
            
            <div className="space-y-4 max-w-md">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-zinc-800/60">
                <span className="text-xs font-bold text-gray-700 dark:text-zinc-300">Show Extended Hours</span>
                <input 
                  type="checkbox" 
                  checked={chartExtendedHours} 
                  onChange={(e) => setChartExtendedHours(e.target.checked)} 
                  className="w-4 h-4 accent-emerald-500 cursor-pointer" 
                />
              </div>
            </div>
          </div>
        );
      case "chart_intraday":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold">Intraday Settings</h2>
              <p className="text-xs text-gray-400">Specify custom intervals for sub-daily market resolution views.</p>
            </div>
            <div className="text-xs text-gray-400 italic font-semibold">No additional options are currently configured for intraday view.</div>
          </div>
        );
      case "chart_trade":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold">Chart Trade settings</h2>
              <p className="text-xs text-gray-400">Configure visual order placement and position overlays directly on the chart canvas.</p>
            </div>
            <div className="text-xs text-gray-400 italic font-semibold">No additional options are currently configured for chart orders view.</div>
          </div>
        );
      case "developer":
        return (
          <div className="space-y-6 font-sans pb-6">
            <style>{`
              .flow-dot-pulse {
                filter: drop-shadow(0 0 3px #10b981);
              }
            `}</style>
            
            <div className="border-b border-gray-200 dark:border-zinc-800 pb-3 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-950 dark:text-white">Developer Settings</h2>
                <p className="text-xs text-gray-400">Manage developer tools, simulated paper trading configs, and API ingestion routing.</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ingestion API Router & Coordinator</h3>
              
              {/* Animated Connection Map */}
              <div 
                ref={mapWrapperRef}
                style={{ height: `${mapHeight}px` }}
                className={`p-4 rounded-xl border border-gray-200 dark:border-[#27272a] bg-gray-50/50 dark:bg-zinc-955/30 flex flex-col gap-2 overflow-hidden relative ${isMapResizing ? "" : "transition-all duration-75"}`}
              >
                <div className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-1 flex-shrink-0">Real-time Routing Coordinator Map</div>
                <div className="flex-1 flex justify-between items-center relative py-2 px-4 select-none map-flex-row">
                  {/* Category Circles (Left side) */}
                  <div className="flex flex-col gap-3 w-28" style={{ zIndex: 2, position: "relative" }}>
                    {ingestionCategories.map((cat) => {
                      const count = ingestionConnections.filter(c => c.category === cat).length;
                      return (
                        <div 
                          key={cat}
                          data-category={cat}
                          className="category-box-node group/catnode flex items-center gap-2 p-1 px-2 rounded-lg bg-white dark:bg-zinc-900 border border-gray-250 dark:border-zinc-800 shadow-2xs cursor-pointer transition-all hover:border-emerald-500/50"
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const parentRect = mapWrapperRef.current?.getBoundingClientRect();
                            if (parentRect) {
                              setTooltipPosition({
                                x: rect.right - parentRect.left + 10,
                                y: rect.top - parentRect.top - 10
                              });
                            }
                            setHoveredCategory(cat);
                          }}
                          onMouseLeave={() => setHoveredCategory(null)}
                        >
                          <div className={`w-2 h-2 fill-current rounded-full flex-shrink-0 ${count > 0 ? "bg-emerald-500 animate-pulse" : "bg-gray-300 dark:bg-zinc-700"}`} />
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-[9px] font-bold truncate leading-none text-gray-800 dark:text-zinc-200">{cat}</span>
                            <span className="text-[7px] text-gray-450 leading-none mt-1">{count} Active</span>
                          </div>
                          <button
                            type="button"
                            title={`Remove ${cat} category`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setIngestionCategories(prev => prev.filter(c => c !== cat));
                              setIngestionConnections(prev => prev.filter(c => c.category !== cat));
                              if (newConnCategory === cat) {
                                setNewConnCategory(ingestionCategories.find(c => c !== cat) || "Market Data");
                              }
                            }}
                            className="w-3.5 h-3.5 flex items-center justify-center text-gray-350 dark:text-zinc-600 hover:text-rose-500 dark:hover:text-rose-500 flex-shrink-0 rounded transition-colors"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Router Box (Center) */}
                  <div
                    className="ingestion-router-box flex flex-col items-center justify-center p-3 rounded-xl border border-emerald-500/30 w-36 shadow-lg"
                    style={{ zIndex: 2, position: "relative", backgroundColor: "#f0fdf9" }}
                  >
                    <style>{`.dark .ingestion-router-box { background-color: #0d1f1a !important; }`}</style>
                    <Sparkles className="w-5 h-5 text-emerald-500 animate-spin mb-1" style={{ animationDuration: "12s" }} />
                    {isEditingRouterName ? (
                      <input 
                        type="text"
                        value={ingestionRouterName}
                        onChange={(e) => setIngestionRouterName(e.target.value)}
                        onBlur={() => setIsEditingRouterName(false)}
                        onKeyDown={(e) => { if (e.key === "Enter") setIsEditingRouterName(false); }}
                        className="text-[10px] font-extrabold text-center bg-transparent border-b border-emerald-500 focus:outline-none w-28 uppercase text-gray-900 dark:text-white"
                        autoFocus
                      />
                    ) : (
                      <span 
                        onClick={() => setIsEditingRouterName(true)}
                        className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 tracking-wider cursor-pointer hover:underline flex items-center gap-1 select-none"
                        title="Click to rename"
                      >
                        {ingestionRouterName}
                      </span>
                    )}
                    <span className="text-[8px] text-gray-400 mt-0.5">Coordinator Engine</span>
                  </div>

                  {/* Portfolio Engine (Right side) */}
                  <div
                    className="local-portfolio-box flex flex-col items-center justify-center p-2.5 rounded-xl border border-gray-250 dark:border-zinc-800 w-28 shadow-sm"
                    style={{ zIndex: 2, position: "relative", backgroundColor: "white" }}
                  >
                    <style>{`.dark .local-portfolio-box { background-color: #18181b !important; }`}</style>
                    <FolderHeart className="w-4 h-4 text-rose-500 animate-pulse mb-1" />
                    {isEditingPortfolioName ? (
                      <input 
                        type="text"
                        value={localPortfolioName}
                        onChange={(e) => setLocalPortfolioName(e.target.value)}
                        onBlur={() => setIsEditingPortfolioName(false)}
                        onKeyDown={(e) => { if (e.key === "Enter") setIsEditingPortfolioName(false); }}
                        className="text-[9px] font-bold text-center bg-transparent border-b border-gray-500 focus:outline-none w-20 text-gray-900 dark:text-white"
                        autoFocus
                      />
                    ) : (
                      <span 
                        onClick={() => setIsEditingPortfolioName(true)}
                        className="text-[9px] font-bold cursor-pointer hover:underline select-none"
                        title="Click to rename"
                      >
                        {localPortfolioName}
                      </span>
                    )}
                    <span className="text-[7px] text-gray-400">Core Engine</span>
                  </div>

                  {/* SVG Flow Lines — rendered BEHIND boxes using negative z-index */}
                  <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
                    <svg className="w-full h-full overflow-visible" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        {/* Clip: don't draw inside the router box */}
                      </defs>
                      {svgPaths.connections.map((conn, idx) => (
                        <g key={idx}>
                          <path 
                            d={conn.d} 
                            stroke={conn.active ? "#10b981" : "#6b7280"} 
                            strokeWidth="1.5" 
                            strokeDasharray={conn.active ? "4,3" : "3,4"} 
                            strokeOpacity={conn.active ? 0.55 : 0.25}
                            fill="none" 
                          />
                          {conn.active && (
                            <circle r="3.5" fill="#10b981" opacity="0.85" className="flow-dot-pulse">
                              <animateMotion 
                                path={conn.d} 
                                dur="2.5s" 
                                repeatCount="indefinite" 
                                begin={conn.dotStyle.animationDelay as string} 
                              />
                            </circle>
                          )}
                        </g>
                      ))}
                      {svgPaths.routerToPortfolio && (
                        <g>
                          <path 
                            d={svgPaths.routerToPortfolio.d} 
                            stroke="#10b981" 
                            strokeWidth="1.5" 
                            strokeDasharray="4,3" 
                            strokeOpacity="0.55"
                            fill="none" 
                          />
                          <circle r="3.5" fill="#10b981" opacity="0.85" className="flow-dot-pulse">
                            <animateMotion 
                              path={svgPaths.routerToPortfolio.d} 
                              dur="2.5s" 
                              repeatCount="indefinite" 
                              begin="0.2s" 
                            />
                          </circle>
                        </g>
                      )}
                    </svg>
                  </div>
                </div>

                {/* Hover Tooltip display */}
                {hoveredCategory && (
                  <div 
                    style={{ 
                      left: `${tooltipPosition.x}px`, 
                      top: `${tooltipPosition.y}px` 
                    }}
                    className="absolute z-20 w-56 p-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 shadow-lg backdrop-blur-xs text-xs pointer-events-none transition-all duration-200"
                  >
                    <div className="font-bold text-gray-900 dark:text-white mb-1.5 border-b border-gray-100 dark:border-zinc-850 pb-1 flex justify-between items-center">
                      <span>{hoveredCategory}</span>
                      <span className="text-[8px] text-emerald-500 font-extrabold uppercase">API Streams</span>
                    </div>
                    <div className="space-y-1.5">
                      {ingestionConnections.filter(c => c.category === hoveredCategory).length === 0 ? (
                        <span className="text-gray-455 italic text-[10px]">No active connections</span>
                      ) : (
                        ingestionConnections
                          .filter(c => c.category === hoveredCategory)
                          .map(conn => {
                            const interval = conn.pullInterval || "5m";
                            const mockPullTimes = {
                              "cg-1": "14s ago",
                              "kc-1": "2m ago",
                              "db-1": "7m ago",
                              "bk-1": "45s ago"
                            } as any;
                            const lastPulled = mockPullTimes[conn.id] || "Just now";
                            return (
                              <div key={conn.id} className="flex flex-col text-[10px] bg-gray-50/50 dark:bg-zinc-900/40 p-1.5 rounded border border-gray-150/45 dark:border-zinc-800/50">
                                <div className="flex justify-between items-center font-semibold">
                                  <span className="truncate max-w-[110px] text-gray-800 dark:text-zinc-200">{conn.name}</span>
                                  <span className="text-[7.5px] px-1 py-0.5 rounded bg-gray-250 dark:bg-zinc-800 text-gray-500 font-mono leading-none">{interval}</span>
                                </div>
                                <div className="flex justify-between items-center text-[8.5px] text-gray-450 mt-1">
                                  <span>Status: <strong className="text-emerald-500">{conn.status}</strong></span>
                                  <span>Pull: {lastPulled}</span>
                                </div>
                              </div>
                            );
                          })
                      )}
                    </div>
                  </div>
                )}

                {/* Resizable drag bar at the bottom */}
                <div 
                  onMouseDown={handleMapDragStart}
                  className="absolute bottom-0 left-0 right-0 h-1.5 cursor-row-resize hover:bg-emerald-500/20 active:bg-emerald-500/40 flex items-center justify-center transition-colors group"
                >
                  <div className="w-8 h-1 rounded-full bg-gray-300 dark:bg-zinc-700 group-hover:bg-emerald-500/60 transition-colors" />
                </div>
              </div>
            </div>

            {/* Connections Router Slots */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Configured Router Slots</div>
              <div className="grid grid-cols-2 gap-2.5">
                {ingestionConnections.map((conn) => {
                  const IconComponent = conn.category === "Market Data" 
                    ? Globe 
                    : conn.category === "Exchanges" 
                      ? TrendingUp 
                      : conn.category === "Banks" 
                        ? Landmark 
                        : Database;
                  return (
                    <div key={conn.id} className="flex justify-between items-center p-3 rounded-lg border border-gray-250 dark:border-zinc-800 bg-[#fafafa]/80 dark:bg-[#121214]/50 hover:bg-white dark:hover:bg-zinc-900/60 transition-colors shadow-2xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-zinc-850 flex items-center justify-center flex-shrink-0 border border-gray-200/50 dark:border-zinc-800">
                          <IconComponent className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold truncate">{conn.name}</span>
                            <span className="text-[7.5px] font-extrabold px-1 py-0.5 rounded bg-gray-200 dark:bg-zinc-800 text-gray-450 dark:text-zinc-500 uppercase tracking-widest leading-none">{conn.provider}</span>
                          </div>
                          <span className="text-[9px] text-gray-400 font-mono truncate mt-0.5">{conn.apiKey}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-full border tracking-wide uppercase ${
                          conn.status === "Active" || conn.status === "Connected"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : conn.status === "Routing"
                              ? "bg-indigo-500/10 text-indigo-500 border-indigo-500/20 animate-pulse"
                              : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        }`}>
                          {conn.status}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setIngestionConnections(prev => prev.filter(c => c.id !== conn.id));
                            playNaviAlert("listen");
                          }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 cursor-pointer transition-colors border border-transparent hover:border-rose-500/20"
                          title="Delete connection"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Add Ingestion Slot Form */}
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!newConnName.trim() || !newConnKey.trim()) return;
              const newId = `conn-${Date.now()}`;
              const newConn: IngestionConnection = {
                id: newId,
                category: newConnCategory,
                provider: newConnProvider,
                name: newConnName,
                apiKey: newConnKey.length > 20 ? `${newConnKey.slice(0, 10)}...${newConnKey.slice(-6)}` : newConnKey,
                status: newConnCategory === "Banks" ? "Routing" : "Connected",
                pullInterval: newConnInterval
              };
              setIngestionConnections(prev => [...prev, newConn]);
              setNewConnName("");
              setNewConnKey("");
              playNaviAlert("hello");
              alert(`Successfully registered ${newConnName} API connection!`);
            }} className="p-4 rounded-xl border border-gray-250 dark:border-zinc-800 bg-[#fafafa]/50 dark:bg-zinc-950/20 space-y-3">
              <div className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Add Router Connection</div>
              
              <div className="grid grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase">Category</label>
                  <select 
                    value={newConnCategory}
                    onChange={(e) => {
                      const cat = e.target.value;
                      if (cat === "ADD_CUSTOM_CATEGORY") {
                        setShowCustomCategoryInput(true);
                      } else {
                        setNewConnCategory(cat);
                        setShowCustomCategoryInput(false);
                        setNewConnProvider(
                          cat === "Market Data" 
                            ? "CoinGecko" 
                            : cat === "Exchanges" 
                              ? "KuCoin" 
                              : cat === "Banks" 
                                ? "Plaid" 
                                : "MongoDB"
                        );
                      }
                    }}
                    className={`w-full px-2 py-1 text-xs rounded border focus:outline-none ${tc.inputBg} ${tc.border}`}
                  >
                    {ingestionCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="ADD_CUSTOM_CATEGORY">+ Add Custom Category...</option>
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase">Provider</label>
                  <input 
                    type="text" 
                    value={newConnProvider}
                    onChange={(e) => setNewConnProvider(e.target.value)}
                    placeholder={
                      newConnCategory === "Market Data" 
                        ? "e.g. CoinGecko" 
                        : newConnCategory === "Exchanges" 
                          ? "e.g. KuCoin" 
                          : newConnCategory === "Banks" 
                            ? "e.g. Plaid" 
                            : "e.g. MongoDB"
                    }
                    className={`w-full px-2 py-1 text-xs rounded border focus:outline-none ${tc.inputBg} ${tc.border}`}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase">Connection Name</label>
                  <input 
                    type="text" 
                    value={newConnName}
                    onChange={(e) => setNewConnName(e.target.value)}
                    placeholder="e.g. My KuCoin Key"
                    className={`w-full px-2.5 py-1 text-xs rounded border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${tc.inputBg} ${tc.border}`}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase">Sync Interval</label>
                  <select
                    value={newConnInterval}
                    onChange={(e) => setNewConnInterval(e.target.value)}
                    className={`w-full px-2 py-1 text-xs rounded border focus:outline-none ${tc.inputBg} ${tc.border}`}
                  >
                    <option value="1m">1 minute</option>
                    <option value="5m">5 minutes</option>
                    <option value="15m">15 minutes</option>
                    <option value="1h">1 hour</option>
                    <option value="Manual">Manual Pull</option>
                  </select>
                </div>
              </div>

              {showCustomCategoryInput && (
                <div className="flex gap-2 items-end mt-2 bg-gray-100/50 dark:bg-zinc-900/30 p-2 rounded border border-dashed border-gray-250 dark:border-zinc-800">
                  <div className="flex-1 space-y-1">
                    <label className="text-[8px] font-bold text-gray-400 uppercase">New Category Name</label>
                    <input 
                      type="text"
                      value={customCategoryName}
                      onChange={(e) => setCustomCategoryName(e.target.value)}
                      placeholder="e.g. Social Metrics"
                      className={`w-full px-2 py-0.5 text-xs rounded border focus:outline-none ${tc.inputBg} ${tc.border}`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const name = customCategoryName.trim();
                      if (name) {
                        if (!ingestionCategories.includes(name)) {
                          setIngestionCategories(prev => [...prev, name]);
                        }
                        setNewConnCategory(name);
                        setCustomCategoryName("");
                        setShowCustomCategoryInput(false);
                      }
                    }}
                    className="px-2 py-0.5 bg-emerald-500 text-white rounded text-[10px] font-bold cursor-pointer hover:bg-emerald-600"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomCategoryInput(false);
                      setNewConnCategory(ingestionCategories[0] || "Market Data");
                    }}
                    className="px-2 py-0.5 bg-gray-300 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded text-[10px] font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase">API Key / Connection String</label>
                <input 
                  type="password" 
                  value={newConnKey}
                  onChange={(e) => setNewConnKey(e.target.value)}
                  placeholder="Enter API Key, Client Secret, or MongoDB Connection String"
                  className={`w-full px-2.5 py-1 text-xs rounded border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${tc.inputBg} ${tc.border}`}
                  required
                />
              </div>

              <button 
                type="submit"
                className="py-1 px-4 rounded bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs cursor-pointer transition-colors"
              >
                Register Ingestion Connection
              </button>
            </form>

            {/* Static Developer Tools Info */}
            <div className="pt-4 border-t border-gray-250 dark:border-zinc-800 space-y-3">
              <div className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Other SDK & Simulated Tools</div>
              <div className="grid grid-cols-2 gap-3.5">
                {[
                  { title: "AI Skill & CLI Core", desc: "Investment analysis agent for real-time quotes, portfolio data, news sentiment, and 50+ CLI commands." },
                  { title: "Paper Trading Module", desc: "Simulated orders matched with live bid-ask spreads at zero cost, no real brokerage accounts needed." },
                  { title: "Self-Documenting SDKs", desc: "Production SDK templates for Claude, Cursor, and Zed editor MCP integrations with built-in rate limiters." }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <span className="text-xs font-bold text-gray-905 dark:text-zinc-100">{item.title}</span>
                    <p className="text-[10px] text-gray-500 dark:text-zinc-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#f6f6f6] dark:bg-[#09090b] text-[#0f0f0f] dark:text-[#f4f4f5] font-sans relative overflow-hidden transition-colors duration-200">
        
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] dark:bg-emerald-500/5" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] dark:bg-indigo-500/5" />
        </div>

        {/* Login Card Container */}
        <div className={`w-[360px] p-8 rounded-2xl bg-white/75 dark:bg-zinc-900/60 border backdrop-blur-xl shadow-2xl relative z-10 flex flex-col items-center justify-center gap-6 transition-all duration-500 
          ${isAuthSuccess ? "scale-95 opacity-0 blur-sm" : "scale-100 opacity-100"}
          ${biometricStatus === "failed" ? "border-rose-500/50 shadow-rose-500/20 dark:shadow-rose-500/10 animate-shake" : "border-gray-200/50 dark:border-[#27272a]/30"}
        `}>
          
          {/* Logo & Identity */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-inner">
              <Sparkles className="w-6 h-6 text-emerald-500 animate-pulse" />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight mt-2 bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">LIBERTRIAN</h1>
            <span className="text-[10px] text-gray-400 dark:text-[#a1a1aa] uppercase font-bold tracking-widest text-center">Secure Terminal Gateway</span>
          </div>

          {/* User Profile Info */}
          <div className="flex flex-col items-center gap-1.5 mt-2">
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center border-2 border-emerald-500/40 shadow-lg relative">
              <User className="w-8 h-8 text-gray-500 dark:text-[#a1a1aa]" />
              <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-950 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              </div>
            </div>
            <span className="font-bold text-sm text-gray-800 dark:text-zinc-200 mt-1">Welcome back, Andy</span>
            <span className="text-[10px] text-gray-400">Owner Session</span>
          </div>

          {/* Password Input Form */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handlePasswordLogin();
            }}
            className="w-full flex flex-col gap-3 mt-2"
          >
            <div className="relative flex items-center w-full">
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="Terminal Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-[#27272a] bg-[#fafafa]/50 dark:bg-zinc-950/40 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500/60 dark:focus:ring-emerald-500/40 transition-all text-center placeholder-gray-400"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-gray-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            {loginError && (
              <span className="text-[10px] text-rose-500 font-semibold text-center mt-1 animate-pulse">{loginError}</span>
            )}

            <button 
              type="submit"
              className="w-full py-2.5 rounded-lg bg-black dark:bg-zinc-100 text-white dark:text-black font-extrabold text-xs shadow-md hover:bg-zinc-900 dark:hover:bg-white transition-colors duration-150 cursor-pointer"
            >
              Sign In
            </button>
          </form>

          {/* Biometrics Divider */}
          <div className="flex items-center gap-3 w-full my-1">
            <div className="flex-1 h-[1px] bg-gray-200 dark:bg-zinc-800" />
            <span className="text-[9px] text-gray-400 uppercase font-bold tracking-widest whitespace-nowrap">Or Secure Scan</span>
            <div className="flex-1 h-[1px] bg-gray-200 dark:bg-zinc-800" />
          </div>

          {/* Biometric Button Flow */}
          <div className="flex flex-col items-center gap-3 w-full">
            <button 
              type="button"
              disabled={biometricStatus !== "idle"}
              onClick={handleBiometricLogin}
              className={`w-16 h-16 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all duration-300 relative 
                ${biometricStatus === "scanning" ? "border-amber-500 bg-amber-500/5 shadow-amber-500/20 shadow-lg scale-105" : ""}
                ${biometricStatus === "success" ? "border-emerald-500 bg-emerald-500/10 shadow-emerald-500/40 shadow-xl scale-105" : ""}
                ${biometricStatus === "failed" ? "border-rose-500 bg-rose-500/10 shadow-rose-500/40 shadow-xl scale-95 animate-shake" : ""}
                ${biometricStatus === "idle" ? "border-gray-200 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-emerald-500 bg-white/50 dark:bg-zinc-950/20 hover:scale-105" : ""}
              `}
            >
              {biometricStatus === "scanning" && (
                <>
                  <div className="absolute inset-0 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                  <Fingerprint className="w-7 h-7 text-amber-500 animate-pulse" />
                </>
              )}
              {biometricStatus === "success" && (
                <Fingerprint className="w-7 h-7 text-emerald-500 animate-bounce" />
              )}
              {biometricStatus === "failed" && (
                <Fingerprint className="w-7 h-7 text-rose-500 animate-pulse" />
              )}
              {biometricStatus === "idle" && (
                <Fingerprint className="w-8 h-8 text-gray-400 dark:text-zinc-500 hover:text-emerald-500 dark:hover:text-emerald-500 transition-colors" />
              )}
            </button>
            <span className="text-[10px] text-gray-400 font-bold tracking-wide">
              {biometricStatus === "scanning" && "Scanning fingerprint..."}
              {biometricStatus === "success" && "Identity Verified."}
              {biometricStatus === "failed" && "Access Denied."}
              {biometricStatus === "idle" && "Verify Identity with Touch ID"}
            </span>
          </div>

          {/* Settings / Mode Switcher on Login Screen */}
          <div className="absolute bottom-4 right-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 dark:text-[#a1a1aa] transition-colors cursor-pointer"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </div>
    );
  }

  const sidebarWidthClass = menuBarIconStyle === "full" 
    ? "w-[10rem] px-3 items-start" 
    : menuBarIconStyle === "hidden"
      ? "w-0 overflow-hidden opacity-0 hover:w-[3.75rem] hover:opacity-100 hover:px-2 transition-all duration-300"
      : "w-[3.75rem] px-1 items-center";

  return (
    <div className={`flex flex-col h-screen w-screen transition-colors duration-200 overflow-hidden font-sans ${tc.bg} ${tc.text}`}>
      
      {/* Header Bar */}
      <header className={`flex h-12 w-full border-b justify-between items-center px-4 select-none ${tc.card} ${tc.border}`}>
        <div className="flex items-center gap-3">
          {/* macOS Titlebar spacer */}
          <div className="w-16 h-4" />
          <div className="flex gap-2">
            <ChevronLeft className="w-4 h-4 text-gray-400 dark:text-[#a1a1aa] cursor-pointer hover:text-black dark:hover:text-white" />
            <ChevronRight className="w-4 h-4 text-gray-400 dark:text-[#a1a1aa] cursor-pointer hover:text-black dark:hover:text-white" />
          </div>
        </div>
        
        {/* Mock Search Bar */}
        <div className={`flex px-3 py-1 w-48 rounded-md border items-center justify-between cursor-text ${tc.bg} ${tc.border}`}>
          <span className="text-xs text-gray-400 dark:text-[#a1a1aa]">Search...</span>
          <span className="text-[10px] text-gray-400 dark:text-[#a1a1aa] bg-gray-100 dark:bg-zinc-800 px-1 rounded">⌘K</span>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 w-full overflow-hidden relative">
        
        {/* Left Sidebar Navigation */}
        <aside className={`flex flex-col border-r pt-4 pb-5 justify-between select-none transition-all duration-200 ${sidebarWidthClass} ${tc.card} ${tc.border}`}>
          {/* Logo (Fixed) */}
          <div className="w-full flex justify-center mb-6 flex-shrink-0">
            <div className="w-8 h-8 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          
          {/* Nav Tabs & Pinned List (Scrollable) */}
          <nav className="flex-1 w-full flex flex-col gap-2 overflow-y-auto scrollbar-none pr-1 mb-4">
            {[
              { icon: Building2, label: "Banking" },
              { icon: TrendingUp, label: "Market" },
              { icon: FolderHeart, label: "Portfolio" },
              { icon: Clock, label: "Prep" },
              { icon: Bot, label: "Agent" }
            ].map((tab, idx) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === idx && !activeAgentChatId;
              return (
                <button
                  key={tab.label}
                  onClick={() => {
                    setActiveAgentChatId(null);
                    setActiveTab(idx);
                    setHoveredTooltip(null);
                  }}
                  onMouseEnter={(e) => {
                    if (menuBarIconStyle !== "full") {
                      setHoveredTooltip({ text: tab.label, rect: e.currentTarget.getBoundingClientRect() });
                    }
                  }}
                  onMouseLeave={() => setHoveredTooltip(null)}
                  className={`relative flex items-center rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors group cursor-pointer ${
                    menuBarIconStyle === "full" ? "w-full px-3 py-2.5 gap-3" : "w-12 h-12 justify-center"
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 w-[3px] h-6 bg-emerald-500 rounded-r" />
                  )}
                  <IconComponent className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? "text-emerald-500" : "text-gray-400 dark:text-[#a1a1aa] group-hover:text-black dark:group-hover:text-white"}`} />
                  
                  {menuBarIconStyle === "full" && (
                    <span className={`text-[11px] font-bold transition-colors ${isActive ? "text-emerald-500 font-extrabold" : "text-gray-500 dark:text-[#a1a1aa] group-hover:text-black dark:group-hover:text-white"}`}>
                      {tab.label}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Pinned Agents Section */}
            {pinnedAgentIds.length > 0 && (
              <>
                <div className="w-8 h-[1px] bg-gray-250 dark:bg-zinc-800/80 mx-auto my-1 flex-shrink-0" />
                {pinnedAgentIds.map(agentId => {
                  const agent = aiAgents.find(a => a.id === agentId);
                  if (!agent) return null;
                  const isAgentActive = activeAgentChatId === agentId;
                  return (
                    <button
                      key={agentId}
                      onClick={() => {
                        setActiveAgentChatId(agentId);
                        setHoveredTooltip(null);
                      }}
                      onMouseEnter={(e) => {
                        if (menuBarIconStyle !== "full") {
                          setHoveredTooltip({ text: `${agent.name} Workspace`, rect: e.currentTarget.getBoundingClientRect() });
                        }
                      }}
                      onMouseLeave={() => setHoveredTooltip(null)}
                      className={`relative flex items-center rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors group cursor-pointer ${
                        menuBarIconStyle === "full" ? "w-full px-3 py-2.5 gap-3" : "w-12 h-12 justify-center"
                      }`}
                    >
                      {isAgentActive && (
                        <div className="absolute left-0 w-[3px] h-6 bg-emerald-500 rounded-r" />
                      )}
                      <AgentMascot name={agent.name} className={`w-5 h-5 flex-shrink-0 transition-colors ${isAgentActive ? "animate-pulse" : ""}`} />
                      {menuBarIconStyle === "full" && (
                        <span className={`text-[11px] font-bold transition-colors ${isAgentActive ? "text-emerald-500 font-extrabold" : "text-gray-500 dark:text-[#a1a1aa] group-hover:text-black dark:group-hover:text-white"}`}>
                          {agent.name}
                        </span>
                      )}
                    </button>
                  );
                })}
              </>
            )}

            {/* Settings Tab */}
            <div className="w-8 h-[1px] bg-gray-250 dark:bg-zinc-800/80 mx-auto my-1 flex-shrink-0" />
            <button
              onClick={() => {
                setActiveAgentChatId(null);
                setPreferencesActiveSection("general_basic");
                setShowPreferencesModal(true);
                setIsSettingsDockedToSidebar(false);
                setHoveredTooltip(null);
              }}
              onMouseEnter={(e) => {
                if (menuBarIconStyle !== "full") {
                  setHoveredTooltip({ text: "Settings", rect: e.currentTarget.getBoundingClientRect() });
                }
              }}
              onMouseLeave={() => setHoveredTooltip(null)}
              className={`relative flex items-center rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors group cursor-pointer ${
                menuBarIconStyle === "full" ? "w-full px-3 py-2.5 gap-3" : "w-12 h-12 justify-center"
              }`}
            >
              <Settings className="w-5 h-5 flex-shrink-0 text-gray-400 dark:text-[#a1a1aa] group-hover:text-black dark:group-hover:text-white" />
              {menuBarIconStyle === "full" && (
                <span className="text-[11px] font-bold text-gray-500 dark:text-[#a1a1aa] group-hover:text-black dark:group-hover:text-white">
                  Settings
                </span>
              )}
            </button>
          </nav>

          {/* Bottom controls: dark mode toggle + profile */}
          <div className={`flex flex-col gap-3 w-full flex-shrink-0 ${menuBarIconStyle === "full" ? "px-3 items-start" : "items-center"}`}>
            {/* Docked Settings Icon (Only when settings is open but docked/minimized to sidebar) */}
            {showPreferencesModal && isSettingsDockedToSidebar && (
              <button
                onClick={() => {
                  setIsSettingsDockedToSidebar(false);
                  setHoveredTooltip(null);
                }}
                onMouseEnter={(e) => {
                  if (menuBarIconStyle !== "full") {
                    setHoveredTooltip({ text: "Settings (Active)", rect: e.currentTarget.getBoundingClientRect() });
                  }
                }}
                onMouseLeave={() => setHoveredTooltip(null)}
                className={`rounded-full flex items-center bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 transition-all cursor-pointer group relative border border-emerald-500/25 ${
                  menuBarIconStyle === "full" ? "w-full py-2 px-1.5 gap-3" : "w-10 h-10 justify-center"
                }`}
              >
                <Settings className="w-5 h-5 flex-shrink-0 animate-spin" style={{ animationDuration: "12s" }} />
                {menuBarIconStyle === "full" && (
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    Settings (Active)
                  </span>
                )}
              </button>
            )}

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={() => {
                setIsDarkMode(!isDarkMode);
                setHoveredTooltip(null);
              }}
              onMouseEnter={(e) => {
                if (menuBarIconStyle !== "full") {
                  setHoveredTooltip({ text: isDarkMode ? "Light Mode" : "Dark Mode", rect: e.currentTarget.getBoundingClientRect() });
                }
              }}
              onMouseLeave={() => setHoveredTooltip(null)}
              className={`rounded-full flex items-center hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer group relative ${
                menuBarIconStyle === "full" ? "w-full py-2 px-1.5 gap-3" : "w-10 h-10 justify-center"
              }`}
            >
              {isDarkMode
                ? <Sun className="w-5 h-5 text-amber-400 flex-shrink-0" />
                : <Moon className="w-5 h-5 text-indigo-400 flex-shrink-0" />
              }
              {menuBarIconStyle === "full" && (
                <span className="text-[11px] font-bold text-gray-500 dark:text-[#a1a1aa] group-hover:text-black dark:group-hover:text-white">
                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                </span>
              )}
            </button>

            {/* Centered Short Divider */}
            <div className="w-8 h-[1px] bg-gray-200 dark:bg-zinc-800 mx-auto my-1 flex-shrink-0" />

            {/* Profile Badge */}
            <div 
              onClick={() => {
                setShowProfileDropdown(!showProfileDropdown);
                setHoveredTooltip(null);
              }}
              onMouseEnter={(e) => {
                if (menuBarIconStyle !== "full") {
                  setHoveredTooltip({ text: "Profile & Settings", rect: e.currentTarget.getBoundingClientRect() });
                }
              }}
              onMouseLeave={() => setHoveredTooltip(null)}
              className={`flex items-center cursor-pointer transition-all hover:opacity-90 ${
                menuBarIconStyle === "full" ? "w-full py-2 px-1.5 gap-3" : "w-10 h-10 justify-center"
              }`}
            >
              <OrangeMascot className={menuBarIconStyle === "full" ? "w-8 h-8 flex-shrink-0" : "w-9 h-9 flex-shrink-0"} />
              {menuBarIconStyle === "full" && (
                <span className="text-[11px] font-bold text-gray-700 dark:text-zinc-300 truncate">
                  {username}
                </span>
              )}
            </div>
          </div>
        </aside>

        {/* Right side content and status bar container */}
        <div className="flex-1 flex flex-col overflow-hidden relative">

        {/* Profile Dropdown Popover */}
        {showProfileDropdown && (
          <div className="absolute left-14 bottom-14 w-56 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-[#27272a] rounded-xl shadow-2xl p-3 z-50 flex flex-col text-xs text-[#0f0f0f] dark:text-[#f4f4f5] font-sans">
            {/* User profile header */}
            <div className="flex items-center gap-3 pb-3 mb-2 border-b border-gray-100 dark:border-zinc-800/80">
              <OrangeMascot className="w-10 h-10 flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-gray-900 dark:text-zinc-100 truncate text-[13px]">{username}</span>
                <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-semibold mt-0.5">Login ID: 41094156</span>
              </div>
            </div>
            
            {/* Menu items */}
            <div className="flex flex-col gap-0.5">
              {/* Appearance */}
              <button 
                onClick={() => {
                  setIsDarkMode(!isDarkMode);
                  setShowProfileDropdown(false);
                }}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-left font-semibold cursor-pointer text-gray-700 dark:text-zinc-300"
              >
                <div className="flex items-center gap-2.5">
                  <Moon className="w-4 h-4 text-gray-400 animate-pulse" />
                  <span>Appearance</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </button>
              
              {/* Theme... */}
              <button 
                onClick={() => {
                  setShowThemeModal(true);
                  setShowProfileDropdown(false);
                }}
                className="w-full flex items-center px-2.5 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-left font-semibold cursor-pointer text-gray-700 dark:text-zinc-300"
              >
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span>Theme...</span>
                </div>
              </button>

              {/* Language */}
              <button 
                onClick={() => {
                  setPreferencesActiveSection("general");
                  setShowPreferencesModal(true);
                  setShowProfileDropdown(false);
                }}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-left font-semibold cursor-pointer text-gray-700 dark:text-zinc-300"
              >
                <div className="flex items-center gap-2.5">
                  <Languages className="w-4 h-4 text-gray-400" />
                  <span>Language</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {/* Setting... */}
              <button 
                onClick={() => {
                  setPreferencesActiveSection("general");
                  setShowPreferencesModal(true);
                  setShowProfileDropdown(false);
                }}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-left font-semibold cursor-pointer text-gray-700 dark:text-zinc-300"
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-gray-400" />
                  <span>Setting...</span>
                </div>
                <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold">⌘,</span>
              </button>

              {/* Separator */}
              <div className="h-[1px] bg-gray-100 dark:bg-zinc-800/80 my-1.5" />

              {/* Feedback... */}
              <button 
                onClick={() => {
                  alert("Thank you for your feedback! It has been logged to the terminal session.");
                  setShowProfileDropdown(false);
                }}
                className="w-full flex items-center px-2.5 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-left font-semibold cursor-pointer text-gray-700 dark:text-zinc-300"
              >
                <div className="flex items-center gap-2.5">
                  <Send className="w-4 h-4 text-gray-400" />
                  <span>Feedback...</span>
                </div>
              </button>

              {/* About */}
              <button 
                onClick={() => {
                  alert("Libertrian Portfolio Life Tracker\nVersion 2.0.0 (Tauri v2 + React 19)\nCreated for Andy.");
                  setShowProfileDropdown(false);
                }}
                className="w-full flex items-center px-2.5 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-left font-semibold cursor-pointer text-gray-700 dark:text-zinc-300"
              >
                <div className="flex items-center gap-2.5">
                  <Info className="w-4 h-4 text-gray-400" />
                  <span>About</span>
                </div>
              </button>

              {/* Separator */}
              <div className="h-[1px] bg-gray-100 dark:bg-zinc-800/80 my-1.5" />

              {/* Log out */}
              <button 
                onClick={() => {
                  setIsLoggedIn(false);
                  setShowProfileDropdown(false);
                }}
                className="w-full flex items-center px-2.5 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-left font-semibold cursor-pointer text-rose-500"
              >
                <div className="flex items-center gap-2.5">
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>Log out</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Viewport Area */}
        <main className={`flex-1 h-full overflow-y-auto bg-white dark:bg-[#09090b] ${tc.bg}`}>
          
          {/* Pinned Agent Chat Workspace */}
          {activeAgentChatId && renderPinnedAgentWorkspace(activeAgentChatId)}
          
          {/* Tab 0: Banking */}
          {!activeAgentChatId && activeTab === 0 && (
            <div className="flex flex-col p-6 gap-6 max-w-6xl mx-auto w-full">
              <div>
                <h1 className="text-2xl font-bold">Banking Dashboard</h1>
                <p className="text-sm text-gray-400 dark:text-[#a1a1aa] mt-1">Track off-chain income, linked accounts, and transactions.</p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Monthly Income", value: "$8,450.00", sub: "+4.2% MoM", desc: "From salary & dividends", green: true },
                  { label: "Spending Rate", value: "$3,120.00", sub: "37% used", desc: "Target is < 50%", green: false },
                  { label: "Net Savings", value: "+$5,330.00", sub: "+12.5%", desc: "Saved to investments", green: true }
                ].map((m, i) => (
                  <div key={i} className="flex flex-col justify-between p-4 rounded-lg bg-gray-50 dark:bg-[#18181b] border border-gray-200 dark:border-[#27272a]">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400 dark:text-[#a1a1aa]">{m.label}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${m.green ? bgUpLight : "bg-zinc-200 dark:bg-zinc-800 text-gray-500"}`}>{m.sub}</span>
                    </div>
                    <span className="text-2xl font-bold mt-2">{m.value}</span>
                    <span className="text-[10px] text-gray-400 dark:text-[#a1a1aa] mt-1">{m.desc}</span>
                  </div>
                ))}
              </div>

              {/* Splits Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Connected Accounts */}
                <div className="flex flex-col p-4 rounded-lg bg-gray-50 dark:bg-[#18181b] border border-gray-200 dark:border-[#27272a] h-[350px]">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-sm">Linked Institutions</span>
                    <Plus className="w-4 h-4 text-gray-400 cursor-pointer hover:text-emerald-500" />
                  </div>
                  <div className="flex flex-col gap-3 overflow-y-auto pr-1">
                    {[
                      { name: "Chase Private Client", status: "Active", details: "Checking & Savings", sync: "2 hours ago" },
                      { name: "Bank of America", status: "Active", details: "Credit Card", sync: "4 hours ago" },
                      { name: "HSBC UK Expat", status: "Re-auth needed", details: "Savings", sync: "1 day ago" }
                    ].map((bank, idx) => (
                      <div key={idx} className="p-3 rounded-md bg-white dark:bg-[#09090b] border border-gray-100 dark:border-[#27272a]">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold">{bank.name}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded ${bank.status === "Active" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}>{bank.status}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">{bank.details}</p>
                        <p className="text-[9px] text-gray-400 mt-2 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" /> Synced {bank.sync}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity Table */}
                <div className="flex flex-col lg:col-span-2 p-4 rounded-lg bg-gray-50 dark:bg-[#18181b] border border-gray-200 dark:border-[#27272a] h-[350px]">
                  <span className="font-bold text-sm mb-4">Recent Bank Activity</span>
                  <div className="flex-1 overflow-auto pr-1">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-[#27272a] text-[10px] text-gray-400 dark:text-[#a1a1aa] uppercase font-bold">
                          <th className="pb-2">Date</th>
                          <th className="pb-2">Merchant / Source</th>
                          <th className="pb-2">Category</th>
                          <th className="pb-2 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { date: "2026-06-13", merchant: "Starbucks Coffee", cat: "Food", val: "-$6.45", isSpend: true },
                          { date: "2026-06-12", merchant: "GitHub Copilot", cat: "Software", val: "-$10.00", isSpend: true },
                          { date: "2026-06-12", merchant: "Coinbase Onramp (USD)", cat: "Fiat Onramp", val: "-$1,200.00", isSpend: true },
                          { date: "2026-06-10", merchant: "Employer Payroll", cat: "Salary", val: "+$4,125.00", isSpend: false },
                          { date: "2026-06-08", merchant: "AWS Cloud Hosting", cat: "Software", val: "-$48.20", isSpend: true },
                          { date: "2026-06-05", merchant: "Whole Foods Market", cat: "Food", val: "-$124.50", isSpend: true },
                          { date: "2026-06-01", merchant: "Landlord Rent Payment", cat: "Housing", val: "-$2,200.00", isSpend: true }
                        ].map((tx, idx) => (
                          <tr key={idx} className="border-b border-gray-100 dark:border-[#27272a]/50 text-xs hover:bg-gray-100/50 dark:hover:bg-zinc-800/30">
                            <td className="py-2.5 text-gray-400">{tx.date}</td>
                            <td className="py-2.5 font-semibold">{tx.merchant}</td>
                            <td className="py-2.5">
                              <span className="px-2 py-0.5 rounded-full text-[9px] bg-gray-200 dark:bg-zinc-800 text-gray-400">{tx.cat}</span>
                            </td>
                            <td className={`py-2.5 text-right font-bold ${tx.isSpend ? textDown : textUp}`}>{tx.val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 1: Market Terminal */}
          {!activeAgentChatId && activeTab === 1 && (
            <div className="flex h-full w-full overflow-hidden select-none">

              {/* ── LEFT PANEL: Watchlist (3-state collapsible) ── */}
              <div
                className={`h-full border-r border-gray-200 dark:border-[#27272a] bg-[#fafafa] dark:bg-[#121214] flex flex-col relative ${
                  isDraggingLeft ? "transition-none" : "transition-all duration-200"
                }`}
                style={{ width: leftPanel === "expanded" ? `${leftPanelWidth}px` : leftPanel === "icon" ? "3rem" : "1.25rem", overflow: "hidden" }}
              >
                {/* ── LEFT DRAG HANDLE ── */}
                {leftPanel === "expanded" && (
                  <div
                    onMouseDown={handleLeftDragStart}
                    className="absolute top-0 right-0 w-[5px] h-full cursor-col-resize hover:bg-emerald-500/30 transition-colors z-50 flex items-center justify-center group animate-none"
                    title="Drag to resize watchlist"
                  >
                    <div className="w-[1.5px] h-8 rounded bg-gray-300 dark:bg-zinc-700 group-hover:bg-emerald-500 transition-colors opacity-0 group-hover:opacity-100" />
                  </div>
                )}
                {/* Collapse toggle — sits on the right edge */}
                <button
                  onClick={() => setLeftPanel(cyclePanel(leftPanel))}
                  title={leftPanel === "expanded" ? "Collapse to icons" : leftPanel === "icon" ? "Hide panel" : "Expand panel"}
                  className="absolute top-3 right-1 z-10 w-5 h-5 rounded flex items-center justify-center bg-gray-200/80 dark:bg-zinc-700/80 hover:bg-emerald-500/20 hover:text-emerald-500 text-gray-400 transition-colors cursor-pointer"
                >
                  {leftPanel === "expanded"
                    ? <ChevronLeft className="w-3 h-3" />
                    : leftPanel === "icon"
                    ? <ChevronLeft className="w-3 h-3 opacity-50" />
                    : <ChevronRight className="w-3 h-3" />
                  }
                </button>

                {/* EXPANDED view */}
                {leftPanel === "expanded" && (
                  <div className="flex flex-col p-3 h-full">
                    <div className="flex justify-between items-center mb-3 pr-5">
                      <span className="font-bold text-sm">Watchlist</span>
                      <Plus className="w-4 h-4 text-gray-400 hover:text-emerald-500 cursor-pointer" />
                    </div>
                    <div className="flex gap-1 mb-3 overflow-x-auto text-[10px]">
                      {["ALL", "US", "HK", "CN", "Holdings"].map((tag, idx) => (
                        <span key={tag} className={`px-2 py-0.5 rounded cursor-pointer border ${idx === 0 ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500" : "border-gray-200 dark:border-[#27272a] text-gray-400"}`}>{tag}</span>
                      ))}
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-1">
                      {[
                        { symbol: "COIN", name: "Coinbase",        price: "168.62", chg: "-6.14%",  up: false, logo: "C", color: "bg-blue-600"   },
                        { symbol: "KO",   name: "Coca Cola",        price: "77.35",  chg: "+0.60%",  up: true,  logo: "K", color: "bg-red-600"    },
                        { symbol: "FIG",  name: "Figma",            price: "22.51",  chg: "+5.24%",  up: true,  logo: "F", color: "bg-orange-500"  },
                        { symbol: "TSLA", name: "Tesla",            price: "406.01", chg: "-3.78%",  up: false, logo: "T", color: "bg-red-700"    },
                        { symbol: "BABA", name: "Alibaba",          price: "159.14", chg: "-2.76%",  up: false, logo: "A", color: "bg-yellow-600" },
                        { symbol: "QQQ",  name: "Invesco QQQ",      price: "605.75", chg: "-0.82%",  up: false, logo: "Q", color: "bg-indigo-900" },
                        { symbol: "JNJ",  name: "Johnson & Johnson",price: "234.47", chg: "+0.59%",  up: true,  logo: "J", color: "bg-red-600"    },
                        { symbol: "WMT",  name: "Walmart",          price: "128.00", chg: "+0.23%",  up: true,  logo: "W", color: "bg-blue-500"   }
                      ].map((stock) => {
                        const isSelected = selectedStock === stock.symbol;
                        return (
                          <div key={stock.symbol}
                            onClick={() => { setSelectedStock(stock.symbol); setTradePrice(stock.price); }}
                            className={`flex justify-between items-center p-2 rounded-md cursor-pointer hover:bg-gray-200/50 dark:hover:bg-zinc-800/40 transition-colors ${isSelected ? "bg-gray-200/70 dark:bg-zinc-800/60" : ""}`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${stock.color}`}>{stock.logo}</div>
                              <div className="flex flex-col">
                                <span className="text-xs font-bold">{stock.symbol}</span>
                                <span className="text-[10px] text-gray-400">{stock.name}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-xs font-semibold">{stock.price}</span>
                              <span className={`text-[10px] font-medium ${stock.up ? textUp : textDown}`}>{stock.chg}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ICON STRIP view */}
                {leftPanel === "icon" && (
                  <div className="flex flex-col items-center pt-10 gap-2 px-1 overflow-y-auto">
                    {[
                      { symbol: "COIN", price: "168.62", up: false, logo: "C", color: "bg-blue-600"   },
                      { symbol: "KO",   price: "77.35",  up: true,  logo: "K", color: "bg-red-600"    },
                      { symbol: "FIG",  price: "22.51",  up: true,  logo: "F", color: "bg-orange-500"  },
                      { symbol: "TSLA", price: "406.01", up: false, logo: "T", color: "bg-red-700"    },
                      { symbol: "BABA", price: "159.14", up: false, logo: "A", color: "bg-yellow-600" },
                      { symbol: "QQQ",  price: "605.75", up: false, logo: "Q", color: "bg-indigo-900" },
                      { symbol: "JNJ",  price: "234.47", up: true,  logo: "J", color: "bg-red-600"    },
                      { symbol: "WMT",  price: "128.00", up: true,  logo: "W", color: "bg-blue-500"   }
                    ].map((stock) => (
                      <button key={stock.symbol}
                        onClick={() => { setSelectedStock(stock.symbol); setTradePrice(stock.price); }}
                        title={stock.symbol}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white cursor-pointer transition-all hover:scale-110 hover:ring-2 hover:ring-emerald-500 ${stock.color} ${ selectedStock === stock.symbol ? "ring-2 ring-emerald-500" : ""}`}
                      >
                        {stock.logo}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ── CENTER: Chart + Ledger ── */}
              <div className="flex-1 h-full flex flex-col min-w-0 bg-white dark:bg-[#09090b]">
                {/* Chart Box */}
                <div className="flex-1 border-b border-gray-200 dark:border-[#27272a] p-3 flex flex-col min-h-0">
                  <div className="flex justify-between items-center border-b border-gray-100 dark:border-[#27272a] pb-2 mb-2 text-xs">
                    <span className="font-bold text-sm">{selectedStock} Chart</span>
                    <div className="flex gap-3 text-gray-400">
                      <span className="hover:text-black dark:hover:text-white cursor-pointer font-medium">Options</span>
                      <span className="hover:text-black dark:hover:text-white cursor-pointer font-medium">News</span>
                      <span className="hover:text-black dark:hover:text-white cursor-pointer font-medium">Financials</span>
                    </div>
                  </div>
                  {/* TradingView Lightweight Charts */}
                  <div className="flex-1 min-h-0">
                    <TradingChart 
                      symbol={selectedStock} 
                      isDarkMode={isDarkMode} 
                      quoteColorUpGreen={quoteColorUpGreen} 
                      overlayBTC={chartShowOverlay}
                      showVolume={chartShowVolume}
                      showGrid={chartShowGrid}
                      enableCrosshair={chartEnableCrosshair}
                      extendedHours={chartExtendedHours}
                    />
                  </div>
                </div>

                {/* ── Drag handle for ledger ── */}
                <div
                  onMouseDown={handleLedgerDragStart}
                  className="h-[5px] cursor-row-resize bg-gray-200 dark:bg-[#27272a] hover:bg-emerald-500/50 transition-colors flex-shrink-0 flex items-center justify-center group"
                  title="Drag to resize ledger"
                >
                  <div className="w-8 h-[2px] rounded bg-gray-400 dark:bg-zinc-600 group-hover:bg-emerald-500 transition-colors" />
                </div>

                {/* Ledger Box */}
                <div className="p-3 flex flex-col bg-[#fafafa] dark:bg-[#121214] border-t border-gray-200 dark:border-[#27272a] flex-shrink-0" style={{ height: ledgerHeight }}>
                  <div className="flex gap-4 border-b border-gray-200 dark:border-[#27272a] pb-2 mb-2 text-xs">
                    {["Logged Orders", "Manual Holdings", "Record Entry"].map((lbl, idx) => {
                      const isActive = activeLedgerTab === idx;
                      return (
                        <span 
                          key={lbl} 
                          onClick={() => setActiveLedgerTab(idx)}
                          className={`cursor-pointer border-b-2 pb-1 font-semibold ${isActive ? "border-emerald-500 text-black dark:text-white" : "border-transparent text-gray-400"}`}
                        >
                          {lbl}
                        </span>
                      );
                    })}
                  </div>
                  <div className="flex-1 overflow-y-auto text-xs">
                    {activeLedgerTab === 0 ? (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-[#27272a] text-[10px] text-gray-400 dark:text-[#a1a1aa] font-bold uppercase">
                            <th className="pb-1.5">Action</th>
                            <th className="pb-1.5">Symbol</th>
                            <th className="pb-1.5">Name</th>
                            <th className="pb-1.5">Status</th>
                            <th className="pb-1.5">Type</th>
                            <th className="pb-1.5 text-right">Qty</th>
                            <th className="pb-1.5 text-right">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order, i) => (
                            <tr key={i} className="border-b border-gray-100 dark:border-[#27272a]/40 hover:bg-gray-100/50 dark:hover:bg-zinc-800/20">
                              <td className={`py-2 font-bold ${order.action === "Buy" ? textUp : textDown}`}>{order.action}</td>
                              <td className="py-2 font-semibold">{order.symbol}</td>
                              <td className="py-2 text-gray-400">{order.name}</td>
                              <td className={`py-2 ${textUp}`}>{order.status}</td>
                              <td className="py-2 text-gray-400">{order.type}</td>
                              <td className="py-2 text-right font-medium">{order.qty}</td>
                              <td className="py-2 text-right font-bold">{order.price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No manual ledger listings recorded.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ── RIGHT PANEL: Stats (3-state collapsible) ── */}
              <div
                className={`h-full border-l border-gray-200 dark:border-[#27272a] bg-[#fafafa] dark:bg-[#121214] flex flex-col relative ${
                  isDraggingRight ? "transition-none" : "transition-all duration-200"
                }`}
                style={{ width: rightPanel === "expanded" ? `${rightPanelWidth}px` : rightPanel === "icon" ? "3rem" : "1.25rem", overflow: "hidden" }}
              >
                {/* ── RIGHT DRAG HANDLE ── */}
                {rightPanel === "expanded" && (
                  <div
                    onMouseDown={handleRightDragStart}
                    className="absolute top-0 left-0 w-[5px] h-full cursor-col-resize hover:bg-emerald-500/30 transition-colors z-50 flex items-center justify-center group animate-none"
                    title="Drag to resize stats"
                  >
                    <div className="w-[1.5px] h-8 rounded bg-gray-300 dark:bg-zinc-700 group-hover:bg-emerald-500 transition-colors opacity-0 group-hover:opacity-100" />
                  </div>
                )}
                {/* Collapse toggle — sits on the left edge */}
                <button
                  onClick={() => setRightPanel(cyclePanel(rightPanel))}
                  title={rightPanel === "expanded" ? "Collapse to icon" : rightPanel === "icon" ? "Hide panel" : "Expand panel"}
                  className="absolute top-3 left-1 z-10 w-5 h-5 rounded flex items-center justify-center bg-gray-200/80 dark:bg-zinc-700/80 hover:bg-emerald-500/20 hover:text-emerald-500 text-gray-400 transition-colors cursor-pointer"
                >
                  {rightPanel === "expanded"
                    ? <ChevronRight className="w-3 h-3" />
                    : rightPanel === "icon"
                    ? <ChevronRight className="w-3 h-3 opacity-50" />
                    : <ChevronLeft className="w-3 h-3" />
                  }
                </button>

                {/* ICON STRIP — shows when collapsed to rail */}
                {rightPanel === "icon" && (
                  <div className="flex flex-col items-center justify-start pt-12 gap-4 h-full">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                    <div className="w-1 h-8 rounded bg-emerald-500/30" />
                    <span className="text-[8px] font-bold text-gray-400 rotate-90 whitespace-nowrap mt-2">{selectedStock}</span>
                  </div>
                )}

                {/* EXPANDED view — full stats panel */}
                {rightPanel === "expanded" && (() => {
                const data = stockData[selectedStock] || stockData.TSLA;
                const total = data.inflow + data.outflow;
                const circumference = 188.5;
                let accumulatedAngle = -90;
                
                const segments = [
                  { value: data.l_in, color: "#065f46" },  // Deep Emerald Inflow
                  { value: data.m_in, color: "#10b981" },  // Medium Emerald Inflow
                  { value: data.s_in, color: "#6ee7b7" },  // Light Emerald Inflow
                  { value: data.l_out, color: "#9f1239" }, // Deep Rose Outflow
                  { value: data.m_out, color: "#f43f5e" }, // Medium Rose Outflow
                  { value: data.s_out, color: "#fecdd3" }  // Light Rose Outflow
                ];
                
                const donutCircles = segments.map((seg, i) => {
                  const percentage = seg.value / total;
                  const angle = percentage * 360;
                  const offset = circumference - (circumference * percentage);
                  const rotation = accumulatedAngle;
                  accumulatedAngle += angle;
                  return (
                    <circle
                      key={i}
                      cx="50"
                      cy="50"
                      r="30"
                      fill="transparent"
                      stroke={seg.color}
                      strokeWidth="9"
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      transform={`rotate(${rotation} 50 50)`}
                      className="transition-all duration-500 ease-in-out"
                    />
                  );
                });

                const flowPoints = data.flowPoints;
                const minVal = Math.min(...flowPoints);
                const maxVal = Math.max(...flowPoints);
                const range = maxVal - minVal || 1;
                const linePoints = flowPoints.map((val, i) => {
                  const x = i * (268 / (flowPoints.length - 1));
                  const y = 80 - ((val - minVal) / range) * 55 - 10;
                  return { x, y };
                });
                const pathD = `M ${linePoints[0].x} ${linePoints[0].y} ` + linePoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ");
                const fillD = `${pathD} L ${linePoints[linePoints.length - 1].x} 90 L ${linePoints[0].x} 90 Z`;
                const isFlowPositive = data.netInflow >= 0;
                const strokeColor = isFlowPositive ? "#10b981" : "#f43f5e";
                const fillColor = isFlowPositive ? "url(#green-grad)" : "url(#red-grad)";

                return (
                  <div className="flex-1 h-full flex flex-col p-4 gap-5 overflow-y-auto">
                    {/* Ticker banner */}
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold">{selectedStock} Ticker</span>
                        <span className="text-[10px] text-gray-400 uppercase font-semibold">{selectedStock}.US</span>
                      </div>
                      <div className="flex gap-2 items-baseline mt-1">
                        <span className="text-2xl font-extrabold">{data.price}</span>
                        <span className={`text-xs font-bold ${data.up ? textUp : textDown}`}>{data.chg}</span>
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { l: "Open", v: data.open },
                        { l: "High", v: data.high },
                        { l: "Low", v: data.low },
                        { l: "Prev Close", v: data.prevClose },
                        { l: "Volume", v: data.volume },
                        { l: "Turnover", v: data.turnover }
                      ].map((grid, idx) => (
                        <div key={idx} className="p-2 border border-gray-200 dark:border-[#27272a]/40 rounded bg-white dark:bg-[#09090b]">
                          <p className="text-[10px] text-gray-400 font-semibold">{grid.l}</p>
                          <p className="font-extrabold mt-0.5 text-zinc-800 dark:text-zinc-200">{grid.v}</p>
                        </div>
                      ))}
                    </div>

                    {/* Quotes Spread */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Spread Quote Depth</span>
                      <div className="w-full h-2 rounded overflow-hidden flex">
                        <div className="w-[50%] h-full bg-emerald-500" />
                        <div className="w-[50%] h-full bg-rose-500" />
                      </div>
                      <div className="flex justify-between text-[9px] text-gray-400 font-bold uppercase">
                        <span>Bid 50%</span>
                        <span>Ask 50%</span>
                      </div>
                    </div>

                    {/* Transaction Statistics (Futu Moomoo Donut Chart) */}
                    <div className="space-y-2 border-t border-gray-200 dark:border-[#27272a]/60 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Transaction Statistics</span>
                        <span className="text-[9px] text-gray-400 font-bold">Unit: USD</span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {/* Donut Chart SVG */}
                        <div className="w-[90px] h-[90px] relative flex-shrink-0">
                          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                            {donutCircles}
                          </svg>
                          {/* Donut Center Overlay */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className={`text-[9px] font-extrabold ${data.netInflow >= 0 ? textUp : textDown}`}>
                              {data.netInflow >= 0 ? "+" : ""}{(data.netInflow / 1000).toFixed(0)}K
                            </span>
                            <span className="text-[7px] text-gray-400 uppercase font-bold leading-none">Net Flow</span>
                          </div>
                        </div>

                        {/* Statistics list */}
                        <div className="flex-1 min-w-0 text-[9px] grid grid-cols-2 gap-x-2 gap-y-1 select-none">
                          {/* Inflow Panel */}
                          <div className="space-y-0.5">
                            <span className={`font-extrabold text-[10px] ${textUp}`}>Inflow: {(data.inflow / 1000).toFixed(0)}K</span>
                            <div className={`pl-1 border-l space-y-0.5 text-[9px] text-gray-400 font-bold ${borderUpLight}`}>
                              <div>L: {(data.l_in / 1000).toFixed(0)}K</div>
                              <div>M: {(data.m_in / 1000).toFixed(0)}K</div>
                              <div>S: {(data.s_in / 1000).toFixed(0)}K</div>
                            </div>
                          </div>

                          {/* Outflow Panel */}
                          <div className="space-y-0.5">
                            <span className={`font-extrabold text-[10px] ${textDown}`}>Outflow: {(data.outflow / 1000).toFixed(0)}K</span>
                            <div className={`pl-1 border-l space-y-0.5 text-[9px] text-gray-400 font-bold ${borderDownLight}`}>
                              <div>L: {(data.l_out / 1000).toFixed(0)}K</div>
                              <div>M: {(data.m_out / 1000).toFixed(0)}K</div>
                              <div>S: {(data.s_out / 1000).toFixed(0)}K</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Real-Time Capital Flow (Futu Moomoo Line Chart) */}
                    <div className="space-y-2 border-t border-gray-200 dark:border-[#27272a]/60 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Real-Time Capital Flow</span>
                        <span className="text-[9px] text-gray-400 font-bold">Unit: USD</span>
                      </div>
                      
                      <div className="relative">
                        <svg viewBox="0 0 268 90" className="w-full h-24 bg-white dark:bg-[#09090b] rounded border border-gray-200 dark:border-[#27272a]/40 p-1">
                          <defs>
                            <linearGradient id="green-grad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2"/>
                              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0"/>
                            </linearGradient>
                            <linearGradient id="red-grad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.2"/>
                              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0"/>
                            </linearGradient>
                          </defs>
                          {/* Grid lines */}
                          <line x1="0" y1="20" x2="268" y2="20" stroke="#888888" strokeOpacity="0.07" strokeDasharray="3,3" />
                          <line x1="0" y1="45" x2="268" y2="45" stroke="#888888" strokeOpacity="0.07" strokeDasharray="3,3" />
                          <line x1="0" y1="70" x2="268" y2="70" stroke="#888888" strokeOpacity="0.07" strokeDasharray="3,3" />
                          
                          <path d={fillD} fill={fillColor} />
                          <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {/* Y-axis Labels overlay */}
                        <div className="absolute top-1 left-1.5 text-[8px] text-gray-400 font-bold bg-white/60 dark:bg-zinc-950/60 px-1 rounded pointer-events-none select-none">{data.flowMax}</div>
                        <div className="absolute bottom-6 left-1.5 text-[8px] text-gray-400 font-bold bg-white/60 dark:bg-zinc-950/60 px-1 rounded pointer-events-none select-none">{data.flowMin}</div>
                        
                        {/* Time X-axis Labels */}
                        <div className="flex justify-between text-[8px] text-gray-400 font-bold mt-1 px-1 select-none">
                          <span>09:30</span>
                          <span>12:00</span>
                          <span>16:00</span>
                        </div>
                      </div>

                      {/* Historical Capital Flow Bar Chart */}
                      <div className="space-y-1.5 mt-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Historical Capital Flow</span>
                        <div className="flex items-end justify-between h-9 bg-white dark:bg-[#09090b] rounded border border-gray-200 dark:border-[#27272a]/40 px-2 py-1 select-none">
                          {data.histBars.map((bar, i) => (
                            <div key={i} className="flex flex-col items-center justify-end h-full w-8">
                              <div 
                                className={`w-4 rounded-t ${bar.isUp ? "bg-emerald-500/80" : "bg-rose-500/80"}`} 
                                style={{ height: `${Math.abs(bar.value)}%` }} 
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between text-[7px] text-gray-400 font-bold uppercase px-0.5">
                          <span>5d ago</span>
                          <span>4d ago</span>
                          <span>3d ago</span>
                          <span>2d ago</span>
                          <span>Yesterday</span>
                        </div>
                      </div>
                    </div>

                    {/* Buy/Sell Log Form */}
                    <div className="space-y-3 p-3 border border-gray-200 dark:border-[#27272a] rounded-lg bg-white dark:bg-[#09090b]">
                      <span className="text-xs font-bold block border-b border-gray-100 dark:border-[#27272a] pb-1.5">Record Asset Transaction</span>
                      <div className="space-y-2">
                        <div>
                          <label className="text-[10px] text-gray-400 font-semibold uppercase block mb-1">Quantity</label>
                          <input 
                            type="number" 
                            value={tradeQty} 
                            onChange={(e) => setTradeQty(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded border border-gray-200 dark:border-[#27272a] bg-[#fafafa] dark:bg-[#09090b] focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 font-semibold uppercase block mb-1">Price (USD)</label>
                          <input 
                            type="number" 
                            value={tradePrice} 
                            onChange={(e) => setTradePrice(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded border border-gray-200 dark:border-[#27272a] bg-[#fafafa] dark:bg-[#09090b] focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button 
                          onClick={() => handleRecordTransaction("Buy")}
                          className="flex-1 py-2 rounded text-xs font-bold cursor-pointer transition-colors bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                        >
                          RECORD BUY
                        </button>
                        <button 
                          onClick={() => handleRecordTransaction("Sell")}
                          className="flex-1 py-2 rounded text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 cursor-pointer transition-colors"
                        >
                          RECORD SELL
                        </button>
                      </div>
                    </div>
                  </div>
                );
                })()} 
              </div>
            </div>
          )}

          {/* Tab 2: Crypto Portfolio */}
          {!activeAgentChatId && activeTab === 2 && (
            <div className="flex flex-col p-6 gap-6 max-w-6xl mx-auto w-full">
              <div>
                <h1 className="text-2xl font-bold">Crypto Portfolio</h1>
                <p className="text-sm text-gray-400 dark:text-[#a1a1aa] mt-1">Monitor holdings, asset allocation, and overall net worth progress.</p>
              </div>

              {/* Net Worth Summary Panel */}
              <div className="p-5 rounded-lg bg-gray-50 dark:bg-[#18181b] border border-gray-200 dark:border-[#27272a] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-xs text-gray-400 dark:text-[#a1a1aa] uppercase font-semibold">Total Crypto Net Worth</span>
                  <div className="flex items-baseline gap-3 mt-1.5">
                    <span className="text-3xl font-extrabold">
                      {portfolioSummary ? `$${portfolioSummary.net_worth.toLocaleString()}` : "$3,672,050"}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${bgUpLight}`}>+14.3% this week</span>
                  </div>
                </div>
                {/* Horizontal sparkline graph placeholder */}
                <div className="flex items-end gap-1.5 h-12">
                  {[20, 25, 23, 28, 35, 30, 42, 48, 45, 52, 60, 58, 65].map((h, i) => (
                    <div key={i} className="w-1.5 rounded-t" style={{ height: `${h}%`, backgroundColor: fillUp }} />
                  ))}
                </div>
              </div>

              {/* Splits Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Holdings Table */}
                <div className="flex flex-col lg:col-span-2 p-4 rounded-lg bg-gray-50 dark:bg-[#18181b] border border-gray-200 dark:border-[#27272a] h-[380px]">
                  <span className="font-bold text-sm mb-4">Current Balances</span>
                  <div className="flex-1 overflow-auto pr-1">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-[#27272a] text-[10px] text-gray-400 dark:text-[#a1a1aa] font-bold uppercase">
                          <th className="pb-2">Asset</th>
                          <th className="pb-2 text-right">Balance</th>
                          <th className="pb-2 text-right">Avg Cost</th>
                          <th className="pb-2 text-right">Current Price</th>
                          <th className="pb-2 text-right">Market Value</th>
                          <th className="pb-2 text-right">Unrealized P&L</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { sym: "BTC", name: "Bitcoin", bal: "2.1450", avg: "$67,420.00", cur: "$68,540.00", val: "$147,018.30", pl: "+$2,401.75 (+1.6%)", up: true },
                          { sym: "ETH", name: "Ethereum", bal: "15.8000", avg: "$3,520.00", cur: "$3,410.00", val: "$53,878.00", pl: "-$1,738.00 (-3.1%)", up: false },
                          { sym: "SUI", name: "Sui Network", bal: "18,450.00", avg: "$1.78", cur: "$2.05", val: "$37,822.50", pl: "+$4,981.50 (+15.1%)", up: true },
                          { sym: "SOL", name: "Solana", bal: "58.2000", avg: "$152.00", cur: "$165.12", val: "$9,610.32", pl: "+$763.50 (+8.6%)", up: true }
                        ].map((coin) => (
                          <tr key={coin.sym} className="border-b border-gray-100 dark:border-[#27272a]/55 hover:bg-gray-100/50 dark:hover:bg-zinc-800/30">
                            <td className="py-3">
                              <div className="flex flex-col">
                                <span className="font-bold">{coin.sym}</span>
                                <span className="text-[10px] text-gray-400">{coin.name}</span>
                              </div>
                            </td>
                            <td className="py-3 text-right font-medium">{coin.bal}</td>
                            <td className="py-3 text-right text-gray-400">{coin.avg}</td>
                            <td className="py-3 text-right font-semibold">{coin.cur}</td>
                            <td className="py-3 text-right font-bold">{coin.val}</td>
                            <td className={`py-3 text-right font-bold ${coin.up ? "text-emerald-500" : "text-rose-500"}`}>{coin.pl}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Allocations Card */}
                <div className="flex flex-col p-4 rounded-lg bg-gray-50 dark:bg-[#18181b] border border-gray-200 dark:border-[#27272a] h-[380px] justify-between">
                  <div className="flex flex-col w-full">
                    <span className="font-bold text-sm">Asset Allocation</span>
                    <p className="text-[10px] text-gray-400 mt-1">Verify asset deviation against target weights.</p>
                  </div>
                  <div className="space-y-4 my-4">
                    {[
                      { sym: "BTC", name: "Bitcoin", pct: "55.2%", width: "w-[55%]", color: "bg-[#f59e0b]" },
                      { sym: "ETH", name: "Ethereum", pct: "21.7%", width: "w-[21%]", color: "bg-[#6366f1]" },
                      { sym: "SUI", name: "Sui Network", pct: "15.2%", width: "w-[15%]", color: "bg-[#0ea5e9]" },
                      { sym: "SOL", name: "Solana", pct: "7.9%", width: "w-[8%]", color: "bg-[#a855f7]" }
                    ].map((alloc) => (
                      <div key={alloc.sym} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${alloc.color}`} />
                            {alloc.sym}
                          </span>
                          <span>{alloc.pct}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${alloc.color} ${alloc.width}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/10 text-[10px] text-emerald-500">
                    <span className="font-bold block">Portfolio Rebalance Alert</span>
                    <span className="mt-0.5 block">Your SUI holding has deviated by +5.2% from your 10% target allocation due to recent price performance.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Bull Run Prep */}
          {!activeAgentChatId && activeTab === 3 && (
            <div className="flex flex-col p-6 gap-6 max-w-6xl mx-auto w-full">
              <div>
                <h1 className="text-2xl font-bold">Bull Run Prep Planner</h1>
                <p className="text-sm text-gray-400 dark:text-[#a1a1aa] mt-1">Model liquidity crash events and plan your recovery path.</p>
              </div>

              {/* Scenarios & Planner Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Scenario Selector */}
                <div className="flex flex-col p-4 rounded-lg bg-gray-50 dark:bg-[#18181b] border border-gray-200 dark:border-[#27272a] h-[280px]">
                  <span className="font-bold text-sm mb-3">Historical Crash Selector</span>
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                    {[
                      { name: "Silicon Valley Bank Crash (Mar 2023)", btc: "-12.4%", alt: "-26.8%", mult: "2.16x" },
                      { name: "FTX Exchange Collapse (Nov 2022)", btc: "-22.1%", alt: "-48.5%", mult: "2.19x" },
                      { name: "COVID Liquidation Event (Mar 2020)", btc: "-50.3%", alt: "-75.0%", mult: "1.49x" }
                    ].map((sc, idx) => {
                      const isActive = selectedScenario === idx;
                      return (
                        <div 
                          key={idx}
                          onClick={() => setSelectedScenario(idx)}
                          className={`p-3 rounded-md border cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors ${isActive ? "border-emerald-500 bg-white dark:bg-[#09090b]" : "border-gray-200 dark:border-[#27272a] bg-transparent"}`}
                        >
                          <div className="flex justify-between items-center text-xs font-bold">
                            <span className="truncate pr-2">{sc.name}</span>
                            <span className={`text-[10px] border px-1.5 py-0.5 rounded whitespace-nowrap ${bgUpLight}`}>{sc.mult} Mult</span>
                          </div>
                          <div className="flex gap-4 text-[10px] text-gray-400 mt-2 font-medium">
                            <span>BTC Drop: <b className={textDown}>{sc.btc}</b></span>
                            <span>Alt Drop: <b className={textDown}>{sc.alt}</b></span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Path Planner */}
                <div className="flex flex-col p-4 rounded-lg bg-gray-50 dark:bg-[#18181b] border border-gray-200 dark:border-[#27272a] h-[280px] justify-between">
                  <span className="font-bold text-sm">Multiplier Path Planner</span>
                  <div className="flex gap-3 my-2">
                    <div className="flex-1">
                      <span className="text-[10px] text-gray-400 block mb-1">Start Capital</span>
                      <div className="p-2 rounded bg-white dark:bg-[#09090b] border border-gray-200 dark:border-[#27272a] text-xs font-bold">$100,000</div>
                    </div>
                    <div className="flex-1">
                      <span className="text-[10px] text-gray-400 block mb-1">Target Capital</span>
                      <div className="p-2 rounded bg-white dark:bg-[#09090b] border border-gray-200 dark:border-[#27272a] text-xs font-bold">$3,600,000</div>
                    </div>
                  </div>
                  <div className="p-3 bg-white dark:bg-[#09090b] border border-gray-200 dark:border-[#27272a] rounded flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-medium">Required Multiplier</span>
                    <span className="text-lg font-bold text-emerald-500">36.0x</span>
                  </div>
                  <div className="space-y-1.5 text-[10px] mt-2 font-semibold">
                    <div className="flex justify-between">
                      <span className="text-amber-500">BTC (50% Split)</span>
                      <span>Target: $150K (1.6x)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sky-500">SUI (50% Split)</span>
                      <span>Target: $18.00 (9.0x)</span>
                    </div>
                  </div>
                </div>

                {/* Timeline chart */}
                <div className="flex flex-col p-4 rounded-lg bg-gray-50 dark:bg-[#18181b] border border-gray-200 dark:border-[#27272a] h-[280px]">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-sm">Relative Recovery Timeline</span>
                    <span className="text-[10px] text-gray-400">15 Days Post-Crash</span>
                  </div>
                  <div className="flex-1 bg-white dark:bg-[#09090b] border border-gray-200 dark:border-[#27272a] rounded-lg relative p-3 flex flex-col justify-between overflow-hidden">
                    <div className="w-full h-full absolute top-0 left-0 flex flex-col justify-between py-4 opacity-15">
                      <div className="w-full h-[1px] bg-gray-400" />
                      <div className="w-full h-[1px] bg-gray-400" />
                      <div className="w-full h-[1px] bg-gray-400" />
                    </div>
                    {/* Recovery lines curves mockup */}
                    <div className="flex-1 w-full flex items-end justify-around relative z-10 px-2 pb-2">
                      {/* BTC Recovery Trend */}
                      <div className="absolute top-0 left-0 w-full h-full flex items-end justify-around px-4">
                        {scenarioData.btc.map((v, i) => {
                          const h = ((v + 30) / 60) * 100;
                          return (
                            <div key={i} className="w-1 bg-amber-500 opacity-60 rounded-t" style={{ height: `${h}%` }} />
                          );
                        })}
                      </div>
                      {/* SUI Recovery Trend */}
                      <div className="absolute top-0 left-0 w-full h-full flex items-end justify-around px-4 z-20">
                        {scenarioData.sui.map((v, i) => {
                          const h = ((v + 30) / 60) * 100;
                          return (
                            <div key={i} className="w-1 bg-sky-500 rounded-t" style={{ height: `${h}%` }} />
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex justify-center gap-4 text-[9px] text-gray-400 border-t border-gray-100 dark:border-zinc-800 pt-1">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> BTC</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-500" /> SUI</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recovery Delta Stats Table */}
              <div className="flex flex-col p-4 rounded-lg bg-gray-50 dark:bg-[#18181b] border border-gray-200 dark:border-[#27272a]">
                <span className="font-bold text-sm mb-4">Recovery Delta Analytics</span>
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-[#27272a] text-[10px] text-gray-400 dark:text-[#a1a1aa] font-bold uppercase">
                      <th className="pb-2">Metric Indicator</th>
                      <th className="pb-2 text-right">Bitcoin (BTC)</th>
                      <th className="pb-2 text-right">Sui (SUI)</th>
                      <th className="pb-2 text-right">Delta Multiplier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: "Max Drawdown from Peak", btc: scenarioData.btc_drop, sui: scenarioData.alt_drop, delta: `${scenarioData.multiplier} beta`, green: false },
                      { label: "Time to Local Bottom", btc: "4 Days", sui: "3 Days", delta: "-1 Day (Frontrun)", green: true },
                      { label: "Recovery to Pre-Crash Peak", btc: "18 Days", sui: "14 Days", delta: "+22% speedup", green: true },
                      { label: "10% BTC Gain Equivalence", btc: "10.0%", sui: `${(10.0 * parseFloat(scenarioData.multiplier)).toFixed(1)}%`, delta: `${scenarioData.multiplier} Multiplier`, green: true }
                    ].map((metric, idx) => (
                      <tr key={idx} className="border-b border-gray-100 dark:border-[#27272a]/45 hover:bg-gray-100/50 dark:hover:bg-zinc-800/20">
                        <td className="py-2.5 font-medium">{metric.label}</td>
                        <td className={`py-2.5 text-right font-bold ${metric.btc.includes("-") ? "text-rose-500" : ""}`}>{metric.btc}</td>
                        <td className={`py-2.5 text-right font-bold ${metric.sui.includes("-") ? "text-rose-500" : ""}`}>{metric.sui}</td>
                        <td className={`py-2.5 text-right font-bold ${metric.green ? "text-emerald-500" : "text-gray-400"}`}>{metric.delta}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 4: AI Analyst */}
          {!activeAgentChatId && activeTab === 4 && (
            <div className="flex flex-col h-full w-full p-4 gap-4 overflow-hidden font-sans">
              
              {/* Horizontal Pinned Agent Dashboard Panel */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Deployed AI Agents</span>
                <div className="flex gap-3.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-zinc-800">
                  {aiAgents.map(agent => {
                    const isPinned = pinnedAgentIds.includes(agent.id);
                    return (
                      <div key={agent.id} className="min-w-[210px] max-w-[240px] p-3 rounded-lg border border-gray-200 dark:border-[#27272a] bg-gray-50/50 dark:bg-zinc-950/20 flex flex-col justify-between flex-shrink-0 transition-shadow hover:shadow-sm">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2 min-w-0">
                            <AgentMascot name={agent.name} className="w-8 h-8 flex-shrink-0" />
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-bold truncate">{agent.name}</span>
                              <span className="text-[9px] text-gray-400 font-semibold truncate">{agent.aiModel}</span>
                            </div>
                          </div>
                          
                          {/* Pin / Unpin Toggle */}
                          <button
                            onClick={() => {
                              setPinnedAgentIds(prev => 
                                prev.includes(agent.id) 
                                  ? prev.filter(id => id !== agent.id) 
                                  : [...prev, agent.id]
                              );
                            }}
                            title={isPinned ? "Unpin from Sidebar" : "Pin to Sidebar"}
                            className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors ${isPinned ? "text-emerald-500" : "text-gray-400"}`}
                          >
                            <Star className="w-3.5 h-3.5 fill-current" style={{ fillOpacity: isPinned ? 1 : 0 }} />
                          </button>
                        </div>
                        
                        <p className="text-[10px] text-gray-400 dark:text-zinc-500 mt-2 line-clamp-2 min-h-[28px] font-medium leading-relaxed">
                          {agent.instructions}
                        </p>
                        
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500">Active</span>
                          <button
                            onClick={() => {
                              setActiveAgentChatId(agent.id);
                            }}
                            className="text-[10px] font-bold text-emerald-500 hover:text-emerald-600 flex items-center gap-0.5 cursor-pointer"
                          >
                            <span>Chat</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Plus card to deploy new agent */}
                  <button
                    onClick={() => {
                      setPreferencesActiveSection("ai_new_agent");
                      setShowPreferencesModal(true);
                      setIsSettingsDockedToSidebar(false);
                    }}
                    className="min-w-[150px] p-3 rounded-lg border border-dashed border-gray-300 dark:border-zinc-800 hover:border-emerald-500/50 bg-transparent flex flex-col items-center justify-center gap-1.5 flex-shrink-0 transition-colors cursor-pointer group"
                  >
                    <Plus className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                    <span className="text-[10px] font-bold text-gray-400 group-hover:text-emerald-500 transition-colors">Deploy Agent</span>
                  </button>
                </div>
              </div>

              {/* Lower Section: Orchestrator Terminal & Reports */}
              <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">
                {/* Chat Console */}
                <div className="flex-1 h-full rounded-lg border border-gray-250 dark:border-[#27272a] bg-gray-50 dark:bg-[#18181b] flex flex-col overflow-hidden">
                  <span className="font-bold text-sm p-4 border-b border-gray-250 dark:border-[#27272a] bg-[#fafafa] dark:bg-[#121214] flex justify-between items-center select-none">
                    <div className="flex items-center gap-2">
                      <OrchestratorMascot className="w-5 h-5 flex-shrink-0" />
                      <span>Orchestrator Terminal</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold">Main Hub</span>
                  </span>
                  
                  {/* Message Log */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, idx) => {
                      const isUser = msg.sender === "User";
                      const isSystem = msg.sender === "System";
                      return (
                        <div key={idx} className={`flex w-full gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}>
                          {!isUser && !isSystem && (
                            <OrchestratorMascot className="w-7 h-7 rounded-full flex-shrink-0 mt-0.5" />
                          )}
                          {isSystem && (
                            <div className="w-7 h-7 flex items-center justify-center text-gray-400 dark:text-zinc-500 flex-shrink-0">
                              <Info className="w-4 h-4" />
                            </div>
                          )}
                          <div className={`max-w-[80%] p-3 rounded-lg border text-xs leading-relaxed ${isUser ? "bg-emerald-500/10 border-emerald-500 text-black dark:text-[#f4f4f5]" : isSystem ? "bg-zinc-100 dark:bg-[#09090b] border-gray-200 dark:border-[#27272a] text-gray-400" : "bg-white dark:bg-[#09090b] border-gray-200 dark:border-[#27272a] text-black dark:text-[#f4f4f5]"}`}>
                            <div className="flex items-center gap-1.5 font-bold mb-1 border-b border-gray-100 dark:border-zinc-800 pb-0.5">
                              <span className={isUser ? "text-emerald-500" : "text-emerald-600 dark:text-emerald-400"}>{msg.sender}</span>
                            </div>
                            <p className="whitespace-pre-line font-medium">{msg.text}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Chat Input */}
                  <div className="p-3 border-t border-gray-250 dark:border-[#27272a] bg-[#fafafa] dark:bg-[#121214] flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Ask Orchestrator to run portfolio queries or query sub-agents..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSendChatMessage();
                      }}
                      className="flex-1 px-3 py-2 text-xs rounded-md border border-gray-250 dark:border-[#27272a] bg-white dark:bg-[#09090b] focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                    <button 
                      onClick={handleSendChatMessage}
                      className="p-2 bg-emerald-500 hover:bg-emerald-600 rounded-md text-white cursor-pointer transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Generated Reports */}
                <div className="w-[320px] h-full rounded-lg border border-gray-250 dark:border-[#27272a] bg-gray-50 dark:bg-[#18181b] flex flex-col p-4 overflow-hidden">
                  <span className="font-bold text-sm mb-4">Agent Reports</span>
                  <div className="flex-1 overflow-y-auto space-y-3">
                    {[
                      { title: "SUI vs BTC SVB Recovery Delta", desc: "Analyzes the 2.16x SUI multiplier during the SVB banking panic.", date: "June 13, 2026" },
                      { title: "Portfolio Rebalancing Signal", desc: "Report on current holdings deviation from targets.", date: "June 12, 2026" },
                      { title: "Multiplier Scenario Plan ($100K -> $3.6M)", desc: "Risk/reward assessment of target path distributions.", date: "June 10, 2026" }
                    ].map((rep, idx) => {
                      const isActive = selectedReport === idx;
                      return (
                        <div 
                          key={idx}
                          onClick={() => setSelectedReport(idx)}
                          className={`p-3 rounded-md border cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors ${isActive ? "border-emerald-500 bg-white dark:bg-[#09090b]" : "border-gray-200 dark:border-[#27272a] bg-transparent"}`}
                        >
                          <span className="text-xs font-bold block">{rep.title}</span>
                          <p className="text-[10px] text-gray-400 mt-1">{rep.desc}</p>
                          <div className="flex justify-between items-center mt-2.5 text-[9px] text-gray-400">
                            <span>{rep.date}</span>
                            <BookOpen className="w-3 h-3" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Settings */}
          {activeTab === 5 && (
            <div className="flex flex-col p-6 gap-6 max-w-6xl mx-auto w-full">
              <div>
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-sm text-gray-400 dark:text-[#a1a1aa] mt-1">Configure your tracker and workspace preferences.</p>
              </div>

              {/* Theme Settings Panel */}
              <div className="p-5 rounded-lg bg-gray-50 dark:bg-[#18181b] border border-gray-200 dark:border-[#27272a] max-w-md w-full">
                <span className="font-bold text-sm block">Aesthetics & Theme</span>
                <p className="text-[10px] text-gray-400 mt-1">Choose how the Libertrian interface appears on your system.</p>
                <div className="flex gap-4 mt-4">
                  {/* Dark Mode Button */}
                  <button 
                    onClick={() => setIsDarkMode(true)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md border cursor-pointer transition-all ${isDarkMode ? "border-emerald-500 bg-emerald-500/10 text-emerald-500 font-semibold" : "border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#09090b] text-gray-400 hover:text-black dark:hover:text-white"}`}
                  >
                    <Moon className="w-4 h-4" />
                    <span className="text-xs">Dark Mode</span>
                  </button>
                  {/* Light Mode Button */}
                  <button 
                    onClick={() => setIsDarkMode(false)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md border cursor-pointer transition-all ${!isDarkMode ? "border-emerald-500 bg-emerald-500/10 text-emerald-500 font-semibold" : "border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#09090b] text-gray-400 hover:text-black dark:hover:text-white"}`}
                  >
                    <Sun className="w-4 h-4" />
                    <span className="text-xs">Light Mode</span>
                  </button>
                </div>
              </div>

              {/* Terminal Security Panel */}
              <div className="p-5 rounded-lg bg-gray-50 dark:bg-[#18181b] border border-gray-200 dark:border-[#27272a] max-w-md w-full">
                <span className="font-bold text-sm block">Terminal Access & Security</span>
                <p className="text-[10px] text-gray-400 mt-1">Lock your terminal session to prevent unauthorized access.</p>
                <div className="mt-4">
                  <button 
                    onClick={() => {
                      setIsAuthSuccess(false);
                      setIsLoggedIn(false);
                      hasAutoPrompted.current = false;
                      setPassword("");
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-md border border-rose-500/30 hover:border-rose-500 bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 font-bold text-xs transition-all cursor-pointer"
                  >
                    <User className="w-4 h-4" />
                    <span>Lock Terminal Session</span>
                  </button>
                </div>
              </div>
            </div>
          )}

         </main>
        
        {/* Bottom Status Bar */}
        <footer className={`flex h-8 w-full border-t justify-between items-center px-4 text-[11px] select-none text-gray-500 dark:text-[#a1a1aa] z-30 transition-all duration-200 flex-shrink-0 ${tc.card} ${tc.border}`}>
          {/* Left: Sector Selector Dropdown & Sector Tickers */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              <button type="button" className={`flex items-center gap-1 font-bold px-2 py-0.5 rounded cursor-pointer transition-colors ${tc.badgeBg}`}>
                <span>{selectedSector}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>
              
              {/* Sector Dropdown Menu */}
              <div className="absolute left-0 bottom-7 scale-0 group-hover:scale-100 origin-bottom-left transition-all w-26 bg-white dark:bg-[#18181b] border border-gray-405 dark:border-zinc-700 rounded shadow-xl p-1.5 z-50 flex flex-col gap-0.5">
                {sectorsList.map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setSelectedSector(sec)}
                    className={`w-full text-left px-2 py-1 rounded text-[13px] font-semibold transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800 ${
                      selectedSector === sec ? "text-emerald-500 bg-emerald-500/5 font-bold" : "text-gray-600 dark:text-zinc-300"
                    }`}
                  >
                    {sec}
                  </button>
                ))}
                
                {/* Plus button to add custom category */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const name = prompt("Enter new category name:");
                    if (name && name.trim()) {
                      const cleanName = name.trim();
                      if (!sectorsList.includes(cleanName)) {
                        setSectorsList(prev => [...prev, cleanName]);
                        setSelectedSector(cleanName);
                      }
                    }
                  }}
                  className="w-full text-left px-2 py-1.5 rounded text-[11px] font-bold text-emerald-500 hover:bg-emerald-500/10 flex items-center gap-1 cursor-pointer border-t border-gray-200 dark:border-zinc-800/80 mt-1"
                >
                  <Plus className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Add Category</span>
                </button>
              </div>
            </div>
            
            {/* Sector Ticker Lists */}
            <div className="hidden sm:flex items-center gap-4 border-l border-gray-200 dark:border-zinc-800 pl-4">
              {(sectorData[selectedSector as keyof typeof sectorData] || sectorData["Layer 1"]).map((ticker) => {
                const tickerUp = quoteColorUpGreen ? ticker.up : !ticker.up;
                const colClass = tickerUp ? "text-emerald-500" : "text-rose-500";
                return (
                  <div key={ticker.sym} className="flex items-center gap-1.5 font-medium">
                    <span className="font-bold text-black dark:text-white">{ticker.sym}</span>
                    <span className="font-semibold">{ticker.val}</span>
                    <span className={`font-bold ${colClass}`}>{ticker.chg}</span>
                    <span className={`font-bold ${colClass}`}>{ticker.pct}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Right: Timezone, Connection Indicator, Refresh */}
          <div className="flex items-center gap-4">
            {/* Clock & Timezone selector */}
            <div className="relative group">
              <button type="button" className="flex items-center gap-1 font-semibold hover:text-black dark:hover:text-white cursor-pointer transition-colors">
                <span>{currentTime || "Loading..."}</span>
              </button>
              {/* Timezone dropdown selector */}
              <div className="absolute right-0 bottom-7 scale-0 group-hover:scale-100 origin-bottom-right transition-all w-28 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-[#27272a] rounded shadow-xl p-1 z-50 flex flex-col gap-0.5">
                {(["Local", "UTC", "EST", "PST"] as const).map((tz) => (
                  <button
                    key={tz}
                    type="button"
                    onClick={() => setSelectedTimezone(tz)}
                    className={`w-full text-left px-2 py-1 rounded text-[10px] font-semibold transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800 ${
                      selectedTimezone === tz ? "text-emerald-500 bg-emerald-500/5 font-bold" : "text-gray-600 dark:text-zinc-300"
                    }`}
                  >
                    {tz === "Local" ? "Local Time" : tz}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Connection Indicator */}
            <div className="flex items-center gap-1.5">
              <button 
                type="button"
                onClick={() => setConnectionStatus(prev => prev === "Connected" ? "Disconnected" : "Connected")}
                className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer"
              >
                <span className={`w-2 h-2 rounded-full inline-block relative ${connectionStatus === "Connected" ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-rose-500 shadow-[0_0_8px_#f43f5e]"}`}>
                  {connectionStatus === "Connected" && <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />}
                </span>
                <span className="font-bold text-[10px]">{connectionStatus === "Connected" ? "China Mainland" : "Disconnected"}</span>
              </button>
            </div>
            
            {/* Refresh Button */}
            <button 
              type="button"
              onClick={() => {
                setConnectionStatus("Connected");
              }}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-gray-400 hover:text-black dark:hover:text-white"
              title="Refresh Quotes"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </footer>
      </div> {/* Closing Right side container */}
    </div> {/* Closing Main Container */}

      {/* Preferences Modal Overlay */}
      {showPreferencesModal && (
        <div 
          className={`fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[100] font-sans transition-opacity duration-300 ${
            (isModalMinimized || isSettingsDockedToSidebar) ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
          }`}
        >
          {/* Overlay click to dock to sidebar — sits behind modal */}
          <div className="absolute inset-0 z-0" onClick={() => setIsSettingsDockedToSidebar(true)} />
          
          <div 
            style={{ 
              transform: isModalMinimized 
                ? "translate(35vw, 35vh) scale(0.05)" 
                : isSettingsDockedToSidebar
                  ? "translate(-45vw, 35vh) scale(0.05)"
                  : isModalMaximized 
                    ? "none" 
                    : `translate(${modalOffset.x}px, ${modalOffset.y}px)`,
              width: isModalMaximized ? "100%" : `${preferencesModalWidth}px`,
              height: isModalMaximized ? "100%" : `${preferencesModalHeight}px`,
              transition: (isModalBeingDragged || isModalBeingResized) ? "none" : "transform 0.35s cubic-bezier(0.25, 1, 0.5, 1), width 0.35s cubic-bezier(0.25, 1, 0.5, 1), height 0.35s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease"
            }}
            className={`bg-white dark:bg-[#18181b] shadow-2xl flex flex-col overflow-hidden text-[#0f0f0f] dark:text-[#f4f4f5] z-10 relative ${
              (isModalMinimized || isSettingsDockedToSidebar)
                ? "opacity-0 pointer-events-none"
                : isModalMaximized 
                  ? "w-full h-full rounded-none border-none" 
                  : "border border-gray-300 dark:border-[#27272a] rounded-xl"
            }`}
          >
            {/* macOS-style Header / Grab Handle for dragging */}
            <div 
              onMouseDown={handleModalDragStart}
              className="h-10 border-b border-gray-100 dark:border-[#27272a] bg-gray-50 dark:bg-[#121214] flex items-center justify-between px-4 select-none cursor-grab active:cursor-grabbing flex-shrink-0 relative"
            >
              {/* Left side: Traffic Lights */}
              <div className="flex gap-1.5 items-center group/lights">
                <button 
                  type="button"
                  onClick={() => { setShowPreferencesModal(false); setIsModalMaximized(false); setIsSettingsDockedToSidebar(false); setModalOffset({ x: 0, y: 0 }); }} 
                  style={{ width: "12px", height: "12px" }}
                  className="rounded-full bg-[#ff5f56] flex items-center justify-center border border-[#e0443e] cursor-pointer relative transition-all"
                  title="Close Settings (Escape)"
                >
                  <svg className="w-1.5 h-1.5 opacity-0 group-hover/lights:opacity-100 transition-opacity text-[#4c0002]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
                <button 
                  type="button"
                  onClick={() => setIsModalMinimized(true)}
                  style={{ width: "12px", height: "12px" }}
                  className="rounded-full bg-[#ffbd2e] flex items-center justify-center border border-[#dca124] cursor-pointer relative transition-all"
                  title="Minimize Settings"
                >
                  <svg className="w-2 h-0.5 opacity-0 group-hover/lights:opacity-100 transition-opacity text-[#5c3e00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
                <button 
                  type="button"
                  onClick={() => { setIsModalMaximized(prev => !prev); if (!isModalMaximized) setModalOffset({ x: 0, y: 0 }); }}
                  style={{ width: "12px", height: "12px" }}
                  className="rounded-full bg-[#27c93f] flex items-center justify-center border border-[#1a9c2b] cursor-pointer relative transition-all"
                  title={isModalMaximized ? "Restore Window Size" : "Maximize Settings"}
                >
                  <svg className="w-1.5 h-1.5 opacity-0 group-hover/lights:opacity-100 transition-opacity text-[#003300]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <polyline points="9 21 3 21 3 15"></polyline>
                    <line x1="21" y1="3" x2="3" y2="21"></line>
                  </svg>
                </button>
              </div>

              {/* Title */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-semibold text-[11px] text-gray-500 dark:text-zinc-400 tracking-wide">
                {getPreferencesSectionTitle()}
              </div>

              {/* Empty right area to balance */}
              <div className="w-[60px]" />
            </div>

            {/* Main content body container */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Sidebar inside preferences modal */}
              <div 
                style={{ width: isSettingsSidebarCollapsed ? "52px" : `${settingsSidebarWidth}px`, minWidth: isSettingsSidebarCollapsed ? "52px" : "160px" }}
                className="bg-gray-50 dark:bg-[#121214] border-r border-gray-200 dark:border-[#27272a] flex flex-col select-none text-xs relative flex-shrink-0"
              >
                {/* Collapse toggle button */}
                <button
                  type="button"
                  onClick={() => setIsSettingsSidebarCollapsed(prev => !prev)}
                  title={isSettingsSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                  className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 flex items-center justify-center shadow-sm hover:bg-gray-100 dark:hover:bg-zinc-700 cursor-pointer transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-gray-500">
                    {isSettingsSidebarCollapsed 
                      ? <><polyline points="9 18 15 12 9 6"></polyline></>
                      : <><polyline points="15 18 9 12 15 6"></polyline></>
                    }
                  </svg>
                </button>
                {/* Resize drag handle — 4px hit zone at the very right edge, only when expanded (NO GREEN HIGHLIGHT) */}
                {!isSettingsSidebarCollapsed && (
                  <div
                    onMouseDown={handleSettingsSidebarDragStart}
                    className="absolute right-0 top-0 bottom-0 w-[4px] cursor-col-resize z-30"
                    style={{ cursor: "col-resize" }}
                  >
                    <div className="absolute inset-0 bg-transparent" />
                  </div>
                )}
                
                <div className={`flex flex-col flex-1 overflow-hidden ${isSettingsSidebarCollapsed ? "p-2 pt-4 items-center" : "p-4 pr-3"}`}>
                  {/* Search input box — hidden when collapsed */}
                  {!isSettingsSidebarCollapsed && (
                    <div className="mb-4 relative">
                      <input 
                        type="text" 
                        placeholder="Search..."
                        value={settingsSearchQuery}
                        onChange={(e) => setSettingsSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs rounded bg-white dark:bg-[#09090b] border border-gray-200 dark:border-[#27272a] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                    </div>
                  )}
              
              {/* Navigation list */}
              <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                {(() => {
                  const navigationTree = [
                    {
                      id: "account",
                      label: "Account Preference",
                      icon: User,
                      children: [
                        { id: "account_details", label: "Account" },
                        { id: "account_password", label: "Password" }
                      ]
                    },
                    {
                      id: "ai",
                      label: "AI Settings",
                      icon: Bot,
                      children: [
                        { id: "ai_new_agent", label: "+ New Agent" },
                        ...aiAgents.map(agent => ({
                          id: `agent_group_${agent.id}`,
                          label: agent.name,
                          isAgentGroup: true,
                          agentId: agent.id,
                          children: [
                            { id: `ai_config_${agent.id}`, label: "Agent Config" },
                            { id: `ai_model_${agent.id}`, label: "Model API" }
                          ]
                        }))
                      ]
                    },
                    {
                      id: "general",
                      label: "General",
                      icon: Settings,
                      children: [
                        { id: "general_basic", label: "General" },
                        { id: "general_sound", label: "Sound" }
                      ]
                    },
                    {
                      id: "quotes",
                      label: "Quotes",
                      icon: TrendingUp
                    },
                    {
                      id: "chart",
                      label: "Chart Settings",
                      icon: FolderHeart,
                      children: [
                        { id: "chart_main", label: "Main Chart" },
                        { id: "chart_extended", label: "Extended Trading Hours Chart" },
                        { id: "chart_intraday", label: "Intraday" },
                        { id: "chart_trade", label: "Trade" }
                      ]
                    },
                    {
                      id: "developer",
                      label: "Developer",
                      icon: Bot
                    }
                  ];

                  const filterTree = (nodes: any[]) => {
                    if (!settingsSearchQuery) return nodes;
                    const query = settingsSearchQuery.toLowerCase();
                    return nodes.map(node => {
                      if (node.label.toLowerCase().includes(query)) {
                        return node;
                      }
                      if (node.children) {
                        const matchingChildren = node.children.filter((child: any) => {
                          if (child.isAgentGroup) {
                            return child.label.toLowerCase().includes(query) || 
                              child.children.some((sc: any) => sc.label.toLowerCase().includes(query));
                          }
                          return child.label.toLowerCase().includes(query);
                        });
                        if (matchingChildren.length > 0) {
                          return { ...node, children: matchingChildren };
                        }
                      }
                      return null;
                    }).filter(Boolean);
                  };

                  const isExpanded = (nodeId: string) => {
                    if (settingsSearchQuery) return true;
                    return preferencesExpanded[nodeId as keyof typeof preferencesExpanded] ?? false;
                  };

                  const handleParentClick = (node: any) => {
                    if (node.children) {
                      setPreferencesExpanded(prev => ({
                        ...prev,
                        [node.id]: !prev[node.id as keyof typeof preferencesExpanded]
                      }));
                      setPreferencesActiveSection(node.children[0].id);
                    } else {
                      setPreferencesActiveSection(node.id);
                    }
                  };

                  const handleChildClick = (childId: string) => {
                    setPreferencesActiveSection(childId);
                  };

                  const filtered = filterTree(navigationTree);

                  // Collapsed icon-only mode
                  if (isSettingsSidebarCollapsed) {
                    return navigationTree.map(node => {
                      const IconComp = node.icon;
                      const isActive = preferencesActiveSection === node.id || 
                        (node.children && node.children.some((c: any) => c.id === preferencesActiveSection || preferencesActiveSection.startsWith(`ai_config_`) || preferencesActiveSection.startsWith(`ai_model_`)));
                      return (
                        <button
                          key={node.id}
                          type="button"
                          onClick={() => handleParentClick(node)}
                          title={node.label}
                          className={`w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                            isActive 
                              ? "bg-gray-200/80 dark:bg-zinc-800 text-gray-900 dark:text-white" 
                              : "hover:bg-gray-100 dark:hover:bg-zinc-800/50 text-gray-400 dark:text-zinc-500"
                          }`}
                        >
                          <IconComp className="w-4 h-4" />
                        </button>
                      );
                    });
                  }

                  if (filtered.length === 0) {
                    return (
                      <div className="text-center text-gray-400 dark:text-zinc-500 py-4 font-semibold text-[10px]">
                        No settings found
                      </div>
                    );
                  }

                  return filtered.map(node => {
                    const IconComp = node.icon;
                    const hasChildren = !!node.children;
                    const expanded = isExpanded(node.id);
                    const isParentActive = preferencesActiveSection === node.id || 
                      (node.children && node.children.some((c: any) => {
                        if (c.isAgentGroup) {
                          return preferencesActiveSection.endsWith(c.agentId);
                        }
                        return c.id === preferencesActiveSection;
                      }));

                    return (
                      <div key={node.id} className="flex flex-col space-y-0.5">
                        <button
                          type="button"
                          onClick={() => handleParentClick(node)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                            isParentActive 
                              ? "bg-gray-200/80 dark:bg-zinc-800 text-black dark:text-white font-bold" 
                              : "hover:bg-gray-100 dark:hover:bg-zinc-800/50 text-gray-600 dark:text-zinc-300 font-semibold"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <IconComp className="w-3.5 h-3.5 text-gray-400" />
                            <span>{node.label}</span>
                          </div>
                          {hasChildren && (
                            <div 
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreferencesExpanded(prev => ({
                                  ...prev,
                                  [node.id]: !prev[node.id as keyof typeof preferencesExpanded]
                                }));
                              }}
                              className="p-0.5 hover:bg-gray-300/40 dark:hover:bg-zinc-700/40 rounded cursor-pointer animate-none"
                            >
                              {expanded ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
                            </div>
                          )}
                        </button>

                        {hasChildren && expanded && (
                          <div className="pl-4 mt-0.5 flex flex-col space-y-0.5 border-l border-gray-200/60 dark:border-zinc-800 ml-4">
                            {node.children.map((child: any) => {
                              if (child.isAgentGroup) {
                                const isAgentExpanded = preferencesExpanded[child.id as keyof typeof preferencesExpanded] ?? false;
                                const isAgentActive = preferencesActiveSection.endsWith(child.agentId);
                                return (
                                  <div key={child.id} className="flex flex-col space-y-0.5">
                                    <button
                                      key={child.id}
                                      type="button"
                                      onClick={() => {
                                        setPreferencesExpanded(prev => ({
                                          ...prev,
                                          [child.id]: !prev[child.id as keyof typeof preferencesExpanded]
                                        }));
                                        setPreferencesActiveSection(`ai_config_${child.agentId}`);
                                      }}
                                      className={`w-full flex items-center justify-between px-2.5 py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                                        isAgentActive 
                                          ? "bg-gray-200 dark:bg-zinc-800 text-black dark:text-white font-bold" 
                                          : "hover:bg-gray-100 dark:hover:bg-zinc-800/40 text-gray-500 dark:text-zinc-400 font-semibold"
                                      }`}
                                    >
                                      <span>{child.label}</span>
                                      <div>
                                        {isAgentExpanded ? <ChevronDown className="w-3 h-3 text-gray-400" /> : <ChevronRight className="w-3 h-3 text-gray-400" />}
                                      </div>
                                    </button>
                                    {isAgentExpanded && (
                                      <div className="pl-3 mt-0.5 flex flex-col space-y-0.5 border-l border-gray-250/50 dark:border-zinc-850 ml-2 animate-none">
                                        {child.children.map((subChild: any) => {
                                          const isSubActive = preferencesActiveSection === subChild.id;
                                          return (
                                            <button
                                              key={subChild.id}
                                              type="button"
                                              onClick={() => setPreferencesActiveSection(subChild.id)}
                                              className={`w-full text-left px-2 py-0.5 rounded text-[10px] transition-colors cursor-pointer ${
                                                isSubActive 
                                                  ? "bg-emerald-500/10 text-emerald-500 font-bold" 
                                                  : "hover:bg-gray-105 dark:hover:bg-zinc-800/30 text-gray-450 dark:text-zinc-500 font-semibold"
                                              }`}
                                            >
                                              {subChild.label}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                );
                              } else {
                                const isChildActive = preferencesActiveSection === child.id;
                                return (
                                  <button
                                    key={child.id}
                                    type="button"
                                    onClick={() => handleChildClick(child.id)}
                                    className={`w-full text-left px-2.5 py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                                      isChildActive 
                                        ? "bg-emerald-500/10 text-emerald-500 font-bold" 
                                        : "hover:bg-gray-100 dark:hover:bg-zinc-800/40 text-gray-500 dark:text-zinc-400 font-semibold"
                                    }`}
                                  >
                                    {child.label}
                                  </button>
                                );
                              }
                            })}
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
              </div>
            </div>
            
            {/* Right Content panel */}
            <div className="flex-1 flex flex-col overflow-y-auto p-6 bg-white dark:bg-[#18181b]">
              {renderPreferencesContent()}
            </div>

            {/* Custom Resizing Edge & Corner Handles */}
            {!isModalMaximized && (
              <>
                {/* Right Edge handle */}
                <div 
                  onMouseDown={(e) => handleModalResizeStart(e, "width")}
                  className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize z-[1000] bg-transparent"
                  title="Drag to resize width"
                />
                {/* Bottom Edge handle */}
                <div 
                  onMouseDown={(e) => handleModalResizeStart(e, "height")}
                  className="absolute bottom-0 left-0 right-0 h-1.5 cursor-row-resize z-[1000] bg-transparent"
                  title="Drag to resize height"
                />
                {/* Bottom-right Corner handle */}
                <div 
                  onMouseDown={(e) => handleModalResizeStart(e, "both")}
                  className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-[1001] bg-transparent"
                  title="Drag to resize window"
                />
              </>
            )}
            </div>
          </div>
        </div>
      )}

      {/* Minimized Restore Settings Badge */}
      {showPreferencesModal && isModalMinimized && (
        <button 
          onClick={() => setIsModalMinimized(false)}
          className="fixed bottom-4 right-4 z-[120] w-12 h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center border border-emerald-400 cursor-pointer transition-all animate-bounce"
          title="Restore Settings"
        >
          <Settings className="w-5 h-5 animate-spin flex-shrink-0" style={{ animationDuration: "6s" }} />
        </button>
      )}

      {/* Centered Floating Theme Selection Modal */}
      {showThemeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[110] font-sans">
          {/* Overlay click to dismiss */}
          <div className="absolute inset-0" onClick={() => setShowThemeModal(false)} />
          
          <div className="w-[380px] bg-white dark:bg-[#18181b] border border-gray-300 dark:border-[#27272a] rounded-xl shadow-2xl flex flex-col z-10 overflow-hidden text-[#0f0f0f] dark:text-[#f4f4f5]">
            {/* Magnifying glass search bar */}
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 border-b border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/20">
              <Search className="w-4 h-4 text-gray-400" />
              <input 
                type="text"
                placeholder="Search..."
                value={themeSearchQuery}
                onChange={(e) => setThemeSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-xs focus:outline-none placeholder-gray-400 text-gray-700 dark:text-gray-200 font-semibold"
              />
            </div>
            
            {/* Theme list */}
            <div className="flex-1 overflow-y-auto max-h-[360px] p-2 space-y-0.5">
              {Object.entries(themes)
                .filter(([tName]) => {
                  const cleanName = tName.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
                  return cleanName.toLowerCase().includes(themeSearchQuery.toLowerCase());
                })
                .map(([tName, tConfig]) => {
                  const isActiveTheme = activeTheme === tName;
                  const cleanName = tName.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
                  return (
                    <button
                      key={tName}
                      type="button"
                      onClick={() => {
                        setActiveTheme(tName);
                        setIsDarkMode(tConfig.isDark);
                        setShowThemeModal(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-left hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors font-semibold cursor-pointer ${
                        isActiveTheme ? "text-emerald-500 font-bold bg-emerald-500/5" : "text-gray-700 dark:text-zinc-300"
                      }`}
                    >
                      <span className="truncate">{cleanName}</span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[9px] px-1.5 py-0.5 rounded border border-gray-200 dark:border-zinc-700 text-gray-400 bg-gray-50/50 dark:bg-zinc-900/30 font-bold">
                          {tConfig.isDark ? "Dark" : "Light"}
                        </span>
                        {isActiveTheme && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}
      {hoveredTooltip && (
        <div 
          style={{ 
            position: "fixed", 
            left: `${hoveredTooltip.rect.right + 8}px`, 
            top: `${hoveredTooltip.rect.top + (hoveredTooltip.rect.height / 2)}px`,
            transform: "translateY(-50%)"
          }}
          className="z-[9999] bg-white text-zinc-900 border border-gray-250 dark:bg-zinc-950 dark:text-zinc-50 dark:border-zinc-800 text-[10.5px] font-bold px-2.5 py-1 rounded-md shadow-md pointer-events-none whitespace-nowrap font-sans transition-all duration-150"
        >
          {hoveredTooltip.text}
        </div>
      )}
    </div>
  );
}
