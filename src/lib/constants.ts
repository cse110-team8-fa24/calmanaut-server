import "dotenv/config";

function throwEnv(name: string) : string {
    throw new ReferenceError(`process.env["${name}"] not set; did you forget to set ${name} in .env?`);
}

export const PORT = parseInt(process.env["PORT"] ?? throwEnv("PORT"));
export const SECRET = process.env["SECRET"] ?? throwEnv("SECRET");
export const PG_URL = process.env["PG_URL"] ?? throwEnv("PG_URL");
export const ORIGIN = process.env["ORIGIN"] ?? "http://localhost:5173";
export const HTTPS = process.env["HTTPS"] === "true";
