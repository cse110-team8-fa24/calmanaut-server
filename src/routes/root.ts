import Express from "express";

export function register(upper: Express.Router) {
    const router = Express.Router();
    upper.use("/", router);

    import("./login.js").then(m => m.register(router));
    import("./progress.js").then(m => m.register(router));
    import("./calender.js").then(m => m.register(router));
    import("./logout.js").then(m => m.register(router));
    import("./options.js").then(m => m.register(router));
    import("./users/root.js").then(m => m.register(router));
}
