---
id: e546368c-7b49-4ed5-9b6f-c0c998fe3e27
title: Pulling images from GCR with Kubernetes
description: In this post i go through the process of setting up a private container registry in Kubernetes.
date: 2020-10-19T22:00:00+02:00
categories: [kubernetes, gcp, registry, containers]
cover: ./assets/2020-10-19-gcr-with-kubernetes/cover.jpg
---

I have been using containers for a while now and I love playing around and experimenting with them. For one of my projects, I needed access to a private container registry from a Kubernetes cluster. There are numerous options out there that help you get up and running with a private registry in no time. Briefly, I considered self-hosting a registry on a spare Raspberry PI or a cheap VM, it was a personal project after all so both options were worth considering. But I quickly decided against this and looked at some cloud providers for a hosted solution. In the end, I chose to give Google Container Registry (GCR) a try. Overall I was pretty impressed with the process to get this up and running on GCP. I created a new project via the GCP console, enabled the GCR API's and followed the steps described here to be able to push images to this new registry. All in all, this took me about 10 min to get up and running. Which is pretty impressive if you ask me, but I'm starting to digress. With this brand new registry set up, I immediately got to work. I created an image, pushed it to the registry then created a deployment and boom the following errors started showing up in my container logs:

```bash
container "container-name" in pod "pod-name" is waiting to start: trying and failing to pull image
```

Digging a bit deeper in the pod's event logs, I got a better idea of what was going on:

```bash
Events:                                                                                                                                               
  Type     Reason     Age                   From               Message                                                                                   
  ----     ------     ----                  ----               -------                                                                                   
  Normal   Pulling    11m (x4 over 12m)     kubelet, hostn     Pulling image "eu.gcr.io/gcr-name/imagename"                                              
  Warning  Failed     11m (x4 over 12m)     kubelet, hostn     Failed to pull image "eu.gcr.io/gcr-name/imagename": rpc error: code = Unknown desc =     
failed to resolve image "eu.gcr.io/gcr-name/imagename:latest": no available registry endpoint: unexpected status code                  
https://eu.gcr.io/v2/gcr-name/imagename/manifests/latest: 401 Unauthorized                                                                    
  Warning  Failed     11m (x4 over 12m)     kubelet, hostn     Error: ErrImagePull                                                                       
  Warning  Failed     10m (x7 over 12m)     kubelet, hostn     Error: ImagePullBackOff                                                                   
  Normal   BackOff    2m38s (x42 over 12m)  kubelet, hostn     Back-off pulling image "eu.gcr.io/gcr-name/imagename"
```

> The following `kubectl describe pod pod-name` describes the given pod which also includes a list of recent events.

