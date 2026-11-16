#!/usr/bin/env python3
"""
Lightweight validation suite for portfolio site.
Verifies internal asset references, external links, and critical project URLs.
"""
from html.parser import HTMLParser
from pathlib import Path
import sys
from urllib.parse import urlparse

ROOT_DIR = Path(__file__).resolve().parent.parent
INDEX_HTML = ROOT_DIR / "index.html"

class LinkExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.assets = []

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        if tag == "a" and "href" in attr_dict:
            self.links.append(attr_dict["href"])
        elif tag == "link" and "href" in attr_dict:
            self.assets.append(attr_dict["href"])
        elif tag == "script" and "src" in attr_dict:
            self.assets.append(attr_dict["src"])
        elif tag == "img" and "src" in attr_dict:
            self.assets.append(attr_dict["src"])

def main():
    if not INDEX_HTML.exists():
        print(f"FAIL: {INDEX_HTML} not found.")
        sys.exit(1)

    html_content = INDEX_HTML.read_text(encoding="utf-8")
    parser = LinkExtractor()
    parser.feed(html_content)

    errors = []

    # 1. Verify deprecated links are absent
    deprecated = ["self-updating-rag.vercel.app"]
    for dep in deprecated:
        if dep in html_content:
            errors.append(f"Found deprecated link '{dep}' in index.html")

    # 2. Verify critical project links exist
    required_links = [
        "https://github.com/Jyotiraditya21-bug/permission-aware-RAG",
        "https://jyotiraditya21-bug.github.io/permission-aware-RAG/#live-demo",
        "https://github.com/Jyotiraditya21-bug/LuminateAI",
        "https://luminate-ai-rag.vercel.app",
        "https://github.com/Jyotiraditya21-bug/RepoMind",
        "https://jyotiraditya21-bug.github.io/RepoMind/",
        "https://jimmy2110-repomind-backend.hf.space/docs",
    ]
    for req in required_links:
        if req not in parser.links and req not in html_content:
            errors.append(f"Missing required project link: {req}")

    # 3. Verify local static assets exist on disk
    for asset in parser.assets:
        if asset.startswith("http://") or asset.startswith("https://") or asset.startswith("//"):
            continue
        asset_clean = asset.split("?")[0].split("#")[0].lstrip("/")
        asset_path = ROOT_DIR / asset_clean
        if not asset_path.exists():
            errors.append(f"Referenced local asset does not exist: {asset} (expected {asset_path})")

    # 4. Verify status grids are rendered for all 3 projects
    status_grid_count = html_content.count("class=\"project__status-grid\"")
    if status_grid_count != 3:
        errors.append(f"Expected 3 project__status-grid blocks, found {status_grid_count}")

    if errors:
        print("FAIL: Portfolio check failed with errors:")
        for err in errors:
            print(f"  - {err}")
        sys.exit(1)

    print(f"SUCCESS: Portfolio validation passed! ({len(parser.links)} links, {len(parser.assets)} assets checked, {status_grid_count} status grids verified)")

if __name__ == "__main__":
    main()
