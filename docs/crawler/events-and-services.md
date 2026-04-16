# Eventos, Listeners & Services

Este guia cobre como criar e registrar Events, Listeners e Services no template Stanley-Crawler-Event.

---

## Eventos

### O que são Events

Eventos são strings tipadas que representam ações assíncronas no barramento. Cada evento leva um payload específico e é escutado por um ou mais Listeners. O barramento desacopla quem dispara de quem executa.

### Como criar um Event

**1. Declare o nome do evento no enum**

Arquivo: `src/app/Enums/EventName.ts`

```typescript
export enum EventName {
    "SearchPageEvent" = "SearchPageEvent",
    "ExampleEvent" = "ExampleEvent",     // ← adicionar aqui
}
```

#### padrão de nomenclatura
- PascalCase key, PascalCase valor

**2. Declare o tipo do payload na interface de eventos**

Arquivo: `@types/EventsInterface.d.ts`

```typescript
export interface EventBrowserParameters {
    page: PageClassEngine;
}

// Crie aqui EventBrowserParameters

export interface EventsInterface {
    [EventName.SearchPageEvent]: EventBrowserParameters;
    [EventName.ExampleEvent]: MyCustomExamplePayload;  // ← adicionar aqui use EventBrowserParameters se n for receber nenhum informacao alem do browser ou crie sua própria tipagem
}
```

**3. Disparar o evento em um Service ou Handler**

```typescript
await this.bus.dispatch(EventName.ExampleEvent, { page: this.page });
```

---

## Listeners

### O que é um Listener

Um Listener é uma classe que escuta um evento específico do barramento e executa uma ação em resposta — tipicamente iniciando a execução de uma Page.

### Como criar um Listener

**1. Scaffolding (recomendado)**

```bash
# yarn odg make:listener Example -- src/app/Listeners/ExampleEventListener
yarn odg make:event <eventName>

# ou

# Para gerar uma page e seu evento junto
yarn odg make:page <NomeDaPage> --event
```

Isso cria o Listener e o conecta ao evento automaticamente.

**2. Estrutura padrão da classe**

```typescript
import { ODGDecorators } from "@odg/chemical-x";
import type { EventListenerInterface } from "@odg/events";
import type { LoggerInterface } from "@odg/log";

import type { EventBrowserParameters, EventTypes } from "#types/EventsInterface";
import { ContainerName, EventName } from "@enums";
import type { ExamplePage } from "@pages";
import { $inject } from "~/ContainerInject";

@ODGDecorators.injectable(ContainerName.ExampleEventListener, "Singleton")
@ODGDecorators.registerListener(EventName.ExampleEvent, ContainerName.ExampleEventListener, {})
export class ExampleEventListener implements EventListenerInterface<EventTypes, EventName.ExampleEvent> {

    public constructor(
        @$inject(ContainerName.Logger) public readonly log: LoggerInterface,
        @$inject(ContainerName.ExamplePage) public readonly examplePage: ExamplePage,
    ) {
    }

    public async handler({ page }: EventBrowserParameters): Promise<void> {
        await this.log.debug("ExampleEventListener disparado");
        await this.examplePage.setPage(page).execute();
    }

}
```

**3. Registrar no ContainerName**

Arquivo: `src/app/Enums/ContainerName.ts`

```typescript
"ExampleEventListener" = "example.event.listener",
```

**4. Exportar no index da pasta**

Arquivo: `src/app/Listeners/index.ts`

```typescript
export * from "./ExampleEventListener";
```

**Exemplo canônico:** [`src/app/Listeners/SearchEventListener.ts`](../../src/app/Listeners/SearchEventListener.ts)

### Como o Listener é registrado automaticamente

O decorator `@ODGDecorators.registerListener(EventName.X, ContainerName.X, {})` registra o listener no `EventServiceProvider` via `ODGDecorators.getEvents(container)`. Desde que a classe seja importada (via `@listeners` no Container), ela é descoberta automaticamente no boot.

---

## Services

### O que é um Service

Um Service é a camada de orquestração: ele recebe o browser, cria contextos e páginas, dispara eventos e executa handlers. É o ponto de entrada do fluxo de automação.

### Como criar um Service

**1. Estrutura padrão da classe**

```typescript
import { ODGDecorators } from "@odg/chemical-x";
import type { EventBusInterface } from "@odg/events";
import type { LoggerInterface } from "@odg/log";

import type { EventTypes } from "#types/EventsInterface";
import type { BrowserClassEngine } from "@engine";
import { ContainerName, EventName } from "@enums";
import { $inject } from "~/ContainerInject";

import type { ExampleHandler } from "../../Handlers/Example/ExampleHandler";

@ODGDecorators.injectable(ContainerName.MyCrawlerService, "Singleton")
export class MyCrawlerService {

    public constructor(
        @$inject(ContainerName.Logger) protected log: LoggerInterface,
        @$inject(ContainerName.EventBus) protected bus: EventBusInterface<EventTypes>,
        @$inject(ContainerName.Browser) protected browser: BrowserClassEngine,
        @$inject(ContainerName.ExampleHandler) protected exampleHandler: ExampleHandler,
    ) {
    }

    public async execute(): Promise<void> {
        await this.log.info("Iniciando serviço de crawler");

        const context = await this.browser.newContext();
        const page = await context.newPage();

        // Dispara o evento que aciona a Page via Listener
        await this.bus.dispatch(EventName.ExampleEvent, { page });

        // Aguarda confirmação via Handler
        // Você tb pode colocar handler dentro do evento se preferir, mas cuidado ao executar um evento dentro do handler
        await this.exampleHandler.setPage(page).execute();

        await context.close();
    }

}
```

**Exemplo canônico:** [`src/app/Services/ExampleCrawlerService.ts`](../../src/app/Services/ExampleCrawlerService.ts)

---

## Fluxo completo de um ciclo de execução

```
Service.execute()
    │
    ├── 1. browser.newContext() → context.newPage() → page
    │
    ├── 2. bus.dispatch(EventName.ExampleEvent, { page })
    │         └── ExampleEventListener.handler({ page })
    │                   └── ExamplePage.setPage(page).execute()
    │                               └── interação com o browser
    │
    └── 3. ExampleHandler.setPage(page).execute()
                │
                ├── waitForHandler: identifySuccess() vs identifyFailure()
                |
                └── AttemptableFlow()  → logica de retrying, success, failure, finish do attemptableFlow
```
