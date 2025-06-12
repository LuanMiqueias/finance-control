import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { UserAlreadyExistsError } from "../../../use-cases/errors/user.already-exists-error";
import { PrismaUserRepository } from "../../../repositories/prisma/prisma-user-repository";
import { CreateUserUseCase } from "../../../use-cases/user/register";
import { CreateTransactionUseCase } from "../../../use-cases/transaction/create-transaction";
import { PrismaTransactionRepository } from "../../../repositories/prisma/prisma-transaction-repository";
import { TransactionType } from "@prisma/client";
import { GetTransactionsUseCase } from "../../../use-cases/transaction/get-transactions";

export const getTransactions = async (
	req: FastifyRequest,
	res: FastifyReply
) => {
	const repository = new PrismaTransactionRepository();
	const getTransactionsUseCase = new GetTransactionsUseCase(repository);

	try {
		const transactions = await getTransactionsUseCase.execute({
			userId: req.user.sub,
		});

		return res.status(201).send(transactions);
	} catch (err) {
		if (err instanceof UserAlreadyExistsError) {
			return res.status(409).send({ message: err.message });
		} else {
			return res.status(500).send(); //TODO: fix later
		}
	}
};
