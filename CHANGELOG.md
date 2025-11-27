# Changelog

Todas as mudanças notáveis neste projeto serão documentadas aqui.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Added
- [PROTOTIPO-001] [MVP - Fixo] (@ViniTasso, 2025-03-26)

---

## [0.0.2] - 2025-11-26

### Added - Protótipo II
- Simulação do Backend (Scanner): Ele "lê" uma estrutura de pastas virtual (baseada no seu exemplo src, docs, adr, etc.).
- Auto-Mapping: Ele categoriza automaticamente arquivos conhecidos (ADRs vão para "Arquitetura", C4 vai para "Visão Geral").
- UI de Prateleiras: Implementa o conceito de Prateleira > Livro > Capítulo > Página.
- Gestão de Não-Mapeados: Mostra arquivos que foram encontrados mas não têm categoria, permitindo "arrastar" (simulado via clique) para a estrutura correta.
- Renderização: Markdown e Mermaid (simulado visualmente).

---

## [0.0.1] - 2025-11-26

### Added - Protótipo I
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