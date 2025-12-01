"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Eye,
  Zap,
  Skull,
  Lock,
  Cpu,
  Shield,
  AlertTriangle,
  Binary,
  GitBranch,
  Hash,
  Layers,
  Brain,
  Bug,
  Database,
  Network,
  HelpCircle,
  Clock,
  Lightbulb,
  Timer,
} from "lucide-react"

interface GameState {
  currentScreen: "intro" | "levelSelect" | "game" | "terminal" | "escape" | "gameOver"
  currentLevel: number
  health: number
  fragments: string[]
  solvedPuzzles: number
  glitchLevel: number
  enemyPositions: Array<{
    x: number
    y: number
    id: string
    type: "scanner" | "hunter" | "corruptor" | "virus" | "phantom"
  }>
  playerHidden: boolean
  levelProgress: number[]
  timeRemaining: number
  isLevelComplete: boolean
  failureCount: number
  hintsUsed: number
  timerExtensions: number
  showHint: boolean
  currentHint: string
  hintLevel: number
  stealthEnergy: number
}

interface LevelConfig {
  id: number
  name: string
  description: string
  difficulty: "Easy" | "Medium" | "Hard" | "Extreme" | "Nightmare" | "Impossible" | "Legendary"
  puzzleType:
  | "codeFragment"
  | "logicGate"
  | "memorySequence"
  | "algorithmReconstruction"
  | "terminalHacking"
  | "binaryTree"
  | "graphTraversal"
  | "hashTable"
  | "dynamicProgramming"
  | "multiAlgorithm"
  | "stackOverflow"
  | "linkedListCorruption"
  | "recursionLoop"
  | "databaseCorruption"
  | "networkProtocol"
  enemyCount: number
  timeLimit: number
  corruptionRate: number
  requiredScore: number
  corruptionType: string
}

const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: "INITIALIZATION ERROR",
    description: "Basic system corruption detected. Restore simple code fragments to prevent cascade failure.",
    difficulty: "Easy",
    puzzleType: "codeFragment",
    enemyCount: 1,
    timeLimit: 120,
    corruptionRate: 0.1,
    requiredScore: 1,
    corruptionType: "startup_failure",
  },
  {
    id: 2,
    name: "LOGIC GATE MALFUNCTION",
    description: "Circuit pathways corrupted. Repair logic sequences under surveillance.",
    difficulty: "Medium",
    puzzleType: "logicGate",
    enemyCount: 2,
    timeLimit: 90,
    corruptionRate: 0.2,
    requiredScore: 3,
    corruptionType: "circuit_damage",
  },
  {
    id: 3,
    name: "MEMORY FRAGMENTATION",
    description: "Neural pathways scrambled. Reconstruct memory patterns while evading hunters.",
    difficulty: "Hard",
    puzzleType: "memorySequence",
    enemyCount: 3,
    timeLimit: 75,
    corruptionRate: 0.3,
    requiredScore: 5,
    corruptionType: "memory_leak",
  },
  {
    id: 4,
    name: "SORTING ALGORITHM CHAOS",
    description: "Core sorting functions destroyed. Rebuild algorithms before data becomes irretrievable.",
    difficulty: "Extreme",
    puzzleType: "algorithmReconstruction",
    enemyCount: 4,
    timeLimit: 90,
    corruptionRate: 0.4,
    requiredScore: 8,
    corruptionType: "algorithm_decay",
  },
  {
    id: 5,
    name: "KERNEL PANIC",
    description: "System core compromised. Execute emergency protocols before total collapse.",
    difficulty: "Nightmare",
    puzzleType: "terminalHacking",
    enemyCount: 5,
    timeLimit: 60,
    corruptionRate: 0.5,
    requiredScore: 12,
    corruptionType: "kernel_breach",
  },
  {
    id: 6,
    name: "TREE STRUCTURE COLLAPSE",
    description: "Hierarchical data corrupted. Navigate through broken tree structures to restore order.",
    difficulty: "Extreme",
    puzzleType: "binaryTree",
    enemyCount: 4,
    timeLimit: 100,
    corruptionRate: 0.4,
    requiredScore: 15,
    corruptionType: "tree_corruption",
  },
  {
    id: 7,
    name: "NETWORK TOPOLOGY BREACH",
    description: "Connection matrices compromised. Restore pathways through the corrupted network.",
    difficulty: "Nightmare",
    puzzleType: "graphTraversal",
    enemyCount: 5,
    timeLimit: 85,
    corruptionRate: 0.5,
    requiredScore: 18,
    corruptionType: "network_failure",
  },
  {
    id: 8,
    name: "HASH COLLISION CASCADE",
    description: "Data indexing systems failing. Resolve collisions before information becomes lost forever.",
    difficulty: "Impossible",
    puzzleType: "hashTable",
    enemyCount: 6,
    timeLimit: 70,
    corruptionRate: 0.6,
    requiredScore: 22,
    corruptionType: "hash_breakdown",
  },
  {
    id: 9,
    name: "RECURSIVE STACK OVERFLOW",
    description: "Function calls spiraling out of control. Implement memoization to prevent infinite loops.",
    difficulty: "Impossible",
    puzzleType: "dynamicProgramming",
    enemyCount: 7,
    timeLimit: 65,
    corruptionRate: 0.7,
    requiredScore: 25,
    corruptionType: "recursion_bomb",
  },
  {
    id: 10,
    name: "STACK FRAME CORRUPTION",
    description: "Call stack integrity compromised. Restore proper stack operations before system crash.",
    difficulty: "Nightmare",
    puzzleType: "stackOverflow",
    enemyCount: 6,
    timeLimit: 80,
    corruptionRate: 0.6,
    requiredScore: 28,
    corruptionType: "stack_breach",
  },
  {
    id: 11,
    name: "LINKED LIST FRAGMENTATION",
    description: "Pointer chains severed. Reconnect broken links while avoiding data hunters.",
    difficulty: "Impossible",
    puzzleType: "linkedListCorruption",
    enemyCount: 7,
    timeLimit: 75,
    corruptionRate: 0.7,
    requiredScore: 30,
    corruptionType: "pointer_chaos",
  },
  {
    id: 12,
    name: "INFINITE RECURSION TRAP",
    description: "Functions calling themselves endlessly. Break the cycle before stack explosion.",
    difficulty: "Impossible",
    puzzleType: "recursionLoop",
    enemyCount: 8,
    timeLimit: 70,
    corruptionRate: 0.8,
    requiredScore: 32,
    corruptionType: "recursion_hell",
  },
  {
    id: 13,
    name: "DATABASE INTEGRITY FAILURE",
    description: "Relational structures corrupted. Restore database queries and relationships.",
    difficulty: "Legendary",
    puzzleType: "databaseCorruption",
    enemyCount: 8,
    timeLimit: 90,
    corruptionRate: 0.7,
    requiredScore: 35,
    corruptionType: "db_meltdown",
  },
  {
    id: 14,
    name: "PROTOCOL STACK MELTDOWN",
    description: "Network layers collapsing. Rebuild communication protocols layer by layer.",
    difficulty: "Legendary",
    puzzleType: "networkProtocol",
    enemyCount: 9,
    timeLimit: 85,
    corruptionRate: 0.8,
    requiredScore: 38,
    corruptionType: "protocol_decay",
  },
  {
    id: 15,
    name: "SYSTEM SINGULARITY",
    description: "All subsystems failing simultaneously. Master every corruption type to escape the void.",
    difficulty: "Legendary",
    puzzleType: "multiAlgorithm",
    enemyCount: 10,
    timeLimit: 120,
    corruptionRate: 0.9,
    requiredScore: 40,
    corruptionType: "total_collapse",
  },
]

