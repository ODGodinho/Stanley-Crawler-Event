import { type EventObjectType } from "@odg/events";

import { type EventName } from "../app/Enums";
import { type MyPage } from "../engine";

export interface EventBrowserParameters {
    page: MyPage;
}

export interface EventBaseInterface extends EventObjectType {
    [EventName.HomePage]: EventBrowserParameters;
}

export type EventTypes<T extends Record<EventName, unknown> = EventBaseInterface> = T;
