---
title: cURL tips and tricks
description: In this post, I want to show you a list of cURL tips and tricks that I have accumulated of the years of using and learning cURL. Platform agnostic, cURL is easily accessible for every developer and well worth grasping its basic usage.
date: 2020-02-28 20:00:00 +01:00
categories: [sysadmin, tools, tips]
---

cURL<cite>[1][1]</cite> (or curl as I will refer to it for the rest of the article) is an incredible tool and a worthy asset in your developer toolkit. Like every great craftsman, you as a developer deserve great tools. Granted curl can be daunting and seemingly tough to learn at first, I promise you its worth your investment. This is a write up of basic to more advanced tips and tricks that I accumulated of the years of reading blog posts, curl man pages, StackOverflow, ...

## The basics 📓
Let's start with some basic commands to get data from the server and also let's figure out how we can send data. Feel free to execute these commands step by step while you go through the article.

First of let's try a simple GET request.
```sh
curl https:/httpbin.org/get
```
If all goes well you should be presented with a response quite similar to this one:

```
{
  "args": {},
  "headers": {
    "Accept": "*/*",
    "Host": "httpbin.org",
    "User-Agent": "curl/7.54.0",
    "X-Amzn-Trace-Id": "Root=1-5e59668c-c7281c104fb3310fc774ed7d"
  },
  "url": "https://httpbin.org/get"
}
```

That was quite easy, wasn't it? Learning curl with httpbin is quite nice because it echoes whatever you send to it right back at you. So now what if we just want to send a `HEAD` request:

```sh
curl -I https://httpbin.org/get
```

Are there any other types of requests we can send?

```sh
curl -d 'firstname=Takeshi&lastname=Kovacs' https://httpbin.org/post
curl -d 'fullname=Takeshi Kovacs' -X PUT https://httpbin.org/put
```

The `-X` parameter allows you to change the method. The following methods are supported:
- GET
- POST
- PATCH
- PUT
- DELETE

Right now what happens if we send a request to a server and get redirected. Before running the next command try requesting `https://httpbin.org/redirect-to?url=https://www.google.com` with the commands you already know.

So how do we follow the redirect with `curl`?
```sh
curl -I -L https://httpbin.org/redirect-to?url=https://www.google.com
```
> As it sounds, such a request follows the Location header to reach the endpoint.

Tip: HTTP response codes
The first digit of an HTTP response defines the error group:
- 1xx: informational
- 2xx: success
- 3xx: redirections
- 4xx: client-side errors
- 5xx: server-side errors

And oh yeah you can also customize the headers you send over via curl::
```sh
curl -H 'X-First-Name: Takeshi' https://httpbin.org/headers

curl -d '{"name": "Takeshi"}' -H 'Content-Type: application/json' http://httpbin.org/post
```

## Cookies 🍪

Nom nom cookies. HTTP Cookies are key/value pairs that a client stores on behalf of the server. They are sent back and forth on every request to allow clients to store state between requests. `curl` has a couple of ways to allow a cookie to be sent to the server. In it's simplest form you can just use `--cookie`:

```sh
curl --cookie "SOME_COOKIE=Yes" https://httpbin.org/cookies

```

Get a cookie from the server and write it to a file.
```sh
curl -c cookie.txt https://httpbin.org/cookies/set/cookiename/cookievalue
```
You can add `-i` to print the headers and do some debugging. With `-L` like you learned earlier you can follow the redirect. This will then print the cookies.
```sh
curl -i -L -c cookie.txt https://httpbin.org/cookies/set/cookiename/cookievalue
```

You can get the current cookies back with `-b`.
```sh
curl -b cookie.txt https://httpbin.org/cookies
```

Tip: Cookie file format?

cURL uses a cookie format called Netscape, which each line is a single piece of information represented by following fields (read from left-to-right):

```
# Netscape HTTP Cookie File
.netscape.com   TRUE    /   FALSE   946684799   NETSCAPE_ID 100103
```

## JSON Combo {}
Most of the time I use curl to request resources that return a JSON response. These can become long and as just plaintext hard to reason with, parse or filter. For that, we will need to create a combo with an amazing tool called `jq`. It's free to install on most operating systems:

Let's start with piping a JSON response from curl directly into `jq`.
```sh
curl https://httpbin.org/stream/2 | jq
```

Now that's pretty neat, we get our JSON response back and thanks to some colouring form `jq` we can more easily digest the response. We could also try and filter the response and just select the id.

```sh
curl https://httpbin.org/stream/2 | jq '.id'
```

There is much more you can accomplish by combining `curl` and `jq`. `jq` has amazing documentation https://stedolan.github.io/jq/manual that can help you learn more about how to use it.

## Uploading ⬆️
Ok, let's look at some more advanced commands we can construct and figure out if we can upload or download a file.

- `-T` Uploads the given file
- `--date @filename` yes you can use the the `--data` or `-d` parameter with an `@` to simply upload a file

```sh
curl -T uploadme https:/httpbin.org/post
curl --data '@uploadme' https:/httpbin.org/post
```

Sometimes you might get some data via a pipe, even in this case curl got your back:
```sh
cat uploadme | curl --data '@-' https:/httpbin.org/post
```

To download a file from a server you use `-o`, the next argument will be the name of the file after it is downloaded.
```sh
curl -o file https:/httpbin.org/anything/hello-world
```
You can also use capital o `-O` this will create a file named exactly like it was on the server.

But wait I got a form that gets posted and I need to fill in some data. No worries curl still got you covered.
```sh
 curl -F 'firstname=Takeshi' -F 'lastname=Kovacs' https:/httpbin.org/post
```
> This is an example of a multipart form post.

## Authentication

Basic authentication

```sh
curl -u admin:secret https://httpbin.org/basic-auth/admin/secret
```
> Capital -U is used for proxy authentication

## Little gems 💎

Do you support HTTP/2 or HTTP/3?
```sh
curl --http2 http://example.com
curl --http3 https://example.com
```

HTTP/3 needs to be explicitly enabled during the build process. Please refer to this upgrade guide if you want to play with it: https://github.com/curl/curl/blob/master/docs/HTTP3.md

Another interesting gem:
```sh
curl --path-as-is https://example/hello/../world/
```
> Don’t squash sequences of /../ or /./ in the given URL path.

```sh
curl -w 'Type:%{content_type}\nCode:%{response_code}\n' -I -L https://google.com
```
> Writes out information after transfer has completed by using a special %{variable}.
> <cite>[2][2]</cite>

[1]: https://ec.haxx.se
[2]: https://ec.haxx.se/usingcurl-writeout.html
