import { type PageInterface } from "@odg/chemical-x";

import type Container from "../app/Container";
import { type PageClassEngine } from "../engine";

export type BasePageInterface = new(page: PageClassEngine, container: Container) => PageInterface;
