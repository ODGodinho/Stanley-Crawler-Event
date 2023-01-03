import { type EventBusInterface } from "@odg/events";
import { type LoggerInterface } from "@odg/log";
import { type MessageInterface } from "@odg/message";

import type Container from "../app/Container";
import { type ContainerName } from "../app/Enums";
import { type PageFactoryType } from "../app/Factory/PageFactory";
import { type HomeEventListeners } from "../app/Listeners/HomeEventListeners";
import { type EventServiceProvider } from "../app/Provider/EventServiceProvider";
import { type ExampleCrawlerService } from "../app/Services/ExampleCrawlerService";
import { type BrowserClassEngine } from "../engine";
import { type HomePage } from "../Pages/Google/HomePage";

import { type EventTypes } from "./EventsInterface";

export interface ContainerInterface {
    [ContainerName.Logger]: LoggerInterface;
    [ContainerName.Requester]: MessageInterface;
    [ContainerName.EventBus]: EventBusInterface<EventTypes>;
    [ContainerName.Browser]: BrowserClassEngine;
    [ContainerName.Container]: Container;
    [ContainerName.EventServiceProvider]: EventServiceProvider<EventTypes>;

    // Application
    [ContainerName.HomePage]: PageFactoryType<HomePage>;
    [ContainerName.HomeEventListeners]: HomeEventListeners;
    [ContainerName.ExampleCrawlerService]: ExampleCrawlerService;
}

export type ContainerType<T extends Record<ContainerName, unknown> = ContainerInterface> = T;
