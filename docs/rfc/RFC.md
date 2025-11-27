# Template Collection: RFC, README, CHANGELOG, CONTRIBUTING

---

## 1. RFC (Request for Comments) Template

**Arquivo**: `/docs/rfcs/RFC-[NNN]-[titulo-kebab-case].md`

```markdown
# RFC-[NNN]: [Título da Proposta]

**Autor**: [Nome do Autor]  
**Data**: [YYYY-MM-DD]  
**Status**: Em Discussão | Aceito | Rejeitado | Implementado | Substituído  
**Shepherd**: [Nome do ARB Member responsável]  
**Discussão**: [Link para thread no Slack/GitHub Discussion]

---

## Sumário Executivo

[Resumo de 2-3 parágrafos explicando a proposta em linguagem simples]

**Exemplo:**
Esta RFC propõe a migração do nosso sistema de autenticação de sessões baseadas em cookies para tokens JWT (JSON Web Tokens). A mudança visa melhorar escalabilidade, permitir autenticação stateless e facilitar integração com aplicativos mobile.

Impacto estimado: 8 semanas de implementação, afeta 15 projetos ativos, requer migração de usuários existentes. Benefícios esperados incluem redução de 40% em queries ao banco de dados de sessões e suporte nativo para mobile apps.

---

## Motivação

### Problema Atual
[Descrever o problema ou limitação que motiva a RFC]

**Exemplo:**
Nosso sistema atual de autenticação baseado em sessões apresenta limitações:
- Sessões armazenadas no PostgreSQL causam bottleneck (10k queries/min)
- Escalabilidade horizontal limitada (sticky sessions necessárias)
- Aplicativos mobile precisam workarounds complexos
- Timeout de sessão rígido dificulta UX em mobile

### Por Que Agora?
[Por que esta mudança é necessária agora, não depois]

**Exemplo:**
- Lançamento de app mobile previsto para Q2 2025
- Carga atual já causa degradação de performance em horários de pico
- 3 novos projetos planejados precisarão de autenticação stateless

---

## Proposta Detalhada

### Visão Geral
[Descrição alto nível da solução proposta]

### Arquitetura Proposta
[Diagrama e descrição da arquitetura]

```
┌──────────────────────────────────────────────┐
│           Client (Web/Mobile)                │
└──────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────┐
│         API Gateway / Load Balancer          │
│         (JWT Validation Middleware)          │
└──────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
┌──────────────┐        ┌──────────────┐
│  Auth Service│        │ Other Services│
│              │        │              │
│ - Login      │        │ (stateless)  │
│ - Refresh    │        │              │
│ - Logout     │        │              │
└──────────────┘        └──────────────┘
```

### Componentes Afetados
[Lista de sistemas/projetos que serão impactados]

**Exemplo:**
- ✅ **Alta Prioridade** (requerem mudança obrigatória):
  - Auth Service (core)
  - API Gateway
  - E-commerce Platform
  - Admin Dashboard
  
- ⚠️ **Média Prioridade** (podem migrar gradualmente):
  - Internal Tools (5 projetos)
  - Legacy CRM
  
- ℹ️ **Baixa Prioridade** (migração opcional):
  - Read-only dashboards
  - Internal analytics

### Mudanças Necessárias
[Detalhamento técnico das mudanças]

**Backend**:
- Implementar geração e validação de JWT
- Criar endpoint de refresh token
- Migrar middleware de autenticação
- Implementar blacklist de tokens revogados (Redis)

**Frontend**:
- Atualizar bibliotecas de autenticação
- Implementar armazenamento seguro de tokens
- Adicionar lógica de refresh automático

**Infraestrutura**:
- Setup de Redis cluster para blacklist
- Configurar rotação de signing keys
- Atualizar WAF rules

### Plano de Implementação

**Fase 1 - Preparação (Semana 1-2)**:
- [ ] Implementar Auth Service com suporte JWT
- [ ] Setup Redis para token blacklist
- [ ] Testes unitários e de integração

**Fase 2 - Dual Mode (Semana 3-4)**:
- [ ] Sistema suporta AMBOS: cookies e JWT
- [ ] Novos logins recebem JWT
- [ ] Sessões antigas continuam funcionando

**Fase 3 - Migração (Semana 5-6)**:
- [ ] Migrar projetos prioritários para JWT
- [ ] Comunicar usuários sobre possível re-login
- [ ] Monitoramento intensivo

**Fase 4 - Sunset (Semana 7-8)**:
- [ ] Desativar suporte a cookies
- [ ] Cleanup de código legado
- [ ] Documentação final

---

## Alternativas Consideradas

### Alternativa 1: [Nome]
**Descrição**: [Breve descrição]  
**Por que NÃO**: [Razões para rejeição]

**Exemplo:**

### Alternativa 1: OAuth2 com Authorization Server Dedicado
**Descrição**: Implementar OAuth2 completo com Keycloak/Auth0  
**Por que NÃO**: 
- Overkill para nossas necessidades atuais
- Custo adicional significativo (Auth0: $13k/ano)
- Maior complexidade operacional
- Lock-in com vendor (Auth0)

### Alternativa 2: Manter Sistema Atual com Otimizações
**Descrição**: Otimizar queries, adicionar cache de sessões  
**Por que NÃO**:
- Não resolve limitação fundamental de state
- Não habilita mobile apps adequadamente
- Apenas "kick the can down the road"

---

## Impacto e Riscos

### Impacto Positivo
- ✅ [Benefício 1]
- ✅ [Benefício 2]

**Exemplo:**
- ✅ Redução de 40% em queries ao banco (de 10k para 6k/min)
- ✅ Suporte nativo para mobile sem workarounds
- ✅ Melhor escalabilidade (stateless)
- ✅ Tempo de resposta 20% mais rápido (elimina query de sessão)

### Impacto Negativo / Trade-offs
- ❌ [Trade-off 1]
- ❌ [Trade-off 2]

**Exemplo:**
- ❌ Não é possível invalidar todos tokens de um usuário instantaneamente (precisa esperar expirar ou usar blacklist)
- ❌ Tokens são maiores que session IDs (2KB vs 32 bytes)
- ❌ Complexidade adicional de gerenciar refresh tokens

### Riscos Identificados

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| [Risco] | Alta/Média/Baixa | Alto/Médio/Baixo | [Como mitigar] |

**Exemplo:**
| Tokens roubados não podem ser revogados imediatamente | Média | Alto | TTL curto (15min), refresh tokens, blacklist |
| Bugs na validação causam vulnerabilidades | Baixa | Crítico | Security audit, testes exaustivos, biblioteca battle-tested |
| Usuários forçados a re-login causam insatisfação | Alta | Médio | Comunicação prévia, migração gradual |

---

## Estimativa de Custo e Esforço

### Esforço de Desenvolvimento
- **Total**: [X] story points / [Y] pessoa-semanas
- **Equipe**: [Número] desenvolvedores
- **Timeline**: [X] semanas

**Exemplo:**
- **Total**: 55 story points / 8 pessoa-semanas
- **Equipe**: 3 desenvolvedores full-time
- **Timeline**: 8 semanas

### Custo de Infraestrutura
- **Adicional**: R$ [valor/mês]
- **Economia projetada**: R$ [valor/mês]

**Exemplo:**
- **Redis cluster**: +R$ 800/mês
- **Economia em DB**: -R$ 1200/mês (menor carga)
- **Líquido**: -R$ 400/mês (economia)

### Dívida Técnica
[Tech debt que será criado ou resolvido]

**Exemplo:**
- ✅ Resolve tech debt: Sessões em PostgreSQL (3 anos)
- ❌ Cria tech debt: Blacklist em Redis não é solução definitiva
- 🔄 Compromisso: Reavaliar em 12 meses para OAuth2 completo

---

## Métricas de Sucesso

### KPIs Técnicos
| Métrica | Baseline | Meta | Como Medir |
|---------|----------|------|------------|
| [Métrica] | [Atual] | [Alvo] | [Ferramenta] |

**Exemplo:**
| Queries de autenticação/min | 10k | 6k | Datadog APM |
| Latência de autenticação (p95) | 150ms | 100ms | Prometheus |
| Uptime Auth Service | 99.5% | 99.9% | Pingdom |
| Taxa de erro de autenticação | 0.5% | <0.2% | Sentry |

### Critérios de Aceitação
- [ ] [Critério 1]
- [ ] [Critério 2]

**Exemplo:**
- [ ] Sistema mantém 99.9% uptime durante migração
- [ ] < 5% de usuários reportam problemas de login
- [ ] Queries ao banco reduzidas em mínimo 30%
- [ ] Mobile app autentica com sucesso em staging

---

## Questões em Aberto

[Questões que precisam ser resolvidas antes de aprovação]

1. **[Questão 1]**: [Descrição] - Responsável: [Nome]
2. **[Questão 2]**: [Descrição] - Responsável: [Nome]

**Exemplo:**
1. **TTL de access tokens**: 15min ou 1h? Impacto em UX vs segurança - Responsável: Security Team
2. **Estratégia de rotação de signing keys**: Manual ou automática? - Responsável: DevOps
3. **Como lidar com sessões ativas durante migração?**: Forçar logout ou manter dual mode por quanto tempo? - Responsável: Product

---

## Próximos Passos

1. [Ação 1] - Responsável: [Nome] - Prazo: [Data]
2. [Ação 2] - Responsável: [Nome] - Prazo: [Data]

**Exemplo:**
1. Resolver questões em aberto - ARB - Prazo: 2025-02-01
2. Realizar PoC de JWT em projeto piloto - João Silva - Prazo: 2025-02-10
3. Apresentar PoC para equipe técnica - João Silva - Prazo: 2025-02-15
4. Votação final no ARB - ARB - Prazo: 2025-02-20

---

## Discussão e Feedback

[Esta seção é preenchida com comentários durante período de RFC]

### Comentários
- **[Nome]** ([Data]): [Comentário]
- **[Nome]** ([Data]): [Comentário]

### Decisão do ARB
**Data da Decisão**: [YYYY-MM-DD]  
**Decisão**: Aprovado | Rejeitado | Precisa Revisão  
**Votação**: [X] a favor, [Y] contra, [Z] abstenções  
**Justificativa**: [Explicação da decisão]

**Se aprovado**:
- [ ] Criar ADR formal documentando decisão
- [ ] Criar épico e user stories no Jira
- [ ] Alocar recursos e definir timeline
- [ ] Comunicar decisão para stakeholders

**Se rejeitado**:
- Razão: [Por que foi rejeitado]
- Próximos passos: [O que fazer agora]

---

**Elaborado por**: [Nome do Autor]  
**Data de Elaboração**: [YYYY-MM-DD]  
**Período de Comentários**: [Data Início] até [Data Fim]  
**Shepherd**: [Nome do ARB Member]
```

