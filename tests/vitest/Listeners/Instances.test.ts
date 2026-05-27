import type { EventListenerInterface } from "@odg/events";

import { ContainerName } from "#enums";

import { container } from "../SingletonTest";

const listeners = Object.values(ContainerName).filter((value) => value.endsWith(".event.listener"));

describe.each(listeners)("Container Instance Listener", (listenerName: ContainerName) => {
    test(`Instance Listener ${listenerName.toString()}`, async () => {
        const callable = container.get<EventListenerInterface<Record<string, unknown>, string>>(listenerName);

        expect(callable).toHaveProperty("handler");
        expect(typeof callable.handler).toBe("function");
    });
});
