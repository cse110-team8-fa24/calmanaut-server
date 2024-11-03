import Knex from "knex";

import * as Constants from "@~/lib/constants.js";

export const Pg = Knex({
    client: "pg",
    connection: Constants.PG_URL,
});
