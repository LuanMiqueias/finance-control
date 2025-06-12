import { Transaction, TransactionType, User } from "@prisma/client";
import { hash } from "bcryptjs";
import { UserRepository } from "../../repositories/user.repository";
import { UserAlreadyExistsError } from "../errors/user.already-exists-error";
import { Decimal } from "@prisma/client/runtime/library";
import { TransactionRepository } from "../../repositories/transaction.repository";

interface GetTransactionsUseCaseRequest {
	userId: string;
}

interface GetTransactionsUseCaseResponse {
	transactions: Transaction[];
}

export class GetTransactionsUseCase {
	constructor(private transactionRepository: TransactionRepository) {}

	async execute({
		userId,
	}: GetTransactionsUseCaseRequest): Promise<GetTransactionsUseCaseResponse> {
		const transactions = await this.transactionRepository.getAll(userId);

		return {
			transactions,
		};
	}
}
