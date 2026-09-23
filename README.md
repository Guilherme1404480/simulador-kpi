# Simulador KPI de Produção

Simulador acadêmico de indicadores de produção (OEE, Disponibilidade,
Performance e Qualidade), desenvolvido como Progressive Web App (PWA).

> O PDF da atividade menciona um arquivo original `dashboard_kpi_producao.html`
> cujo código-fonte não estava disponível. Este projeto **não é uma cópia**
> desse arquivo — é uma implementação funcional equivalente, construída a
> partir dos requisitos e fórmulas descritos na atividade.

## Arquivos do projeto

```
simulador-kpi/
├── index.html                    ← redireciona para o app (link raiz "bonito")
├── dashboard_kpi_producao.html   ← app completo (HTML + CSS + JS) — arquivo exigido pela atividade
├── manifest.json                 ← metadados do PWA
├── sw.js                         ← service worker (cache/offline)
├── icon-192.png
├── icon-192-maskable.png
├── icon-512.png
├── icon-512-maskable.png
├── README.md                     ← este arquivo
├── GUIA_APK_ANDROID.md           ← como gerar o SimuladorKPI.apk
└── GUIA_IPHONE.md                ← como instalar no iPhone/iPad
```

Decisão de implementação: todos os arquivos ficam soltos na raiz do projeto
(sem subpasta `icons/`) de propósito — assim dá para selecionar e enviar
todos de uma vez pelo seletor de arquivos do celular, sem precisar navegar
entre pastas no GitHub.

Toda a lógica de cálculo fica isolada no objeto `KPIEngine`, dentro do
`<script>` do HTML, separada das funções que só cuidam da interface.

## Fórmulas (documentadas também nos comentários do código)

- **Tempo de produção** = Tempo total do turno − Paradas planejadas
- **Disponibilidade** = Tempo de produção ÷ Tempo total do turno
- **Produção teórica** = Tempo de produção × Capacidade teórica
- **Performance** = Produção realizada ÷ Produção teórica
- **Peças boas** = Peças produzidas − Peças com defeito
- **Qualidade** = Peças boas ÷ Peças produzidas
- **OEE** = Disponibilidade × Performance × Qualidade
- **Taxa de desperdício** = Peças com defeito ÷ Peças produzidas
- **Atingimento da meta** = Peças boas ÷ Meta de peças boas

## Decisões de implementação não especificadas na atividade

O material não define alguns detalhes; as escolhas abaixo foram feitas para
que o simulador funcione de forma consistente, e estão documentadas aqui e
nos comentários do código:

- **Valores negativos** são tratados como 0.
- **Paradas planejadas maiores que o turno** são limitadas ao valor do turno.
- **Peças com defeito maiores que peças produzidas** são limitadas ao total
  produzido (fisicamente não é possível haver mais defeitos que peças).
- **Meta de peças boas = 0** torna o "Atingimento da meta" indefinido; o
  simulador exibe "—" em vez de um número, e avisa na análise operacional.
- **Simulação personalizada (seção 8 da atividade)**: em vez de um
  formulário separado, o próprio painel de dados é reaproveitado. Sempre
  que 2 ou mais campos ficarem diferentes da Situação inicial, a tabela de
  comparação aparece automaticamente abaixo dos resultados.
- **Limiares usados na análise operacional**: desperdício acima de 5% é
  citado como "relevante"; OEE abaixo de ~60% ou acima de ~85% é comparado
  às faixas de referência comuns na literatura de manufatura. São
  convenções gerais, não dados desta operação — o texto gerado deixa isso
  explícito e nunca atribui uma causa que não decorra diretamente das
  fórmulas acima.
- **Persistência**: os últimos valores digitados ficam salvos apenas neste
  aparelho, via `localStorage`, sem envio a nenhum servidor.

## 1. Como executar no computador

Não é necessário instalar nada. Duas opções:

- **Simples**: dê duplo clique em `dashboard_kpi_producao.html` para abrir
  no navegador. A calculadora funciona assim, mas o service worker
  (offline/instalação) só é ativado quando os arquivos são servidos por um
  endereço `http://` ou `https://` — não pelo protocolo `file://`.
- **Recomendado (para testar o PWA por completo)**: sirva a pasta com um
  servidor local. Com Python já instalado:
  ```bash
  cd simulador-kpi
  python3 -m http.server 8080
  ```
  Depois abra `http://localhost:8080/dashboard_kpi_producao.html`.

## 2. Como executar no VS Code

1. Abra a pasta `simulador-kpi` no VS Code.
2. Instale a extensão **Live Server** (Ritwick Dey).
3. Clique com o botão direito em `dashboard_kpi_producao.html` → **Open with
   Live Server**.
4. O navegador abre automaticamente em `http://127.0.0.1:5500/...`.

## 3. Como testar o PWA

1. Sirva os arquivos por `http://localhost` (não por `file://`), como no
   passo 1.
