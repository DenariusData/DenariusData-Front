export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('token')

  if (token.value && to.name === 'login') {
    return navigateTo('/')
  }
})
