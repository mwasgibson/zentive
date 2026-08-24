"use client";

import { useEffect, useRef, useState } from "react";

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

export function TerminalApi({ endpoints }: { endpoints: ApiEndpoint[] }) {
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  useEffect(() => {
    // Initial welcome + list endpoints once
    const initial: LogLine[] = [
      {
        id: idRef.current++,
        type: "info",
        text: "terminal — type 'help' for available commands",
      },
      {
        id: idRef.current++,
        type: "muted",
        text: "registered endpoints:",
      },
      ...endpoints.map((e) => ({
        id: idRef.current++,
        type: "success" as const,
        text: `${e.method.padEnd(6)} ${e.path} — ${e.desc}`,
      })),
    ];
    setLogs(initial);
  }, [endpoints]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [logs.length]);

  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [logs]);

  const runCommand = (cmdRaw: string) => {
    const cmd = cmdRaw.trim();
    if (!cmd) return;

    setLogs((prev) => [
      ...prev,
      { id: idRef.current++, type: "info", text: `user@usersmac ~ % ${cmd}` },
    ]);

    const [command, ...args] = cmd.split(/\s+/);
    const lower = command.toLowerCase();

    const response: {
      type: "info" | "error" | "success" | "muted";
      text: string;
    }[] = [];

    switch (lower) {
      case "help":
        response.push({
          type: "info",
          text: "available commands: help, endpoints, curl <path>, clear, echo <text>",
        });
        break;

      case "endpoints":
        response.push({
          type: "muted",
          text: "registered endpoints:",
        });
        endpoints.forEach((e) => {
          response.push({
            type: "success",
            text: `${e.method.padEnd(6)} ${e.path} — ${e.desc}`,
          });
        });
        break;

      case "curl": {
        const path = args[0];
        if (!path) {
          response.push({
            type: "error",
            text: "usage: curl <path>  (e.g. curl /v1/send)",
          });
        } else {
          const match = endpoints.find((e) => e.path === path);
          if (!match) {
            response.push({
              type: "error",
              text: `no endpoint found for path: ${path}`,
            });
          } else {
            response.push({
              type: "success",
              text:
                `curl -X ${match.method} "https://api.sh${match.path}"\n` +
                `# ${match.desc}`,
            });
          }
        }
        break;
      }

      case "clear":
        setLogs([]);
        return;

      case "echo":
        response.push({
          type: "info",
          text: args.join(" ") || "",
        });
        break;

      default:
        response.push({
          type: "error",
          text: `unknown command: ${command}. type 'help' for options.`,
        });
    }

    setLogs((prev) => [
      ...prev,
      ...response.map((r) => ({ id: idRef.current++, ...r })),
    ]);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
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
        onClick={() => inputRef.current?.focus()}
      >
        <div className="absolute inset-0 api-scanlines" />
        <div className="relative px-4 py-3">
          {/* Logs (including static endpoint list + command output) */}
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

          {/* Prompt + input */}
          <div className="mt-2 flex items-center gap-2 font-mono text-[12.5px]">
            <span className="text-wire">user@usersmac ~ %</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              className="flex-1 bg-transparent text-paper outline-none placeholder:text-paper/30"
              placeholder="type 'help' or 'curl /v1/send'…"
              spellCheck={false}
              autoComplete="off"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
