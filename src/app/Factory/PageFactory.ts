import { type PageInterface } from "@odg/chemical-x";

import { type MyPage } from "../../engine";

export type PageFactoryType<Page extends PageInterface> = (page: MyPage) => Page;
