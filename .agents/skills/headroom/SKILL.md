---
name: headroom
description: Context compression and token reduction layer for AI agents and LLM applications. Compresses tool outputs, logs, files, and RAG chunks before they reach the model. Use for reducing context window bloat, running CCR (Cache-Compress-Retrieve), and token optimization.
---

# Headroom - Context Compression Layer

Headroom optimizes and compresses the context sent to AI models, saving 20%–95% of tokens while preserving crucial technical information byte-for-byte.

## When to Use

- When prompts, tool outputs, logs, or file readings are very large and risk context overflow
- When developing LLM features in the project and need client-side compression
- When reducing inference costs and improving cache hit rates
- When retrieving original uncompressed snippets on-demand via CCR (Cache-Compress-Retrieve)

## Usage in the Project (TypeScript / Node.js)

The project includes `headroom-ai` in `qudra-final/package.json`. You can use it in application code:

```typescript
import { compress } from 'headroom-ai';

// Compress messages or large tool payloads before sending to an LLM
const result = await compress(messages, {
  model: 'gemini-1.5-pro',
  level: 'balanced'
});

console.log(`Saved ${result.tokensSaved} tokens (${result.compressionRatio * 100}% reduction)`);
```

## Running the Proxy & CLI

If using python/docker for local proxy:
```bash
# Docker drop-in local proxy
docker run -p 8787:8787 ghcr.io/headroomlabs-ai/headroom:latest

# Or via Python CLI if installed
headroom proxy --port 8787
headroom dashboard
```

## MCP Tools Integration

When configured as an MCP server:
- `headroom_compress`: Compresses payloads before sending to model
- `headroom_retrieve`: Recovers exact original content from local cache
- `headroom_stats`: Reports cumulative token savings and cache hits
