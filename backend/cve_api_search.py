import requests
import sys
import json

def search_cves(keyword):
    url = f"https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch={keyword}&resultsPerPage=20"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        
        vulnerabilities = []
        for item in data.get("vulnerabilities", []):
            cve_info = item.get("cve", {})
            cve_id = cve_info.get("id", "N/A")
            description = cve_info.get("descriptions", [{}])[0].get("value", "No description provided.")
            severity = cve_info.get("metrics", {}).get("cvssMetricV2", [{}])[0].get("baseSeverity", "Unknown")
            vulnerabilities.append({
                "cve_id": cve_id,
                "description": description,
                "severity": severity
            })
        
        result = {
            "vulnerable": len(vulnerabilities) > 0,
            "vulnerabilities": vulnerabilities
        }
        
        print(json.dumps(result))
    
    except Exception as e:
        print(json.dumps({
            "error": str(e),
            "vulnerable": False,
            "vulnerabilities": []
        }))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({
            "error": "No search keyword provided.",
            "vulnerable": False,
            "vulnerabilities": []
        }))
    else:
        search_cves(sys.argv[1])
