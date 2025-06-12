import dayjs from "dayjs";
import minMax from "dayjs/plugin/minMax";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import {
	Prisma,
	RecurrenceType,
	Transaction,
	TransactionType,
} from "@prisma/client";

dayjs.extend(minMax);
dayjs.extend(isSameOrBefore);

export function generateRecurringTransactions(
	base: Transaction
): Prisma.TransactionUncheckedCreateInput[] {
	const { recurrence, repeatUntil } = base;

	if (!recurrence || !repeatUntil) return [base];

	const startDate = dayjs(base.date);
	const endDate = dayjs.min(dayjs(repeatUntil), startDate.add(1, "year"));

	const transactions: Prisma.TransactionUncheckedCreateInput[] = [];
	let current = incrementDate(startDate, recurrence);
	const parentId = base.id;

	while (current.isSameOrBefore(endDate, "day")) {
		transactions.push({
			userId: base.userId,
			amount: base.amount,
			type: base.type,
			isRecurring: true,
			description: base.description,
			date: current.toDate(),
			parentId,
		});

		current = incrementDate(current, recurrence);
	}

	return transactions;
}

function incrementDate(
	date: dayjs.Dayjs,
	recurrence: RecurrenceType
): dayjs.Dayjs {
	switch (recurrence) {
		case RecurrenceType.DAILY:
			return date.add(1, "day");
		case RecurrenceType.WEEKLY:
			return date.add(1, "week");
		case RecurrenceType.MONTHLY:
			return date.add(1, "month");
		case RecurrenceType.YEARLY:
			return date.add(1, "year");
	}
}
