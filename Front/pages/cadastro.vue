<script setup lang="ts">
import { ref } from 'vue';
import { cadastrarFuncionario, uploadImagemFuncionario } from '@/services/api';

const tipoCadastro = ref('');
const empresa = ref({ cnpj: '', nome: '', endereco: '' });
const funcionario = ref({
  nome: '',
  cpf: '',
  empresa: '',
  cargaHoraria: '',
  funcao: '',
  email: '',
  foto: null as File | null, // Armazena o arquivo de imagem
  fotoUrl: '' as string, // Armazena a URL da imagem após o upload
});

// Função para salvar o cadastro do funcionário
const salvarCadastro = async () => {
  try {
    if (tipoCadastro.value === 'funcionario') {
      // Cadastra o funcionário no backend
      const { data } = await cadastrarFuncionario({
        nome: funcionario.value.nome,
        cpf: funcionario.value.cpf,
        empresa: funcionario.value.empresa,
        cargaHoraria: funcionario.value.cargaHoraria,
        funcao: funcionario.value.funcao,
        email: funcionario.value.email,
      });

      // Se houver uma foto, faz o upload
      if (funcionario.value.foto) {
        const imageUrl = await uploadImagemFuncionario(data.id, funcionario.value.foto);
        funcionario.value.fotoUrl = imageUrl; // Atualiza a URL da imagem
      }

      alert('Funcionário cadastrado com sucesso!');
    } else if (tipoCadastro.value === 'empresa') {
      console.log('Cadastro de empresa ainda não implementado.');
    }
  } catch (error) {
    console.error('Erro ao salvar:', error);
    alert('Erro ao salvar os dados.');
  }
};

// Função para lidar com o upload de arquivos
const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    funcionario.value.foto = input.files[0]; // Armazena o arquivo selecionado
    funcionario.value.fotoUrl = URL.createObjectURL(input.files[0]); // Gera uma URL temporária para visualização
  }
};

// Função para voltar ao menu inicial
const voltar = () => {
  tipoCadastro.value = '';
};
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
    <!-- Menu inicial -->
    <div v-if="!tipoCadastro" class="flex flex-col items-center">
      <h2 class="text-xl font-bold mb-4">O que deseja cadastrar?</h2>
      <button @click="tipoCadastro = 'empresa'" class="px-4 py-2 bg-blue-500 text-white rounded-lg mb-2 w-full">
        Empresa
      </button>
      <button @click="tipoCadastro = 'funcionario'" class="px-4 py-2 bg-lightblue-500 text-white rounded-lg w-full">
        Funcionário
      </button>
    </div>

    <!-- Formulário de cadastro de funcionário -->
    <div v-if="tipoCadastro === 'funcionario'" class="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-lg font-bold text-center mb-4">Cadastro de Funcionário</h2>
      <div class="flex flex-col gap-4">
        <label class="flex flex-col text-center">
          <span class="font-bold">Nome</span>
          <input v-model="funcionario.nome" type="text" class="border p-2 rounded-lg" />
        </label>
        <label class="flex flex-col text-center">
          <span class="font-bold">CPF</span>
          <input v-model="funcionario.cpf" type="text" class="border p-2 rounded-lg" />
        </label>
        <label class="flex flex-col text-center">
          <span class="font-bold">Empresa</span>
          <input v-model="funcionario.empresa" type="text" class="border p-2 rounded-lg" />
        </label>
        <label class="flex flex-col text-center">
          <span class="font-bold">Carga Horária</span>
          <input v-model="funcionario.cargaHoraria" type="text" class="border p-2 rounded-lg" />
        </label>
        <label class="flex flex-col text-center">
          <span class="font-bold">Função</span>
          <input v-model="funcionario.funcao" type="text" class="border p-2 rounded-lg" />
        </label>
        <label class="flex flex-col text-center">
          <span class="font-bold">Email</span>
          <input v-model="funcionario.email" type="email" class="border p-2 rounded-lg" />
        </label>
        <label class="flex flex-col text-center">
          <span class="font-bold">Foto</span>
          <input type="file" class="border p-2 rounded-lg" @change="handleFileUpload" />
        </label>
        <!-- Exibe a imagem se já houver uma URL -->
        <div v-if="funcionario.fotoUrl" class="flex justify-center">
          <img :src="funcionario.fotoUrl" alt="Foto do Funcionário" class="w-32 h-32 object-cover rounded-full" />
        </div>
      </div>
      <button @click="salvarCadastro" class="mt-4 w-full px-4 py-2 bg-lightblue-500 text-white rounded-lg">
        Salvar
      </button>
      <button @click="voltar" class="mt-2 w-full px-4 py-2 bg-gray-500 text-white rounded-lg">
        Voltar
      </button>
    </div>
  </div>
</template>

<style scoped>
.bg-lightblue-500 {
  background-color: #63b3ed;
}
</style>