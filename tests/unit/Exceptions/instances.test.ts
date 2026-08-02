import { Exception } from "@odg/exception";

import * as Exceptions from "#exceptions/index.js";

type ExceptionConstructor = new (message: string, previous?: unknown, code?: number | string) => Exception;

const exceptions = Object.values(Exceptions) as ExceptionConstructor[];

describe.each(exceptions)("Exception Instance", (ExceptionClass: ExceptionConstructor) => {
    test(`Instance Exception ${ExceptionClass.name}`, async () => {
        expect(new ExceptionClass("")).toBeInstanceOf(Exception);
    });
});
