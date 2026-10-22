import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { webcrypto } from 'node:crypto';
import vm from 'node:vm';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const moduleSource = read('hotmart.js').replace('  window.SomoraHotmart =', '  window.hotmartTest = { buy, refresh, newCheckout, loadConfig, checkoutUrl, normalizeCheckout, rememberReturn, affiliateRef, get state(){ return state; } };\n  window.SomoraHotmart =');
const owner = '11111111-1111-4111-8111-111111111111', checkoutId = '22222222-2222-4222-8222-222222222222';
const customer = { id: owner, name: '<Customer>', email: 'customer@example.test', emailVerified: true, plan: 'free' };
const config = { enabled: true, currency: 'BRL', plans: [{ id: 'basic', amountCents: 2990, recurring: true }, { id: 'complete', amountCents: 5990, recurring: true }], managementUrl: 'https://purchase.hotmart.com/' };
const checkout = (value = {}) => ({ checkout: { id: checkoutId, planId: 'basic', status: 'created', url: 'https://pay.hotmart.com/A12345678?off=abc&sck=opaque_binding', expiresAt: new Date(Date.now() + 3600000).toISOString(), ...value } });

function setup({ guest = false, verified = true, language = 'en-US', hash = '#hotmart', search = '', storage = new Map(), play = false, demo = false, blocked = false, request } = {}) {
  const calls = [], auth = [], listeners = new Map(), location = new URL(`https://hotmart.somora.media/${search}${hash}`);
  let session = { user: guest ? null : { ...customer, emailVerified: verified }, plans: [{ id: 'basic', limit: 100, maxDuration: 180 }, { id: 'intermediate', limit: 200, period: 'month', maxDuration: 180 }, { id: 'complete', limit: 400, period: 'month', maxDuration: 180 }] }, page = hash === '#conta' ? 'account' : 'hotmart';
  const document = { querySelector: () => null, addEventListener(name, fn) { const rows = listeners.get(name) || []; rows.push(fn); listeners.set(name, rows); } };
  const window = { location, SOMORA_CONFIG: { IS_HOTMART_PORTAL: true }, navigator: { language, languages: [language] },
    sessionStorage: { getItem(key) { if (blocked) throw Error('blocked'); return storage.get(key) || null; }, setItem(key, value) { if (blocked) throw Error('blocked'); storage.set(key, value); }, removeItem(key) { if (blocked) throw Error('blocked'); storage.delete(key); } },
    localStorage: { getItem() { return null; }, setItem() {} },
    history: { state: null, replaceState(_state, _title, url) { location.href = new URL(url, location).href; } },
    addEventListener(name, fn) { const rows = listeners.get(name) || []; rows.push(fn); listeners.set(name, rows); },
    dispatchEvent(event) { for (const fn of listeners.get(event.type) || []) fn(event); },
  };
  const context = vm.createContext({ window, document, location, navigator: window.navigator, URL, URLSearchParams, Intl, Date, console, crypto: webcrypto, CustomEvent: class { constructor(type) { this.type = type; } } });
  vm.runInContext(read('i18n.js'), context); vm.runInContext(moduleSource, context);
  const api = window.SomoraHotmart, internals = window.hotmartTest;
  api.configure({ getSession: () => session, getScreen: () => page, isPlay: () => play, isDemo: () => demo, openAuth: () => auth.push('login'), refreshSession: async () => calls.push({ path: 'REFRESH_SESSION' }), termsUrl: () => 'https://somora.media/en/terms/',
    async request(path, options = {}) {
      calls.push({ path, method: options.method || 'GET', body: options.body ? JSON.parse(options.body) : null });
      if (request) return request(path, options);
      if (path.endsWith('/config')) return config;
      if (path.endsWith('/subscriptions')) return { subscriptions: [], orders: [] };
      if (path.includes('/checkouts/')) return checkout();
      if (path.endsWith('/checkouts')) return checkout();
      throw Error(`Unexpected ${path}`);
    },
  });
  return { api, internals, window, location, calls, auth, storage, language: window.SomoraI18n,
    signIn(user = customer) { session = { ...session, user }; api.syncSession(); },
    navigate(value) { page = value; },
    google() { for (const fn of listeners.get('click') || []) fn({ target: { closest: selector => selector === '[data-google-auth]' ? {} : null } }); },
  };
}

