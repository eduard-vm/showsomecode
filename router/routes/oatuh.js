export default ['Vk', 'Google', 'Facebook']
  .map((sn) => ({
    name: `OAuth${sn}Page`,
    path: `/${sn.toLowerCase()}-callback`,
    component: () => import('../../views/OAtuh.vue'),
  }));
