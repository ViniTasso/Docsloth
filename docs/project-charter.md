# Project Charter - Gerador Automático de Documentação

**Documento ID**: PC-2025-11-26  
**Data de Criação**: 2025-11-26    
**Versão**: 1.0  
**Status**: Rascunho  

---

## 1. Informações Básicas do Projeto

| Campo | Valor |
|-------|-------|
| **Nome do Projeto** | Gerador Automático de Documentação |
| **Sponsor Executivo** | [Nome do Sponsor] |
| **Gerente de Projeto** | Vinícius Tasso |
| **Tech Lead** | Vinícius Tasso |
| **Product Owner** | Vinícius Tasso |
| **Data de Início** | 2025-11-26 |
| **Data de Término Prevista** | 2026-02-28 |
| **Duração Estimada** | 3 meses |

---

## 2. Contexto e Justificativa

### 2.1 Problema
Gerar a junção de documentos previamente padronizados pela equipe.
Visando uma equipe com poucas pessoas, sem uma ilha dedicada à documentação, esse projeto visa permitir que cada integrante crie documentos referentes a sua função dentro do repositório git, e todos sejam integrados automaticamente em um visualizador da documentação do código.


**Exemplo:**
Atualmente, pelo fato da pequena equipe que compõe o projeto, o arquiteto não consegue manter documentações das decisões que são tomadas nos projetos.
Pela descentralização, por falta de padrão e instrução para este fim.
- Ao invés de acessar um arquivo .word, procurar por decisões arquiteturais e realizar a alteração
- O arquiteto apenas cria um novo arquivo dentro do projeto na pasta docs/adr com 2025-11-26-adr01.md
- Após criado o arquivo, ao acessar o aplicativo a nova alteração já estará incorporada na documentação automatizada
- Não deverá ser usado como via formal de documentação por falhas inerentes a automação

### 2.2 Contexto de Negócio
A documentação é essencial para a continuidade e passagem de conhecimento. 
Ao manter o tamanho da equipe aumentando a demanda pelas manutenções das aplicações antigas e criando novos projetos, é inviável manter o desenvolvimento sem documentação pela probabilidade de todas aplicações antigas se tornarem inviáveis de manutenção por falta de conhecimento técnico que se perdeu.
Essa ferramenta, soluciona a dificuldade de manter documentações, pelo sentimento de inutilidade por parte dos programadores, que criam documentaçoes descentralizadas e nunca acessadas.

**Exemplo:**
Este projeto está alinhado com objetivos estratégicos, contribuindo diretamente para a meta de redução do tempo de manutenção e treinamento de novos programadores para a equipe.

---

## 3. Objetivos e Metas

### 3.1 Objetivo Geral
Quero que após finalizado o meu código, esse aplicativo seja capaz de reunir as informações que estão descentralizadas sobre o meu código, sobre a arquitetura, sobre os complementos que são inseridos.

Ao entrar no arquivo principal da Documentação do meu código, que seria baseado em uma estrutura de Design Document, esse código vai buscar nos locais que eu definir tudo o que for referente aquele projeto.
Para isso, eu quero padronizar na evolução do código, o uso de arquivos markdown, e de documentação como código, dentro do repositório git de cada projeto.
Quando eu inserir o link do repositório Git do meu projeto, a aplicação já vai saber que dentro da pasta "doc/adr" tem todas as decisões de arquiteturas importantes para elencar no meu Design Document caso seja solicitada, sabendo que por se tratar de um documento padrão, sempre que encontrar a tag **nome** será o nome da ADR, e poderá inserir no Design Document na seção Desição de Arquitetura o conteúdo do arquivo em uma página que ele irá embutir, com o nome e todas as informações que terá acesso. 
Assim como histórico de versão com CHANGELOG, ou PROJECTCHARTER para inserir na introdução do Design Document.

Ou seja, quero descentralizar a documentação, para que cada funcionário consiga criar os seus documentos, evitar conflitos, criar versionamento da documentação, e resgatar o problema da descentralização com o uso desse aplicativo que irá reunir dinamicamente a medida que eu fizer acesso aos blocos principais no Design Document.

Essa aplicação, poderia ser inserida dentro do próprio diretório do projeto.

### 3.2 Objetivos Específicos (SMART)

