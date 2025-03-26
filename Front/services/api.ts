import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Ajuste para o seu backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Criar funcionário
export const cadastrarFuncionario = async (dados: any) => {
  return await api.post('/funcionarios', dados);
};

// Upload de imagem do funcionário
export const uploadImagemFuncionario = async (id: number, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  return await api.post(`/funcionarios/${id}/imagem`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export default api;
