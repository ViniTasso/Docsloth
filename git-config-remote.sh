#!/bin/bash
# Script de configuração de remotes para novos projetos

echo "Configurando remotes de padronização..."

# 1. Renomeia a origem clonada para 'template'
git remote rename origin template

# 2. Adiciona o novo repositório principal (o desenvolvedor deve criar e colocar a URL)
# echo "ATENÇÃO: Crie o novo repositório no servidor e adicione a URL abaixo:"
# git remote add origin https://www.youtube.com/watch?v=CLG1p3x4NTQ

# 3. Adiciona o repositório de documentação
git remote add documentacao https://docs.github.com/pt/repositories

# 4. Adiciona o repositório de cobertura de testes
git remote add teste_coverage https://oieduardorabelo.medium.com/cobertura-de-c%C3%B3digo-explicada-ba1516db7dbd

echo "Configuração de remotes concluída. Execute 'git remote -v' para verificar."