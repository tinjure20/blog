require("dotenv").config({
  path: `.env`,
})

module.exports = {
  /* Your site config here */
  pathPrefix: "/blog",
  siteMetadata: {
    title: `Creative Tech Blog | Louie Christie`,
    siteUrl: `https://www.louiechristie.com/blog`,
    description: `Creative Tech blog and associated rantings of Louie Christie`,
  },
  plugins: [
    `gatsby-plugin-notifications`,
    `gatsby-plugin-sharp`,
    "gatsby-plugin-theme-ui",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sass",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/assets/images`,
      },
    },
    {
      resolve: `gatsby-source-wordpress-experimental`,
      options: {
        url: `${process.env.GATSBY_WORDPRESS_URL}/graphql`,
        verbose: true,
        schema: {
          queryDepth: 5,
          typePrefix: `Wp`,
          timeout: 30000,
        },
        develop: {
          nodeUpdateInterval: 3000,
          hardCacheMediaFiles: false,
        },
        production: {
          hardCacheMediaFiles: false,
        },
        debug: {
          // these settings are all the defaults,
          // remove them if you'd like
          graphql: {
            showQueryOnError: false,
            showQueryVarsOnError: true,
            copyQueryOnError: true,
            panicOnError: true,
            // a critical error is a WPGraphQL query that returns an error and no response data. Currently WPGQL will error if we try to access private posts so if this is false it returns a lot of irrelevant errors.
            onlyReportCriticalErrors: true,
          },
        },
        // fields can be excluded globally.
        // this example is for wp-graphql-gutenberg.
        // since we can get block data on the `block` field
        // we don't need these fields
        excludeFields: [`blocksJSON`, `saveContent`],
        type: {
          Post: {
            limit:
              process.env.NODE_ENV === `development`
                ? // Lets just pull 50 posts in development to make it easy on ourselves.
                  50
                : // and we don't actually need more than 5000 in production
                  5000,
          },
          // this shows how to exclude entire types from the schema
          // these examples are for wp-graphql-gutenberg
          CoreParagraphBlockAttributes: {
            exclude: true,
          },
          CoreParagraphBlockAttributesV2: {
            exclude: true,
          },
          CorePullquoteBlockAttributes: {
            exclude: true,
          },
        },
      },
    },
    `gatsby-transformer-sharp`,
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /\.inline\.svg$/, // See below to configure properly
        },
      },
    },
    `gatsby-plugin-netlify-cache`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Creative Tech Blog`,
        short_name: `CreativeTechBlog`,
        start_url: `/`,
        background_color: `#0e11b5`,
        theme_color: `#0e11b5`,
        display: `minimal-ui`,
        icon: `src/assets/images/icon.svg`,
      },
    },
    {
      resolve: "gatsby-wordpress-experimental-inline-images",
      options: {
        wordPressUrl: `${process.env.GATSBY_WORDPRESS_URL}`,
        uploadsUrl: `${process.env.GATSBY_WORDPRESS_URL}/wp-content/uploads/`,
        processPostTypes: ["Page", "Post"],
        graphqlTypeName: "WPGraphQL",
        pathPrefix: "/blog",
      },
    },
  ],
}
