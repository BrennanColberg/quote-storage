- see information about texts/sources? with button to go edit?
- better form validation error rendering for `sources`
- search quotes (via regex to start)
- end page should always be "after" start page (properly compared)
- command + enter to submit
- difference between author and sayer of a quote?
- about fields that are different from notes fields
- link to add should show up on index for authenticated users (me)
- way to specify the order of authors (for both text, thing, author)
- data linter script which checks that everything's in the right format
- ISBN / LoC catalog card number / LCC / Dewey on Thing
- content form input should be bigger, rich text, etc
- dictation for content
- quote search via embeddings
- button to visit url? Maybe google button too?
- trim quote content & all other inputs too
- multi paragraph quotes should be indented, not separated vertically
- filtered search on each page that has quotes

- quotes should be able to be "about" a Person
- person title? Idk. Include in long name?
- **edit things from text**
- "about" of each character should be text-specific
- keep track of my info about things (when I got them, when I read them, etc)
- relationships between Persons (relative, etc)?
- "edit last" button in quote creation
- <spoiler> tags in quotes/notes/bios that only show when "spoilers mode" is enabled
- how do I handle cases where multiple "people" are the same person?
- book genres (history, fiction, etc)
- volume as attribute on Thing?
- copy number as attribute on Thing?
- display Thing title when different than Text in SelectThing
- there's some way to tie "primary" source to the combo of text/author I think
- button to reset author of quote form to the author from the text
- how to sort between multiple Thing-volumes when displaying one text?
- subquotes (which power quote bots)
- automatically re-link things which have their IDs change under you (keep track of title → see when the ID is not present in the options → update ID)
- delete button on edit forms
- author from text page should hyperlink
- don't by default generate ID if it isn't already set (i.e. on creation not edit)
- **search button for publisher URL**
- **search button for edition URL**
- **search button for publisher URL**
- **just store twitter username, not link**
- rearrange text edit form. second row: type/year. third row: authors/characters
- represent publisher imprints somehow? publisher-publisher relation?
- notes/id fields under submit button?
- changing text resets things?
- question mark before each input?
- publisher / type info as normal sublist of thing Title (not parens after)
- **autofill Thing when selecting text if only one is attached**
- "add thing" button on homepage/text page
- change thing text to "Publisher, YYYY (Format)"
- on homepage make text list 2-3-level via supertexts
- setup S3 auto dump backup on a schedule
- QR code printer (on label machine) to link from inside covers -> online Things
- primary source default true
- all start/end/line on same row
- show originally published date on text page

- quote count on text page (+ homepage?)
- “star” really good quotes
- **year first published search includes author name**
- automatic ID assignment for new people from their names
- **owner of thing (self? Library? Etc)**
- editor/translator on book itself?
- render citations e.g. {quote/6382353c-d187-4fa4-8393-095d2fac188c} in notes as footnotes with hover-preview and link them to the actual quote (via remark/rehype in ReactMarkdown)
- render quote notes inline in book
- quote “collections” / “themes” / “topics” (e.g. multiple relevant to one point or subject)
- reading logs (start/end/chapters)
- summaries as distinct from notes?

- citation things should be links (e.g. "(Easton Press, 2021)")
- account for precise birth/death dates
- add tooltips to contribution graph via `renderBlock`
- make contribution graph labels percentile-based?
- **automatically make referenced persons' names _within_ a quote into links (and only list subjects beneath the quote if they're not explicitly mentioned in it?)**

- match subtexts/quotes that are not from same Thing
- subtexts should be collapsible (and perhaps collapsed by default?)

- dedicated single quote display page
- easier edit button next to chapter notes
- make ordinal field bigger (maybe add "chapter" automatically? or upon a boolean being flipped on the Text?)
- remove Source header, move delete button down next to TextSelect
- don't show author alongside fictional character in quote byline
- script(s) for ingesting large amounts of quotes from prior systems
- nested subtexts
- should subtexts be text-tied or thing-tied??

- cannot read properties of undefined, reading ‘id’, .filter within useMemo (client side error on add form)
- basic search at 1000 quotes
- sub subtexts, etc
- autoselect thing when making subtexts (urgent!)
- allow for reordering of subtexts in the GUI
- markdown in subtext headers
- don’t put “:” after “.” In subtext headers
- confirmation before “remove” for subtexts with content in their notes
- don’t show characters on text view when there aren’t any
- don’t purge subtext-associated buckets that start at the subsequent
- option/method to show just notes, not quotes
- “summary” on subtexts that’s distinct from “notes”
- edit button next to each subtext that forwards you to its notes/etc field automatically
- make edit form wider and shorter for more information on screen at once
- ordered lists render properly in markdown text fields
- what if I rendered text views as a split screen: on left, notes/summaries; on right, quotes from / that back them up? Right now the view is painfully long but only uses half a desktop screen. Obviously on mobile I would still need to have everything in one line.
- basic intro at top of homepage about what this system is and how it works

