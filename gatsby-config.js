/* eslint-disable @typescript-eslint/camelcase */
require("ts-node").register({ files: true })

const CONTENT_FOLDER = process.env.CONTENT_FOLDER || "content"

module.exports = {
  siteMetadata: {
    title: `Nick's Blog`,
    author: {
      name: `Nick Van Dyck`,
      summary: `Coder, hacker.`,
    },
    description: `My personal website and blog.`,
    siteUrl: `https://nvd.codes`,
    profiles: {
      site: {
        url: `https://nvd.codes`,
      },
      twitter: {
        handle: `vandycknick`,
        url: `https://twitter.com/vandycknick`,
      },
      github: {
        handle: `nickvdyck`,
        url: `https://github.com/nickvdyck`,
      },
      linkedin: {
        handle: `Nick Van Dyck`,
        url: `https://www.linkedin.com/in/nickvandyck`,
      },
    },
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${CONTENT_FOLDER}/posts`,
        name: `posts`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${CONTENT_FOLDER}/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              aliases: {
                sh: "bash",
              },
            },
          },
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
          `gatsby-remark-reading-time`,
        ],
      },
    },
    `gatsby-plugin-sass`,
    `gatsby-plugin-typescript`,
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-159901656-1`,
      },
    },
    `gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `nvd.codes`,
        short_name: `Nick Van Dyck's personal website and blog`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/icon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
