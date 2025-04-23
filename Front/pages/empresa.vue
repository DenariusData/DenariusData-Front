<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useToast } from '#imports'

const empresas = ref<any[]>([])
const empresasSelecionadas = ref<any[]>([])
const termoPesquisa = ref('')
const filtroSelecionado = ref('nome')
const currentPage = ref(1)
const pageSize = 5
const toast = useToast()

const modalAberto = ref(false)
const empresa = ref({
  id: null,
  nome: '',
  cnpj: '',
  endereco: '',
  foto: null as File | null,
  fotoUrl: ''
})

const options = [
  { value: 'nome', label: 'Nome' },
  { value: 'cnpj', label: 'CNPJ' }
]

const abrirModal = () => {
  modalAberto.value = true
}

const fecharModal = () => {
  modalAberto.value = false
  empresa.value = {
    id: null,
    nome: '', cnpj: '', endereco: '', foto: null, fotoUrl: ''
  }
}

const editarEmpresa = (e: any) => {
  empresa.value = {
    id: e.id,
    nome: e.nome || '',
    cnpj: e.cnpj || '',
    endereco: e.endereco || '',
    foto: null,
    fotoUrl: formatarURLImagem(e.imagem)
  }
  abrirModal()
}

const fetchEmpresas = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/empresas')
    empresas.value = response.data
  } catch (error) {
    console.error('Erro ao carregar empresas:', error)
  }
}
onMounted(fetchEmpresas)

const salvarCadastro = async () => {
  try {
    const payload = {
      nome: empresa.value.nome,
      cnpj: empresa.value.cnpj,
      endereco: empresa.value.endereco
    }

    let response
    if (empresa.value.id) {
      response = await axios.put(`http://localhost:8080/api/empresas/${empresa.value.id}`, payload)
    } else {
      response = await axios.post('http://localhost:8080/api/empresas', payload)
    }

    const empresaId = response.data.id

    if (empresa.value.foto) {
      const formData = new FormData()
      formData.append('imagem', empresa.value.foto)
      await axios.post(`http://localhost:8080/api/empresas/${empresaId}/upload-imagem`, formData)
    }

    toast.add({
      id: 'sucesso',
      title: 'Empresa salva com sucesso!',
      icon: 'i-heroicons-check-circle',
      timeout: 5000,
      color: 'green'
    })

    fecharModal()
    fetchEmpresas()
  } catch (error) {
    console.error('Erro ao salvar empresa:', error)
    toast.add({
      id: 'erro',
      title: 'Erro ao salvar empresa',
      icon: 'i-heroicons-x-circle',
      timeout: 6000,
      color: 'red'
    })
  }
}

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    empresa.value.foto = input.files[0]
    empresa.value.fotoUrl = URL.createObjectURL(input.files[0])
  }
}

const formatarURLImagem = (caminhoRelativo: string) => {
  if (!caminhoRelativo) return ''
  return `http://localhost:8080${caminhoRelativo}`
}

const empresasFiltradas = computed(() => {
  if (!termoPesquisa.value) return empresas.value
  return empresas.value.filter(e =>
    e[filtroSelecionado.value]?.toLowerCase().includes(termoPesquisa.value.toLowerCase())
  )
})

const totalPaginas = computed(() => Math.ceil(empresasFiltradas.value.length / pageSize))
const empresasPaginadas = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return empresasFiltradas.value.slice(start, start + pageSize)
})

const page = currentPage
const items = computed(() => empresasFiltradas.value)
</script>

<template>
  <div class="grid justify-items-center">
    <UCard class="w-3/4">
      <template #header>
        <div class="flex justify-between items-center w-full">
          <h2 class="text-xl font-bold">Empresas</h2>
          <div class="flex gap-2">
            <UButton color="primary" @click="abrirModal">Cadastrar Empresa</UButton>
            <UPopover>
              <UButton icon="heroicons:funnel-solid" />
              <template #panel>
                <div class="p-4">
                  <URadioGroup v-model="filtroSelecionado" legend="Filtrar por" :options="options" />
                </div>
              </template>
            </UPopover>
          </div>
        </div>
      </template>

      <UInput v-model="termoPesquisa" placeholder="Buscar empresa..." class="mt-2" />

      <table class="w-full border-collapse border border-gray-300 dark:border-gray-600 mt-4">
        <thead>
          <tr class="bg-gray-100 dark:bg-gray-800">
            <th>Logo</th>
            <th>Nome</th>
            <th>CNPJ</th>
            <th>Endereço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(empresa, index) in empresasPaginadas" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-800">
            <td class="text-center"><img :src="formatarURLImagem(empresa.imagem)" class="w-12 h-12 object-cover rounded-full" /></td>
            <td>{{ empresa.nome }}</td>
            <td>{{ empresa.cnpj }}</td>
            <td>{{ empresa.endereco }}</td>
            <td class="text-center">
              <UButton icon="heroicons:pencil-square" color="primary" variant="ghost" @click="editarEmpresa(empresa)" />
            </td>
          </tr>
        </tbody>
      </table>

      <div class="flex justify-end mt-4">
        <UPagination v-model="page" :page-count="pageSize" :total="items.length" />
      </div>
    </UCard>

    <UModal v-model="modalAberto">
      <UCard class="max-w-lg mx-auto">
        <template #header>
          <h2 class="text-lg font-bold">Cadastro de Empresa</h2>
        </template>
        <div class="space-y-4">
          <UFormGroup label="Nome"><UInput v-model="empresa.nome" /></UFormGroup>
          <UFormGroup label="CNPJ"><UInput v-model="empresa.cnpj" /></UFormGroup>
          <UFormGroup label="Endereço"><UInput v-model="empresa.endereco" /></UFormGroup>
          <UFormGroup label="Logo">
            <input type="file" @change="handleFileUpload" accept="image/png, image/jpeg" />
            <div v-if="empresa.fotoUrl" class="flex justify-center mt-2">
              <img :src="empresa.fotoUrl" class="w-24 h-24 rounded-full object-cover" />
            </div>
          </UFormGroup>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton @click="fecharModal" color="gray">Cancelar</UButton>
            <UButton @click="salvarCadastro" color="primary">Salvar</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>