---

## 2. README.md Template

**Arquivo**: `/README.md` (raiz do repositório)

```markdown
# [Nome do Projeto]

[![Build Status](https://img.shields.io/github/actions/workflow/status/sotahtech/project/ci.yml?branch=main)](link)
[![Coverage](https://img.shields.io/codecov/c/github/sotahtech/project)](link)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/github/v/release/sotahtech/project)](link)

[Breve descrição do projeto em 1-2 frases. Deve responder: O QUE é e PARA QUE serve]

**Exemplo:**
Sistema de gerenciamento de pedidos que automatiza o fluxo completo desde criação até entrega, com integração nativa a múltiplos gateways de pagamento e sistemas de logística.

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades Principais](#funcionalidades-principais)
- [Demo](#demo)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Uso](#uso)
- [Arquitetura](#arquitetura)
- [Testes](#testes)
- [Deploy](#deploy)
- [Documentação](#documentação)
- [Contribuindo](#contribuindo)
- [Time](#time)
- [Licença](#licença)

---

## 🎯 Sobre o Projeto

[Descrição mais detalhada do projeto, contexto, problema que resolve]

**Exemplo:**
O Sistema de Gerenciamento de Pedidos foi desenvolvido para resolver a ineficiência do processo manual que causava:
- 48 horas de tempo médio de processamento
- 12% de taxa de erro
- Baixa satisfação do cliente (NPS 45)

### Objetivos
- Reduzir tempo de processamento para menos de 4 horas
- Diminuir taxa de erro para abaixo de 2%
- Aumentar NPS para acima de 70
- Processar 500+ pedidos/dia com alta disponibilidade

### Status do Projeto
- **Versão Atual**: [v2.3.0]
- **Ambiente de Produção**: [https://orders.sotahtech.com]
- **Status**: ✅ Ativo | 🚧 Em Desenvolvimento | ⚠️ Manutenção | 🔴 Descontinuado

---

## ✨ Funcionalidades Principais

- ✅ [Funcionalidade 1]
- ✅ [Funcionalidade 2]
- ✅ [Funcionalidade 3]
- 🚧 [Funcionalidade em desenvolvimento]
- 📅 [Funcionalidade planejada para próxima release]

**Exemplo:**
- ✅ Criação e gerenciamento de pedidos
- ✅ Integração com múltiplos gateways (Stripe, PayPal, PagSeguro)
- ✅ Rastreamento em tempo real
- ✅ Notificações automáticas (email, SMS, push)
- ✅ Dashboard administrativo completo
- 🚧 Integração com WhatsApp Business API
- 📅 Sistema de recomendações com ML (Q2 2025)

---

## 🎬 Demo

[Screenshots, GIFs ou vídeo demonstrativo]

### Screenshot
![Dashboard](docs/images/dashboard-screenshot.png)

### Video Demo
[Assista ao vídeo de demonstração](https://www.youtube.com/watch?v=xxxxx)

### Ambientes Disponíveis
- **Produção**: [https://orders.sotahtech.com](https://orders.sotahtech.com)
- **Staging**: [https://staging.orders.sotahtech.com](https://staging.orders.sotahtech.com)
- **Demo**: [https://demo.orders.sotahtech.com](https://demo.orders.sotahtech.com)
  - Usuário: `demo@sotahtech.com`
  - Senha: `demo123` *(requerido)

---

## 🛠️ Tecnologias

### Backend
- **Linguagem**: [Node.js 20 LTS](https://nodejs.org/) + TypeScript
- **Framework**: [Express 4.18](https://expressjs.com/)
- **Banco de Dados**: [PostgreSQL 15](https://www.postgresql.org/)
- **Cache**: [Redis 7](https://redis.io/)
- **Message Queue**: [Kafka 3.5](https://kafka.apache.org/)

### Frontend
- **Framework**: [React 18](https://react.dev/) + TypeScript
- **Estilização**: [Tailwind CSS 3](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)

### DevOps
- **Cloud**: AWS (ECS, RDS, ElastiCache, MSK)
- **CI/CD**: GitHub Actions
- **Monitoring**: Datadog, Sentry
- **Container**: Docker

---

## 📦 Pré-requisitos

Antes de começar, você precisará ter instalado:

- [Node.js](https://nodejs.org/) versão 20.x ou superior
- [Docker](https://www.docker.com/) versão 24.x ou superior
- [Docker Compose](https://docs.docker.com/compose/) versão 2.x
- [PostgreSQL](https://www.postgresql.org/) 15.x (ou usar via Docker)
- [Git](https://git-scm.com/)

### Verificar Instalações
```bash
node --version  # Deve ser v20.x.x
npm --version   # Deve ser 9.x.x ou superior
docker --version # Deve ser 24.x.x ou superior
```

---

## 🚀 Instalação

### 1. Clone o Repositório
```bash
git clone https://github.com/sotahtech/project-name.git
cd project-name
```

### 2. Instale as Dependências
```bash
npm install
```

### 3. Configure Variáveis de Ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Redis
REDIS_URL=redis://localhost:6379

# Application
PORT=3000
NODE_ENV=development

# External APIs
STRIPE_SECRET_KEY=sk_test_xxxxx
SENDGRID_API_KEY=SG.xxxxx
```

