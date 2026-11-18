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

## SEO técnico

- `index.html`: título, descrição, canonical, Open Graph, Twitter Card e JSON-LD institucional.
- `robots.txt`: indica o sitemap e desencoraja rastreamento das pastas de prévia. **Não substitui autenticação por senha.**
- `sitemap.xml`: inclui somente a página oficial da WhiteX (site de página única).

Os arquivos de SEO são implantados automaticamente na pasta de desenvolvimento, mas **somente funcionam no domínio principal após uma publicação manual supervisionada**. Não liberar a pasta de homologação nem a de desenvolvimento para indexação. Após publicar, conferir `/robots.txt`, `/sitemap.xml` e a URL canônica; depois, enviar o sitemap pelo Google Search Console.

## Desempenho, acessibilidade e Core Web Vitals (V3.2)

Melhorias na branch `develop`:
- Destaque visual de foco para links e botões e destino de pulo ao conteúdo focável.
- Menu mobile fechável por Escape (devolve foco ao botão), clique fora e mudança para viewport desktop.
- Proporção explícita do SVG principal e prioridade de carregamento; logo do rodapé com carregamento preguiçoso.
- Remoção de aviso desatualizado sobre ativação do e-mail corporativo.
- Preservação de `prefers-reduced-motion` já existente.

### Checklist de homologação antes do merge
1. Em janela anônima, confirmar a autenticação na prévia `/whitex-develop-preview/`.
2. Em tela estreita (até 700px), abrir menu, navegar com Tab, fechar com Escape e conferir o retorno do foco ao botão.
3. Abrir o menu novamente e clicar fora. Verificar que fecha; repetir redimensionando para desktop.
4. Testar o link "Ir para o conteúdo" com teclado e todos os links principais e "Voltar ao topo".
5. Confirmar logo, menu, fontes, botões, espaçamentos e layout em desktop e celular.
6. Executar [PageSpeed Insights](https://pagespeed.web.dev/) **em produção** para registrar a linha de base real, separadamente para celular e computador. Prévia protegida por senha não pode ser auditada diretamente pelo serviço público.
7. Medir LCP, INP e CLS após a publicação; o relatório de dados reais do Search Console pode demorar e não possuir dados suficientes para um site novo.

**Importante:** essas alterações não garantem determinada pontuação Lighthouse ou aprovação de Core Web Vitals. CSS/JS alterados devem ser implantados juntos com o HTML; produção permanece manual.

## Experimento LCP mobile (V3.3)

**Linha de base (PageSpeed Insights mobile, 18/11/2026):** desempenho 96/100, LCP 2,6 s, FCP 1,5 s. No detalhamento do LCP, o elemento é `section.hero > div.hero-visual > div.hero-symbol > img` (`assets/logo-wx.svg`). Subpartes: TTFB 0 ms, atraso no carregamento 400 ms, duração do carregamento 440 ms e atraso na renderização 1700 ms.

**Hipótese a testar:** dois efeitos `filter: drop-shadow` em elementos aninhados (pai e SVG) ampliam o trabalho de composição/renderização no celular. O SVG já é pequeno e prioritário.

**Alterações:** no mobile (<=700px), remover o filtro do contêiner e diminuir o filtro na imagem; manter a aparência desktop. Mudar a decodificação da imagem de LCP para `sync`, mantendo `fetchpriority="high"`. Versionar URL do CSS para evitar estilo antigo em cache.

**Aceitação:** validar visual mobile em 360/390/430 px e tablet/desktop, preservar identidade e acessibilidade, testar com cache frio e quente. Comparar no PageSpeed da **produção após publicação manual**, idealmente várias execuções mobile em condições comparáveis. Não declarar melhoria antes de medir. Se o LCP piorar ou o brilho perder qualidade, reverter o experimento.

## Verificações automáticas (GitHub Actions)

Workflow: `.github/workflows/quality.yml`, executado ao enviar commits para `develop`, abrir/atualizar PRs com destino a `main` ou `develop`, ou iniciar manualmente na aba Actions.

O job **Validar site estatico** executa `node --check` em `script.js` e `scripts/check-quality.mjs` e uma verificação leve sem dependências externas com `node scripts/check-quality.mjs`:
- idioma, título, meta description, canonical, âncoras internas e IDs duplicados;
- existência de recursos locais referenciados no HTML e atributo `alt` das imagens;
- CSS com chaves equilibradas e preferência por movimento reduzido;
- estado ARIA do menu, referências básicas de `robots.txt`, sitemap e JSON-LD.

**Limites:** são verificações estáticas de regressão, não substituem testes com navegador, validadores completos de HTML/CSS, testes de acessibilidade com tecnologia assistiva ou Lighthouse/Core Web Vitals.

**Política de publicação:** a CI não inclui comandos de deploy e não modifica a produção. Antes de exigir o status de CI como regra de proteção de branch, confirmar uma execução verde e a disponibilidade desse recurso no plano do repositório.
