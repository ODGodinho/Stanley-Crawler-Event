import type { EventObjectType } from "@odg/events";

import type { PageClassEngine } from "@engine";
import type { EventName } from "@enums";

export interface EventBrowserParameters {
    // ! Remove If use API crawlers without browser
    page: PageClassEngine;
}

export interface EventBaseInterface extends EventObjectType {
    [EventName.SearchPageEvent]: EventBrowserParameters;
}

export type EventTypes<T extends Record<EventName, unknown> = EventBaseInterface> = T;
