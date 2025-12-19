import subprocess
import re
from pathlib import Path

SRC = Path("src")  # change to app/ or pages/ if needed
AUTHOR_MAP = {}

if Path("authors.map").exists():
    for line in Path("authors.map").read_text().splitlines():
        if "=" in line:
            k, v = line.split("=", 1)
            AUTHOR_MAP[k.strip()] = v.strip()

patterns = [
    re.compile(r"^\s*export\s+default\s+function"),
    re.compile(r"^\s*export\s+(async\s+)?function"),
    re.compile(r"^\s*export\s+const\s+\w+\s*=\s*\("),
    re.compile(r"^\s*const\s+\w+\s*=\s*\("),
    re.compile(r"^\s*function\s+\w+\s*\("),
]

extensions = {".js", ".jsx", ".ts", ".tsx"}

for file in SRC.rglob("*"):
    if file.suffix not in extensions:
        continue

    lines = file.read_text().splitlines()
    new_lines = []

    for i, line in enumerate(lines):
        stripped = line.strip()

        # Avoid duplicate tags
        if stripped.startswith("/**") and "@author" in stripped:
            new_lines.append(line)
            continue

        if any(p.match(stripped) for p in patterns):
            try:
                out = subprocess.check_output(
                    ["git", "blame", "-L", f"{i+1},{i+1}", str(file)],
                    text=True,
                    stderr=subprocess.DEVNULL,
                )
                author = out.split("(")[1].split(")")[0].strip()
                author = AUTHOR_MAP.get(author, author)

                new_lines.append("/**")
                new_lines.append(f" * @author {author}")
                new_lines.append(" */")
            except Exception:
                pass

        new_lines.append(line)

    file.write_text("\n".join(new_lines))
    print(f"Processed {file}")
