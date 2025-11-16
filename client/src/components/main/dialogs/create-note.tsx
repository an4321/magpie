import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

import { useAtom } from 'jotai'
import { useState } from 'react'
import {
	createNoteDialogAtom,
	selectedNoteAtom,
	selectedPageAtom,
	type Note,
} from '@/lib/atoms'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postNote } from '@/lib/note'

export default () => {
	const queryClient = useQueryClient()

	const [name, setName] = useState('')

	const [selectedPage, _setSelectedPage] = useAtom(selectedPageAtom)
	const [_selectedNote, setSelectedNote] = useAtom(selectedNoteAtom)

	const postMutation = useMutation({
		mutationFn: (variables: { title: string; index: number }) => {
			return postNote(
				variables.title,
				variables.index,
				selectedPage?.id as number,
			)
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['notes', selectedPage?.id] })
			setSelectedNote(data[0] as Note)
			setOpen(false)
		},
		onError: (error) => {
			console.error('Error creating note:', error)
		},
	})

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (!name.trim()) return
		postMutation.mutate({ title: name, index: 1 })
		setName('')
	}

	const [open, setOpen] = useAtom(createNoteDialogAtom)

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className='border-2 sm:max-w-[425px]'>
				<DialogTitle>Create Note</DialogTitle>
				<form onSubmit={handleSubmit} className='flex gap-3'>
					<Input
						autoFocus
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder='New Note...'
					/>
					<Button type='submit' disabled={postMutation.isPending}>
						Create
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	)
}
