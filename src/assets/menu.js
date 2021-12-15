export const menuData = [
  {
    id: 1,
    name: "Dashboard",
    icon: "mdi:desktop-mac-dashboard",
    exact: true,
    to: `/`,
  },
  {
    id: 2,
    name: "Ticket Management",
    icon: "carbon:gui-management",
    exact: true,
    // to: `/ticket-admin`,
    subMenus: [
      {
        name: "Action Req Status",
        to: "/ticket-admin/action-request",
        icon: "carbon:license-maintenance-draft",
      },
      {
        name: "Facility & Access Status",
        to: "/ticket-admin/facility-request",
        icon: "vaadin:file-tree-sub",
      },
    ],
  },
  {
    id: 3,
    name: "Master",
    icon: "ant-design:folder-open-filled",
    exact: true,
    // to: `/master`,
    subMenus: [
      {
        name: "Status",
        to: "/master/status",
        icon: "carbon:status-acknowledge",
      },
      { name: "Role", to: "/master/role", icon: "ci:user-check" },
      {
        name: "Departement",
        to: "/master/departement",
        icon: "bx:bx-building-house",
      },
      { name: "Area", to: "/master/area", icon: "fluent:status-16-filled" },
      {
        name: "Category",
        to: "/master/category",
        icon: "dashicons:category",
      },
      {
        name: "Troubleshoot",
        to: "/master/troubleshoot",
        icon: "clarity:error-standard-line",
      },
      {
        name: "User",
        to: "/master/user",
        icon: "ant-design:user-add-outlined",
      },
    ],
  },
];

export const menuDataUser = [
  {
    id: 1,
    name: "Dashboard",
    icon: "mdi:desktop-mac-dashboard",
    exact: true,
    to: `/`,
  },
  {
    id: 2,
    name: "Action Request",
    icon: "carbon:inventory-management",
    exact: true,
    to: `/action-request`,
  },
];

export const menuDataUser2 = [
  {
    id: 1,
    name: "Dashboard Lead",
    icon: "mdi:desktop-mac-dashboard",
    exact: true,
    to: `/`,
  },
  {
    id: 2,
    name: "Action Request",
    icon: "carbon:inventory-management",
    exact: true,
    to: `/action-request`,
  },
  {
    id: 3,
    name: "Ticket Approval",
    icon: "bi:ticket-detailed",
    exact: true,
    subMenus: [
      {
        name: "Action Req Approval",
        to: "/approval/action-request",
        icon: "fluent:ticket-diagonal-16-filled",
      },
      {
        name: "Facility & Access Approval",
        to: "/approval/facility-request",
        icon: "fluent:ticket-diagonal-16-filled",
      },
    ],
  },
];

export const pathEndPoint = [
  {
    url: "http://192.168.101.48",
    port: "5000",
  },
];

export const authEndPoint = [
  {
    url: "http://192.168.101.48",
    port: "1200",
  },
];