General question: how to cite when an author asserts some fact secondhand but in their own words? Am going with citing the proximate author but as a “secondary source.” Versus primary when it’s the author’s own pithy saying or whatever.

2024-01-18

- when two things start at same place but end differently, the one that ends sooner should be sorter AFTER the late ender, not before, as it’s a subset of the latter
- subtext should not need to start BEFORE a later one to be its parent
- subtext summary vs notes
- collapsible subtexts
- rendering quote notes inline
- quote: about vs mentions
- sort about quotes on person page by their position in the text

2024-01-19

- person to “entity” (organization, event, etc). Simplifies general “about,” allows citing institutions/etc
- ^^ “topics”? How do those fit in?

2024-01-20

- how to put Publisher for an article within a journal. Journal? Publisher? ???
- how to put Thing for a paper? PDF probably; DOI field?
- adding DOI field to things would be a boon for citation
- GitHub type field should render based on current time zone not UTC
- quotes should be able to refer to other quotes as a source, without the whole thing being tied to the primary source
  - in general, texts/quotes should be able to cite to different texts/quotes
- journal articles as different type of text/etc
- in general, journal articles citations should be rendered with a “proper”/standard format
- in thing dropdown, show title/subtitle/id of each when the type/publisher/date is the same
- some kind of super-Thing? “The EP copy of X” plus its sub-volumes as distinct?
- incorporate chapter/subtext into some part of the citation?
- migrate stuff to graphql?
- quote sorting into subtexts for multiple sequential things
- ability in a quote to signal a non-paragraph line break (e.g. in poetry) (probably single line break)
- citations in texts say “copy N” instead of the full citation every time (or restrict to minimal difference, e.g. “vol. 1” or “Easton press vol. 1” if there are copies from multiple publishers)
- ensure character description wraps go back to the start of description, not under their name
- when adding quote after button there is a Citation for every Thing
- primary/secondary default based on Text type
- primary/secondary expansion: commentary, data vs opinion, etc
- render short name as nickname in quotes. e.g. Rafael Theodore Cruz (“Ted”)
- timeline for comparing when people were around (especially characters in a book)
- chapter-level characters?
- table of contents at beginning of Text which jumps to the proper subtexts
  - perhaps an equivalent of expandable subtexts
- sort about/by quotes for people into (collapsible) buckets based on text/thing for easier browsing
- show page numbers in subtext on text page
- compute/show “percentage through” its various parent subtexts that a quote is
- make use of 2D on screen more aggressively (interfaces wider especially when editing)
- render line in citation
- text sort options on home screen (# of quotes, date originally published, title, author name, etc)
- “summarizing” relation; not author, but not authored by the author originally either

2024-01-21

- Person → Entity
- Thing → Copy/Version

2024-01-22

- annotation for positions/awards/etc (e.g. POTUS. would love to click a position, see who in my database was in it over time) (or e.g. Nobels)
  - composable: US Senate Seat (Oregon Class II) → { US Senate (Oregon), US Senate (Class II), Senate in XYZth Congress } → U.S. Senate, XYZth Congress, U.S. Congress, etc.
- search (at 1k quotes)
- quote bot engine / integrations
- information on when I read something (though is that even a coherent concept?)
- visual timelines on history books of the lives of their characters
- quizzing / recall / free association features (e.g. who said this, what did X think about Y)
  - need spaced repetition exercises to absorb/integrate all this info over time
- direct edit button/form for subtexts
- locations? Annotated maps somehow? Idk
- meta tags
- buy links (books, quote merchandise)
- quote can be “about” text
- from above, add entities but as separate from people (for stuff like roles, founded, subsidiaries, etc)

Text selector should show ID when ambiguous

2024-02-26

- link person to subtext as character? (→ automatically propagate through text hierarchy)
- subtext end line (in case making scene breaks)
- subtext type (scene, chapter, section, etc)
- ordered lists fix
- how to assign a fictional quote authorship? To author? To character? What if character real and quote {real, fake}?
- themes. Linked to quotes, to subtexts, stuff directly. Collections for question/essay/etc basically
- need to totally rethink associated quotes / primary-secondary / etc. this will likely be some kind of relationship hierarchy between quotes directly (these two are the same; this cites from this; this summarizes this; this is a translation of this; etc). The whole “same quote text multiple sources/citations” is Not It because the quote doesn’t have same text everywhere
