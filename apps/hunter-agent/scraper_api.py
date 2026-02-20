#!/usr/bin/env python3
"""
SHADOW HEADLESS BROWSER REST API
=================================
REST API wrapper for the scraper orchestrator

Provides HTTP endpoints for:
- Starting/stopping orchestrator
- Submitting scrape jobs
- Retrieving results
- Monitoring metrics

Compatible with free resources and enterprise deployment
"""

import asyncio
import json
import logging
from datetime import datetime
from typing import Dict, List, Optional
from pathlib import Path
import uuid

# Conditional imports for API framework
try:
    from fastapi import FastAPI, HTTPException, BackgroundTasks
    from fastapi.responses import JSONResponse
    from pydantic import BaseModel
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False
    # Fallback for basic HTTP server
    from http.server import HTTPServer, BaseHTTPRequestHandler
    import urllib.parse

from scraper_orchestrator import (
    ScraperOrchestrator,
    ScraperConfig,
    ScrapeTarget,
    ScrapeResult,
    ScraperMode,
    SiteType
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('ScraperAPI')

# Global orchestrator instance
orchestrator: Optional[ScraperOrchestrator] = None
job_results: Dict[str, List[ScrapeResult]] = {}


if HAS_FASTAPI:
    # FastAPI implementation (preferred for enterprise)
    app = FastAPI(
        title="Shadow Headless Browser API",
        description="REST API for parallel headless browser scraping",
        version="1.0.0"
    )
    
    class ScrapeJobRequest(BaseModel):
        """Request model for scrape job"""
        urls: List[str]
        site_type: str = "generic"
        mode: str = "scrape"
        selectors: Optional[Dict[str, str]] = None
        max_instances: Optional[int] = 10
    
    class OrchestratorConfig(BaseModel):
        """Configuration for orchestrator"""
        max_instances: int = 10
        headless: bool = True
        timeout_seconds: int = 30
    
    @app.post("/orchestrator/start")
    async def start_orchestrator(config: OrchestratorConfig):
        """Start the scraper orchestrator"""
        global orchestrator
        
        if orchestrator and orchestrator._running:
            return {"status": "already_running", "active_instances": len(orchestrator.instances)}
        
        scraper_config = ScraperConfig(
            max_instances=config.max_instances,
            headless=config.headless,
            timeout_seconds=config.timeout_seconds
        )
        
        orchestrator = ScraperOrchestrator(scraper_config)
        await orchestrator.start()
        
        return {
            "status": "started",
            "active_instances": len(orchestrator.instances),
            "config": config.dict()
        }
    
    @app.post("/orchestrator/stop")
    async def stop_orchestrator():
        """Stop the scraper orchestrator"""
        global orchestrator
        
        if not orchestrator or not orchestrator._running:
            return {"status": "not_running"}
        
        await orchestrator.stop()
        
        return {"status": "stopped"}
    
    @app.get("/orchestrator/metrics")
    async def get_metrics():
        """Get orchestrator metrics"""
        if not orchestrator:
            raise HTTPException(status_code=404, detail="Orchestrator not initialized")
        
        metrics = orchestrator.get_metrics()
        return metrics
    
    @app.post("/scrape/submit")
    async def submit_scrape_job(request: ScrapeJobRequest, background_tasks: BackgroundTasks):
        """Submit a scrape job"""
        global orchestrator
        
        if not orchestrator or not orchestrator._running:
            raise HTTPException(status_code=400, detail="Orchestrator not running. Start it first.")
        
        job_id = str(uuid.uuid4())
        
        # Create scrape targets
        targets = []
        for url in request.urls:
            target = ScrapeTarget(
                url=url,
                site_type=SiteType[request.site_type.upper()],
                mode=ScraperMode[request.mode.upper()],
                selectors=request.selectors or {}
            )
            targets.append(target)
        
        # Execute scraping in background
        background_tasks.add_task(execute_scrape_job, job_id, targets)
        
        return {
            "job_id": job_id,
            "status": "submitted",
            "target_count": len(targets)
        }
    
    @app.get("/scrape/results/{job_id}")
    async def get_job_results(job_id: str):
        """Get results for a scrape job"""
        if job_id not in job_results:
            raise HTTPException(status_code=404, detail="Job not found or still processing")
        
        results = job_results[job_id]
        
        return {
            "job_id": job_id,
            "total": len(results),
            "successful": sum(1 for r in results if r.success),
            "failed": sum(1 for r in results if not r.success),
            "results": [
                {
                    "target_id": r.target_id,
                    "url": r.url,
                    "success": r.success,
                    "data": r.data,
                    "error": r.error,
                    "items_extracted": r.items_extracted,
                    "execution_time_ms": r.execution_time_ms
                }
                for r in results
            ]
        }
    
    @app.get("/health")
    async def health_check():
        """Health check endpoint"""
        return {
            "status": "healthy",
            "orchestrator_running": orchestrator is not None and orchestrator._running,
            "timestamp": datetime.utcnow().isoformat()
        }
    
    async def execute_scrape_job(job_id: str, targets: List[ScrapeTarget]):
        """Execute a scrape job (background task)"""
        global orchestrator, job_results
        
        try:
            results = await orchestrator.scrape_parallel(targets)
            job_results[job_id] = results
            logger.info(f"Job {job_id} completed: {len(results)} results")
        except Exception as e:
            logger.error(f"Job {job_id} failed: {e}")
            job_results[job_id] = []

else:
    # Basic HTTP server fallback (for minimal dependencies)
    class ScraperAPIHandler(BaseHTTPRequestHandler):
        """Basic HTTP request handler for scraper API"""
        
        def do_GET(self):
            """Handle GET requests"""
            if self.path == '/health':
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = {
                    "status": "healthy",
                    "message": "Scraper API is running (basic mode - install FastAPI for full features)"
                }
                self.wfile.write(json.dumps(response).encode())
            else:
                self.send_response(404)
                self.end_headers()
        
        def do_POST(self):
            """Handle POST requests"""
            self.send_response(501)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {"error": "Install FastAPI for full API functionality"}
            self.wfile.write(json.dumps(response).encode())
        
        def log_message(self, format, *args):
            """Override to use logger"""
            logger.info("%s - - [%s] %s\n" %
                       (self.address_string(),
                        self.log_date_time_string(),
                        format%args))


def run_api_server(host: str = "0.0.0.0", port: int = 8000):
    """Run the API server"""
    if HAS_FASTAPI:
        import uvicorn
        logger.info(f"Starting FastAPI server on {host}:{port}")
        uvicorn.run(app, host=host, port=port)
    else:
        logger.warning("FastAPI not available, starting basic HTTP server")
        logger.info(f"Starting basic HTTP server on {host}:{port}")
        logger.info("Install FastAPI and uvicorn for full API features:")
        logger.info("  pip install fastapi uvicorn")
        
        server = HTTPServer((host, port), ScraperAPIHandler)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            logger.info("Server stopped")
            server.server_close()


if __name__ == "__main__":
    run_api_server()