| # | Objetivo | Métrica | Meta | Prazo |
|---|----------|---------|------|-------|
| 1 | Reduzir tempo de aprendizado da aplicação | Tempo médio | Estimado | Sem Prazo |
| 2 | Reduzir descentralização de documentações | % de erros | De +3 lugares para 2 | Imediato |
| 3 | Aumentar motivação dos programadores agregarem nas documentaçoes | Evolução do código doc | Mínimo 80% de doc | Em 1 Mês |

---

## 4. Escopo do Projeto

### 4.1 No Escopo (In Scope)

**Funcionalidades Principais**:
1. Mapear documentos dentro do projeto
   - 1.1. Percorrer as pastas do projeto a partir do diretório definido
   - 1.2. Alertar que existe arquivos com nomes conhecidos em lugares que não foi definido nas suas regras.
   - 1.3. Ser um por si só uma padronização da documentação da empresa
2. Mostrar de forma dinâmica toda a documentação por meio de uma página HTML
   - 2.1. Utilizar o modelo de Design Document, para separar blocos de navegação
   - 2.2. Caso algum arquivo não exista dentro do repositório, apenas crie um título, ex "3. Business Case (Não Criado)
   - 2.4. Permitir que cada bloco que trate de um assunto ou documento, seja retraído com Accordion
3. Gerar documentação completa
   - 3.1. Após o mapeamento de toda documentação, criar a possibilidade de criar um arquivo .pdf completo com todos os arquivos
   - 3.2. Realizar o item 3.1. com a possibilidade do usuário selecionar quais tópicos ele quer exportar
4. Área para Organização dos documentos e criação de novos tópicos não pré definidos
   - 4.1. após o mapeamento de todos arquivos .md fazer uma lista
   - 4.2. Os arquivos que já estão mapeados, estarão direcionados ao lugar correto
   - 4.3. criar uma lista de arquivos que não deram match com nenhum tópico pré definido, e disponibilizar uma maneira de criar um espaço para cada arquivo na lista de visualização
5. Painel de navegação no documento 
   - 5.1. Ter um painel de navegação do próprio documento, que ficará ao Lado direito com o título "Nessa página"
   - 5.2. Os títulos que forem inseridos nessa página, aparecerão nesse painel para clicar e ir direto no título
   - 5.3. Ter uma navegação dinâmica, a medida que o scroll passar por um título novo, o painel "Nessa página" irá realçar o novo título também.
6. Painel geral no lado esquerdo
   - Ter um painel do lado esquerdo geral, que permita uma navegação rápida em todo escopo da empresa
   - Disponibilizar titulos como, "Design Document"(o projeto que estamos construindo), assim como "Sweggar - API", "Tutoriais", "IAAS", "Instalação", "Boas Práticas", e outro título que for viável inserir
7. Integração com interpretador de Markdown
   - 7.1. Tendo em vista o uso padrão de Markdown, implementar um interpretador
   - 7.2. Integrar um interpretador de mermaid que funciona junto com markdown, pois é padronizado o uso de mermaid Doc as a Code.
8. Integração com mais de um Repositório GIT.
   - 8.1. Considerando que um repositório GIT pode ser o Monolito, e outro Microsserviço.
   - 8.2. O projeto será capaz de relacionar mais de um repositório à documentação, escolhendo uma como a principal na lista e depois outra como microsserviço ou outra categoria pré definida, permitindo o mapeamento e disponibilização mais acertiva.
9. Mapeamento por categorias
   - 9.1. Para mapear todos arquivos será feito uma classificação por Prateleiras, Livros, Capítulos e Páginas, como uma Wiki.
   - 9.2. As prateleiras, serão os elementos do item 6. que aparecerão no painel do lado esquerdo. 
   - 9.3. Os livros, poderão ser elencados como subitem no painel 6 quando em muita quantidade, mas, ao clicar em um item com categoria Livro, como por exemplo o Design Document, ele irá aparecer no Painel do Lado direito, como disposto no item 5.
   - 9.4. Os capítulos serão os blocos de navegação mencionados no item 2.1. dentro deles poderão ser inseridos um ou mais arquivos Markdown.
   - 9.5. As páginas serão os próprios arquivos markdown que serão inseridos na página
   - 9.6. Ao relacionar os projetos principais, como definido no item 8., permitir uma área para definir qual categoria (prateleira, livro, capítulo ou pagina) está relacionado o projeto e os arquivos encontrados dentro do repositório, para o mapeamento acertivo
   - 9.2. Para atender ao que escreve o item 6., criar sempre uma Estante, e dentro dela associar se será um link diretamente, ou um livro que fará referência à rotina de pesquisar dentro do diretório Git informado para fazer o mapeamento dos arquivos.

