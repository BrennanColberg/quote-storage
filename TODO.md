- [x] add tailwind
- [x] add prettier
- [x] add shadcn/ui
- [x] migrate existing form to shadcn/ui

- [x] different form for adding/editing author (full, short?, birth?, death?, gender?, notes)
- [x] system for popping up sub-forms (modal? new window?)

quote form upgrades needed for MVP

- [x] notes
- [x] select multiple authors
- [x] add sources
- [x] add citations to sources
- [x] different form for adding/editing text
- [x] auto refetch data for Selects (at least on every page focus, if not on timer)?
- [x] copy year, subtitle from text to edition (as well as authors)
- [x] easy creation option for making an edition from a text?
- [x] different form for adding/editing editions
- [x] PublisherSelect on edition form
- [x] different form for editing publishers
- [x] make editions practically linkable to multiple texts
- [x] add fictional selector for persons
- [ ] more attributes for citations (depending on edition type?)
- [ ] see information about texts/sources? with button to go edit?
- [ ] better form validation error rendering for `sources`
- [ ] ability to remove a source/citation
- [ ] add notes fields widely?

things to "finalize" the app MVP

- [x] switch to using postgres
- [ ] use local postgres instance for development
- [ ] publish to internet
- [ ] transcribe at least one book's worth of quotes

- [ ] display quote
- [ ] display quotes from text
- [ ] display quotes from author
- [ ] search quotes (via regex to start)

later super upgrades

- [ ] make the quote form not look like crap
- [ ] ensure tab/enter work for navigating form mouselessly
- [ ] dictation for content
- [ ] quote search via embeddings
- [ ] fancy meta tags
- [ ] quote image auto-generator
- [ ] preload meta tags, locally cache/backup URLs entered for editions
- [ ] make IDs changeable / able to not be UUIDs
