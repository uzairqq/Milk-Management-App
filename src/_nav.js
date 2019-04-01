export default {
  items: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: "icon-speedometer",
      badge: {
        variant: "info",
        text: "NEW"
      }
    },
    {
      name: "Customer",
      url: "/base",
      icon: "icon-puzzle",
      children: [
        {
          name: "New Customer",
          url: "/customer",
          icon: "icon-puzzle"
        },
        {
          name: "Customer Rates",
          url: "/customerRates",
          icon: "icon-puzzle"
        },
        {
          name: "Customer Supplied",
          url: "/customerSupplied",
          icon: "icon-puzzle"
        }
      ]
    },
    {
      name: "Supplier",
      url: "/base",
      icon: "icon-puzzle",
      children: [
        {
          name: "New Supplier",
          url: "/supplier",
          icon: "icon-puzzle"
        },
        {
          name: "Supplier Rates",
          url: "/supplierRates",
          icon: "icon-puzzle"
        },
        {
          name: "Supplier Supplied",
          url: "/supplierSupplied",
          icon: "icon-puzzle"
        }
      ]
    },
    {
      name: "Expense",
      url: "/base",
      icon: "icon-puzzle",
      children: [
        {
          name: "New Expense",
          url: "/expense",
          icon: "icon-puzzle"
        },
        {
          name: "Daily Expense",
          url: "/dailyExpense",
          icon: "icon-puzzle"
        }
      ]
    },
    {
      name: "Market",
      url: "/base",
      icon: "icon-puzzle",
      children: [
        {
          name: "Market Supplier",
          url: "/marketSupplier",
          icon: "icon-puzzle"
        },
        {
          name: "Market Sell",
          url: "/marketSell",
          icon: "icon-puzzle"
        },
        {
          name: "Market Purchase",
          url: "/marketPurchase",
          icon: "icon-puzzle"
        }
      ]
    },
    {
      name: "Reports",
      url: "/base",
      icon: "icon-puzzle",
      children: [
        {
          name: "Market Purchase",
          url: "/searchMarketPurchase",
          icon: "icon-puzzle"
        },
        {
          name: "Market Sell",
          url: "/searchMarketSell",
          icon: "icon-puzzle"
        },
        {
          name: "Supplier",
          url: "/searchSupplier",
          icon: "icon-puzzle"
        },
        {
          name: "Customer",
          url: "/searchCustomer",
          icon: "icon-puzzle"
        }
      ]
    }
  ]
};
