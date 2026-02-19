#!/usr/bin/env python3
"""
Construct-OS System Validation Script
Tests all components end-to-end
"""

import json
import os
import subprocess
import sys
from pathlib import Path
from datetime import datetime, timezone

class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_header(message):
    print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{message}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}\n")

def print_success(message):
    print(f"{Colors.OKGREEN}✅ {message}{Colors.ENDC}")

def print_error(message):
    print(f"{Colors.FAIL}❌ {message}{Colors.ENDC}")

def print_info(message):
    print(f"{Colors.OKCYAN}ℹ️  {message}{Colors.ENDC}")

def validate_directory_structure():
    """Validate that all required directories exist"""
    print_header("Directory Structure Validation")
    
    required_dirs = [
        "apps/hunter-agent",
        "apps/architect-ai",
        "apps/command-center",
        "data",
        ".github/workflows",
        ".infinity"
    ]
    
    all_exist = True
    for dir_path in required_dirs:
        path = Path(dir_path)
        if path.exists() and path.is_dir():
            print_success(f"Directory exists: {dir_path}")
        else:
            print_error(f"Missing directory: {dir_path}")
            all_exist = False
    
    return all_exist

def validate_workflows():
    """Validate that all required workflows exist"""
    print_header("Workflow Validation")
    
    required_workflows = [
        "auto-merge.yml",
        "genesis-loop.yml",
        "heartbeat.yml",
        "hunter-cron.yml",
        "self-repair.yml",
        "pr-orchestrator.yml",
        "conflict-resolver.yml"
    ]
    
    workflow_dir = Path(".github/workflows")
    all_exist = True
    
    for workflow in required_workflows:
        workflow_path = workflow_dir / workflow
        if workflow_path.exists():
            print_success(f"Workflow exists: {workflow}")
        else:
            print_error(f"Missing workflow: {workflow}")
            all_exist = False
    
    return all_exist

def validate_data_files():
    """Validate data files"""
    print_header("Data Files Validation")
    
    # Check leads.json
    leads_path = Path("data/leads.json")
    if leads_path.exists():
        try:
            with open(leads_path) as f:
                data = json.load(f)
                print_success(f"leads.json is valid JSON")
                print_info(f"  Total leads: {data.get('metadata', {}).get('total_leads', 0)}")
        except json.JSONDecodeError as e:
            print_error(f"leads.json is invalid JSON: {e}")
            return False
    else:
        print_error("leads.json does not exist")
        return False
    
    # Check active_memory.md
    memory_path = Path(".infinity/ACTIVE_MEMORY.md")
    if memory_path.exists():
        print_success("ACTIVE_MEMORY.md exists")
    else:
        print_error("ACTIVE_MEMORY.md does not exist")
        return False
    
    return True

def test_hunter_agent():
    """Test Hunter Agent functionality"""
    print_header("Hunter Agent Test")
    
    try:
        result = subprocess.run(
            ["python3", "apps/hunter-agent/main.py"],
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if result.returncode == 0:
            print_success("Hunter agent executed successfully")
            print_info("Output preview:")
            for line in result.stdout.split('\n')[:10]:
                if line.strip():
                    print(f"    {line}")
            return True
        else:
            print_error(f"Hunter agent failed with exit code {result.returncode}")
            print_info(f"Error: {result.stderr[:500]}")
            return False
    except subprocess.TimeoutExpired:
        print_error("Hunter agent timed out after 30 seconds")
        return False
    except Exception as e:
        print_error(f"Failed to test hunter agent: {e}")
        return False

def test_architect_ai():
    """Test Architect AI"""
    print_header("Architect AI Test")
    
    estimator_path = Path("apps/architect-ai/estimator.py")
    if estimator_path.exists():
        print_success("Architect AI estimator.py exists")
        # Basic syntax check
        try:
            result = subprocess.run(
                ["python3", "-m", "py_compile", str(estimator_path)],
                capture_output=True,
                text=True
            )
            if result.returncode == 0:
                print_success("Architect AI syntax is valid")
                return True
            else:
                print_error(f"Architect AI has syntax errors: {result.stderr}")
                return False
        except Exception as e:
            print_error(f"Failed to validate Architect AI: {e}")
            return False
    else:
        print_error("Architect AI estimator.py does not exist")
        return False

def generate_report(results):
    """Generate final report"""
    print_header("System Validation Summary")
    
    total = len(results)
    passed = sum(1 for r in results.values() if r)
    failed = total - passed
    
    print(f"Total Tests: {total}")
    print(f"{Colors.OKGREEN}Passed: {passed}{Colors.ENDC}")
    print(f"{Colors.FAIL}Failed: {failed}{Colors.ENDC}")
    print(f"Success Rate: {(passed/total)*100:.1f}%")
    
    print("\nDetailed Results:")
    for test_name, result in results.items():
        status = f"{Colors.OKGREEN}PASS{Colors.ENDC}" if result else f"{Colors.FAIL}FAIL{Colors.ENDC}"
        print(f"  {test_name}: {status}")
    
    return failed == 0

def main():
    """Main validation routine"""
    print(f"\n{Colors.BOLD}🏗️  CONSTRUCT-OS SYSTEM VALIDATION{Colors.ENDC}")
    print(f"{Colors.BOLD}Timestamp: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}{Colors.ENDC}")
    
    results = {}
    
    # Run all validations
    results["Directory Structure"] = validate_directory_structure()
    results["Workflows"] = validate_workflows()
    results["Data Files"] = validate_data_files()
    results["Hunter Agent"] = test_hunter_agent()
    results["Architect AI"] = test_architect_ai()
    
    # Generate report
    success = generate_report(results)
    
    if success:
        print(f"\n{Colors.OKGREEN}{Colors.BOLD}🎉 ALL VALIDATIONS PASSED - SYSTEM OPERATIONAL{Colors.ENDC}\n")
        sys.exit(0)
    else:
        print(f"\n{Colors.FAIL}{Colors.BOLD}❌ SOME VALIDATIONS FAILED - REVIEW REQUIRED{Colors.ENDC}\n")
        sys.exit(1)

if __name__ == "__main__":
    main()