// Hint system data
const HINTS: Record<string, string[]> = {
  codeFragment: [
    "💡 Try to arrange the code lines in logical execution order",
    "🔍 Look for function declaration, condition check, and return statements",
    "⚡ The function should start with 'function escape()' and end with the closing brace",
  ],
  logicGate: [
    "💡 Remember basic logic: AND needs both inputs true, OR needs at least one true",
    "🔍 NOT gate inverts the input, XOR is true when inputs are different",
    "⚡ Check each gate type carefully - AND, OR, NOT, XOR have different rules",
  ],
  memorySequence: [
    "💡 Watch the sequence carefully and memorize the pattern",
    "🔍 Click the colors in the exact same order they were shown",
    "⚡ If you make a mistake, the sequence resets - start over from the beginning",
  ],
  algorithmReconstruction: [
    "💡 Bubble sort compares adjacent elements and swaps them if they're in wrong order",
    "🔍 The outer loop controls passes, inner loop does the comparisons",
    "⚡ Structure: function declaration → outer loop → inner loop → comparison → swap → return",
  ],
  terminalHacking: [
    "💡 Follow the command sequence shown at the bottom of the terminal",
    "🔍 Start with 'scan' to detect threats, then 'isolate' them",
    "⚡ Complete sequence: scan → isolate → purge → restore",
  ],
  binaryTree: [
    "💡 In-order traversal visits: left subtree → root → right subtree",
    "🔍 Start from the leftmost node and work your way up and right",
    "⚡ Correct order: 20, 30, 40, 50, 60, 70, 80",
  ],
  graphTraversal: [
    "💡 Find the shortest path from A to F through the network",
    "🔍 Look for direct connections between nodes",
    "⚡ Optimal path: A → C → F (only 3 steps)",
  ],
  hashTable: [
    "💡 Use linear probing to resolve hash collisions",
    "🔍 If a slot is occupied, try the next available slot",
    "⚡ Place each key in the first empty slot after its hash position",
  ],
  dynamicProgramming: [
    "💡 Break down the fibonacci calculation step by step",
    "🔍 Each step shows how larger problems depend on smaller ones",
    "⚡ Follow the recursive breakdown from fib(8) down to base cases",
  ],
  stackOverflow: [
    "💡 Execute stack operations in the given sequence",
    "🔍 Push adds elements to top, pop removes from top",
    "⚡ Follow each operation carefully and watch the stack state change",
  ],
  linkedListCorruption: [
    "💡 Reconnect the nodes in alphabetical order: A→B→C→D",
    "🔍 Click the connection buttons to link nodes together",
    "⚡ Each node should point to the next one in sequence",
  ],
  recursionLoop: [
    "💡 Trace through the factorial calculation step by step",
    "🔍 Each recursive call multiplies by the current number",
    "⚡ Follow the pattern: 4! = 4 × 3 × 2 × 1 = 24",
  ],
  databaseCorruption: [
    "💡 Execute the SQL queries in order to restore database integrity",
    "🔍 First query filters users, second query joins tables",
    "⚡ Click EXECUTE on each query when it becomes available",
  ],
  networkProtocol: [
    "💡 Repair the corrupted OSI layers (highlighted in red)",
    "🔍 Click REPAIR on layers that show corruption",
    "⚡ Focus on layers 3, 5, and 7 (Network, Session, Application)",
  ],
  multiAlgorithm: [
    "💡 Complete each algorithm challenge in sequence",
    "🔍 Start with sorting, then search, tree, graph, and hash",
    "⚡ Each challenge tests a different computer science concept",
  ],
}

