
export default defineNuxtRouteMiddleware((to, from) => {
  const token = process.client ? localStorage.getItem('authToken') : null;

  if (process.server) {
    const cookie = useCookie('authToken');
    if (!cookie.value && to.path !== '/login') {
      return navigateTo('/login');
    }
    if (cookie.value && to.path === '/login') {
      return navigateTo('/');
    }
  }

  if (process.client) {
    if (!token && to.path !== '/login') {
      return navigateTo('/login');
    }
    if (token && to.path === '/login') {
      return navigateTo('/');
    }
  }
});
