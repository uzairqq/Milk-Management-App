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
        }
      ]
    }
  ]
};
