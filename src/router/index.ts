import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '__/views/HomeView.vue';
import LoginView from '__/views/LoginView.vue';
import CategoryView from '__/views/CategoryView.vue';
import ErrorView from '__/views/ErrorView.vue';

import AdminView from '__/views/Admin/AdminView.vue';
import CategoriesAdmin from '__/views/Admin/CategoriesAdmin.vue';
import DrinksAdmin from '__/views/Admin/DrinksAdmin.vue';
import IngredientsAdmin from '__/views/Admin/IngredientsAdmin.vue';

import axios from '__/plugins/axios';

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes: [
    /**
     * App
     */
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/:categoryId',
      name: 'category',
      component: CategoryView,
      beforeEnter: async (to, from, next) => {
        try {
          await axios.get(`/category/${to.params.categoryId}`);
          next();
        } catch(e) {
          next('/error');
        }
      }
    },

    /**
     * Auth
     */
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },

    /**
     * Admin
     */
    {
      path: '/admin',
      name: 'admin',
      component: AdminView
    },
    {
      path: '/admin/categories',
      name: 'categoriesAdmin',
      component: CategoriesAdmin
    },
    {
      path: '/admin/drinks',
      name: 'drinksAdmin',
      component: DrinksAdmin
    },
    {
      path: '/admin/ingredients',
      name: 'ingredientsAdmin',
      component: IngredientsAdmin
    },

    /**
     * Error
     */
    {
      path: '/error',
      name: 'error',
      component: ErrorView
    },
    {
      path: '/*',
      redirect: '/error'
    }
  ]
});

router.beforeEach((to, from, next) => {
  const adminPagesRegex = /admin/gm ;
  const authRequired = adminPagesRegex.test(to.path);
  const loggedIn = localStorage.getItem('user');

  // trying to access a restricted page + not logged in
  // redirect to login page
  if (authRequired && !loggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router;
