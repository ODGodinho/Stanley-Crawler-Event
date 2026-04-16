# Pages, Handlers & Selectors

Este guia cobre como criar e registrar os três elementos de automação mais comuns do template: Pages (lógica de interação com a UI), Handlers (validação de resultado) e Selectors (seletores CSS/XPath tipados).

---

## Pages

### O que é uma Page

Cada Page representa uma ação ou tela do crawler, seguindo o Page Object Pattern. Se uma mesma URL tem dois propósitos diferentes, crie Pages separadas: `HomePage` e `SearchPage` ficam no mesmo domínio com responsabilidades separadas.

### Ciclo de vida de uma Page

```
Page.setPage(pageEngine)
    │
    └── execute()         ← implementar aqui a lógica de interação
          │
          └── attempt()   ← retorna número máximo de tentativas
                          ← retry automático em caso de falha
```

### Como criar uma Page

**1. Scaffolding com comando (recomendado)**

```bash
yarn odg make:page <NomeDaPage>
# Flags úteis:
#   --selectors       cria o arquivo de selectors junto
#   --event           cria o listener de evento que dispara a page
#   --handler-from    cria o handler que antecede essa page
#   --handler-to      cria o handler que sucede essa page
```

**2. Arquivos a criar/editar manualmente**

| Arquivo                                      | O que fazer                                         |
| -------------------------------------------- | --------------------------------------------------- |
| `src/Pages/<Name>Page.ts`           | Criar a classe herdando de `BasePage` (Feito pelo comando)               |
| `src/Pages/index.ts`                | Re-exportar a nova Page (Feito pelo comando)                          |
| `src/app/Enums/ContainerName.ts`             | Adicionar `"<Name>Page" = "<name>.page"` (Requer ação manual)   |
| `src/Selectors/<Name>Selector.ts`   | Criar os seletores (se `--selectors` não foi usado request ação manual) |

**3. Estrutura padrão da classe**

```typescript
import { ODGDecorators, type PageInterface } from "@odg/chemical-x";

import { ConfigName, ContainerName } from "@app/Enums";
import { BasePage } from "@pages/BasePage";
import { myPageSelector, type MyPageSelectorType } from "@selectors";

@ODGDecorators.injectable(ContainerName.MyPage)
@ODGDecorators.attemptableFlow()
export class MyPage extends BasePage implements PageInterface {

    public readonly $s: MyPageSelectorType = myPageSelector;

    public async execute(): Promise<void> {
        await this.page.goto("https://example.com", { waitUntil: "load" });
        await this.page.fill(this.$s.searchInput, "query");
    }

    public async attempt(): Promise<number> {
        return this.config.get(ConfigName.PAGE_ATTEMPT);
    }

}
```

> **Importante:** `@ODGDecorators.injectable` já registra a classe no container; não adicionar `@provide` manual.

**Exemplo canônico:** [`src/Pages/Google/SearchPage.ts`](../../src/Pages/Google/SearchPage.ts)

### BasePage — dependências disponíveis

`BasePage` (`src/Pages/BasePage.ts`) já injeta via `@$inject`:

| Propriedade | Tipo                         | Descrição                              |
| ----------- | ---------------------------- | -------------------------------------- |
| `this.log`  | `LoggerInterface`            | Logger injetado                        |
| `this.config` | `ConfigInterface<ConfigType>` | Config validada via Zod              |
| `this.page` | `PageClassEngine`            | Instância do page do Playwright/Puppeteer apenas se browser estiver habilitado |
| `this.$$s`  | `typeof Selectors`           | Todos os selectors do projeto          |

---

## Handlers

### O que é um Handler

Um Handler aguarda a confirmação de que uma Page executou com sucesso (ou falhou). Ele corre uma `Promise.race` entre seletores que indicam sucesso e seletores que indicam falha, com retry automático e re-dispatch opcional de eventos.
Tambem pode ser feito no padrão **Nullish Coalescing Operator** `??` para casos mais simples, onde o handler valida uma request do browser/axios e valida múltiplos cenários diferentes para mesma request:

### Ciclo de vida de um Handler

```
Handler.setPage(pageEngine)
    │
    └── execute()
          │
          ├── waitForHandler()     ← Promise.race([ sucesso, falha ]) | identifyError1 ?? identifyError2 ?? identifyAnyError ?? successSolution.bind(this) — retorna HandlerFunction
          └── retrying, success, finish, attempt ...  ← Implementa interface e fluxo attemptableFlow
```

### Como criar um Handler

**1. Scaffolding**

```bash
# yarn odg make:page Login --handler-to Search - Gera: LoginToSearchHandler.ts
yarn odg make:page <NomeDaPage> --handler-to <DestinoDoPage>

# ou

# yarn odg make:handler Search - Gera: SearchHandler.ts
yarn odg make:handler <NomeDoHandler>
```

**2. Estrutura padrão da classe**

