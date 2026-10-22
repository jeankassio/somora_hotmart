# Somora Hotmart

Portal independente de compras em **https://hotmart.somora.media/**. Vende somente pela Hotmart; não carrega o SDK do Mercado Pago nem usa Google Play Billing. O site principal permanece independente, com seus meios de pagamento atuais. A conta e o acesso musical continuam na API e no Somora existentes; este projeto não duplica o Estúdio, as músicas ou o banco.

HTML, CSS e JavaScript estáticos, sem framework, dependências de execução ou build. Interface em português, inglês e espanhol; detecta o idioma do navegador e usa inglês para idiomas não disponíveis. As fontes são locais, com a licença OFL incluída.

## Fluxo

1. O visitante chega ao portal pela página do produto ou HotLink. O `ref` nativo da Hotmart é preservado separadamente no `sessionStorage` deste subdomínio; nunca vira uma indicação interna do Somora.
2. Entra com sua conta Somora existente (e-mail ou Google) ou cria uma conta gratuita. O login Google usa o contexto fechado `context=hotmart`; a API só retorna à URL configurada pelo operador.
3. Confirma o e-mail, escolhe Básico, Intermediário ou Completo e solicita explicitamente um checkout. Preços, moeda, recorrência e disponibilidade vêm da API, sem valores de demonstração.
4. O checkout é criado pela API e vinculado à conta por uma referência opaca. O navegador abre somente URLs HTTPS de `pay.hotmart.com`, validadas novamente no cliente.
5. Depois de pagar, o usuário volta e verifica o pagamento. Somente os eventos e a validação do servidor ativam o plano. Retornar da Hotmart, abrir um link ou mudar um parâmetro não libera acesso.
6. A conta mostra assinaturas e histórico da Hotmart, com um link fixo para a área oficial de compras. O botão **Abrir o Somora** leva ao Estúdio original, usando a mesma sessão autenticada da API.

O portal não solicita dados de cartão. As únicas referências persistidas são a afiliação nativa, a intenção de retorno e a solicitação idempotente de checkout. Senhas e cookies de sessão não são gravados pelo JavaScript. Requisições atrasadas de uma conta anterior são descartadas. Login e retorno não criam automaticamente compras. Em caso de resposta perdida, recuperar o checkout reutiliza o mesmo UUID e corpo; somente um checkout concluído ou expirado oferece **Criar novo checkout** como ação explícita.

A área de parcerias leva ao fluxo já existente no Somora: conta gratuita → ticket no Suporte → avaliação e aprovação manual. A comissão de 15% das vendas elegíveis na Hotmart segue a base e os repasses da Hotmart, sem comissão ou bônus de indicação duplicado no programa interno.

## Publicação

1. Publique esta pasta em um diretório próprio, por exemplo `/www/wwwroot/hotmart.somora.media`.
2. Crie o site `hotmart.somora.media` no aaPanel, aponte o DNS e habilite HTTPS. O exemplo em `deploy/nginx.conf.example` contém a configuração estática e os cabeçalhos recomendados; adapte os caminhos de certificado ao aaPanel.
3. Confira `config.js`. É público: **não inclua Hottok, tokens, credenciais ou segredos**. Os valores padrão usam `https://api.somora.media/api` e os links do Somora em produção.
4. Na API atualizada, configure `HOTMART_CLIENT_URL=https://hotmart.somora.media/`. Isso autoriza a origem de navegação/CORS e o retorno do login Google ao portal. Os demais parâmetros `HOTMART_*`, planos, ofertas e webhook estão documentados na API. Reinicie a API após editar o `.env`.
5. Mantenha `HOTMART_ENABLED=false` até que o produto, as ofertas, o webhook, os termos comerciais e o teste completo estejam conferidos. Nesse estado, o portal apresenta uma mensagem de preparação e não exibe preços nem cria checkouts.
6. Depois de validar a implantação real, use `https://hotmart.somora.media/` como página externa de vendas do produto na Hotmart. Confira se o redirecionamento do HotLink preserva `?ref=...`; o portal encaminha somente esse identificador validado para o checkout criado pelo servidor.

Os links de privacidade, termos e suporte apontam às páginas públicas do Somora nos três idiomas, pois o operador e a conta são os mesmos. O portal é `noindex` para não duplicar a landing principal. Nenhum procedimento de cópia/deploy deve copiar `.env`, arquivos de chaves ou credenciais.

Endpoints usados:

- `GET /api/session`; `POST /api/auth/login`, `/register`, `/forgot`, `/logout`, `/verify/request`.
- `GET /api/auth/google?context=hotmart&lang=...`.
- `GET /api/billing/hotmart/config`.
- `POST /api/billing/hotmart/checkouts`: `planId`, `requestKey` (UUID), `locale` e `affiliateRef` opcional.
- `GET /api/billing/hotmart/checkouts/:id`.
- `GET /api/billing/hotmart/subscriptions`: assinaturas e pagamentos da própria conta.

## Verificação local

Sirva os arquivos com um servidor HTTP estático; não use `file://` para testar autenticação. O login real requer que essa origem esteja autorizada na API. Para verificar a lógica sem cookies nem compras reais:

```sh
node --test tests/*.test.mjs
```

Os testes verificam afiliação, login/retorno, ausência de POST automático, validação de URL, troca de conta durante requisições, recuperação idempotente, checkout expirado, respostas inválidas, idioma e configuração desativada. Não substituem um teste ponta a ponta do webhook no ambiente publicado.

## Planos com cota definida

O portal reconhece Básico, Intermediário e Completo (Full em inglês), com a quantidade e o período recebidos da API. Não anuncia gerações ilimitadas. Somente ofertas Hotmart configuradas aparecem para compra; uma oferta Intermediário ausente nunca usa o checkout de outro plano. Cadastre a oferta na Hotmart e configure os parâmetros HOTMART_INTERMEDIATE_* na API para disponibilizá-la neste canal.
