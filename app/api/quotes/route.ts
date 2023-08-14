import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: Request) {
	// extract the data from the request
	const { text } = await request.json();

	const prisma = new PrismaClient();
	const quote = await prisma.quote.create({
		data: { text },
	});
	return NextResponse.json(quote);
}
