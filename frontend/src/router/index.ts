import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import JoinView from '../views/JoinView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: JoinView
    },
    {
      path: '/game',
      name: 'game',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/GameView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const isInRoom = localStorage.getItem('roomId');

  // If the route requires authentication and the user is not authenticated, redirect to the login page
  if (to.meta.requiresAuth && !isInRoom) {
    next('/');
  } else {
    next();
  }
});

export default router
