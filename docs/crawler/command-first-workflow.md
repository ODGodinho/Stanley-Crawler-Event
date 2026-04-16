# Workflow Command-First para Agentes de IA

Este documento define a ordem de decisão e os comandos prioritários que a IA deve seguir ao criar ou alterar componentes do template. Antes de qualquer edição manual, o agente deve verificar se o ecossistema ODG já oferece scaffolding oficial.

> **Referência completa de flags e exemplos:** [Make Commands](./node_modules/@odg/command/agents.md) in `./node_modules/@odg/command/agents.md` — este documento não duplica esse conteúdo, apenas mapeia qual comando usar por tipo de tarefa. siga as boas praticas e tudo mencionado no agents.md de @odg/command, você pode ler exemplos praticos e rápidos na sessão [Exemplos de Comandos Operacionais Relevantes](#exemplos-de-comandos-operacionais)

---

## Mapa de Decisão por Tipo de Tarefa

| Tipo de tarefa                         | Comando oficial prioritário                   | Quando ir para trabalho manual                        |
| -------------------------------------- | --------------------------------------------- | ----------------------------------------------------- |
| Criar uma Page                         | `yarn odg make:page <Name>`                   | Lógica de negócio interna (`execute`, `attempt`)      |
| Criar um Handler                       | `yarn odg make:handler <Name>`                | Lógica de `waitForHandler`, `retrying`, `success`     |
| Criar um Selector                      | `yarn odg make:selector <Name>` (via page)    | Adicionar seletores CSS/XPath dentro do arquivo gerado|
| Criar um Event + Listener              | `yarn odg make:event <Name>`                  | Lógica interna do `handler()` do Listener             |
| Criar Page + Handler + Event juntos    | `yarn odg make:page <Name> --handler-to <X> --event` | Customizações pós-geração em cada arquivo        |
| Criar uma Exception                    | `yarn odg make:exception <Name>`              | Mensagem e payload específicos da exceção             |
| Adicionar enum (ContainerName/EventName/ConfigName) | Sem comando — trabalho manual       | Sempre manual seguir padrao da enum, apos rodar algum desse comandos realize essas inclusões para evitar quaisquer erro de lint |
| Atualizar barrel (`index.ts`)          | Feito automaticamente pelo comando `make:*`   | Apenas se o arquivo não foi gerado por comando        |

---

## Lint tests e build

Prefira procurar problemas ou corrigir usando sempre os comandos contidos no package.json, para test,lint e build, alem nao corrija erros de lint manualmente, use `yarn lint:fix` para corrigir automaticamente quando possível. Isso garante aderência às regras de estilo do projeto e evita mudanças manuais que podem introduzir inconsistências.

## Quando Prosseguir com Trabalho Manual

A edição manual é permitida — e esperada — apenas quando:

1. **O comando oficial não existe** para a peça necessária (exemplo: adicionar valor a um enum, ajustar `tsconfig`, alterar `Container.ts`).
2. **O stub foi gerado**, mas a lógica de negócio específica precisa ser preenchida (exemplo: seletores CSS, lógica de `execute()`, regras de `retrying()`).
3. **A customização é pontual** e não justifica um gerador (exemplo: alterar um binding manual em `Container.ts` para infraestrutura).

> Antes de proceder com trabalho manual em qualquer etapa, o plano deve declarar explicitamente: _"Não há comando oficial disponível para esta etapa."_

---

## Exemplos de Comandos Operacionais Relevantes

```bash
# Scaffolding de componentes
yarn odg make:page Search --selectors --event
yarn odg make:handler GoogleSearch
yarn odg make:event Search
yarn odg make:exception Search

# Verificar scaffolding disponível (documentação completa de flags)
cat ./node_modules/@odg/command/agents.md

# Qualidade e validação
yarn lint:fix           # corrigir lint antes de revisar manualmente
yarn lint              # checar lint sem corrigir (o lint:fix ja retornar todos os erros que não foram corrigidos automaticamente)
yarn test              # rodar suite de testes
yarn build             # verificar compilação TypeScript
```

---

## Checklist de Conformidade para Agentes

Use este checklist para validar se um plano ou implementação respeita o protocolo do projeto.

### Antes de propor um plano

- [ ] Leu este arquivo (`agents.md`) por completo?
- [ ] Consultou as instruções adicionais dos pacotes relevantes (`./node_modules/@odg/<pacote>/agents.md`)?
- [ ] Verificou os comandos disponíveis em `./node_modules/@odg/command/agents.md`?
- [ ] O plano lista os comandos oficiais **antes** dos passos manuais?
- [ ] A ausência de um comando oficial para alguma etapa foi declarada explicitamente?
- [ ] As Convenções Obrigatórias no agents.md foram consideradas e estão planejadas para serem seguidas?
- [ ] Apos rodar todos os comandos make necessários, foi informada a necessidade de criar enum, container enum, events enum logo em sequência para evitar erros de lint, build e test
