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
- [x] more attributes for citations (depending on edition type?)
- [x] ability to remove a source/citation
- [ ] see information about texts/sources? with button to go edit?
- [ ] better form validation error rendering for `sources`
- [ ] add notes fields widely?

things to "finalize" the app MVP

- [x] switch to using postgres
- [x] restrict editing power to myself via cookie
- [ ] publish to internet (via Vercel)
- [ ] use local postgres instance for development

- [ ] display quote
- [x] display quotes from text
  - [ ] custom start/end comparator
- [ ] display quotes from author
- [ ] search quotes (via regex to start)

tasks from test #1

- [x] question mark by birth year in person form which googles "$NAME birth year"
- [x] quote notes should go at bottom, under sources/citation
- [x] text: year _first published_
- [x] ^^ google me button
- [x] [AUTO] should be "AUTO NEW" or similar (emphasis on new)
- [x] end page _if different_
- [x] on quote creation, scroll back to top
- [x] reset edition start/end/etc on quote creation
- [x] "edition" should show publisher/type/year when it has the same title
- [ ] end page should never be "before" start page (properly compared)
- [ ] be able to edit a quote

- [ ] actually reset start/end when a quote is submitted
- [ ] command + enter to submit
- [ ] content form size should reset (to larger than now) default every time
- [ ] link fictional Persons to texts as "from X book"?
- [ ] difference between author and sayer of a quote?
- [ ] about fields that are different from notes fields

later super upgrades

- [ ] content form input should be bigger, rich text, etc
- [ ] make the quote form not look like crap
- [ ] ensure tab/enter work for navigating form mouselessly
- [ ] dictation for content
- [ ] quote search via embeddings
- [ ] fancy meta tags
- [ ] quote image auto-generator
- [ ] preload meta tags, locally cache/backup URLs entered for editions
- [x] make IDs changeable / able to not be UUIDs
