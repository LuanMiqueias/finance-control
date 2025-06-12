import { RecurrenceType, Transaction, TransactionType } from "@prisma/client";
import { TransactionRepository } from "../../repositories/transaction.repository";
import { generateRecurringTransactions } from "./utils/generate-recurring-transactions";

interface CreateTransactionUseCaseRequest {
	userId: string;
	amount: number;
	type: TransactionType;
	description: string;
	isRecurring?: boolean;
	recurrence?: RecurrenceType;
	repeatUntil?: Date;
}

interface CreateTransactionUseCaseResponse {
	transaction: Transaction;
}

export class CreateTransactionUseCase {
	constructor(private transactionRepository: TransactionRepository) {}

	async execute({
		userId,
		amount,
		type,
		description,
		isRecurring,
		recurrence,
		repeatUntil,
	}: CreateTransactionUseCaseRequest): Promise<CreateTransactionUseCaseResponse> {
		const transactionBase = await this.transactionRepository.create({
			userId,
			amount,
			type,
			description,
			isRecurring,
			recurrence,
			repeatUntil,
		});

		if (isRecurring) {
			const recurringTransactions =
				generateRecurringTransactions(transactionBase);
			console.log(recurringTransactions);
			await this.transactionRepository.createMany(recurringTransactions);
		}
		return {
			transaction: {
				...transactionBase,
			},
		};
	}
}
