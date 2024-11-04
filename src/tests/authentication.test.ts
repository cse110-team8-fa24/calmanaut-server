import Supertest from "supertest";
import * as Index from "@~/index.js";

const req = Supertest(Index.app);

describe("/users endpoints", () => {
    it("GET /users/:id should give basic user details", async () => {
        const res = await req.get("/users/0");
        expect(res.status).toEqual(200);
        expect(res.type).toMatch(/json/);
        expect(res.body.user).toHaveProperty("id", 0);
        expect(res.body.user).toHaveProperty("username", "dummydummy");
        expect(res.body.user).toHaveProperty("createDate");
    });

    it("GET /users/:id with username should redirect", async () => {
        const res = await req.get("/users/dummydummy");
        expect(res.status).toEqual(302);
        expect(res.headers["location"]).toEqual("/users/0");
    });

    it("POST /users with invalid credentials should be rejected", async () => {
        const shortUsername = {
            username: "x".repeat(7),
            password: "x".repeat(12),
        };

        const shortPassword = {
            username: "x".repeat(12),
            password: "x".repeat(7),
        };

        const longUsername = {
            username: "x".repeat(73),
            password: "x".repeat(12),
        };

        const longPassword = {
            username: "x".repeat(12),
            password: "x".repeat(73),
        };

        const takenUsername = {
            username: "dummydummy",
            password: "x".repeat(12),
        };

        let res = await req.post("/users").send(shortUsername);
        expect(res.status).toEqual(400);
        
        res = await req.post("/users").send(shortPassword);
        expect(res.status).toEqual(400);
        
        res = await req.post("/users").send(longUsername);
        expect(res.status).toEqual(400);
        
        res = await req.post("/users").send(longPassword);
        expect(res.status).toEqual(400);
        
        res = await req.post("/users").send(takenUsername);
        expect(res.status).toEqual(409);
    });
});

describe("/login /logout endpoints", () => {
    it("POST /login should reject incorrect credentials", async () => {
        const badPassword = {
            username: "dummydummy",
            password: "foobarbaz",
        };

        const badUsername = {
            username: "x",
            password: "password",
        }

        let res = await req.post("/login").send(badPassword);
        expect(res.status).toEqual(401);
        
        res = await req.post("/login").send(badUsername);
        expect(res.status).toEqual(401);
    });

    const agent = Supertest.agent(Index.app);

    it("POST /login should accept correct credentials", async () => {
        const credentials = {
            username: "dummydummy",
            password: "password",
        };

        const res = await agent.post("/login").send(credentials);
        expect(res.status).toEqual(200);
    });

    it("GET /users should redirect while logged in", async () => {
        const res = await agent.get("/users");
        expect(res.status).toEqual(302);
        expect(res.headers["location"]).toEqual("/users/0");
    });

    it("DELETE /logout should log out user", async () => {
        const res = await agent.delete("/logout");
        expect(res.status).toEqual(200);
    });

    it("GET /users should reject after logging out", async () => {
        const res = await agent.get("/users");
        expect(res.status).toEqual(401);
    });
});

afterAll(done => {
    Index.server.close(done);
});
