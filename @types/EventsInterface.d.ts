import type { EventObjectType } from "@odg/events";

import type { PageClassEngine } from "#engine";
import type { EventName } from "#enums";

interface EventBaseInterface extends EventObjectType {
    [EventName.SearchEvent]: EventBrowserParameters;
}

export interface EventBrowserParameters {
    // ! Remove If use API crawlers without browser
    page: PageClassEngine;
}

export type EventTypes<T extends Record<EventName, unknown> = EventBaseInterface> = T;
