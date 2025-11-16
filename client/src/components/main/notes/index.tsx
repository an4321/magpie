import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'

import Editor from './editor'

import {
	useSuspenseQuery,
	useMutation,
	useQueryClient,
} from '@tanstack/react-query'
import { getNotes, putNote } from '@/lib/note'
import {
	selectedPageAtom,
	selectedNoteAtom,
	type Note,
	noteStatusAtom,
} from '@/lib/atoms'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'

type NotesData = Note[]

export default function Notes() {
	const [selectedPage] = useAtom(selectedPageAtom)

	const { data: notes } = useSuspenseQuery<NotesData>({
		queryKey: ['notes', selectedPage?.id],
		queryFn: () => getNotes(selectedPage?.id as number),
	})

	const [selectedNote, setSelectedNote] = useAtom(selectedNoteAtom)
	if (!selectedNote && notes.length > 0) setSelectedNote(notes[0])

	useEffect(() => {
		if (!selectedNote && notes && notes.length > 0) {
			setSelectedNote(notes[0])
		}
	}, [notes, selectedNote, setSelectedNote])

	if (!notes || notes.length === 0) return null

	return (
		<div className='w-full border-x-2 border-t-2 px-4 py-2'>
			<Accordion
				type='single'
				defaultValue={`${selectedNote?.id}`}
				value={selectedNote ? `${selectedNote.id}` : undefined}
				onValueChange={(v) => {
					const note = notes.find((n) => `${n.id}` === v)
					if (note) setSelectedNote(note)
				}}
			>
				{notes.map((note) => (
					<NoteItem
						key={note.id}
						note={note}
						setSelectedNote={setSelectedNote}
					/>
				))}
			</Accordion>
		</div>
	)
}

function NoteItem({
	note,
	setSelectedNote,
}: {
	note: Note
	setSelectedNote: (n: Note) => void
}) {
	const queryClient = useQueryClient()

	const [content, setContent] = useState(note.content)

	const [_status, setStatus] = useAtom(noteStatusAtom)

	const saveMutation = useMutation({
		mutationFn: (newContent: string) =>
			putNote(
				note.id,
				note.title,
				newContent,
				note.index,
				note?.pageId as number,
			),
		onSuccess: () => {
			setStatus('saved')
			queryClient.invalidateQueries({ queryKey: ['notes', note.pageId] })
		},
	})

	// debounce autosave
	useEffect(() => {
		// no change → no need to save
		if (content === note.content) {
			setStatus('saved')
			return
		}

		setStatus('unsaved')

		const timeout = setTimeout(() => {
			setStatus('saving')
			saveMutation.mutate(content as string)
		}, 1500)

		return () => clearTimeout(timeout)
	}, [content])

	return (
		<AccordionItem value={`${note.id}`}>
			<AccordionTrigger
				className='text-xl'
				onClick={() => setSelectedNote(note)}
			>
				{note.title}
			</AccordionTrigger>

			<AccordionContent className='open pb-0 text-[1rem]'>
				<Editor content={note.content as string} onChange={setContent} />
			</AccordionContent>
		</AccordionItem>
	)
}
