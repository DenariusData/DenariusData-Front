<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

interface RegistroPonto {
  id: number
  empresa: string
  funcionario: string
  diaTrabalhado: string
  horarioEntrada: string
  horarioSaida: string
  observacoes: string
}

const registros = ref<RegistroPonto[]>([
  {
    id: 1,
    empresa: 'Empresa A',
    funcionario: 'João',
    diaTrabalhado: '2025-05-15',
    horarioEntrada: '08:00',
    horarioSaida: '17:00',
    observacoes: 'Nenhuma'
  },
  {
    id: 2,
    empresa: 'Empresa B',
    funcionario: 'Maria',
    diaTrabalhado: '2025-05-14',
    horarioEntrada: '09:00',
    horarioSaida: '18:00',
    observacoes: 'Atraso justificado'
  }
])

// Modal cadastro/edição
const modalAberto = ref(false)
const registroEditando = reactive<Partial<RegistroPonto>>({})

// Modal confirmação exclusão
const confirmarExclusaoAberto = ref(false)
const registroParaExcluir = ref<RegistroPonto | null>(null)

// Barra de pesquisa e filtro
const termoPesquisa = ref('')
const filtroSelecionado = ref('empresa')

// Para abrir modal de edição
function abrirModalParaEditar(registro: RegistroPonto) {
  Object.assign(registroEditando, registro)
  modalAberto.value = true
}

// Para abrir modal de cadastro (limpo)
function abrirModalParaCadastro() {
  Object.assign(registroEditando, {
    id: undefined,
    empresa: '',
    funcionario: '',
    diaTrabalhado: '',
    horarioEntrada: '',
    horarioSaida: '',
    observacoes: ''
  })
  modalAberto.value = true
}

function fecharModal() {
  modalAberto.value = false
}

function salvarCadastro() {
  if (
    !registroEditando.empresa ||
    !registroEditando.funcionario ||
    !registroEditando.diaTrabalhado ||
    !registroEditando.horarioEntrada ||
    !registroEditando.horarioSaida
  ) {
    alert('Preencha todos os campos obrigatórios')
    return
  }

  if (registroEditando.id) {
    // Editar registro existente
    const idx = registros.value.findIndex(r => r.id === registroEditando.id)
    if (idx >= 0) {
      registros.value[idx] = { ...(registroEditando as RegistroPonto) }
    }
  } else {
    // Novo registro
    registros.value.push({
      ...(registroEditando as RegistroPonto),
      id: Math.max(0, ...registros.value.map(r => r.id)) + 1
    })
  }

  fecharModal()
}

// Exclusão
function abrirConfirmarExclusao(registro: RegistroPonto) {
  registroParaExcluir.value = registro
  confirmarExclusaoAberto.value = true
}

function cancelarExclusao() {
  confirmarExclusaoAberto.value = false
  registroParaExcluir.value = null
}

function confirmarExclusao() {
  if (!registroParaExcluir.value) return
  registros.value = registros.value.filter(r => r.id !== registroParaExcluir.value!.id)
  cancelarExclusao()
}

// Filtragem da lista
const registrosFiltrados = computed(() => {
  return registros.value.filter(reg => {
    const busca = termoPesquisa.value.toLowerCase()
    // Filtro por pesquisa geral (todos os campos)
    const correspondePesquisa =
      reg.empresa.toLowerCase().includes(busca) ||
      reg.funcionario.toLowerCase().includes(busca) ||
      reg.diaTrabalhado.includes(busca) ||
      reg.horarioEntrada.includes(busca) ||
      reg.horarioSaida.includes(busca) ||
      reg.observacoes.toLowerCase().includes(busca)

    if (!correspondePesquisa) return false

    // Filtro por campo específico
    switch (filtroSelecionado.value) {
      case 'empresa':
        return reg.empresa.toLowerCase().includes(busca)
      case 'diaTrabalhado':
        return reg.diaTrabalhado.includes(busca)
      case 'horarioEntrada':
        return reg.horarioEntrada.includes(busca)
      case 'horarioSaida':
        return reg.horarioSaida.includes(busca)
      default:
        return true
    }
  })
})
</script>

