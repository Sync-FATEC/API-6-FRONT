# VISIONA GeoQuery — Painel e Consulta Inteligente ASG

Interface web inteligente para consulta por linguagem natural, visualização em mapa dinâmico e monitoramento analítico de dados **ASG (Ambiental, Social e Governança)** de imóveis rurais no Estado de São Paulo. 

Desenvolvido com foco em alta performance, usabilidade e design moderno pela equipe **SYNC**.

---

## 📌 Sumário

1. [Visão Geral](#-visão-geral)
2. [Funcionalidades Principais](#-funcionalidades-principais)
3. [Estrutura de Diretórios](#-estrutura-de-diretórios)
4. [Integração com a API (Serviços)](#-integração-com-a-api-serviços)
5. [Tecnologias Utilizadas](#-tecnologias-utilizadas)
6. [Como Executar o Projeto](#-como-executar-o-projeto)
7. [Convenções e Qualidade](#-convenções-e-qualidade)

---

## 🔮 Visão Geral

O **VISIONA GeoQuery** integra processamento de linguagem natural (NLP) com sistemas de informações geográficas (GIS) para democratizar o acesso e a análise de dados ambientais e territoriais. A plataforma foi desenhada em um layout modular responsivo:

* **Módulo de Chat (NLP):** À esquerda, o usuário interage através de perguntas em linguagem natural (ex: *"Quais terras indígenas existem em Ubatuba?"* ou *"Existem focos de queimada ativos próximos a Unidades de Conservação?"*). O sistema interpreta a intenção, busca as ocorrências e plota os dados espaciais no mapa.
* **Módulo de Mapa Interativo:** À direita, um mapa construído com Leaflet exibe camadas vetoriais e raster em tempo real, com legendas dinâmicas e popups detalhados.
* **Painel de Dashboard:** Centraliza análises históricas temporais das ocorrências (queimadas e alertas de desmatamento), permitindo filtros cruzados por períodos.
* **Painel de Integração QGIS:** Permite que especialistas extraiam conexões WFS/GeoJSON parametrizadas diretamente da plataforma para uso no software QGIS Desktop.

---

## 🚀 Funcionalidades Principais

### 💬 1. Consulta em Linguagem Natural (NLP) e Histórico
* **Entrada de Linguagem Natural:** Campo inteligente para digitação com sugestões de perguntas dinâmicas e clicáveis.
* **Detecção de Intenção e Confiança:** Exibição clara da intenção mapeada e da confiança do modelo de classificação.
* **Resumo e Métricas:** Retorno com resumo textual gerado, fontes rastreáveis utilizadas e tempo de processamento em milissegundos.
* **Gaveta de Histórico (Collapsible Drawer):** Painel lateral retrátil (17.5% de largura) para navegar, carregar ou deletar conversas salvas no histórico pessoal.

### 🗺️ 2. Mapa Interativo (GIS)
* **Base Map Toggle:** Alternância fluida entre visualização de Satélite (Esri WorldImagery) e mapa de ruas (OpenStreetMap).
* **Renderização GeoJSON de Alta Performance:** Desenho automático de pontos, linhas e polígonos, contornando sempre o Estado de São Paulo como referência espacial.
* **Zoom Inteligente (`flyToBounds`):** Movimentação e zoom automáticos e animados da câmera para englobar os resultados retornados.
* **Identidade Visual por Fonte de Dados:**
  
  | Fonte de Dados | Cor do Vetor | Ícone Representativo |
  | :--- | :--- | :--- |
  | **Queimadas (INPE)** | `#ff4444` Vermelho | Flame (Chama) |
  | **Alerta Desmatamento (DETER)** | `#f06400` Laranja Escuro | Axe (Machado) |
  | **Área Desmatada (PRODES)** | `#f77f00` Laranja | Axe (Machado) |
  | **Terra Indígena (FUNAI)** | `#55a630` Verde | Leaf (Folha) |
  | **Unidade de Conservação (ICMBio)** | `#9d4edd` Roxo | Shield (Escudo) |
  | **Quilombo (Palmares)** | `#7A360F` Marrom | Fist (Punho) |
  | **Imóvel Rural (SICAR)** | `#16acf7` Azul Claro | Farm (Fazenda) |

* **Popup Informativo:** Detalhes ricos ao clicar sobre qualquer elemento espacial (exibindo metadados específicos de cada convênio).
* **Legenda Dinâmica:** Exibe dinamicamente no canto do mapa apenas as legendas das fontes que estão ativas na tela atual.

### 📊 3. Dashboard Analítico & Filtro Cruzado
* **Indicadores Rápidos (Cards):** Totalizadores dinâmicos de imóveis rurais, terras indígenas, unidades de conservação e comunidades quilombolas cadastradas.
* **Séries Temporais (Recharts):** Gráficos interativos em linha demonstrando a evolução de queimadas e desmatamento ao longo do tempo.
* **Filtros por Período:** Seletor de data inicial e final via DateTimePicker personalizado.
* **Comunicação Bidirecional (`DaySelectionContext`):** Clicar em qualquer ponto do gráfico do Dashboard redireciona automaticamente o usuário para a tela do chat com o mapa filtrado especificamente para os eventos daquela data selecionada.

### 🔌 4. Integração Dedicada ao QGIS
* **Catálogo de Camadas:** Seletor rápido de dados espaciais consolidados no banco de dados.
* **Gerador de URLs WFS/GeoJSON:** Construtor dinâmico de endpoints com filtros de limite de registros. Os usuários copiam o link diretamente para alimentar o QGIS.
* **Mini-Mapa de Preview:** Visualização estática/leve no próprio navegador antes do download.
* **Estatísticas de Carga:** Informações em tempo real sobre tamanho do arquivo (bytes), contagem de features e tempo de download.
* **Download Direto:** Exportação instantânea do arquivo em formato `.geojson` com filtros aplicados.

### ⚙️ 5. Gerenciamento do Pipeline ETL (Apenas Administradores)
* **Controle de Execução:** Disparo manual das etapas de ingestão, transformação e carga (ETL), respeitando o cooldown de 6 horas estipulado pelo back-end.
* **Terminal de Logs em Tempo Real:** Interface interativa simulando um terminal para acompanhamento passo a passo do processamento dos scripts ETL.
* **Histórico de Pipeline:** Listagem completa de execuções anteriores, indicando o status final (Sucesso/Erro) de cada execução.
* **Agendamento Recorrente:** Definição automatizada de tarefas agendadas baseadas em padrões cron.

### 👤 6. Controle de Usuários e Autenticação
* **Proteção de Rotas:** Telas administrativas e ações sensíveis bloqueadas por cargos (`ADMIN` vs `USER`).
* **CRUD Completo de Usuários:** Cadastro, edição, alteração de cargos e exclusão de contas diretamente pela interface administrativa (para administradores).
* **Autenticação Segura:** Fluxo completo de login, redefinição de senha via link de e-mail e modificação de senha interna.

---

## 📂 Estrutura de Diretórios

```text
API-6-FRONT/
├── app/                      # Roteamento Next.js (App Router)
│   ├── dashboard/            # Página do Dashboard Analítico
│   │   ├── page.tsx          # Componente principal do dashboard
│   │   └── useDashboard.ts   # Hook de controle do dashboard
│   ├── login/                # Página de login do usuário
│   ├── qgis/                 # Página de Integração e Catálogo para o QGIS
│   ├── redefinir-senha/      # Página de recuperação de senha por token
│   ├── users/                # Página de gerenciamento de usuários (ADMIN)
│   ├── layout.tsx            # Estrutura padrão da página (HTML, providers, shell)
│   └── page.tsx              # Página inicial (Chat + Mapa + Histórico)
├── components/               # Componentes React Reutilizáveis
│   ├── Chat/                 # Painel de conversação inteligente
│   │   ├── ChatView/         # Listagem de balões de mensagens e fontes
│   │   ├── HelpModal/        # Instruções de uso e exemplos de consultas
│   │   ├── ChatBox.tsx       # Input de texto e gatilhos de chat
│   │   └── useChatForm.ts    # Hook de controle de estado e envio do chat
│   ├── Dashboard/            # Componentes gráficos e cards analíticos
│   ├── Footer/               # Rodapé com assinatura
│   ├── HistoryList/          # Lista de histórico colapsável lateral
│   ├── Icon/                 # Gerenciamento Centralizado de Ícones (Tabler)
│   ├── Inputs/               # Componentes de formulários (DatePickers, Selects)
│   ├── LogTerminal/          # Painel de log simulado em terminal para ETL
│   ├── Map/                  # Componentes do mapa Leaflet
│   │   ├── components/       # Legend, MapDetails popup, ViewToggle satélite
│   │   ├── LeafletMap.tsx    # Instanciação do mapa e desenho do GeoJSON
│   │   └── useMap.ts         # Manipulação de limites e tiles do mapa
│   ├── Modal/                # Modais base e específicos (CRUD usuários, ETL)
│   ├── Navbar/               # Barra superior com navegação dinâmica e perfil
│   ├── Popover/              # Elementos flutuantes contextuais
│   ├── Tooltip/              # Dicas flutuantes acessíveis
│   ├── AppShell.tsx          # Condiciona exibição de Navbar/Footer por rota
│   └── Providers.tsx         # Configuração de Queries, Auth e DaySelection
├── contexts/                 # Contextos Globais do React
│   ├── AuthContext.tsx       # Gerenciamento de sessão, login, logout e dados do usuário
│   └── DaySelectionContext.tsx# Comunicação de datas selecionadas entre Dashboard/Chat
├── helpers/                  # Funções puras utilitárias para renderizações complexas
├── interfaces/               # Tipagens TypeScript (Componentes, DTOs e GeoJSON)
├── lib/                      # Instanciações e wrappers de bibliotecas (Sonner toast, etc.)
├── services/                 # Integração com a API Backend (Camada de Serviços)
│   ├── AuthService.ts        # Métodos de login, CRUD de usuários e senhas
│   ├── BaseService.ts        # Cliente fetch genérico com interceptador de token JWT
│   ├── ChatHistoryService.ts # Recuperação e deleção de conversas antigas
│   ├── DashboardService.ts   # Coleta de estatísticas gerais e dados temporais
│   ├── PipelineService.ts    # Disparo de pipeline, logs de execução e status do ETL
│   ├── QgisService.ts        # Chamadas de catálogo e metadados das camadas WFS
│   ├── QueryService.ts       # Envio de perguntas de linguagem natural (NLP)
│   └── ScheduleService.ts    # Controle de crons e schedules do ETL
├── styles/                   # Configurações de estilos e variáveis CSS
├── public/                   # Arquivos estáticos (Logos, SVGs, GeoJSON de contorno)
├── .env.example              # Modelo padrão de variáveis de ambiente
├── next.config.ts            # Configurações de compilação Next.js
├── tsconfig.json             # Regras do compilador TypeScript
└── package.json              # Manifesto de dependências e scripts do NPM
```

---

## 🔌 Integração com a API (Serviços)

O frontend interage com o backend estruturado em FastAPI através de endpoints dinâmicos mapeados nos seguintes serviços TypeScript:

* **`BaseService`**: Centraliza as chamadas utilizando `fetch`, adicionando cabeçalhos de autorização (`Authorization: Bearer <Token>`) guardados no local storage e mapeando respostas e erros.
* **`AuthService`**:
  * `POST /v1/auth/login` (Autenticação do usuário)
  * `POST /v1/auth/cadastro` (Criação de novos usuários)
  * `POST /v1/auth/alterar-senha` e `POST /v1/auth/redefinir-senha` (Controles de senhas)
  * `PUT /v1/auth/usuarios/{id}` e `DELETE /v1/auth/usuarios/{id}` (Edição/exclusão de usuários)
* **`ChatHistoryService`**:
  * `GET /conversas` (Recupera histórico do usuário autenticado)
  * `DELETE /conversas/{id}` (Remove uma conversa do histórico)
* **`DashboardService`**:
  * `GET /dados/resumo` (Dados totalizadores rápidos do Dashboard)
  * `GET /dados/queimadas` e `GET /dados/desmatamento` (Séries temporais com filtros de data)
  * `GET /dados/sicar` e `GET /dados/prodes` (Dados espaciais analíticos por período)
* **`PipelineService`**:
  * `POST /etl/executar` (Disparo manual das etapas e entidades)
  * `GET /etl/historico` (Listagem das últimas execuções)
  * `GET /etl/status` e `GET /etl/status/{id}` (Verificação de andamento ou logs do terminal)
  * `POST /etl/cancelar` (Cancela uma execução em andamento)
* **`QgisService`**:
  * `GET /qgis/catalogo` (Lista de camadas integradas e metadados)
  * Renderiza dinamicamente as URLs usando WFS e parâmetros customizados.
* **`QueryService`**:
  * `POST /consulta` (Processa e classifica a pergunta do chat NLP)
* **`ScheduleService`**:
  * `POST /v1/agendamentos` (Cria e atualiza o agendamento cron das execuções)

---

## 🛠️ Tecnologias Utilizadas

A aplicação utiliza as tecnologias mais modernas do ecossistema de desenvolvimento frontend para garantir responsividade, acessibilidade e robustez:

* **Core Framework:** [Next.js 16 (App Router)](https://nextjs.org/) — Performance ideal com Server e Client Components.
* **Bibliotecas UI:** [React 19](https://react.dev/) & [TypeScript 5](https://www.typescriptlang.org/) — Reatividade, tipagem forte e segurança em runtime.
* **Estilização:** [Tailwind CSS 4](https://tailwindcss.com/) — Componentização baseada em utilitários de CSS de última geração altamente responsiva.
* **Visualização Geográfica:** [Leaflet](https://leafletjs.com/) & [React Leaflet 5](https://react-leaflet.js.org/) — Renderização leve de mapas interativos e vetores GeoJSON.
* **Gráficos Analíticos:** [Recharts 3](https://recharts.org/) — Biblioteca para gráficos interativos e responsivos adaptada ao Tailwind.
* **Gerenciamento de Estado & Cache:** [TanStack React Query 5](https://tanstack.com/query/latest) — Sincronização inteligente de dados e cache assíncrono.
* **Acessibilidade de Componentes:** [Radix UI primitives](https://www.radix-ui.com/) — Dialog (Modal), Popover e Tooltip acessíveis e semanticamente corretos.
* **Feedback ao Usuário:** [Sonner](https://emilkowalski.github.io/sonner/) — Sistema de notificações elegantes em formato toast.
* **Data & Hora:** [date-fns 4](https://date-fns.org/) — Manipulação leve e robusta de períodos cronológicos.
* **Qualidade de Código & Padrões:** [ESLint 9](https://eslint.org/), [Prettier 3](https://prettier.io/), [Commitlint 20](https://commitlint.js.org/) e [Husky 9](https://typicode.github.io/husky/) — Garantia de commits limpos, código formatado e conformidade com o padrão *Conventional Commits*.
* **Testes Automatizados:** [Vitest](https://vitest.dev/) e [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) — Testes unitários e de renderização de componentes com alto desempenho.

---

## 💻 Como Executar o Projeto

### Pré-requisitos
* **Node.js** v20 ou superior instalado na máquina.
* O serviço do **Backend (FastAPI)** ativo e rodando.

### 1. Clonar e Instalar as Dependências
Abra o terminal no diretório raiz do projeto e execute:
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
Crie um arquivo `.env` ou `.env.local` na raiz do projeto (utilize o `.env.example` como guia):
```bash
cp .env.example .env.local
```

Abra o arquivo `.env.local` e configure o endereço base da sua API FastAPI:
```env
NEXT_PUBLIC_API_URL="http://127.0.0.1:8000/api"
```

### 3. Executar o Servidor de Desenvolvimento
Inicie o servidor localmente:
```bash
npm run dev
```
Acesse o painel no seu navegador através do endereço: [**http://localhost:3000**](http://localhost:3000).

### 4. Executar Testes Automatizados
Para rodar a suíte de testes com o Vitest:
```bash
npm run test
```

Para monitorar os testes em tempo real (Watch mode):
```bash
npm run test:watch
```

### 5. Compilação para Produção
Para criar a versão otimizada de produção e iniciá-la:
```bash
npm run build
npm run start
```

---

## 🤝 Convenções e Qualidade

O repositório é configurado para prevenir códigos inconsistentes ou mensagens de commit fora dos padrões. 

* **Conventional Commits:** Todas as mensagens de commits devem seguir a convenção convencional (ex: `feat: add qgis dynamic filters`, `fix: map reload bounds`). O `commitlint` validará isso automaticamente antes de finalizar cada commit.
* **Husky Hooks:** Antes de realizar um commit, o Husky roda rotinas automáticas de verificação do ESLint para garantir que nenhum erro de lint seja enviado ao repositório central.

---
*Desenvolvido pela equipe **SYNC** com fins acadêmicos e analíticos.*
