# ASG-SP Front-end - Sistema de Análise Ambiental, Social e Governança

Interface web para consulta por linguagem natural a dados ASG (Ambiental, Social e Governança) de propriedades rurais do Estado de São Paulo.

---

## Sumário

1. [Visão Geral](#visão-geral)
2. [Arquitetura de Componentes](#arquitetura-de-componentes)
3. [Funcionalidades](#funcionalidades)
4. [Integração com a API](#integração-com-a-api)
5. [Estrutura de Diretórios](#estrutura-de-diretórios)
6. [Como Executar](#como-executar)
7. [Tecnologias Utilizadas](#tecnologias-utilizadas)

---

## Visão Geral

O frontend é uma aplicação Next.js com layout em dois painéis: **chat** (25%) à esquerda e **mapa interativo** (75%) à direita. O usuário digita uma pergunta em linguagem natural, a resposta é exibida no chat e os dados geoespaciais são renderizados automaticamente no mapa.

### Fluxo de uma Consulta

```
Usuário digita: "Quais terras indígenas existem em Ubatuba?"
        |
        v
[Chat/useChatForm.tsx]
        |  POST /api/consulta  →  API Back-end (FastAPI)
        v
[QueryService.ts]  →  IQueryResponse
        |
        v
[ChatView/index.tsx]     [Map/LeafletMap.tsx]
  Exibe resumo +          Renderiza GeoJSON
  fontes + detalhes       com polígonos/pontos
                          coloridos por fonte
```

---

## Arquitetura de Componentes

```
app/
  page.tsx                  Página principal (Chat + Map lado a lado)
  layout.tsx                Layout raiz (Navbar + Providers + Footer)

components/
  Navbar/                   Barra superior com logo Visiona e ações
    ModalUpdateData/        Modal de gerenciamento do ETL
      Execution/            Execução manual do pipeline
      History/              Histórico de execuções
      Schedule/             Criação de agendamento recorrente

  Chat/                     Painel de chat (25% da tela)
    ChatBox.tsx             Campo de entrada de texto
    useChatForm.tsx         Hook central: envia consulta, controla estado
    ChatView/
      index.tsx             Exibe mensagens do chat
      Header.tsx            Cabeçalho com intenção detectada e confiança
      DetailsModal.tsx      Modal com dados completos da resposta

  Map/                      Painel do mapa (75% da tela)
    index.tsx               Tela inicial com sugestões de perguntas
    LeafletMap.tsx          Mapa Leaflet com GeoJSON dinâmico
    Calculation.tsx         Cálculo de bounds e zoom automático
    components/
      Legend.tsx            Legenda dinâmica por fonte de dados
      MapDetails.tsx        Popup com detalhes ao clicar em feature
      MapViewToggle.tsx     Alternância satélite / rua
      StateOutline.tsx      Contorno do Estado de SP

  Inputs/                   Componentes de formulário reutilizáveis
    Text/                   Input de texto
    Select/                 Select customizado
    DateTimePicker/         Seletor de data e hora (scroll wheel)

  Modal/                    Modal base (Radix Dialog)
  Popover/                  Popover base (Radix Popover)
  Tooltip/                  Tooltip base (Radix Tooltip)
  Button.tsx                Botão reutilizável
  Footer.tsx                Rodapé da aplicação
  Icon/                     Sistema de ícones (Tabler Icons)
  Providers.tsx             React Query + Sonner Toast Provider
```

---

## Funcionalidades

### Chat
- Campo de texto para perguntas em linguagem natural
- Sugestões de perguntas clicáveis no painel do mapa (estado inicial)
- Exibição de: resumo textual, intenção detectada, confiança do classificador, fontes rastreáveis e tempo de processamento
- Modal de detalhes com dados completos da resposta (metadados JSON)
- Mensagem amigável para perguntas fora do escopo

### Mapa (Leaflet + react-leaflet)
- Base de satélite (Esri WorldImagery) com alternância para mapa de ruas (OpenStreetMap)
- Renderização dinâmica de GeoJSON retornado pela API
- Cores e ícones por fonte de dados:

| Fonte | Cor | Ícone |
|-------|-----|-------|
| Queimadas (INPE) | `#ff4444` Vermelho | chama |
| Alerta Desmatamento (DETER) | `#f06400` Laranja escuro | machado |
| Área Desmatada (PRODES) | `#f77f00` Laranja | machado |
| Terra Indígena (FUNAI) | `#55a630` Verde | folha |
| Unidade de Conservação (ICMBio) | `#9d4edd` Roxo | escudo |
| Quilombo (Palmares) | `#7A360F` Marrom | punho |
| Imóvel Rural (SICAR) | `#16acf7` Azul claro | fazenda |

- Zoom automático com animação ao receber resultado (`flyToBounds`)
- Contorno do Estado de SP sempre visível (`public/data/estado-sp.json`)
- Legenda dinâmica no canto inferior direito (exibe apenas as fontes presentes)
- Popup com detalhes ao clicar em qualquer feature do mapa
- Zoom mínimo 6, máximo 18, centro inicial: SP (-22.5, -48.5)

### Gerenciamento do ETL (Navbar)
Modal com três abas acessível pela Navbar:

| Aba | Descrição |
|-----|-----------|
| **Execução** | Dispara o pipeline ETL completo via `POST /api/etl/executar` |
| **Histórico** | Lista execuções anteriores via `GET /api/etl/historico` |
| **Agendamento** | Cria agendamento recorrente via `POST /api/v1/agendamentos` |

Respeita o cooldown de 6 horas configurado no back-end (exibe contador regressivo).

---

## Integração com a API

A URL base é configurada via variável de ambiente `NEXT_PUBLIC_API_URL`.

### Serviços

| Serviço | Arquivo | Endpoints |
|---------|---------|-----------|
| **QueryService** | `services/QueryService.ts` | `POST /consulta` |
| **PipelineService** | `services/PipelineService.ts` | `POST /etl/executar`, `GET /etl/historico` |
| **ScheduleService** | `services/ScheduleService.ts` | `POST /v1/agendamentos` |

### Formato da resposta esperada (`IQueryResponse`)

```typescript
{
  pergunta: string
  intencao_detectada: string
  confianca: number
  entidades: { municipios: string[], periodo: object }
  resumo: string
  estatisticas: object
  fontes: Array<{ nome: string, identificador: string }>
  geojson: GeoJSON.FeatureCollection | null
  total_resultados: number
  tempo_processamento_ms: number
}
```

---

## Estrutura de Diretórios

```
API-6-FRONT/
  app/
    layout.tsx              Layout raiz (Navbar + Providers)
    page.tsx                Página principal
    favicon.ico

  components/               Componentes React
    Chat/                   Painel de chat
    Map/                    Painel do mapa
    Navbar/                 Barra de navegação + modal ETL
    Inputs/                 Inputs reutilizáveis
    Modal/                  Modal base
    Popover/                Popover base
    Tooltip/                Tooltip base
    Button.tsx
    Footer.tsx
    Icon/
    Providers.tsx

  services/                 Camada de acesso à API
    BaseService.ts          Fetch wrapper com tratamento de erro
    QueryService.ts         Consulta em linguagem natural
    PipelineService.ts      Execução e histórico do ETL
    ScheduleService.ts      Agendamento do ETL

  interfaces/               Tipagens TypeScript
    services/               Interfaces de request/response
    components/             Interfaces de props
    geojson.ts              Tipagem GeoJSON
    json.ts                 Tipos auxiliares

  constants/
    map.ts                  Configuração de cores, zoom, providers do mapa
    date.ts                 Constantes de data
    styles/                 Classes CSS reutilizáveis

  helpers/
    mapDetails.tsx          Renderização dos detalhes por fonte no popup

  utils/
    className.ts            Merge de classes (clsx + tailwind-merge)
    date.ts                 Formatação de datas
    formatters.ts           Formatadores gerais

  lib/
    toast.ts                Helper para notificações (Sonner)

  styles/
    global.css              Estilos globais + variáveis CSS
    animations.css          Animações customizadas
    leaflet.css             Overrides do Leaflet
    scrollbar.css           Estilo da scrollbar

  public/
    data/estado-sp.json     GeoJSON do contorno do Estado de SP
    visiona_logo.svg        Logo da Visiona
    paper.svg               Ilustração da tela inicial do mapa

  .env.example              Exemplo de variáveis de ambiente
  next.config.ts
  tsconfig.json
  package.json
```

---

## Como Executar

### Pré-requisitos

- Node.js 20+
- API back-end rodando (ver repositório `API-6-BACK`)

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

Edite `.env` se necessário:

```env
NEXT_PUBLIC_API_URL="http://127.0.0.1:8000/api"
```

### 3. Rodar em Desenvolvimento

```bash
npm run dev
```

Acesse: **http://localhost:3000**

### 4. Build de Produção

```bash
npm run build
npm run start
```

---

## Tecnologias Utilizadas

| Camada | Tecnologia | Versão | Função |
|--------|-----------|--------|--------|
| **Framework** | Next.js | 16.2 | App Router, SSR/CSR |
| **Linguagem** | TypeScript | 5.x | Tipagem estática |
| **UI** | React | 19 | Componentes reativos |
| **Estilo** | Tailwind CSS | 4.x | Utilitários CSS |
| **Mapa** | Leaflet + react-leaflet | 1.9 / 5.0 | Renderização de mapas e GeoJSON |
| **Ícones** | Tabler Icons React | 3.x | Biblioteca de ícones |
| **Componentes** | Radix UI | 1.x | Dialog, Popover, Tooltip acessíveis |
| **Data fetching** | TanStack React Query | 5.x | Cache e sincronização de dados |
| **Notificações** | Sonner | 2.x | Toast de feedback |
| **Datas** | date-fns | 4.x | Formatação e manipulação de datas |
| **CSS utils** | clsx + tailwind-merge | — | Merge de classes condicional |
| **Linting** | ESLint + Prettier | 9.x / 3.x | Qualidade de código |
| **Commits** | Commitlint + Husky | — | Padronização de commits (Conventional Commits) |
