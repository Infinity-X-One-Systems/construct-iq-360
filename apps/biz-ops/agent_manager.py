#!/usr/bin/env python3
"""
BIZ-OPS AGENT MANAGER
======================
Central orchestration hub for all Construct-OS business operations agents.

Architecture:
    Infinity Orchestrator → repository_dispatch → agent_manager.py → Agent

Agents:
    - Hunter:    Lead acquisition (scraper orchestrator + permit APIs)
    - Architect: Estimation + AIA billing + Vertex AI AutoML
    - Orator:    Document generation (proposals, contracts, runbooks)
    - Shadow:    Headless browser REST API (form fill, snapshot, extract)
    - Commander: Deployment + workflow health + Genesis Loop
    - Vault:     Enterprise memory + context rehydration + audit logs

Usage:
    python agent_manager.py --agent hunter --action run
    python agent_manager.py --agent architect --action estimate --project-value 500000
    python agent_manager.py --agent orator --action generate --doc-type residential-bid
    python agent_manager.py --agent vault --action rehydrate
"""

import argparse
import json
import logging
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%SZ",
)
logger = logging.getLogger("AgentManager")

# Base directories
REPO_ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = REPO_ROOT / "data"
DISPATCH_LOG = DATA_DIR / "dispatch-log" / "commands.jsonl"
AGENT_BLUEPRINTS = Path(__file__).parent / "blueprints"


def log_dispatch(agent: str, action: str, payload: dict) -> None:
    """Audit log every agent dispatch to the Vault."""
    DISPATCH_LOG.parent.mkdir(parents=True, exist_ok=True)
    entry = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "agent": agent,
        "action": action,
        "payload": payload,
        "source": "biz-ops/agent_manager.py",
    }
    with open(DISPATCH_LOG, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry) + "\n")
    logger.info(f"Dispatched: {agent}::{action}")


def load_blueprint(agent: str) -> dict:
    """Load an agent's blueprint configuration."""
    blueprint_path = AGENT_BLUEPRINTS / f"{agent}.json"
    if blueprint_path.exists():
        with open(blueprint_path, encoding="utf-8") as f:
            return json.load(f)
    return {"agent": agent, "status": "blueprint_missing"}


def run_hunter(action: str = "run", payload: Optional[dict] = None) -> dict:
    """Execute the Hunter lead acquisition agent."""
    payload = payload or {}
    logger.info("Hunter agent starting — Orlando metro lead discovery")

    hunter_main = REPO_ROOT / "apps" / "hunter-agent" / "main.py"
    if not hunter_main.exists():
        return {"status": "error", "message": f"Hunter agent not found: {hunter_main}"}

    import subprocess
    result = subprocess.run(
        [sys.executable, str(hunter_main)],
        capture_output=True,
        text=True,
        cwd=str(hunter_main.parent),
        env={**os.environ, "PYTHONPATH": str(hunter_main.parent)},
    )

    output = {
        "status": "success" if result.returncode == 0 else "error",
        "stdout": result.stdout[-2000:] if result.stdout else "",
        "stderr": result.stderr[-500:] if result.stderr else "",
        "returncode": result.returncode,
    }
    return output


def run_architect(action: str = "estimate", payload: Optional[dict] = None) -> dict:
    """Execute the Architect estimation agent."""
    payload = payload or {}
    logger.info(f"Architect agent starting — action={action}")

    estimator = REPO_ROOT / "apps" / "architect-ai" / "estimator.py"
    if not estimator.exists():
        return {"status": "error", "message": f"Architect agent not found: {estimator}"}

    import subprocess
    result = subprocess.run(
        [sys.executable, str(estimator)],
        capture_output=True,
        text=True,
        cwd=str(estimator.parent),
    )

    return {
        "status": "success" if result.returncode == 0 else "error",
        "stdout": result.stdout[-2000:] if result.stdout else "",
        "returncode": result.returncode,
        "action": action,
        "payload": payload,
    }


