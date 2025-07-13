from bs4 import BeautifulSoup

html = "<html><body><h1>Hello</h1></body></html>"
try:
    soup = BeautifulSoup(html, "lxml")
    print("lxml parser works!")
except Exception as e:
    print(f"lxml parser failed: {e}") 