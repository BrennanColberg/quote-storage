"use client";

import { useState } from "react";
import axios from "axios";

export default function AddQuote() {
	const [text, setText] = useState("");

	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault();
				await axios.post("/api/quotes", { text });
				setText("");
			}}
		>
			<textarea
				name="text"
				value={text}
				onChange={(e) => setText(e.target.value)}
			/>
			<button type="submit">Add Quote</button>
		</form>
	);
}
