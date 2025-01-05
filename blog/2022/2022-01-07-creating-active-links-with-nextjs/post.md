---
title: "Add styling to an active link in Next.js"
description: In this post I show how you can use router api to detect active link in Next.js
slug: add-styling-to-an-active-link-in-nextjs
date: 2022-01-08T20:00:00+01:00
categories: [nextjs, react, javascript]
cover: ./images/cover.jpg
---

## Setting the scene

When working on the header of a web application, it's often a must to indicate which link is the current URL. Usually, this is done by giving this particular link some different styling to make it stand out from the rest. Most web frameworks often have this type of functionality readily available in the form of a flag giving the ability to toggle between different classes or CSS styles on a particular link. But sadly, we don't live in an ideal world, and in Next.js the default link component in `next/link` does not offer any such capabilities.

## Using the router to detect the current URL

Luckily this is pretty straightforward and the `useRouter` hook in `next/router` provides everything we need. For example, imagine a Navbar component for which a potential implementation could look something like this:

```jsx
import React from "react"
import Link from "next/link"
import { useRouter } from "next/router"

const pages = [
  { name: "Home", href: "/" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
]

export const NavBar = () => {
  const router = useRouter()
  return (
    <nav className="flex">
      {pages.map((page) => (
        <Link href={page.href}>
          <a
            className={`font-bold py-8 ${
              router.pathname === page.href
                ? "text-rose-500 hover:text-rose-800"
                : "text-sky-500 hover:text-sky-800"
            }`}
          >
            {page.name}
          </a>
        </Link>
      ))}
    </nav>
  )
}
```

The component consists of 3 hard-coded pages for which it will generate a set of links. When it tries to render out a particular link within the component itself, it checks if a link is equal to the current URL by comparing it to `router.pathname`. The current link will show up in a pink colour, while the others will be blue. The example uses Tailwind classes, but you can easily replace this with your own set of classes or any css in js framework that you prefer. All the magic basically just happens in `router.pathname === page.href`.

## Wrapping this all up in a reusable component

While this gets the job done, it's not all that reusable. What happens if we also want this functionality in our footer for example, we would have to repeat ourselves. That's no fun, so let's take this one step further and move this logic into a reusable component by abstracting out this logic.

```jsx
import React from "react"
import Link from "next/link"
import { useRouter } from "next/router"

export const NavLink = ({ className, href, children, passHref }) => {
  const router = useRouter()
  return (
    <Link href={href} passHref={passHref}>
      <a
        className={`font-bold pr-8 ${
          router.pathname === href
            ? "text-rose-500 hover:text-rose-800"
            : "text-sky-500 hover:text-sky-800"
        }`}
      >
        {children}
      </a>
    </Link>
  )
}
```

This way the NavBar component can be simplified to:

```jsx
import React from "react"
import { NavLink } from "./NavLink"

const pages = [
  { name: "Home", href: "/" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
]

export const NavBar = () => (
  <nav className="flex">
    {pages.map((page) => (
      <NavLink href={page.href}>{page.name}</NavLink>
    ))}
  </nav>
)
```

Everywhere we use the `NavLink` component it will automatically pick up the suitable styles for links. The component can be further generalised by introducing a prop like `activeClassName`, allowing any consumer to apply custom styles, but I'll leave that up to the reader.

## Conclusion

In an ideal world, we would be able to import a `Link` component and have it magically figure out if a link is active or not. Sadly we don't, but luckily Next.js makes it pretty straightforward to implement this capability ourselves. I showed you how to implement active link detection in Next.js by leveraging the router api and potentially wrapping this up into a reusable component.
