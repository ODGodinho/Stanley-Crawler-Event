import { type HandlerInterface, type PageInterface } from "@odg/chemical-x";

import { type PageClassEngine } from "@engine";

export type PageOrHandlerFactoryType<
    PageOrHandler extends HandlerInterface | PageInterface,
> = (page: PageClassEngine) => PageOrHandler;
