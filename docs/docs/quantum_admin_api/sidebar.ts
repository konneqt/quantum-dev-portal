import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "quantum_admin_api/quantum-admin-api",
    },
    {
      type: "category",
      label: "api",
      items: [
        {
          type: "doc",
          id: "quantum_admin_api/api-controller-preview",
          label: "No summary",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "quantum_admin_api/api-controller-detail",
          label: "No summary",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "quantum_admin_api/api-controller-all-ap-is",
          label: "No summary",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "quantum_admin_api/api-controller-save",
          label: "No summary",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "quantum_admin_api/api-controller-page-list-apis",
          label: "No summary",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "quantum_admin_api/api-controller-delete-api",
          label: "No summary",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "quantum_admin_api/api-controller-update-api",
          label: "No summary",
          className: "api-method put",
        },
      ],
    },
    {
      type: "category",
      label: "api-product",
      items: [
        {
          type: "doc",
          id: "quantum_admin_api/api-product-controller-preview",
          label: "No summary",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "quantum_admin_api/api-product-controller-detail-api-product",
          label: "No summary",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "quantum_admin_api/api-product-controller-page-list-api-products",
          label: "No summary",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "quantum_admin_api/api-product-controller-delete-api-product",
          label: "No summary",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "quantum_admin_api/api-product-controller-update-api-product",
          label: "No summary",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "quantum_admin_api/api-product-controller-save",
          label: "No summary",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "quantum_admin_api/api-product-controller-attached-methods",
          label: "No summary",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "quantum_admin_api/api-product-controller-list-methods-of-api-keys",
          label: "No summary",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "api-gateway",
      items: [
        {
          type: "doc",
          id: "quantum_admin_api/api-gateway-controller-update-status",
          label: "No summary",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "quantum_admin_api/api-gateway-controller-find-all",
          label: "No summary",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "quantum_admin_api/api-gateway-controller-save",
          label: "No summary",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "api-method",
      items: [
        {
          type: "doc",
          id: "quantum_admin_api/api-method-controller-page-list-api-methods",
          label: "No summary",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "quantum_admin_api/api-method-controller-save-many",
          label: "No summary",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "quantum_admin_api/api-method-controller-update-many",
          label: "No summary",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "quantum_admin_api/api-method-controller-delete-many",
          label: "No summary",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "user",
      items: [
        {
          type: "doc",
          id: "quantum_admin_api/user-controller-create-customer",
          label: "No summary",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "quantum_admin_api/user-controller-login",
          label: "No summary",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "quantum_admin_api/user-controller-get-user-id-by-qiam-id",
          label: "No summary",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "quantum_admin_api/user-controller-page-list-apis",
          label: "No summary",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "quantum_admin_api/user-controller-find-user-by-id",
          label: "No summary",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "quantum_admin_api/user-controller-active-user",
          label: "No summary",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "company",
      items: [
        {
          type: "doc",
          id: "quantum_admin_api/company-controller-find-company-with-settings",
          label: "No summary",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "quantum_admin_api/company-controller-find-ui-settings-by-company-name",
          label: "No summary",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "quantum_admin_api/company-controller-find-variable-settings-by-company-name",
          label: "No summary",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "invoices",
      items: [
        {
          type: "doc",
          id: "quantum_admin_api/invoice-controller-get-invoices-by-user-email",
          label: "No summary",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "quantum_admin_api/invoice-controller-get-invoice-request-apis-by-invoice-id",
          label: "No summary",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "quantum_admin_api/invoice-controller-get-all-invoices",
          label: "No summary",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "person",
      items: [
        {
          type: "doc",
          id: "quantum_admin_api/person-controller-find-all",
          label: "No summary",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "quantum_admin_api/person-controller-find-one",
          label: "No summary",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "plan-contract",
      items: [
        {
          type: "doc",
          id: "quantum_admin_api/plan-contract-controller-create-plan-contract",
          label: "No summary",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "quantum_admin_api/plan-contract-controller-update-plan-contract",
          label: "No summary",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "quantum_admin_api/plan-contract-controller-delete-plan-contract",
          label: "No summary",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "plan",
      items: [
        {
          type: "doc",
          id: "quantum_admin_api/plan-controller-page-list-apis",
          label: "No summary",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "quantum_admin_api/plan-controller-detail",
          label: "No summary",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "quantum_admin_api/plan-controller-apikey",
          label: "No summary",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "quantum_admin_api/plan-controller-create-plan-with-contract",
          label: "No summary",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "quantum_admin_api/plan-controller-delete-plan",
          label: "No summary",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "quantum_admin_api/plan-controller-update-plan",
          label: "No summary",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "quantum_admin_api/plan-controller-create-plan",
          label: "No summary",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "subscription",
      items: [
        {
          type: "doc",
          id: "quantum_admin_api/subscription-controller-create",
          label: "No summary",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "quantum_admin_api/subscription-controller-list-by-emails",
          label: "No summary",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "quantum_admin_api/subscription-controller-list",
          label: "No summary",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "deployment-unit",
      items: [
        {
          type: "doc",
          id: "quantum_admin_api/deployment-unit-controller-save-with-api",
          label: "No summary",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "quantum_admin_api/deployment-unit-controller-page-list-apis",
          label: "No summary",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "quantum_admin_api/deployment-unit-controller-find-by-api-key",
          label: "No summary",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "quantum_admin_api/deployment-unit-controller-edit",
          label: "No summary",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "quantum_admin_api/deployment-unit-controller-edit-gateway",
          label: "No summary",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "quantum_admin_api/deployment-unit-controller-edit-ci",
          label: "No summary",
          className: "api-method put",
        },
      ],
    },
    {
      type: "category",
      label: "dashboard",
      items: [
        {
          type: "doc",
          id: "quantum_admin_api/dashboard-controller-list-dashboard-admin",
          label: "No summary",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "quantum_admin_api/dashboard-controller-list-dashboard-by-user",
          label: "No summary",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "file",
      items: [
        {
          type: "doc",
          id: "quantum_admin_api/file-controller-save",
          label: "No summary",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "gateway",
      items: [
        {
          type: "doc",
          id: "quantum_admin_api/gateway-controller-save-file-by-api-key",
          label: "No summary",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "quantum_admin_api/gateway-controller-find-by-api-key",
          label: "No summary",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "quantum_admin_api/gateway-controller-find-file-detail-by-api-key",
          label: "No summary",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "UNTAGGED",
      items: [
        {
          type: "doc",
          id: "quantum_admin_api/kraken-d-controller-convert-kraken-d-file",
          label: "No summary",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Schemas",
      items: [
        {
          type: "doc",
          id: "quantum_admin_api/schemas/updateapidto",
          label: "UpdateApiDTO",
          className: "schema",
        },
        {
          type: "doc",
          id: "quantum_admin_api/schemas/createapidto",
          label: "CreateApiDTO",
          className: "schema",
        },
        {
          type: "doc",
          id: "quantum_admin_api/schemas/updateapiproductdto",
          label: "UpdateApiProductDTO",
          className: "schema",
        },
        {
          type: "doc",
          id: "quantum_admin_api/schemas/createapiproductdto",
          label: "CreateApiProductDTO",
          className: "schema",
        },
        {
          type: "doc",
          id: "quantum_admin_api/schemas/attachmethoddto",
          label: "AttachMethodDTO",
          className: "schema",
        },
        {
          type: "doc",
          id: "quantum_admin_api/schemas/createapigatewaydto",
          label: "CreateApiGatewayDTO",
          className: "schema",
        },
        {
          type: "doc",
          id: "quantum_admin_api/schemas/manyapimethodsdto",
          label: "ManyApiMethodsDTO",
          className: "schema",
        },
        {
          type: "doc",
          id: "quantum_admin_api/schemas/createuserdto",
          label: "CreateUserDTO",
          className: "schema",
        },
        {
          type: "doc",
          id: "quantum_admin_api/schemas/requestlogindto",
          label: "RequestLoginDTO",
          className: "schema",
        },
        {
          type: "doc",
          id: "quantum_admin_api/schemas/activeuserdto",
          label: "ActiveUserDTO",
          className: "schema",
        },
        {
          type: "doc",
          id: "quantum_admin_api/schemas/createplancontractdto",
          label: "CreatePlanContractDto",
          className: "schema",
        },
        {
          type: "doc",
          id: "quantum_admin_api/schemas/updateplancontractdto",
          label: "UpdatePlanContractDto",
          className: "schema",
        },
        {
          type: "doc",
          id: "quantum_admin_api/schemas/createplandto",
          label: "CreatePlanDTO",
          className: "schema",
        },
        {
          type: "doc",
          id: "quantum_admin_api/schemas/createplanwithcontractdto",
          label: "CreatePlanWithContractDTO",
          className: "schema",
        },
        {
          type: "doc",
          id: "quantum_admin_api/schemas/plandto",
          label: "PlanDTO",
          className: "schema",
        },
        {
          type: "doc",
          id: "quantum_admin_api/schemas/createsubscriptiondto",
          label: "CreateSubscriptionDTO",
          className: "schema",
        },
        {
          type: "doc",
          id: "quantum_admin_api/schemas/createdeploymentunitdto",
          label: "CreateDeploymentUnitDTO",
          className: "schema",
        },
        {
          type: "doc",
          id: "quantum_admin_api/schemas/gatewaydto",
          label: "GatewayDTO",
          className: "schema",
        },
        {
          type: "doc",
          id: "quantum_admin_api/schemas/editdeploymentunitdto",
          label: "EditDeploymentUnitDTO",
          className: "schema",
        },
        {
          type: "doc",
          id: "quantum_admin_api/schemas/editgatewaydeploymentunitdto",
          label: "EditGatewayDeploymentUnitDTO",
          className: "schema",
        },
        {
          type: "doc",
          id: "quantum_admin_api/schemas/editcideploymentunitdto",
          label: "EditCiDeploymentUnitDTO",
          className: "schema",
        },
        {
          type: "doc",
          id: "quantum_admin_api/schemas/gatewayfiledto",
          label: "GatewayFileDTO",
          className: "schema",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
