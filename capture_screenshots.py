import os
import time
import subprocess
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import base64

# Setup Chrome options for headless
chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--window-size=400,900")
chrome_options.add_argument("--hide-scrollbars")
chrome_options.add_argument("--force-device-scale-factor=1")

# Screens to capture
screens = [
    {"name": "01_home", "click": None, "wait": 3},
    {
        "name": "02_translate",
        "click": ("xpath", "//button[contains(@onclick, 'translate')]"),
        "wait": 5,
    },
    {
        "name": "03_learn",
        "click": ("xpath", "//button[contains(@onclick, 'learn')]"),
        "wait": 3,
    },
    {
        "name": "04_settings",
        "click": ("xpath", "//button[contains(@onclick, 'settings')]"),
        "wait": 3,
    },
]

output_dir = r"C:\Users\A2Z\OneDrive\Documents\NDN Analytics\Hackaton\Rais 26 by Dorahacks\assets\screenshots"
os.makedirs(output_dir, exist_ok=True)

try:
    driver = webdriver.Chrome(options=chrome_options)
    driver.get("https://sign-interpreter-five.vercel.app")

    time.sleep(5)  # Wait for page load

    # Take initial screenshot
    for i, screen in enumerate(screens):
        print(f"Capturing {screen['name']}...")

        # Click to navigate if needed
        if screen.get("click"):
            click_type, click_value = screen["click"]
            elem = driver.find_element(By.XPATH, click_value)
            elem.click()

        time.sleep(screen["wait"])

        # Save screenshot
        filepath = os.path.join(output_dir, f"{screen['name']}.png")
        driver.save_screenshot(filepath)
        print(f"Saved: {filepath}")

    print("All screenshots captured!")

except Exception as e:
    print(f"Error: {e}")
finally:
    driver.quit()
