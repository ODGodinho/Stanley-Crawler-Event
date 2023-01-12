import { type EventBusInterface } from "@odg/events";
import { type LoggerInterface } from "@odg/log";
import { type MessageInterface } from "@odg/message";

import { type EventTypes } from "./EventsInterface";

import type Container from "../app/Container";
import { type ContainerName } from "../app/Enums";
import { type PageOrHandlerFactoryType } from "../app/Factory/PageFactory";
import { type HomeEventListeners } from "../app/Listeners/HomeEventListeners";
import { type EventServiceProvider } from "../app/Provider/EventServiceProvider";
import { type ExampleCrawlerService } from "../app/Services/ExampleCrawlerService";
import type Kernel from "../Console/Kernel";
import { type BrowserClassEngine } from "../engine";
import { type SearchPage } from "../Pages/Google/SearchPage";

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
    [ContainerName.HomeEventListeners]: HomeEventListeners;

    // Services
    [ContainerName.ExampleCrawlerService]: ExampleCrawlerService;
}

export type ContainerType<T extends Record<ContainerName, unknown> = ContainerInterface> = T;
