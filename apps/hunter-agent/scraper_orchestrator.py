#!/usr/bin/env python3
"""
SHADOW HEADLESS BROWSER SCRAPER ORCHESTRATOR
=============================================
Integrated from InfinityXOneSystems/lead-sniper-system

Features:
- Asyncio-based parallel browser instances
- Configurable pool (1-100+ instances)
- Resource-efficient scaling
- Free resources compatible (GitHub Actions)
- Enterprise team ready

Based on lead-sniper-system/src/scrapers/headless_orchestrator.py
"""

import asyncio
import json
import logging
import random
import hashlib
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from enum import Enum
from pathlib import Path

logger = logging.getLogger('ScraperOrchestrator')


class ScraperMode(Enum):
    """Scraper operation modes"""
    CRAWL = "crawl"
    SCRAPE = "scrape"
    FORM_FILL = "form_fill"
    NAVIGATE = "navigate"
    EXTRACT = "extract"


class SiteType(Enum):
    """Supported site types"""
    GOVERNMENT = "government"
    AUCTION = "auction"
    REAL_ESTATE = "real_estate"
    COUNTY_RECORDS = "county_records"
    CONSTRUCTION = "construction"
    PERMITS = "permits"
    GENERIC = "generic"


@dataclass
class ScraperConfig:
    """Configuration for headless scraper orchestrator"""
    max_instances: int = 10  # Default to 10 for free resources
    headless: bool = True
    timeout_seconds: int = 30
    retry_attempts: int = 3
    rate_limit_ms: int = 1000
    user_agent_rotation: bool = True
    stealth_mode: bool = True
    screenshot_on_error: bool = False  # Disabled for resource efficiency


@dataclass
class ScrapeTarget:
    """Target configuration for scraping"""
    url: str
    site_type: SiteType
    mode: ScraperMode
    selectors: Dict[str, str] = field(default_factory=dict)
    form_data: Optional[Dict[str, str]] = None
    output_format: str = "json"


@dataclass
class ScrapeResult:
    """Result from a scraping operation"""
    target_id: str
    url: str
    success: bool
    data: Any = None
    error: Optional[str] = None
    items_extracted: int = 0
    execution_time_ms: float = 0
    timestamp: datetime = field(default_factory=lambda: datetime.now(timezone.utc))


