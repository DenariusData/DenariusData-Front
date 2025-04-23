
type Route = {
  label: string;
  to: string;
  icon: string;
};


const routes = [
{ label: 'Home', to: '/', icon: 'dashicons:admin-home'},
{ label: 'Registro de Ponto', to: '/ponto', icon: 'mdi:clock-plus' },
{ label: 'Empresas', to: '/empresa', icon: 'heroicons:building-office-2-20-solid' },
{ label: 'Funcionários', to: '/funcionario', icon: 'mdi:account-multiple-plus' }
]

export default routes

