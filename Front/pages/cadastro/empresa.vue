<script setup lang="ts">
import { ref } from 'vue';
import { cadastrarEmpresa } from '@/services/api';

useHead({
    title: 'Cadastro de Empresa',
});

const empresa = ref({
    nome: '',
    cnpj: '',
    endereço: '',
});

// Função para salvar o cadastro da empresa
const salvarCadastro = async () => {
    try {
        // Envia os dados da empresa para o backend
        await cadastrarEmpresa({
            nome: empresa.value.nome,
            cnpj: empresa.value.cnpj,
            endereco: empresa.value.endereço, // Ajuste para o campo correto no backend
        });

        alert('Empresa cadastrada com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar:', error);
        alert('Erro ao salvar os dados da empresa.');
    }
};
</script>

<template>
    <div class="grid justify-items-center">
        <UCard class="w-full md:w-1/3">
            <template #header>
                <div class="flex justify-between items-center">
                    <h2 class="text-xl font-bold">Cadastro de Empresas</h2>
                </div>
            </template>
            <div class="space-y-4">
                <!-- Campo Nome -->
                <UFormGroup label="Nome" name="nome">
                    <UInput v-model="empresa.nome" type="text" />
                </UFormGroup>

                <!-- Campo CNPJ -->
                <UFormGroup label="CNPJ" name="cnpj">
                    <UInput v-model="empresa.cnpj" type="text" />
                </UFormGroup>

                <!-- Campo Endereço -->
                <UFormGroup label="Endereço" name="endereço">
                    <UInput v-model="empresa.endereço" type="text" />
                </UFormGroup>

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

<style scoped>
.bg-lightblue-500 {
    background-color: #63b3ed;
}
</style>