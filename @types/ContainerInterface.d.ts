import { type EventListenerInterface, type EventBusInterface } from "@odg/events";
import { type LoggerInterface } from "@odg/log";
import { type MessageInterface } from "@odg/message";

import { type BrowserClassEngine } from "@engine";
import { type EventName, type ContainerName } from "@enums";
import { type PageOrHandlerFactoryType } from "@factory/PageFactory";
import { type SearchPage } from "@pages/Google/SearchPage";
import { type EventServiceProvider } from "@providers/EventServiceProvider";
import { type ExampleCrawlerService } from "@services/ExampleCrawlerService";

import type Container from "../app/Container";
import type Kernel from "../Console/Kernel";

import { type EventTypes } from "./EventsInterface";

export interface ContainerInterface {
    [ContainerName.Logger]: LoggerInterface | undefined;
    [ContainerName.Requester]: MessageInterface;
    [ContainerName.EventBus]: EventBusInterface<EventTypes>;
    [ContainerName.Kernel]: Kernel;
    [ContainerName.Browser]: BrowserClassEngine;
    [ContainerName.Container]: Container;
    [ContainerName.EventServiceProvider]: EventServiceProvider<EventTypes>;

    // Application

    // Pages
    [ContainerName.SearchPage]: PageOrHandlerFactoryType<SearchPage>;

    // Handler
    [ContainerName.SearchHandler]: PageOrHandlerFactoryType<SearchPage>;

    // Events
    [ContainerName.SearchEventListeners]: EventListenerInterface<EventTypes, EventName.SearchPageEvent>;

    // Services
    [ContainerName.ExampleCrawlerService]: ExampleCrawlerService;
}

export type ContainerType<T extends Record<ContainerName, unknown> = ContainerInterface> = T;
