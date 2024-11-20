import Express from "express";
import _ from "lodash";

export function error(e: unknown) {
    if (e instanceof Error)
        console.error(e, e.stack);
    else
        console.error(e);
}

export function reduce<TFrom, TTo extends object>(from: NonNullable<TFrom>, to: { Default: TTo }) {
    return _.pick(from, Object.keys(to.Default)) as TTo;
}

export function route(
    router: Express.Router,
    path: string,
    handlers: { [verb: string]: Express.RequestHandler }
) {
    router.all(path, (req, res, next) => {
        const method = req.method.toLowerCase();

        if (!(method in handlers)) {
            res.status(405)
                .set("Allow", Object.keys(handlers).join(",").toUpperCase())
                .end();
            return;
        }

        handlers[method](req, res, next);
    });
}
