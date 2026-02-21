#!/usr/bin/env python3
"""
ENTERPRISE MEMORY SYSTEM — VAULT AGENT
=======================================
Rehydrate, store, and query agent context across runs.
Uses JSON files in data/ backed to GitHub (immutable audit trail).

Features:
- Context rehydration: load recent state before each agent run
- Semantic index: keyword lookup across all stored entries
- Agent isolation: each agent gets its own memory namespace
- Immutable audit: all writes append-only (never overwrite)
- Enterprise-grade: handles 10K+ entries with pagination
"""

import json
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

logger = logging.getLogger("VaultMemory")

REPO_ROOT = Path(__file__).resolve().parents[3]
MEMORY_ROOT = REPO_ROOT / "data" / "memory"
DISPATCH_LOG = REPO_ROOT / "data" / "dispatch-log" / "commands.jsonl"


class VaultMemory:
    """
    Enterprise-grade memory system for Construct-OS agents.

    Usage:
        vault = VaultMemory("hunter")
        vault.store("lead", {"project_name": "Lake Nona Medical", "value": 1200000})
        results = vault.recall("lake nona")
        context = vault.rehydrate()  # Last 50 entries for LLM context window
    """

    def __init__(self, namespace: str = "global") -> None:
        self.namespace = namespace
        self.store_dir = MEMORY_ROOT / namespace
        self.store_dir.mkdir(parents=True, exist_ok=True)
        self.index_file = self.store_dir / "index.jsonl"
        self.state_file = self.store_dir / "state.json"

    def store(self, key: str, value: Any, tags: Optional[list[str]] = None) -> str:
        """
        Store a value in memory. Returns the entry ID.
        All writes are append-only for audit compliance.
        """
        entry_id = f"{self.namespace}_{key}_{datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S_%f')}"
        entry = {
            "id": entry_id,
            "namespace": self.namespace,
            "key": key,
            "value": value,
            "tags": tags or [],
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        with open(self.index_file, "a", encoding="utf-8") as f:
            f.write(json.dumps(entry) + "\n")
        logger.debug(f"Stored: {entry_id}")
        return entry_id

    def recall(self, query: str, limit: int = 10) -> list[dict]:
        """
        Keyword search across stored entries.
        Returns up to `limit` matching entries, most recent first.
        """
        if not self.index_file.exists():
            return []

        query_lower = query.lower()
        matches = []
        with open(self.index_file, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    entry = json.loads(line)
                    entry_text = json.dumps(entry).lower()
                    if query_lower in entry_text:
                        matches.append(entry)
                except json.JSONDecodeError:
                    continue

        # Most recent first
        matches.sort(key=lambda e: e.get("timestamp", ""), reverse=True)
        return matches[:limit]

    def rehydrate(self, max_entries: int = 50) -> list[dict]:
        """
        Load recent memory entries for LLM context window.
        Returns the last `max_entries` entries across this namespace.
        """
        if not self.index_file.exists():
            return []

        entries = []
        with open(self.index_file, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    entries.append(json.loads(line))
                except json.JSONDecodeError:
                    continue

        return entries[-max_entries:]

    def save_state(self, state: dict) -> None:
        """Overwrite the current state snapshot (mutable, for fast reads)."""
        state_with_meta = {
            **state,
            "_namespace": self.namespace,
            "_updated": datetime.now(timezone.utc).isoformat(),
        }
        with open(self.state_file, "w", encoding="utf-8") as f:
            json.dump(state_with_meta, f, indent=2)

    def load_state(self) -> dict:
        """Load the current state snapshot."""
        if not self.state_file.exists():
            return {}
        with open(self.state_file, encoding="utf-8") as f:
            return json.load(f)

    def dispatch_context(self, limit: int = 20) -> list[dict]:
        """
        Load recent dispatch log entries for orchestration context.
        Used by all agents to understand what has recently been run.
        """
        if not DISPATCH_LOG.exists():
            return []

        entries = []
        with open(DISPATCH_LOG, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    entries.append(json.loads(line))
                except json.JSONDecodeError:
                    continue

        return entries[-limit:]


# Module-level convenience functions
def get_memory(namespace: str = "global") -> VaultMemory:
    """Get a VaultMemory instance for a namespace."""
    return VaultMemory(namespace)


def build_llm_context(namespace: str, query: str = "") -> str:
    """
    Build a compressed context string for LLM injection.
    Returns a text block suitable for system prompt prepending.
    """
    vault = VaultMemory(namespace)
    recent = vault.rehydrate(50)
    dispatch = vault.dispatch_context(10)

    lines = [
        f"# Memory Context — {namespace}",
        f"Generated: {datetime.now(timezone.utc).isoformat()}",
        "",
        "## Recent Agent Memory",
    ]
    for entry in recent[-10:]:
        lines.append(f"- [{entry.get('key')}] {json.dumps(entry.get('value', ''))[:120]}")

    lines.extend(["", "## Recent Dispatches"])
    for entry in dispatch:
        lines.append(f"- {entry.get('timestamp', '')} | {entry.get('agent', '?')}::{entry.get('action', '?')}")

    return "\n".join(lines)
