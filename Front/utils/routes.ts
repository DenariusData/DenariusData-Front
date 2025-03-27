
type Route = {
    label: string;
    to: string;
    icon: string;
  };


const routes = [
  { label: 'Home', to: '/', icon: 'dashicons:admin-home'},
  { label: 'Registro de Ponto', to: '/ponto', icon: 'mdi:clock-plus' },
  { label: 'Cadastro de Funcionarios', to: '/cadastro/funcionario', icon: 'mdi:account-multiple-plus' },
  { label: 'Cadastro de Empresas', to: '/cadastro/empresa', icon: 'heroicons:building-office-2-20-solid' },
  { label: 'Relatórios e Exportação', to: '/relatorio', icon: 'mdi:calendar-export' }
]

export default routes

  