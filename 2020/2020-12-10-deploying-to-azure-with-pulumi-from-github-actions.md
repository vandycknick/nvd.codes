---
id: 80f51e10-f79e-4718-8724-c80b53d94a9d
title: Deploying to Azure with Pulumi from Github Actions
description: Let's say we're building a new service and are tasked with spinning up the infrastructure required for it to run. It's already defined in code but how do I automate the deployment?
date: 2020-12-10T22:30:00+02:00
categories: [azure, github, github-actions, pulumi]
cover: ./assets/2020-12-10-deploying-to-azure-with-pulumi-from-github-actions/cover.jpg
draft: true
---

Let's say we're building a new service and are tasked with spinning up the infrastructure required to run our application. We defined this infrastructure as code in our favourite programming language with Pulumi. The only thing left to do is setting up a gitops flow to automate the deployment of this infrastructure. In this post, I'll walk you through the steps of setting up a gitops flow with github actions and automatically deploy any changes to Azure on each commit.

## Creating a workflow

Let's get started by creating a set of workflows that run each time code gets pushed to your repository. For the first one, from the root of your repository create a file `.github/workflows/pull_request.yaml`. This workflow will run `pulumi preview` for each PR that get's created and give an overview of the proposed changes. Pulumi has a [github action](https://github.com/pulumi/actions) that makes it really easy to integrate it into your workflow with a simple `uses` statement. They extensivly walk you through getting this setup in their docs , but sometimes it doesn't give you the flexibility you need and thus for this workflow we'll install Pulumi from scratch:

```yaml
name: PR
on:
  - pull_request
jobs:
  preview:
    name: Preview
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2
        with:
          fetch-depth: 1
      - name: Install Infra
        run: |
          curl -fsSL https://get.pulumi.com | sh
          echo "/home/runner/.pulumi/bin" >> $GITHUB_PATH
      - name: Preview Pulumi
        run: |
          pipenv sync
          pipenv run pulumi preview --stack stack-name
        env:
          ARM_CLIENT_ID: ${{ secrets.ARM_CLIENT_ID }}
          ARM_CLIENT_SECRET: ${{ secrets.ARM_CLIENT_SECRET }}
          ARM_TENANT_ID: ${{ secrets.ARM_TENANT_ID }}
          ARM_SUBSCRIPTION_ID: ${{ secrets.ARM_SUBSCRIPTION_ID }}
          PULUMI_ACCESS_TOKEN: ${{ secrets.PULUMI_ACCESS_TOKEN }}
          PULUMI_CI: pr
```

Next, add a second workflow file `.github/workflows/main.yaml` that runs on each commit to your main branch. It will run `pulumi up` and be responsible in making sure that each change will be deployed to Azure.

```yaml
name: Main
on:
  - pull_request
jobs:
  preview:
    name: Preview
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2
        with:
          fetch-depth: 1
      - name: Install Pulumi
        run: |
          curl -fsSL https://get.pulumi.com | sh
          echo "/home/runner/.pulumi/bin" >> $GITHUB_PATH
      - name: Deploy Infra
        run: |
          pipenv sync
          pipenv run pulumi preview --yes --stack stack-name --suppress-outputs
        env:
          ARM_CLIENT_ID: ${{ secrets.ARM_CLIENT_ID }}
          ARM_CLIENT_SECRET: ${{ secrets.ARM_CLIENT_SECRET }}
          ARM_TENANT_ID: ${{ secrets.ARM_TENANT_ID }}
          ARM_SUBSCRIPTION_ID: ${{ secrets.ARM_SUBSCRIPTION_ID }}
          PULUMI_ACCESS_TOKEN: ${{ secrets.PULUMI_ACCESS_TOKEN }}
          PULUMI_CI: up
```

## A service principal to autenticate

Now that you’ve got these two common workflows defined, you’ll need to configure your secrets. Secrets are exposed as environment variables to the GitHub Actions runtime environment. Minimally, you’ll need to supply a Pulumi access token to allow the Pulumi CLI to communicate with the Pulumi Service on your behalf, and you’ll probably want to provide credentials for communicating with your cloud provider as well. In order to authenticate with Azure to deploy our changeset you'll need to create a service principal inside your Azure Active Directory. To do this we will need to drop down to our Azure CLI (it's also possible to create a service principal via the azure portal though). Running `az ad sp list` will list all service principals configured in your Azure tenant. This could be quite a list, so it might help to run `az ad sp --show-mine` to just scope it to your own service principals. If this is the first principal you create this list will be empty. You can combine it with `jq` to get a more digestible list:

```sh
az ad sp list --show-mine | jq '.[].displayName'
```

There are two types of authentication available for service principals: password-based authentication, and certificate-based authentication. To create a new service principal with password-based authentication run the following command: 

```sh
az ad sp create-for-rbac --name <my-service-principal>
```

Replace `<my-service-principal>` with something to easily help identify what this service principal is used for. As you can see password-based authentication is assumed by default and a random password is generated for you. To create a service principal with certificate-based authentication have a look at the Azure docs [here](https://docs.microsoft.com/en-us/cli/azure/create-an-azure-service-principal-azure-cli?view=azure-cli-latest#certificate-based-authentication). By default it will scope this service account to the current subscription, which you can verify with `az account show`.

The command will return a result similar to the following. Make sure to take note of these values because we'll need them later and can't be retrieved again once they have been set.

```json
{
  "appId": "123",
  "displayName": "my-service-principal",
  "name": "http://my-service-principal",
  "password": "456",
  "tenant": "tenant-id"
}
```

> If do you ever lose access to these credentials, executing `az ad sp credential reset --name <app_id>` allows you to reset them.

We just need to grab one more thing and then we can start mapping some of these values to the right environment variables.

```sh
az account list | jq '.[] | select(.name == "<subscription-name>") | .id'
```

This will return the id of the subscription where you want to deploy your resources. Now that we have everything ready we can match everything up to environment variables as follows:
- `ARM_CLIENT_ID` → appId returned when creating the service principal
- `ARM_CLIENT_SECRET` → password returned when creating the service principal
- `ARM_TENTANT_ID` → tenant returned when creating the service principal
- `ARM_SUBSCRIPTION_ID` → subscription id obtained via `az account list`

With your workflow configured and our secrets readily available, head over to your repo's `Settings` tab, in there you will find the `Secrets` area:

![Github secrets config](./assets/2020-12-10-deploying-to-azure-with-pulumi-from-github-actions/github-secrets.png)

Via this page, it should be possible to create a secret for `ARM_CLIENT_ID`, `ARM_CLIENT_SECRET`, `ARM_TENANT_ID` and `ARM_SUBSCRIPTION_ID` with the correct values like we mapped out above.

## Try it out



## Summary


