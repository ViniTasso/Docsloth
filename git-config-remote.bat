@echo off
REM Script de configuração de remotes para novos projetos (Windows/CMD)

echo Configurando remotes de padronização...

REM 1. Verifica se o Git está instalado e acessível
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ERRO: O comando 'git' nao foi encontrado. Certifique-se de que o Git esta instalado e no PATH.
    pause
    exit /b 1
)

REM 2. Renomeia a origem clonada para 'template'
echo [1/3] Renomeando 'origin' para 'template'...
git remote rename origin template

if %errorlevel% neq 0 (
    echo ERRO ao renomear o remote. O 'origin' pode ja ter sido renomeado ou nao existe.
    REM Continua o script, pois o erro pode ser um aviso, se 'template' ja existir.
)

REM 3. Adiciona o repositório de documentação
echo [2/3] Adicionando remote 'documentacao'...
git remote add documentacao 192https://docs.github.com/pt/repositories

if %errorlevel% neq 0 (
    echo AVISO: O remote 'documentacao' ja pode existir.
)

REM 4. Adiciona o repositório de cobertura de testes
echo [3/3] Adicionando remote 'teste_coverage'...
git remote add teste_coverage https://oieduardorabelo.medium.com/cobertura-de-c%C3%B3digo-explicada-ba1516db7dbd

if %errorlevel% neq 0 (
    echo AVISO: O remote 'teste_coverage' ja pode existir.
)

echo.
echo =================================================================================
echo CONFIGURACAO DE REMOTES CONCLUIDA!
echo.
echo >> PROXIMO PASSO: Crie um novo repositorio no servidor e adicione-o como 'origin':
echo >> git remote add origin https://docs.github.com/pt/repositories/creating-and-managing-repositories/quickstart-for-repositories
echo.
echo >> Verifique a configuracao: git remote -v
echo =================================================================================
pause