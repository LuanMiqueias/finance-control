import { Prisma, Transaction } from "@prisma/client";
import { TransactionRepository } from "../transaction.repository";
import { prisma } from "../../lib/prisma";

export class PrismaTransactionRepository implements TransactionRepository {
	async getAll(userId: string) {
		const transactions = await prisma.transaction.findMany({
			where: { userId },
		});
		return transactions;
	}

	async create(data: Prisma.TransactionUncheckedCreateInput) {
		const transaction = await prisma.transaction.create({
			data,
		});
		return transaction;
	}

	async findById(id: string) {
		const transaction = await prisma.transaction.findUnique({
			where: { id: id },
		});
		return transaction;
	}

	async update(id: string, data: Prisma.TransactionUpdateInput) {
		const transaction = await prisma.transaction.update({
			where: { id: id },
			data,
		});
		return transaction;
	}

	async delete(userId: string, transactionId: string) {
		await prisma.transaction.delete({
			where: { id: transactionId, userId: userId },
		});
	}

	async createMany(data: Prisma.TransactionUncheckedCreateInput[]) {
		await prisma.transaction.createMany({
			data,
		});
	}
}
