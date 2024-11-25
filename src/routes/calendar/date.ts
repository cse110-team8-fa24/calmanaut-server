import Express from "express";
import * as Db from "@~/lib/db.js";
import * as Models from "@~/models/models.js";
import * as Util from "@~/lib/util.js";

export function register(upper: Express.Router) {
    const router = Express.Router();
    upper.use("/", router);

    Util.route(router, "/:date", { post, delete: del });
}

// POST: Add a new meditation date for the logged-in user
const post: Express.RequestHandler = async (req, res, next) => {
    if (req.user === undefined) {
        res.status(401).send("Must be logged in to add a meditation date.");
        return;
    }

    const { date } = req.params;
    if (!date) {
        res.status(400).send("Date is required.");
        return;
    }

    if (date.length !== 10) {
        res.status(400).send("Date should be in yyyy-mm-dd format, e.g. 1970-01-01");
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

        // Add the new date if it doesn't already exist
        const updatedDates = [...new Set([...(user.meditationDates || []), date])];

        await Db.Pg<Models.User>("users")
            .where("id", req.user.id)
            .update("meditationDates", updatedDates);

        res.status(201).json({ meditationDates: updatedDates });
    } catch (e) {
        Util.error(e);
        next(e);
    }
};

// DELETE: Remove a meditation date for the logged-in user
const del: Express.RequestHandler = async (req, res, next) => {
    if (req.user === undefined) {
        res.status(401).send("Must be logged in to delete a meditation date.");
        return;
    }

    const { date } = req.params;
    if (!date) {
        res.status(400).send("Date is required.");
        return;
    }

    if (date.length !== 10) {
        res.status(400).send("Date should be in yyyy-mm-dd format, e.g. 1970-01-01");
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

        // Remove the date from the meditationDates array
        const updatedDates = (user.meditationDates || []).filter((d) => d !== date);

        await Db.Pg<Models.User>("users")
            .where("id", req.user.id)
            .update("meditationDates", updatedDates);

        res.status(200).json({ meditationDates: updatedDates });
    } catch (e) {
        Util.error(e);
        next(e);
    }
};
