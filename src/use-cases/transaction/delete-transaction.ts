import { Transaction, TransactionType, User } from "@prisma/client";
import { hash } from "bcryptjs";
import { UserRepository } from "../../repositories/user.repository";
import { UserAlreadyExistsError } from "../errors/user.already-exists-error";
import { Decimal } from "@prisma/client/runtime/library";
import { TransactionRepository } from "../../repositories/transaction.repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

interface DeleteTransactionUseCaseRequest {
	userId: string;
	transactionId: string;
}

interface DeleteTransactionUseCaseResponse {
	message: string;
}

export class DeleteTransactionUseCase {
	constructor(private transactionRepository: TransactionRepository) {}

	async execute({
		userId,
		transactionId,
	}: DeleteTransactionUseCaseRequest): Promise<DeleteTransactionUseCaseResponse> {
		const transactionExists = await this.transactionRepository.findById(
			transactionId
		);

		if (!transactionExists) {
			throw new ResourceNotFoundError(
				`Transaction with id ${transactionId} not found`
			);
		}

		if (transactionExists.userId !== userId) {
			throw new ResourceNotFoundError(
				`Transaction with id ${transactionId} not found`
			);
		}

		await this.transactionRepository.delete(userId, transactionId);

		return {
			message: "Transaction deleted successfully",
		};
	}
}
