from langchain_core.tools import tool
import requests
from bs4 import BeautifulSoup 
from tavily import TavilyClient 
import os 
from dotenv import load_dotenv 
from rich import print
load_dotenv() 

tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

@tool
def web_search(query: str) -> dict:
    """Search the web for recent reliable info on a topic. Returns Titles, URLs and short descriptions."""
    results = tavily.search(query=query, max_results=5)
    out =[]
    for r in results["results"]:
        out.append(f"Title: {r['title']}\nURL: {r['url']}\nsnippet: {r['content'][:300]}\n")
    return "\n-----\n".join(out)

print(web_search.invoke({"query": "What are the updates on ai?"}))



@tool
def web_scrape(url: str) -> str:
    """Scrape a webpage for its content."""
    try:
        response = requests.get(url, timeout=8 , headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"})
        soup = BeautifulSoup(response.content, "html.parser")
        for tag in soup(["script", "style", "footer", "nav"]):
            tag.decompose()
        return soup.get_text(separator=" ",strip=True)[:2000]
    except Exception as e:
        return f"Error scraping {url}: {e}"


print(web_scrape.invoke({"url": "https://en.wikipedia.org/wiki/Artificial_intelligence"}))