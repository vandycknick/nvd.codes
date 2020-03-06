require("ts-node").register({ files: true })

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require(`path`)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/BlogPost.tsx`)
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
        previous,
        next,
      },
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode, trailingSlash: false })
    const parentNode = getNode(node.parent)

    const parsed = path.parse(value);
    const splitted = parsed.name.split('-')
    const part = splitted.slice(0, 3);
    const name = splitted.slice(3)

    createNodeField({
      name: `slug`,
      node,
      value: `/post/${name.join('-')}`,
    })

    createNodeField({
      name: `editUrl`,
      node,
      value: `https://github.com/nickvdyck/nvd.codes/edit/master/content/posts/${parentNode.relativePath}`,
    })
  }
}
