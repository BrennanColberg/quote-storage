import { PrismaClient } from "@prisma/client";

export default function AddQuote() {
	async function addQuote(data: FormData) {
		"use server";
		const text = data.get("text");
		if (typeof text !== "string") return;

		const prisma = new PrismaClient();
		const quote = await prisma.quote.create({
			data: { text },
		});
		return quote;
	}

	return (
		<form action={addQuote}>
			<textarea name="text" />
			<button type="submit">Add Quote</button>
		</form>
	);
}
