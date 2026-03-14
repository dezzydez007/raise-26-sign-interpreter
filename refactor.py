import os

with open("index.html", "r", encoding="utf-8") as f:
    lines = f.readlines()

css_lines = lines[31:44]
js_lines = lines[1031:2143]

os.makedirs(os.path.join("assets", "css"), exist_ok=True)
os.makedirs(os.path.join("assets", "js"), exist_ok=True)

with open(os.path.join("assets", "css", "style.css"), "w", encoding="utf-8") as f:
    f.writelines(css_lines)

with open(os.path.join("assets", "js", "main.js"), "w", encoding="utf-8") as f:
    f.writelines(js_lines)

new_html = lines[:30] + ['    <link rel="stylesheet" href="assets/css/style.css">\n'] + lines[45:1030] + ['    <script src="assets/js/main.js"></script>\n'] + lines[2144:]

with open("index.html", "w", encoding="utf-8") as f:
    f.writelines(new_html)

print("Refactoring completed successfully.")
