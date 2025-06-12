import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { UserAlreadyExistsError } from "../../../use-cases/errors/user.already-exists-error";
import { PrismaUserRepository } from "../../../repositories/prisma/prisma-user-repository";
import { CreateUserUseCase } from "../../../use-cases/user/register";
import { CreateTransactionUseCase } from "../../../use-cases/transaction/create-transaction";
import { PrismaTransactionRepository } from "../../../repositories/prisma/prisma-transaction-repository";
import { RecurrenceType, TransactionType } from "@prisma/client";
import dayjs from "dayjs";

export const createTransaction = async (
	req: FastifyRequest,
	res: FastifyReply
) => {
	const createTransactionSchema = z
		.object({
			description: z.string(),
			amount: z.number(),
			date: z.coerce.date(),
			type: z.enum(["INCOME", "EXPENSE"]),
			isRecurring: z.boolean().optional(),
			recurrence: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]).optional(),
			repeatUntil: z.coerce.date().optional(),
		})
		.refine(
			(data) => {
				if (data.isRecurring && data.repeatUntil) {
					const start = dayjs(data.date);
					const end = dayjs(data.repeatUntil);
					return (
						end.isSame(start) ||
						end.isBefore(start.add(1, "year").add(1, "day"))
					);
				}
				return true;
			},
			{
				message: "repeatUntil must be at most 1 year after the start date",
				path: ["repeatUntil"],
			}
		);

	const repository = new PrismaTransactionRepository();
	const createTransactionUseCase = new CreateTransactionUseCase(repository);

	const { amount, type, description, isRecurring, recurrence, repeatUntil } =
		createTransactionSchema.parse(req.body);

	try {
		await createTransactionUseCase.execute({
			userId: req.user.sub,
			amount,
			type,
			description,
			isRecurring,
			recurrence,
			repeatUntil,
		});
		return res.status(201).send();
	} catch (err) {
		if (err instanceof UserAlreadyExistsError) {
			return res.status(409).send({ message: err.message });
		} else {
			return res.status(500).send(); //TODO: fix later
		}
	}
};
