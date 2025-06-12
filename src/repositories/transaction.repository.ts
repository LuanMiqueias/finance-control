import { Prisma, Transaction } from "@prisma/client";

export interface TransactionRepository {
	getAll(userId: string): Promise<Transaction[]>;
	create(data: Prisma.TransactionUncheckedCreateInput): Promise<Transaction>;
	findById(id: string): Promise<Transaction | null>;
	update(id: string, data: Prisma.TransactionUpdateInput): Promise<Transaction>;
	delete(userId: string, transactionId: string): Promise<void>;
	createMany(data: Prisma.TransactionUncheckedCreateInput[]): Promise<void>;
}
