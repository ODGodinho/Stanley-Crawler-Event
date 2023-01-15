import { type EventListenerInterface, type EventBusInterface } from "@odg/events";
import { type LoggerInterface } from "@odg/log";
import { type MessageInterface } from "@odg/message";

import { type EventTypes } from "./EventsInterface";

import type Container from "../src/app/Container";
import { type EventName, type ContainerName } from "../src/app/Enums";
import { type PageOrHandlerFactoryType } from "../src/app/Factory/PageFactory";
import { type EventServiceProvider } from "../src/app/Provider/EventServiceProvider";
import { type ExampleCrawlerService } from "../src/app/Services/ExampleCrawlerService";
import type Kernel from "../src/Console/Kernel";
import { type BrowserClassEngine } from "../src/engine";
import { type SearchPage } from "../src/Pages/Google/SearchPage";

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
    [ContainerName.SearchEventListeners]: EventListenerInterface<EventTypes, EventName.SearchPage>;

    // Services
    [ContainerName.ExampleCrawlerService]: ExampleCrawlerService;
}

export type ContainerType<T extends Record<ContainerName, unknown> = ContainerInterface> = T;