2. No Chrome/Edge desktop, abra o DevTools (F12) → aba **Application** →
   **Manifest**: confirme nome, ícones e `display: standalone`.
3. Na mesma aba, **Service Workers**: confirme que `sw.js` está
   "activated and running".
4. No Chrome, um ícone de instalação aparece na barra de endereço.

## 4. Como instalar no Android

1. Publique os arquivos em um endereço `https://` (veja `GUIA_APK_ANDROID.md`
   para opções gratuitas de hospedagem) ou acesse via rede local.
2. Abra o endereço no **Chrome para Android**.
3. Toque no menu (⋮) → **Instalar aplicativo** (ou aceite o banner de
   instalação que aparece automaticamente).
4. O app passa a abrir em modo standalone, com ícone próprio na tela inicial.

## 5. Como gerar o APK

Guia completo em **`GUIA_APK_ANDROID.md`**. Resumo: como o PWA já está
pronto, o caminho mais simples pelo celular é usar o **PWABuilder**
(ferramenta web, sem instalar nada), que empacota o PWA hospedado em um
`SimuladorKPI.apk` usando Trusted Web Activity — sem duplicar a lógica do
app.

## 6. Como instalar o APK no Android

1. Transfira o `.apk` gerado para o celular.
2. Toque no arquivo → autorize "instalar de fontes desconhecidas" se
   solicitado → **Instalar**.
3. Abra o app pelo ícone criado na tela inicial.

## 7. Como abrir e instalar no iPhone

O iOS não usa `.apk`. Guia completo em **`GUIA_IPHONE.md`**. Resumo: abra o
endereço do simulador no **Safari** → **Compartilhar** → **Adicionar à Tela
de Início**.

## 8. Como testar o funcionamento offline

1. Abra o app pelo menos uma vez com internet (para o service worker
   guardar os arquivos em cache).
2. Ative o modo avião (ou desligue o Wi-Fi/dados).
3. Abra o app novamente pelo ícone instalado — ele deve carregar e calcular
   normalmente, sem rede.

## 9. Como atualizar uma nova versão do app

1. Edite os arquivos normalmente.
2. Abra `sw.js` e troque o número de `CACHE_NAME` (ex.: `simulador-kpi-v1`
   → `simulador-kpi-v2`). Isso é o que avisa o navegador que existe uma
   versão nova para baixar.
3. Publique os arquivos atualizados no mesmo endereço de sempre.
4. Os usuários recebem a atualização automaticamente na próxima vez que
   abrirem o app com internet (o service worker antigo é substituído).
5. Se você gerou um `.apk` (PWABuilder/TWA), ele **não precisa ser
   reinstalado** para receber essas atualizações — o conteúdo é carregado a
   partir do endereço web, que já foi atualizado no passo 3.

## 10. Publicar num link próprio (GitHub Pages, pelo celular)

Para ter um endereço limpo do tipo
`https://SEU-USUARIO.github.io/simulador-kpi/` (sem a marca da Claude em
volta), dá para publicar direto do navegador do celular, sem computador:

1. Acesse **github.com** no navegador do celular e entre na sua conta.
2. Toque em **+** (canto superior) → **New repository**.
   - **Repository name**: `simulador-kpi`
   - Marque **Public** (o GitHub Pages gratuito exige repositório público)
   - Toque em **Create repository**.
3. Na página do repositório vazio, toque em **uploading an existing file**
   (ou **Add file → Upload files**).
4. Toque na área de upload para abrir o seletor de arquivos do celular e
   **selecione todos os arquivos de uma vez** (todos ficam soltos na raiz
   do projeto, sem pasta — é só selecionar tudo dentro da pasta
   `simulador-kpi` do zip: `index.html`, `dashboard_kpi_producao.html`,
   `manifest.json`, `sw.js` e os 4 `.png`). Os `.md` são opcionais de subir
   (são só documentação).
5. Role até o fim e toque em **Commit changes**.
6. Vá em **Settings** (aba do repositório) → **Pages**, no menu lateral.
7. Em **Build and deployment → Branch**, escolha `main` e a pasta `/ (root)`,
   depois **Save**.
8. Aguarde 1–2 minutos. O GitHub mostra o link publicado, no formato
   `https://SEU-USUARIO.github.io/simulador-kpi/` — esse é o link "bonito"
   que abre o app direto (graças ao `index.html`), sem passar pela Claude.

Esse mesmo endereço é o que você usa como URL do PWA no
`GUIA_APK_ANDROID.md` (PWABuilder) e no `GUIA_IPHONE.md` (Adicionar à Tela
de Início) para instalar como app de verdade.

## Privacidade

O simulador roda inteiramente no aparelho: não há rastreamento, analytics,
coleta de dados pessoais nem chamadas a APIs externas. Os únicos dados
salvos (`localStorage`) são os valores digitados, para conveniência de uso,
e nunca saem do aparelho.
