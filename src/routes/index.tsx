import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Check, ChevronDown, Leaf, Menu, Minus, Plus, Search, ShoppingBag, SlidersHorizontal, Sparkles, Truck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import hero from "@/assets/verdfrut-hero.jpg";
import frutas from "@/assets/frutas.jpg";
import verduras from "@/assets/verduras.jpg";
import mercearia from "@/assets/mercearia.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Verdfrut — Mercado fresco | Projeto acadêmico simulado" },
    { name: "description", content: "Protótipo acadêmico de mercado inspirado na Verdfrut, com catálogo demonstrativo e requisitos para maturidade e desenvolvimento de software." },
    { property: "og:title", content: "Verdfrut — Mercado fresco | Projeto acadêmico simulado" },
    { property: "og:description", content: "Protótipo acadêmico de mercado inspirado na Verdfrut, com catálogo demonstrativo e requisitos para maturidade e desenvolvimento de software." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

type Category = "Todos" | "Frutas" | "Verduras" | "Mercearia";
type Product = { id: number; name: string; category: Exclude<Category, "Todos">; unit: string; price: number; image: string; badge?: string };

const categories = [
  { name: "Frutas" as const, image: frutas, count: "Frescas e coloridas", detail: "Do café da manhã à sobremesa" },
  { name: "Verduras" as const, image: verduras, count: "Verdes de verdade", detail: "Mais vida para o seu prato" },
  { name: "Mercearia" as const, image: mercearia, count: "Para o dia a dia", detail: "Essenciais da sua cozinha" },
];

const products: Product[] = [
  { id: 1, name: "Morango fresco", category: "Frutas", unit: "bandeja 250 g", price: 12.9, image: frutas, badge: "Queridinho" },
  { id: 2, name: "Maçã selecionada", category: "Frutas", unit: "aprox. 1 kg", price: 10.9, image: frutas },
  { id: 3, name: "Alface crespa", category: "Verduras", unit: "unidade", price: 4.9, image: verduras, badge: "Fresquinho" },
  { id: 4, name: "Brócolis fresco", category: "Verduras", unit: "unidade", price: 8.9, image: verduras },
  { id: 5, name: "Pão artesanal", category: "Mercearia", unit: "unidade", price: 18.9, image: mercearia },
  { id: 6, name: "Azeite de oliva", category: "Mercearia", unit: "garrafa 500 ml", price: 39.9, image: mercearia },
];

const functionalRequirements = [
  ["RF01", "Catálogo e categorias", "Exibir produtos organizados por frutas, verduras e itens de mercearia, com descrição, unidade e preço."],
  ["RF02", "Busca e filtros", "Permitir localizar produtos por nome e refinar a visualização por categoria."],
  ["RF03", "Carrinho de compras", "Adicionar, remover e alterar quantidades, com subtotal atualizado automaticamente."],
  ["RF04", "Conta e endereço", "Permitir cadastro, acesso à conta e seleção de endereço para futuras entregas."],
  ["RF05", "Entrega e pagamento", "Apresentar horários disponíveis, taxas e meios de pagamento antes da confirmação do pedido."],
  ["RF06", "Acompanhamento", "Exibir histórico, situação do pedido e confirmação de compra ao cliente."],
];
const qualityRequirements = [
  ["RNF01", "Usabilidade", "Navegação clara, linguagem simples e adaptação a celular, tablet e computador."],
  ["RNF02", "Acessibilidade", "Contraste legível, uso por teclado, textos alternativos e campos identificados."],
  ["RNF03", "Desempenho", "Carregamento otimizado das imagens e respostas rápidas na busca e no carrinho."],
  ["RNF04", "Segurança e privacidade", "Proteger dados pessoais, controlar acessos e respeitar a LGPD."],
  ["RNF05", "Confiabilidade", "Manter preços e estoque consistentes e informar falhas sem perder o pedido."],
  ["RNF06", "Manutenibilidade", "Separar responsabilidades, documentar alterações e manter testes automatizados."],
];
const maturitySteps = [
  { number: "01", title: "Planejar", text: "Definir público, objetivos, escopo, responsáveis e critérios de aceitação." },
  { number: "02", title: "Desenvolver", text: "Priorizar entregas, versionar código e revisar cada mudança antes de publicar." },
  { number: "03", title: "Validar", text: "Testar fluxos de compra, acessibilidade, desempenho e segurança." },
  { number: "04", title: "Evoluir", text: "Medir erros e satisfação, registrar melhorias e ajustar o processo continuamente." },
];

const formatPrice = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

function Brand({ light = false }: { light?: boolean }) {
  return <a href="#inicio" aria-label="Verdfrut, voltar ao início" className={`inline-flex items-center gap-2.5 font-display text-[27px] font-extrabold leading-none ${light ? "text-primary-foreground" : "text-primary"}`}><span className={`flex size-9 items-center justify-center rounded-full ${light ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"}`}><Leaf size={19} strokeWidth={2.7} /></span>verd<span className={light ? "text-secondary" : "text-secondary"}>frut</span><span className="sr-only"> — projeto simulado</span></a>;
}

function Index() {
  const [category, setCategory] = useState<Category>("Todos");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const filtered = useMemo(() => products.filter((product) => (category === "Todos" || product.category === category) && product.name.toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR").trim())), [category, query]);
  const count = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const subtotal = products.reduce((sum, product) => sum + product.price * (cart[product.id] ?? 0), 0);
  const changeQuantity = (id: number, delta: number) => setCart((current) => ({ ...current, [id]: Math.max(0, (current[id] ?? 0) + delta) }));
  const chooseCategory = (selected: Category) => { setCategory(selected); document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };

  return <div className="min-h-screen overflow-x-hidden">
    <div className="bg-plum-deep px-5 py-2.5 text-center text-[11px] font-semibold text-primary-foreground sm:text-xs">PROJETO ACADÊMICO SIMULADO <span className="mx-2 opacity-40">•</span> Não é a loja oficial da Verdfrut</div>
    <header className="relative z-20 bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl items-center gap-5 px-5 py-4 lg:px-8">
        <Brand light />
        <nav aria-label="Navegação principal" className="ml-12 hidden items-center gap-8 text-sm font-semibold lg:flex"><a className="transition-opacity hover:opacity-70" href="#categorias">Categorias</a><a className="transition-opacity hover:opacity-70" href="#produtos">Produtos</a><a className="transition-opacity hover:opacity-70" href="#requisitos">Requisitos do projeto</a></nav>
        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <a href="#produtos" className="hidden items-center gap-2 rounded-md border border-primary-foreground/25 px-3.5 py-2.5 text-xs font-medium transition-colors hover:bg-primary-foreground/10 sm:inline-flex"><Search size={16} /> Buscar produtos</a>
          <Button type="button" onClick={() => setCartOpen(true)} aria-label={`Abrir sacola com ${count} itens`} className="relative h-10 bg-secondary px-3 text-secondary-foreground shadow-none hover:bg-secondary/90"><ShoppingBag size={19} /><span className="text-xs font-bold">{count}</span></Button>
          <Button type="button" variant="ghost" size="icon" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground lg:hidden">{menuOpen ? <X /> : <Menu />}</Button>
        </div>
      </div>
      {menuOpen && <nav aria-label="Menu móvel" className="flex flex-col gap-1 border-t border-primary-foreground/20 px-5 pb-5 pt-3 text-sm font-semibold lg:hidden"><a href="#categorias" onClick={() => setMenuOpen(false)} className="py-2">Categorias</a><a href="#produtos" onClick={() => setMenuOpen(false)} className="py-2">Produtos</a><a href="#requisitos" onClick={() => setMenuOpen(false)} className="py-2">Requisitos do projeto</a></nav>}
    </header>

    <main id="inicio">
      <section className="hero-surface relative isolate min-h-[495px] overflow-hidden sm:min-h-[560px] lg:min-h-[590px]" aria-labelledby="hero-title">
        <img src={hero} width={1600} height={1000} alt="Frutas frescas, folhas verdes e berries reunidas sobre uma superfície clara" className="absolute inset-0 -z-20 h-full w-full object-cover object-[61%_center] md:object-center" />
        <div className="hero-photo-mask absolute inset-0 -z-10" />
        <div className="mx-auto flex min-h-[495px] max-w-7xl items-center px-5 py-14 sm:min-h-[560px] lg:min-h-[590px] lg:px-8">
          <div className="max-w-[570px]">
            <div className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase text-accent-foreground"><span className="h-2 w-2 rounded-full bg-secondary" /> O frescor que inspira</div>
            <h1 id="hero-title" className="max-w-[600px] font-display text-[clamp(3.3rem,6vw,5.9rem)] font-extrabold leading-[.99] text-primary">Verdfrut.<br />Mais sabor em cada dia<span className="text-secondary">.</span></h1>
            <p className="mt-7 max-w-[430px] text-base leading-relaxed text-foreground/80 sm:text-lg">Frutas, verduras e escolhas gostosas para uma rotina cheia de vida.</p>
            <div className="mt-9 flex flex-wrap items-center gap-4"><Button asChild size="lg" className="h-12 rounded-md bg-primary px-6 font-semibold text-primary-foreground shadow-none hover:bg-plum-deep"><a href="#produtos">Explorar produtos <ArrowRight size={18} /></a></Button><a href="#categorias" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">Ver categorias <ChevronDown size={16} /></a></div>
          </div>
        </div>
      </section>

      <div className="border-y border-border bg-surface"><div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-5 py-6 sm:grid-cols-3 lg:px-8"><div className="flex items-center gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-leaf-light text-accent-foreground"><Leaf size={20} /></span><div><strong className="block text-sm text-primary">Seleção fresquinha</strong><span className="text-xs text-muted-foreground">Escolhas para todos os dias</span></div></div><div className="flex items-center gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-lilac text-primary"><Sparkles size={19} /></span><div><strong className="block text-sm text-primary">Variedade de verdade</strong><span className="text-xs text-muted-foreground">Do hortifruti à mercearia</span></div></div><div className="flex items-center gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-leaf-light text-accent-foreground"><Truck size={20} /></span><div><strong className="block text-sm text-primary">Compra do seu jeito</strong><span className="text-xs text-muted-foreground">Uma experiência pensada para você</span></div></div></div></div>

      <section id="categorias" className="scroll-mt-8 mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5"><div><span className="text-xs font-bold uppercase text-accent-foreground">Descubra a nossa seleção</span><h2 className="mt-2 font-display text-4xl font-bold text-primary sm:text-5xl">Escolha o que faz bem.</h2></div><a href="#produtos" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">Ver todos os produtos <ArrowRight size={17} /></a></div>
        <div className="grid gap-4 md:grid-cols-3">{categories.map((item) => <button key={item.name} type="button" onClick={() => chooseCategory(item.name)} className="group relative h-[320px] overflow-hidden rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-[360px]"><img src={item.image} alt={`Seleção de ${item.name.toLowerCase()}`} loading="lazy" width={816} height={816} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-plum-deep/90 via-plum-deep/10 to-transparent" /><div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-primary-foreground"><div><span className="text-xs font-semibold text-leaf-light">{item.count}</span><h3 className="mt-1 font-display text-3xl font-bold">{item.name}</h3><p className="mt-1 text-sm opacity-90">{item.detail}</p></div><span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-transform group-hover:translate-x-1"><ArrowRight size={19} /></span></div></button>)}</div>
      </section>

      <section id="produtos" className="scroll-mt-8 bg-surface py-16 lg:py-20"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="mb-8 flex flex-wrap items-end justify-between gap-5"><div><span className="text-xs font-bold uppercase text-accent-foreground">Para colocar na sacola</span><h2 className="mt-2 font-display text-4xl font-bold text-primary sm:text-5xl">Uma seleção especial.</h2><p className="mt-3 text-sm text-muted-foreground">Produtos e preços ilustrativos para esta simulação acadêmica.</p></div><span className="hidden items-center gap-2 text-xs text-muted-foreground md:flex"><SlidersHorizontal size={15} /> Explore por categoria</span></div>
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div className="flex gap-2 overflow-x-auto pb-1" aria-label="Filtrar produtos por categoria">{(["Todos", "Frutas", "Verduras", "Mercearia"] as Category[]).map((item) => <Button key={item} type="button" variant={category === item ? "default" : "outline"} onClick={() => setCategory(item)} aria-pressed={category === item} className={`h-9 shrink-0 rounded-md px-4 text-sm shadow-none ${category === item ? "bg-primary text-primary-foreground hover:bg-plum-deep" : "border-border bg-surface text-foreground hover:bg-muted"}`}>{item}</Button>)}</div><label className="flex h-10 w-full items-center gap-2 rounded-md border border-input bg-background px-3 text-muted-foreground focus-within:ring-2 focus-within:ring-ring sm:w-64"><Search size={17} /><span className="sr-only">Buscar produto</span><input type="search" placeholder="Buscar produto..." value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" /></label></div>
        {filtered.length ? <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">{filtered.map((product) => <article key={product.id} className="product-card overflow-hidden rounded-md border border-border bg-card"><div className="product-image relative aspect-[1.35] overflow-hidden"><img src={product.image} alt={product.name} width={816} height={816} loading="lazy" className="h-full w-full object-cover" />{product.badge && <span className="absolute left-3 top-3 rounded-sm bg-leaf-light px-2.5 py-1 text-[10px] font-bold text-accent-foreground">{product.badge}</span>}</div><div className="p-3.5 sm:p-5"><span className="text-[10px] font-bold uppercase text-accent-foreground sm:text-xs">{product.category}</span><h3 className="mt-1 font-display text-base font-bold leading-snug text-foreground sm:text-xl">{product.name}</h3><p className="mt-1 text-xs text-muted-foreground">{product.unit}</p><div className="mt-5 flex flex-wrap items-end justify-between gap-2"><div><span className="block font-display text-lg font-bold text-primary sm:text-2xl">{formatPrice(product.price)}</span><span className="text-[10px] text-muted-foreground">valor ilustrativo</span></div><Button type="button" size="icon" onClick={() => changeQuantity(product.id, 1)} aria-label={`Adicionar ${product.name} à sacola`} title={`Adicionar ${product.name} à sacola`} className="size-9 shrink-0 rounded-md bg-primary text-primary-foreground shadow-none hover:bg-plum-deep sm:size-10"><Plus size={19} /></Button></div></div></article>)}</div> : <div className="rounded-md border border-dashed border-border py-16 text-center"><Search className="mx-auto mb-3 text-muted-foreground" size={25} /><h3 className="font-display text-xl font-semibold text-primary">Nenhum produto encontrado</h3><p className="mt-2 text-sm text-muted-foreground">Experimente outro termo ou categoria.</p><Button type="button" variant="link" onClick={() => { setQuery(""); setCategory("Todos"); }} className="mt-2 text-primary">Limpar filtros</Button></div>}</div></section>

      <section className="bg-primary px-5 py-14 text-primary-foreground lg:px-8"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center"><div><span className="text-xs font-bold uppercase text-leaf-light">O projeto por trás da vitrine</span><h2 className="mt-2 max-w-2xl font-display text-3xl font-bold leading-tight sm:text-4xl">Uma boa experiência começa com bons requisitos.</h2></div><Button asChild size="lg" className="h-11 rounded-md bg-secondary px-5 font-bold text-secondary-foreground shadow-none hover:bg-secondary/90"><a href="#requisitos">Ver requisitos <ArrowRight size={18} /></a></Button></div></section>

      <section id="requisitos" className="scroll-mt-8 mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20"><div className="max-w-3xl"><span className="text-xs font-bold uppercase text-accent-foreground">Para a disciplina</span><h2 className="mt-2 font-display text-4xl font-bold text-primary sm:text-5xl">Requisitos do site.</h2><p className="mt-4 leading-relaxed text-muted-foreground">Uma proposta de requisitos para o desenvolvimento de um mercado digital, organizada para análise de processo, qualidade e maturidade de software.</p></div>
        <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16"><div><div className="mb-5 flex items-center gap-3 border-b border-border pb-4"><span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground"><ShoppingBag size={18} /></span><h3 className="font-display text-2xl font-bold text-primary">Requisitos funcionais</h3></div><div>{functionalRequirements.map(([code, title, description]) => <div key={code} className="flex gap-4 border-b border-border py-4"><span className="w-12 shrink-0 pt-0.5 text-xs font-bold text-accent-foreground">{code}</span><div><h4 className="font-semibold text-foreground">{title}</h4><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p></div></div>)}</div></div><div><div className="mb-5 flex items-center gap-3 border-b border-border pb-4"><span className="flex size-9 items-center justify-center rounded-md bg-leaf-light text-accent-foreground"><Check size={19} /></span><h3 className="font-display text-2xl font-bold text-primary">Requisitos não funcionais</h3></div><div>{qualityRequirements.map(([code, title, description]) => <div key={code} className="flex gap-4 border-b border-border py-4"><span className="w-12 shrink-0 pt-0.5 text-xs font-bold text-accent-foreground">{code}</span><div><h4 className="font-semibold text-foreground">{title}</h4><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p></div></div>)}</div></div></div>
      </section>

      <section className="bg-lilac px-5 py-16 lg:px-8 lg:py-20"><div className="mx-auto max-w-7xl"><span className="text-xs font-bold uppercase text-accent-foreground">Maturidade de software</span><h2 className="mt-2 max-w-2xl font-display text-4xl font-bold text-primary sm:text-5xl">Do planejamento à melhoria contínua.</h2><p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">Para avaliar a maturidade, o projeto deve mostrar processos definidos, resultados medidos e evolução baseada em evidências.</p><div className="mt-10 grid gap-8 border-t border-primary/15 pt-8 sm:grid-cols-2 lg:grid-cols-4">{maturitySteps.map((step) => <div key={step.number}><span className="font-display text-4xl font-bold text-secondary">{step.number}</span><h3 className="mt-4 font-display text-xl font-bold text-primary">{step.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p></div>)}</div><div className="mt-10 border-l-4 border-secondary bg-surface px-5 py-4 text-sm leading-relaxed text-foreground"><strong className="text-primary">Evidências para apresentar na matéria:</strong> levantamento de requisitos, protótipo, backlog priorizado, critérios de aceitação, plano de testes, registro de defeitos e indicadores de melhoria.</div></div></section>
    </main>

    <footer className="bg-plum-deep px-5 py-10 text-primary-foreground lg:px-8"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-end"><div><Brand light /><p className="mt-4 max-w-md text-sm leading-relaxed text-primary-foreground/75">Estudo visual e funcional para fins acadêmicos. Marca utilizada apenas como referência; este site não é afiliado à Verdfrut.</p></div><div className="text-sm"><span className="block font-bold">Referência da pesquisa</span><a className="mt-2 inline-flex items-center gap-2 text-leaf-light underline-offset-4 hover:underline" href="https://loja.verdfrut.com.br/" target="_blank" rel="noreferrer">Visitar loja oficial <ArrowRight size={16} /></a></div></div><div className="mx-auto mt-9 max-w-7xl border-t border-primary-foreground/20 pt-5 text-xs text-primary-foreground/60">Projeto acadêmico simulado · Produtos, preços e imagens ilustrativos</div></footer>

    {cartOpen && <div className="fixed inset-0 z-50 flex justify-end"><button type="button" className="absolute inset-0 bg-plum-deep/65" aria-label="Fechar sacola" onClick={() => setCartOpen(false)} /><aside role="dialog" aria-modal="true" aria-label="Sua sacola" className="relative flex h-full w-full max-w-md flex-col bg-surface shadow-2xl"><div className="flex items-center justify-between border-b border-border px-6 py-5"><div><span className="text-xs font-bold uppercase text-accent-foreground">Suas escolhas</span><h2 className="font-display text-2xl font-bold text-primary">Minha sacola <span className="text-base text-muted-foreground">({count})</span></h2></div><Button type="button" variant="ghost" size="icon" aria-label="Fechar sacola" onClick={() => setCartOpen(false)}><X size={22} /></Button></div><div className="flex-1 overflow-y-auto px-6 py-5">{count === 0 ? <div className="flex h-full flex-col items-center justify-center text-center"><ShoppingBag size={44} className="text-primary/35" /><h3 className="mt-5 font-display text-xl font-bold text-primary">Sua sacola está vazia</h3><p className="mt-2 text-sm text-muted-foreground">Escolha seus favoritos na seleção de produtos.</p><Button type="button" onClick={() => { setCartOpen(false); document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" }); }} className="mt-6 bg-primary text-primary-foreground hover:bg-plum-deep">Ver produtos</Button></div> : products.filter((product) => (cart[product.id] ?? 0) > 0).map((product) => <div key={product.id} className="flex gap-4 border-b border-border py-4"><img src={product.image} alt="" width={80} height={80} className="size-20 rounded-md object-cover" /><div className="min-w-0 flex-1"><h3 className="font-semibold text-foreground">{product.name}</h3><p className="text-xs text-muted-foreground">{product.unit}</p><strong className="mt-1 block text-sm text-primary">{formatPrice(product.price * (cart[product.id] ?? 0))}</strong><div className="mt-3 inline-flex h-8 items-center rounded-md border border-border"><Button type="button" variant="ghost" size="icon" className="size-8" aria-label={`Diminuir ${product.name}`} onClick={() => changeQuantity(product.id, -1)}><Minus size={14} /></Button><span className="w-7 text-center text-sm font-semibold">{cart[product.id]}</span><Button type="button" variant="ghost" size="icon" className="size-8" aria-label={`Aumentar ${product.name}`} onClick={() => changeQuantity(product.id, 1)}><Plus size={14} /></Button></div></div></div>)}</div><div className="border-t border-border px-6 py-5"><div className="flex items-center justify-between font-display text-lg font-bold text-primary"><span>Subtotal ilustrativo</span><span>{formatPrice(subtotal)}</span></div><p className="mt-3 text-xs leading-relaxed text-muted-foreground">Esta é apenas uma demonstração acadêmica. Nenhum pedido será enviado ou cobrado.</p><Button type="button" onClick={() => setCartOpen(false)} className="mt-5 h-11 w-full bg-primary text-primary-foreground hover:bg-plum-deep">Continuar explorando <ArrowRight size={16} /></Button></div></aside></div>}
  </div>;
}