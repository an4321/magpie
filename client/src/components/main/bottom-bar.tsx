import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Plus, EllipsisVertical } from 'lucide-react'

import { useAtom } from 'jotai'
import {
	createNoteDialogAtom,
	createPageDialogAtom,
	deletePageDialogAtom,
	renamePageDialogAtom,
	selectedPageAtom,
	selectedNoteAtom,
	type Note,
} from '@/lib/atoms'
import MainMenu from './main-menu'
import RenameNote from './notes/rename-note'
import DeleteNote from './notes/delete-note'

export default () => {
	return (
		<div className='bg-background sticky bottom-0 flex w-full items-center justify-between border-2 p-1 pr-4'>
			<div className='flex items-center gap-1'>
				<MainMenu />
			</div>
			<div className='flex gap-2'>
				<RenameNote />
				<DeleteNote />
				<AddNote />
				<MoreOptions />
			</div>
		</div>
	)
}

function MoreOptions() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger className='btn cursor-pointer'>
				<EllipsisVertical className='w-6' />
			</DropdownMenuTrigger>
			<DropdownMenuContent className='my-3'>
				<CreatePage />
				<RenamePage />
				<DeletePage />
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

function AddNote() {
	let [_, set] = useAtom(createNoteDialogAtom)
	let [selectedPage, _setSelectedPage] = useAtom(selectedPageAtom)
	if (!selectedPage) return
	return (
		<button type='button' onClick={() => set(true)} className='btn'>
			<Plus className='w-6' />
		</button>
	)
}

function DeletePage() {
	let [_, set] = useAtom(deletePageDialogAtom)
	return (
		<DropdownMenuItem
			className='text-destructive focus:text-destructive text-md'
			onClick={() => set(true)}
		>
			Delete page
		</DropdownMenuItem>
	)
}

function CreatePage() {
	const [_, set] = useAtom(createPageDialogAtom)

	return (
		<DropdownMenuItem onClick={() => set(true)}>Create Page</DropdownMenuItem>
	)
}

function RenamePage() {
	const [_, set] = useAtom(renamePageDialogAtom)

	return (
		<DropdownMenuItem onClick={() => set(true)}>Rename Page</DropdownMenuItem>
	)
}
