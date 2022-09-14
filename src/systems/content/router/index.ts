const route = [
  {
    name: 'content',
    path: 'content',
    component: () => import('../layout/index.vue'),
    children: [
      {
        name: 'Hello1',
        path: "hello",
        component: () => import('../views/hello/index.vue'),
        meta:{
          title: "hello"
        }
      }, {
        name: 'Creation',
        path: "creationPage",
        component: () => import('../views/hello/index.vue'),
        meta:{
          title: "Creation"
        }
      }, {
        name: 'Zoom',
        path: "zoomPage",
        component: () => import('../views/hello/index.vue'),
        meta:{
          title: "Zoom"
        }
      }
    ]
  }
]

export default route;