class HeadlessInstance:
    """
    Single headless browser instance (Playwright-based)
    Optimized for resource efficiency and GitHub Actions
    """
    
    def __init__(self, instance_id: str, config: ScraperConfig):
        self.instance_id = instance_id
        self.config = config
        self.browser = None
        self.page = None
        self._active = False
        self._playwright = None
        
        # User agent pool for rotation
        self.user_agents = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"
        ]
    
    async def initialize(self):
        """Initialize the browser instance"""
        try:
            from playwright.async_api import async_playwright
            
            self._playwright = await async_playwright().start()
            
            # Launch browser with resource-efficient settings
            launch_options = {
                'headless': self.config.headless,
                'args': [
                    '--disable-blink-features=AutomationControlled',
                    '--disable-dev-shm-usage',
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-gpu',  # Resource efficiency
                    '--disable-software-rasterizer'
                ]
            }
            
            self.browser = await self._playwright.chromium.launch(**launch_options)
            
            # Create context with random user agent
            context_options = {'viewport': {'width': 1280, 'height': 720}}
            if self.config.user_agent_rotation:
                context_options['user_agent'] = random.choice(self.user_agents)
            
            self.context = await self.browser.new_context(**context_options)
            self.page = await self.context.new_page()
            
            # Apply stealth mode
            if self.config.stealth_mode:
                await self._apply_stealth()
            
            self._active = True
            logger.debug(f"Instance {self.instance_id} initialized")
            
        except ImportError:
            logger.warning(f"Playwright not available for {self.instance_id}, using mock mode")
            self._active = True
        except Exception as e:
            logger.error(f"Failed to initialize {self.instance_id}: {e}")
            raise
    
    async def _apply_stealth(self):
        """Apply stealth mode to avoid detection"""
        if self.page:
            await self.page.add_init_script("""
                Object.defineProperty(navigator, 'webdriver', {
                    get: () => undefined
                });
                Object.defineProperty(navigator, 'plugins', {
                    get: () => [1, 2, 3, 4, 5]
                });
                Object.defineProperty(navigator, 'languages', {
                    get: () => ['en-US', 'en']
                });
            """)
    
    async def navigate(self, url: str) -> bool:
        """Navigate to a URL"""
        try:
            if self.page:
                await self.page.goto(url, timeout=self.config.timeout_seconds * 1000)
                await self.page.wait_for_load_state('networkidle')
                return True
            return True  # Mock mode
        except Exception as e:
            logger.error(f"Navigation error for {self.instance_id}: {e}")
            return False
    
    async def extract(self, selectors: Dict[str, str]) -> Dict[str, Any]:
        """Extract data using selectors"""
        results = {}
        
        try:
            if self.page:
                for key, selector in selectors.items():
                    try:
                        element = await self.page.query_selector(selector)
                        if element:
                            results[key] = await element.text_content()
                    except:
                        results[key] = None
            else:
                # Mock mode - return empty results
                for key in selectors:
                    results[key] = None
                    
        except Exception as e:
            logger.error(f"Extraction error for {self.instance_id}: {e}")
        
        return results
    
    async def extract_all(self, selector: str, item_selectors: Dict[str, str]) -> List[Dict]:
        """Extract multiple items"""
        items = []
        
        try:
            if self.page:
                elements = await self.page.query_selector_all(selector)
                for element in elements:
                    item = {}
                    for key, sub_selector in item_selectors.items():
                        try:
                            sub_element = await element.query_selector(sub_selector)
                            if sub_element:
                                item[key] = await sub_element.text_content()
                        except:
                            item[key] = None
                    items.append(item)
        except Exception as e:
            logger.error(f"Extract all error for {self.instance_id}: {e}")
        
        return items
    
    async def cleanup(self):
        """Clean up browser resources"""
        try:
            if self.page:
                await self.page.close()
            if hasattr(self, 'context') and self.context:
                await self.context.close()
            if self.browser:
                await self.browser.close()
            if self._playwright:
                await self._playwright.stop()
            self._active = False
            logger.debug(f"Instance {self.instance_id} cleaned up")
        except Exception as e:
            logger.error(f"Cleanup error for {self.instance_id}: {e}")