**Exemplo:**
1. Importei esse projeto para dentro de um repositório e executei
   - Ele já possui o index.html para acessar já automático
   - Ao entrar no link toda estrutura já está organizada e já foi preenchida
   - Possível por que o projeto estava configurado no padrão da empresa:
   ```
   / (Raiz do Repositório)
   │
   ├── README.md <-- Resumo rápido para devs (Setup, Install)
   ├── CHANGELOG.md <-- Histórico de Versões
   ├── PROJECT_CHARTER.md <-- Definição macro do projeto
   │
   ├── src/ <-- Código Fonte da Aplicação
   │
   ├── docs/ <-- A "Bíblia" descentralizada
   │ ├── DESIGN_DOC_TEMPLATE.md <-- O Arquivo Mestre com as Tags {{...}}
   │ │
   │ ├── adr/ <-- Architecture Decision Records
   │ │ ├── 0001-escolha-banco-dados.md
   │ │ ├── 0002-uso-kafka.md
   │ │ └── template-adr.md
   │ │
   │ ├── rfc/ <-- Request for Comments (Mudanças propostas)
   │ │ └── rfc-001-nova-api.md
   │ │
   │ ├── guides/ <-- Manuais (Setup, Deploy, Testes)
   │ │ ├── setup-ambiente.md
   │ │ └── guia-deploy.md
   │ │
   │ └── diagrams/ <-- Código dos diagramas (Mermaid/PlantUML)
   │ ├── c1-contexto.mmd
   │ └── c2-containers.mmd
   │
   └── tools/
   └── doc-aggregator/ <-- O script que você vai criar (ou link para o binário)
   ```
   - Após se deparar com essa estrutura, o projeto já foi prenchido:
      - Inserindo dentro da página INFRAESTRUTURA os arquivos ADR 001 e 002
      - Inserindo dentro da página VISÃO GERAL o arquivo c1-contexto.md

2. Editar relacionamento dos arquivos
   - Ao abri as configurações, é possível visualizar que a estrutura "Prateleira", "Livro", "Capítulo", "Página" já foi criada automáticamente para cada arquivo.
   - Nesse momento é possível reordenar ou acrescentar novo relacionamento, com links de novos projetos, ou links de páginas, etc.
   

**Integrações**:
- Interpretador Markdown
- Interpretador de Mermaid

**Entregas**:
- MVP para visualização
- Versão simplificada - Apenas reune .md
- Versão Completa - Todos requisitos
- Documentação técnica completa
- Treinamento de usuários
- Migração de documentação legados

### 4.2 Fora do Escopo (Out of Scope)

**Explicitamente NÃO incluído**:
- Repositório git - apenas integração aos projetos
- Módulo de inteligência artificial para identificações automáticas

---

## 5. Stakeholders

### 5.1 Matriz RACI

| Atividade/Decisão | Sponsor | GP | Tech Lead | PO | Time Dev | Usuários | TI Infra |
|-------------------|---------|----|-----------|----|----------|----------|----------|
| Aprovação de Escopo | A | R | C | C | I | C | I |
| Decisões Técnicas | I | C | A/R | C | C | I | C |
| Aprovação de Releases | A | C | C | R | C | I | C |
| Definição de Requisitos | C | C | C | A/R | I | C | I |
| Deploy em Produção | C | C | R | C | C | I | A/R |

**Legenda**: R = Responsible, A = Accountable, C = Consulted, I = Informed

### 5.2 Comitê de Steering

| Nome | Cargo | Papel no Projeto | Email | Telefone |
|------|-------|------------------|-------|----------|
| Vinícius G. C. Tasso | CEO | Proprietário | viniciustasso@live.com | 011 |

### 5.3 Stakeholders Chave

**Internos**:
- **Heitor Tasso/CEO Sotahtech**: Uso imediato

**Externos**:
- **Bombeiro SP**: Análise de Integração

---

## 6. Premissas e Restrições

### 6.1 Premissas (Assumptions)

1. Equipe de desenvolvimento terá 1 pessoas disponibilidade variada
2. Infraestrutura no Git Hub

### 6.2 Restrições (Constraints)

**Restrições de Tempo**:
- Menos de 30 minutos de desenvolvimento por dia

**Restrições Tecnológicas**:
- Ser simples
- Estar a menos de 3 cliques do programador

