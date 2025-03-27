<script setup lang="ts">
import { ref } from 'vue';
//import { cadastrarEmpresa, uploadImagemEmpresa } from '@/services/api';

useHead({
    title: 'Cadastro de Empresa',
});

const empresa = ref({
    nome: '',
    cnpj: '',
    endereço: '',
    foto: null as File | null, // Armazena o arquivo de imagem
    fotoUrl: '' as string, // Armazena a URL da imagem após o upload
});

// Função para salvar o cadastro do funcionário
//const salvarCadastro = async () => {
   // try {
        // Cadastra o funcionário no backend
      //  const { data } = await cadastrarFuncionario({
          // nome: funcionario.value.nome,
           // cpf: funcionario.value.cpf,
          //  empresa: funcionario.value.empresa,
          //  cargaHoraria: funcionario.value.cargaHoraria,
         //   funcao: funcionario.value.funcao,
        //    email: funcionario.value.email,
      //  });

        // Se houver uma foto, faz o upload
      //  if (funcionario.value.foto) {
        //    const imageUrl = await uploadImagemFuncionario(data.id, funcionario.value.foto);
          //  funcionario.value.fotoUrl = imageUrl; // Atualiza a URL da imagem
       // }

   //     alert('Funcionário cadastrado com sucesso!');
  //  } catch (error) {
   //     console.error('Erro ao salvar:', error);
   //     alert('Erro ao salvar os dados.');
   // }
//};

// Função para lidar com o upload de arquivos
const handleFileUpload = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
        empresa.value.foto = input.files[0]; // Armazena o arquivo selecionado
        empresa.value.fotoUrl = URL.createObjectURL(input.files[0]); // Gera uma URL temporária para visualização
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

                <!-- Campo cnpj -->
                <UFormGroup label="CNPJ" name="cnpj">
                    <UInput v-model="empresa.cnpj" type="text" />
                </UFormGroup>

                <!-- Campo Empresa -->
                <UFormGroup label="Endereço" name="endereço">
                    <UInput v-model="empresa.endereço" type="text" />
                </UFormGroup>


                <!-- Campo Foto -->
                <UFormGroup label="Foto" name="foto">
                    <UInput type="file" @change="handleFileUpload" />
                </UFormGroup>

                <!-- Exibe a imagem se já houver uma URL -->
                <div v-if="empresa.fotoUrl" class="flex justify-center">
                    <img :src="empresa.fotoUrl" alt="Foto do Funcionário" class="w-32 h-32 object-cover rounded-full" />
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

<style scoped>
.bg-lightblue-500 {
    background-color: #63b3ed;
}
</style>
