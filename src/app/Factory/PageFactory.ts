import { type HandlerInterface, type PageInterface } from "@odg/chemical-x";

import { type MyPage } from "@engine";

export type PageOrHandlerFactoryType<
    PageOrHandler extends HandlerInterface | PageInterface,
> = (page: MyPage) => PageOrHandler;
