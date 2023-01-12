import { type HandlerInterface, type PageInterface } from "@odg/chemical-x";

import { type PageClassEngine } from "../engine";

export type BasePageInterface = new(page: PageClassEngine) => HandlerInterface | PageInterface;
