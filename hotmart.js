// Separate Hotmart sales channel. The API alone binds and activates purchases.
"use strict";
(() => {
  const i18n = window.SomoraI18n;
  const copy = [
    ["title", "Crie sua próxima música com o Somora.", "Create your next song with Somora.", "Crea tu próxima canción con Somora."],
    ["intro", "Transforme uma ideia em música com voz ou instrumental. Escreva um pedido na Geração fácil ou controle letra, estilo e duração no modo Avançado.", "Turn an idea into a song with vocals or an instrumental. Describe it in Easy generation, or control lyrics, style, and duration in Advanced mode.", "Convierte una idea en música con voz o instrumental. Descríbela en Generación fácil o controla letra, estilo y duración en el modo Avanzado."],
    ["features", "Geração musical com IA · Letras com IA · Download FLAC · Editor online Kassio Studio", "AI music generation · AI lyrics · FLAC downloads · Kassio Studio online editor", "Generación musical con IA · Letras con IA · Descargas FLAC · Editor online Kassio Studio"],
    ["channel", "ASSINATURAS PELA HOTMART", "SUBSCRIPTIONS THROUGH HOTMART", "SUSCRIPCIONES POR HOTMART"],
    ["notice", "Nesta página, a compra é processada pela Hotmart. Crie sua conta no Somora ou entre antes de continuar: o acesso será vinculado à conta exibida abaixo.", "On this page, purchases are processed by Hotmart. Create your Somora account or sign in first: access will be linked to the account shown below.", "En esta página, Hotmart procesa la compra. Crea tu cuenta de Somora o inicia sesión primero: el acceso se vinculará a la cuenta que aparece abajo."],
    ["monthly", "por mês", "per month", "por mes"],
    ["recurring", "Assinatura mensal com renovação automática. Confira valor, moeda, tributos e condições finais no checkout da Hotmart antes de pagar.", "Monthly subscription with automatic renewal. Review the final price, currency, taxes, and conditions in Hotmart checkout before paying.", "Suscripción mensual con renovación automática. Revisa el precio final, moneda, impuestos y condiciones en el checkout de Hotmart antes de pagar."],
    ["rights", "A contratação inicial tem prazo de reembolso de 7 dias ou prazo maior indicado na oferta. Cancelar a renovação preserva o período já pago e não solicita um reembolso automaticamente. Seus direitos legais permanecem preservados.", "The initial purchase has a 7-day refund period, or a longer period stated in the offer. Cancelling renewal preserves the paid period and does not automatically request a refund. Your statutory rights remain unaffected.", "La contratación inicial tiene un plazo de reembolso de 7 días o uno mayor indicado en la oferta. Cancelar la renovación conserva el período pagado y no solicita un reembolso automáticamente. Tus derechos legales se mantienen."],
    ["disabled", "As assinaturas pela Hotmart ainda estão sendo preparadas. Você já pode criar uma conta gratuita e conhecer o Estúdio.", "Hotmart subscriptions are still being prepared. You can already create a free account and explore the Studio.", "Las suscripciones por Hotmart aún se están preparando. Ya puedes crear una cuenta gratuita y conocer el Estudio."],
    ["login", "Entrar ou criar conta", "Sign in or create an account", "Entrar o crear una cuenta"],
    ["verify", "Confirme seu e-mail antes de continuar para o pagamento. Use o aviso de verificação da sua conta e depois atualize esta página.", "Verify your email before continuing to payment. Use your account verification notice, then refresh this page.", "Confirma tu correo antes de continuar al pago. Usa el aviso de verificación de tu cuenta y después actualiza esta página."],
    ["buy", "Continuar para a Hotmart", "Continue to Hotmart", "Continuar a Hotmart"],
    ["open", "Abrir pagamento na Hotmart", "Open Hotmart checkout", "Abrir pago en Hotmart"],
    ["retry", "Recuperar este checkout", "Recover this checkout", "Recuperar este checkout"],
    ["new", "Criar novo checkout", "Create a new checkout", "Crear un nuevo checkout"],
    ["wait", "Aguarde…", "Please wait…", "Espera…"],
    ["refresh", "Verificar pagamento e acesso", "Check payment and access", "Verificar pago y acceso"],
    ["pending", "Pagamento ainda não confirmado. A ativação depende da confirmação da Hotmart; abrir ou retornar do checkout não libera o plano.", "Payment has not been confirmed yet. Access requires confirmation from Hotmart; opening or returning from checkout does not activate the plan.", "El pago aún no está confirmado. La activación depende de la confirmación de Hotmart; abrir o volver del checkout no activa el plan."],
    ["approved", "A Hotmart confirmou o pagamento. Consulte seu plano atualizado na Conta; se a ativação ainda estiver pendente, verifique novamente em instantes.", "Hotmart confirmed payment. Check your updated plan in Account; if activation is still pending, check again shortly.", "Hotmart confirmó el pago. Consulta tu plan actualizado en Cuenta; si la activación sigue pendiente, verifica de nuevo en unos instantes."],
    ["uncertain", "Não foi possível confirmar a criação do checkout. Ao recuperar, a mesma solicitação será reutilizada para evitar duplicidade.", "Checkout creation could not be confirmed. Recovery reuses the same request to avoid duplicates.", "No se pudo confirmar la creación del checkout. La recuperación reutiliza la misma solicitud para evitar duplicados."],
    ["error", "Não foi possível consultar a Hotmart agora. Tente novamente.", "Hotmart could not be checked right now. Try again.", "No se pudo consultar Hotmart ahora. Inténtalo de nuevo."],
    ["invalid", "A resposta do pagamento não pôde ser validada. Não abra links recebidos fora desta página; tente verificar novamente.", "The payment response could not be validated. Do not open links received outside this page; try checking again.", "No se pudo validar la respuesta del pago. No abras enlaces recibidos fuera de esta página; intenta verificar de nuevo."],
    ["account", "Assinaturas Hotmart", "Hotmart subscriptions", "Suscripciones Hotmart"],
    ["empty", "Nenhuma assinatura Hotmart foi encontrada nesta conta.", "No Hotmart subscriptions were found for this account.", "No se encontraron suscripciones Hotmart en esta cuenta."],
    ["manage", "Gerenciar na Hotmart", "Manage in Hotmart", "Gestionar en Hotmart"],
    ["manageHelp", "Consulte cobranças, cancelamento e solicitações de reembolso na área de compras da Hotmart, usando o e-mail da compra. Se precisar de ajuda com o acesso ao Somora, abra um ticket no Suporte.", "View charges, cancellation, and refund requests in Hotmart's purchases area, using your purchase email. For help with Somora access, open a Support ticket.", "Consulta cobros, cancelación y solicitudes de reembolso en el área de compras de Hotmart con el correo de la compra. Para ayuda con el acceso a Somora, abre un ticket en Soporte."],
    ["play", "Neste aplicativo, consulte os planos e pagamentos do Google Play na página de Planos.", "In this app, view Google Play plans and payments on the Plans page.", "En esta aplicación, consulta los planes y pagos de Google Play en la página de Planes."],
    ["demo", "Esta demonstração não cria compras nem assinaturas.", "This demo does not create purchases or subscriptions.", "Esta demostración no crea compras ni suscripciones."],
    ["terms", "Termos de uso", "Terms of use", "Términos de uso"],
    ["status.active", "Ativa", "Active", "Activa"], ["status.approved", "Pagamento confirmado", "Payment confirmed", "Pago confirmado"],
    ["status.pending", "Aguardando confirmação", "Awaiting confirmation", "Esperando confirmación"],
    ["status.cancelled", "Cancelada", "Cancelled", "Cancelada"], ["status.expired", "Expirada", "Expired", "Caducada"],
    ["status.refunded", "Reembolsada", "Refunded", "Reembolsada"], ["status.charged_back", "Contestada", "Charged back", "Reclamada"],
    ["history", "Histórico de pagamentos", "Payment history", "Historial de pagos"],
    ["status.rejected", "Rejeitada", "Rejected", "Rechazada"], ["status.delayed", "Pagamento em atraso", "Payment overdue", "Pago atrasado"],
    ["status.needs_attention", "Em análise", "Under review", "En revisión"],
  ];
  for (const [key, pt, en, es] of copy) for (const [language, value] of [["pt-BR", pt], ["en", en], ["es", es]]) i18n.catalogues[language][`hotmart.${key}`] = value;
  const t = key => i18n.t(`hotmart.${key}`);
  const escape = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
  const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
  const affiliatePattern = /^[A-Za-z0-9_-]{6,80}$/;
  const statusKeys = new Set(["active", "approved", "pending", "cancelled", "expired", "refunded", "charged_back", "rejected", "delayed", "needs_attention"]);
  const pendingKey = "somora.hotmart-checkout", attributionKey = "somora.hotmart-affiliate", returnKey = "somora.hotmart-return";
  const managementUrl = "https://purchase.hotmart.com/";
  let hooks = {}, config = null, configLoading = false, configError = "", configFetched = 0, routeTouched = false;
  let state = emptyState("");
  const initialHash = location.hash;
  const isPlay = () => Boolean(hooks.isPlay?.() || window.SomoraAndroid?.isPlay);
  const isDemo = () => Boolean(hooks.isDemo?.());
  const user = () => hooks.getSession?.().user;
  const onPage = () => hooks.getScreen?.() === "hotmart";
  const onAccount = () => hooks.getScreen?.() === "account";
  function emptyState(owner) { return { owner, checkout: null, reference: null, busy: false, error: "", subscriptions: [], orders: [], loaded: false, loading: false, fetched: 0, checkoutFetched: 0 }; }
  function read(key) { try { return JSON.parse(window.sessionStorage.getItem(key) || "null"); } catch { return null; } }
  function write(key, value) { try { value ? window.sessionStorage.setItem(key, JSON.stringify(value)) : window.sessionStorage.removeItem(key); } catch { /* Memory still preserves the current request. */ } }
  function isHotmartChannel() { return window.SOMORA_CONFIG?.IS_HOTMART_PORTAL === true; }
  function captureAttribution() {
    if (!isHotmartChannel()) return;
    const query = new URLSearchParams(location.search), ref = query.get("ref");
    if (ref && affiliatePattern.test(ref)) write(attributionKey, { ref, expiresAt: Date.now() + 30 * 86400000 });
    if (query.has("ref")) { const url = new URL(location.href); url.searchParams.delete("ref"); window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`); }
  }
  function affiliateRef() { const saved = read(attributionKey); return saved && affiliatePattern.test(saved.ref || "") && Number.isFinite(saved.expiresAt) && saved.expiresAt > Date.now() && saved.expiresAt <= Date.now() + 30 * 86400000 ? saved.ref : ""; }
  function selectedPlan() { const value = new URLSearchParams(location.hash.split("?")[1] || "").get("plan"); return ["basic", "intermediate", "complete"].includes(value) ? value : ""; }
  function safeReturnHash(hash) { return /^#hotmart(?:\?plan=(?:basic|intermediate|complete))?$/.test(hash || "") ? hash : ""; }
  function rememberReturn() { if (!isDemo() && !isPlay() && onPage()) write(returnKey, { hash: selectedPlan() ? `#hotmart?plan=${selectedPlan()}` : "#hotmart", expiresAt: Date.now() + 15 * 60000 }); }
  function restoreReturn() {
    if (!user() || isPlay() || isDemo() || initialHash || location.hash || routeTouched) return;
    const saved = read(returnKey); write(returnKey, null);
    if (safeReturnHash(saved?.hash) && saved.expiresAt > Date.now() && saved.expiresAt <= Date.now() + 15 * 60000) location.hash = saved.hash;
  }
  function clear() { write(returnKey, null); write(pendingKey, null); state = emptyState(""); patch(); }
  function syncSession() {
    const owner = user()?.id || "";
    if (state.owner !== owner) {
      state = emptyState(owner);
      const saved = read(pendingKey);
      if (owner && saved?.owner === owner && uuid.test(saved.requestKey || "") && ["basic", "intermediate", "complete"].includes(saved.planId) && ["pt-BR", "en", "es"].includes(saved.locale)) state.reference = { owner, requestKey: saved.requestKey, planId: saved.planId, locale: saved.locale, id: uuid.test(saved.id || "") ? saved.id : "", affiliateRef: affiliatePattern.test(saved.affiliateRef || "") ? saved.affiliateRef : "" };
      else if (saved) write(pendingKey, null);
    }
    restoreReturn();
    return state;
  }
  function live(run) { return state === run && run.owner && run.owner === user()?.id && !isDemo() && !isPlay(); }
  function checkoutUrl(value) {
    try { const url = new URL(value); return url.protocol === "https:" && url.hostname === "pay.hotmart.com" && !url.username && !url.password && !url.port && /^\/[A-Za-z0-9]+\/?$/.test(url.pathname) && !url.hash ? url.href : ""; } catch { return ""; }
  }
  function normalizeCheckout(result) {
    const value = result?.checkout;
    if (!value || !uuid.test(value.id || "") || !["basic", "intermediate", "complete"].includes(value.planId) || !["created", "pending", "approved", "cancelled", "expired", "rejected", "refunded", "charged_back", "needs_attention"].includes(value.status)) throw Error(t("invalid"));
    const url = value.url ? checkoutUrl(value.url) : "";
    if (value.url && !url) throw Error(t("invalid"));
    return { id: value.id, planId: value.planId, status: value.status, url, expiresAt: value.expiresAt || null };
  }
  function price(cents) { return new Intl.NumberFormat(i18n.locale, { style: "currency", currency: "BRL" }).format(cents / 100); }
  function status(value) { return t(`status.${statusKeys.has(value) ? value : "pending"}`); }
  function termsUrl() { return hooks.termsUrl?.() || "/en/terms/"; }
  function errorText(error) { return hooks.errorMessage?.(error) || error?.message || t("error"); }
  function checkoutMarkup() {
    const checkout = state.checkout, reference = state.reference;
    if (!checkout && !reference) return "";
    const canOpen = checkout && ["created", "pending"].includes(checkout.status) && checkout.url && Date.parse(checkout.expiresAt || "") > Date.now();
    const canCreateNew = checkout && (["cancelled", "expired", "rejected", "refunded", "charged_back"].includes(checkout.status) || checkout.status === "created" && !checkout.url && Date.parse(checkout.expiresAt || "") <= Date.now());
    return `<section class="panel hotmart-checkout" aria-labelledby="hotmart-checkout-title"><h2 id="hotmart-checkout-title">${escape(i18n.planName(checkout?.planId || reference.planId))}</h2><p role="status">${escape(checkout?.status === "approved" ? t("approved") : checkout && !["created", "pending"].includes(checkout.status) ? status(checkout.status) : checkout ? t("pending") : t("uncertain"))}</p><div class="hotmart-actions">${canOpen ? `<a class="button primary" href="${escape(checkout.url)}" target="_blank" rel="noopener noreferrer">${t("open")}</a>` : !checkout ? `<button type="button" class="button secondary" data-hotmart="recover" ${state.busy ? "disabled" : ""}>${t("retry")}</button>` : ""}${canCreateNew ? `<button type="button" class="button secondary" data-hotmart="new-checkout" ${state.busy ? "disabled" : ""}>${t("new")}</button>` : ""}<button type="button" class="button secondary" data-hotmart="refresh" ${state.busy ? "disabled" : ""}>${t("refresh")}</button></div></section>`;
  }
  function planDetails(planId) {
    const plan = hooks.getSession?.().plans?.find(item => item.id === planId);
    if (!plan) return "";
    const features = [];
    if (Number.isSafeInteger(plan.limit) && plan.limit >= 0) features.push(i18n.t(plan.period === "day" ? "plans.generationsDay" : "plans.generations", { count: plan.limit }));
    if (Number.isFinite(plan.maxDuration) && plan.maxDuration > 0) features.push(i18n.t("plans.duration", { seconds: plan.maxDuration }));
    return features.length ? `<ul class="hotmart-plan-details">${features.map(value => `<li>${escape(value)}</li>`).join("")}</ul>` : "";
  }
  function markup() {
    if (isPlay()) return `<section id="hotmart-page" class="panel hotmart-page"><h1>Somora</h1><p>${t("play")}</p><button class="button primary" data-screen="plans">${i18n.t("nav.plans")}</button></section>`;
    const sessionUser = user(), chosen = selectedPlan();
    return `<section id="hotmart-page" class="hotmart-page"><section class="page-intro compact"><div><div class="eyebrow"><span></span>${t("channel")}</div><h1>${t("title")}</h1><p>${t("intro")}</p><p class="hotmart-features">${t("features")}</p></div></section><section class="panel hotmart-notice"><p>${t("notice")}</p>${sessionUser ? `<p><strong>${escape(sessionUser.name)}</strong> · ${escape(sessionUser.email)}</p>` : `<button type="button" class="button primary" data-hotmart="login">${t("login")}</button>`}<p class="input-help">${t("recurring")}</p><p class="input-help">${t("rights")} <a href="${escape(termsUrl())}">${t("terms")}</a></p>${sessionUser && !sessionUser.emailVerified ? `<p class="hotmart-feedback">${t("verify")}</p>` : ""}${sessionUser && ["basic", "intermediate", "complete"].includes(sessionUser.plan) ? `<p class="input-help">${escape(i18n.t("plans.existing"))}</p>` : ""}</section><div class="hotmart-feedback" role="status">${escape(isDemo() ? t("demo") : state.error || configError || (configLoading ? t("wait") : config?.enabled ? "" : t("disabled")))}</div>${config?.enabled && !isDemo() ? `<div class="hotmart-plans">${config.plans.map(plan => `<article class="panel hotmart-plan ${chosen === plan.id ? "selected" : ""}"><h2>${escape(i18n.planName(plan.id))}</h2><p class="hotmart-price">${escape(price(plan.amountCents))} <span>${t("monthly")}</span></p>${planDetails(plan.id)}<button type="button" class="button primary" data-hotmart="buy" data-hotmart-plan="${plan.id}" ${state.busy || sessionUser && !sessionUser.emailVerified ? "disabled" : ""}>${state.busy ? t("wait") : t("buy")}</button></article>`).join("")}</div>` : ""}${!isDemo() && sessionUser ? checkoutMarkup() : ""}<div class="hotmart-actions"><a class="button secondary" href="${escape(hooks.studioUrl?.() || "https://somora.media/#estudio")}">${i18n.t("common.openStudio")}</a>${sessionUser ? `<button class="button secondary" data-screen="account">${i18n.t("nav.account")}</button>` : ""}</div></section>`;
  }
  function accountPanel() {
    if (!user() || isPlay() || isDemo()) return "";
    return `<section id="hotmart-account" class="panel hotmart-account"><div class="section-heading"><h2>${t("account")}</h2><button type="button" class="text-button" data-hotmart="refresh" ${state.loading || state.busy ? "disabled" : ""}>${i18n.t("common.refresh")}</button></div><p class="hotmart-feedback" role="status">${escape(state.error || (state.loading && !state.loaded ? t("wait") : ""))}</p>${state.subscriptions.length ? `<ul class="hotmart-subscriptions">${state.subscriptions.map(row => `<li><strong>${escape(i18n.planName(row.planId))}</strong><span>${escape(status(row.status))}</span>${row.planExpiresAt && Number.isFinite(Date.parse(row.planExpiresAt)) ? `<span>${escape(i18n.t("billing.activeUntil", { date: new Date(row.planExpiresAt).toLocaleDateString(i18n.locale) }))}</span>` : ""}</li>`).join("")}</ul>` : state.loaded ? `<p>${t("empty")}</p>` : ""}${state.orders.length ? `<h3>${t("history")}</h3><ul class="hotmart-subscriptions">${state.orders.map(row => `<li><strong>${escape(i18n.planName(row.planId))}</strong><span>${escape(status(row.status))}</span><span>${escape(price(row.amountCents))}</span>${row.approvedAt && Number.isFinite(Date.parse(row.approvedAt)) ? `<span>${escape(new Date(row.approvedAt).toLocaleDateString(i18n.locale))}</span>` : ""}</li>`).join("")}</ul>` : ""}<p class="input-help">${t("manageHelp")}</p><a class="button secondary" href="${managementUrl}" target="_blank" rel="noopener noreferrer">${t("manage")}</a></section>`;
  }
  function patch() { const page = document.querySelector("#hotmart-page"); if (page) page.outerHTML = markup(); const account = document.querySelector("#hotmart-account"); if (account) account.outerHTML = accountPanel(); }
  async function loadConfig(force = false) {
    if (configLoading || !force && configFetched && Date.now() - configFetched < 60000 || isDemo() || isPlay()) return;
    configLoading = true;
    try {
      const result = await hooks.request("/api/billing/hotmart/config");
      if (!result || typeof result.enabled !== "boolean" || result.enabled && (result.currency !== "BRL" || !Array.isArray(result.plans))) throw Error(t("invalid"));
      const plans = result.enabled ? result.plans.filter(plan => ["basic", "intermediate", "complete"].includes(plan?.id) && Number.isSafeInteger(plan.amountCents) && plan.amountCents > 0 && plan.recurring === true) : [];
      if (result.enabled && (!plans.length || plans.length !== result.plans.length || new Set(plans.map(plan => plan.id)).size !== plans.length)) throw Error(t("invalid"));
      config = { enabled: result.enabled, plans }; configFetched = Date.now(); configError = "";
    } catch (error) { config = null; configError = errorText(error); configFetched = Date.now(); }
    finally { configLoading = false; patch(); }
  }
  async function refreshCheckout(run) {
    if (!live(run) || !run.reference?.id) return;
    const checkout = normalizeCheckout(await hooks.request(`/api/billing/hotmart/checkouts/${encodeURIComponent(run.reference.id)}`));
    if (!live(run)) return;
    if (checkout.id !== run.reference.id || checkout.planId !== run.reference.planId) throw Error(t("invalid"));
    const previouslyApproved = run.checkout?.status === "approved"; run.checkout = checkout; run.checkoutFetched = Date.now();
    if (checkout.status === "approved" && !previouslyApproved) await hooks.refreshSession?.();
  }
  async function refresh(force = false) {
    const run = syncSession();
    if (!live(run) || run.loading || !onPage() && !onAccount() || !force && run.fetched && Date.now() - run.fetched < 15000) return;
    run.loading = true; run.error = ""; patch();
    try {
      const result = await hooks.request("/api/billing/hotmart/subscriptions");
      if (!live(run)) return;
      if (!Array.isArray(result?.subscriptions)) throw Error(t("invalid"));
      run.subscriptions = result.subscriptions.filter(row => row && ["basic", "intermediate", "complete"].includes(row.planId) && typeof row.status === "string").map(row => ({ planId: row.planId, status: row.status, planExpiresAt: row.planExpiresAt || null }));
      run.orders = (Array.isArray(result.orders) ? result.orders : []).filter(row => row && ["basic", "intermediate", "complete"].includes(row.planId) && Number.isSafeInteger(row.amountCents) && row.amountCents >= 0 && row.currency === "BRL").map(row => ({ planId: row.planId, status: row.status, amountCents: row.amountCents, approvedAt: row.approvedAt || null }));
      run.loaded = true; run.fetched = Date.now();
      if (run.reference?.id && (force || Date.now() - run.checkoutFetched > 15000)) await refreshCheckout(run);
    } catch (error) { if (live(run)) { run.error = errorText(error); run.fetched = Date.now(); } }
    finally { if (live(run)) { run.loading = false; patch(); } }
  }
  async function buy(planId, recover = false) {
    const run = syncSession();
    if (isPlay() || isDemo() || run.busy || !onPage() || !config?.enabled || !config.plans.some(plan => plan.id === planId)) return;
    if (!user()) { location.hash = `#hotmart?plan=${planId}`; rememberReturn(); hooks.openAuth?.(); return; }
    if (!user().emailVerified) { run.error = t("verify"); patch(); return; }
    if (run.reference && !recover && run.reference.planId === planId && run.reference.id) { await refresh(true); return; }
    if (recover && run.reference?.planId !== planId) return;
    run.busy = true; run.error = "";
    const reference = run.reference?.planId === planId && !run.reference.id ? run.reference : { owner: run.owner, planId, requestKey: crypto.randomUUID(), locale: i18n.language, affiliateRef: affiliateRef(), id: "" };
    run.reference = reference; write(pendingKey, reference); patch();
    try {
      const result = await hooks.request("/api/billing/hotmart/checkouts", { method: "POST", body: JSON.stringify({ planId, requestKey: reference.requestKey, locale: reference.locale, ...(reference.affiliateRef ? { affiliateRef: reference.affiliateRef } : {}) }) });
      if (!live(run)) return;
      const checkout = normalizeCheckout(result);
      if (checkout.planId !== reference.planId) throw Error(t("invalid"));
      run.checkout = checkout; reference.id = checkout.id; write(pendingKey, reference); run.checkoutFetched = Date.now();
    } catch (error) { if (live(run)) run.error = errorText(error); }
    finally { if (live(run)) { run.busy = false; patch(); } }
  }
  async function newCheckout() {
    const checkout = state.checkout;
    if (!state.busy && checkout && (["cancelled", "expired", "rejected", "refunded", "charged_back"].includes(checkout.status) || checkout.status === "created" && !checkout.url && Date.parse(checkout.expiresAt || "") <= Date.now())) {
      state.reference = null; state.checkout = null; write(pendingKey, null); await buy(checkout.planId);
    }
  }
  async function mount() { syncSession(); if (onPage()) await loadConfig(); if (onPage() || onAccount()) await refresh(); }
  function configure(value) { hooks = value; captureAttribution(); syncSession(); }
  document.addEventListener("click", event => {
    if (event.target.closest?.("[data-google-auth]")) rememberReturn();
    const button = event.target.closest?.("[data-hotmart]"); if (!button || button.disabled) return;
    event.preventDefault();
    switch (button.dataset.hotmart) {
      case "login": rememberReturn(); hooks.openAuth?.(); break;
      case "buy": void buy(button.dataset.hotmartPlan); break;
      case "recover": if (state.reference) void buy(state.reference.planId, true); break;
      case "new-checkout": void newCheckout(); break;
      case "refresh": void refresh(true); if (onPage()) void loadConfig(true); break;
    }
  });
  window.addEventListener("hashchange", () => { routeTouched = true; if (location.hash.split("?")[0] !== "#hotmart") write(returnKey, null); });
  window.SomoraHotmart = Object.freeze({ configure, captureAttribution, isHotmartChannel, markup, accountPanel, mount, syncSession, clear });
})();
