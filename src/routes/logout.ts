import Express from "express";

import * as Util from "@~/lib/util.js";

export function register(upper: Express.Router) {
    const router = Express.Router();
    upper.use("/logout", router);

    Util.route(router, "/", { delete: del });
}

const del: Express.RequestHandler = (req, res, next) => {
    req.logout(e => {
        if (e) {
            next(e);
            return;
        }

        res.status(200).end();
    });
};
