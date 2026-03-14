import subprocess
import sys
import os

os.chdir(r"C:\Users\A2Z\OneDrive\Documents\NDN Analytics\Hackaton\Rais 26 by Dorahacks")
subprocess.Popen(
    [sys.executable, "app.py"],
    creationflags=subprocess.CREATE_NEW_CONSOLE
    if hasattr(subprocess, "CREATE_NEW_CONSOLE")
    else 0,
)