### 4. Setup do Banco de Dados
```bash
# Criar banco via Docker
docker-compose up -d postgres

# Executar migrations
npm run migrate

# Seed com dados de teste (opcional)
npm run seed
```

### 5. Inicie o Servidor
```bash
# Modo desenvolvimento com hot-reload
npm run dev

# Aplicação estará rodando em http://localhost:3000
```

---

## 💻 Uso

### Desenvolvimento Local
```bash
# Iniciar todos os serviços (backend + frontend + database)
docker-compose up

# Ou iniciar cada serviço separadamente
npm run dev:backend  # Backend em localhost:3000
npm run dev:frontend # Frontend em localhost:3001
```

### Comandos Disponíveis
```bash
npm run dev         # Inicia servidor de desenvolvimento
npm run build       # Build para produção
npm run start       # Inicia servidor de produção
npm run test        # Executa testes
npm run test:watch  # Testes em modo watch
npm run test:cov    # Relatório de cobertura
npm run lint        # Verifica padrões de código
npm run lint:fix    # Corrige problemas automaticamente
npm run format      # Formata código com Prettier
npm run migrate     # Executa migrations
npm run seed        # Popula banco com dados de teste
```

### Exemplo de Uso da API
```bash
# Criar um novo pedido
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "customerId": "uuid",
    "items": [
      {
        "productId": "prod_123",
        "quantity": 2,
        "price": 99.90
      }
    ]
  }'
```

