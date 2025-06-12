import { FastifyInstance } from "fastify";

// Controllers
import { createTransaction } from "./create-transaction.controller";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { getTransactions } from "./get-transactions.controller";
import { deleteTransaction } from "./delete-transaction.controller";

export const transactionRoutes = async (app: FastifyInstance) => {
	app.post("/transactions", { onRequest: [verifyJWT] }, createTransaction);
	app.get("/transactions", { onRequest: [verifyJWT] }, getTransactions);
	app.post(
		"/transactions/delete/:transactionId",
		{ onRequest: [verifyJWT] },
		deleteTransaction
	);
};
