import pandas as pd
from sklearn.naive_bayes import GaussianNB
import sys
import json

def ensure_url_scheme(url):
    if not url.startswith(('http://', 'https://')):
        url = 'http://' + url
    return url

# Sample training data
data = {
    'url': [
        'https://www.google.com',
        'https://github.com',
        'https://stackoverflow.com',
        'https://docs.python.org',
        'https://example.com',
        'http://update-account.fakebank.com/login',
        'http://malicious-site.tk/phish',
        'http://secure-login.fakebank.com',
        'http://192.168.0.1/login',
        'http://login.yourbank.com.verify-password.tk',
    ],
    'label': [0, 0, 0, 0, 0, 1, 1, 1, 1, 1]
}

df = pd.DataFrame(data)

# Feature extractor
def extract_features(url):
    return {
        'length': len(url),
        'num_dots': url.count('.'),
        'has_ip': url.startswith('http://') and url[7].isdigit(),
        'has_at': '@' in url,
        'has_suspicious_word': any(w in url.lower() for w in ['login', 'secure', 'update', 'verify'])
    }

def analyze_url(url):
    try:
        # Ensure URL has scheme
        url = ensure_url_scheme(url)
        
        features = pd.DataFrame([extract_features(url)])
        model = GaussianNB()
        model.fit(pd.DataFrame([extract_features(u) for u in data['url']]), data['label'])
        
        prediction = model.predict(features)[0]
        probability = model.predict_proba(features)[0][prediction]
        
        result = {
            "target": url,
            "is_malicious": bool(prediction),
            "confidence": float(probability),
            "features": extract_features(url)
        }
        
        if result["is_malicious"]:
            result["message"] = "Detected as MALICIOUS"
        else:
            result["message"] = "Detected as SAFE"
            
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
    analyze_url(url)