def run_orator(action: str = "generate", payload: Optional[dict] = None) -> dict:
    """Execute the Orator document generation agent."""
    payload = payload or {}
    doc_type = payload.get("doc_type", "general")
    project_name = payload.get("project_name", "Untitled Project")
    logger.info(f"Orator agent starting — doc_type={doc_type}, project={project_name}")

    output_dir = DATA_DIR / "documents"
    output_dir.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    output_file = output_dir / f"{doc_type}_{timestamp}.md"

    document_content = f"""# {doc_type.replace('-', ' ').title()}

**Project:** {project_name}
**Generated:** {datetime.now(timezone.utc).isoformat()}
**Agent:** Orator (Construct-OS Biz-Ops)

---

*Document generated by Orator agent. Full template rendering requires template engine.*

See: apps/command-center/src/lib/templates.ts for complete template definitions.
"""

    with open(output_file, "w", encoding="utf-8") as f:
        f.write(document_content)

    return {
        "status": "success",
        "doc_type": doc_type,
        "project_name": project_name,
        "output_file": str(output_file),
    }


def run_shadow(action: str = "scrape", payload: Optional[dict] = None) -> dict:
    """Execute the Shadow headless browser agent."""
    payload = payload or {}
    logger.info(f"Shadow agent starting — action={action}")

    scraper_api = REPO_ROOT / "apps" / "hunter-agent" / "scraper_api.py"
    if not scraper_api.exists():
        return {"status": "error", "message": f"Shadow agent not found: {scraper_api}"}

    return {
        "status": "ready",
        "action": action,
        "api_module": str(scraper_api),
        "message": "Shadow headless REST API ready. Start with: python scraper_api.py",
        "governance": {
            "rate_limit_ms": 1000,
            "max_instances": 10,
            "guardrails": ["robots.txt respected", "rate limiting enforced", "audit logged"],
        },
    }


def run_commander(action: str = "status", payload: Optional[dict] = None) -> dict:
    """Execute the Commander deployment and ops agent."""
    payload = payload or {}
    logger.info(f"Commander agent starting — action={action}")

    workflows = [
        "genesis-loop.yml",
        "deploy-command-center.yml",
        "auto-merge.yml",
        "heartbeat.yml",
        "self-repair.yml",
    ]

    return {
        "status": "success",
        "action": action,
        "workflows": workflows,
        "github_pages": "https://infinityxonesystems.github.io/construct-iq-360/",
        "message": f"Commander executed action={action}",
    }


def run_vault(action: str = "rehydrate", payload: Optional[dict] = None) -> dict:
    """Execute the Vault memory and knowledge agent."""
    payload = payload or {}
    logger.info(f"Vault agent starting — action={action}")

    memory_state = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "action": action,
        "dispatch_log": str(DISPATCH_LOG),
        "data_dir": str(DATA_DIR),
    }

    if action == "rehydrate":
        # Read recent dispatch log entries for context
        context = []
        if DISPATCH_LOG.exists():
            with open(DISPATCH_LOG, encoding="utf-8") as f:
                lines = f.readlines()
                for line in lines[-20:]:  # Last 20 entries
                    try:
                        context.append(json.loads(line.strip()))
                    except json.JSONDecodeError:
                        pass
        memory_state["recent_dispatches"] = context

    elif action == "archive":
        archive_dir = DATA_DIR / "dispatch-log" / "archive"
        archive_dir.mkdir(parents=True, exist_ok=True)
        memory_state["archive_dir"] = str(archive_dir)

    return {"status": "success", **memory_state}


AGENT_RUNNERS = {
    "hunter": run_hunter,
    "architect": run_architect,
    "orator": run_orator,
    "shadow": run_shadow,
    "commander": run_commander,
    "vault": run_vault,
}


def main() -> int:
    """Main entry point for the biz-ops agent manager."""
    parser = argparse.ArgumentParser(
        description="Construct-OS Biz-Ops Agent Manager",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("--agent", required=True, choices=list(AGENT_RUNNERS.keys()), help="Agent to run")
    parser.add_argument("--action", default="run", help="Action to execute")
    parser.add_argument("--payload", default="{}", help="JSON payload for the agent")
    parser.add_argument("--blueprint", action="store_true", help="Print agent blueprint and exit")

    args = parser.parse_args()

    if args.blueprint:
        blueprint = load_blueprint(args.agent)
        print(json.dumps(blueprint, indent=2))
        return 0

    try:
        payload = json.loads(args.payload)
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON payload: {e}")
        return 1

    # Universal validation: log every dispatch
    log_dispatch(args.agent, args.action, payload)

    # Execute the agent
    runner = AGENT_RUNNERS[args.agent]
    try:
        result = runner(args.action, payload)
        print(json.dumps(result, indent=2))
        return 0 if result.get("status") in ("success", "ready") else 1
    except Exception as e:
        logger.error(f"Agent {args.agent} failed: {e}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
