import Url from "node:url";
import QueryString from "node:querystring";

import Express from "express";

import * as Db from "@~/lib/db.js";
import * as Models from "@~/models/models.js";
import * as Util from "@~/lib/util.js";

export function register(upper: Express.Router) {
    const router = Express.Router();
    upper.use("/", router);

    Util.route(router, "/:id", { get });
}

const get: Express.RequestHandler = async (req, res, next) => {
    type ResponseBodyType = {
        user: Models.UserPublic,
    };

    try {
        const id = Number(req.params["id"]);

        if (isNaN(id)) {
            const user = await Db.Pg<Models.User>("users")
                .where("username", req.params["id"])
                .first();
            
            if (user === undefined) {
                res.status(404).send("No user with given username found");
                return;
            }

            res.redirect(Url.format({
                pathname: `/users/${user.id}`,
                query: req.query as QueryString.ParsedUrlQueryInput,
            }));
        }

        const user = await Db.Pg<Models.User>("users")
            .where("id", id)
            .first();

        if (user === undefined) {
            res.status(404).send("No user with given id found");
            return;
        }

        const u = Util.reduce(user, Models.UserPublic);

        const body: ResponseBodyType = { user: u };
        res.json(body);
    } catch (e) {
        Util.error(e);
        next(e);
    }
};
