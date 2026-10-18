"use strict";
(() => {
  const rows = [
    ["meta.title", "Somora | Assinaturas pela Hotmart", "Somora | Hotmart subscriptions", "Somora | Suscripciones por Hotmart"],
    ["meta.description", "Conheça o Somora, crie sua conta e assine pela Hotmart. Música e letras com IA, com acesso ao editor online Kassio Studio.", "Discover Somora, create your account, and subscribe through Hotmart. AI music and lyrics, with access to the Kassio Studio online editor.", "Descubre Somora, crea tu cuenta y suscríbete por Hotmart. Música y letras con IA, con acceso al editor online Kassio Studio."],
    ["nav.plans", "Planos", "Plans", "Planes"], ["nav.account", "Minha conta", "My account", "Mi cuenta"],
    ["nav.support", "Suporte", "Support", "Soporte"], ["nav.privacy", "Privacidade", "Privacy", "Privacidad"],
    ["nav.terms", "Termos de uso", "Terms of use", "Términos de uso"], ["nav.partners", "Parcerias", "Partnerships", "Colaboraciones"],
    ["common.openStudio", "Abrir o Somora", "Open Somora", "Abrir Somora"], ["common.refresh", "Atualizar", "Refresh", "Actualizar"],
    ["common.close", "Fechar", "Close", "Cerrar"], ["common.wait", "Aguarde…", "Please wait…", "Espera…"],
    ["common.skipContent", "Ir para o conteúdo", "Skip to content", "Ir al contenido"],
    ["common.login", "Entrar", "Sign in", "Entrar"], ["common.register", "Criar conta", "Create account", "Crear cuenta"],
    ["common.logout", "Sair", "Sign out", "Salir"], ["common.free", "Começar gratuitamente", "Start for free", "Empezar gratis"],
    ["brand.channel", "Canal Hotmart", "Hotmart channel", "Canal Hotmart"],
    ["brand.accountHelp", "A mesma conta, suas músicas no Somora. Este portal cuida somente das compras pela Hotmart.", "The same account, your music in Somora. This portal handles Hotmart purchases only.", "La misma cuenta, tu música en Somora. Este portal gestiona solo compras por Hotmart."],
    ["brand.footer", "Da sua ideia ao primeiro play.", "From your idea to the first play.", "De tu idea al primer play."],
    ["auth.title", "Entre na sua conta Somora.", "Sign in to your Somora account.", "Entra en tu cuenta de Somora."],
    ["auth.registerTitle", "Sua música começa com uma conta.", "Your music starts with an account.", "Tu música empieza con una cuenta."],
    ["auth.forgotTitle", "Recuperar acesso", "Recover access", "Recuperar acceso"],
    ["auth.shared", "Se você já usa o Somora, entre com a mesma conta. A assinatura será vinculada a ela.", "If you already use Somora, sign in with the same account. Your subscription will be linked to it.", "Si ya usas Somora, entra con la misma cuenta. Tu suscripción se vinculará a ella."],
    ["auth.google", "Continuar com Google", "Continue with Google", "Continuar con Google"],
    ["auth.or", "ou com e-mail", "or with email", "o con correo"],
    ["auth.name", "Nome", "Name", "Nombre"], ["auth.email", "E-mail", "Email", "Correo"], ["auth.password", "Senha", "Password", "Contraseña"],
    ["auth.passwordHelp", "Use no mínimo 12 caracteres.", "Use at least 12 characters.", "Usa al menos 12 caracteres."],
    ["auth.accept", "Li e aceito os Termos de uso e a Política de privacidade do Somora.", "I have read and accept Somora's Terms of use and Privacy policy.", "He leído y acepto los Términos de uso y la Política de privacidad de Somora."],
    ["auth.forgot", "Esqueci minha senha", "Forgot password", "Olvidé mi contraseña"],
    ["auth.recover", "Enviar link de recuperação", "Send recovery link", "Enviar enlace de recuperación"],
    ["auth.created", "Conta criada. Confira seu e-mail para confirmar o cadastro antes de assinar.", "Account created. Check your email to verify your account before subscribing.", "Cuenta creada. Revisa tu correo para confirmar el registro antes de suscribirte."],
    ["auth.createdNoMail", "Conta criada, mas o e-mail de confirmação não pôde ser enviado. Solicite novamente na sua conta.", "Account created, but the verification email could not be sent. Request it again in your account.", "Cuenta creada, pero no se pudo enviar el correo de confirmación. Solicítalo de nuevo en tu cuenta."],
    ["auth.recoverySent", "Se houver uma conta com esse e-mail, você receberá as instruções de recuperação.", "If an account exists with this email, you will receive recovery instructions.", "Si existe una cuenta con este correo, recibirás las instrucciones de recuperación."],
    ["auth.invalidLink", "O link de acesso não é válido ou expirou. Tente entrar novamente.", "The access link is invalid or expired. Try signing in again.", "El enlace de acceso no es válido o caducó. Intenta entrar de nuevo."],
    ["account.title", "Sua conta Somora", "Your Somora account", "Tu cuenta de Somora"],
    ["account.currentPlan", "Plano atual: {plan}", "Current plan: {plan}", "Plan actual: {plan}"],
    ["account.verified", "E-mail confirmado", "Email verified", "Correo confirmado"], ["account.unverified", "E-mail aguardando confirmação", "Email awaiting verification", "Correo pendiente de confirmación"],
    ["account.verify", "Reenviar confirmação", "Resend verification", "Reenviar confirmación"],
    ["account.verifySent", "E-mail de confirmação enviado. Depois de confirmar, volte aqui e clique em Atualizar.", "Verification email sent. After verifying, return here and click Refresh.", "Correo de confirmación enviado. Después de confirmar, vuelve aquí y pulsa Actualizar."],
    ["account.logoutHelp", "Sair encerra a sessão compartilhada do Somora neste navegador.", "Signing out ends the shared Somora session in this browser.", "Salir cierra la sesión compartida de Somora en este navegador."],
    ["billing.activeUntil", "Acesso até {date}", "Access until {date}", "Acceso hasta {date}"],
    ["plans.free", "Gratuito", "Free", "Gratis"], ["plans.basic", "Básico", "Basic", "Básico"], ["plans.complete", "Completo", "Complete", "Completo"],
    ["plans.unlimited", "Gerações musicais ilimitadas no plano", "Unlimited music generations on this plan", "Generaciones musicales ilimitadas en este plan"],
    ["plans.generations", "{count} gerações musicais por mês", "{count} music generations per month", "{count} generaciones musicales por mes"],
    ["plans.duration", "Até {seconds} segundos por música", "Up to {seconds} seconds per song", "Hasta {seconds} segundos por canción"],
    ["plans.existing", "Sua conta já tem um plano pago. As assinaturas de cada provedor são independentes: uma nova compra não cancela outra assinatura. Confira suas cobranças antes de continuar.", "Your account already has a paid plan. Subscriptions with each provider are independent: a new purchase does not cancel another subscription. Check your charges before continuing.", "Tu cuenta ya tiene un plan de pago. Las suscripciones de cada proveedor son independientes: una nueva compra no cancela otra suscripción. Revisa tus cobros antes de continuar."],
    ["partners.title", "Quer divulgar o Somora?", "Want to promote Somora?", "¿Quieres promocionar Somora?"],
    ["partners.text", "Crie sua conta gratuita no Somora e envie um ticket no Suporte solicitando uma parceria de divulgação. A equipe analisa seu pedido e orienta a aprovação manual na Hotmart, sem exigir a compra de um plano. Na adesão e nas renovações elegíveis pela Hotmart, a comissão de 15% é calculada sobre a base definida pela plataforma, após suas taxas, com repasses pelas regras da Hotmart. Não há comissão ou bônus de indicação duplicado no programa interno do Somora.", "Create your free Somora account and send a Support ticket requesting a promotional partnership. Our team reviews your request and guides manual Hotmart approval; no plan purchase is required. For eligible initial purchases and renewals through Hotmart, the 15% commission is calculated on the platform-defined base after its fees, with payouts under Hotmart's rules. The Somora internal program does not award a duplicate commission or referral bonus.", "Crea tu cuenta gratuita de Somora y envía un ticket en Soporte solicitando una colaboración de promoción. El equipo revisa tu solicitud y te orienta para la aprobación manual en Hotmart, sin exigir la compra de un plan. En las contrataciones iniciales y renovaciones elegibles por Hotmart, la comisión del 15% se calcula sobre la base definida por la plataforma después de sus tarifas, con pagos según las reglas de Hotmart. El programa interno de Somora no otorga una comisión ni un bono de recomendación duplicado."],
    ["partners.link", "Solicitar parceria", "Request a partnership", "Solicitar colaboración"],
    ["errors.connection", "Não foi possível conectar. Verifique sua conexão e tente novamente.", "Could not connect. Check your connection and try again.", "No se pudo conectar. Revisa tu conexión e inténtalo de nuevo."],
    ["errors.auth", "Confira seus dados e tente novamente.", "Check your details and try again.", "Revisa tus datos e inténtalo de nuevo."],
    ["errors.rate", "Muitas tentativas. Aguarde alguns minutos e tente novamente.", "Too many attempts. Wait a few minutes and try again.", "Demasiados intentos. Espera unos minutos e inténtalo de nuevo."],
    ["errors.disabled", "Este recurso ainda não está disponível. Tente novamente mais tarde.", "This feature is not available yet. Try again later.", "Esta función aún no está disponible. Inténtalo más tarde."],
    ["errors.verified", "Confirme seu e-mail antes de continuar.", "Verify your email before continuing.", "Confirma tu correo antes de continuar."],
    ["errors.existingHotmart", "Gerencie sua assinatura existente na Hotmart antes de contratar outra.", "Manage your existing Hotmart subscription before purchasing another one.", "Gestiona tu suscripción existente en Hotmart antes de contratar otra."],
    ["errors.existingProvider", "Cancele a renovação da sua assinatura no provedor de origem antes de contratar pela Hotmart, para evitar duas cobranças.", "Cancel renewal of your subscription with the original provider before subscribing through Hotmart, to avoid two charges.", "Cancela la renovación de tu suscripción con el proveedor original antes de suscribirte por Hotmart, para evitar dos cobros."],
    ["errors.conflict", "Esta solicitação já está associada a outro checkout. Confira seu histórico ou fale com o Suporte.", "This request is already associated with another checkout. Check your history or contact Support.", "Esta solicitud ya está asociada a otro checkout. Consulta tu historial o contacta con Soporte."],
    ["errors.checkoutNotFound", "Este checkout não foi encontrado nesta conta. Confira se você entrou na conta correta.", "This checkout was not found in this account. Make sure you signed in to the correct account.", "No se encontró este checkout en esta cuenta. Comprueba que entraste en la cuenta correcta."],
  ];
  const catalogues = { "pt-BR": {}, en: {}, es: {} };
  for (const [key, pt, en, es] of rows) for (const [language, value] of [["pt-BR", pt], ["en", en], ["es", es]]) catalogues[language][key] = value;
  const normalize = value => /^pt(?:-|$)/i.test(value || "") ? "pt-BR" : /^es(?:-|$)/i.test(value || "") ? "es" : "en";
  let language;
  try { const explicit = new URLSearchParams(location.search).get("lang"), saved = window.localStorage.getItem("somora.hotmart-language"); language = normalize(explicit || saved || navigator.languages?.[0] || navigator.language); } catch { language = normalize(navigator.language); }
  function t(key, variables = {}) { return String(catalogues[language][key] || catalogues.en[key] || key).replace(/\{(\w+)\}/g, (all, name) => Object.hasOwn(variables, name) ? String(variables[name]) : all); }
  function setLanguage(value) {
    language = normalize(value);
    try { window.localStorage.setItem("somora.hotmart-language", language); } catch {}
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", language);
      window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
    } catch { /* The selected language remains usable when history is unavailable. */ }
    window.dispatchEvent(new CustomEvent("somora:languagechange"));
  }
  window.SomoraI18n = Object.freeze({ catalogues, t, setLanguage, planName: value => t(`plans.${typeof value === "string" ? value : value?.id}`), get language() { return language; }, get locale() { return { "pt-BR": "pt-BR", en: "en-US", es: "es-ES" }[language]; } });
})();
