import Cors from "cors";
import Express from "express";
import ExpressSession from "express-session";

import * as Authentication from "@~/lib/authentication.js";
import * as Constants from "@~/lib/constants.js";

if (Constants.NODE_ENV !== "test")
    console.log("Constants: ", Constants);

export const app = Express();

const corsOptions: Cors.CorsOptions = {
    origin: Constants.ORIGINS.split(";"),
    exposedHeaders: ["Location", "Set-Cookie"],
    credentials: true,
    maxAge: 604800,
};

const sessionOptions: ExpressSession.SessionOptions = {
    secret: Constants.SECRET,
    proxy: Constants.HTTPS,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 604800_000,
        secure: Constants.HTTPS,
        sameSite: Constants.HTTPS ? "none" : false,
    },
};

if (Constants.HTTPS)
    app.set("trust proxy", 1);

app.use(Cors(corsOptions));
app.use(ExpressSession(sessionOptions));
app.use(Authentication.initialize());
app.use(Express.json());
app.use(Express.urlencoded({ extended: false }));

(await import("@~/routes/root.js")).register(app);

app.use((_req: Express.Request, res: Express.Response) => {
    res.status(404).send("API endpoint does not exist");
});

export const server = app.listen(Constants.PORT, () => {
    if (Constants.NODE_ENV !== "test")
        console.log(`Listening on port ${Constants.PORT}`);
});
