import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "Swagger-Petstore-OpenAPI-3-0/swagger-petstore-openapi-3-0",
    },
    {
      type: "category",
      label: "pet",
      link: {
        type: "doc",
        id: "Swagger-Petstore-OpenAPI-3-0/pet",
      },
      items: [
        {
          type: "doc",
          id: "Swagger-Petstore-OpenAPI-3-0/update-pet",
          label: "Update an existing pet",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "Swagger-Petstore-OpenAPI-3-0/add-pet",
          label: "Add a new pet to the store",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "Swagger-Petstore-OpenAPI-3-0/find-pets-by-status",
          label: "Finds Pets by status",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "Swagger-Petstore-OpenAPI-3-0/find-pets-by-tags",
          label: "Finds Pets by tags",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "Swagger-Petstore-OpenAPI-3-0/get-pet-by-id",
          label: "Find pet by ID",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "Swagger-Petstore-OpenAPI-3-0/update-pet-with-form",
          label: "Updates a pet in the store with form data",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "Swagger-Petstore-OpenAPI-3-0/delete-pet",
          label: "Deletes a pet",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "Swagger-Petstore-OpenAPI-3-0/upload-file",
          label: "uploads an image",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "store",
      link: {
        type: "doc",
        id: "Swagger-Petstore-OpenAPI-3-0/store",
      },
      items: [
        {
          type: "doc",
          id: "Swagger-Petstore-OpenAPI-3-0/get-inventory",
          label: "Returns pet inventories by status",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "Swagger-Petstore-OpenAPI-3-0/place-order",
          label: "Place an order for a pet",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "Swagger-Petstore-OpenAPI-3-0/get-order-by-id",
          label: "Find purchase order by ID",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "Swagger-Petstore-OpenAPI-3-0/delete-order",
          label: "Delete purchase order by ID",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "user",
      link: {
        type: "doc",
        id: "Swagger-Petstore-OpenAPI-3-0/user",
      },
      items: [
        {
          type: "doc",
          id: "Swagger-Petstore-OpenAPI-3-0/create-user",
          label: "Create user",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "Swagger-Petstore-OpenAPI-3-0/create-users-with-list-input",
          label: "Creates list of users with given input array",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "Swagger-Petstore-OpenAPI-3-0/login-user",
          label: "Logs user into the system",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "Swagger-Petstore-OpenAPI-3-0/logout-user",
          label: "Logs out current logged in user session",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "Swagger-Petstore-OpenAPI-3-0/get-user-by-name",
          label: "Get user by user name",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "Swagger-Petstore-OpenAPI-3-0/update-user",
          label: "Update user",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "Swagger-Petstore-OpenAPI-3-0/delete-user",
          label: "Delete user",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Schemas",
      items: [
        {
          type: "doc",
          id: "Swagger-Petstore-OpenAPI-3-0/schemas/order",
          label: "Order",
          className: "schema",
        },
        {
          type: "doc",
          id: "Swagger-Petstore-OpenAPI-3-0/schemas/customer",
          label: "Customer",
          className: "schema",
        },
        {
          type: "doc",
          id: "Swagger-Petstore-OpenAPI-3-0/schemas/address",
          label: "Address",
          className: "schema",
        },
        {
          type: "doc",
          id: "Swagger-Petstore-OpenAPI-3-0/schemas/category",
          label: "Category",
          className: "schema",
        },
        {
          type: "doc",
          id: "Swagger-Petstore-OpenAPI-3-0/schemas/user",
          label: "User",
          className: "schema",
        },
        {
          type: "doc",
          id: "Swagger-Petstore-OpenAPI-3-0/schemas/tag",
          label: "Tag",
          className: "schema",
        },
        {
          type: "doc",
          id: "Swagger-Petstore-OpenAPI-3-0/schemas/pet",
          label: "Pet",
          className: "schema",
        },
        {
          type: "doc",
          id: "Swagger-Petstore-OpenAPI-3-0/schemas/apiresponse",
          label: "ApiResponse",
          className: "schema",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