class ScraperOrchestrator:
    """
    Headless Scraper Orchestration System
    Manages parallel browser instances for maximum throughput
    
    Optimized for:
    - Free resources (GitHub Actions with 10 parallel instances)
    - Enterprise teams (100+ parallel instances)
    - Asyncio-based concurrency
    - Auto-healing and retry logic
    """
    
    def __init__(self, config: Optional[ScraperConfig] = None):
        self.config = config or ScraperConfig()
        self.instances: Dict[str, HeadlessInstance] = {}
        self._instance_pool: asyncio.Queue = asyncio.Queue()
        self._running = False
        self._metrics = {
            'total_scrapes': 0,
            'successful_scrapes': 0,
            'failed_scrapes': 0,
            'items_extracted': 0,
            'start_time': None
        }
        logger.info(f"ScraperOrchestrator initialized (max_instances={self.config.max_instances})")
    
    async def start(self, num_instances: int = None):
        """Start the orchestrator with specified number of instances"""
        num_instances = num_instances or self.config.max_instances
        self._running = True
        self._metrics['start_time'] = datetime.now(timezone.utc)
        
        logger.info(f"Starting {num_instances} headless instances...")
        
        # Initialize instances in parallel (batches for resource efficiency)
        batch_size = 5
        for i in range(0, num_instances, batch_size):
            batch_tasks = []
            for j in range(i, min(i + batch_size, num_instances)):
                instance_id = f"scraper-{j:04d}"
                instance = HeadlessInstance(instance_id, self.config)
                batch_tasks.append(self._init_instance(instance))
            
            await asyncio.gather(*batch_tasks, return_exceptions=True)
            await asyncio.sleep(0.5)  # Brief pause between batches
        
        logger.info(f"Orchestrator started with {len(self.instances)} instances")
    
    async def _init_instance(self, instance: HeadlessInstance):
        """Initialize a single instance and add to pool"""
        try:
            await instance.initialize()
            self.instances[instance.instance_id] = instance
            await self._instance_pool.put(instance.instance_id)
        except Exception as e:
            logger.error(f"Failed to initialize instance {instance.instance_id}: {e}")
    
    async def stop(self):
        """Stop the orchestrator and cleanup all instances"""
        self._running = False
        
        cleanup_tasks = [
            instance.cleanup()
            for instance in self.instances.values()
        ]
        await asyncio.gather(*cleanup_tasks, return_exceptions=True)
        
        self.instances.clear()
        logger.info("Orchestrator stopped")
    
    async def scrape(self, target: ScrapeTarget) -> ScrapeResult:
        """Execute a single scrape operation with auto-retry"""
        start_time = datetime.now(timezone.utc)
        target_id = hashlib.md5(target.url.encode()).hexdigest()[:12]
        
        for attempt in range(self.config.retry_attempts):
            # Get an available instance
            instance_id = await self._instance_pool.get()
            instance = self.instances.get(instance_id)
            
            if not instance:
                await self._instance_pool.put(instance_id)
                continue
            
            try:
                # Navigate to URL
                nav_success = await instance.navigate(target.url)
                if not nav_success:
                    raise Exception("Navigation failed")
                
                # Extract data
                if target.selectors:
                    data = await instance.extract(target.selectors)
                else:
                    data = {}
                
                execution_time = (datetime.now(timezone.utc) - start_time).total_seconds() * 1000
                
                self._metrics['total_scrapes'] += 1
                self._metrics['successful_scrapes'] += 1
                self._metrics['items_extracted'] += len(data)
                
                result = ScrapeResult(
                    target_id=target_id,
                    url=target.url,
                    success=True,
                    data=data,
                    items_extracted=len(data),
                    execution_time_ms=execution_time
                )
                
                await self._instance_pool.put(instance_id)
                return result
                
            except Exception as e:
                logger.warning(f"Scrape attempt {attempt + 1} failed for {target.url}: {e}")
                await self._instance_pool.put(instance_id)
                
                if attempt == self.config.retry_attempts - 1:
                    # Final attempt failed
                    execution_time = (datetime.now(timezone.utc) - start_time).total_seconds() * 1000
                    self._metrics['total_scrapes'] += 1
                    self._metrics['failed_scrapes'] += 1
                    
                    return ScrapeResult(
                        target_id=target_id,
                        url=target.url,
                        success=False,
                        error=str(e),
                        execution_time_ms=execution_time
                    )
                
                await asyncio.sleep(1)  # Brief pause before retry
    
    async def scrape_parallel(self, targets: List[ScrapeTarget]) -> List[ScrapeResult]:
        """Execute multiple scrapes in parallel"""
        logger.info(f"Starting parallel scrape of {len(targets)} targets")
        
        results = await asyncio.gather(
            *[self.scrape(target) for target in targets],
            return_exceptions=True
        )
        
        # Convert exceptions to results
        final_results = []
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                final_results.append(ScrapeResult(
                    target_id=f"error-{i}",
                    url=targets[i].url,
                    success=False,
                    error=str(result)
                ))
            else:
                final_results.append(result)
        
        success_count = sum(1 for r in final_results if r.success)
        logger.info(f"Parallel scrape complete: {success_count}/{len(targets)} succeeded")
        
        return final_results
    
    def get_metrics(self) -> Dict:
        """Get orchestrator metrics"""
        uptime = None
        if self._metrics['start_time']:
            uptime = (datetime.now(timezone.utc) - self._metrics['start_time']).total_seconds()
        
        return {
            **self._metrics,
            'uptime_seconds': uptime,
            'active_instances': len(self.instances),
            'pool_available': self._instance_pool.qsize(),
            'success_rate': (
                self._metrics['successful_scrapes'] / max(1, self._metrics['total_scrapes'])
            ) * 100
        }


# Export main classes
__all__ = [
    'ScraperOrchestrator',
    'ScraperConfig',
    'ScrapeTarget',
    'ScrapeResult',
    'ScraperMode',
    'SiteType'
]
