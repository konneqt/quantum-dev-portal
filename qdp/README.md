# QAP Developer Portal

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.
This guide provides detailed instructions for installing and configuring the project, allowing you to use it effectively.

## Installation

### Requirements

Before you start, make sure you have the following requirements installed:

- Node.js (version 18 or higher)

- Yarn(version 1.22.22) or npm(version 10 or higher)

- Git(version 2.34.1)

### Clone the Repository

Clone this repository using HTTPS:

```
 git clone https://github.com/konneqt/quantum-dev-portal.git
```

Then access the project folder and go to the `qdp` folder

```
 cd quantum-dev-portal/qdp
```

### Install dependencies

Use Yarn or npm to install the project's dependencies:

With Yarn:

```
 yarn
```

With npm:

```
npm install
```

## Run CLI

To run the project's CLI, use the following command:


```
 npm run qdp-init
```

This command initializes the project's command line interface, allowing you to generate your documentation dynamically. The main features include:
1.  Generate documentation from OpenAPI files available within the `apis` folder.
2. Generate documentation from a URI entered by the user.
3. Generate documentation from the OpenAPI files available in `Quantum Api Platform - QAP`, where you must first configure your access to the system.
    - **Access configuration:**
    To access the system, enter the following data: `Client ID` and `Client Secret`, 
    `Username` and `Password`,
    `Company Name`,
    ` URI of the QAP APIs`,
    `OAuth URL` (to generate the access token)
4. Choose one of the available templates to use in the Quantum API Dev Portal: `Dyte`, `Chaos Mesh` or `Homarr`. All have been customised from pre-existing templates, bringing more modern and intuitive layouts to offer an improved experience when using our Dev Portal.
Below are some images of what our templates look like:

- `Chaos Mesh - dark mode`:

  ![chaos - dark](https://github.com/user-attachments/assets/9681222f-b84e-468b-9d5a-c003baf7a87b)


  - `Chaos Mesh - light mode`:

  ![chaos - light](https://github.com/user-attachments/assets/02afb5da-dab1-4ec3-8732-bde8b707e179)


 - `Dyte - dark mode`:
   
![Dyte-Dark mode](https://github.com/user-attachments/assets/e10532b5-cebb-4130-8ccf-fcddf2ccea29)

- `Dyte - light mode`:

  ![dyte - light mode](https://github.com/user-attachments/assets/df6b0df1-ce9d-4f4a-8ad8-2fc6a17c1d59)

- `Homarr - dark mode`:
   
![homarr -dark](https://github.com/user-attachments/assets/cf707357-3989-4098-998f-9247a74b4ea3)


- `Homarr - light mode`:

 ![homar - light](https://github.com/user-attachments/assets/f3c5632d-e4f3-4d2c-930b-a76ee5bdb254)



## Running the Development Server

To start the local server and view the documentation, run:

With Yarn:

```
yarn start
```

With npm:

```
 npm start
```

This will open the documentation at http://localhost:3000/.

## Creating a New Page

- To add a new page to the documentation, follow the steps below:

1. Navigate to the docs/ folder within your project.

2. Create a new Markdown or MDX file (.md or .mdx) with the desired name, e.g. nova-pagina.mdx.

3. Add the following content to the file:


- **Create your first Markdown Page**

```
---
title: My New Page
slug: /my-new-page
---

import React from 'react';

# My New Page

This is the content of the new page.

<Alert title=“Tip”>You can add React components inside .mdx files!</Alert>
```

- **Create your first React Page**

    Create a file at src/pages/my-react-page.js:

```
      import React from "react";
      import Layout from "@theme/Layout";

      export default function MyReactPage() {
        return (
        <Layout>
        <h1>My React page</h1>
        <p>This is a React page</p>
        </Layout>
      );}
```

4. Add the new page to the navigation menu in `sidebars.ts`, including it in the desired structure.

5. Restart the development server with `yarn start` or `npm start` and access the new page in the browser.

## Next steps

### Configuring the Theme and Layout

1. To customize the Docusaurus theme, layout and plugins, follow these steps:

- Edit the docusaurus.config.js file to change settings such as theme, logo and colors. To understand the file better, go to: [Docusaurus Config](https://docusaurus.io/docs/api/docusaurus-config)

- You can create a new custom theme or extend the existing one by following the official documentation: [Docusaurus Themes](https://docusaurus.io/docs/api/themes).

- You can also set up plugins, using not only the one in the project, but any others you need. Here are some examples of plugins that might interest you: [Docusaurus Plugins](https://docusaurus.community/plugindirectory/)

### Creating and Editing Documentation Pages

In addition to the standard pages, you can organize the documentation in a structured way:

- Create new files within docs/ with .md or .mdx.

- Use the YAML frontmatter to define metadata such as title and slug.

- Update sidebars.ts to include the new page in the sidebar.

- Use MDX components to enrich the documentation with interactivity.

### Publish the documentation online

To host the generated documentation, follow these steps:

- Generate the documentation build with `yarn build` or `npm run build.`

- Use the yarn deploy command to publish via GitHub Pages (if configured).

- If you use another platform, send the contents of the build/ folder to a server or static hosting provider.

- For more details, see the official documentation: [Docusaurus Deployment](https://docusaurus.io/docs/deployment).
