import socket
import sys
import json
from urllib.parse import urlparse
import ipaddress
import errno
import subprocess

services = {
    20: "FTP Data",
    21: "FTP Control",
    22: "SSH",
    23: "Telnet",
    25: "SMTP",
    53: "DNS",
    80: "HTTP",
    110: "POP3",
    143: "IMAP",
    443: "HTTPS",
    3306: "MySQL",
    3389: "RDP"
}

def is_valid_ip(ip):
    try:
        ipaddress.ip_address(ip)
        return True
    except ValueError:
        return False

def extract_hostname(url):
    # Remove scheme if present
    if url.startswith(('http://', 'https://')):
        parsed = urlparse(url)
        return parsed.netloc
    return url

def grab_banner(ip, port):
    try:
        sock = socket.socket()
        sock.settimeout(2)
        sock.connect((ip, port))
        banner = sock.recv(1024).decode(errors='ignore').strip()
        sock.close()
        return banner
    except Exception:
        return ""

def scan_ports(target, start_port=20, end_port=1024):
    try:
        # Extract hostname from URL if present
        hostname = extract_hostname(target)
        
        # Try to resolve hostname to IP
        try:
            ip = socket.gethostbyname(hostname)
        except socket.gaierror:
            # If hostname resolution fails, check if it's a valid IP
            if is_valid_ip(hostname):
                ip = hostname
            else:
                return {
                    "error": f"Could not resolve hostname: {hostname}",
                    "target": target
                }

        open_ports = []
        for port in range(start_port, end_port + 1):
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(1)  # 1 second timeout
                result = sock.connect_ex((ip, port))
                if result == 0:
                    try:
                        service = socket.getservbyport(port)
                    except:
                        service = "unknown"
                    banner = grab_banner(ip, port)
                    open_ports.append({
                        "port": port,
                        "service": service,
                        "banner": banner
                    })
                sock.close()
            except:
                continue

        return {
            "target": target,
            "ip": ip,
            "open_ports": open_ports,
            "total_ports_scanned": end_port - start_port + 1,
            "total_open_ports": len(open_ports)
        }

    except Exception as e:
        return {
            "error": f"Scan failed: {str(e)}",
            "target": target
        }

def detect_os(ip):
    try:
        output = subprocess.check_output(["nmap", "-O", ip]).decode() #will get the os
        return f"OS: {output}"
    except Exception as e:
        return f"OS detection failed: {e}"

def main():
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Please provide a target hostname or IP"}))
        sys.exit(1)
    
    target = sys.argv[1]
    result = scan_ports(target)
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
