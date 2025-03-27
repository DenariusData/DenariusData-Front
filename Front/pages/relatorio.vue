<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import axios from 'axios';

const funcionarios = ref<any[]>([]);
const funcionariosSelecionados = ref<any[]>([]);
const termoPesquisa = ref('');
const filtroSelecionado = ref('nome');

const options = [
  { value: 'nome', label: 'Nome' },
  { value: 'cpf', label: 'CPF' },
  { value: 'empresa', label: 'Empresa' },
  { value: 'funcao', label: 'Função' }
];

// Função para buscar os funcionários do backend
const fetchFuncionarios = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/funcionarios');
    funcionarios.value = response.data;
  } catch (error) {
    console.error('Erro ao carregar os funcionários', error);
  }
};

// Formata a URL da imagem para exibição correta
const formatarURLImagem = (caminhoRelativo: string) => {
  if (!caminhoRelativo) return '';
  return `http://localhost:8080${caminhoRelativo}`;
};

onMounted(fetchFuncionarios);

// Computed para filtrar funcionários com base no filtro selecionado
const funcionariosFiltrados = computed(() => {
  if (!termoPesquisa.value) return funcionarios.value;
  return funcionarios.value.filter(f => 
    f[filtroSelecionado.value]?.toLowerCase().includes(termoPesquisa.value.toLowerCase())
  );
});

// Exportação para Excel
const exportToExcel = () => {
  if (funcionariosSelecionados.value.length === 0) {
    alert('Selecione pelo menos um funcionário para exportar!');
    return;
  }
  const dadosExportados = funcionariosSelecionados.value.map(({ imagem, ...rest }) => rest);
  const ws = XLSX.utils.json_to_sheet(dadosExportados);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Funcionarios');
  XLSX.writeFile(wb, 'relatorio_funcionarios.xlsx');
};

// Exportação para PDF
const exportToPDF = () => {
  if (funcionariosSelecionados.value.length === 0) {
    alert('Selecione pelo menos um funcionário para exportar!');
    return;
  }
  const doc = new jsPDF();
  doc.setFontSize(12);
  doc.text('Relatório de Funcionários', 14, 20);
  let y = 30;
  const headers = ['Nome', 'CPF', 'Empresa', 'Função', 'E-mail'];
  headers.forEach((header, i) => {
    doc.text(header, 14 + i * 30, y);
  });
  y += 10;
  for (const f of funcionariosSelecionados.value) {
    doc.text(f.nome || '', 14, y);
    doc.text(f.cpf || '', 44, y);
    doc.text(f.empresa || '', 74, y);
    doc.text(f.funcao || '', 104, y);
    doc.text(f.email || '', 134, y);
    y += 10;
  }
  doc.save('relatorio_funcionarios.pdf');
};

</script>

<template>
  <div class="grid justify-items-center">
    <UCard class="w-3/4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold">Relatório de Funcionários</h2>
          <UPopover>
            <UButton icon="heroicons:funnel-solid" />
            <template #panel>
              <div class="p-4">
                <URadioGroup v-model="filtroSelecionado" legend="Filtrar por" :options="options" />
              </div>
            </template>
          </UPopover>
        </div>
      </template>

      <!-- Input de pesquisa -->
      <UInput v-model="termoPesquisa" placeholder="Digite para filtrar" class="mt-2" />

      <!-- Tabela -->
      <table class="w-full border-collapse border border-gray-300 dark:border-gray-600 mt-4">
        <thead>
          <tr class="bg-gray-100 dark:bg-gray-800">
            <th class="border border-gray-300 dark:border-gray-600 p-2"></th>
            <th class="border border-gray-300 dark:border-gray-600 p-2">Foto</th>
            <th class="border border-gray-300 dark:border-gray-600 p-2">Nome</th>
            <th class="border border-gray-300 dark:border-gray-600 p-2">CPF</th>
            <th class="border border-gray-300 dark:border-gray-600 p-2">Empresa</th>
            <th class="border border-gray-300 dark:border-gray-600 p-2">Função</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(funcionario, index) in funcionariosFiltrados" :key="index" class="hover:bg-gray-50 hover:dark:bg-gray-800">
            <td class="border border-gray-300 dark:border-gray-600 p-2 text-center">
              <input type="checkbox" v-model="funcionariosSelecionados" :value="funcionario" />
            </td>
            <td class="border border-gray-300 dark:border-gray-600 p-2 text-center">
              <img :src="formatarURLImagem(funcionario.imagem)" alt="Foto" class="w-12 h-12 rounded-full object-cover" />
            </td>
            <td class="border border-gray-300 dark:border-gray-600 p-2">{{ funcionario.nome }}</td>
            <td class="border border-gray-300 dark:border-gray-600 p-2">{{ funcionario.cpf }}</td>
            <td class="border border-gray-300 dark:border-gray-600 p-2">{{ funcionario.empresa }}</td>
            <td class="border border-gray-300 dark:border-gray-600 p-2">{{ funcionario.funcao }}</td>
          </tr>
        </tbody>
      </table>

      <template #footer>
        <div class="flex justify-end space-x-4">
          <UButton @click="exportToPDF" color="primary">Exportar para PDF</UButton>
          <UButton @click="exportToExcel" color="green">Exportar para Excel</UButton>
        </div>
      </template>
    </UCard>
  </div>
</template>
