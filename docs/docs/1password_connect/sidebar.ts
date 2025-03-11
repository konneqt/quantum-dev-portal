import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "1password_connect/1-password-connect",
    },
    {
      type: "category",
      label: "Items",
      link: {
        type: "doc",
        id: "1password_connect/items",
      },
      items: [
        {
          type: "doc",
          id: "1password_connect/get-vault-items",
          label: "Get all items for inside a Vault",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "1password_connect/create-vault-item",
          label: "Create a new Item",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "1password_connect/delete-vault-item",
          label: "Delete an Item",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "1password_connect/get-vault-item-by-id",
          label: "Get the details of an Item",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "1password_connect/patch-vault-item",
          label: "Update a subset of Item attributes",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "1password_connect/update-vault-item",
          label: "Update an Item",
          className: "api-method put",
        },
      ],
    },
    {
      type: "category",
      label: "Vaults",
      link: {
        type: "doc",
        id: "1password_connect/vaults",
      },
      items: [
        {
          type: "doc",
          id: "1password_connect/get-vaults",
          label: "Get all Vaults",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "1password_connect/get-vault-by-id",
          label: "Get Vault details and metadata",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Activity",
      link: {
        type: "doc",
        id: "1password_connect/activity",
      },
      items: [
        {
          type: "doc",
          id: "1password_connect/get-api-activity",
          label: "Retrieve a list of API Requests that have been made.",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Health",
      items: [
        {
          type: "doc",
          id: "1password_connect/get-server-health",
          label: "Get state of the server and its dependencies.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "1password_connect/get-heartbeat",
          label: "Ping the server for liveness",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Metrics",
      items: [
        {
          type: "doc",
          id: "1password_connect/get-prometheus-metrics",
          label: "Query server for exposed Prometheus metrics",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Files",
      items: [
        {
          type: "doc",
          id: "1password_connect/get-item-files",
          label: "Get all the files inside an Item",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "1password_connect/get-details-of-file-by-id",
          label: "Get the details of a File",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "1password_connect/download-file-by-id",
          label: "Get the content of a File",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Schemas",
      items: [
        {
          type: "doc",
          id: "1password_connect/schemas/apirequest",
          label: "APIRequest",
          className: "schema",
        },
        {
          type: "doc",
          id: "1password_connect/schemas/errorresponse",
          label: "ErrorResponse",
          className: "schema",
        },
        {
          type: "doc",
          id: "1password_connect/schemas/field",
          label: "Field",
          className: "schema",
        },
        {
          type: "doc",
          id: "1password_connect/schemas/file",
          label: "File",
          className: "schema",
        },
        {
          type: "doc",
          id: "1password_connect/schemas/fullitem",
          label: "FullItem",
          className: "schema",
        },
        {
          type: "doc",
          id: "1password_connect/schemas/generatorrecipe",
          label: "GeneratorRecipe",
          className: "schema",
        },
        {
          type: "doc",
          id: "1password_connect/schemas/item",
          label: "Item",
          className: "schema",
        },
        {
          type: "doc",
          id: "1password_connect/schemas/patch",
          label: "Patch",
          className: "schema",
        },
        {
          type: "doc",
          id: "1password_connect/schemas/servicedependency",
          label: "ServiceDependency",
          className: "schema",
        },
        {
          type: "doc",
          id: "1password_connect/schemas/vault",
          label: "Vault",
          className: "schema",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