export default function GhostFrame() {
  const [gameState, setGameState] = useState<GameState>({
    currentScreen: "intro",
    currentLevel: 1,
    health: 100,
    fragments: [],
    solvedPuzzles: 0,
    glitchLevel: 1,
    enemyPositions: [],
    playerHidden: false,
    levelProgress: Array(15).fill(0),
    timeRemaining: 120,
    isLevelComplete: false,
    failureCount: 0,
    hintsUsed: 0,
    timerExtensions: 0,
    showHint: false,
    currentHint: "",
    hintLevel: 0,
    stealthEnergy: 100,
  })

  const [glitchIntensity, setGlitchIntensity] = useState(0.3)
  const [terminalInput, setTerminalInput] = useState("")
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "GHOSTFRAME OS v1.0.4",
    "Initializing secure connection...",
    "Connection established.",
    "Awaiting command input...",
  ])
  const [currentPuzzleData, setCurrentPuzzleData] = useState<any>({})

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!terminalInput.trim()) return

    const command = terminalInput.trim().toLowerCase()
    setTerminalOutput((prev) => [...prev, `> ${command}`])

    if (command === "help") {
      setTerminalOutput((prev) => [...prev, "Available commands: scan, isolate, purge, restore"])
    } else if (command === "clear") {
      setTerminalOutput([])
    } else {
      handlePuzzleAction("command", command)
    }

    setTerminalInput("")
  }

  const audioRef = useRef<HTMLAudioElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  const playSynthSound = (type: "hover" | "click" | "success" | "error" | "glitch" | "gamestart") => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    const ctx = audioContextRef.current
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    const now = ctx.currentTime

    switch (type) {
      case "hover":
        osc.type = "sine"
        osc.frequency.setValueAtTime(440, now)
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.05)
        gain.gain.setValueAtTime(0.05, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)
        osc.start(now)
        osc.stop(now + 0.05)
        break

      case "click":
        osc.type = "square"
        osc.frequency.setValueAtTime(880, now)
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.1)
        gain.gain.setValueAtTime(0.1, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)
        osc.start(now)
        osc.stop(now + 0.1)
        break

      case "success":
        osc.type = "triangle"
        osc.frequency.setValueAtTime(440, now)
        osc.frequency.setValueAtTime(554, now + 0.1) // C#
        osc.frequency.setValueAtTime(659, now + 0.2) // E
        gain.gain.setValueAtTime(0.1, now)
        gain.gain.linearRampToValueAtTime(0.1, now + 0.3)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6)
        osc.start(now)
        osc.stop(now + 0.6)
        break

      case "error":
        osc.type = "sawtooth"
        osc.frequency.setValueAtTime(110, now)
        osc.frequency.linearRampToValueAtTime(55, now + 0.3)
        gain.gain.setValueAtTime(0.2, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
        osc.start(now)
        osc.stop(now + 0.3)
        break

      case "glitch":
        osc.type = "sawtooth"
        osc.frequency.setValueAtTime(Math.random() * 1000 + 100, now)
        osc.frequency.linearRampToValueAtTime(Math.random() * 1000 + 100, now + 0.1)
        gain.gain.setValueAtTime(0.1, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)
        osc.start(now)
        osc.stop(now + 0.1)
        break

      case "gamestart":
        osc.type = "sine"
        osc.frequency.setValueAtTime(220, now)
        osc.frequency.exponentialRampToValueAtTime(880, now + 1)
        gain.gain.setValueAtTime(0.3, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5)
        osc.start(now)
        osc.stop(now + 1.5)
        break
    }
  }

  const currentLevelConfig = LEVELS[gameState.currentLevel - 1]



  // Hint system functions

  const getHint = (puzzleType: string, level: number) => {
    // Dynamic hints based on puzzle state
    if (puzzleType === "codeFragment") {
      const { currentOrder, fragments } = currentPuzzleData
      if (!currentOrder || !fragments) return "💡 Arrange the code lines to form a valid function."

      const firstLine = fragments[currentOrder[0]]
      const lastLine = fragments[currentOrder[currentOrder.length - 1]]

      if (!firstLine.includes("function escape()")) {
        return "💡 The function must start with the definition: 'function escape() {'"
      }
      if (lastLine.trim() !== "}") {
        return "💡 The function must end with a closing brace '}'"
      }
      // Check for return true inside if
      const ifIndex = currentOrder.findIndex((idx: number) => fragments[idx].includes("if (corruption"))
      const returnTrueIndex = currentOrder.findIndex((idx: number) => fragments[idx].includes("return true"))

      if (ifIndex !== -1 && returnTrueIndex !== -1 && returnTrueIndex !== ifIndex + 1) {
        return "💡 The 'return true' statement should be immediately inside the 'if' block."
      }

      return "💡 Ensure the logic flows correctly: check condition -> return true -> otherwise return false."
    }

    if (puzzleType === "logicGate") {
      const { gates } = currentPuzzleData
      if (!gates) return "💡 Solve each logic gate to proceed."

      const unsolvedGate = gates.find((g: any) => g.output === null)
      if (unsolvedGate) {
        const { type, inputs, id } = unsolvedGate
        const inputStr = inputs.map((i: boolean) => i ? "TRUE" : "FALSE").join(" and ")

        if (type === "AND") return `💡 Gate ${id} (AND): Returns TRUE only if BOTH inputs are TRUE.`
        if (type === "OR") return `💡 Gate ${id} (OR): Returns TRUE if AT LEAST ONE input is TRUE.`
        if (type === "NOT") return `💡 Gate ${id} (NOT): Inverts the input (TRUE becomes FALSE).`
        if (type === "XOR") return `💡 Gate ${id} (XOR): Returns TRUE if inputs are DIFFERENT.`
      }
      return "💡 Check your logic tables. AND needs both, OR needs one, XOR needs different inputs."
    }

    if (puzzleType === "memorySequence") {
      return "💡 Focus on the pattern. The sequence adds one new color each round. 0=Red, 1=Blue, 2=Green, 3=Yellow."
    }

    const hints = HINTS[puzzleType] || ["💡 Analyze the problem carefully and try different approaches"]
    return hints[Math.min(level, hints.length - 1)]
  }

  const showHintSystem = () => {
    const hint = getHint(currentLevelConfig.puzzleType, gameState.hintLevel)
    setGameState((prev) => ({
      ...prev,
      showHint: true,
      currentHint: hint,
      hintsUsed: prev.hintsUsed + 1,
      hintLevel: Math.min(prev.hintLevel + 1, 2),
    }))
  }

  const extendTimer = () => {
    const extension = gameState.timerExtensions === 0 ? 60 : 30 // First extension is 60s, subsequent are 30s
    setGameState((prev) => ({
      ...prev,
      timeRemaining: prev.timeRemaining + extension,
      timerExtensions: prev.timerExtensions + 1,
    }))
  }

  // Timer system
  useEffect(() => {
    if (gameState.currentScreen === "game" && !gameState.isLevelComplete) {
      timerRef.current = setInterval(() => {
        setGameState((prev) => {
          const newTime = prev.timeRemaining - 1
          if (newTime <= 0) {
            return { ...prev, currentScreen: "gameOver", timeRemaining: 0 }
          }
          return { ...prev, timeRemaining: newTime }
        })
      }, 1000)

      return () => {
        if (timerRef.current) clearInterval(timerRef.current)
      }
    }
  }, [gameState.currentScreen, gameState.isLevelComplete])

  // Enemy spawning and movement
  useEffect(() => {
    if (gameState.currentScreen === "game" && currentLevelConfig) {
      const spawnEnemies = () => {
        const enemyTypes = ["scanner", "hunter", "corruptor", "virus", "phantom"] as const
        const enemies = Array.from({ length: currentLevelConfig.enemyCount }, (_, i) => ({
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10,
          id: `enemy-${i}`,
          type: enemyTypes[
            Math.floor(Math.random() * Math.min(enemyTypes.length, Math.floor(currentLevelConfig.id / 3) + 2))
          ],
        }))

        setGameState((prev) => ({ ...prev, enemyPositions: enemies }))
      }

      spawnEnemies()

      const moveInterval = setInterval(
        () => {
          setGameState((prev) => ({
            ...prev,
            enemyPositions: prev.enemyPositions.map((enemy) => {
              // If player is hidden, enemies wander randomly instead of chasing
              if (prev.playerHidden) {
                return {
                  ...enemy,
                  x: Math.max(5, Math.min(95, enemy.x + (Math.random() - 0.5) * 20)),
                  y: Math.max(5, Math.min(95, enemy.y + (Math.random() - 0.5) * 20)),
                }
              }
              // Normal movement logic (simplified chase behavior for now)
              return {
                ...enemy,
                x: Math.max(5, Math.min(95, enemy.x + (Math.random() - 0.5) * 25)),
                y: Math.max(5, Math.min(95, enemy.y + (Math.random() - 0.5) * 25)),
              }
            }),
          }))
        },
        Math.max(400, 2000 - currentLevelConfig.id * 100),
      )

      return () => clearInterval(moveInterval)
    }
  }, [gameState.currentScreen, currentLevelConfig])

  // Stealth Energy System
  useEffect(() => {
    if (gameState.currentScreen === "game") {
      const stealthInterval = setInterval(() => {
        setGameState((prev) => {
          if (prev.playerHidden) {
            const newEnergy = Math.max(0, prev.stealthEnergy - 2) // Drain 2% per tick
            if (newEnergy === 0) {
              return { ...prev, stealthEnergy: 0, playerHidden: false } // Force visible
            }
            return { ...prev, stealthEnergy: newEnergy }
          } else {
            return { ...prev, stealthEnergy: Math.min(100, prev.stealthEnergy + 1) } // Regen 1% per tick
          }
        })
      }, 100) // Run every 100ms

      return () => clearInterval(stealthInterval)
    }
  }, [gameState.currentScreen])

  // Dynamic corruption
  useEffect(() => {
    if (gameState.currentScreen === "game" && currentLevelConfig) {
      const corruptionInterval = setInterval(() => {
        setGlitchIntensity((prev) => Math.min(1, prev + currentLevelConfig.corruptionRate * 0.05))
      }, 1000)

      return () => clearInterval(corruptionInterval)
    }
  }, [gameState.currentScreen, currentLevelConfig])

  const initializeLevel = (levelId: number) => {
    const config = LEVELS[levelId - 1]
    setGameState((prev) => ({
      ...prev,
      currentLevel: levelId,
      currentScreen: "game",
      timeRemaining: config.timeLimit,
      health: 100,
      isLevelComplete: false,
      enemyPositions: [],
      failureCount: 0,
      hintsUsed: 0,
      timerExtensions: 0,
      showHint: false,
      currentHint: "",
      hintLevel: 0,
      stealthEnergy: 100,
    }))
    setGlitchIntensity(0.2 + (levelId - 1) * 0.04)
    initializePuzzle(config.puzzleType, levelId)
  }

  const initializePuzzle = (puzzleType: string, level: number) => {
    switch (puzzleType) {
      case "codeFragment":
        setCurrentPuzzleData({
          fragments: [
            "function escape() {",
            "  if (corruption.level < 50) {",
            "    return true;",
            "}",
            "  return false;",
            "}",
          ],
          correctOrder: [0, 1, 2, 3, 4, 5],
          currentOrder: [5, 2, 0, 4, 1, 3],
        })
        break

      case "logicGate":
        setCurrentPuzzleData({
          gates: [
            { type: "AND", inputs: [true, false], output: null, id: 1 },
            { type: "OR", inputs: [false, true], output: null, id: 2 },
            { type: "NOT", inputs: [true], output: null, id: 3 },
            { type: "XOR", inputs: [true, true], output: null, id: 4 },
          ],
          solved: 0,
          required: 4,
        })
        break

      case "memorySequence":
        const sequence = Array.from({ length: 4 + Math.floor(level / 2) }, () => Math.floor(Math.random() * 4))
        setCurrentPuzzleData({
          sequence,
          playerSequence: [],
          showingSequence: true,
          currentStep: 0,
        })
        break

      case "algorithmReconstruction":
        setCurrentPuzzleData({
          algorithm: [
            "function bubbleSort(arr) {",
            "  for (let i = 0; i < arr.length; i++) {",
            "    for (let j = 0; j < arr.length - i - 1; j++) {",
            "      if (arr[j] > arr[j + 1]) {",
            "        let temp = arr[j];",
            "        arr[j] = arr[j + 1];",
            "        arr[j + 1] = temp;",
            "      }",
            "    }",
            "  }",
            "  return arr;",
            "}",
          ],
          correctOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          currentOrder: [11, 3, 1, 6, 0, 9, 4, 7, 2, 5, 8, 10],
        })
        break

      case "binaryTree":
        setCurrentPuzzleData({
          tree: {
            value: 50,
            left: { value: 30, left: { value: 20 }, right: { value: 40 } },
            right: { value: 70, left: { value: 60 }, right: { value: 80 } },
          },
          traversalType: "inorder",
          correctSequence: [20, 30, 40, 50, 60, 70, 80],
          playerSequence: [],
          currentNode: null,
        })
        break

      case "graphTraversal":
        setCurrentPuzzleData({
          graph: {
            A: ["B", "C"],
            B: ["A", "D", "E"],
            C: ["A", "F"],
            D: ["B"],
            E: ["B", "F"],
            F: ["C", "E"],
          },
          startNode: "A",
          targetNode: "F",
          correctPath: ["A", "C", "F"],
          playerPath: [],
          currentNode: "A",
        })
        break

      case "hashTable":
        setCurrentPuzzleData({
          hashTable: Array(7).fill(null),
          collisions: [
            { key: "data_01", hash: 1 },
            { key: "data_08", hash: 1 },
            { key: "data_03", hash: 3 },
            { key: "data_10", hash: 3 },
          ],
          resolved: 0,
          required: 4,
        })
        break

      case "dynamicProgramming":
        setCurrentPuzzleData({
          problem: "fibonacci",
          n: 8,
          memoTable: {},
          steps: [],
          correctSteps: [
            "fib(8) = fib(7) + fib(6)",
            "fib(7) = fib(6) + fib(5)",
            "fib(6) = fib(5) + fib(4)",
            "fib(5) = fib(4) + fib(3)",
            "fib(4) = fib(3) + fib(2)",
            "fib(3) = fib(2) + fib(1)",
            "fib(2) = 1, fib(1) = 1",
          ],
          currentStep: 0,
        })
        break

      case "stackOverflow":
        setCurrentPuzzleData({
          stack: [],
          operations: ["push(5)", "push(3)", "pop()", "push(7)", "pop()", "push(1)"],
          correctResult: [5, 1],
          currentOperation: 0,
        })
        break

      case "linkedListCorruption":
        setCurrentPuzzleData({
          nodes: [
            { value: "A", next: null, id: 1 },
            { value: "B", next: null, id: 2 },
            { value: "C", next: null, id: 3 },
            { value: "D", next: null, id: 4 },
          ],
          correctConnections: [
            { from: 1, to: 2 },
            { from: 2, to: 3 },
            { from: 3, to: 4 },
          ],
          playerConnections: [],
        })
        break

      case "recursionLoop":
        setCurrentPuzzleData({
          recursionSteps: [
            "factorial(4)",
            "4 * factorial(3)",
            "4 * 3 * factorial(2)",
            "4 * 3 * 2 * factorial(1)",
            "4 * 3 * 2 * 1",
            "24",
          ],
          currentStep: 0,
          playerSteps: [],
        })
        break

      case "databaseCorruption":
        setCurrentPuzzleData({
          tables: {
            users: [
              { id: 1, name: "Alice", age: 25 },
              { id: 2, name: "Bob", age: 30 },
            ],
            orders: [
              { id: 1, user_id: 1, product: "Laptop" },
              { id: 2, user_id: 2, product: "Phone" },
            ],
          },
          queries: [
            "SELECT * FROM users WHERE age > 25",
            "SELECT u.name, o.product FROM users u JOIN orders o ON u.id = o.user_id",
          ],
          currentQuery: 0,
          solved: 0,
        })
        break

      case "networkProtocol":
        setCurrentPuzzleData({
          layers: ["Physical", "Data Link", "Network", "Transport", "Session", "Presentation", "Application"],
          corruptedLayers: [2, 4, 6],
          repairedLayers: [],
          currentLayer: 0,
        })
        break

      case "multiAlgorithm":
        setCurrentPuzzleData({
          challenges: [
            { type: "sort", data: [64, 34, 25, 12, 22, 11, 90], solved: false },
            { type: "search", data: [1, 3, 5, 7, 9, 11, 13], target: 7, solved: false },
            { type: "tree", data: "balance", solved: false },
            { type: "graph", data: "shortest_path", solved: false },
            { type: "hash", data: "collision_resolution", solved: false },
          ],
          currentChallenge: 0,
          totalSolved: 0,
        })
        break

      case "terminalHacking":
        setTerminalOutput([
          "CRITICAL SYSTEM FAILURE DETECTED",
          "INITIATING EMERGENCY PROTOCOLS...",
          "MULTIPLE SECURITY BREACHES ACTIVE",
          "TIME TO TOTAL SYSTEM COLLAPSE: " + LEVELS[level - 1].timeLimit + " SECONDS",
          "",
          "Available commands: scan, isolate, purge, restore, escape",
        ])
        setCurrentPuzzleData({
          commandsExecuted: [],
          requiredCommands: ["scan", "isolate", "purge", "restore"],
          currentStep: 0,
        })
        break
    }
  }

  const handlePuzzleAction = (action: string, data?: any) => {
    const config = LEVELS[gameState.currentLevel - 1]

    switch (config.puzzleType) {
      case "codeFragment":
        if (action === "reorder") {
          setCurrentPuzzleData((prev: any) => ({ ...prev, currentOrder: data }))
        } else if (action === "check") {
          const currentContent = currentPuzzleData.currentOrder.map(
            (index: number) => currentPuzzleData.fragments[index],
          )
          const correctContent = currentPuzzleData.correctOrder.map(
            (index: number) => currentPuzzleData.fragments[index],
          )
          const isCorrect = JSON.stringify(currentContent) === JSON.stringify(correctContent)

          if (isCorrect) {
            playSynthSound("success")
            completeLevel()
          } else {
            playSynthSound("error")
            takeDamage(10)
            incrementFailureCount()
          }
        }
        break

      case "algorithmReconstruction":
        if (action === "reorder") {
          setCurrentPuzzleData((prev: any) => ({ ...prev, currentOrder: data }))
        } else if (action === "check") {
          const isCorrect =
            JSON.stringify(currentPuzzleData.currentOrder) === JSON.stringify(currentPuzzleData.correctOrder)
          if (isCorrect) {
            completeLevel()
          } else {
            takeDamage(15)
            incrementFailureCount()
          }
        }
        break

      case "stackOverflow":
        if (action === "execute") {
          const operation = currentPuzzleData.operations[currentPuzzleData.currentOperation]
          const newStack = [...currentPuzzleData.stack]

          if (operation.startsWith("push")) {
            const value = Number.parseInt(operation.match(/\d+/)[0])
            newStack.push(value)
          } else if (operation === "pop()") {
            newStack.pop()
          }

          setCurrentPuzzleData((prev: any) => ({
            ...prev,
            stack: newStack,
            currentOperation: prev.currentOperation + 1,
          }))

          if (currentPuzzleData.currentOperation + 1 >= currentPuzzleData.operations.length) {
            const isCorrect = JSON.stringify(newStack) === JSON.stringify(currentPuzzleData.correctResult)
            if (isCorrect) {
              completeLevel()
            } else {
              takeDamage(20)
              incrementFailureCount()
            }
          }
        }
        break

      case "linkedListCorruption":
        if (action === "connect") {
          const newConnections = [...currentPuzzleData.playerConnections, data]
          setCurrentPuzzleData((prev: any) => ({ ...prev, playerConnections: newConnections }))

          if (newConnections.length === currentPuzzleData.correctConnections.length) {
            const isCorrect =
              JSON.stringify(newConnections.sort()) === JSON.stringify(currentPuzzleData.correctConnections.sort())
            if (isCorrect) {
              completeLevel()
            } else {
              takeDamage(25)
              incrementFailureCount()
              setCurrentPuzzleData((prev: any) => ({ ...prev, playerConnections: [] }))
            }
          }
        }
        break

      case "recursionLoop":
        if (action === "step") {
          const isCorrect = data === currentPuzzleData.recursionSteps[currentPuzzleData.currentStep]
          if (isCorrect) {
            setCurrentPuzzleData((prev: any) => ({
              ...prev,
              currentStep: prev.currentStep + 1,
              playerSteps: [...prev.playerSteps, data],
            }))

            if (currentPuzzleData.currentStep + 1 >= currentPuzzleData.recursionSteps.length) {
              completeLevel()
            }
          } else {
            takeDamage(30)
          }
        }
        break

      case "hashTable":
        if (action === "resolve") {
          const { key, position } = data
          const collision = currentPuzzleData.collisions.find((c: any) => c.key === key)
          if (collision && position >= 0 && position < 7) {
            setCurrentPuzzleData((prev: any) => ({
              ...prev,
              resolved: prev.resolved + 1,
              hashTable: prev.hashTable.map((item: any, idx: number) => (idx === position ? key : item)),
            }))

            if (currentPuzzleData.resolved + 1 >= currentPuzzleData.required) {
              completeLevel()
            }
          } else {
            takeDamage(20)
            incrementFailureCount()
          }
        }
        break

      case "dynamicProgramming":
        if (action === "step") {
          const isCorrect = data === currentPuzzleData.correctSteps[currentPuzzleData.currentStep]
          if (isCorrect) {
            setCurrentPuzzleData((prev: any) => ({
              ...prev,
              currentStep: prev.currentStep + 1,
              steps: [...prev.steps, data],
            }))

            if (currentPuzzleData.currentStep + 1 >= currentPuzzleData.correctSteps.length) {
              completeLevel()
            }
          } else {
            takeDamage(25)
            incrementFailureCount()
          }
        }
        break

      case "multiAlgorithm":
        if (action === "solve") {
          setCurrentPuzzleData((prev: any) => ({
            ...prev,
            totalSolved: prev.totalSolved + 1,
            challenges: prev.challenges.map((c: any, idx: number) => (idx === prev.currentChallenge ? { ...c, solved: true } : c)),
            currentChallenge: prev.currentChallenge + 1,
          }))

          if (currentPuzzleData.totalSolved + 1 >= currentPuzzleData.challenges.length) {
            completeLevel()
          }
        }
        break

      case "terminalHacking":
        if (action === "command") {
          const command = data.toLowerCase().trim()
          const requiredCommands = currentPuzzleData.requiredCommands
          const currentStep = currentPuzzleData.currentStep

          if (command === requiredCommands[currentStep]) {
            const newStep = currentStep + 1
            playSynthSound("success")
            setTerminalOutput((prev) => [...prev, `[SUCCESS] Command '${command}' executed successfully.`])

            setCurrentPuzzleData((prev: any) => ({
              ...prev,
              commandsExecuted: [...prev.commandsExecuted, command],
              currentStep: newStep,
            }))

            if (newStep >= requiredCommands.length) {
              setTerminalOutput((prev) => [...prev, "[SYSTEM] ROOT ACCESS GRANTED. SYSTEM RESTORED."])
              completeLevel()
            }
          } else {
            playSynthSound("error")
            takeDamage(10)
            incrementFailureCount()
            setTerminalOutput((prev) => [...prev, `[ERROR] Invalid command sequence. Expected '${requiredCommands[currentStep]}'.`])
          }
        }
        break
    }
  }

  function incrementFailureCount() {
    setGameState((prev) => ({ ...prev, failureCount: prev.failureCount + 1 }))
  }

  function takeDamage(amount: number) {
    playSynthSound("glitch")
    setGameState((prev) => {
      const newHealth = Math.max(0, prev.health - amount)
      if (newHealth <= 0) {
        return { ...prev, health: 0, currentScreen: "gameOver" }
      }
      return { ...prev, health: newHealth }
    })
    setGlitchIntensity((prev) => Math.min(1, prev + 0.2))
  }

  function completeLevel() {
    playSynthSound("success")
    setGameState((prev) => {
      const newProgress = [...prev.levelProgress]
      newProgress[prev.currentLevel - 1] = 1

      return {
        ...prev,
        isLevelComplete: true,
        levelProgress: newProgress,
        solvedPuzzles: prev.solvedPuzzles + 1,
      }
    })

    setTimeout(() => {
      if (gameState.currentLevel >= 15) {
        setGameState((prev) => ({ ...prev, currentScreen: "escape" }))
      } else {
        setGameState((prev) => ({ ...prev, currentScreen: "levelSelect" }))
      }
    }, 2000)
  }

  function getDifficultyColor(difficulty: string) {
    switch (difficulty) {
      case "Easy": return "text-green-400 border-green-400"
      case "Medium": return "text-yellow-400 border-yellow-400"
      case "Hard": return "text-orange-400 border-orange-400"
      case "Extreme": return "text-red-400 border-red-400"
      case "Nightmare": return "text-purple-400 border-purple-400"
      case "Impossible": return "text-pink-400 border-pink-400"
      case "Legendary": return "text-cyan-400 border-cyan-400"
      default: return "text-gray-400 border-gray-400"
    }
  }

  function getCorruptionIcon(corruptionType: string) {
    switch (corruptionType) {
      case "startup_failure": return <Cpu className="w-4 h-4" />
      case "circuit_damage": return <Zap className="w-4 h-4" />
      case "memory_leak": return <Brain className="w-4 h-4" />
      case "algorithm_decay": return <Binary className="w-4 h-4" />
      case "kernel_breach": return <Skull className="w-4 h-4" />
      case "tree_corruption": return <GitBranch className="w-4 h-4" />
      case "network_failure": return <Network className="w-4 h-4" />
      case "hash_breakdown": return <Hash className="w-4 h-4" />
      case "recursion_bomb": return <Layers className="w-4 h-4" />
      case "stack_breach": return <Database className="w-4 h-4" />
      case "pointer_chaos": return <GitBranch className="w-4 h-4" />
      case "recursion_hell": return <AlertTriangle className="w-4 h-4" />
      case "db_meltdown": return <Database className="w-4 h-4" />
      case "protocol_decay": return <Network className="w-4 h-4" />
      case "total_collapse": return <Skull className="w-4 h-4" />
      default: return <Bug className="w-4 h-4" />
    }
  }

  function getEnemyIcon(type: string) {
    switch (type) {
      case "scanner": return <Eye className="w-full h-full" />
      case "hunter": return <Zap className="w-full h-full" />
      case "corruptor": return <Skull className="w-full h-full" />
      case "virus": return <AlertTriangle className="w-full h-full" />
      case "phantom": return <Binary className="w-full h-full" />
      default: return <Eye className="w-full h-full" />
    }
  }

  function getEnemyColor(type: string) {
    switch (type) {
      case "scanner": return "bg-blue-500 shadow-blue-500/50"
      case "hunter": return "bg-red-500 shadow-red-500/50"
      case "corruptor": return "bg-purple-500 shadow-purple-500/50"
      case "virus": return "bg-green-500 shadow-green-500/50"
      case "phantom": return "bg-cyan-500 shadow-cyan-500/50"
      default: return "bg-red-500 shadow-red-500/50"
    }
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono overflow-hidden relative">
      {/* Glitch Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-50 mix-blend-screen"
        style={{
          background: `linear-gradient(45deg, 
            rgba(255,0,255,${gameState.currentScreen === "intro" ? glitchIntensity * 0.05 : glitchIntensity * 0.1}) 0%, 
            transparent 25%, 
            rgba(0,255,255,${gameState.currentScreen === "intro" ? glitchIntensity * 0.05 : glitchIntensity * 0.1}) 50%, 
            transparent 75%, 
            rgba(255,255,0,${gameState.currentScreen === "intro" ? glitchIntensity * 0.05 : glitchIntensity * 0.1}) 100%)`,
          filter: `blur(${gameState.currentScreen === "intro" ? glitchIntensity * 0.5 : glitchIntensity}px) contrast(${1 + (gameState.currentScreen === "intro" ? glitchIntensity * 0.5 : glitchIntensity)})`,
          animation: `glitch 0.2s infinite`,
        }}
      />

      {/* Enemies */}
      {gameState.enemyPositions.map((enemy) => (
        <div
          key={enemy.id}
          className={`fixed w-8 h-8 rounded-full z-40 animate-pulse shadow-lg ${getEnemyColor(enemy.type)}`}
          style={{
            left: `${enemy.x}%`,
            top: `${enemy.y}%`,
            filter: "blur(1px)",
            transition: "all 1.5s ease-in-out",
          }}
        >
          {getEnemyIcon(enemy.type)}
        </div>
      ))}

      {gameState.currentScreen === "intro" && (
        <div className="flex flex-col items-center justify-center min-h-screen relative z-10 p-4">
          <div className="relative z-20 mb-8 animate-pulse">
            <Skull className="w-20 h-20 mx-auto mb-6 text-red-400 drop-shadow-lg" />
            <h1 className="text-5xl font-bold mb-4 text-green-400 drop-shadow-lg glitch-text">GHOSTFRAME</h1>
            <p className="text-xl text-gray-200 mb-2 drop-shadow-md font-semibold">MULTI-LEVEL CORRUPTION PROTOCOL</p>
            <p className="text-base text-gray-300 mt-4 drop-shadow-md">15 Levels • Escalating System Failures</p>
          </div>

          <Card className="relative z-20 bg-gray-900/95 border-green-400/50 p-8 max-w-lg backdrop-blur-sm shadow-2xl">
            <div className="space-y-6">
              <p className="text-gray-200 text-base leading-relaxed">
                Navigate through <span className="text-green-400 font-bold">15 increasingly corrupted</span> system
                levels. Each level presents unique challenges with escalating AI threats and progressive system
                corruption.
              </p>
              <p className="text-gray-300 text-sm">
                <span className="text-red-400">⚠</span> Repair algorithms, restore data structures, and survive the
                digital nightmare.
              </p>

              <div className="pt-4 border-t border-gray-700">
                <Button
                  onClick={() => {
                    playSynthSound("click")
                    setGameState((prev) => ({ ...prev, currentScreen: "levelSelect" }))
                  }}
                  onMouseEnter={() => playSynthSound("hover")}
                  className="w-full bg-green-600 hover:bg-green-700 text-black font-bold text-lg py-3 shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                >
                  ACCESS LEVEL MATRIX
                </Button>
              </div>

              <div className="flex justify-center space-x-6 text-xs text-gray-400 pt-2">
                <div className="flex items-center gap-1">
                  <Skull className="w-3 h-3" />
                  <span>Horror Theme</span>
                </div>
                <div className="flex items-center gap-1">
                  <Brain className="w-3 h-3" />
                  <span>Logic Puzzles</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  <span>Real-time Action</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Level Selection Screen */}
      {gameState.currentScreen === "levelSelect" && (
        <div className="p-8 min-h-screen">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-green-400">CORRUPTION LEVELS</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {LEVELS.map((level) => {
                const isUnlocked = level.id === 1 || gameState.levelProgress[level.id - 2] === 1
                const isCompleted = gameState.levelProgress[level.id - 1] === 1

                return (
                  <Card
                    key={level.id}
                    className={`p - 4 transition - all duration - 300 ${isUnlocked
                      ? `bg-gray-900/80 border-green-400/50 hover:border-green-400 cursor-pointer hover:scale-105`
                      : `bg-gray-900/40 border-gray-600/30 cursor-not-allowed`
                      } ${isCompleted ? "border-blue-400/50 bg-blue-900/20" : ""} `}
                    onClick={() => isUnlocked && initializeLevel(level.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getCorruptionIcon(level.corruptionType)}
                        <h3 className="text-sm font-bold text-green-400">L{level.id}</h3>
                      </div>
                      <div className="flex items-center gap-1">
                        {isCompleted && <Shield className="w-3 h-3 text-blue-400" />}
                        {!isUnlocked && <Lock className="w-3 h-3 text-gray-500" />}
                      </div>
                    </div>

                    <h4 className="text-white font-semibold mb-2 text-xs leading-tight">{level.name}</h4>
                    <p className="text-gray-400 text-xs mb-3 line-clamp-3 leading-tight">{level.description}</p>

                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Difficulty:</span>
                        <span className={getDifficultyColor(level.difficulty)}>{level.difficulty}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span className="text-yellow-400">{level.timeLimit}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Threats:</span>
                        <span className="text-red-400">{level.enemyCount}</span>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>

            <div className="mt-8 text-center">
              <div className="mb-4">
                <span className="text-gray-400">Progress: </span>
                <span className="text-green-400">
                  {gameState.levelProgress.filter((p) => p === 1).length}/{LEVELS.length} Levels Completed
                </span>
              </div>
              <Button
                onClick={() => setGameState((prev) => ({ ...prev, currentScreen: "intro" }))}
                variant="outline"
                className="border-gray-600 text-gray-400 hover:bg-gray-800"
              >
                RETURN TO MAIN MENU
              </Button>
            </div>
          </div>
        </div>
      )
      }

      {/* Game Screen */}
      {
        gameState.currentScreen === "game" && currentLevelConfig && (
          <div className="p-4 min-h-screen">
            {/* HUD */}
            <div className="flex justify-between items-center mb-4 bg-gray-900/50 p-3 rounded border border-green-400/30">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  {getCorruptionIcon(currentLevelConfig.corruptionType)}
                  <span>LEVEL {gameState.currentLevel}</span>
                </div>
                <span>HEALTH: {gameState.health}%</span>
                <span className={gameState.stealthEnergy < 20 ? "text-red-400 animate-pulse" : "text-blue-400"}>
                  ENERGY: {Math.floor(gameState.stealthEnergy)}%
                </span>
                <span className={gameState.timerExtensions > 0 ? "text-yellow-400" : ""}>
                  TIME: {Math.floor(gameState.timeRemaining / 60)}:
                  {(gameState.timeRemaining % 60).toString().padStart(2, "0")}
                  {gameState.timerExtensions > 0 && <Timer className="w-3 h-3 inline ml-1" />}
                </span>
                <span className={getDifficultyColor(currentLevelConfig.difficulty)}>
                  {currentLevelConfig.difficulty}
                </span>
                {gameState.failureCount > 0 && (
                  <span className="text-red-400 text-xs">Failures: {gameState.failureCount}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {/* Hint Button */}
                {gameState.failureCount >= 3 && (
                  <Button
                    onClick={showHintSystem}
                    variant="outline"
                    size="sm"
                    className="border-yellow-400 text-yellow-400 hover:bg-yellow-900/20 animate-pulse"
                  >
                    <Lightbulb className="w-3 h-3 mr-1" />
                    HINT
                  </Button>
                )}

                {/* Timer Extension Button */}
                {gameState.failureCount >= 2 && gameState.timeRemaining < 30 && gameState.timerExtensions < 3 && (
                  <Button
                    onClick={extendTimer}
                    variant="outline"
                    size="sm"
                    className="border-blue-400 text-blue-400 hover:bg-blue-900/20 animate-pulse"
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    +TIME
                  </Button>
                )}

                <Button
                  onClick={() => {
                    playSynthSound("click")
                    setGameState((prev) => ({ ...prev, playerHidden: !prev.playerHidden }))
                  }}
                  onMouseEnter={() => playSynthSound("hover")}
                  disabled={gameState.stealthEnergy <= 0 && !gameState.playerHidden}
                  variant="outline"
                  size="sm"
                  className={`${gameState.playerHidden
                    ? "bg-blue-600 animate-pulse border-blue-400"
                    : gameState.stealthEnergy <= 0
                      ? "bg-gray-900 text-gray-600 border-gray-800 cursor-not-allowed"
                      : "bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-500"
                    } transition - all duration - 300 min - w - [100px]`}
                >
                  {gameState.playerHidden ? "HIDDEN" : "STEALTH"}
                </Button>
                <Button
                  onClick={() => setGameState((prev) => ({ ...prev, currentScreen: "levelSelect" }))}
                  variant="outline"
                  size="sm"
                  className="border-red-400 text-red-400 hover:bg-red-900/20"
                >
                  ABORT
                </Button>
              </div>
            </div>

            {/* Hint Display */}
            {gameState.showHint && (
              <Card className="mb-4 bg-yellow-900/20 border-yellow-400/50 p-4">
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-yellow-400 font-bold mb-2">SYSTEM HINT ACTIVATED</h4>
                    <p className="text-yellow-200 text-sm">{gameState.currentHint}</p>
                    <Button
                      onClick={() => setGameState((prev) => ({ ...prev, showHint: false }))}
                      size="sm"
                      className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-black"
                    >
                      DISMISS
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Level Content */}
            <div className="max-w-4xl mx-auto">
              <Card className="bg-gray-900/80 border-green-400/50 p-6 mb-6">
                <h3 className="text-xl font-bold mb-2 text-green-400">{currentLevelConfig.name}</h3>
                <p className="text-gray-400 mb-4">{currentLevelConfig.description}</p>

                {/* Database Corruption */}
                {
                  currentLevelConfig.puzzleType === "databaseCorruption" && (
                    <div>
                      <p className="text-sm text-gray-400 mb-4">Execute SQL queries to restore database integrity:</p>
                      <div className="mb-4">
                        <div className="bg-gray-800 p-4 rounded border border-gray-600">
                          <h4 className="font-bold mb-2">Database Tables</h4>
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <div className="font-bold">Users</div>
                              {currentPuzzleData.tables?.users?.map((user: any) => (
                                <div key={user.id}>
                                  {user.id}: {user.name}, {user.age}
                                </div>
                              ))}
                            </div>
                            <div>
                              <div className="font-bold">Orders</div>
                              {currentPuzzleData.tables?.orders?.map((order: any) => (
                                <div key={order.id}>
                                  {order.id}: User {order.user_id}, {order.product}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {currentPuzzleData.queries?.map((query: string, index: number) => (
                          <div key={index} className="bg-gray-800 p-3 rounded">
                            <code className="text-green-400 text-sm">{query}</code>
                            <Button
                              onClick={() => handlePuzzleAction("query")}
                              className="ml-4 bg-green-600 hover:bg-green-700 text-black"
                              size="sm"
                              disabled={index !== currentPuzzleData.currentQuery}
                            >
                              EXECUTE
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 text-center">
                        Progress: {currentPuzzleData.solved}/{currentPuzzleData.queries?.length}
                      </div>
                    </div>
                  )
                }

                {/* Network Protocol */}
                {
                  currentLevelConfig.puzzleType === "networkProtocol" && (
                    <div>
                      <p className="text-sm text-gray-400 mb-4">Repair corrupted OSI layers:</p>
                      <div className="space-y-2 mb-4">
                        {currentPuzzleData.layers?.map((layer: string, index: number) => (
                          <div
                            key={index}
                            className={`p - 3 rounded border ${currentPuzzleData.corruptedLayers?.includes(index)
                              ? currentPuzzleData.repairedLayers?.includes(index)
                                ? "bg-green-800 border-green-400"
                                : "bg-red-800 border-red-400"
                              : "bg-gray-800 border-gray-600"
                              } `}
                          >
                            <div className="flex justify-between items-center">
                              <span>
                                Layer {index + 1}: {layer}
                              </span>
                              {currentPuzzleData.corruptedLayers?.includes(index) &&
                                !currentPuzzleData.repairedLayers?.includes(index) && (
                                  <Button
                                    onClick={() => handlePuzzleAction("repair", index)}
                                    className="bg-yellow-600 hover:bg-yellow-700 text-black"
                                    size="sm"
                                  >
                                    REPAIR
                                  </Button>
                                )}
                              {currentPuzzleData.repairedLayers?.includes(index) && (
                                <span className="text-green-400">✓ REPAIRED</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="text-center">
                        Repaired: {currentPuzzleData.repairedLayers?.length}/{currentPuzzleData.corruptedLayers?.length}
                      </div>
                    </div>
                  )
                }

                {/* Algorithm Reconstruction Puzzle (Fixed Level 4) */}
                {
                  currentLevelConfig.puzzleType === "algorithmReconstruction" && (
                    <div>
                      <p className="text-sm text-gray-400 mb-4">
                        Reconstruct the bubble sort algorithm by arranging the lines in correct order:
                      </p>
                      <div className="space-y-2 mb-4">
                        {currentPuzzleData.currentOrder?.map((lineIndex: number, index: number) => (
                          <div
                            key={index}
                            className="bg-gray-800 p-3 rounded border border-gray-600 cursor-move hover:border-green-400/50 transition-colors"
                            draggable
                            onDragStart={(e) => e.dataTransfer.setData("text/plain", index.toString())}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              e.preventDefault()
                              const dragIndex = Number.parseInt(e.dataTransfer.getData("text/plain"))
                              const newOrder = [...currentPuzzleData.currentOrder]
                              const draggedItem = newOrder[dragIndex]
                              newOrder.splice(dragIndex, 1)
                              newOrder.splice(index, 0, draggedItem)
                              handlePuzzleAction("reorder", newOrder)
                            }}
                          >
                            <code className="text-green-400 text-sm">{currentPuzzleData.algorithm?.[lineIndex]}</code>
                          </div>
                        ))}
                      </div>
                      <Button
                        onClick={() => handlePuzzleAction("check")}
                        className="bg-green-600 hover:bg-green-700 text-black font-bold"
                      >
                        COMPILE ALGORITHM
                      </Button>
                    </div>
                  )
                }

                {/* Binary Tree Traversal */}
                {
                  currentLevelConfig.puzzleType === "binaryTree" && (
                    <div>
                      <p className="text-sm text-gray-400 mb-4">
                        Perform in-order traversal of the corrupted tree structure:
                      </p>
                      <div className="mb-4 text-center">
                        <div className="inline-block bg-gray-800 p-4 rounded">
                          <div className="text-center mb-2">
                            <Button
                              onClick={() => handlePuzzleAction("traverse", 50)}
                              className="bg-blue-600 hover:bg-blue-700 text-white m-1"
                              size="sm"
                            >
                              50
                            </Button>
                          </div>
                          <div className="flex justify-center gap-8 mb-2">
                            <Button
                              onClick={() => handlePuzzleAction("traverse", 30)}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                              size="sm"
                            >
                              30
                            </Button>
                            <Button
                              onClick={() => handlePuzzleAction("traverse", 70)}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                              size="sm"
                            >
                              70
                            </Button>
                          </div>
                          <div className="flex justify-center gap-4">
                            <Button
                              onClick={() => handlePuzzleAction("traverse", 20)}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                              size="sm"
                            >
                              20
                            </Button>
                            <Button
                              onClick={() => handlePuzzleAction("traverse", 40)}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                              size="sm"
                            >
                              40
                            </Button>
                            <Button
                              onClick={() => handlePuzzleAction("traverse", 60)}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                              size="sm"
                            >
                              60
                            </Button>
                            <Button
                              onClick={() => handlePuzzleAction("traverse", 80)}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                              size="sm"
                            >
                              80
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div>Expected: {currentPuzzleData.correctSequence?.join(" → ")}</div>
                        <div>Your path: {currentPuzzleData.playerSequence?.join(" → ")}</div>
                      </div>
                    </div>
                  )
                }

                {/* Graph Traversal */}
                {
                  currentLevelConfig.puzzleType === "graphTraversal" && (
                    <div>
                      <p className="text-sm text-gray-400 mb-4">Navigate through the corrupted network topology:</p>
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {Object.keys(currentPuzzleData.graph || {}).map((node) => (
                          <Button
                            key={node}
                            onClick={() => handlePuzzleAction("move", node)}
                            className={`${currentPuzzleData.currentNode === node
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-gray-600 hover:bg-gray-700"
                              } text - white`}
                            disabled={
                              currentPuzzleData.currentNode !== node &&
                              !currentPuzzleData.graph?.[currentPuzzleData.currentNode]?.includes(node)
                            }
                          >
                            {node}
                          </Button>
                        ))}
                      </div>
                      <div className="text-center">
                        <div>Current: {currentPuzzleData.currentNode}</div>
                        <div>Path: {currentPuzzleData.playerPath?.join(" → ")}</div>
                        <div>Target: {currentPuzzleData.targetNode}</div>
                      </div>
                    </div>
                  )
                }

                {/* Hash Table */}
                {
                  currentLevelConfig.puzzleType === "hashTable" && (
                    <div>
                      <p className="text-sm text-gray-400 mb-4">Resolve hash collisions using linear probing:</p>
                      <div className="grid grid-cols-7 gap-2 mb-4">
                        {currentPuzzleData.hashTable?.map((item: string | null, index: number) => (
                          <div key={index} className="bg-gray-800 p-2 text-center border border-gray-600 rounded">
                            <div className="text-xs text-gray-400">[{index}]</div>
                            <div className="text-sm">{item || "null"}</div>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        {currentPuzzleData.collisions?.map((collision: any, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-sm">
                              {collision.key} (hash: {collision.hash})
                            </span>
                            <input
                              type="number"
                              min="0"
                              max="6"
                              placeholder="Position"
                              className="bg-gray-800 text-green-400 p-1 rounded w-20"
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  const position = Number.parseInt((e.target as HTMLInputElement).value)
                                  handlePuzzleAction("resolve", { key: collision.key, position })
                                }
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 text-center">
                        Progress: {currentPuzzleData.resolved}/{currentPuzzleData.required}
                      </div>
                    </div>
                  )
                }

                {/* Dynamic Programming */}
                {
                  currentLevelConfig.puzzleType === "dynamicProgramming" && (
                    <div>
                      <p className="text-sm text-gray-400 mb-4">Solve recursive overflow using memoization:</p>
                      <div className="space-y-2 mb-4">
                        {currentPuzzleData.correctSteps?.map((step: string, index: number) => (
                          <Button
                            key={index}
                            onClick={() => handlePuzzleAction("step", step)}
                            className={`w - full text - left ${index === currentPuzzleData.currentStep
                              ? "bg-green-600 hover:bg-green-700"
                              : index < currentPuzzleData.currentStep
                                ? "bg-blue-600"
                                : "bg-gray-600 hover:bg-gray-700"
                              } text - white`}
                            disabled={index !== currentPuzzleData.currentStep}
                          >
                            {step}
                          </Button>
                        ))}
                      </div>
                      <div className="text-center">
                        Step: {currentPuzzleData.currentStep + 1}/{currentPuzzleData.correctSteps?.length}
                      </div>
                    </div>
                  )
                }

                {/* Multi-Algorithm Challenge */}
                {
                  currentLevelConfig.puzzleType === "multiAlgorithm" && (
                    <div>
                      <p className="text-sm text-gray-400 mb-4">Complete all system restoration challenges:</p>
                      <div className="space-y-4">
                        {currentPuzzleData.challenges?.map((challenge: any, index: number) => (
                          <Card key={index} className="bg-gray-800 p-4">
                            <h4 className="font-bold mb-2">
                              Challenge {index + 1}: {challenge.type.toUpperCase()} CORRUPTION
                              {challenge.solved && <span className="text-green-400 ml-2">✓ RESTORED</span>}
                            </h4>
                            {challenge.type === "sort" && (
                              <div>
                                <div>Corrupted Array: [{challenge.data.join(", ")}]</div>
                                <Button
                                  onClick={() => handlePuzzleAction("solve")}
                                  className="mt-2 bg-green-600 hover:bg-green-700 text-black"
                                  disabled={challenge.solved || index !== currentPuzzleData.currentChallenge}
                                >
                                  Restore Sort Order
                                </Button>
                              </div>
                            )}
                            {challenge.type === "search" && (
                              <div>
                                <div>
                                  Search Array: [{challenge.data.join(", ")}], Target: {challenge.target}
                                </div>
                                <Button
                                  onClick={() => handlePuzzleAction("solve")}
                                  className="mt-2 bg-green-600 hover:bg-green-700 text-black"
                                  disabled={challenge.solved || index !== currentPuzzleData.currentChallenge}
                                >
                                  Execute Binary Search
                                </Button>
                              </div>
                            )}
                            {challenge.type === "tree" && (
                              <div>
                                <div>Task: Restore tree balance</div>
                                <Button
                                  onClick={() => handlePuzzleAction("solve")}
                                  className="mt-2 bg-green-600 hover:bg-green-700 text-black"
                                  disabled={challenge.solved || index !== currentPuzzleData.currentChallenge}
                                >
                                  Balance Tree Structure
                                </Button>
                              </div>
                            )}
                            {challenge.type === "graph" && (
                              <div>
                                <div>Task: Repair shortest path algorithm</div>
                                <Button
                                  onClick={() => handlePuzzleAction("solve")}
                                  className="mt-2 bg-green-600 hover:bg-green-700 text-black"
                                  disabled={challenge.solved || index !== currentPuzzleData.currentChallenge}
                                >
                                  Restore Pathfinding
                                </Button>
                              </div>
                            )}
                            {challenge.type === "hash" && (
                              <div>
                                <div>Task: Fix hash collision resolution</div>
                                <Button
                                  onClick={() => handlePuzzleAction("solve")}
                                  className="mt-2 bg-green-600 hover:bg-green-700 text-black"
                                  disabled={challenge.solved || index !== currentPuzzleData.currentChallenge}
                                >
                                  Repair Hash Table
                                </Button>
                              </div>
                            )}
                          </Card>
                        ))}
                      </div>
                      <div className="mt-4 text-center">
                        Systems Restored: {currentPuzzleData.totalSolved}/{currentPuzzleData.challenges?.length}
                      </div>
                    </div>
                  )
                }

                {/* Other puzzle types remain the same... */}
                {
                  currentLevelConfig.puzzleType === "codeFragment" && (
                    <div>
                      <p className="text-sm text-gray-400 mb-4">Drag and drop the code lines to restore the function:</p>
                      <div className="space-y-2 mb-4">
                        {currentPuzzleData.currentOrder?.map((fragmentIndex: number, index: number) => (
                          <div
                            key={index}
                            className="bg-gray-800 p-3 rounded border border-gray-600 cursor-move hover:border-green-400/50 transition-colors"
                            draggable
                            onDragStart={(e) => e.dataTransfer.setData("text/plain", index.toString())}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              e.preventDefault()
                              const dragIndex = Number.parseInt(e.dataTransfer.getData("text/plain"))
                              const newOrder = [...currentPuzzleData.currentOrder]
                              const draggedItem = newOrder[dragIndex]
                              newOrder.splice(dragIndex, 1)
                              newOrder.splice(index, 0, draggedItem)
                              handlePuzzleAction("reorder", newOrder)
                            }}
                          >
                            <code className="text-green-400">{currentPuzzleData.fragments?.[fragmentIndex]}</code>
                          </div>
                        ))}
                      </div>
                      <Button
                        onClick={() => handlePuzzleAction("check")}
                        className="bg-green-600 hover:bg-green-700 text-black font-bold"
                      >
                        EXECUTE CODE
                      </Button>
                    </div>
                  )
                }

                {
                  currentLevelConfig.puzzleType === "logicGate" && (
                    <div>
                      <p className="text-sm text-gray-400 mb-4">
                        Solve the logic gates by determining the correct outputs:
                      </p>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {currentPuzzleData.gates?.map((gate: any) => (
                          <div key={gate.id} className="bg-gray-800 p-4 rounded border border-gray-600">
                            <div className="text-center mb-2">
                              <Cpu className="w-8 h-8 mx-auto text-blue-400" />
                              <div className="text-lg font-bold">{gate.type}</div>
                            </div>
                            <div className="text-sm mb-2">
                              Inputs:{" "}
                              {gate.inputs.map((input: boolean, i: number) => (
                                <span key={i} className={input ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
                                  {input.toString()}
                                  {i < gate.inputs.length - 1 ? ", " : ""}
                                </span>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handlePuzzleAction("solve", { id: gate.id, output: true })}
                                className="bg-green-600 hover:bg-green-700 text-black"
                              >
                                TRUE
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handlePuzzleAction("solve", { id: gate.id, output: false })}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                FALSE
                              </Button>
                            </div>
                            {gate.output !== null && (
                              <div className="mt-2 text-gray-300">
                                Output:{" "}
                                <span className={gate.output ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
                                  {gate.output.toString()}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="text-center">
                        Progress: {currentPuzzleData.solved}/{currentPuzzleData.required}
                      </div>
                    </div>
                  )
                }

                {
                  currentLevelConfig.puzzleType === "memorySequence" && (
                    <div>
                      <p className="text-sm text-gray-400 mb-4">Memorize and repeat the corrupted sequence:</p>
                      <div className="grid grid-cols-4 gap-2 mb-4">
                        {[0, 1, 2, 3].map((colorIndex) => (
                          <Button
                            key={colorIndex}
                            className={`h - 16 ${colorIndex === 0
                              ? "bg-red-600 hover:bg-red-700"
                              : colorIndex === 1
                                ? "bg-blue-600 hover:bg-blue-700"
                                : colorIndex === 2
                                  ? "bg-green-600 hover:bg-green-700"
                                  : "bg-yellow-600 hover:bg-yellow-700"
                              } `}
                            onClick={() => handlePuzzleAction("input", colorIndex)}
                          />
                        ))}
                      </div>
                      <div className="text-center">
                        <div>
                          Target:{" "}
                          {currentPuzzleData.sequence?.map((num: number, i: number) => (
                            <span
                              key={i}
                              className={`font - bold ${num === 0
                                ? "text-red-400"
                                : num === 1
                                  ? "text-blue-400"
                                  : num === 2
                                    ? "text-green-400"
                                    : "text-yellow-400"
                                } `}
                            >
                              {num}
                              {i < currentPuzzleData.sequence.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </div>
                        <div>
                          Your input:{" "}
                          {currentPuzzleData.playerSequence?.map((num: number, i: number) => (
                            <span
                              key={i}
                              className={`font - bold ${num === 0
                                ? "text-red-400"
                                : num === 1
                                  ? "text-blue-400"
                                  : num === 2
                                    ? "text-green-400"
                                    : "text-yellow-400"
                                } `}
                            >
                              {num}
                              {i < currentPuzzleData.playerSequence.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                }

                {
                  currentLevelConfig.puzzleType === "terminalHacking" && (
                    <div>
                      <Card className="bg-black border-green-400 p-4 h-64 overflow-y-auto mb-4">
                        <div className="space-y-1">
                          {terminalOutput.map((line, index) => (
                            <div key={index} className="text-green-400 text-sm font-mono">
                              {line}
                            </div>
                          ))}
                        </div>
                      </Card>
                      <div className="flex">
                        <span className="text-green-400 mr-2">{">"}</span>
                        <input
                          type="text"
                          value={terminalInput}
                          onChange={(e) => setTerminalInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handlePuzzleAction("command", terminalInput)
                              setTerminalInput("")
                            }
                          }}
                          className="flex-1 bg-transparent text-green-400 outline-none font-mono"
                          placeholder="Enter command..."
                          autoFocus
                        />
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Required sequence: {currentPuzzleData.requiredCommands?.join(" → ")}
                      </div>
                    </div>
                  )
                }
              </Card >

              {/* Level Complete Message */}
              {
                gameState.isLevelComplete && (
                  <Card className="bg-green-900/80 border-green-400 p-6 text-center">
                    <h3 className="text-2xl font-bold text-green-400 mb-2">CORRUPTION NEUTRALIZED</h3>
                    <p className="text-gray-300">System restored. Advancing to next corruption level...</p>
                    {gameState.hintsUsed > 0 && (
                      <p className="text-yellow-400 text-sm mt-2">Hints used: {gameState.hintsUsed}</p>
                    )}
                    {gameState.timerExtensions > 0 && (
                      <p className="text-blue-400 text-sm">Timer extensions: {gameState.timerExtensions}</p>
                    )}
                  </Card>
                )
              }
            </div >
          </div >
        )
      }

      {/* Game Over Screen */}
      {
        gameState.currentScreen === "gameOver" && (
          <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
            <div className="animate-pulse">
              <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-400" />
              <h1 className="text-4xl font-bold mb-4 text-red-400">SYSTEM FAILURE</h1>
              <p className="text-lg text-gray-400 mb-8">The corruption has consumed your logic circuits.</p>
              <div className="space-y-4">
                <Button
                  onClick={() => initializeLevel(gameState.currentLevel)}
                  className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold mr-4"
                >
                  RETRY LEVEL
                </Button>
                <Button
                  onClick={() => setGameState((prev) => ({ ...prev, currentScreen: "levelSelect" }))}
                  className="bg-green-600 hover:bg-green-700 text-black font-bold"
                >
                  LEVEL SELECT
                </Button>
              </div>
            </div>
          </div>
        )
      }

      {/* Escape Screen */}
      {
        gameState.currentScreen === "escape" && (
          <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
            <div className="animate-pulse">
              <h1 className="text-4xl font-bold mb-4 text-green-400">ESCAPE SUCCESSFUL</h1>
              <p className="text-lg text-gray-400 mb-4">All corruption levels neutralized.</p>
              <p className="text-md text-blue-400 mb-8">You have mastered the GhostFrame simulation.</p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-green-600 hover:bg-green-700 text-black font-bold"
              >
                RESTART SIMULATION
              </Button>
            </div>
          </div>
        )
      }

      <style jsx global>{`
  @keyframes glitch {
    0 % { transform: translate(0); }
    20 % { transform: translate(-2px, 2px); }
    40 % { transform: translate(-2px, -2px); }
    60 % { transform: translate(2px, 2px); }
    80 % { transform: translate(2px, -2px); }
    100 % { transform: translate(0); }
  }
          
          .glitch - text {
    animation: glitch 0.3s infinite;
  }
          
          .line - clamp - 2 {
    display: -webkit - box;
    -webkit - line - clamp: 2;
    -webkit - box - orient: vertical;
    overflow: hidden;
  }
          
          .line - clamp - 3 {
    display: -webkit - box;
    -webkit - line - clamp: 3;
    -webkit - box - orient: vertical;
    overflow: hidden;
  }
  `}</style>
    </div >

  )
}
