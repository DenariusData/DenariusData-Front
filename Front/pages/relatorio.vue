<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import axios from 'axios';
import html2canvas from 'html2canvas'; // Importa a biblioteca html2canvas

// Dados de funcionários
const funcionarios = ref<any[]>([]);

// Controle do filtro
const filtroAtivo = ref(false); // Para exibir ou ocultar o menu de filtros
const filtrosSelecionados = ref<{ [key: string]: boolean }>({
  nome: true,
  funcao: false,
  empresa: false,
  cpf: false,
});
const termoPesquisa = ref('');

// Função para buscar os dados de funcionários do backend
const fetchFuncionarios = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/funcionarios');
    funcionarios.value = response.data.map((f: any) => ({
      ...f,
      selecionado: false, // Adiciona o campo "selecionado" para controle de exportação
    }));
  } catch (error) {
    console.error('Erro ao carregar os funcionários', error);
  }
};

// Carregar os dados ao montar o componente
onMounted(() => {
  fetchFuncionarios();
});

// Computed para filtrar os funcionários com base nos filtros selecionados
const funcionariosFiltrados = computed(() => {
  return funcionarios.value.filter((f) => {
    if (!termoPesquisa.value) return true;
    return (
      (filtrosSelecionados.value.nome &&
        f.nome.toLowerCase().includes(termoPesquisa.value.toLowerCase())) ||
      (filtrosSelecionados.value.funcao &&
        f.funcao.toLowerCase().includes(termoPesquisa.value.toLowerCase())) ||
      (filtrosSelecionados.value.empresa &&
        f.empresa.toLowerCase().includes(termoPesquisa.value.toLowerCase())) ||
      (filtrosSelecionados.value.cpf && f.cpf.includes(termoPesquisa.value))
    );
  });
});

// Computed para obter os funcionários selecionados para exportação
const funcionariosSelecionados = computed(() => {
  return funcionariosFiltrados.value.filter((f) => f.selecionado);
});

// Funções de exportação (Excel e PDF)
const exportToExcel = () => {
  if (funcionariosSelecionados.value.length === 0) {
    alert('Selecione pelo menos um funcionário para exportar!');
    return;
  }
  const ws = XLSX.utils.json_to_sheet(funcionariosSelecionados.value);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Funcionarios');
  XLSX.writeFile(wb, 'relatorio_funcionarios.xlsx');
};

const exportToPDF = async () => {
  if (funcionariosSelecionados.value.length === 0) {
    alert('Selecione pelo menos um funcionário para exportar!');
    return;
  }

  const doc = new jsPDF();
  doc.setFontSize(12);
  doc.text('Relatório de Funcionários', 14, 20);

  let y = 30; // Posição inicial vertical

  // Adicionar cabeçalho da tabela
  const headers = ['Foto', 'Nome', 'CPF', 'Empresa', 'Função', 'E-mail'];
  headers.forEach((header, i) => {
    doc.text(header, 14 + i * 30, y);
  });

  y += 10; // Avança para a próxima linha

  // Iterar sobre os funcionários selecionados
  for (const f of funcionariosSelecionados.value) {
    // Capturar a imagem usando html2canvas
    if (f.imagem) {
      const imageElement = document.querySelector(`img[src="http://localhost:8080${f.imagem}"]`);
      if (imageElement) {
        const canvas = await html2canvas(imageElement as HTMLElement);
        const imgData = canvas.toDataURL('image/jpeg'); // Converte o canvas para Base64
        doc.addImage(imgData, 'JPEG', 14, y, 16, 16); // Adiciona a imagem ao PDF
      }
    }

    // Adicionar os dados do funcionário
    doc.text(f.nome || '', 30, y + 5); // Nome
    doc.text(f.cpf || '', 70, y + 5); // CPF
    doc.text(f.empresa || '', 100, y + 5); // Empresa
    doc.text(f.funcao || '', 130, y + 5); // Função
    doc.text(f.email || '', 160, y + 5); // E-mail

    y += 20; // Avança para a próxima linha
  }

  // Salvar o PDF
  doc.save('relatorio_funcionarios.pdf');
};
</script>

<template>
  <div class="ml-16 lg:ml-48 p-4 flex flex-col space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-bold">Relatório de Funcionários</h2>
      <!-- Botão de Filtragem -->
      <div class="relative">
        <button
          @click="filtroAtivo = !filtroAtivo"
          class="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-all"
        >
          <Icon name="mdi:filter" class="w-6 h-5" />
        </button>
        <!-- Menu de Filtros -->
        <div
          v-if="filtroAtivo"
          class="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-lg rounded-lg p-4"
        >
          <p class="text-sm font-bold mb-2">Filtrar por:</p>
          <div class="space-y-2">
            <label class="flex items-center space-x-2">
              <input type="checkbox" v-model="filtrosSelecionados.nome" />
              <span>Nome</span>
            </label>
            <label class="flex items-center space-x-2">
              <input type="checkbox" v-model="filtrosSelecionados.funcao" />
              <span>Função</span>
            </label>
            <label class="flex items-center space-x-2">
              <input type="checkbox" v-model="filtrosSelecionados.empresa" />
              <span>Empresa</span>
            </label>
            <label class="flex items-center space-x-2">
              <input type="checkbox" v-model="filtrosSelecionados.cpf" />
              <span>CPF</span>
            </label>
          </div>
        </div>
      </div>
    </div>
    <!-- Campo de Pesquisa -->
    <input
      v-if="Object.values(filtrosSelecionados).some((v) => v)"
      v-model="termoPesquisa"
      type="text"
      placeholder="Digite para filtrar"
      class="p-2 rounded-lg border border-gray-300 shadow-md w-full"
    />
    <!-- Tabela -->
    <div class="overflow-x-auto bg-white rounded-lg shadow-md">
      <table class="min-w-full table-auto border-collapse">
        <thead class="bg-gray-200">
          <tr>
            <th class="border px-4 py-2 text-center">✔</th>
            <th class="border px-4 py-2 text-left">Foto</th>
            <th class="border px-4 py-2 text-left">Nome</th>
            <th class="border px-4 py-2 text-left">CPF</th>
            <th class="border px-4 py-2 text-left">Empresa</th>
            <th class="border px-4 py-2 text-left">Função</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="f in funcionariosFiltrados" :key="f.id">
            <td class="border px-4 py-2 text-center">
              <input type="checkbox" v-model="f.selecionado" class="scale-150" />
            </td>
            <td class="border px-4 py-2">
              <img
                v-if="f.imagem"
                :src="`http://localhost:8080${f.imagem}`"
                alt="Foto do Funcionário"
                class="w-16 h-16 object-cover rounded-full"
              />
            </td>
            <td class="border px-4 py-2">{{ f.nome }}</td>
            <td class="border px-4 py-2">{{ f.cpf }}</td>
            <td class="border px-4 py-2">{{ f.empresa }}</td>
            <td class="border px-4 py-2">{{ f.funcao }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Botões de Exportação (Abaixo da Tabela) -->
    <div class="flex justify-end space-x-4 mt-4">
      <button
        @click="exportToPDF"
        class="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
      >
        Exportar para PDF
      </button>
      <button
        @click="exportToExcel"
        class="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
      >
        Exportar para Excel
      </button>
    </div>
  </div>
</template>