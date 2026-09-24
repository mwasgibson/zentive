"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type ApiEndpoint = {
  method: string;
  path: string;
  desc: string;
};

type LogLine = {
  id: number;
  type: "info" | "error" | "success" | "muted";
  text: string;
};

/** Wait before starting (or restarting) the idle demo. */
const IDLE_START_MS = 4200;
/** Gap between each of the three demo commands. */
const DEMO_STEP_MS = 1400;
/** Pause after clear before the next cycle. */
const DEMO_LOOP_MS = 2800;

function shortPath(path: string) {
  // Keep the useful tail: /v1/sms/send → /sms/send
  return path.replace(/^\/v1/, "") || path;
}

function shortDesc(desc: string) {
  if (desc.length <= 28) return desc;
  return desc.slice(0, 26).trimEnd() + "…";
}

function pickThree<T>(items: T[]): T[] {
  if (items.length === 0) return [];
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(3, copy.length));
}

export function TerminalApi({ endpoints }: { endpoints: ApiEndpoint[] }) {
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const focusedRef = useRef(false);
  const hasInteractedRef = useRef(false);
  const endpointsRef = useRef(endpoints);
  endpointsRef.current = endpoints;
  const timersRef = useRef<number[]>([]);
  const cycleActiveRef = useRef(false);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
    cycleActiveRef.current = false;
  }, []);

  const markInteracted = useCallback(() => {
    hasInteractedRef.current = true;
    clearTimers();
  }, [clearTimers]);

  const pushLog = useCallback(
    (type: LogLine["type"], text: string) => {
      setLogs((prev) => [
        ...prev,
        { id: idRef.current++, type, text },
      ]);
    },
    [],
  );

  const seedWelcome = useCallback(() => {
    const list = endpointsRef.current;
    const initial: LogLine[] = [
      {
        id: idRef.current++,
        type: "info",
        text: "terminal — type 'help'",
      },
      {
        id: idRef.current++,
        type: "muted",
        text: "endpoints:",
      },
      ...list.map((e) => ({
        id: idRef.current++,
        type: "success" as const,
        text: `${e.method.padEnd(5)} ${shortPath(e.path)} — ${shortDesc(e.desc)}`,
      })),
    ];
    setLogs(initial);
  }, []);

  useEffect(() => {
    seedWelcome();
  }, [endpoints, seedWelcome]);

  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [logs]);

  const runCommand = useCallback(
    (cmdRaw: string) => {
      const cmd = cmdRaw.trim();
      if (!cmd) return;

      pushLog("info", `user@usersmac ~ % ${cmd}`);

      const [command, ...args] = cmd.split(/\s+/);
      const lower = command.toLowerCase();
      const list = endpointsRef.current;

      switch (lower) {
        case "help":
          pushLog(
            "info",
            "commands: help, endpoints, curl <path>, clear, echo <text>",
          );
          break;

        case "endpoints":
          pushLog("muted", "endpoints:");
          list.forEach((e) => {
            pushLog(
              "success",
              `${e.method.padEnd(5)} ${shortPath(e.path)} — ${shortDesc(e.desc)}`,
            );
          });
          break;

        case "curl": {
          const pathArg = args[0];
          if (!pathArg) {
            pushLog("error", "usage: curl <path>");
            break;
          }
          // Accept short or full path
          const match = list.find(
            (e) =>
              e.path === pathArg ||
              shortPath(e.path) === pathArg ||
              e.path === `/v1${pathArg.startsWith("/") ? pathArg : `/${pathArg}`}`,
          );
          if (!match) {
            pushLog("error", `no endpoint: ${pathArg}`);
          } else {
            pushLog(
              "success",
              `curl -X ${match.method} "https://api.sh${match.path}"`,
            );
            pushLog("muted", `# ${shortDesc(match.desc)}`);
          }
          break;
        }

        case "clear":
          setLogs([]);
          return;

        case "echo":
          pushLog("info", args.join(" ") || "");
          break;

        default:
          pushLog(
            "error",
            `unknown: ${command}. type 'help'`,
          );
      }
    },
    [pushLog],
  );

  const scheduleIdleCycle = useCallback(() => {
    clearTimers();
    if (focusedRef.current || hasInteractedRef.current) return;

    const start = window.setTimeout(() => {
      if (focusedRef.current || hasInteractedRef.current) return;
      cycleActiveRef.current = true;

      const picks = pickThree(endpointsRef.current);
      if (picks.length === 0) return;

      picks.forEach((ep, i) => {
        const t = window.setTimeout(() => {
          if (focusedRef.current || hasInteractedRef.current) return;
          runCommand(`curl ${shortPath(ep.path)}`);

          // After last command: clear, reseed welcome, loop
          if (i === picks.length - 1) {
            const clearT = window.setTimeout(() => {
              if (focusedRef.current || hasInteractedRef.current) return;
              setLogs([]);
              const reseed = window.setTimeout(() => {
                if (focusedRef.current || hasInteractedRef.current) return;
                seedWelcome();
                // Reset interaction only for the idle loop so it can continue;
                // focusedRef still gates when the user is in the terminal.
                hasInteractedRef.current = false;
                scheduleIdleCycle();
              }, 400);
              timersRef.current.push(reseed);
            }, DEMO_LOOP_MS);
            timersRef.current.push(clearT);
          }
        }, DEMO_STEP_MS * (i + 1));
        timersRef.current.push(t);
      });
    }, IDLE_START_MS);

    timersRef.current.push(start);
  }, [clearTimers, runCommand, seedWelcome]);

  // Start idle cycle on mount; restart when focus leaves
  useEffect(() => {
    scheduleIdleCycle();
    return () => clearTimers();
  }, [scheduleIdleCycle, clearTimers]);

  const onFocus = () => {
    focusedRef.current = true;
    markInteracted();
  };

  const onBlur = () => {
    focusedRef.current = false;
    // Allow demo to resume after blur + idle
    hasInteractedRef.current = false;
    scheduleIdleCycle();
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    markInteracted();
    if (e.key === "Enter") {
      e.preventDefault();
      const cmd = input;
      setInput("");
      setHistory((h) => [...h, cmd]);
      setHistoryIndex(null);
      runCommand(cmd);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      setHistoryIndex((prev) => {
        const next = prev === null ? history.length - 1 : Math.max(0, prev - 1);
        setInput(history[next]);
        return next;
      });
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (history.length === 0) return;
      setHistoryIndex((prev) => {
        if (prev === null) return null;
        const next = prev + 1;
        if (next >= history.length) {
          setInput("");
          return null;
        }
        setInput(history[next]);
        return next;
      });
    }
  };

  return (
    <div className="card overflow-hidden bg-ink !p-0">
      {/* Terminal header */}
      <div className="flex items-center justify-between border-b border-paper/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper/50">
          api.sh
        </div>
      </div>

      {/* Terminal body */}
      <div
        ref={containerRef}
        className="relative max-h-[22rem] overflow-y-auto"
        onClick={() => {
          markInteracted();
          inputRef.current?.focus();
        }}
      >
        <div className="absolute inset-0 api-scanlines" />
        <div className="relative px-4 py-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className={[
                "font-mono text-[12.5px] leading-relaxed",
                log.type === "error"
                  ? "text-red-400/90"
                  : log.type === "success"
                    ? "text-green-300/90"
                    : log.type === "muted"
                      ? "text-paper/40"
                      : "text-paper/80",
              ].join(" ")}
            >
              {log.text}
            </div>
          ))}

          <div className="mt-2 flex items-center gap-2 font-mono text-[12.5px]">
            <span className="text-wire">user@usersmac ~ %</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => {
                markInteracted();
                setInput(e.target.value);
              }}
              onFocus={onFocus}
              onBlur={onBlur}
              onKeyDown={onKeyDown}
              className="flex-1 bg-transparent text-paper outline-none placeholder:text-paper/30"
              placeholder="type 'help' or 'curl /sms/send'…"
              spellCheck={false}
              autoComplete="off"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
