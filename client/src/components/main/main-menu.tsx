import {
	CommandDialog,
	CommandEmpty,
	CommandInput,
	CommandItem,
	CommandList,
	CommandGroup,
	CommandSeparator,
} from '@/components/ui/command'
import { useEffect, useState } from 'react'
import {
	createPageDialogAtom,
	selectedNoteAtom,
	selectedPageAtom,
	renamePageDialogAtom,
	deletePageDialogAtom,
	type Note,
	type Page,
	noteStatusAtom,
} from '@/lib/atoms'
import { RefreshCcwIcon as RefreshIcon } from 'lucide-react'

import { useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'

export default () => {
	const [selectedPage, setSelectedPage] = useAtom(selectedPageAtom)
	const [selectedNote, setSelectedNote] = useAtom(selectedNoteAtom)
	const [_createPageDialog, setCreatePageDialog] = useAtom(createPageDialogAtom)
	const [_renamePageDialog, setRenamePageDialog] = useAtom(renamePageDialogAtom)
	const [_deletePageDialog, setDeletePageDialog] = useAtom(deletePageDialogAtom)

	const queryClient = useQueryClient()
	const pages = queryClient.getQueryData<Page[]>(['pages'])
	const notes = queryClient.getQueryData<Note[]>(['notes', selectedPage?.id])

	const [open, setOpen] = useState(false)

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (
				(e.key === 'k' && (e.metaKey || e.ctrlKey)) ||
				(e.key === 'a' && e.altKey)
			) {
				e.preventDefault()
				setOpen((open) => !open)
			}
		}

		document.addEventListener('keydown', down)
		return () => document.removeEventListener('keydown', down)
	}, [])

	const [status, _setStatus] = useAtom(noteStatusAtom)

	return (
		<>
			<button
				onClick={() => setOpen(true)}
				className='flex items-center gap-2 rounded-[5px] px-3 text-lg hover:bg-white/25'
			>
				<p className='max-w-42 truncate'>{selectedPage?.title}</p>
				{selectedNote && <p className='pt-[2px] text-2xl'>/</p>}
				<p className='max-w-42 truncate'>{selectedNote?.title}</p>
				{status === 'unsaved' && <p className='pt-2 text-xl'>*</p>}
				{status === 'saving' && (
					<RefreshIcon className='animate-spin-reverse animate-in size-5' />
				)}
			</button>
			<CommandDialog
				open={open}
				onOpenChange={setOpen}
				className='border-2'
				showCloseButton={false}
			>
				<CommandInput />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup heading='Pages'>
						{pages?.map((page) => (
							<CommandItem
								key={page.id}
								onSelect={() => {
									setSelectedPage(page)
									setOpen(false)
								}}
								className={selectedPage?.id === page.id ? 'text-main' : ''}
							>
								<span>{page.title}</span>
							</CommandItem>
						))}
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading='Notes'>
						{notes?.map((note) => (
							<CommandItem
								key={note.id}
								onSelect={() => {
									setSelectedNote(note)
									setOpen(false)
								}}
								className={selectedNote?.id === note.id ? 'text-main' : ''}
							>
								<span>{note.title}</span>
							</CommandItem>
						))}
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading='Actions'>
						<CommandItem
							onSelect={() => {
								setOpen(false)
								setCreatePageDialog(true)
							}}
						>
							<span>Create Page</span>
						</CommandItem>
						<CommandItem
							onSelect={() => {
								setOpen(false)
								setDeletePageDialog(true)
							}}
						>
							<span>Delete Page</span>
						</CommandItem>
						<CommandItem
							onSelect={() => {
								setOpen(false)
								setRenamePageDialog(true)
							}}
						>
							<span>Rename Page</span>
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>
	)
}
