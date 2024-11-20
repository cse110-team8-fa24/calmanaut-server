import Express from "express";

import * as Db from "@~/lib/db.js";
import * as Models from "@~/models/models.js";
import * as Util from "@~/lib/util.js";

export function register(upper: Express.Router) {
    const router = Express.Router();
    upper.use("/options", router);

    Util.route(router, "/", { get, put });
}

const get: Express.RequestHandler = async (req, res, next) => {
    if (req.user === undefined) {
        res.status(401).send("Must be logged in to see current options");
        return;
    }

    try {
        const options = await Db.Pg<Models.Options>("options")
            .where("id", req.user.id)
            .first() ?? Models.Options.Default;

        res.status(200).json(Util.reduce(options, Models.OptionsPublic));
        return;
    } catch (e) {
        Util.error(e);
        next(e);
    }
}

const put: Express.RequestHandler = async (req, res, next) => {
    if (req.user === undefined) {
        res.status(401).send("Must be logged in to update options");
        return;
    }

    try {
        const imageKey: string | undefined = req.body["imageKey"];
        const musicKey: string | undefined = req.body["musicKey"];

        const options = await Db.Pg<Models.Options>("options")
            .where("id", req.user.id)
            .first() ?? Models.Options.Default;
        
        options.id = req.user.id;
        options.imageKey = imageKey ?? options.imageKey;
        options.musicKey = musicKey ?? options.musicKey;

        const result = (await Db.Pg<Models.Options>("options")
            .insert(options, ["imageKey", "musicKey"])
            .onConflict("id")
            .merge())[0];

        res.status(201).json(Util.reduce(result, Models.OptionsPublic));
    } catch (e) {
        Util.error(e);
        next(e);
    }
};
