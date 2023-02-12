import { type EventObjectType } from "@odg/events";

import { type MyPage } from "@engine";
import { type EventName } from "@enums";

export interface EventBrowserParameters {
    page: MyPage;
}

export interface EventBaseInterface extends EventObjectType {
    [EventName.SearchPageEvent]: EventBrowserParameters;
}

export type EventTypes<T extends Record<EventName, unknown> = EventBaseInterface> = T;
