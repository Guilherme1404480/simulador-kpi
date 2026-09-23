# Guia — iPhone e iPad

O iOS não usa arquivos `.apk` (esse formato é exclusivo do Android). No
iPhone/iPad, o Simulador KPI de Produção é instalado como PWA direto pelo
Safari — não existe download de "app" separado.

## Instalar via Safari (recomendado — funciona sem Xcode nem Mac)

1. Publique os arquivos do projeto em um endereço `https://` (veja as
   opções gratuitas em `GUIA_APK_ANDROID.md`, seção "Pré-requisito comum" —
   servem igualmente para iOS).
2. No **iPhone ou iPad**, abra esse endereço no **Safari** (precisa ser o
   Safari — outros navegadores no iOS não têm suporte completo a instalar
   PWAs na tela de início).
3. Toque no ícone de **Compartilhar** (o quadrado com a seta para cima), na
   barra inferior (iPhone) ou superior (iPad).
4. Role a lista de opções e toque em **Adicionar à Tela de Início**.
5. Confirme o nome (já vem preenchido com "KPI Produção") e toque em
   **Adicionar**.
6. O ícone aparece na tela de início e abre em modo standalone (tela
   cheia, sem a barra de endereço do Safari).

Depois de aberto uma vez com internet, o app funciona offline normalmente,
graças ao cache do service worker (mesmo comportamento do Android).

### Limitações conhecidas do PWA no iOS

- O Safari limita o armazenamento offline de PWAs "adicionados à tela de
  início" com mais rigor que o Android; para este simulador (que não
  depende de grandes volumes de dados) isso não chega a ser um problema.
- Notificações push de PWA só funcionam em iOS 16.4 ou mais recente, e não
  são usadas por este simulador.

## Alternativa: app nativo para iOS (opcional, não obrigatório)

O enunciado da atividade só exige que o simulador **funcione corretamente**
em iPhone/iPad — o que o PWA acima já garante. Uma versão nativa é
opcional. Caso deseje empacotar o mesmo PWA como app nativo (por exemplo,
para distribuir pela App Store), os requisitos são:

- **Um Mac** com **Xcode** instalado (não é possível compilar apps iOS a
  partir de outro sistema operacional).
- Uma abordagem comum é embutir o PWA em uma `WKWebView` dentro de um
  projeto Xcode mínimo — a lógica do simulador continua sendo o mesmo
  `dashboard_kpi_producao.html`, apenas carregado dentro de um app nativo.
- **Assinatura de código**: uma conta na Apple Developer Program (paga,
  anual) para gerar o certificado de assinatura e o *provisioning profile*.
- **Distribuição**:
  - Para uso pessoal/testes: instalação direta via Xcode em um iPhone
    conectado ao Mac, ou distribuição limitada via **TestFlight**.
  - Para publicação pública: envio para revisão na **App Store Connect**.

Para os fins desta atividade acadêmica, a instalação via Safari (seção
acima) já cumpre o requisito de funcionamento em iPhone/iPad sem exigir
Mac, Xcode ou conta de desenvolvedor.
