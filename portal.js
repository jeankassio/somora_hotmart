"use strict";
(() => {
  const i18n = window.SomoraI18n, hotmart = window.SomoraHotmart;
  const t = (key, values) => i18n.t(key, values);
  const escape = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
  const logo = `<svg class="logo-mark" width="34" height="34" viewBox="0 0 36 36" fill="none" aria-hidden="true"><path d="M7 12v12M13 7v22M19 12v12M25 5v26M31 13v10" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/></svg>`;
  const apiBase = (window.SOMORA_CONFIG?.API_URL || "https://api.somora.media/api").replace(/\/$/, "");
  // Navigation destinations are fixed public Somora origins, never a query-string URL.
  const site = "https://somora.media/";
  const app = document.querySelector("#app"), dialogRoot = document.querySelector("#dialog-root");
  const screen = () => location.hash.split("?")[0] === "#conta" ? "account" : "hotmart";
  let session = { user: null, plans: [] }, loading = true, refreshing = false, revision = 0;
  let authMode = "login", authOpen = false, authBusy = false, authError = "", notice = "", loggingOut = false;
  function publicPage(type) { const paths = { "pt-BR": { terms: "termos/", privacy: "privacidade/", support: "suporte/" }, en: { terms: "en/terms/", privacy: "en/privacy/", support: "en/support/" }, es: { terms: "es/terminos/", privacy: "es/privacidad/", support: "es/soporte/" } }; return site + paths[i18n.language][type]; }
  function studioUrl() { return `${site}?lang=${encodeURIComponent(i18n.language)}#estudio`; }
  function translateError(error) {
    const codes = { hotmart_subscription_exists: "errors.existingHotmart", other_subscription_exists: "errors.existingProvider", hotmart_checkout_conflict: "errors.conflict", hotmart_checkout_not_found: "errors.checkoutNotFound" };
    if (codes[error?.code]) return t(codes[error.code]);
    if (error?.code === "email_not_verified" || error?.code === "email_verification_required") return t("errors.verified");
    if (error?.status === 429) return t("errors.rate");
    if (error?.status === 401) return t("errors.auth");
    if (error?.status === 503) return t("errors.disabled");
    return error?.message || t("errors.connection");
  }
  async function request(path, options = {}) {
    if (!/^\/api\/[A-Za-z0-9/_?=&.-]+$/.test(path)) throw Error(t("errors.connection"));
    const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 25000);
    try {
      const response = await fetch(apiBase + path.slice(4), { ...options, credentials: "include", signal: controller.signal, headers: { Accept: "application/json", "Accept-Language": i18n.language, ...(options.body ? { "Content-Type": "application/json" } : {}), ...options.headers } });
      const result = await response.json().catch(() => null);
      if (!response.ok) { const error = Error(typeof result?.error === "string" ? result.error : result?.message || t("errors.connection")); error.status = response.status; error.code = result?.code || ""; throw error; }
      return result;
    } catch (error) { if (error?.status) throw error; throw Error(t("errors.connection")); }
    finally { clearTimeout(timeout); }
  }
  function languagePicker() { return `<div class="languages" role="group" aria-label="Language">${[["pt-BR", "PT"], ["en", "EN"], ["es", "ES"]].map(([language, label]) => `<button type="button" data-language="${language}" aria-pressed="${i18n.language === language}">${label}</button>`).join("")}</div>`; }
  function accountMarkup() {
    if (!session.user) return `<section class="panel account-welcome"><div class="eyebrow">SOMORA</div><h1>${t("account.title")}</h1><p>${t("auth.shared")}</p><button type="button" class="button primary" data-auth="login">${t("common.login")}</button></section>`;
    const user = session.user;
    return `<section class="account-heading"><div class="eyebrow">SOMORA</div><h1>${t("account.title")}</h1><p>${t("brand.accountHelp")}</p></section><section class="panel account-details"><h2>${escape(user.name)}</h2><p>${escape(user.email)}</p><span class="badge">${t(user.emailVerified ? "account.verified" : "account.unverified")}</span><p>${escape(t("account.currentPlan", { plan: i18n.planName(user.plan) }))}</p>${user.planExpiresAt && Number.isFinite(Date.parse(user.planExpiresAt)) ? `<p class="input-help">${escape(t("billing.activeUntil", { date: new Date(user.planExpiresAt).toLocaleDateString(i18n.locale) }))}</p>` : ""}<div class="hotmart-actions">${!user.emailVerified ? `<button type="button" class="button secondary" data-action="verify">${t("account.verify")}</button>` : ""}<button type="button" class="button secondary" data-action="refresh">${t("common.refresh")}</button><a class="button primary" href="${studioUrl()}">${t("common.openStudio")}</a></div></section>${hotmart.accountPanel()}<section class="account-logout"><p class="input-help">${t("account.logoutHelp")}</p><button type="button" class="button secondary" data-action="logout" ${loggingOut ? "disabled" : ""}>${t(loggingOut ? "common.wait" : "common.logout")}</button></section>`;
  }
  function render() {
    document.documentElement.lang = i18n.language; document.title = t("meta.title"); document.querySelector('meta[name="description"]')?.setAttribute("content", t("meta.description"));
    const skip = document.querySelector(".skip-link"); if (skip) skip.textContent = t("common.skipContent");
    hotmart.syncSession();
    app.innerHTML = `<header class="site-header"><a class="brand" href="#hotmart" aria-label="Somora">${logo}<span>somora<span class="brand-dot">.</span></span></a><span class="channel-label">${t("brand.channel")}</span><nav class="header-nav"><a href="#hotmart" ${screen() === "hotmart" ? 'aria-current="page"' : ""}>${t("nav.plans")}</a>${session.user ? `<a href="#conta" ${screen() === "account" ? 'aria-current="page"' : ""}>${t("nav.account")}</a>` : `<button type="button" class="text-button" data-auth="login">${t("common.login")}</button>`}</nav>${languagePicker()}</header><main id="main" tabindex="-1">${notice ? `<div class="notice" role="status">${escape(notice)}</div>` : ""}${loading ? `<p class="loading" role="status">${t("common.wait")}</p>` : ""}${screen() === "account" ? accountMarkup() : hotmart.markup()}<section class="partner-callout panel"><div><h2>${t("partners.title")}</h2><p>${t("partners.text")}</p></div><a class="button secondary" href="${site}?lang=${encodeURIComponent(i18n.language)}#parcerias">${t("partners.link")}</a></section></main><footer class="site-footer"><span>${t("brand.footer")}</span><nav aria-label="Somora"><a href="${publicPage("support")}">${t("nav.support")}</a><a href="${publicPage("privacy")}">${t("nav.privacy")}</a><a href="${publicPage("terms")}">${t("nav.terms")}</a></nav><span class="operator">JK Desenvolvimento Web · CNPJ 49.553.853/0001-40<br><a href="mailto:contato@jeankassio.dev">contato@jeankassio.dev</a></span></footer>`;
    if (authOpen) renderAuth();
    void hotmart.mount();
  }
  function renderAuth() {
    if (!authOpen) { dialogRoot.innerHTML = ""; document.body.classList.remove("dialog-open"); return; }
    const register = authMode === "register", forgot = authMode === "forgot";
    dialogRoot.innerHTML = `<div class="modal-backdrop"><section class="auth-dialog panel" role="dialog" aria-modal="true" aria-labelledby="auth-title"><button type="button" class="close-button" data-action="close-auth" aria-label="${t("common.close")}">×</button><div class="auth-logo">${logo}</div><h2 id="auth-title">${t(register ? "auth.registerTitle" : forgot ? "auth.forgotTitle" : "auth.title")}</h2><p>${t("auth.shared")}</p>${!forgot && session.googleEnabled ? `<a class="button secondary google-button" data-google-auth href="${escape(`${apiBase}/auth/google?context=hotmart&lang=${encodeURIComponent(i18n.language)}`)}">${t("auth.google")}</a><p class="auth-divider">${t("auth.or")}</p>` : ""}<form id="auth-form">${register ? `<label for="auth-name">${t("auth.name")}</label><input id="auth-name" name="name" autocomplete="name" required minlength="2" maxlength="80">` : ""}<label for="auth-email">${t("auth.email")}</label><input id="auth-email" name="email" type="email" autocomplete="email" required maxlength="254">${!forgot ? `<label for="auth-password">${t("auth.password")}</label><input id="auth-password" name="password" type="password" autocomplete="${register ? "new-password" : "current-password"}" minlength="${register ? 12 : 1}" maxlength="128" required>${register ? `<p class="input-help">${t("auth.passwordHelp")}</p><label class="accept-terms"><input type="checkbox" name="acceptTerms" required><span>${t("auth.accept")} <a href="${publicPage("terms")}" target="_blank" rel="noopener">${t("nav.terms")}</a> · <a href="${publicPage("privacy")}" target="_blank" rel="noopener">${t("nav.privacy")}</a></span></label>` : ""}` : ""}<div id="auth-error" class="inline-error" role="alert">${escape(authError)}</div><button type="submit" class="button primary" ${authBusy ? "disabled" : ""}>${t(authBusy ? "common.wait" : register ? "common.register" : forgot ? "auth.recover" : "common.login")}</button></form><div class="auth-actions">${!register && !forgot ? `<button type="button" class="text-button" data-auth="forgot">${t("auth.forgot")}</button>` : ""}<button type="button" class="text-button" data-auth="${register || forgot ? "login" : "register"}">${t(register || forgot ? "common.login" : "common.register")}</button></div></section></div>`;
    document.body.classList.add("dialog-open");
  }
  function openAuth(mode = "login") { authMode = ["login", "register", "forgot"].includes(mode) ? mode : "login"; authError = ""; authOpen = true; renderAuth(); setTimeout(() => document.querySelector("#auth-form input")?.focus(), 0); }
  async function refreshSession() {
    if (refreshing) return;
    const run = revision; refreshing = true;
    try { const next = await request("/api/session"); if (run !== revision) return; session = next; notice = ""; hotmart.syncSession(); }
    catch (error) { if (run === revision) notice = translateError(error); }
    finally { if (run === revision) { loading = false; render(); } refreshing = false; }
  }
  async function submitAuth(form) {
    if (authBusy) return;
    const fields = new FormData(form), mode = authMode, run = revision;
    authBusy = true; authError = ""; form.querySelector('button[type="submit"]').disabled = true;
    try {
      const payload = { email: fields.get("email"), ...(mode === "register" ? { name: fields.get("name") } : {}), ...(mode !== "forgot" ? { password: fields.get("password") } : {}) };
      const result = await request(`/api/auth/${mode}`, { method: "POST", body: JSON.stringify(payload) });
      if (run !== revision) return;
      if (mode === "forgot") { authMode = "login"; authError = t("auth.recoverySent"); renderAuth(); return; }
      authOpen = false; renderAuth(); await refreshSession();
      if (mode === "register") { notice = t(result.mailSent === false ? "auth.createdNoMail" : "auth.created"); render(); }
    } catch (error) { if (run === revision) { authError = translateError(error); const node = document.querySelector("#auth-error"); if (node) node.textContent = authError; } }
    finally { authBusy = false; const button = document.querySelector('#auth-form button[type="submit"]'); if (button) button.disabled = false; }
  }
  async function logout() {
    if (!session.user || loggingOut) return;
    loggingOut = true; revision++; hotmart.clear(); render();
    try { await request("/api/auth/logout", { method: "POST" }); revision++; session = { ...session, user: null }; location.hash = "#hotmart"; notice = ""; }
    catch (error) { notice = translateError(error); }
    finally { loggingOut = false; hotmart.syncSession(); render(); }
  }
  document.addEventListener("submit", event => { if (event.target.id === "auth-form") { event.preventDefault(); void submitAuth(event.target); } });
  document.addEventListener("click", async event => {
    const target = event.target.closest?.("[data-auth],[data-action],[data-language],[data-screen]"); if (!target || target.disabled) return;
    if (target.dataset.language) { i18n.setLanguage(target.dataset.language); return; }
    if (target.dataset.auth) { openAuth(target.dataset.auth); return; }
    if (target.dataset.screen) { location.hash = target.dataset.screen === "account" ? "#conta" : "#hotmart"; return; }
    switch (target.dataset.action) {
      case "close-auth": authOpen = false; renderAuth(); break;
      case "refresh": await refreshSession(); break;
      case "logout": await logout(); break;
      case "verify": {
        const owner = session.user?.id; if (!owner) break;
        target.disabled = true;
        try { await request("/api/auth/verify/request", { method: "POST" }); if (session.user?.id === owner) notice = t("account.verifySent"); }
        catch (error) { if (session.user?.id === owner) notice = translateError(error); }
        finally { if (session.user?.id === owner) render(); }
        break;
      }
    }
  });
  document.addEventListener("keydown", event => {
    if (!authOpen) return;
    if (event.key === "Escape" && !authBusy) { authOpen = false; renderAuth(); return; }
    if (event.key !== "Tab") return;
    const nodes = [...dialogRoot.querySelectorAll('button:not([disabled]),a[href],input:not([disabled])')], first = nodes[0], last = nodes.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  });
  window.addEventListener("hashchange", () => { authOpen = false; renderAuth(); render(); window.scrollTo({ top: 0, behavior: "smooth" }); });
  window.addEventListener("somora:languagechange", render);
  window.addEventListener("focus", () => { void refreshSession(); });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) void refreshSession(); });
  hotmart.configure({ request, getSession: () => session, getScreen: screen, isPlay: () => false, isDemo: () => false, openAuth, termsUrl: () => publicPage("terms"), studioUrl, refreshSession, errorMessage: translateError });
  if (new URLSearchParams(location.search).get("authError")) notice = t("auth.invalidLink");
  render(); void refreshSession();
  setInterval(() => { if (!document.hidden) void hotmart.mount(); }, 15000);
})();
