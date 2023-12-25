export const navItems = [
  {
    name: "Home",
    path: "/",
    dropdown: false,
  },
  {
    name: "Administration",
    path: "/administration",
    dropdown: true,
    dropdownItems: [
      {
        name: "Department Creation",
        path: "/department",
      },
      {
        name: "Test Creation",
        path: "/tests",
      },
      {
        name: "Profile Creation",
        path: "/profile",
      },
      {
        name: "Package Creation",
        path: "/package",
      },
      {
        name: "Price List Creation",
        path: "/pricelist",
      },
      {
        name: "Ref Lab",
        path: "/reflab",
      },
      {
        name: "Ref Doctor",
        path: "/refdoctor",
      },
      {
        name: "Settings",
        path: "/setting",
      },
    ],
  },
  {
    name: "Patient Management",
    path: "/patient-management",
    dropdown: true,
    dropdownItems: [
      {
        name: "Patient Creation",
        path: "/patient/add",
      },
      {
        name: "Patient Details Edit",
        path: "/patientdetailsedit",
      },
      {
        name: "Patient Status",
        path: "/order/status",
      },
      {
        name: "Cancel Order",
        path: "/cancelorder",
      },
    ],
  },
  {
    name: "Reports",
    path: "/reports",
    dropdown: true,
    dropdownItems: [
      {
        name: "Daily Summary",
        path: "/dailysummary",
      },
      {
        name: "Ref Doctors Summary",
        path: "/refdoctorssummary",
      },
      {
        name: "Ref Customer Summary",
        path: "/ref-customer-summary",
      },
      {
        name: "Credit Report",
        path: "/credit-report",
      },
      {
        name: "Cancelled Test Report",
        path: "/cancelled-test-report",
      },
    ],
  },
  {
    name: "User Management",
    path: "/user-management",
    dropdown: true,
    dropdownItems: [
      {
        name: "Role Creation",
        path: "/roles",
      },
      {
        name: "Assign Privilege",
        path: "/assignprivileges",
      },
      {
        name: "User Creation",
        path: "/users",
      },
      {
        name: "User Configuration",
        path: "/user-configuration",
      },
    ],
  },
  {
    name: "Other",
    path: "/other",
    dropdown: true,
    dropdownItems: [
      {
        name: "WhatsApp Instance Id",
        path: "/whatsapp-instance-id",
      },
      {
        name: "WhatsApp Template",
        path: "/whatsapp-template",
      },
    ],
  },
];
