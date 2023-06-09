const path = require('path')
const { createFilePath } = require(`gatsby-source-filesystem`)




exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  // Ensures we are processing only markdown files
  if (node.internal.type === "MarkdownRemark") {
    // Use `createFilePath` to turn markdown files in our `data/faqs` directory into `/faqs/slug`
    const slug = createFilePath({
      node,
      getNode,
      basePath: "pages",
    })

    // Creates new query'able field with name of 'slug'
    createNodeField({
      node,
      name: "slug",
      value: `/${slug.slice(12)}`,
    })
  }


}


exports.createPages = ({graphql,actions}) => {
  const {createPage } = actions

  return graphql(`
  {
    allMarkdownRemark(sort: {fields: frontmatter___date, order: DESC}) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            tags
            date(locale: "es-ve", formatString: "DD [de] MMMM [de] YYYY")
            description
            title
            imageUrl
           image{
              publicURL
            }
          }
          timeToRead
        }
        next {
          frontmatter {
            title
          }
          fields {
            slug
          }
        }
        previous {
          fields {
            slug
          }
          frontmatter {
            title
            tags
          }
        }
      }
    }
  }
  
  `).then(result => {
    const posts = result.data.allMarkdownRemark.edges

    posts.forEach(({node,next,previous,index}) => {
      createPage({
        path: node.fields.slug,
        component: path.resolve('./src/templates/blog-post.js'),
        context: {
          slug: node.fields.slug,
          previousPost: next,
          nextPost: previous
        },
      })
    })
  })
}



exports.onCreatePage = async({page,actions}) => {
  const {createPage} = actions


  if(page.path.match(/^\/guide/)){
    page.matchPath = "/guide/*"

    createPage(page)
  }
}


