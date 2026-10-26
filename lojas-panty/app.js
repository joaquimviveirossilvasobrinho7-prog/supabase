// Cole aqui os dados do seu projeto Supabase, mantendo as aspas.
const SUPABASE_URL = "https://pdtafajmzwgllkanzavs.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable__8Txj5D9nm3zntubRF_kuw_CeMLoX5n";

const grid = document.querySelector("#products-grid");
const message = document.querySelector("#connection-message");
let products = [];
let category = "Todos";

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}
function brl(value) {
  return Number(value).toLocaleString("pt-BR", {style:"currency",currency:"BRL"});
}
function render() {
  const visible = category === "Todos" ? products : products.filter(p => p.categoria === category);
  if (!visible.length) {
    grid.innerHTML = '<div class="empty">Nenhum produto nesta categoria ainda.</div>';
    return;
  }
  grid.innerHTML = visible.map(p => `<article class="card">
    <div class="product-image">${p.imagem_url ? `<img src="${escapeHTML(p.imagem_url)}" alt="${escapeHTML(p.nome)}" onerror="this.style.display='none'">` : '<div class="placeholder">P.</div>'}</div>
    <div class="info"><div class="category">${escapeHTML(p.categoria || "Coleção")}</div>
    <h3>${escapeHTML(p.nome)}</h3><p class="desc">${escapeHTML(p.descricao || "Uma escolha para completar seu estilo.")}</p>
    <div class="bottom"><span class="price">${brl(p.preco)}</span><button class="buy" data-name="${escapeHTML(p.nome)}">Tenho interesse ↗</button></div></div></article>`).join("");
  grid.querySelectorAll(".buy").forEach(btn => btn.addEventListener("click", () => {
    alert(`Você se interessou por: ${btn.dataset.name}. O checkout ainda precisa ser configurado antes de aceitar pagamentos.`);
  }));
}
document.querySelectorAll(".filters button").forEach(btn => btn.addEventListener("click", () => {
  document.querySelectorAll(".filters button").forEach(b => b.classList.remove("active"));
  btn.classList.add("active"); category = btn.dataset.category; render();
}));
async function start() {
  if (!window.supabase || SUPABASE_URL.startsWith("COLE_AQUI") || SUPABASE_PUBLISHABLE_KEY.startsWith("COLE_AQUI")) {
    message.textContent = "Configure a URL e a chave pública no arquivo app.js para carregar os produtos.";
    grid.innerHTML = '<div class="empty">Sua vitrine aparecerá aqui depois da conexão.</div>'; return;
  }
  try {
    const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
    const {data, error} = await client.from("produtos").select("id,nome,preco,descricao,categoria,imagem_url").order("criado_em", {ascending:false});
    if (error) throw error;
    products = data || [];
    message.textContent = `${products.length} produto(s) carregado(s) do Supabase.`;
    render();
  } catch (error) {
    console.error(error);
    message.textContent = "Não foi possível conectar. Confira a URL, a chave e as permissões da tabela.";
    grid.innerHTML = '<div class="empty">Falha ao carregar o catálogo. Confira a configuração no app.js.</div>';
  }
}
start();
