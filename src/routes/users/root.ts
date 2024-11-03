import Url from "node:url";
import QueryString from "node:querystring";

import Bcrypt from "bcrypt";
import Express from "express";

import * as Db from "@~/lib/db.js";
import * as Models from "@~/models/models.js";
import * as Util from "@~/lib/util.js";

export function register(upper: Express.Router) {
    const router = Express.Router();
    upper.use("/users", router);

    Util.route(router, "/", { get, post });

    import("./id.js").then(m => m.register(router));
}

const get: Express.RequestHandler = (req, res) => {
    if (req.user === undefined) {
        res.status(401).send("Must be logged in to see current user");
        return;
    }

    res.redirect(Url.format({
        pathname: `/users/${req.user.id}`,
        query: req.query as QueryString.ParsedUrlQueryInput,
    }));
};

const post: Express.RequestHandler = async (req, res, next) => {
    try {
        const username: string = req.body["username"];
        const password: string = req.body["password"];

        if (username.length < 8 || username.length > 16) {
            res.status(400).send("Username not 8 to 16 bytes");
            return;
        }

        const passwordSize = Buffer.byteLength(password, "utf8");
        if (passwordSize < 8 || passwordSize > 72) {
            res.status(400).send("Password not 8 to 72 bytes");
            return;
        }

        const existing = await Db.Pg<Models.User>("users")
            .where("username", username)
            .first();
        
        if (existing !== undefined) {
            res.status(409).send("Username taken");
            return;
        }

        const passhash = await Bcrypt.hash(password, 13);
        const id = (await Db.Pg<Models.User>("users").
            insert({ username, passhash }, ["id"]))[0].id;

        res.status(201)
            .set("Location", `/users/${id}`)
            .end();
    } catch (e) {
        Util.error(e);
        next(e);
    }
};
