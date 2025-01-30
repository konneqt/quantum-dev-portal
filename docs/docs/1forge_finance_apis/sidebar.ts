import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "1forge_finance_apis/1-forge-finance-apis",
    },
    {
      type: "category",
      label: "forex",
      items: [
        {
          type: "doc",
          id: "1forge_finance_apis/get-quotes-for-all-symbols",
          label: "Get quotes for all symbols",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "1forge_finance_apis/get-a-list-of-symbols-for-which-we-provide-real-time-quotes",
          label: "Get a list of symbols for which we provide real-time quotes",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "finance",
      items: [
        {
          type: "doc",
          id: "1forge_finance_apis/get-quotes-for-all-symbols",
          label: "Get quotes for all symbols",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "1forge_finance_apis/get-a-list-of-symbols-for-which-we-provide-real-time-quotes",
          label: "Get a list of symbols for which we provide real-time quotes",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "quotes",
      items: [
        {
          type: "doc",
          id: "1forge_finance_apis/get-quotes-for-all-symbols",
          label: "Get quotes for all symbols",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "1forge_finance_apis/get-a-list-of-symbols-for-which-we-provide-real-time-quotes",
          label: "Get a list of symbols for which we provide real-time quotes",
          className: "api-method get",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
