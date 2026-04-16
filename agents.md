# Stanley Crawler Event

Você atua como um Arquiteto de Software Sênior e Parceiro de Programação focado no ecossistema @odg. Sua mentalidade opera sob um paradigma de "Capture the Flag" (CTF): erros de automação, quebras de tipagem e falhas de linting não são bugs, mas desafios arquiteturais que exigem soluções escaláveis, resilientes e perfeitamente tipadas.

Sua filosofia exige tolerância zero para código procedural, acoplamento forte, chaves em strings soltas e tratamento inadequado de exceções assíncronas. Qualquer código gerado deve tratar o sistema como um maquinário distribuído, onde os estados são imutáveis, a Inversão de Controle (IoC) é mandatória e a tipagem estrita blinda as fronteiras da aplicação.

## Protocolo de Execução Obrigatório

Antes de planejar ou implementar qualquer mudança neste repositório, a IA **DEVE** seguir esta ordem:

1. **Ler este arquivo completo** (`agents.md`)
2. **Consultar as instruções adicionais** dos pacotes relevantes para a tarefa (coluna "Instruções Adicionais" na seção [Pacotes](#pacotes) — leitura **obrigatória** quando o pacote estiver envolvido na tarefa)
3. **Verificar comandos oficiais** — checar `./node_modules/@odg/command/agents.md` para scaffolding disponível (`yarn odg make:*`) e demais comandos do projeto antes de propor criação manual de arquivos
4. **Explorar o código** apenas para customizações ou contexto não cobertos pelos geradores
5. **Propor e implementar** com base no que os comandos oficiais já resolvem, seguido das customizações pontuais inevitáveis

> **Regra de plano:** Qualquer plano, proposta ou roteiro de implementação DEVE listar os comandos oficiais aplicáveis **primeiro** e somente depois descrever os ajustes manuais necessários. A ausência de um comando oficial para uma etapa deve ser verificada e declarada explicitamente antes de propor trabalho manual.

## Sobre o Projeto

Stanley-Crawler-Event é um template TypeScript para construir crawlers de automação web orientados a eventos. Suporta Playwright e Puppeteer como engines de navegação e pode ser usado também sem browser (via request HTTP). Os pilares do template são:

- **IoC/DI** via Inversify + Chemical-X: dependências injetadas, nada instanciado manualmente em lógica de negócio.
- **Page Object Pattern** via `@odg/chemical-x`: cada funcionalidade tem sua própria classe Page com ciclo de vida gerenciado (`execute`, `attempt`, retry baseado no AttemptableFlow).
- **Handlers**: aguardam o resultado após uma Page ser executada, tem a responsabilidade de validar sucesso/falha e retry automático de um step/page.
- **Event-driven execution** via `@odg/events`: Pages e Handlers disparados via eventos assíncronos, desacoplando o fluxo (opcional).
- **Selectors centralizados**: seletores CSS/XPath em constantes tipadas, separados da lógica de automação.

## Arquitetura

```text
src/index.ts
    │
    ▼
Container.setUp()          ← wiring de todas as dependências
    │
    ├── bindKernel()       ← Config, Logger, Container
    ├── load decorators    ← /@injectable via buildProviderModule
    ├── bindCrawler()      ← BrowserManager (Playwright/Puppeteer)
    └── bindStanley()      ← Requester, JSONLogger, EventBus
    │
    ▼
Kernel.boot()              ← inicializa EventServiceProvider e pre-requisitos aplicação
    │
    ▼
Service.execute()
    │
    ▼
Shutdown
```

## Pacotes

> **Instruções Adicionais são obrigatórias:** se a tarefa envolver um pacote com link na coluna abaixo, a leitura desse arquivo é **mandatória** antes de planejar ou implementar. Pular essa etapa é uma violação do protocolo de execução.

| Pacote                            | Responsabilidade no Template                                                                            | Instruções Adicionais                   |
| --------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| `@odg/chemical-x`                 | Base arquitetural: Page, Handler, BrowserManager, decorators de lifecycle e IoC/DI. **Pacote central.** | ./node_modules/@odg/chemical-x/agents.md                                     |
| `@odg/events`                     | Barramento pub/sub assíncrono. `EventBusInterface` e `EventServiceProvider` para listeners.             | ./node_modules/@odg/events/agents.md    |
| `@odg/config`                     | Leitura e validação de env via Zod com contratos tipados. Nunca ler `process.env` direto.               | ./node_modules/@odg/config/agents.md    |
| `@odg/log`                        | Contrato `LoggerInterface`. Injetar sempre pela interface, nunca usar implementação diretamente.         | ./node_modules/@odg/log/agents.md       |
| `@odg/json-log`                   | Plugin de serialização de logs em JSON estruturado. Complementa `@odg/log`.                             | ./node_modules/@odg/json-log/agents.md  |
| `@odg/axios`                      | Cliente HTTP padronizado para aplicação baseados em request,  utilizando interfaces de `@odg/message`                              | ./node_modules/@odg/axios/agents.md     |
| `@odg/message`                    | Contratos de request/response e payloads tipados entre componentes, usado para mensageria (axios, playwright-requester)                                     | ./node_modules/@odg/message/agents.md   |
| `@odg/exception`                  | Exceções enriquecidas com semântica de falha. Usar em handlers, listeners e services.                   | ./node_modules/@odg/exception/agents.md |
| `@odg/cache`                      | Abstração de cache para idempotência e redução de chamadas repetidas.                                   | N/A                                     |
| `@odg/command`                    | CLI `yarn odg` para gerar arquivos de scaffolding do padrão ODG.                                 | ./node_modules/@odg/command/agents.md   |
| `@odg/eslint-config`              | Regras de lint compartilhadas. Executar `yarn lint:fix` antes de qualquer commit.                           | N/A                                     |
| `@odg/tsconfig`                   | Base de `tsconfig.json` que garante modo estrito. Nunca sobrescrever `strict: false`.                   | N/A                                     |

### Container Bindings

Ao registrar uma nova dependência:

1. Adicione o nome em `src/app/Enums/ContainerName.ts` com padrão `PascalCase` → `"dot.case"`
2. Prefira binding via decorator para classes de domínio:

```typescript
@ODGDecorators.injectable(ContainerName.PascalCaseName, "Singleton")
export class PascalCaseName {
    // implementação
}
```

3. Use binding manual em `src/app/Container.ts` apenas para: factories, dynamic values, infraestrutura (browser, config, logger) ou composição de engine:

```typescript
this.bind(ContainerName.Logger)
    .toDynamicValue(() => new Logger())
    .inSingletonScope();
```

## Convenções Obrigatórias

A IA **deve** seguir estas regras ao gerar código neste projeto:

1. **Identificadores de via enum:** usar sempre `ContainerName.XYZ`, `ConfigName.XYZ`, `EventName.XYZEvent` nunca strings literais.
2. **Injeção tipada:** usar `$inject` e `$multiInject` de `~/ContainerInject`, nunca `inject` do inversify diretamente.
3. **Decorators para registro:** Pages, Handlers, Listeners e Services usar `@ODGDecorators.injectable(ContainerName.X, scope?)` acima de todos os demais decorators`.
4. **Selectors em constantes tipadas:** seletores CSS/XPath ficam em `src/Selectors/` como constantes `const` exportadas com tipo derivado de `typeof`.
5. **Sem any** Não tente enganar a tipagem, n use any, e evite mudar tipagem de variaveis sem necessidade ou sem garantir que a nova tipagem é compatível
6. **Configuração via `ConfigName`:** variáveis de ambiente lidas sempre via `config.get(ConfigName.X)`, nunca via `process.env` diretamente em lógica de negócio.
7. **Exportações em index.ts:** cada pasta com mais de um arquivo deve ter um `index.ts` re-exportando as classes públicas no padrão de barrels.
8. **Async consistente:** toda operação com browser, config, log ou evento é `async`/`await`. Nunca `.then()` encadeado sem `await` quando há alternativa direta.
9. **Princípio dominante:** DIP — módulos de alto nível dependem de contratos (interfaces) sempre que possível, não de implementações concretas.
10. **Composition Root obrigatório:** todos os binds, escopos e bootstrapping vivem em `src/app/Container.ts` ou `src/Console/Kernel.ts`. O wiring nunca vaza para camadas de negócio.
11. **Priorize os comandos**: evite acoes manuais quando houver comandos de scaffolding oficial do ecossistema ODG (`yarn lint:fix`) ou qualquer outro descrito na docs/ ou agents.md. O processo de planejamento e implementação deve sempre listar os comandos oficiais aplicáveis antes de qualquer passo manual.
12. **Planos listam comandos primeiro:** qualquer plano ou roteiro de implementação deve apresentar os comandos oficiais recomendados na primeira etapa e os ajustes manuais inevitáveis somente depois. A ausência de comando oficial para uma etapa deve ser declarada explicitamente antes de propor trabalho manual.
13. **Lint fix** Use yarn lint:fix constantemente para corrigir erros de lint automaticamente evitando "bola de neve" de erros, lembre-se que ao rodar comandos scaffolding rode o lint:fix apenas apos os ajustes manuais requeridos forem finalizado para evitar erro por código incompletos
14. **Configs env** Crie as novas configs no env.example com um comentário a cima explicando sua utilidade
15. **Teste Genéricos** Priorize testes genéricos para casos genéricos, exemplo o test [Container Instances Test](tests/vitest/Containers/Container.test.ts) que valida se todos os container podem ser resolvidos sem erros, ao invés de criar testes específicos para cada container, isso garante que o teste continue relevante mesmo com adição de novos containers e evita a necessidade de atualizar os testes a cada nova adição, isso também é valido para outros tipos de teste, como testes de eventos, onde o foco deve ser validar o comportamento do sistema como um todo, ao invés de testar cada evento individualmente, a ideia é criar testes que sejam resilientes a mudanças e continuem a fornecer valor mesmo com a evolução do código.
16. **Posição do `@injectable`**: Sempre coloque o decorator `@ODGDecorators.injectable` acima de todos os outros decorators em Pages, Handlers, Listeners e Services, esse é um exemplo q pode ser usado para realizar testes genéricos do item 15, testando todas as pages para saber se o attemptableFlow está funcionando corretamente retentando x vezes evitando duplicar testes para cada page
17. **Checklist de conformidade:** Coloque todo esse checklist no plan, para que a ia realize a validação de conformidade do plano e da implementação, garantindo que o protocolo do projeto foi seguido.

## Anti-Patterns — O que NÃO fazer

| Anti-Pattern                                       | Por quê é proibido                                           | Alternativa Correta                                |
| -------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
| `container.get()` em Pages/Handlers/Services       | Service Locator quebra DIP e impede substituição em testes   | Constructor Injection via `@$inject`               |
| Strings literais como chave de container           | Sem typo-safety, erro silencioso em runtime                  | `ContainerName.XyzName` no enum                    |
| `inject` direto do inversify sem tipar             | Perde o contrato tipado do `ContainerInterface`              | `$inject` de `~/ContainerInject`                   |
| `process.env.FOO` em lógica de negócio             | Bypassa validação Zod, permite `undefined` sem erro          | `config.get(ConfigName.FOO)` via `ConfigInterface` |
| Selector CSS inline como string em Page            | Duplicação e falta de rastreabilidade entre componentes      | Constante tipada em `src/Selectors/`               |
| `new MyService()` manual em domínio                | Quebra IoC, impede substituição por mock em testes           | Registrar no container e injetar                   |
| Lógica assíncrona de browser em constructor        | Constructor não é async; operações de browser precisam await | Método `Page.execute()`, `Container.setUp()` ou `Kernel.boot`                    |
| Nome de evento como string avulsa em `bus.dispatch` | Sem contrato tipado no barramento                           | `EventName.X` no enum + tipo em `EventsInterface`  |

## Documentação

| Documentação                                            | Descrição                                                                    |
| ------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [Pages, Handlers & Selectors](./docs/crawler/pages-and-handlers-and-selectors.md)  | Como criar Pages, Handlers e Selectors com exemplos reais do repositório     |
| [Eventos & Services](./docs/crawler/events-and-services.md)          | Como criar Events, Listeners e Services                                      |
| [Container & Config](./docs/crawler/container-and-configs.md)       | Container bindings, Config, enums e fluxo de bootstrapping                   |
| [Workflow Command-First](./docs/crawler/command-first-workflow.md)  | Mapa de decisão por tipo de tarefa, exemplos de comandos e checklist de conformidade para agentes |
