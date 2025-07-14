import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "Cloud-Gym-API/cloudgym-api",
    },
    {
      type: "category",
      label: "Authentication",
      link: {
        type: "doc",
        id: "Cloud-Gym-API/authentication",
      },
      items: [
        {
          type: "doc",
          id: "Cloud-Gym-API/request-new-access-token",
          label: "Request new access token",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Class",
      link: {
        type: "doc",
        id: "Cloud-Gym-API/class",
      },
      items: [
        {
          type: "doc",
          id: "Cloud-Gym-API/aclass-create",
          label: "Add new attendee class",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/aclass-get-by-id",
          label: "Find classes by unit ID",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/aclass-update",
          label: "Update attendee class by ID",
          className: "api-method put",
        },
      ],
    },
    {
      type: "category",
      label: "ClassAttendance",
      link: {
        type: "doc",
        id: "Cloud-Gym-API/class-attendance",
      },
      items: [
        {
          type: "doc",
          id: "Cloud-Gym-API/aclass-create-attendance",
          label: "Add new attendence class",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/aclass-get-attendance-by-member-id",
          label: "Find attendence classes by member ID",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/aclass-get-attendance-all",
          label: "Find attendence class by date",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Contract",
      link: {
        type: "doc",
        id: "Cloud-Gym-API/contract",
      },
      items: [
        {
          type: "doc",
          id: "Cloud-Gym-API/contract-get-by-member-id",
          label: "Find all contracts",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/contract-create",
          label: "Add new contract",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/contract-get-by-id",
          label: "Find contract by ID",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/contract-update",
          label: "Update contract by ID",
          className: "api-method put",
        },
      ],
    },
    {
      type: "category",
      label: "Member",
      link: {
        type: "doc",
        id: "Cloud-Gym-API/member",
      },
      items: [
        {
          type: "doc",
          id: "Cloud-Gym-API/member-get-all",
          label: "Find all members",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/member-create",
          label: "Add new member",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/member-get-by-id",
          label: "Find member by ID",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/member-update",
          label: "Update member by ID",
          className: "api-method put",
        },
      ],
    },
    {
      type: "category",
      label: "Payment",
      link: {
        type: "doc",
        id: "Cloud-Gym-API/payment",
      },
      items: [
        {
          type: "doc",
          id: "Cloud-Gym-API/payment-get-by-contract-id",
          label: "Find all payments",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/payment-create",
          label: "Add new payment",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/payment-get-by-id",
          label: "Find payment by ID",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/payment-update",
          label: "Update payment by ID",
          className: "api-method put",
        },
      ],
    },
    {
      type: "category",
      label: "Plan",
      link: {
        type: "doc",
        id: "Cloud-Gym-API/plan",
      },
      items: [
        {
          type: "doc",
          id: "Cloud-Gym-API/plan-get-all",
          label: "Find all plans",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/plan-create",
          label: "Add new plan",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/plan-get-by-id",
          label: "Find plan by ID",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/plan-update",
          label: "Update plan by ID",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/plan-get-by-unit",
          label: "Find plan by Unit ID",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Product",
      link: {
        type: "doc",
        id: "Cloud-Gym-API/product",
      },
      items: [
        {
          type: "doc",
          id: "Cloud-Gym-API/product-get-all",
          label: "Find all products",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/product-create",
          label: "Add new product",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/product-get-by-id",
          label: "Find product by ID",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/product-update",
          label: "Update product by ID",
          className: "api-method put",
        },
      ],
    },
    {
      type: "category",
      label: "Promotion",
      link: {
        type: "doc",
        id: "Cloud-Gym-API/promotion",
      },
      items: [
        {
          type: "doc",
          id: "Cloud-Gym-API/promotion-get-all",
          label: "Find all promotions",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/promotion-create",
          label: "Add new promotion",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/promotion-get-by-id",
          label: "Find promotion by ID",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/promotion-update",
          label: "Update promotion by ID",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/promotion-get-by-code",
          label: "Find promotion by code",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Prospect",
      link: {
        type: "doc",
        id: "Cloud-Gym-API/prospect",
      },
      items: [
        {
          type: "doc",
          id: "Cloud-Gym-API/prospect-get-all",
          label: "Find all prospects",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/prospect-create",
          label: "Add new prospect",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/prospect-get-by-id",
          label: "Find prospect by ID",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/prospect-update",
          label: "Update prospect by ID",
          className: "api-method put",
        },
      ],
    },
    {
      type: "category",
      label: "Unit",
      link: {
        type: "doc",
        id: "Cloud-Gym-API/unit",
      },
      items: [
        {
          type: "doc",
          id: "Cloud-Gym-API/unit-get-all",
          label: "Find all units",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/unit-create",
          label: "Add new unit",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/unit-get-by-id",
          label: "Find unit by ID",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/unit-update",
          label: "Update unit by ID",
          className: "api-method put",
        },
      ],
    },
    {
      type: "category",
      label: "Schemas",
      items: [
        {
          type: "doc",
          id: "Cloud-Gym-API/schemas/tokenresource",
          label: "TokenResource",
          className: "schema",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/schemas/classresource",
          label: "ClassResource",
          className: "schema",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/schemas/classattendanceresource",
          label: "ClassAttendanceResource",
          className: "schema",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/schemas/contractresource",
          label: "ContractResource",
          className: "schema",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/schemas/memberresource",
          label: "MemberResource",
          className: "schema",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/schemas/paymentresource",
          label: "PaymentResource",
          className: "schema",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/schemas/planresource",
          label: "PlanResource",
          className: "schema",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/schemas/productresource",
          label: "ProductResource",
          className: "schema",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/schemas/promotionresource",
          label: "PromotionResource",
          className: "schema",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/schemas/unitresource",
          label: "UnitResource",
          className: "schema",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/schemas/classsingleresource",
          label: "ClassSingleResource",
          className: "schema",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/schemas/classattendencesingleresource",
          label: "ClassAttendenceSingleResource",
          className: "schema",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/schemas/contractsingleresource",
          label: "ContractSingleResource",
          className: "schema",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/schemas/contractcollectionresource",
          label: "ContractCollectionResource",
          className: "schema",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/schemas/membersingleresource",
          label: "MemberSingleResource",
          className: "schema",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/schemas/membercollectionresource",
          label: "MemberCollectionResource",
          className: "schema",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/schemas/paymentsingleresource",
          label: "PaymentSingleResource",
          className: "schema",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/schemas/paymentcollectionresource",
          label: "PaymentCollectionResource",
          className: "schema",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/schemas/plansingleresource",
          label: "PlanSingleResource",
          className: "schema",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/schemas/plancollectionresource",
          label: "PlanCollectionResource",
          className: "schema",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/schemas/productsingleresource",
          label: "ProductSingleResource",
          className: "schema",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/schemas/productcollectionresource",
          label: "ProductCollectionResource",
          className: "schema",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/schemas/prospectsingleresource",
          label: "ProspectSingleResource",
          className: "schema",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/schemas/prospectcollectionresource",
          label: "ProspectCollectionResource",
          className: "schema",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/schemas/prospectresource",
          label: "ProspectResource",
          className: "schema",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/schemas/promotionsingleresource",
          label: "PromotionSingleResource",
          className: "schema",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/schemas/promotioncollectionresource",
          label: "PromotionCollectionResource",
          className: "schema",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/schemas/unitsingleresource",
          label: "UnitSingleResource",
          className: "schema",
        },
        {
          type: "doc",
          id: "Cloud-Gym-API/schemas/unitcollectionresource",
          label: "UnitCollectionResource",
          className: "schema",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