```typescript
import {
    type HandlerFunction,
    type HandlerInterface,
    HandlerSolutionType,
    ODGDecorators,
    RetryAction,
} from "@odg/chemical-x";
import type { Exception } from "@odg/exception";

import { ConfigName, ContainerName, EventName } from "@enums";
import { BaseHandler } from "@handlers/BaseHandler";

@ODGDecorators.injectable(ContainerName.MyHandler)
export class MyHandler extends BaseHandler implements HandlerInterface {

    public async waitForHandler(): Promise<HandlerFunction> {
        return Promise.race([
            this.identifySuccess(),
            this.identifyFailure(),
        ]);
    }

    public async getTimeout(): Promise<number> {
        return this.config.get(ConfigName.HANDLER_TIMEOUT);
    }

    public async attempt(): Promise<number> {
        return this.config.get(ConfigName.HANDLER_ATTEMPT);
    }

    public override async retrying(exception: Exception): Promise<RetryAction> {
        await this.log.warning(exception.message);

        // Se podemos colocar isso em 1 solution especifica, podemos controlar melhor quais casos sao retentados
        await this.bus.dispatch(EventName.MyPageEvent, { page: this.page });

        return RetryAction.Default;
    }

    public override async success(): Promise<void> {
        await this.log.alert("Handler resolvido com sucesso");
    }

    private async identifySuccess(): Promise<HandlerFunction> {
        return this.page.locator(this.$$s.mySelector.success)
            .waitFor({ timeout: await this.getTimeout() })
            .then(() => this.successSolution.bind(this));
    }

    private async identifyFailure(): Promise<HandlerFunction> {
        return this.page.locator(this.$$s.mySelector.failure)
            .waitFor({ timeout: await this.getTimeout() })
            .then(() => this.failureSolution.bind(this));
    }

    private async failureSolution(): Promise<HandlerSolutionType> {
        // Colocar o dispatch da page aqui e no retry pode gerar recursividade de tentativa. pois se isso falhar o flow cai no fluxo de retrying
        await this.bus.dispatch(EventName.MyPageEvent, { page: this.page });

        // Retry n tem contador limite, cuidado com loop infinito, prefira algo como throw new Exception("Falha identificada jogando para retrying function para validar se pode rodar waitForHandler novamente") para cair no fluxo de retrying e controlar melhor os casos de retry"
        return RetryAction.Retry;
    }

}
```

> **Importante:** `@ODGDecorators.injectable` já registra o handler no container.

**Exemplo canônico:** [`src/Handlers/GoogleSearch/GoogleSearchHandler.ts`](../../src/Handlers/GoogleSearch/GoogleSearchHandler.ts)

### BaseHandler — dependências disponíveis

`BaseHandler` (`src/Handlers/BaseHandler.ts`) já injeta via `@$inject`:

| Propriedade  | Tipo                             | Descrição                          |
| ------------ | -------------------------------- | ---------------------------------- |
| `this.bus`   | `EventBusInterface<EventTypes>`  | Barramento de eventos              |
| `this.log`   | `LoggerInterface`                | Logger injetado                    |
| `this.config` | `ConfigInterface<ConfigType>`   | Config validada via Zod            |
| `this.page`  | `PageClassEngine`                | Instância do page                  |
| `this.$$s`   | `typeof Selectors`               | Todos os selectors do projeto      |

---

### Quando usar cada tipo de handler

Existe 2 possibilidades de nomes para handler, abaixo alguns exemplos de quando usar cada um:

- `ExampleHandler`
  - Use quando o handler valida um resultado esperado
  - Não depende de uma transição de pagina
  - Exemplo: `LoginHandler` valida o resultado do login, independentemente de onde ele foi iniciado ou para onde foi redirecionado apos isso
- `ExampleToDestinationHandler`
  - Use quando o handler valida uma transição específica entre uma origem e um destino.
  - O resultado esperado da ação é chegar em uma página ou estado definido.
  - Normalmente usado em automações que tem ponto de partida e chegada bem definidos, como um funil de vendas, onde cada etapa tem uma página e o handler valida a transição entre elas. (via request ou seletores)
  - Exemplo: `BuyToPaymentHandler` valida que a `BuyPage` levou o fluxo para a `PaymentPage`.
  - Usado quando mais uma pagina pode levar a mais de 1 lugar dessa forma podemos validar oque chamamos de caminho feliz (BuyToPayment)

#### Regra prática

- Se valida um resultado, use `ExampleHandler`.
- Se valida uma transição + resultado, use `OriginToDestinationHandler`.
- Se não estiver claro o que o handler valida, a IA deve perguntar antes de definir o nome.

## Selectors

### O que são Selectors

Selectors são constantes TypeScript que centralizam seletores CSS/XPath em uma estrutura tipada. Jamais escrever seletores inline dentro de Pages ou Handlers.

### Como criar um Selector

**1. Criar o arquivo**

```text
src/Selectors/<Name>Selector.ts
```

**2. Estrutura padrão**

```typescript
export const myPageSelector = {
    searchInput: "input[name=\"q\"]",
    buttons: {
        submit: "button[type=\"submit\"]",
    },
    results: {
        titles: ".result h3",
        empty: ".no-results",
    },
};

export type MyPageSelectorType = typeof myPageSelector;
```

**3. Exportar no index**

Adicionar em `src/Selectors/index.ts`.

**4. Usar na Page**

```typescript
public readonly $s: MyPageSelectorType = myPageSelector;

// Na execução:
await this.page.fill(this.$s.searchInput, value);
```

**Exemplos canônicos:**

- [`src/Selectors/Google/SearchSelector.ts`](../../src/Selectors/Google/SearchSelector.ts)
- [`src/Selectors/Google/ListSelector.ts`](../../src/Selectors/Google/ListSelector.ts)

# Guia geração de arquivos

Para gerar arquivos com `yarn odg make:` use o guia existente em `./node_modules/@odg/command/agents.md` e os exemplos canônicos do repositório. O comando é flexível para criar Pages, Handlers, Selectors e suas conexões, mas a estrutura e convenções descritas neste guia devem ser seguidas para garantir consistência e aderência à arquitetura do template.
