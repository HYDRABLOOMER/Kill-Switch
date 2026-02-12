import requests
import sys
import json

def ensure_url_scheme(url):
    if not url.startswith(('http://', 'https://')):
        url = 'http://' + url
    return url

def check_clickjacking(url):
    try:
        # Ensure URL has scheme
        url = ensure_url_scheme(url)
        
        response = requests.get(url, timeout=5)
        headers = response.headers

        result = {
            "target": url,
            "status_code": response.status_code,
            "headers": {
                "x_frame_options": headers.get('X-Frame-Options', 'Not Set'),
                "content_security_policy": headers.get('Content-Security-Policy', 'Not Set')
            }
        }

        # Check for vulnerabilities
        vulnerabilities = []
        if 'X-Frame-Options' not in headers:
            vulnerabilities.append("Missing X-Frame-Options header")
        if 'Content-Security-Policy' not in headers:
            vulnerabilities.append("Missing Content-Security-Policy header")

        result["vulnerable"] = len(vulnerabilities) > 0
        result["vulnerabilities"] = vulnerabilities

        if result["vulnerable"]:
            result["message"] = "Vulnerable to Clickjacking"
        else:
            result["message"] = "Not vulnerable to Clickjacking"

        print(json.dumps(result))
    except Exception as e:
        error_result = {
            "error": str(e),
            "target": url
        }
        print(json.dumps(error_result))

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Please provide a target URL"}))
        sys.exit(1)
    
    url = sys.argv[1]
    check_clickjacking(url)
