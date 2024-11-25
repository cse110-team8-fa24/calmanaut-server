import Express from "express";
import * as Db from "@~/lib/db.js";
import * as Models from "@~/models/models.js";
import * as Util from "@~/lib/util.js";

export function register(upper: Express.Router) {
    const router = Express.Router();
    upper.use("/progress", router);

    Util.route(router, "/", { get, post });
}

// GET: Retrieve meditation dates for the logged-in user
const get: Express.RequestHandler = async (req, res, next) => {
    if (req.user === undefined) {
        res.status(401).send("Must be logged in to see progress");
        return;
    }

    try {
        const user = await Db.Pg<Models.User>("users")
            .where("id", req.user.id)
            .first();

        if (!user) {
            res.status(404).send("User not found");
            return;
        }

        const meditationDates = user.meditationDates ;
        res.status(200).json({ meditationDates });
    } catch (e) {
        Util.error(e);
        next(e);
    }
};

// POST: Add a new meditation date for the logged-in user
const post: Express.RequestHandler = async (req, res, next) => {
    if (req.user === undefined) {
        res.status(401).send("Must be logged in to update progress");
        return;
    }

    const { date } = req.body;
    if (!date) {
        res.status(400).send("Date is required");
        return;
    }

    try {
        const user = await Db.Pg<Models.User>("users")
            .where("id", req.user.id)
            .first();

        if (!user) {
            res.status(404).send("User not found");
            return;
        }

        // Append the new date to existing dates
        const updatedDates = [...(user.meditationDates || []), date];

        // Update the user in the database
        await Db.Pg<Models.User>("users")
            .where("id", req.user.id)
            .update({ meditationDates: updatedDates });

        res.status(201).json({ meditationDates: updatedDates });
    } catch (e) {
        Util.error(e);
        next(e);
    }
};
