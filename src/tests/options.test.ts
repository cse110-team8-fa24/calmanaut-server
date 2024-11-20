import Supertest from "supertest";
import * as Index from "@~/index.js";

const optionsOld = {
    imageKey: "ocean",
    musicKey: "forest",
};

const options = {
    imageKey: "forest",
    musicKey: "space",
};

describe("/options endpoints while logged out", () => {
    const agent = Supertest.agent(Index.app);

    it("GET /options should reject", async () => {
        const res = await agent.get("/options");
        expect(res.status).toEqual(401);
    });

    it("PUT /options should reject", async () => {
        const res = await agent.put("/options").send(options);
        expect(res.status).toEqual(401);
    });
});

describe("/options endpoints while logged in", () => {
    const credentials = {
        username: "dummydummy",
        password: "password",
    };

    const agent = Supertest.agent(Index.app);

    beforeAll(async () => {
        const resLogin = await agent.post("/login").send(credentials);
        expect(resLogin.status).toEqual(200);
    });

    it("PUT /options should accept options", async () => {

        const res = await agent.put("/options").send(optionsOld);
        expect(res.status).toEqual(201);
    });

    it("PUT /options should accept new options", async () => {

        const res = await agent.put("/options").send(options);
        expect(res.status).toEqual(201);
    });

    it("GET /options should return correct options", async () => {
        const res = await agent.get("/options");
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty("imageKey", options.imageKey);
        expect(res.body).toHaveProperty("musicKey", options.musicKey);
    });
});

afterAll(done => {
    Index.server.close(done);
});