Going through these, it immediately becomes clear that the cluster does not have the right privileges to be able to pull this image from the registry. The thing is that Kubernetes does not use the docker client to log, which means that none of the default methods described in the [docs](https://cloud.google.com/container-registry/docs/advanced-authentication) will work. But luckily Kubernetes has a different trick up its sleeve and uses a concept called `ImagePullSecrets` to make sure it has the right credentials to authenticate with a private registry. These can be assigned to a single pod or a Kubernetes service account which in turn adds it to any pod created in its namespace.

I'll mainly go through getting this up and running with GCR in this article, but the main principle applies to any private registry or Kubernetes ([minikube](https://minikube.sigs.k8s.io/docs/), [microk8s](https://microk8s.io/), native Kubernetes) environment out there.

# Create a service account on GCP to authenticate with the registry.

First, we will need to dive into some GCP specifics and get a few things in place before we can continue in Kubernetes. I need to create a set of credentials or tokens that need to be added to the cluster for it to be able to authenticate before pulling an image. The best way to get this setup is to create a service account in GCP. A service account is a great fit for this case because it allows scoping the required roles so that the account can only view and download images from the registry. In short user accounts are for real-life humans, while service accounts are for processes or machines to perform unsupervised authentication. Then I can create a set of tokens for the service account, which can be added to the cluster. To create a new service account on GCP, I ran the following command replacing account-name and account-display-name with something meaningful for my context.

```bash
gcloud iam service-accounts create account-name --display-name account-display-name
```

Running `gcloud iam service-accounts list` shows a list of all configured service accounts. If the previous command ran successfully then returned list should contain that new account.

The next thing needed is to add the correct roles to this service account, roles in google cloud are just a grouping of permissions. Setting this up correctly should then allow the service account to read and download images from GCR. Again there are a couple of ways this can be done, one is by giving this account the role `roles/viewer` which allows the service account to read any resources inside this project. But the cluster only needs permissions to read and download images from the registry and thus it might be a good idea to pick a more narrow set of roles and follow the principle of least privilege. The google cloud docs are pretty good and this page: [https://cloud.google.com/container-registry/docs/access-control#permissions_and_roles](https://cloud.google.com/container-registry/docs/access-control#permissions_and_roles) gives a good overview of what permissions are needed to be able to read the registry and download an image. It's also possible to use the glcoud cli like `gcloud iam roles list | grep storage`  to list all available roles and then pipe it to grep to narrow the result. One of the returned roles is  `roles/storage.objectViewer` , which has a more narrow scope and  looks like a great fit:

```bash
gcloud projects add-iam-policy-binding project-id \
	--member='serviceAccount:account-name@project-id.iam.gserviceaccount.com' \
	--role=roles/storage.objectViewer
```

When the command succeeds it should print a success message followed by a list of all the bindings for this project. If you want to check the bindings for the project at a later time you can run the following command, which will print out the same result:

```bash
gcloud projects get-iam-policy project-id
```

After all that work, a secret can finally be created and added to the service account:

```bash
gcloud iam service-accounts keys create ~/key.json \
	--iam-account=account-name@project-id.iam.gserviceaccount.com
```

This command will write the generated secret to the referenced file: `~/keys.json` :

```bash
{
  "type": "service_account",
  "project_id": "project-id",
  "private_key_id": "11c2aa99b5b7a1ef9158bd3889c4466f90e040b1",
  "private_key": "-----BEGIN PRIVATE KEY-----\nKEY\n-----END PRIVATE KEY-----\n",
  "client_email": "account-name@project-id.iam.gserviceaccount.com",
  "client_id": "101956518144856584514",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/account-name%40project-id.iam.gserviceaccount.com"
}
```

## Add the secret to a Kubernetes Service Account

Getting back to Kubernetes, the following steps are similar for any cloud provider that you use. This newly created secret needs to end up in the cluster for it to authenticate with GCR. This can be done by created a new secret via `kubectl`:

```bash
kubectl create secret docker-registry gcr-docker-json-secret \
	--docker-server=eu.gcr.io \
	--docker-username=_json_key \
	--docker-password="$(cat ~/key.json)" \
	--docker-email=vandyck.nick@outlook.com
```

The docker-server value has to exactly match the hostname of the container registry. Outside of the EU, it might be better to use a different URL that gets the image closer to a region where the cluster resides. When ran successfully the `kubectl` command should return the following when the secret is successfully added:

```bash
secret "gcr-docker-json-secret" created
```

When an error message gets returned, it might be that a secret with the given name already exists. It's possible to verify if this secret already exists and delete if necessary:

```bash
kubectl get secret [--namespace namespace-name]
kubectl delete secret gcr-docker-json-secret [--namespace namespace-name]
```

Finally, you have to add the secret to your default service account as `ImagePullSecrets`, so it will actually be used, when Kubernetes spins up a new pod with this service account.

```bash
kubectl patch serviceaccount default -p '{"imagePullSecrets": [{"name": "gcr-docker-json-secret"}]}'
```

You can verify that everything is setup correctly with the following: 

```bash
kubectl get serviceaccount default -o yaml
```

You can change the value of `-o` to change the output format to JSON or YAML.

## Add the secret to a single pod

It's also possible to just add the secret directly to a single pod, instead of every pod in a namespace. There is a lot less involved in this case, all is needed to add an `imagePullSecrets` section to the pods specification as follows:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-name
spec:
  containers:
  - name: container-name
    image: eu.gcr.io/some-project-name:v0.1.0
  imagePullSecrets:
  - name: gcr-docker-json-secret
```
