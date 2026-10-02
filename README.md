# Verdfrut — Loja virtual (projeto de Maturidade e Desenvolvimento de Software)

Site de mercado inspirado na [loja oficial da Verdfrut](https://loja.verdfrut.com.br/). A interface parece oficial, mas é **demonstrativa**: nenhum pedido é enviado, cobrado ou armazenado.

- Identidade visual: roxo (principal), verde (secundária) e detalhes brancos.
- Tecnologia: TanStack Start (React 19), TypeScript, Tailwind CSS v4, Vite.

---

## 1. Funcionalidades implementadas

| Código | Funcionalidade | Comportamento | Critério de aceitação |
|---|---|---|---|
| RF01 | Vitrine de categorias | Frutas, Verduras e Mercearia em cartões clicáveis. | Ao clicar, a lista é filtrada e rola até os produtos. |
| RF02 | Catálogo | 9 produtos com nome, categoria, unidade, preço e selo. | Todos os produtos são exibidos com preço em R$. |
| RF03 | Filtro por categoria | Botões Todos / Frutas / Verduras / Mercearia. | Só aparecem produtos da categoria escolhida. |
| RF04 | Busca | Campo que filtra por nome, sem diferenciar maiúsculas. | Termo inexistente mostra "Nenhum produto encontrado" e botão "Limpar filtros". |
| RF05 | Adicionar à sacola | Botão "Adicionar" vira seletor de quantidade no cartão. | Contador do cabeçalho atualiza na hora. |
| RF06 | Gerenciar sacola | Aumentar, diminuir (até 0), remover item e esvaziar. Limite de 20 por item. | Subtotal recalculado a cada alteração. |
| RF07 | Frete | R$ 9,90; grátis a partir de R$ 150,00, com aviso de quanto falta. | Total = subtotal + frete. |
| RF08 | Finalizar compra | Formulário de nome, telefone, CEP, endereço, horário e pagamento (Pix, cartão ou dinheiro na entrega). | Campos inválidos exibem mensagem e bloqueiam o envio. |
| RF09 | Confirmação | Gera código `VF-XXXXXX`, mostra total, horário e pagamento, e esvazia a sacola. | Tela "Pedido confirmado" aparece após envio válido. |
| RF10 | Navegação | Cabeçalho fixo, menu para celular, links Categorias / Produtos / Entrega. | Menu abre e fecha no celular. |

### Regras de validação (RF08)
- Nome: mínimo 3 caracteres.
- Telefone: mínimo 10 dígitos (com DDD).
- CEP: exatamente 8 dígitos.
- Endereço: mínimo 5 caracteres.

## 2. Requisitos não funcionais

| Código | Requisito | Como foi atendido |
|---|---|---|
| RNF01 | Usabilidade | Linguagem simples, fluxo em 3 passos (sacola → dados → confirmação). |
| RNF02 | Responsividade | Layout adaptado a celular, tablet e computador. |
| RNF03 | Acessibilidade | Rótulos `aria-label`, `aria-pressed`, `aria-invalid`, textos alternativos, foco visível e uso por teclado. Respeita "reduzir movimento". |
| RNF04 | Desempenho | Imagens com `loading="lazy"` e dimensões definidas; filtros calculados com `useMemo`. |
| RNF05 | Segurança / LGPD | Nenhum dado pessoal é enviado ou guardado; tudo fica só na memória da página. |
| RNF06 | Manutenibilidade | Dados (produtos, frete, horários) separados em constantes; componentes reutilizáveis (`Brand`, `Summary`). |
| RNF07 | Consistência visual | Cores definidas em tokens no `src/styles.css` (roxo, verde, branco). |
| RNF08 | SEO | Título e descrição próprios da página. |

## 3. Requisitos futuros (backlog)
- Cadastro e login de clientes.
- Banco de dados de produtos e estoque.
- Pagamento real (Pix/cartão) e cálculo de frete por CEP.
- Histórico e acompanhamento de pedidos.
- Painel administrativo.

## 4. Maturidade de software (referência CMMI / MPS.BR)

| Nível | Prática | Evidência neste projeto |
|---|---|---|
| 1 – Inicial | Processo informal | Primeiro protótipo visual. |
| 2 – Gerenciado | Requisitos registrados, versionamento | Este README, histórico de versões no Git, `roadmap.md`. |
| 3 – Definido | Padrões de código e arquitetura | TypeScript, ESLint, Prettier, tokens de design, `AGENTS.md`. |
| 4 – Quantitativo | Métricas | Sugerido: tempo de carregamento (Lighthouse), taxa de conversão, defeitos por versão. |
| 5 – Otimização | Melhoria contínua | Backlog priorizado a partir de métricas e feedback. |

### Ciclo adotado
1. **Planejar** – escopo, requisitos e critérios de aceitação.
2. **Desenvolver** – entregas pequenas e versionadas.
3. **Validar** – testes manuais pelos critérios acima.
4. **Evoluir** – registrar defeitos e melhorias no backlog.

## 5. Plano de testes (manual)
| Caso | Passos | Resultado esperado |
|---|---|---|
| CT01 | Clicar em "Frutas" | Só frutas aparecem. |
| CT02 | Buscar "xyz" | Mensagem de nenhum produto. |
| CT03 | Adicionar 2 morangos | Contador mostra 2; subtotal R$ 25,80. |
| CT04 | Subtotal ≥ R$ 150 | Entrega "Grátis". |
| CT05 | Confirmar com CEP "123" | Erro "O CEP deve ter 8 dígitos". |
| CT06 | Confirmar com dados válidos | Código VF-XXXXXX e sacola vazia. |

## 6. Como executar
```sh
bun install
bun run dev
```

## 7. Aviso
Projeto acadêmico. Marca usada apenas como referência; não é afiliado à Verdfrut. Produtos, preços e imagens são ilustrativos.
