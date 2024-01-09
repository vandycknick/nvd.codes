---
title: Using TypeScript to modify requests at the edge with Cloudflare Workers
description: .
date: 2021-02-05T20:00:00+01:00
categories: [docker, linux, capabilities, containers]
draft: true
cover: ../../../assets/2022-07-15-wheres-dig/cover.jpg
---

## Introduction

Being able to run code at the edge is a very powerful thing

For the longest time running code at the edge to manipulate a request and inject HTTP headers, inspect payloads, inject scripts, ... hasn't been an easy task todo.

The only cloud provider of the big three that can run code at the edge is AWS with edge lambdas. And as usual, AWS is once again a couple of steps ahead of the competition because neither Google Cloud nor Azure has a similar offering in their services catalogue.

The only cloud provider I know that can run code at the edge is AWS with edge lambdas. As usual, AWS is always a couple of steps ahead of the competition, nor Google Cloud or Azure have anything similar in their services catalogue. Azure CDN's allow you to manipulate headers via a simple rule engine, but you quickly run into issues when creating long headers, yes I'm looking at you CSP (Content-Security-Policy). Don't want to sound too negative about this, because it's actually really useful when developing a static website and you quickly want to append some headers without adding more architectural complexity to your app and is something I actually miss in AWS. I'm not super familiar with Google Cloud but they something similar as azure where you can inject headers via a rules based system in load balancers or CDN's.

but comes nowhere near the expressiveness and power you can do with code.

## Creating the project

## Modify headers on the fly

## Deploying the worker

## Summary

References:

- https://github.com/cloudflare/worker-typescript-template
