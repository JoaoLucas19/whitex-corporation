# WhiteX Corporation

Site institucional da WhiteX Corporation.

**Produção:** https://whitexcorporation.com.br

## Tecnologias
- HTML5
- CSS3
- JavaScript
- SVG

## Estrutura
```
index.html
style.css
script.js
assets/favicon.svg
```

## Desenvolvimento
Abra `index.html` no navegador ou use um servidor local, como o Live Server do VS Code.

## Publicação
A versão publicada atualmente está hospedada na Hostinger Business. A publicação não é automática: mudanças neste repositório devem ser testadas e implantadas na Hostinger de forma controlada.

## Identidade
**WhiteX Corporation** · Ideias que viram código.

## Fluxo de branches

- `develop`: desenvolvimento e homologação em `/whitex-develop-preview/`.
- `main`: versões revisadas e homologação em `/whitex-git-preview/`.
- Produção (`/`): publicação separada e supervisionada, após backup e validação.

### Publicando alterações

1. Desenvolver e testar na `develop`.
2. Abrir Pull Request de `develop` para `main`.
3. Revisar o diff e validar o site antes do merge.
4. Fazer o merge para atualizar a prévia da `main` via webhook.
5. Publicar em produção somente após backup e aprovação explícita.

> Observação: a atualização automática das pastas de preview não significa publicação automática na raiz do domínio.

<!-- Verificação de deploy em diretório protegido: 2026-11-17 -->
