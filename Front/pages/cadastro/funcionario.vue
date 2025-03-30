<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { cadastrarFuncionario, uploadImagemFuncionario, listarEmpresas } from '@/services/api';

useHead({
    title: 'Cadastro de Funcionário',
});

const funcionario = ref({
    nome: '',
    cpf: '',
    empresa: '', // Armazena o CNPJ da empresa selecionada
    cargaHoraria: '',
    funcao: '',
    email: '',
    foto: null as File | null, // Armazena o arquivo de imagem
    fotoUrl: '' as string, // Armazena a URL da imagem após o upload
});

const toast = useToast()

const empresas = ref<any[]>([]); // Lista de empresas

// Carrega as empresas do backend
const fetchEmpresas = async () => {
    try {
        const response = await listarEmpresas();
        empresas.value = response.data;
    } catch (error) {
        console.error('Erro ao carregar as empresas:', error);
    }
};

onMounted(fetchEmpresas);

// Função para salvar o cadastro do funcionário
const salvarCadastro = async () => {
    try {
        // Cadastra o funcionário no backend
        const { data } = await cadastrarFuncionario({
            nome: funcionario.value.nome,
            cpf: funcionario.value.cpf,
            empresa: funcionario.value.empresa, // Envia o CNPJ da empresa
            cargaHoraria: funcionario.value.cargaHoraria,
            funcao: funcionario.value.funcao,
            email: funcionario.value.email,
        });
        toast.add({
            id: 'cadastrado',
            title: 'Funcionário cadastrado com sucesso!',
            icon: 'i-heroicons-check-circle',
            timeout: 6000,
            color:"green",
        })

        // Se houver uma foto, faz o upload
        if (funcionario.value.foto) {
            const response = await uploadImagemFuncionario(data.id, funcionario.value.foto);
            funcionario.value.fotoUrl = response.data; // Atualiza a URL da imagem
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
</script>

<template>
    <div class="grid justify-items-center">
        <UCard class="w-full md:w-1/3">
            <template #header>
                <div class="flex justify-between items-center">
                    <h2 class="text-xl font-bold">Cadastro de Funcionário</h2>
                </div>
            </template>
            <div class="space-y-4">
                <!-- Campo Nome -->
                <UFormGroup label="Nome" name="nome">
                    <UInput v-model="funcionario.nome" type="text" />
                </UFormGroup>

                <!-- Campo CPF -->
                <UFormGroup label="CPF" name="cpf">
                    <UInput v-model="funcionario.cpf" type="text" />
                </UFormGroup>

                <!-- Campo Empresa -->
                <UFormGroup label="Empresa" name="empresa">
                    <USelect
                        v-model="funcionario.empresa"
                        :options="empresas.map(emp => ({ value: emp.cnpj, label: emp.nome }))"
                        placeholder="Selecione uma empresa"
                    />
                </UFormGroup>

                <!-- Campo Carga Horária -->
                <UFormGroup label="Carga Horária" name="cargaHoraria">
                    <UInput v-model="funcionario.cargaHoraria" type="text" />
                </UFormGroup>

                <!-- Campo Função -->
                <UFormGroup label="Função" name="funcao">
                    <UInput v-model="funcionario.funcao" type="text" />
                </UFormGroup>

                <!-- Campo Email -->
                <UFormGroup label="Email" name="email">
                    <UInput v-model="funcionario.email" type="email" />
                </UFormGroup>

                <!-- Campo Foto -->
                <UFormGroup label="Foto" name="foto">
                    <input type="file" accept="image/png, image/jpeg" @change="handleFileUpload" />
                </UFormGroup>

                <!-- Exibe a imagem se já houver uma URL -->
                <div v-if="funcionario.fotoUrl" class="flex justify-center">
                    <img :src="funcionario.fotoUrl" alt="Foto do Funcionário" class="w-32 h-32 object-cover rounded-full" />
                </div>

                <!-- Botão de Salvar Cadastro -->
                <UButton 
                    @click="salvarCadastro"
                    label="Salvar"
                    color="primary"
                    block
                />
            </div>
        </UCard>
    </div>
</template>
