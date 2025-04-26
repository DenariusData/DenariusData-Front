<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'
import { listarEmpresas, listarFuncionarios, cadastrarRegistroDePonto } from '@/services/api'
import { useToast } from '#imports'

useHead({ title: 'Registro de Ponto' })

const toast = useToast()

// Validação do formulário
const workSchema = object({
  diaTrabalhado: string().required('Escolha uma data válida'),
  horarioEntrada: string().required('Horário de entrada obrigatório'),
  horarioSaida: string().required('Horário de saída obrigatório'),
  empresa: string().required('Selecione a empresa'),
  funcionario: string().required('Selecione o funcionário'),
  observacoes: string().optional()
})

type WorkSchema = InferType<typeof workSchema>

// Estado do formulário
const Registro_de_Ponto = reactive({
  empresa: '',
  funcionario: '',
  diaTrabalhado: '',
  horarioEntrada: '',
  horarioSaida: '',
  observacoes: ''
})

// Dropdowns
const companies = ref<{ label: string, value: string }[]>([])
const employees = ref<{ label: string, value: number }[]>([])

onMounted(async () => {
  try {
    const empresasResponse = await listarEmpresas()
    companies.value = [
      { label: 'Selecione uma empresa', value: '' },
      ...empresasResponse.data.map((empresa: any) => ({
        label: empresa.nome,
        value: empresa.cnpj // <-- aqui usamos o CNPJ
      }))
    ]

    const funcionariosResponse = await listarFuncionarios()
    employees.value = [
      { label: 'Selecione um funcionário', value: 0 },
      ...funcionariosResponse.data.map((funcionario: any) => ({
        label: funcionario.nome,
        value: funcionario.id
      }))
    ]
  } catch (error) {
    console.error('Erro ao carregar empresas ou funcionários:', error)
  }
})

const salvarRegistroDePonto = async () => {
  try {
    const payload = {
      empresa: Registro_de_Ponto.empresa, // cnpj string
      funcionario: { id: Number(Registro_de_Ponto.funcionario) },
      diaTrabalhado: Registro_de_Ponto.diaTrabalhado,
      horarioEntrada: Registro_de_Ponto.horarioEntrada,
      horarioSaida: Registro_de_Ponto.horarioSaida,
      observacoes: Registro_de_Ponto.observacoes
    }

    await cadastrarRegistroDePonto(payload)

    toast.add({
      id: 'registro-sucesso',
      title: 'Registro de ponto salvo com sucesso!',
      icon: 'i-heroicons-check-circle',
      timeout: 5000,
      color: 'green'
    })

    // Resetar o formulário
    Registro_de_Ponto.empresa = ''
    Registro_de_Ponto.funcionario = ''
    Registro_de_Ponto.diaTrabalhado = ''
    Registro_de_Ponto.horarioEntrada = ''
    Registro_de_Ponto.horarioSaida = ''
    Registro_de_Ponto.observacoes = ''
  } catch (error) {
    console.error('Erro ao salvar registro de ponto:', error)
    toast.add({
      id: 'registro-erro',
      title: 'Erro ao salvar registro de ponto',
      icon: 'i-heroicons-x-circle',
      timeout: 6000,
      color: 'red'
    })
  }
}

const onSubmit = async (event: FormSubmitEvent<WorkSchema>) => {
  await salvarRegistroDePonto()
}
</script>

<template>
  <div class="grid justify-items-center">
    <UCard class="w-full md:w-1/3">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold">Registro de Ponto</h2>
        </div>
      </template>

      <UForm :schema="workSchema" :state="Registro_de_Ponto" class="space-y-4" @submit="onSubmit">

        <!-- Empresa -->
        <UFormGroup label="Empresa" name="empresa">
          <USelect v-model="Registro_de_Ponto.empresa" :options="companies" />
        </UFormGroup>

        <!-- Funcionário -->
        <UFormGroup label="Funcionário" name="funcionario">
          <USelect v-model="Registro_de_Ponto.funcionario" :options="employees" />
        </UFormGroup>

        <!-- Dia Trabalhado -->
        <UFormGroup label="Dia Trabalhado" name="diaTrabalhado">
          <UInput v-model="Registro_de_Ponto.diaTrabalhado" type="date" />
        </UFormGroup>

        <!-- Horário de Entrada -->
        <UFormGroup label="Horário de Entrada" name="horarioEntrada">
          <UInput v-model="Registro_de_Ponto.horarioEntrada" type="time" />
        </UFormGroup>

        <!-- Horário de Saída -->
        <UFormGroup label="Horário de Saída" name="horarioSaida">
          <UInput v-model="Registro_de_Ponto.horarioSaida" type="time" />
        </UFormGroup>

        <!-- Observações -->
        <UFormGroup label="Observações" name="observacoes">
          <UTextarea v-model="Registro_de_Ponto.observacoes" />
        </UFormGroup>

        <!-- Botão -->
        <UButton type="submit" label="Salvar registro" color="primary" block />
      </UForm>
    </UCard>
  </div>
</template>

<style scoped>
.bg-lightblue-500 {
  background-color: #63b3ed;
}
</style>
