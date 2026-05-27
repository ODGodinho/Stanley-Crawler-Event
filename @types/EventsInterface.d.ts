import type { EventObjectType } from "@odg/events";

import type { EventName } from "../src/app/Enums/index.ts";
import type { PageClassEngine } from "../src/engine.ts";

interface EventBaseInterface extends EventObjectType {
    [EventName.SearchEvent]: EventBrowserParameters;
}

export interface EventBrowserParameters {
    // ! Remove If use API crawlers without browser
    page: PageClassEngine;
}

export type EventTypes<T extends Record<EventName, unknown> = EventBaseInterface> = T;
