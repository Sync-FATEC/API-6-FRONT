export const SUGGESTIONS = [
  "Unidades de conservação em São Paulo",
  "Me mostre as queimadas em Guarulhos",
  "Lista de desmatamentos no município de Assis",
  "Existem terras indígenas em São Vicente?",
];

export const STEPS = [
  {
    title: "O que é o VISIONA GeoQuery?",
    content: (
      <div className="flex flex-col gap-3 text-slate-600 leading-relaxed">
        <p>
          O <span className="font-semibold text-slate-800">VISIONA GeoQuery</span> é um sistema de
          consulta inteligente para indicadores ambientais de propriedades rurais do estado de São
          Paulo.
        </p>
        <p>
          Através de <span className="font-semibold text-slate-800">linguagem natural</span>, você
          pode fazer perguntas sobre dados como reserva legal, Área de Preservação Permanente (APP),
          desmatamento e irregularidades no CAR — sem precisar saber programar ou usar filtros
          manuais.
        </p>
        <div className="bg-slate-50 rounded-lg p-5 flex flex-col gap-3 my-3">
          <p className="font-semibold text-slate-700 text-sm uppercase tracking-wide">
            Dados disponíveis
          </p>
          <ul className="list-disc list-inside text-slate-600 flex flex-col gap-0.5">
            <li>Reserva legal e APP</li>
            <li>Indicadores de desmatamento</li>
            <li>Cadastro Ambiental Rural (CAR)</li>
            <li>Análise geoespacial por município</li>
          </ul>
        </div>
        <p>
          Os resultados aparecem como texto e também são exibidos no{" "}
          <span className="font-semibold text-slate-800">mapa interativo</span> ao lado.
        </p>
      </div>
    ),
  },
  {
    title: "Como funciona o PLN?",
    content: (
      <div className="flex flex-col gap-3 text-slate-600 leading-relaxed">
        <p>
          O sistema usa{" "}
          <span className="font-semibold text-slate-800">
            Processamento de Linguagem Natural (PLN)
          </span>{" "}
          para entender a sua pergunta. Veja os conceitos principais:
        </p>
        <div className="flex flex-col gap-2">
          {[
            {
              term: "Tokenização",
              def: 'Divide a frase em partes menores (tokens). Ex: "reserva legal em Campinas" -> ["reserva", "legal", "em", "Campinas"]',
            },
            {
              term: "Lematização",
              def: 'Reduz palavras à sua forma base. Ex: "irregularidades" -> "irregular"',
            },
            {
              term: "Intenção detectada",
              def: "Identifica o que você quer saber — ex: área de APP, desmatamento, total de propriedades.",
            },
            {
              term: "Confiança",
              def: "Percentual de certeza do sistema sobre a intenção da sua pergunta. Quanto mais claro, maior a confiança.",
            },
            {
              term: "Entidades",
              def: "Elementos extraídos da pergunta, como nome de município ou período de tempo.",
            },
          ].map(({ term, def }) => (
            <div key={term} className="bg-slate-50 rounded-lg p-3">
              <p className="font-semibold text-slate-800 text-sm mb-0.5">{term}</p>
              <p className="text-slate-600 text-sm leading-relaxed">{def}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "Como interpretar as respostas?",
    content: (
      <div className="flex flex-col gap-3 text-slate-600 leading-relaxed">
        <p>
          Cada resposta do sistema traz informações adicionais que ajudam a avaliar a qualidade e a
          origem dos dados.
        </p>
        <div className="flex flex-col gap-2">
          {[
            {
              term: "Fonte e Ano",
              def: 'Clique em "Mais informações" abaixo da resposta para ver de qual base de dados veio o resultado e o ano de referência.',
            },
            {
              term: "Mapa interativo",
              def: "Quando há dados geoespaciais, as propriedades ou regiões são destacadas automaticamente no mapa à direita.",
            },
            {
              term: "Intenção fora do escopo",
              def: "Se o sistema não reconhecer a pergunta, ele vai indicar que a intenção está fora do escopo — tente reformular de forma mais específica.",
            },
            {
              term: "Tempo de processamento",
              def: "O tempo exibido abaixo da resposta mostra quanto o sistema levou para processar e buscar os dados.",
            },
          ].map(({ term, def }) => (
            <div key={term} className="bg-slate-50 rounded-lg p-3">
              <p className="font-semibold text-slate-800 text-sm mb-0.5">{term}</p>
              <p className="text-slate-600 text-sm leading-relaxed">{def}</p>
            </div>
          ))}
        </div>
        <p className=" text-slate-500 mt-3">
          Pronto! Agora é só fazer sua pergunta.
        </p>
      </div>
    ),
  },
  {
    title: "Integração com QGIS",
    content: (
      <div className="flex flex-col gap-3 text-slate-600 leading-relaxed">
        <p>
          Acesse a aba <span className="font-semibold text-slate-800">QGIS</span> na barra
          superior para gerar URLs prontas das camadas geoespaciais no formato
          <span className="font-mono"> GeoJSON </span> em EPSG:4326.
        </p>
        <div className="bg-slate-50 rounded-lg p-5 flex flex-col gap-2">
          <p className="font-semibold text-slate-700 text-sm uppercase tracking-wide">
            Fluxo recomendado
          </p>
          <ol className="list-decimal list-inside text-slate-600 flex flex-col gap-0.5">
            <li>Escolha a camada desejada (queimadas, SICAR, DETER, etc.).</li>
            <li>Defina filtros opcionais: município, período, bounding box.</li>
            <li>Clique em <strong>Pré-visualizar</strong> para validar no mapa.</li>
            <li>Clique em <strong>Copiar URL</strong> e cole no QGIS.</li>
            <li>
              No QGIS: <span className="font-mono">Layer → Add Vector Layer → Protocol HTTP(S)</span>.
            </li>
          </ol>
        </div>
        <p className="text-sm text-slate-500">
          As camadas SICAR e PRODES podem ser pesadas — use a opção <strong>bbox</strong> ou
          filtros para reduzir o volume antes de carregar no QGIS.
        </p>
      </div>
    ),
  },
];