**Resposta**:
```json
{
  "orderId": "ord_abc123",
  "status": "pending",
  "total": 199.80,
  "createdAt": "2025-01-25T10:00:00Z"
}
```

---

## 🏗️ Arquitetura

### Visão Geral
[Diagrama de arquitetura simplificado]

```
┌─────────────────────────────────────────┐
│          Client (Web/Mobile)            │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│          API Gateway (AWS)              │
└─────────────────────────────────────────┘
                  │
      ┌───────────┴───────────┐
      ▼                       ▼
┌──────────────┐      ┌──────────────┐
│ Order Service│      │ Payment Svc  │
└──────────────┘      └──────────────┘
      │                       │
      └───────────┬───────────┘
                  ▼
┌─────────────────────────────────────────┐
│         PostgreSQL + Redis              │
└─────────────────────────────────────────┘
```

### Estrutura de Pastas
```
project-name/
├── src/
│   ├── controllers/     # Camada de apresentação (HTTP handlers)
│   ├── services/        # Lógica de negócio
│   ├── repositories/    # Acesso a dados
│   ├── models/          # Entidades e DTOs
│   ├── middlewares/     # Express middlewares
│   ├── utils/           # Funções utilitárias
│   ├── config/          # Configurações
│   └── types/           # TypeScript types/interfaces
├── tests/
│   ├── unit/            # Testes unitários
│   ├── integration/     # Testes de integração
│   └── e2e/             # Testes end-to-end
├── docs/                # Documentação adicional
│   ├── architecture/    # ADRs, C4 diagrams
│   ├── api/             # OpenAPI specs
│   └── guides/          # Guias de uso
├── scripts/             # Scripts de automação
├── migrations/          # Database migrations
└── docker/              # Dockerfiles e compose
```

### Documentação Técnica Completa
Para detalhes completos da arquitetura, consulte:
- [Architecture Vision](/docs/architecture/vision.md)
- [C4 Diagrams](/docs/architecture/c4/)
- [ADRs](/docs/architecture/decisions/)
- [API Documentation](/docs/api/)

---

## 🧪 Testes

### Executar Todos os Testes
```bash
npm test
```

### Testes por Tipo
```bash
npm run test:unit        # Apenas testes unitários
npm run test:integration # Apenas testes de integração
npm run test:e2e         # Apenas testes E2E
```

### Cobertura de Código
```bash
npm run test:cov

# Abrir relatório HTML
open coverage/index.html
```

### Cobertura Atual
- **Statements**: 85%
- **Branches**: 82%
- **Functions**: 88%
- **Lines**: 85%

**Meta**: Manter cobertura acima de 80% para todos os indicadores

---

## 🚢 Deploy

### Deploy Manual

#### Staging
```bash
npm run deploy:staging
```

#### Produção
```bash
npm run deploy:prod
```

### CI/CD Automático
O projeto utiliza GitHub Actions para CI/CD:

- **Pull Requests**: Executa testes e linting
- **Merge para `main`**: Deploy automático para staging
- **Tags (vX.X.X)**: Deploy automático para produção

### Rollback
Em caso de problemas:
```bash
# Reverter para versão anterior
./scripts/rollback.sh v2.2.0
```

### Health Check
Após deploy, verifique a saúde da aplicação:
```bash
curl https://api.orders.sotahtech.com/health

# Resposta esperada
{
  "status": "healthy",
  "version": "2.3.0",
  "uptime": 3600,
  "database": "connected",
  "cache": "connected"
}
```

---

## 📚 Documentação

### Documentação Disponível
- [**Architecture Decision Records (ADRs)**](/docs/architecture/decisions/) - Decisões arquiteturais importantes
- [**Design Docs**](/docs/design/) - Documentos de design técnico
- [**API Documentation**](/docs/api/openapi.yaml) - Especificação OpenAPI completa
- [**Runbooks**](/docs/operations/) - Guias operacionais
- [**User Guide**](/docs/user-guide.md) - Manual do usuário
- [**CHANGELOG**](/CHANGELOG.md) - Histórico de mudanças

