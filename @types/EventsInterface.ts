import { type EventObjectType } from "@odg/events";

import { type EventName } from "../src/app/Enums";
import { type MyPage } from "../src/engine";

export interface EventBrowserParameters {
    page: MyPage;
}

export interface EventBaseInterface extends EventObjectType {
    [EventName.SearchPage]: EventBrowserParameters;
}

export type EventTypes<T extends Record<EventName, unknown> = EventBaseInterface> = T;
