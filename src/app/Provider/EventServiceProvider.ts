import {
    EventBusInterface,
    EventServiceProvider as EventServiceProviderBase,
    type EventListener,
} from "@odg/events";
import {
    inject, injectable,
} from "inversify";

import { type EventTypes } from "#types/EventsInterface";
import { ContainerName, EventName } from "@enums";

import Container from "../Container";

@injectable()
export class EventServiceProvider<Events extends EventTypes> extends EventServiceProviderBase<Events> {

    @inject(ContainerName.EventBus)
    protected bus!: EventBusInterface<Events>;

    /**
     * Listeners for events in the application.
     *
     * @type {EventListener<EventTypes>}
     * @memberof EventServiceProvider
     * @protected
     */
    protected readonly listeners: EventListener<EventTypes>;

    /**
     * Constructor inject container
     *
     * @memberof EventServiceProvider
     * @param {Container} container Container to get listeners
     */
    public constructor(
        @inject(ContainerName.Container) private readonly container: Container,
    ) {
        super();
        this.listeners = this.getListeners();
    }

    /**
     * Boot EventServiceProvider
     *
     * @memberof EventServiceProvider
     * @returns {Promise<void>}
     */
    public async boot(): Promise<void> {
        await super.boot();
    }

    /**
     * Shutdown remove all Events Service Provider
     *
     * @memberof EventServiceProvider
     * @returns {Promise<void>}
     */
    public async shutdown(): Promise<void> {
        await super.shutdown();
    }

    /**
     * Listeners to Load
     *
     * @returns {EventListener<EventTypes>}
     */
    private getListeners(): EventListener<EventTypes> {
        return {
            [EventName.SearchPageEvent]: [
                {
                    listener: this.container.get(ContainerName.SearchEventListeners),
                    options: {
                        once: false,
                    },
                },
            ],
        };
    }

}
