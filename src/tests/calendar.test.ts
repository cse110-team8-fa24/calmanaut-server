import _, { update } from "lodash";
import Supertest from "supertest";
import * as Index from "@~/index.js";

describe("/calendar endpoints while logged out", () => {
    const agent = Supertest.agent(Index.app);

    it("GET /calendar should reject", async () => {
        const res = await agent.get("/calendar");
        expect(res.status).toEqual(401);
    });

    it("POST /calendar/:date should reject", async () => {
        const res = await agent.post("/calendar/2024-11-25");
        expect(res.status).toEqual(401);
    });

    it("DELETE /calendar/:date should reject", async () => {
        const res = await agent.del("/calendar/2024-11-25");
        expect(res.status).toEqual(401);
    });
});

describe("/calendar endpoints while logged in", () => {
    const credentials = {
        username: "dummydummy",
        password: "password",
    };

    const originalDates = new Set([
        "1929-01-15",
        "1707-04-15",
    ]);

    const addedDate = "1925-05-19";
    const invalidDate = "1966-6-13";
    const deletedDate = "1707-04-15";

    const updatedDates = new Set([...originalDates, addedDate].filter(s => s !== deletedDate));

    const agent = Supertest.agent(Index.app);

    beforeAll(async () => {
        const resLogin = await agent.post("/login").send(credentials);
        expect(resLogin.status).toEqual(200);
    });

    it("GET /calendar should return correct dates", async () => {
        const res = await agent.get("/calendar");
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty("meditationDates");

        const dates = new Set(res.body.meditationDates);
        expect(_.isEqual(dates, originalDates)).toBe(true);
    });

    it("POST /calendar/:date should accept", async () => {
        const res = await agent.post("/calendar/" + addedDate);
        expect(res.status).toEqual(201);
        expect(res.body).toHaveProperty("meditationDates");

        const dates = new Set(res.body.meditationDates);
        expect(_.isEqual(dates, new Set([...originalDates, addedDate]))).toBe(true);
    });

    it("POST /calendar/:date with incorrect format should reject", async () => {
        const res = await agent.post("/calendar/" + invalidDate);
        expect(res.status).toEqual(400);
    });

    it("DELETE /calendar/:date should accept", async () => {
        const res = await agent.del("/calendar/" + deletedDate);
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty("meditationDates");

        const dates = new Set(res.body.meditationDates);
        expect(_.isEqual(dates, updatedDates)).toBe(true);
    });

    it("GET /calendar should accurately reflect changes", async () => {
        const res = await agent.get("/calendar");
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty("meditationDates");

        const dates = new Set(res.body.meditationDates);
        expect(_.isEqual(dates, updatedDates)).toBe(true);
    });

    afterAll(async () => {
        let res = await agent.post("/calendar/" + deletedDate);
        expect(res.status).toEqual(201);
        res = await agent.del("/calendar/" + addedDate);
        expect(res.status).toEqual(200);
        res = await agent.del("/calendar/" + invalidDate);
    })
});

afterAll(done => {
    Index.server.close(done);
});
