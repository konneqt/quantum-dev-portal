import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "MongoDB-Example/mongodb-example",
    },
    {
      type: "category",
      label: "users",
      link: {
        type: "doc",
        id: "MongoDB-Example/users",
      },
      items: [
        {
          type: "doc",
          id: "MongoDB-Example/list-users-resources",
          label: "List users resources",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "MongoDB-Example/create-a-new-user",
          label: "Create a new user",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "MongoDB-Example/get-a-user-by-id",
          label: "Get a user by ID",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "MongoDB-Example/update-a-user-by-id",
          label: "Update a user by ID",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "MongoDB-Example/partial-update-of-a-user-by-id",
          label: "Partial Update of a user by ID",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "MongoDB-Example/delete-a-user-by-id",
          label: "Delete a user by ID",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "groups",
      link: {
        type: "doc",
        id: "MongoDB-Example/groups",
      },
      items: [
        {
          type: "doc",
          id: "MongoDB-Example/list-groups-resources",
          label: "List groups resources",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "MongoDB-Example/create-a-new-group",
          label: "Create a new group",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "MongoDB-Example/get-a-group-by-id",
          label: "Get a group by ID",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "MongoDB-Example/update-a-group-by-id",
          label: "Update a group by ID",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "MongoDB-Example/partial-update-of-a-group-by-id",
          label: "Partial Update of a group by ID",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "MongoDB-Example/delete-a-group-by-id",
          label: "Delete a group by ID",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "ping",
      link: {
        type: "doc",
        id: "MongoDB-Example/ping",
      },
      items: [
        {
          type: "doc",
          id: "MongoDB-Example/health-check",
          label: "Health Check",
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
          id: "MongoDB-Example/schemas/meta",
          label: "Meta",
          className: "schema",
        },
        {
          type: "doc",
          id: "MongoDB-Example/schemas/name",
          label: "Name",
          className: "schema",
        },
        {
          type: "doc",
          id: "MongoDB-Example/schemas/user",
          label: "User",
          className: "schema",
        },
        {
          type: "doc",
          id: "MongoDB-Example/schemas/group",
          label: "Group",
          className: "schema",
        },
        {
          type: "doc",
          id: "MongoDB-Example/schemas/users",
          label: "Users",
          className: "schema",
        },
        {
          type: "doc",
          id: "MongoDB-Example/schemas/groups",
          label: "Groups",
          className: "schema",
        },
        {
          type: "doc",
          id: "MongoDB-Example/schemas/member",
          label: "Member",
          className: "schema",
        },
        {
          type: "doc",
          id: "MongoDB-Example/schemas/address",
          label: "Address",
          className: "schema",
        },
        {
          type: "doc",
          id: "MongoDB-Example/schemas/attribute",
          label: "Attribute",
          className: "schema",
        },
        {
          type: "doc",
          id: "MongoDB-Example/schemas/certificate",
          label: "Certificate",
          className: "schema",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
