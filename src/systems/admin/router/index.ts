const route = [
  {
    name: 'admin',
    path: 'admin',
    component: () => import('../layout/index.vue'),
    children:[
      {
        name: 'admin菜单一',
        path: "admin-1",
        component: () => import('../views/hello/index.vue'),
        meta:{
          title: "admin菜单一"
        }
      },
      {
        name: 'admin菜单二',
        path: "admin-2",
        component: () => import('../views/hello/index.vue'),
        children:[
          {
            name: 'admin菜单二--一',
            path: "admin-2-1",
            component: () => import('../views/hello/index.vue'),
            meta:{
              title: "admin菜单二--一"
            }
          },
        ]
      }
    ]
  }
]

export default route;