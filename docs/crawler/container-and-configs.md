# Container, Config & Enums

Este guia cobre como registrar dependências no container, configurar variáveis de ambiente e usar os enums centrais do template.

---

## Container

### O que é o Container

O Container (`src/app/Container.ts`) é a Composition Root do projeto. Todos os bindings, escopos e bootstrapping vivem aqui. Nenhuma camada de negócio deve instanciar dependências diretamente ou chamar `container.get()`.

### Fluxo de bootstrapping

```
Container.setUp()
    │
    ├── bindKernel()     ← Config, ConsoleLogger, Logger, Container (self)
    ├── ODGDecorators.loadModule(this)   ← Pages, Handlers, Listeners com @ODGDecorators
    ├── bindCrawler()    ← BrowserManager (Playwright/Puppeteer)
    ├── Kernel.init()    ← inicializa ProcessKernel
    └── bindStanley()    ← Requester (Axios), JSONLogger, EventBus
```

### Quando usar decorator vs. binding manual

| Situação                                   | Abordagem                                 |
| ------------------------------------------ | ----------------------------------------- |
| Classes de domínio (Listener, Service) | `@ODGDecorators.injectable(ContainerName.X, "Singleton")` |
| Pages e Handlers com lifecycle gerenciado  | `@ODGDecorators.injectable(ContainerName.X)` evite singleton para conseguir rodar múltiplas instâncias simultaneamente |
| Class de lib/pacotes npm externos   | Binding manual em `Container.ts`          |
| Factories ou valores dinâmicos             | `.toDynamicValue(() => ...)` em `Container.ts` |

### Como registrar uma nova dependência

#### **1. Declare o nome no enum**

Arquivo: `src/app/Enums/ContainerName.ts`

```typescript
export enum ContainerName {
    // ...existentes...

    // Services
    "MyCrawlerService" = "my.crawler.service",
}
```

##### **Regras**

- chave em `PascalCase`, valor em `dot.case`.

#### **2a. Binding via decorator (classes de domínio)**

```typescript
import { injectable } from "inversify";

import { ContainerName } from "@enums";

@ODGDecorators.injectable(ContainerName.MyCrawlerService, "Singleton")
export class MyCrawlerService {
    // ...
}
```

A classe é descoberta automaticamente desde que seu arquivo seja importado em `src/index.ts` ou via barrel de pasta.

**2b. Binding manual (infraestrutura / valores dinâmicos)**

Arquivo: `src/app/Container.ts`, dentro do método `bindStanley()` ou `bindKernel()`:

```typescript
this.bind(ContainerName.MyInfra)
    .toDynamicValue(() => new MyInfra(someParam))
    .inSingletonScope();
```

**3. Injetar via construtor**

```typescript
import { $inject } from "~/ContainerInject";
import { ContainerName } from "@enums";

export class MyClass {
    public constructor(
        @$inject(ContainerName.Logger) private readonly log: LoggerInterface,
        @$inject(ContainerName.MyCrawlerService) private readonly service: MyCrawlerService,
    ) {}
}
```

**Exemplo canônico:** [`src/app/Container.ts`](../../src/app/Container.ts)

---

## ContainerInject

`src/ContainerInject.ts` exporta `$inject` e `$multiInject` com tipagem forte baseada em `ContainerInterface`. Sempre importar daqui, nunca usar `inject` do inversify diretamente.

```typescript
import { $inject } from "~/ContainerInject";
```

`ContainerInterface` (`@types/ContainerInterface.d.ts`) mapeia cada `ContainerName` ao seu tipo concreto. Ao adicionar uma nova classe ao container, adicionar também o mapeamento na interface.

---

## Config

### Adicionar uma nova variável de ambiente

#### **1. Declare a chave no enum**

Arquivo: `src/app/Enums/ConfigName.ts`

```typescript
export enum ConfigName {
    USE_HEADLESS    = "USE_HEADLESS",
    APP_NAME        = "APP_NAME",
    MY_NEW_VAR      = "MY_NEW_VAR",  // ← adicionar aqui
}
```

**2. Adicione a validação Zod**

Arquivo: `src/Configs/index.ts`

```typescript
export const configValidator = zod.object({
    [ConfigName.USE_HEADLESS]: CustomValidator.zodStringToBoolean(),
    [ConfigName.APP_NAME]:     zod.string().nullish(),
    [ConfigName.MY_NEW_VAR]:   zod.string(),  // ← validação Zod obrigatória
});
```

**3. Adicione ao `.env.example`**

```ini
# Comentário sobre a funcionalidade da config
MY_NEW_VAR=valor_padrao
```

#### **4. Ler o valor na lógica de negócio**

```typescript
const value = await this.config.get(ConfigName.MY_NEW_VAR);
```

> **Nunca** acessar `process.env.MY_NEW_VAR` diretamente em Pages, Handlers, Services ou Listeners. Usar sempre `config.get(ConfigName.X)`. process env so deve ser usado para carregar class config

---

## Enums centrais

| Enum         | Arquivo                              | Finalidade                                         |
| ------------ | ------------------------------------ | -------------------------------------------------- |
| `ContainerName` | `src/app/Enums/ContainerName.ts` | Identificadores de todos os bindings do container  |
| `ConfigName`    | `src/app/Enums/ConfigName.ts`    | Nomes das variáveis de ambiente/config             |
| `EventName`     | `src/app/Enums/EventName.ts`     | Nomes dos eventos do barramento pub/sub            |

Todos exportados via `src/app/Enums/index.ts`.
