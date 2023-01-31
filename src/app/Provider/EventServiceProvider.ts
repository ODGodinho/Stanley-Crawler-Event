import {
    EventBusInterface,
    EventServiceProvider as EventServiceProviderBase,
    type EventListener,
} from "@odg/events";
import {
    inject, injectable,
} from "inversify";

import type { EventTypes } from "#types/EventsInterface";
import { ContainerName, EventName } from "@enums";

import Container from "../Container";

@injectable()
export class EventServiceProvider<Events extends EventTypes> extends EventServiceProviderBase<Events> {

    @inject(ContainerName.EventBus)
    protected bus!: EventBusInterface<Events>;

    /**
     * Listeners for events in the application.
     *
     * @protected
     * @type {EventListener<EventTypes>}
     * @memberof EventServiceProvider
     */
    protected listeners: EventListener<EventTypes> = {
        [EventName.SearchPageEvent]: [
            {
                listener: this.container.get(ContainerName.SearchEventListeners),
                options: {
                    once: false,
                },
            },
        ],
    };

    /**
     * Constructor inject container
     *
     * @param {Container} container Container to get listeners
     * @memberof EventServiceProvider
     */
    public constructor(
        @inject(ContainerName.Container) private readonly container: Container,
    ) {
        super();
    }

    /**
     * Boot EventServiceProvider
     *
     * @returns {Promise<void>}
     * @memberof EventServiceProvider
     */
    public async boot(): Promise<void> {
        await super.boot();
    }

    /**
     * Shutdown remove all Events Service Provider
     *
     * @returns {Promise<void>}
     * @memberof EventServiceProvider
     */
    public async shutdown(): Promise<void> {
        await super.shutdown();
    }

}
