import { FastifyInstance } from "fastify";

// Controllers
import { createUser } from "./create-user";
import { getUser } from "./get-user";

export const userRoutes = async (app: FastifyInstance) => {
	app.post("/user/register", createUser);
	app.get("/user", getUser);
};
