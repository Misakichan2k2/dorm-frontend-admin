export default [
  {
    path: "/student-room-list",
    name: "StudentRoomList",
    component: () => import("../StudentRoomList.vue"),
  },
  {
    path: "/student-room-list/room-transfer/:id",
    name: "RoomTransfer",
    component: () => import("../components/RoomTransfer.vue"),
  },
];