### API Documentation (Swagger)
Acesse a documentação interativa da API:
- **Local**: http://localhost:3000/api-docs
- **Staging**: https://staging.orders.sotahtech.com/api-docs
- **Produção**: https://orders.sotahtech.com/api-docs

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, leia nosso [Guia de Contribuição](CONTRIBUTING.md) para detalhes sobre:
- Código de conduta
- Processo de submissão de pull requests
- Padrões de código
- Como reportar bugs

### Quick Start para Contribuidores
1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 👥 Time

### Core Team
- **Tech Lead**: [João Silva](https://github.com/joaosilva) - [@joaosilva](https://github.com/joaosilva)
- **Product Owner**: [Maria Costa](https://github.com/mariacosta)
- **Arquiteto**: [Pedro Santos](https://github.com/pedrosantos)

### Desenvolvedores
- [Ana Lima](https://github.com/analima)
- [Carlos Mendes](https://github.com/carlosmendes)
- [Juliana Oliveira](https://github.com/julianaoliveira)

### Contato
- **Email**: dev@sotahtech.com
- **Slack**: #projeto-orders
- **Jira**: [Quadro do Projeto](https://jira.sotahtech.com/projects/ORD)

---

## 🔗 Links Úteis

- [Jira Board](https://jira.sotahtech.com/projects/ORD)
- [Confluence Space](https://confluence.sotahtech.com/projects/orders)
- [Figma Designs](https://figma.com/file/xxxxx)
- [Production Dashboard](https://grafana.sotahtech.com/orders)
- [Status Page](https://status.sotahtech.com)

---

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE). Veja o arquivo `LICENSE` para mais detalhes.

---

## 🙏 Agradecimentos

- [Biblioteca X](link) pela excelente ferramenta
- [Tutorial Y](link) que inspirou a arquitetura
- Todos os [contribuidores](https://github.com/sotahtech/project/contributors)

---

**Desenvolvido com ❤️ pela [SoTahTech](https://sotahtech.com)**

**Última atualização**: [YYYY-MM-DD]
```

---

## 3. CHANGELOG.md Template

**Arquivo**: `/CHANGELOG.md`

```markdown
# Changelog

Todas as mudanças notáveis neste projeto serão documentadas aqui.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Added
- [PROJ-XXX] [Descrição curta] (@autor, YYYY-MM-DD)

### Changed
- [PROJ-XXX] [Descrição curta] (@autor, YYYY-MM-DD)

### Fixed
- [PROJ-XXX] [Descrição curta] (@autor, YYYY-MM-DD)

---

## [2.3.0] - 2025-01-25

### Added
- [ORD-150] Integração com PagSeguro para pagamentos via PIX (@joaosilva, 2025-01-25)
  - Suporte para QR Code dinâmico
  - Webhook de confirmação de pagamento
  - **Impacto**: Novos endpoints `/api/v1/payments/pagseguro/*`
  - **Docs**: [DD-008](/docs/design/DD-008-pagseguro-integration.md)
- [ORD-155] Dashboard de métricas em tempo real (@mariacosta, 2025-01-23)
  - Visualização de pedidos por status
  - Gráficos de conversão
  - **Acesso**: `/admin/dashboard`
- [ORD-160] Notificações push para mobile app (@analima, 2025-01-20)
  - Integração com Firebase Cloud Messaging
  - Notificações de status de pedido

### Changed
- [ORD-145] Refatoração do módulo de autenticação (@pedrosantos, 2025-01-18)
  - Migração de sessões para JWT
  - Melhoria de performance (redução de 40% em queries)
  - **Breaking**: Clientes precisam atualizar headers de autenticação
  - **Migration Guide**: [docs/migrations/v2.2-to-v2.3.md]
- [ORD-152] Atualização do PostgreSQL 13 → 15 (@carlosmendes, 2025-01-22)
  - Melhoria de performance em queries complexas
  - **Rollback**: Script disponível em `/scripts/rollback-pg15.sh`
  - **ADR**: [ADR-012](/docs/architecture/decisions/ADR-012-postgres-15.md)

### Fixed
- [ORD-148] Correção de memory leak em conexões Redis (@pedrosantos, 2025-01-24)
  - Conexões não estavam sendo liberadas corretamente
  - **Impacto**: Redução de 60% no uso de memória
- [ORD-156] Correção de timezone em relatórios de vendas (@julianaoliveira, 2025-01-21)
  - Relatórios agora respeitam timezone do usuário
  - **Afetava**: Relatórios gerados antes das 03:00 UTC

### Deprecated
- [ORD-140] Endpoints `/api/v1/old-payments/*` serão removidos em v3.0.0
  - **Substituídos por**: `/api/v2/payments/*`
  - **Timeline**: Remoção prevista para 2025-06-01
  - **Migration Guide**: [docs/migrations/payments-v1-to-v2.md]

### Security
- [SEC-008] Atualização de dependências com vulnerabilidades críticas
  - express: 4.17.1 → 4.18.2 (CVE-2024-XXXXX)
  - jsonwebtoken: 8.5.1 → 9.0.2 (CVE-2024-YYYYY)
  - **Severity**: Critical
  - **CVSS Score**: 9.8

---

## [2.2.0] - 2024-12-15

### Added
- [ORD-120] Sistema de cupons de desconto (@mariacosta, 2024-12-15)
- [ORD-125] Exportação de relatórios em Excel (@julianaoliveira, 2024-12-12)
- [ORD-130] Integração com Stripe para pagamentos recorrentes (@joaosilva, 2024-12-10)

### Changed
- [ORD-118] Otimização de queries de busca (melhoria de 3x) (@pedrosantos, 2024-12-14)
- [ORD-122] Interface do painel administrativo redesenhada (@analima, 2024-12-11)

### Fixed
- [ORD-128] Correção de cálculo de frete para CEPs remotos (@carlosmendes, 2024-12-13)
- [ORD-132] Timeout em envio de emails durante picos de tráfego (@joaosilva, 2024-12-09)

---

## [2.1.0] - 2024-11-20

### Added
- [ORD-100] Rastreamento de pedidos em tempo real (@joaosilva, 2024-11-20)
  - Integração com Correios API
  - Atualização automática a cada 30 minutos
- [ORD-105] Notificações por SMS via Twilio (@analima, 2024-11-18)

### Changed
- [ORD-95] Migração de sessões para Redis (anteriormente em PostgreSQL) (@pedrosantos, 2024-11-19)
  - **Impacto**: Redução de 50% em latência de login
  - **ADR**: [ADR-008](/docs/architecture/decisions/ADR-008-redis-sessions.md)

### Fixed
- [ORD-110] Correção de race condition em processamento concorrente de pedidos (@carlosmendes, 2024-11-17)
- [ORD-112] Correção de validação de CPF/CNPJ (@julianaoliveira, 2024-11-16)

---

## [2.0.0] - 2024-10-01

### 🚨 Breaking Changes
- [ORD-80] Remoção de autenticação básica, apenas OAuth2 suportado
  - **Migration**: [docs/migrations/oauth2-migration.md]
  - **Deadline**: Clientes devem migrar até 2024-12-31
- [ORD-85] Alteração de estrutura de resposta da API de pedidos
  - **Antes**: `{ order: {...} }`
  - **Depois**: `{ data: {...}, meta: {...} }`
  - **Impacto**: Todos os clientes da API

### Added
- [ORD-70] Autenticação OAuth2 com Google e Facebook (@pedrosantos, 2024-10-01)
- [ORD-75] API pública para integrações de terceiros (@joaosilva, 2024-09-28)
- [ORD-78] Webhooks para eventos de pedido (@analima, 2024-09-25)

### Changed
- [ORD-82] Nova estrutura de banco de dados (normalização) (@carlosmendes, 2024-09-30)
  - **Migração automática**: Executada durante deploy
  - **Rollback**: Disponível em `/scripts/rollback-v2.sh`

### Removed
- [ORD-88] Remoção de suporte a Internet Explorer 11
- [ORD-90] Remoção de API v0.x (deprecated desde v1.5)

---

## [1.5.0] - 2024-08-15
[Entradas anteriores...]

---

## [1.0.0] - 2024-01-15

### Added
- [ORD-001] Release inicial do sistema
- [ORD-002] CRUD completo de pedidos
- [ORD-003] Integração com Stripe
- [ORD-005] Dashboard administrativo básico

---

## Convenções de Changelog

### Categorias
- **Added**: Novas funcionalidades
- **Changed**: Mudanças em funcionalidades existentes
- **Deprecated**: Funcionalidades que serão removidas em versões futuras
- **Removed**: Funcionalidades removidas
- **Fixed**: Correções de bugs
- **Security**: Correções de segurança

### Formato de Entrada
```
[TICKET-ID] Descrição curta (@autor, YYYY-MM-DD)
  - Detalhes adicionais (opcional)
  - **Impacto**: Descrição de impacto (se relevante)
  - **Docs**: Link para documentação (se relevante)
```

### Versionamento Semântico
- **MAJOR** (X.0.0): Breaking changes
- **MINOR** (x.Y.0): Novas funcionalidades (backward compatible)
- **PATCH** (x.y.Z): Bug fixes (backward compatible)

---

[Unreleased]: https://github.com/sotahtech/project/compare/v2.3.0...HEAD
[2.3.0]: https://github.com/sotahtech/project/compare/v2.2.0...v2.3.0
[2.2.0]: https://github.com/sotahtech/project/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/sotahtech/project/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/sotahtech/project/compare/v1.5.0...v2.0.0
[1.5.0]: https://github.com/sotahtech/project/compare/v1.0.0...v1.5.0
[1.0.0]: https://github.com/sotahtech/project/releases/tag/v1.0.0
```

---

## 4. CONTRIBUTING.md Template

**Arquivo**: `/CONTRIBUTING.md`

```markdown
# Guia de Contribuição

Obrigado por considerar contribuir para [Nome do Projeto]! 🎉

Este documento fornece diretrizes para contribuir com o projeto. Seguir estas diretrizes ajuda a comunicar que você respeita o tempo dos desenvolvedores que gerenciam e desenvolvem este projeto.

---

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Posso Contribuir?](#como-posso-contribuir)
- [Processo de Pull Request](#processo-de-pull-request)
- [Padrões de Código](#padrões-de-código)
- [Padrões de Commit](#padrões-de-commit)
- [Reportando Bugs](#reportando-bugs)
- [Sugerindo Melhorias](#sugerindo-melhorias)
- [Primeiros Passos](#primeiros-passos)
- [Dúvidas](#dúvidas)

---

## 📜 Código de Conduta

Este projeto adota o [Código de Conduta do Contributor Covenant](CODE_OF_CONDUCT.md). Ao participar, você concorda em seguir este código. Por favor, reporte comportamentos inaceitáveis para [conduct@sotahtech.com].

**Em resumo**:
- Seja respeitoso e inclusivo
- Aceite críticas construtivas
- Foque no que é melhor para a comunidade
- Mostre empatia com outros membros

---

## 🤝 Como Posso Contribuir?

### 1. Reportar Bugs
Encontrou um bug? Ajude-nos a melhorar!
- Verifique se o bug já não foi reportado em [Issues](https://github.com/sotahtech/project/issues)
- Se não encontrou, [abra uma nova issue](#reportando-bugs)

### 2. Sugerir Melhorias
Tem uma ideia para melhorar o projeto?
- Verifique se já não foi sugerida em [Issues](https://github.com/sotahtech/project/issues)
- Se não, [abra uma nova issue](#sugerindo-melhorias)

### 3. Contribuir com Código
- Corrija bugs existentes
- Implemente novas features
- Melhore documentação
- Adicione testes

### 4. Melhorar Documentação
- Corrigir typos
- Melhorar exemplos
- Adicionar tutoriais
- Traduzir documentação

---

## 🔄 Processo de Pull Request

### 1. Fork e Clone
```bash
# Fork o projeto no GitHub
# Clone seu fork
git clone https://github.com/SEU-USUARIO/project-name.git
cd project-name

# Adicione o upstream
git remote add upstream https://github.com/sotahtech/project-name.git
```

### 2. Crie uma Branch
```bash
# Atualize sua main com upstream
git checkout main
git pull upstream main

# Crie uma branch para sua feature/fix
git checkout -b feature/nome-da-feature
# ou
git checkout -b fix/nome-do-bug
```

**Convenção de Nomenclatura de Branches**:
- `feature/nome-da-feature`: Para novas funcionalidades
- `fix/nome-do-bug`: Para correções de bugs
- `docs/nome-da-doc`: Para melhorias de documentação
- `refactor/nome-da-refatoracao`: Para refatorações
- `test/nome-do-teste`: Para adição de testes

### 3. Faça suas Mudanças
```bash
# Faça suas alterações
# Adicione testes se aplicável
# Atualize documentação se necessário

# Teste localmente
npm test
npm run lint
```

### 4. Commit suas Mudanças
```bash
git add .
git commit -m "feat: adiciona nova funcionalidade X"
```

Ver [Padrões de Commit](#padrões-de-commit) para formato correto.

### 5. Push e Abra um PR
```bash
# Push para seu fork
git push origin feature/nome-da-feature

# Abra um Pull Request no GitHub
# Preencha o template de PR
```

### 6. Processo de Review

Após abrir um PR:
1. **Automated Checks**: CI/CD executará testes automaticamente
2. **Code Review**: Pelo menos 1 revisor aprovará seu código
3. **Mudanças Solicitadas**: Faça as mudanças solicitadas e push novamente
4. **Merge**: Após aprovação, um maintainer fará o merge

**Tempo de Review**: Tentamos revisar PRs em até 48 horas úteis.

---

## 💻 Padrões de Código

### Estilo de Código
- Seguimos [Coding Standards](/docs/standards/coding-standards.md)
- Use ESLint para JavaScript/TypeScript
- Use Prettier para formatação
- Máximo 100 caracteres por linha

### TypeScript
```typescript
// ✅ BOM
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<User> {
  return userRepository.findById(id);
}

// ❌ RUIM
function getUser(id) {
  return userRepository.findById(id);
}
```

### Nomenclatura
- **Variables/Functions**: camelCase (`getUserById`, `userName`)
- **Classes/Interfaces**: PascalCase (`UserService`, `IUserRepository`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`, `API_BASE_URL`)
- **Files**: kebab-case (`user-service.ts`, `order-controller.ts`)

### Comentários
```typescript
// ✅ BOM: Comentários úteis
/**
 * Processa pagamento e atualiza status do pedido.
 * @throws {PaymentError} Se pagamento falhar
 */
async function processPayment(orderId: string): Promise<void> {
  // Workaround para bug no gateway (ver ISSUE-123)
  await gateway.retry({ maxAttempts: 3 });
}

// ❌ RUIM: Comentários óbvios
// Define uma variável chamada name
const name = "João";
```

### Testes
- Cobertura mínima: 80%
- Testes unitários para toda lógica de negócio
- Testes de integração para endpoints de API

```typescript
// Estrutura de teste
describe('UserService', () => {
  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      // Arrange
      const userData = { name: 'João', email: 'joao@test.com' };
      
      // Act
      const user = await userService.createUser(userData);
      
      // Assert
      expect(user.id).toBeDefined();
      expect(user.name).toBe(userData.name);
    });

    it('should throw error if email already exists', async () => {
      // Arrange
      const userData = { name: 'João', email: 'existing@test.com' };
      
      // Act & Assert
      await expect(userService.createUser(userData))
        .rejects
        .toThrow('Email already exists');
    });
  });
});
```

---

## 📝 Padrões de Commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/) para mensagens de commit.

### Formato
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **docs**: Apenas documentação
- **style**: Formatação, ponto e vírgula faltando, etc (não afeta código)
- **refactor**: Refatoração de código
- **perf**: Melhoria de performance
- **test**: Adição de testes
- **chore**: Tarefas de build, configuração, etc

### Scope (opcional)
- `auth`: Autenticação
- `api`: Endpoints de API
- `db`: Banco de dados
- `ui`: Interface do usuário

### Exemplos
```bash
# Feature
feat(auth): adiciona autenticação JWT

Implementa geração e validação de tokens JWT para autenticação
stateless. Inclui middleware de validação e refresh token.

Closes #123

# Bug Fix
fix(api): corrige timeout em endpoints de pedidos

Aumenta timeout de 5s para 30s para queries complexas.
Adiciona retry logic para falhas temporárias.

Fixes #456

# Breaking Change
feat(api)!: altera estrutura de resposta da API

BREAKING CHANGE: Resposta de /api/orders agora retorna
{ data: {...}, meta: {...} } ao invés de { order: {...} }

Migração: Atualizar clientes para acessar resposta.data

# Documentação
docs: atualiza README com instruções de instalação

# Chore
chore: atualiza dependências para versões mais recentes
```

### Dicas
- Use imperativo ("adiciona" não "adicionado" ou "adicionando")
- Primeira linha com até 72 caracteres
- Corpo opcional com mais detalhes
- Referencie issues com `Closes #123`, `Fixes #456`
- Marque breaking changes com `!` ou `BREAKING CHANGE:`

---

## 🐛 Reportando Bugs

### Antes de Reportar
1. Verifique se o bug já não foi reportado
2. Tente reproduzir no ambiente de staging/produção
3. Colete informações relevantes

### Template de Bug Report
```markdown
**Descrição do Bug**
[Descrição clara e concisa do bug]

**Como Reproduzir**
Passos para reproduzir:
1. Vá para '...'
2. Clique em '...'
3. Role até '...'
4. Veja o erro

**Comportamento Esperado**
[O que deveria acontecer]

**Comportamento Atual**
[O que está acontecendo]

**Screenshots**
[Se aplicável, adicione screenshots]

**Ambiente**
- OS: [e.g. macOS 13.0]
- Browser: [e.g. Chrome 120]
- Versão: [e.g. v2.3.0]

**Logs/Erros**
```
[Cole logs ou mensagens de erro aqui]
```

**Contexto Adicional**
[Qualquer outra informação relevante]

**Severidade**
- [ ] Crítico (sistema quebrado, impede uso)
- [ ] Alto (funcionalidade importante quebrada)
- [ ] Médio (funcionalidade secundária afetada)
- [ ] Baixo (problema cosmético)
```

---

## 💡 Sugerindo Melhorias

### Template de Feature Request
```markdown
**A feature está relacionada a um problema?**
[Descrição clara do problema. Ex: "É frustrante quando..."]

**Solução Desejada**
[Descrição clara da solução que você gostaria]

**Alternativas Consideradas**
[Outras soluções que você considerou]

**Contexto Adicional**
[Qualquer contexto adicional, screenshots, exemplos]

**Benefícios**
[Quem se beneficiaria e como]

**Complexidade Estimada**
[Sua opinião sobre a complexidade: Baixa/Média/Alta]
```

---

## 🚀 Primeiros Passos

### Setup do Ambiente de Desenvolvimento
```bash
# 1. Clone o projeto
git clone https://github.com/sotahtech/project-name.git
cd project-name

# 2. Instale dependências
npm install

# 3. Configure ambiente
cp .env.example .env
# Edite .env com configurações locais

# 4. Setup banco de dados
docker-compose up -d postgres
npm run migrate
npm run seed

# 5. Execute testes
npm test

# 6. Inicie servidor dev
npm run dev
```

### Issues Boas para Iniciantes
Procure por issues marcadas com:
- `good first issue`: Perfeitas para começar
- `help wanted`: Precisamos de ajuda!
- `documentation`: Melhorias de docs

[Ver issues para iniciantes](https://github.com/sotahtech/project/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)

### Ferramentas Recomendadas
- **IDE**: VS Code com extensões:
  - ESLint
  - Prettier
  - GitLens
- **Git GUI**: GitKraken ou SourceTree
- **API Testing**: Postman ou Insomnia
- **Database**: DBeaver ou DataGrip

---

## ❓ Dúvidas

### Onde Perguntar?
- **Dúvidas Gerais**: [GitHub Discussions](https://github.com/sotahtech/project/discussions)
- **Bugs**: [GitHub Issues](https://github.com/sotahtech/project/issues)
- **Chat**: [Slack #projeto-name](https://sotahtech.slack.com)
- **Email**: dev@sotahtech.com

### FAQ

**P: Quanto tempo demora para meu PR ser revisado?**
R: Tentamos revisar em até 48 horas úteis, mas pode variar.

**P: Preciso criar uma issue antes de um PR?**
R: Para bugs pequenos e docs, não. Para features, sim - preferimos discutir antes.

**P: Posso trabalhar em uma issue já atribuída?**
R: Se não houver atividade por 7 dias, você pode comentar na issue.

**P: Como me torno um maintainer?**
R: Contribua consistentemente por 3-6 meses, demonstre conhecimento do projeto.

---

## 🎉 Reconhecimento

Agradecemos todos os nossos contribuidores! 🙏

Ver [lista completa de contribuidores](https://github.com/sotahtech/project/graphs/contributors).

### Hall of Fame
- **Maiores Contribuidores**: [Lista dos top 5]
- **Primeiros Contribuidores**: [Lista dos 10 primeiros]

---

## 📄 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma licença do projeto ([MIT](LICENSE)).

---

**Obrigado por contribuir! 🚀**

**Última atualização**: [YYYY-MM-DD]
```

---

**Fim dos Templates: RFC, README, CHANGELOG, CONTRIBUTING**