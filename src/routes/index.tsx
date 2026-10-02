import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronDown, Leaf, Menu, Minus, Plus, Search, ShoppingBag, Sparkles, Trash2, Truck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import hero from "@/assets/verdfrut-hero.jpg";
import frutas from "@/assets/frutas.jpg";
import verduras from "@/assets/verduras.jpg";
import mercearia from "@/assets/mercearia.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Verdfrut — Frutas, verduras e mercearia fresquinhas" },
    { name: "description", content: "Monte sua sacola com frutas, verduras e itens de mercearia da Verdfrut e escolha o melhor horário de entrega." },
    { property: "og:title", content: "Verdfrut — Frutas, verduras e mercearia fresquinhas" },
    { property: "og:description", content: "Monte sua sacola com frutas, verduras e itens de mercearia da Verdfrut e escolha o melhor horário de entrega." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

type Category = "Todos" | "Frutas" | "Verduras" | "Mercearia";
type Product = { id: number; name: string; category: Exclude<Category, "Todos">; unit: string; price: number; image: string; badge?: string };
type Step = "cart" | "checkout" | "done";

const categories = [
  { name: "Frutas" as const, image: frutas, count: "Frescas e coloridas", detail: "Do café da manhã à sobremesa" },
  { name: "Verduras" as const, image: verduras, count: "Verdes de verdade", detail: "Mais vida para o seu prato" },
  { name: "Mercearia" as const, image: mercearia, count: "Para o dia a dia", detail: "Essenciais da sua cozinha" },
];

const products: Product[] = [
  { id: 1, name: "Morango fresco", category: "Frutas", unit: "bandeja 250 g", price: 12.9, image: frutas, badge: "Queridinho" },
  { id: 2, name: "Maçã selecionada", category: "Frutas", unit: "aprox. 1 kg", price: 10.9, image: frutas },
  { id: 3, name: "Banana prata", category: "Frutas", unit: "aprox. 1 kg", price: 7.49, image: frutas },
  { id: 4, name: "Alface crespa", category: "Verduras", unit: "unidade", price: 4.9, image: verduras, badge: "Fresquinho" },
  { id: 5, name: "Brócolis ninja", category: "Verduras", unit: "unidade", price: 8.9, image: verduras },
  { id: 6, name: "Couve manteiga", category: "Verduras", unit: "maço", price: 5.49, image: verduras },
  { id: 7, name: "Pão artesanal", category: "Mercearia", unit: "unidade", price: 18.9, image: mercearia },
  { id: 8, name: "Azeite de oliva", category: "Mercearia", unit: "garrafa 500 ml", price: 39.9, image: mercearia },
  { id: 9, name: "Granola da casa", category: "Mercearia", unit: "pacote 400 g", price: 22.9, image: mercearia, badge: "Novidade" },
];

const FREE_SHIPPING = 150;
const SHIPPING_FEE = 9.9;
const slots = ["Hoje, 18h – 20h", "Amanhã, 08h – 10h", "Amanhã, 14h – 16h", "Amanhã, 18h – 20h"];
const payments = ["Pix", "Cartão na entrega", "Dinheiro na entrega"];

const formatPrice = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

function Brand({ light = false }: { light?: boolean }) {
  return <a href="#inicio" aria-label="Verdfrut, voltar ao início" className={`inline-flex items-center gap-2.5 font-display text-[27px] font-extrabold leading-none ${light ? "text-primary-foreground" : "text-primary"}`}><span className={`flex size-9 items-center justify-center rounded-full ${light ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"}`}><Leaf size={19} strokeWidth={2.7} /></span>verd<span className="text-secondary">frut</span></a>;
}

const inputCls = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring";

function Index() {
  const [category, setCategory] = useState<Category>("Todos");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [step, setStep] = useState<Step>("cart");
  const [form, setForm] = useState({ name: "", phone: "", cep: "", address: "", slot: slots[0], payment: payments[0] });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [order, setOrder] = useState<{ code: string; total: number } | null>(null);

  const filtered = useMemo(() => products.filter((p) => (category === "Todos" || p.category === category) && p.name.toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR").trim())), [category, query]);
  const items = products.filter((p) => (cart[p.id] ?? 0) > 0);
  const count = Object.values(cart).reduce((s, q) => s + q, 0);
  const subtotal = items.reduce((s, p) => s + p.price * cart[p.id], 0);
  const shipping = subtotal >= FREE_SHIPPING || subtotal === 0 ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  const changeQuantity = (id: number, delta: number) => setCart((c) => { const next = Math.max(0, Math.min(20, (c[id] ?? 0) + delta)); const copy = { ...c }; if (next === 0) delete copy[id]; else copy[id] = next; return copy; });
  const remove = (id: number) => setCart((c) => { const copy = { ...c }; delete copy[id]; return copy; });
  const chooseCategory = (selected: Category) => { setCategory(selected); document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };
  const openCart = () => { if (step === "done") setStep("cart"); setCartOpen(true); };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (form.name.trim().length < 3) err.name = "Informe seu nome completo.";
    if (form.phone.replace(/\D/g, "").length < 10) err.phone = "Informe um telefone com DDD.";
    if (form.cep.replace(/\D/g, "").length !== 8) err.cep = "O CEP deve ter 8 dígitos.";
    if (form.address.trim().length < 5) err.address = "Informe rua, número e bairro.";
    setErrors(err);
    if (Object.keys(err).length) return;
    setOrder({ code: `VF-${Math.floor(100000 + Math.random() * 900000)}`, total });
    setCart({});
    setStep("done");
  };

  const field = (key: "name" | "phone" | "cep" | "address", label: string, props: Record<string, string> = {}) => <label className="block text-sm"><span className="mb-1 block font-semibold text-foreground">{label}</span><input {...props} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} aria-invalid={!!errors[key]} className={inputCls} />{errors[key] && <span className="mt-1 block text-xs text-destructive">{errors[key]}</span>}</label>;

  return <div className="min-h-screen overflow-x-hidden">
    <div className="bg-plum-deep px-5 py-2.5 text-center text-[11px] font-semibold text-primary-foreground sm:text-xs">Frete grátis em compras acima de {formatPrice(FREE_SHIPPING)}</div>
    <header className="sticky top-0 z-30 bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl items-center gap-5 px-5 py-4 lg:px-8">
        <Brand light />
        <nav aria-label="Navegação principal" className="ml-12 hidden items-center gap-8 text-sm font-semibold lg:flex"><a className="hover:opacity-70" href="#categorias">Categorias</a><a className="hover:opacity-70" href="#produtos">Produtos</a><a className="hover:opacity-70" href="#entrega">Entrega</a></nav>
        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <a href="#produtos" className="hidden items-center gap-2 rounded-md border border-primary-foreground/25 px-3.5 py-2.5 text-xs font-medium hover:bg-primary-foreground/10 sm:inline-flex"><Search size={16} /> Buscar produtos</a>
          <Button type="button" onClick={openCart} aria-label={`Abrir sacola com ${count} itens`} className="relative h-10 bg-secondary px-3 text-secondary-foreground shadow-none hover:bg-secondary/90"><ShoppingBag size={19} /><span className="text-xs font-bold">{count}</span></Button>
          <Button type="button" variant="ghost" size="icon" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground lg:hidden">{menuOpen ? <X /> : <Menu />}</Button>
        </div>
      </div>
      {menuOpen && <nav aria-label="Menu móvel" className="flex flex-col gap-1 border-t border-primary-foreground/20 px-5 pb-5 pt-3 text-sm font-semibold lg:hidden"><a href="#categorias" onClick={() => setMenuOpen(false)} className="py-2">Categorias</a><a href="#produtos" onClick={() => setMenuOpen(false)} className="py-2">Produtos</a><a href="#entrega" onClick={() => setMenuOpen(false)} className="py-2">Entrega</a></nav>}
    </header>

    <main id="inicio">
      <section className="hero-surface relative isolate min-h-[495px] overflow-hidden sm:min-h-[560px]" aria-labelledby="hero-title">
        <img src={hero} width={1600} height={1000} alt="Frutas frescas, folhas verdes e berries reunidas sobre uma superfície clara" className="absolute inset-0 -z-20 h-full w-full object-cover object-[61%_center] md:object-center" />
        <div className="hero-photo-mask absolute inset-0 -z-10" />
        <div className="mx-auto flex min-h-[495px] max-w-7xl items-center px-5 py-14 sm:min-h-[560px] lg:px-8">
          <div className="max-w-[570px]">
            <div className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase text-accent-foreground"><span className="h-2 w-2 rounded-full bg-secondary" /> O frescor que inspira</div>
            <h1 id="hero-title" className="font-display text-[clamp(3.3rem,6vw,5.9rem)] font-extrabold leading-[.99] text-primary">Verdfrut.<br />Mais sabor em cada dia<span className="text-secondary">.</span></h1>
            <p className="mt-7 max-w-[430px] text-base leading-relaxed text-foreground/80 sm:text-lg">Frutas, verduras e escolhas gostosas para uma rotina cheia de vida.</p>
            <div className="mt-9 flex flex-wrap items-center gap-4"><Button asChild size="lg" className="h-12 bg-primary px-6 font-semibold text-primary-foreground shadow-none hover:bg-plum-deep"><a href="#produtos">Comprar agora <ArrowRight size={18} /></a></Button><a href="#categorias" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">Ver categorias <ChevronDown size={16} /></a></div>
          </div>
        </div>
      </section>

      <div id="entrega" className="scroll-mt-24 border-y border-border bg-surface"><div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-5 py-6 sm:grid-cols-3 lg:px-8">
        {[{ i: <Leaf size={20} />, t: "Seleção fresquinha", d: "Escolhidos todos os dias" }, { i: <Sparkles size={19} />, t: "Variedade de verdade", d: "Do hortifruti à mercearia" }, { i: <Truck size={20} />, t: "Entrega agendada", d: `Frete ${formatPrice(SHIPPING_FEE)} · grátis acima de ${formatPrice(FREE_SHIPPING)}` }].map((b) => <div key={b.t} className="flex items-center gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-leaf-light text-accent-foreground">{b.i}</span><div><strong className="block text-sm text-primary">{b.t}</strong><span className="text-xs text-muted-foreground">{b.d}</span></div></div>)}
      </div></div>

      <section id="categorias" className="scroll-mt-24 mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="mb-8"><span className="text-xs font-bold uppercase text-accent-foreground">Descubra a nossa seleção</span><h2 className="mt-2 font-display text-4xl font-bold text-primary sm:text-5xl">Escolha o que faz bem.</h2></div>
        <div className="grid gap-4 md:grid-cols-3">{categories.map((item) => <button key={item.name} type="button" onClick={() => chooseCategory(item.name)} className="group relative h-[320px] overflow-hidden rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-[360px]"><img src={item.image} alt={`Seleção de ${item.name.toLowerCase()}`} loading="lazy" width={816} height={816} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-plum-deep/90 via-plum-deep/10 to-transparent" /><div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-primary-foreground"><div><span className="text-xs font-semibold text-leaf-light">{item.count}</span><h3 className="mt-1 font-display text-3xl font-bold">{item.name}</h3><p className="mt-1 text-sm opacity-90">{item.detail}</p></div><span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-transform group-hover:translate-x-1"><ArrowRight size={19} /></span></div></button>)}</div>
      </section>

      <section id="produtos" className="scroll-mt-24 bg-surface py-16 lg:py-20"><div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-8"><span className="text-xs font-bold uppercase text-accent-foreground">Para colocar na sacola</span><h2 className="mt-2 font-display text-4xl font-bold text-primary sm:text-5xl">Uma seleção especial.</h2></div>
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filtrar produtos por categoria">{(["Todos", "Frutas", "Verduras", "Mercearia"] as Category[]).map((item) => <Button key={item} type="button" variant={category === item ? "default" : "outline"} onClick={() => setCategory(item)} aria-pressed={category === item} className={`h-9 shrink-0 px-4 text-sm shadow-none ${category === item ? "bg-primary text-primary-foreground hover:bg-plum-deep" : "border-border bg-surface text-foreground hover:bg-muted"}`}>{item}</Button>)}</div><label className="flex h-10 w-full items-center gap-2 rounded-md border border-input bg-background px-3 text-muted-foreground focus-within:ring-2 focus-within:ring-ring sm:w-64"><Search size={17} /><span className="sr-only">Buscar produto</span><input type="search" placeholder="Buscar produto..." value={query} onChange={(e) => setQuery(e.target.value)} className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" /></label></div>
        {filtered.length ? <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">{filtered.map((p) => { const q = cart[p.id] ?? 0; return <article key={p.id} className="product-card overflow-hidden rounded-md border border-border bg-card"><div className="product-image relative aspect-[1.35] overflow-hidden"><img src={p.image} alt={p.name} width={816} height={816} loading="lazy" className="h-full w-full object-cover" />{p.badge && <span className="absolute left-3 top-3 rounded-sm bg-leaf-light px-2.5 py-1 text-[10px] font-bold text-accent-foreground">{p.badge}</span>}</div><div className="p-3.5 sm:p-5"><span className="text-[10px] font-bold uppercase text-accent-foreground sm:text-xs">{p.category}</span><h3 className="mt-1 font-display text-base font-bold leading-snug text-foreground sm:text-xl">{p.name}</h3><p className="mt-1 text-xs text-muted-foreground">{p.unit}</p><div className="mt-5 flex flex-wrap items-center justify-between gap-2"><span className="font-display text-lg font-bold text-primary sm:text-2xl">{formatPrice(p.price)}</span>{q === 0 ? <Button type="button" onClick={() => changeQuantity(p.id, 1)} aria-label={`Adicionar ${p.name} à sacola`} className="h-9 bg-primary px-3 text-primary-foreground shadow-none hover:bg-plum-deep sm:h-10"><Plus size={17} /><span className="hidden sm:inline">Adicionar</span></Button> : <div className="inline-flex h-9 items-center rounded-md bg-primary text-primary-foreground sm:h-10"><Button type="button" variant="ghost" size="icon" className="size-9 text-primary-foreground hover:bg-plum-deep hover:text-primary-foreground" aria-label={`Diminuir ${p.name}`} onClick={() => changeQuantity(p.id, -1)}><Minus size={15} /></Button><span className="w-6 text-center text-sm font-bold" aria-live="polite">{q}</span><Button type="button" variant="ghost" size="icon" className="size-9 text-primary-foreground hover:bg-plum-deep hover:text-primary-foreground" aria-label={`Aumentar ${p.name}`} onClick={() => changeQuantity(p.id, 1)}><Plus size={15} /></Button></div>}</div></div></article>; })}</div> : <div className="rounded-md border border-dashed border-border py-16 text-center"><Search className="mx-auto mb-3 text-muted-foreground" size={25} /><h3 className="font-display text-xl font-semibold text-primary">Nenhum produto encontrado</h3><p className="mt-2 text-sm text-muted-foreground">Experimente outro termo ou categoria.</p><Button type="button" variant="link" onClick={() => { setQuery(""); setCategory("Todos"); }} className="mt-2 text-primary">Limpar filtros</Button></div>}
      </div></section>
    </main>

    <footer className="bg-plum-deep px-5 py-10 text-primary-foreground lg:px-8"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-end"><div><Brand light /><p className="mt-4 max-w-md text-sm leading-relaxed text-primary-foreground/75">Frutas, verduras e mercearia selecionadas com carinho para a sua casa.</p></div><nav className="flex gap-6 text-sm font-semibold"><a href="#categorias" className="hover:underline">Categorias</a><a href="#produtos" className="hover:underline">Produtos</a><a href="#entrega" className="hover:underline">Entrega</a></nav></div><div className="mx-auto mt-9 max-w-7xl border-t border-primary-foreground/20 pt-5 text-xs text-primary-foreground/60">© {new Date().getFullYear()} Verdfrut · Site demonstrativo, pedidos não são processados.</div></footer>

    {cartOpen && <div className="fixed inset-0 z-50 flex justify-end"><button type="button" className="absolute inset-0 bg-plum-deep/65" aria-label="Fechar sacola" onClick={() => setCartOpen(false)} /><aside role="dialog" aria-modal="true" aria-label="Sua sacola" className="relative flex h-full w-full max-w-md flex-col bg-surface shadow-2xl">
      <div className="flex items-center justify-between border-b border-border px-6 py-5"><div className="flex items-center gap-2">{step === "checkout" && <Button type="button" variant="ghost" size="icon" aria-label="Voltar para a sacola" onClick={() => setStep("cart")}><ArrowLeft size={20} /></Button>}<h2 className="font-display text-2xl font-bold text-primary">{step === "cart" ? <>Minha sacola <span className="text-base text-muted-foreground">({count})</span></> : step === "checkout" ? "Finalizar pedido" : "Pedido confirmado"}</h2></div><Button type="button" variant="ghost" size="icon" aria-label="Fechar sacola" onClick={() => setCartOpen(false)}><X size={22} /></Button></div>

      {step === "done" && order ? <div className="flex flex-1 flex-col items-center justify-center px-6 text-center"><CheckCircle2 size={56} className="text-secondary" /><h3 className="mt-5 font-display text-2xl font-bold text-primary">Obrigado, {form.name.split(" ")[0]}!</h3><p className="mt-2 text-sm text-muted-foreground">Pedido <strong className="text-foreground">{order.code}</strong> · {formatPrice(order.total)}</p><p className="mt-1 text-sm text-muted-foreground">Entrega: {form.slot} · {form.payment}</p><Button type="button" onClick={() => { setStep("cart"); setCartOpen(false); }} className="mt-8 bg-primary text-primary-foreground hover:bg-plum-deep">Continuar comprando</Button></div>
      : step === "checkout" ? <form onSubmit={submit} noValidate className="flex flex-1 flex-col overflow-hidden"><div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
        {field("name", "Nome completo", { autoComplete: "name" })}
        {field("phone", "Telefone", { type: "tel", autoComplete: "tel", placeholder: "(11) 99999-9999" })}
        {field("cep", "CEP", { inputMode: "numeric", autoComplete: "postal-code", placeholder: "00000-000" })}
        {field("address", "Endereço", { autoComplete: "street-address", placeholder: "Rua, número, bairro" })}
        <fieldset><legend className="mb-2 text-sm font-semibold">Horário de entrega</legend><div className="grid grid-cols-2 gap-2">{slots.map((s) => <label key={s} className={`cursor-pointer rounded-md border px-3 py-2 text-xs ${form.slot === s ? "border-primary bg-lilac font-semibold text-primary" : "border-border"}`}><input type="radio" name="slot" className="sr-only" checked={form.slot === s} onChange={() => setForm({ ...form, slot: s })} />{s}</label>)}</div></fieldset>
        <fieldset><legend className="mb-2 text-sm font-semibold">Pagamento</legend><div className="space-y-2">{payments.map((p) => <label key={p} className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm ${form.payment === p ? "border-primary bg-lilac font-semibold text-primary" : "border-border"}`}><input type="radio" name="payment" checked={form.payment === p} onChange={() => setForm({ ...form, payment: p })} className="accent-[var(--primary)]" />{p}</label>)}</div></fieldset>
      </div><Summary subtotal={subtotal} shipping={shipping} total={total}><Button type="submit" className="mt-5 h-11 w-full bg-primary text-primary-foreground hover:bg-plum-deep">Confirmar pedido</Button></Summary></form>
      : <><div className="flex-1 overflow-y-auto px-6 py-5">{count === 0 ? <div className="flex h-full flex-col items-center justify-center text-center"><ShoppingBag size={44} className="text-primary/35" /><h3 className="mt-5 font-display text-xl font-bold text-primary">Sua sacola está vazia</h3><p className="mt-2 text-sm text-muted-foreground">Escolha seus favoritos na seleção de produtos.</p><Button type="button" onClick={() => { setCartOpen(false); document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" }); }} className="mt-6 bg-primary text-primary-foreground hover:bg-plum-deep">Ver produtos</Button></div> : <>{subtotal < FREE_SHIPPING && <p className="mb-2 rounded-md bg-leaf-light px-3 py-2 text-xs text-accent-foreground">Faltam {formatPrice(FREE_SHIPPING - subtotal)} para o frete grátis.</p>}{items.map((p) => <div key={p.id} className="flex gap-4 border-b border-border py-4"><img src={p.image} alt="" width={80} height={80} className="size-20 rounded-md object-cover" /><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><h3 className="font-semibold text-foreground">{p.name}</h3><Button type="button" variant="ghost" size="icon" className="size-7 text-muted-foreground" aria-label={`Remover ${p.name}`} onClick={() => remove(p.id)}><Trash2 size={15} /></Button></div><p className="text-xs text-muted-foreground">{p.unit}</p><div className="mt-2 flex items-center justify-between"><div className="inline-flex h-8 items-center rounded-md border border-border"><Button type="button" variant="ghost" size="icon" className="size-8" aria-label={`Diminuir ${p.name}`} onClick={() => changeQuantity(p.id, -1)}><Minus size={14} /></Button><span className="w-7 text-center text-sm font-semibold">{cart[p.id]}</span><Button type="button" variant="ghost" size="icon" className="size-8" aria-label={`Aumentar ${p.name}`} onClick={() => changeQuantity(p.id, 1)}><Plus size={14} /></Button></div><strong className="text-sm text-primary">{formatPrice(p.price * cart[p.id])}</strong></div></div></div>)}<Button type="button" variant="link" onClick={() => setCart({})} className="mt-2 px-0 text-muted-foreground">Esvaziar sacola</Button></>}</div>
        {count > 0 && <Summary subtotal={subtotal} shipping={shipping} total={total}><Button type="button" onClick={() => setStep("checkout")} className="mt-5 h-11 w-full bg-primary text-primary-foreground hover:bg-plum-deep">Finalizar compra <ArrowRight size={16} /></Button></Summary>}</>}
    </aside></div>}
  </div>;
}

function Summary({ subtotal, shipping, total, children }: { subtotal: number; shipping: number; total: number; children: ReactNode }) {
  return <div className="border-t border-border px-6 py-5 text-sm"><div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div><div className="mt-1 flex justify-between text-muted-foreground"><span>Entrega</span><span>{shipping === 0 ? "Grátis" : formatPrice(shipping)}</span></div><div className="mt-3 flex justify-between font-display text-lg font-bold text-primary"><span>Total</span><span>{formatPrice(total)}</span></div>{children}</div>;
}
