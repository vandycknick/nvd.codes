require("ts-node").register({ files: true })

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require(`path`)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateWebpackConfig = ({ actions, getConfig }) => {
  const config = getConfig()
  const contextSrc = path.join(config.context, "src")
  actions.setWebpackConfig({
    resolve: {
      alias: { src: contextSrc },
    },
  })
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blogPost.tsx`)
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
                published
              }
              frontmatter {
                title
              }
            }
          }
        }
      }
    `,
  )

  if (result.errors) {
    throw result.errors
  }

  // Create blog posts pages.
  const posts = result.data.allMarkdownRemark.edges

  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node

    createPage({
      path: post.node.fields.slug,
      component: blogPost,
      context: {
        slug: post.node.fields.slug,
        previous: previous && previous.fields.published ? previous : null,
        next: next && next.fields.published ? next : null,
      },
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode, trailingSlash: false })
    const parentNode = getNode(node.parent)

    const parsed = path.parse(value)
    const splitted = parsed.name.split("-")
    const name = splitted.slice(3)

    // Every article is considered published by default
    // unless published is explicitly set to false
    createNodeField({
      name: `published`,
      node,
      value: !(node.frontmatter.published === false),
    })

    createNodeField({
      name: `slug`,
      node,
      value: `/post/${name.join("-")}`,
    })

    createNodeField({
      name: `editUrl`,
      node,
      value: `https://github.com/nickvdyck/nvd.codes/edit/master/content/posts/${parentNode.relativePath}`,
    })
  }
}