test('disabled configuration shows preparation notice without prices or purchase controls', async () => {
  const f = setup({ request: async path => path.endsWith('/config') ? { enabled: false, currency: 'BRL', plans: [] } : { subscriptions: [], orders: [] } });
  await f.api.mount(); const html = f.api.markup();
  assert.match(html, /still being prepared/); assert.doesNotMatch(html, /data-hotmart="buy"|29[.,]90/);
  await f.internals.buy('basic'); assert.equal(f.calls.filter(row => row.method === 'POST').length, 0);
});

test('guest must explicitly sign in and verified account must explicitly create checkout', async () => {
  const f = setup({ guest: true }); await f.api.mount(); await f.internals.buy('complete');
  assert.equal(f.auth.length, 1); assert.equal(f.location.hash, '#hotmart?plan=complete'); assert.equal(f.calls.filter(row => row.method === 'POST').length, 0);
  f.signIn(); await f.api.mount(); assert.equal(f.calls.filter(row => row.method === 'POST').length, 0);
  await f.internals.buy('basic'); assert.equal(f.calls.filter(row => row.method === 'POST').length, 1);
  assert.match(f.api.markup(), /href="https:\/\/pay\.hotmart\.com\/A12345678/);
  assert.match(f.api.markup(), /&lt;Customer&gt;/);
});

test('unverified email, demo and Play contexts never create a checkout', async () => {
  const unverified = setup({ verified: false }); await unverified.api.mount(); await unverified.internals.buy('basic'); assert.equal(unverified.calls.filter(row => row.method === 'POST').length, 0); assert.match(unverified.api.markup(), /Verify your email/);
  for (const settings of [{ play: true }, { demo: true }]) { const f = setup(settings); await f.api.mount(); await f.internals.buy('basic'); assert.equal(f.calls.length, 0); assert.doesNotMatch(f.api.markup(), /href="https:\/\/pay\.hotmart\.com|data-hotmart="buy"/); }
});

test('Hotmart affiliate ref stays in its own namespace and is forwarded only as validated identifier', async () => {
  const f = setup({ search: '?ref=A12345678&fbclid=keep&channel=hotmart' });
  assert.equal(f.location.searchParams.get('ref'), null); assert.equal(f.location.searchParams.get('fbclid'), 'keep');
  assert.equal(JSON.parse(f.storage.get('somora.hotmart-affiliate')).ref, 'A12345678'); assert.equal(f.storage.has('somora.pending-referral'), false);
  await f.api.mount(); await f.internals.buy('basic');
  const post = f.calls.find(row => row.method === 'POST'); assert.equal(post.body.affiliateRef, 'A12345678');
  assert.equal(post.body.planId, 'basic'); assert.match(post.body.requestKey, /^[a-f0-9-]{36}$/); assert.equal(post.body.locale, 'en');
  for (const ref of ['https://evil.example/', 'a', 'A'.repeat(81), 'bad\nidentifier']) { const invalid = setup({ search: `?ref=${encodeURIComponent(ref)}` }); assert.equal(invalid.internals.affiliateRef(), ''); }
});

test('Google sign-in restores plan intent and affiliation without an automatic purchase', async () => {
  const outgoing = setup({ guest: true, search: '?ref=A12345678', hash: '#hotmart?plan=complete' }); outgoing.google();
  const incoming = setup({ storage: outgoing.storage, hash: '' }); await incoming.api.mount();
  assert.equal(incoming.location.hash, '#hotmart?plan=complete'); assert.equal(incoming.internals.affiliateRef(), 'A12345678'); assert.equal(incoming.calls.filter(row => row.method === 'POST').length, 0);
});

test('checkout host validation rejects malicious origin, credentials, ports, paths, scheme and fragments', () => {
  const f = setup();
  assert.equal(f.internals.checkoutUrl('https://pay.hotmart.com/A12345678?off=abc'), 'https://pay.hotmart.com/A12345678?off=abc');
  for (const url of ['https://pay.hotmart.com.evil.example/A12345678', 'https://evil.example/A12345678', 'http://pay.hotmart.com/A12345678', 'javascript:alert(1)', 'https://user:pass@pay.hotmart.com/A12345678', 'https://pay.hotmart.com:8443/A12345678', 'https://pay.hotmart.com/../redirect/path', 'https://pay.hotmart.com/A12345678#bad']) assert.equal(f.internals.checkoutUrl(url), '', url);
  assert.throws(() => f.internals.normalizeCheckout(checkout({ url: 'https://evil.example/steal' })), /could not be validated/);
});

test('uncertain create and repeated clicks reuse the exact request key and body', async () => {
  let attempts = 0;
  const f = setup({ request: async (path, options = {}) => {
    if (path.endsWith('/config')) return config;
    if (path.endsWith('/subscriptions')) return { subscriptions: [], orders: [] };
    if (options.method === 'POST' && ++attempts === 1) throw Error('Network lost');
    return checkout();
  } });
  await f.api.mount(); await f.internals.buy('basic'); await f.internals.buy('basic', true);
  const posts = f.calls.filter(row => row.method === 'POST'); assert.equal(posts.length, 2); assert.deepEqual(posts[0].body, posts[1].body);
  await f.internals.buy('basic'); assert.equal(f.calls.filter(row => row.method === 'POST').length, 2);
});

test('account switch discards delayed checkout and does not expose another account URL', async () => {
  let resolvePost;
  const f = setup({ request: async (path, options = {}) => {
    if (path.endsWith('/config')) return config;
    if (path.endsWith('/subscriptions')) return { subscriptions: [], orders: [] };
    if (options.method === 'POST') return new Promise(resolve => { resolvePost = resolve; });
    throw Error(path);
  } });
  await f.api.mount(); const pending = f.internals.buy('basic');
  f.signIn({ ...customer, id: '33333333-3333-4333-8333-333333333333', email: 'second@example.test' });
  resolvePost(checkout()); await pending;
  assert.equal(f.internals.state.checkout, null); assert.equal(f.storage.has('somora.hotmart-checkout'), false);
  assert.doesNotMatch(f.api.markup(), /pay\.hotmart\.com|customer@example\.test/);
});

test('expired checkout requires explicit new action and an uncertain checkout cannot silently create a new request', async () => {
  const f = setup(); await f.api.mount(); await f.internals.buy('basic'); const first = f.internals.state.reference.requestKey;
  await f.internals.newCheckout(); assert.equal(f.calls.filter(row => row.method === 'POST').length, 1);
  f.internals.state.checkout = { ...f.internals.state.checkout, url: '', expiresAt: '2000-01-01T00:00:00Z' };
  assert.match(f.api.markup(), /data-hotmart="new-checkout"/); await f.internals.newCheckout();
  assert.equal(f.calls.filter(row => row.method === 'POST').length, 2); assert.notEqual(f.internals.state.reference.requestKey, first);
});

test('account history is escaped and management links ignore untrusted response URLs', async () => {
  const f = setup({ hash: '#conta', request: async () => ({ managementUrl: 'https://evil.example/', subscriptions: [{ id: checkoutId, planId: 'basic', status: 'active', planExpiresAt: '2026-12-01', managementUrl: 'https://evil.example/' }], orders: [{ planId: 'basic', amountCents: 2990, currency: 'BRL', status: '<script>alert(1)</script>', approvedAt: '2026-10-18' }] }) });
  await f.api.mount(); const html = f.api.accountPanel();
  assert.match(html, /https:\/\/purchase\.hotmart\.com\//); assert.match(html, /Payment history/); assert.doesNotMatch(html, /evil\.example|<script>/);
});

test('invalid config never exposes a purchase button and browser storage failure does not bypass login', async () => {
  for (const value of [{ ...config, currency: 'USD' }, { ...config, plans: [{ id: 'free', amountCents: 100, recurring: true }] }, { ...config, plans: [{ id: 'basic', amountCents: 100, recurring: false }] }]) {
    const f = setup({ request: async path => path.endsWith('/config') ? value : { subscriptions: [], orders: [] } }); await f.api.mount(); assert.doesNotMatch(f.api.markup(), /data-hotmart="buy"/);
  }
  const blocked = setup({ guest: true, blocked: true }); await blocked.api.mount(); await blocked.internals.buy('basic'); assert.equal(blocked.auth.length, 1); assert.equal(blocked.calls.filter(row => row.method === 'POST').length, 0);
});

test('language fallback is English and all public copies include native commission terms', () => {
  for (const language of ['ru-RU', 'pt-PT', 'es-MX', 'en-GB']) {
    const f = setup({ language }); assert.equal(f.language.language, language.startsWith('pt') ? 'pt-BR' : language.startsWith('es') ? 'es' : 'en');
    const copy = f.language.t('partners.text'); assert.match(copy, /15%/); assert.match(copy, /Hotmart/); assert.doesNotMatch(copy, /partners\.text/);
  }
});

test('explicit language choice updates the URL and survives reload without losing affiliation or plan', () => {
  const f = setup({ search: '?lang=pt-BR&channel=hotmart&utm_source=partner&off=abc', hash: '#hotmart?plan=complete', language: 'pt-BR' });
  assert.equal(f.language.language, 'pt-BR');
  // A language change must preserve every other query field, including a ref
  // added after initial capture, rather than rebuilding a bare language URL.
  f.location.searchParams.set('ref', 'A12345678');
  f.language.setLanguage('en');
  assert.equal(f.language.language, 'en'); assert.equal(f.location.searchParams.get('lang'), 'en');
  assert.equal(f.location.searchParams.get('ref'), 'A12345678'); assert.equal(f.location.searchParams.get('channel'), 'hotmart');
  assert.equal(f.location.searchParams.get('utm_source'), 'partner'); assert.equal(f.location.searchParams.get('off'), 'abc');
  assert.equal(f.location.hash, '#hotmart?plan=complete');
  const reloaded = setup({ search: f.location.search, hash: f.location.hash, language: 'pt-BR' });
  assert.equal(reloaded.language.language, 'en'); assert.equal(reloaded.internals.affiliateRef(), 'A12345678');
  assert.equal(reloaded.language.t('common.skipContent'), 'Skip to content');
});

test('standalone entry has local assets, legal identity and a closed Google context; no card SDK or native app bridge', () => {
  const index = read('index.html'), portal = read('portal.js');
  assert.match(index, /https:\/\/hotmart\.somora\.media\//); assert.match(index, /49\.553\.853\/0001-40/); assert.match(index, /https:\/\/somora\.media\/en\/terms\//);
  assert.match(portal, /auth\/google\?context=hotmart&lang=/); assert.match(portal, /credentials: "include"/); assert.match(portal, /CNPJ 49\.553\.853\/0001-40/);
  assert.doesNotMatch(index + portal, /sdk\.mercadopago|billing\.js|android\.js|\/api\/billing\/subscriptions|\/api\/billing\/checkouts/);
  for (const path of ['./config.js', './i18n.js', './hotmart.js', './portal.js', './styles.css', './hotmart.css', './assets/favicon.png', './assets/dm-sans-latin.woff2']) assert(read(path).length > 0);
});


test('intermediate uses its own Hotmart checkout and Full has a finite song allowance', async () => {
  const f = setup({request:async(path,options={})=>{
    if(path.endsWith('/config'))return {...config,plans:[...config.plans,{id:'intermediate',amountCents:7990,recurring:true}]};
    if(path.endsWith('/subscriptions'))return {subscriptions:[],orders:[]};
    if(path.endsWith('/checkouts')){const body=JSON.parse(options.body);assert.equal(body.planId,'intermediate');return checkout({planId:'intermediate',amountCents:7990});}
    throw Error('unexpected fixture path');
  }});
  await f.api.mount();assert.match(f.api.markup(),/Intermediate/);assert.match(f.api.markup(),/400 music generations per month/);assert.doesNotMatch(f.api.markup(),/Unlimited|>Complete</);
  await f.internals.buy('intermediate');assert.equal(f.calls.filter(row=>row.method==='POST').length,1);
  assert.equal(f.calls.find(row=>row.method==='POST').body.planId,'intermediate');
  for(const [language,label]of[['en','Full'],['pt-BR','Completo'],['es','Completo']]){f.language.setLanguage(language);assert.equal(f.language.planName('complete'),label);}
});

test('an intermediate offer missing from Hotmart is not replaced by a different plan', async () => {
  const f=setup();await f.api.mount();await f.internals.buy('intermediate');
  assert.equal(f.calls.filter(row=>row.method==='POST').length,0);
});
