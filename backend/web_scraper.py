import requests
from bs4 import BeautifulSoup
import sys
import json

def scrape_extra_cve_info(cve_id):
    url = f"https://www.cvedetails.com/cve/{cve_id}/"
    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        # Extract description from meta tag
        summary = None
        summary_div = soup.find('meta', {'name': 'description'})
        if summary_div:
            summary = summary_div.get('content', '').strip()

        # Fallback: Search for paragraphs containing 'Description'
        if not summary:
            paragraphs = soup.find_all('p')
            for para in paragraphs:
                if 'Description' in para.text:
                    summary = para.text.strip()
                    break

        result = {
            "cve_id": cve_id,
            "description": summary or f"No description found for {cve_id}",
            "success": True
        }

        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({
            "cve_id": cve_id,
            "description": f"Error while scraping: {e}",
            "success": False
        }))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({
            "error": "No CVE ID provided.",
            "success": False
        }))
    else:
        scrape_extra_cve_info(sys.argv[1])
