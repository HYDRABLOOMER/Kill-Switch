import requests
from bs4 import BeautifulSoup
import sys
import json
from urllib.parse import urlparse

# Payload to test XSS
XSS_PAYLOAD = "<script>alert('XSS')</script>"

def ensure_url_scheme(url):
    if not url.startswith(('http://', 'https://')):
        url = 'http://' + url
    return url

def check_xss(url):
    try:
        # Ensure URL has scheme
        url = ensure_url_scheme(url)
        
        # Inject XSS payload in query parameter
        test_url = f"{url}?q={XSS_PAYLOAD}"

        # Send GET request
        response = requests.get(test_url, timeout=10)

        # Parse response HTML
        soup = BeautifulSoup(response.text, 'html.parser')

        # Check if our payload is reflected in the response
        result = {
            "target": url,
            "test_url": test_url,
            "vulnerable": XSS_PAYLOAD in response.text,
            "status_code": response.status_code
        }

        if result["vulnerable"]:
            result["message"] = f"Possible XSS vulnerability found at: {test_url}"
        else:
            result["message"] = f"No XSS vulnerability detected at: {test_url}"
        
        print(json.dumps(result))
    
    except requests.exceptions.RequestException as e:
        error_result = {
            "error": f"Could not connect to the site: {str(e)}",
            "target": url
        }
        print(json.dumps(error_result))

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Please provide a target URL"}))
        sys.exit(1)
    
    url = sys.argv[1]
    check_xss(url)
