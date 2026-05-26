# Contribuindo para o Gerador JSON Elementor

Obrigado pelo interesse em contribuir! Este documento fornece diretrizes para contribuir com o projeto.

## Código de Conduta

Este projeto segue um código de conduta simples:
- Seja respeitoso e inclusivo
- Foque em críticas construtivas
- Ajude outros contribuidores

## Como Contribuir

### Reportando Bugs

1. Verifique se o bug já foi reportado nas [issues](#)
2. Se não, crie uma nova issue com:
   - Título descritivo
   - Descrição detalhada do problema
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Screenshots (se aplicável)
   - Informações do sistema (SO, versão do app)

### Sugerindo Features

1. Abra uma issue com a label `enhancement`
2. Descreva a feature e seu caso de uso
3. Explique por que seria útil

### Pull Requests

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/sua-feature`)
3. Faça commit das alterações (`git commit -am 'Adiciona feature'`)
4. Push para a branch (`git push origin feature/sua-feature`)
5. Abra um Pull Request

#### Padrões de Código

- Use TypeScript para todo código novo
- Siga o estilo existente (ESLint configurado)
- Escreva mensagens de commit claras
- Adicione testes para novas funcionalidades
- Documente mudanças significativas

### Configuração do Ambiente

```bash
# Clone
git clone https://github.com/seu-usuario/gerador-json-elementor.git
cd gerador-json-elementor

# Instale dependências
npm install

# Execute em modo dev
npm run dev

# Execute Electron em dev
npm run electron:dev
```

## Estrutura de Branches

- `main` - Branch principal, código estável
- `develop` - Branch de desenvolvimento
- `feature/*` - Novas funcionalidades
- `bugfix/*` - Correções de bugs
- `hotfix/*` - Correções urgentes

## Revisão de Código

Todo PR será revisado antes de ser mergeado. Certifique-se de:
- Passar em todos os testes
- Manter compatibilidade com as 3 plataformas
- Atualizar documentação se necessário

## Dúvidas?

Entre em contato abrindo uma issue ou enviando email para <marleyas@gmail.com>.

Agradecemos sua contribuição!
