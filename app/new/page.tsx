import { PrismaClient } from "@prisma/client";

export default function AddQuote() {
	async function addQuote(data) {
		"use server";
		const prisma = new PrismaClient();
		const quote = await prisma.quote.create({
			data: {
				text: "text",
			},
		});
		return quote;
	}

	return (
		<form action={addQuote}>
			<button type="submit">Add Quote</button>
		</form>
	);
}
