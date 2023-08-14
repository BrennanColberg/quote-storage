"use client";

import { Person } from "@prisma/client";
import axios from "axios";
import { useMemo, useState } from "react";
import Select from "react-select";

export default function NewQuoteForm({ persons }: { persons: Person[] }) {
	const [text, setText] = useState("");

	const personOptions = useMemo(
		() =>
			persons.map((person) => ({
				value: person.id,
				label: person.name,
			})),
		[persons]
	);
	const [personId, setPersonId] = useState(null);

	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault();
				await axios.post("/api/quotes", {
					text,
					authorIds: personId ? [personId] : [],
				});
				setText("");
			}}
		>
			<textarea
				name="text"
				value={text}
				onChange={(e) => setText(e.target.value)}
			/>

			{/* authors */}
			<Select
				options={personOptions}
				onChange={(newValue) => {
					console.log(newValue);
					setPersonId(newValue.value);
				}}
				value={personOptions.find((person) => person.value === personId)}
			/>

			<button type="submit">Add Quote</button>
		</form>
	);
}
