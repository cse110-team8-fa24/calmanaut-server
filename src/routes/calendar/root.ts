import Express from "express";
import * as Db from "@~/lib/db.js";
import * as Models from "@~/models/models.js";
import * as Util from "@~/lib/util.js";

export function register(upper: Express.Router) {
    const router = Express.Router();
    upper.use("/calendar", router);

    Util.route(router, "/", { get });

    import("./date.js").then(m => m.register(router));
}

// GET: Retrieve all meditation dates for the logged-in user
const get: Express.RequestHandler = async (req, res, next) => {
    if (req.user === undefined) {
        res.status(401).send("Must be logged in to retrieve meditation dates.");
        return;
    }

    try {
        const user = await Db.Pg<Models.User>("users")
            .where("id", req.user.id)
            .first();

        if (!user) {
            res.status(404).send("User not found.");
            return;
        }

        res.status(200).json({ meditationDates: user.meditationDates || [] });
    } catch (e) {
        Util.error(e);
        next(e);
    }
};
