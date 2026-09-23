# Guia — Gerar o SimuladorKPI.apk (Android)

O APK **não deve** ser um arquivo HTML renomeado — ele precisa empacotar o
PWA de verdade, usando um app "casca" (Trusted Web Activity) que abre o
mesmo `dashboard_kpi_producao.html` já criado. Isso evita duplicar a
lógica do simulador em duas linguagens diferentes.

Existem dois caminhos. O **Caminho A funciona só com o celular**, sem
precisar de computador, Node.js ou Android Studio.

---

## Pré-requisito comum: hospedar o PWA em um endereço https://

O empacotador (seja PWABuilder ou Bubblewrap) precisa acessar o app por um
endereço `https://` público — ele não consegue ler arquivos direto do seu
celular ou computador. Algumas opções gratuitas, todas utilizáveis a partir
do navegador do celular:

- **GitHub Pages**: crie um repositório público no GitHub (o app oficial do
  GitHub ou o site m.github.com funcionam no celular), suba os arquivos da
  pasta `simulador-kpi/` e ative **Settings → Pages**.
- **Netlify Drop** (`app.netlify.com/drop`): arraste a pasta do projeto no
  navegador para publicar em segundos, sem conta obrigatória.
- **Vercel** ou **Cloudflare Pages**: alternativas equivalentes.

Depois de publicado, confirme que `https://SEU-ENDERECO/dashboard_kpi_producao.html`
abre normalmente e que `https://SEU-ENDERECO/manifest.json` também abre
(sem erro 404).

---

## Caminho A — PWABuilder (recomendado para quem só tem o celular)

O [PWABuilder](https://www.pwabuilder.com) é um serviço web gratuito da
Microsoft que lê o `manifest.json` do seu PWA hospedado e gera o pacote
Android automaticamente — tudo pelo navegador.

1. No navegador do celular (ou de qualquer computador), acesse
   `https://www.pwabuilder.com`.
2. Cole o endereço público do seu PWA (ex.:
   `https://SEU-ENDERECO/dashboard_kpi_producao.html`) e toque em **Start**.
3. O PWABuilder analisa o `manifest.json` e o `sw.js` e mostra uma nota de
   qualidade do PWA (Manifest / Service Worker / Security). Corrija
   qualquer item apontado como obrigatório, se aparecer.
4. Toque em **Package for Stores** → escolha **Android**.
5. Preencha:
   - **Package ID**: um identificador único, ex. `br.com.beerbev.simuladorkpi`
     (ajuste para algo seu).
   - **App name**: `Simulador KPI de Produção`.
   - **Display mode**: `standalone` (já vem do manifest).
6. Toque em **Generate** / **Download**. O PWABuilder devolve um `.zip`
   contendo o `app-release-signed.apk` (ou `.aab` para a Play Store).
7. Renomeie o `.apk` para `SimuladorKPI.apk`, se quiser.

Esse APK é uma **Trusted Web Activity**: um app Android real que abre o seu
`dashboard_kpi_producao.html` publicado em tela cheia, sem barra de
navegador — a lógica continua 100% no HTML/JS já criado, nada é duplicado.

---

## Caminho B — Bubblewrap CLI (quando você tiver acesso a um computador)

Alternativa por linha de comando, para quem prefere automatizar ou não quer
depender de um serviço web. Requer Node.js instalado.

```bash
npm install -g @bubblewrap/cli

bubblewrap init --manifest https://SEU-ENDERECO/manifest.json

# o CLI faz perguntas (nome do pacote, ícones, etc.) e baixa o JDK/Android
# SDK necessários na primeira execução

bubblewrap build
```

O resultado é um `app-release-signed.apk` na pasta do projeto. Renomeie
para `SimuladorKPI.apk`.

---

## Como instalar o APK gerado no Android

1. Transfira o `.apk` para o celular (download direto, e-mail, ou
   transferência de arquivo).
2. Toque no arquivo `.apk` no gerenciador de arquivos.
3. Se o Android pedir, autorize **"Instalar apps de fontes desconhecidas"**
   para o aplicativo usado para abrir o `.apk` (Configurações → Apps →
   acesso especial — o caminho exato varia por fabricante).
4. Toque em **Instalar**. O ícone do Simulador KPI aparece na tela inicial.

## Observação sobre a Google Play Store

Para publicar na Play Store (em vez de instalar o `.apk` diretamente), é
necessário um pacote `.aab` (Android App Bundle) em vez de `.apk`, mais uma
conta de desenvolvedor Google Play (taxa única). O PWABuilder também gera
o `.aab` na mesma tela do Caminho A, se esse for o objetivo.
