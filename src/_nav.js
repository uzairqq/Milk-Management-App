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
        }
      ]
    }
  ]
};
