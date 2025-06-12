import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { UserAlreadyExistsError } from "../../../use-cases/errors/user.already-exists-error";
import { PrismaUserRepository } from "../../../repositories/prisma/prisma-user-repository";
import { CreateUserUseCase } from "../../../use-cases/user/register";
import { CreateTransactionUseCase } from "../../../use-cases/transaction/create-transaction";
import { PrismaTransactionRepository } from "../../../repositories/prisma/prisma-transaction-repository";
import { TransactionType } from "@prisma/client";
import { GetTransactionsUseCase } from "../../../use-cases/transaction/get-transactions";
import { DeleteTransactionUseCase } from "../../../use-cases/transaction/delete-transaction";
import { ResourceNotFoundError } from "../../../use-cases/errors/resource-not-found-error";

export const deleteTransaction = async (
	req: FastifyRequest,
	res: FastifyReply
) => {
	const deleteTransactionBodyParamsSchema = z.object({
		transactionId: z.string(),
	});

	const repository = new PrismaTransactionRepository();
	const deleteTransactionUseCase = new DeleteTransactionUseCase(repository);
	const { transactionId } = deleteTransactionBodyParamsSchema.parse(req.params);

	try {
		const result = await deleteTransactionUseCase.execute({
			userId: req.user.sub,
			transactionId,
		});

		return res.status(201).send(result);
	} catch (err) {
		if (err instanceof ResourceNotFoundError) {
			return res.status(404).send({ message: err.message });
		} else {
			return res.status(500).send(); //TODO: fix later
		}
	}
};
