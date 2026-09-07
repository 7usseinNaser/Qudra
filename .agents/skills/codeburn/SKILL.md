---
name: codeburn
description: Free, local tool to track AI coding token usage and costs across tools and agents (Claude Code, Cursor, Codex, Gemini, Antigravity). Use to analyze token burn, calculate LLM expenses, detect runaway loops, and optimize prompt costs.
---

# Codeburn - AI Token & Cost Analytics

Codeburn tracks and analyzes your AI agent token consumption and spending across models, projects, and tasks entirely locally.

## When to Use

- When the user asks about token consumption or costs: "how many tokens have I used?", "how much did this cost?"
- When monitoring AI spending during development sessions
- When detecting runaway agent loops or inefficient context bloat
- When optimizing prompts and reducing expenses

## Quick Commands

Run from the project root (`qudra-final` or repository root):

```bash
# Launch interactive terminal UI (TUI) dashboard
npx codeburn

# Quick summary of current project usage
npx codeburn summary

# Breakdown by model and provider
npx codeburn models

# Scan for inefficient agent habits and suggest fixes
npx codeburn optimize
```

## Features

- **Multi-Agent Tracking**: Supports logs from Antigravity, Claude Code, Cursor, Codex, Aider, and more.
- **Local-First Privacy**: Reads only local session logs; no telemetry or data sent to external servers.
- **Cost Attribution**: Breaks down spending by model (GPT-4o, Claude 3.5 Sonnet, Gemini Flash/Pro), feature branch, and project.