<template>
  <div class="p-4 max-w-4xl mx-auto">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Registros de Ponto</h1>
      <div class="flex gap-2 items-center">
        <UInput
          v-model="termoPesquisa"
          placeholder="Buscar..."
          class="mt-0"
          style="min-width: 250px"
        />
        <UPopover>
          <UButton icon="heroicons:funnel-solid" />
          <template #panel>
            <div class="p-4 space-y-2">
              <URadioGroup
                v-model="filtroSelecionado"
                legend="Filtrar por"
                :options="[
                  { label: 'Empresa', value: 'empresa' },
                  { label: 'Dia Trabalhado', value: 'diaTrabalhado' },
                  { label: 'Horário Entrada', value: 'horarioEntrada' },
                  { label: 'Horário Saída', value: 'horarioSaida' }
                ]"
              />
            </div>
          </template>
        </UPopover>
        <UButton color="primary" @click="abrirModalParaCadastro">Cadastrar</UButton>
      </div>
    </div>

    <table class="w-full border-collapse border border-gray-300">
      <thead>
        <tr>
          <th class="border border-gray-300 px-2 py-1">Empresa</th>
          <th class="border border-gray-300 px-2 py-1">Funcionário</th>
          <th class="border border-gray-300 px-2 py-1">Dia Trabalhado</th>
          <th class="border border-gray-300 px-2 py-1">Entrada</th>
          <th class="border border-gray-300 px-2 py-1">Saída</th>
          <th class="border border-gray-300 px-2 py-1">Observações</th>
          <th class="border border-gray-300 px-2 py-1">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="reg in registrosFiltrados" :key="reg.id" class="hover:bg-gray-100">
          <td class="border border-gray-300 px-2 py-1">{{ reg.empresa }}</td>
          <td class="border border-gray-300 px-2 py-1">{{ reg.funcionario }}</td>
          <td class="border border-gray-300 px-2 py-1">{{ reg.diaTrabalhado }}</td>
          <td class="border border-gray-300 px-2 py-1">{{ reg.horarioEntrada }}</td>
          <td class="border border-gray-300 px-2 py-1">{{ reg.horarioSaida }}</td>
          <td class="border border-gray-300 px-2 py-1">{{ reg.observacoes }}</td>
          <td class="border border-gray-300 px-2 py-1 space-x-2">
            <button
              @click="abrirModalParaEditar(reg)"
              class="px-2 py-1 bg-blue-600 text-white rounded"
            >
              Editar
            </button>
            <button
              @click="abrirConfirmarExclusao(reg)"
              class="px-2 py-1 bg-red-600 text-white rounded"
            >
              Excluir
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal de cadastro/edição -->
    <UModal v-model="modalAberto">
      <UCard class="max-w-lg mx-auto">
        <template #header>
          <h2 class="text-lg font-bold">
            {{ registroEditando.id ? 'Editar Registro' : 'Cadastrar Registro' }}
          </h2>
        </template>
        <div class="space-y-4">
          <UFormGroup label="Empresa" required>
            <UInput v-model="registroEditando.empresa" />
          </UFormGroup>
          <UFormGroup label="Funcionário" required>
            <UInput v-model="registroEditando.funcionario" />
          </UFormGroup>
          <UFormGroup label="Dia Trabalhado" required>
            <input
              type="date"
              v-model="registroEditando.diaTrabalhado"
              class="w-full border border-gray-300 p-2 rounded"
            />
          </UFormGroup>
          <UFormGroup label="Horário Entrada" required>
            <input
              type="time"
              v-model="registroEditando.horarioEntrada"
              class="w-full border border-gray-300 p-2 rounded"
            />
          </UFormGroup>
          <UFormGroup label="Horário Saída" required>
            <input
              type="time"
              v-model="registroEditando.horarioSaida"
              class="w-full border border-gray-300 p-2 rounded"
            />
          </UFormGroup>
          <UFormGroup label="Observações">
            <textarea v-model="registroEditando.observacoes" class="w-full border border-gray-300 p-2 rounded" />
          </UFormGroup>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" @click="fecharModal">Cancelar</UButton>
            <UButton color="primary" @click="salvarCadastro">Salvar</UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Modal de confirmação de exclusão -->
    <UModal v-model="confirmarExclusaoAberto">
      <UCard class="max-w-md mx-auto">
        <template #header>
          <h2 class="text-lg font-bold text-red-600">Confirmar Exclusão</h2>
        </template>
        <div class="space-y-2">
          <p>Você tem certeza que deseja excluir o registro da empresa <strong>{{ registroParaExcluir?.empresa }}</strong>?</p>
          <p class="text-sm text-gray-500">Esta ação não poderá ser desfeita.</p>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" @click="cancelarExclusao">Cancelar</UButton>
            <UButton color="red" @click="confirmarExclusao">Excluir</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>
