import Express from "express";
import Passport from "passport";
import * as PassportLocal from "passport-local";

import * as Util from "@~/lib/util.js";

export function register(upper: Express.Router) {
    const router = Express.Router();
    upper.use("/login", router);

    Util.route(router, "/", { post });
}

const post: Express.RequestHandler = (req, res, next) => {
    const cb: Passport.AuthenticateCallback = (err, user, info, status) => {
        if (err) {
            next(err);
            return;
        }

        if (!user) {
            const code = (Array.isArray(status) ? status[0] : status) ?? 401;
            const message = (info as PassportLocal.IVerifyOptions).message;

            res.status(code).send(message);
            return;
        }

        req.login(user, err => {
            if (err) {
                next(err);
                return;
            }

            res.status(200).end();
        });
    };

    Passport.authenticate("local", cb)(req, res, next);
};