**Restrições Regulatórias/Legais**:
- Estar de acordo com normas de documentações
- Não publicar dados sensíveis do projeto em internet

### 6.3 Dependências

Da manutenção da equipe de desenvolvimento

---

## 7. Riscos Iniciais

| ID | Risco | Probabilidade | Impacto | Severidade | Mitigação | Contingência |
|----|-------|---------------|---------|------------|-----------|--------------|
| R-001 | Resistencia da equipe | Alta | Alto | 8 | Criar motivação do uso com template pronto e visual | Criar padronização mais simplificada |
| R-002 | Não centralização | Média | Alto | 5 | Criar plano de desenvolvimento de documentação para evitar multiplas fontes de documentação de confiança | Diminuir quantidade de arquivos para manutenção |

---

## 9. Cronograma Macro

### 9.1 Fases e Milestones

| Fase | Início | Término | Duração | Milestone/Entrega |
|------|--------|---------|---------|-------------------|
| Iniciação | 2025-11-19 | 2025-11-25 | 1 semanas | Charter Aprovado |
| Planejamento | 2025-11-19 | [YYYY-MM-DD] | [X semanas] | Backlog Priorizado |
| Execução - Sprint 1-3 | 2025-11-19 | 2025-12-26 | [X semanas] | MVP Funcional |

### 9.2 Entregas Principais

- **2025-11-26**: Entrega do MVP
- **2026-01-15**: Entrega de um modelo funcional para teste

---

## 10. Critérios de Sucesso

### 10.1 Critérios de Aceitação do Projeto

O projeto será considerado bem-sucedido se:

1. **Funcionalidade**: Todas as funcionalidades do escopo implementadas e homologadas
2. **Qualidade**: 
   - Cobertura de testes > 80%
   - Zero bugs críticos em produção nos primeiros 30 dias
3. **Adoção**: 
   - 95% dos usuários treinados
   - 70% de adoção nos primeiros 60 dias
4. **Prazo**: 
   - Entrega até 2026-02-28 ou com atraso máximo de 20 dias

### 10.2 Critérios de Transição para Operação

- [ ] Documentação técnica completa e aprovada
- [ ] Runbooks de operação criados e validados
- [ ] Equipe de suporte treinada
- [ ] Monitoramento e alertas configurados
- [ ] Plano de rollback testado
- [ ] Acordo de Nível de Serviço (SLA) definido
- [ ] Transferência de conhecimento concluída

---

## 12. Gestão de Mudanças

### 12.1 Processo de Change Request

Qualquer mudança de escopo, prazo ou budget deve seguir:

1. Solicitação formal via [ferramenta/template]
2. Análise de impacto (escopo, prazo, custo, risco)
3. Apresentação ao Steering Committee
4. Aprovação/rejeição documentada
5. Atualização do Project Charter e documentos relacionados

### 12.2 Autoridades de Aprovação

| Tipo de Mudança | Valor/Impacto | Aprovador |
|-----------------|---------------|-----------|
| Mudança de requisito funcional | Baixo impacto | Product Owner |
| Mudança de requisito funcional | Médio impacto | PO + Tech Lead |
| Mudança de requisito funcional | Alto impacto | Steering Committee |
| Mudança de prazo | < 1 semana | GP |
| Mudança de prazo | > 1 semana | Sponsor |
| Mudança de budget | < 10% | GP |
| Mudança de budget | > 10% | Sponsor + CFO |

---

## 13. Aprovações

### 13.1 Assinaturas

| Nome | Cargo | Assinatura | Data |
|------|-------|------------|------|
| Vinicius Tasso | Gerente de Projeto | _________________ | 2025-11-20 |

### 13.2 Histórico de Revisões

| Versão | Data | Autor | Mudanças |
|--------|------|-------|----------|
| 0.1 | 2025-11-26 | Vinicius Tasso | Versão inicial - Rascunho |

---

## 14. Documentos Relacionados

- **Business Case**: [Link para documento]
- **Product Roadmap**: [Link para documento]
- **Architecture Vision**: [Link para documento]
- **Product Requirements Document (PRD)**: [Link para documento]
- **Risk Register Detalhado**: [Link para documento]
- **Jira Project**: [Link para board]
- **Confluence Space**: [Link para espaço]
- **GitHub Repository**: [Link para repositório]

---

**Elaborado por**: Vinícius G. C. Tasso
**Data de Elaboração**: 2025-11-26
**Próxima Revisão**: 2025-12-26