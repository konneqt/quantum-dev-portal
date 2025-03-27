---
sidebar_position: 2
title: "Create a Document"
description: "Introduction"
---
# 📌 Create a Document

Docusaurus allows you to structure your documentation using Markdown files, which can be connected through:

- A **sidebar** for navigation
- **Previous/Next navigation** for a guided reading experience
- **Versioning** to maintain documentation for different software releases

This guide will walk you through the steps of creating, organizing, and customizing your documentation in Docusaurus.

# 🚀 Create your first Doc

To create a new document, add a Markdown file inside the docs directory. For example:

```md title="docs/hello.md"
# Hello

This is my **first Docusaurus document**!
```

A new document is now available at [http://localhost:3000/docs/hello](http://localhost:3000/docs/hello).

# 🛠 Configure the Sidebar

Docusaurus automatically **generates a sidebar** from the docs directory. However, you can customize it by adding metadata to your Markdown file.

Example of setting a sidebar label and position:

```md title="docs/hello.md" {1-4}
---
sidebar_label: 'Introduction'
sidebar_position: 1
---

# Getting Started

Welcome to my **first Docusaurus document**!
```

You can also explicitly define the sidebar structure in `sidebars.ts`:

```js title="sidebars.js"
export default {
  tutorialSidebar: [
    'intro',
    // highlight-next-line
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
};
```

# 🛠 Organizing Your Documentation

To maintain a well-structured documentation system, follow these best practices:

* Group related documents inside categories.

* Use meaningful filenames to make it easier to manage content.

* Leverage front matter (--- at the top of Markdown files) to control positioning and labels.

* Enable versioning for managing different software versions.
