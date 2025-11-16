import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'

import { PencilIcon as EditIcon } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { selectedNoteAtom } from '@/lib/atoms'
import { putNote } from '@/lib/note'
import { useAtom } from 'jotai'

export default () => {
	const [selectedNote, _setSelectedNote] = useAtom(selectedNoteAtom)

	const queryClient = useQueryClient()

	const [open, setOpen] = useState(false)

	const putMutation = useMutation({
		mutationFn: (variables: {
			id: number
			title: string
			index: number
			pageId: number
			content: string
		}) => {
			return putNote(
				selectedNote?.id as number,
				variables.title,
				variables.content,
				variables.index,
				variables.pageId,
			)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['notes', selectedNote?.pageId],
			})
			setOpen(false)
		},
		onError: (error) => {
			console.error('Error renameing page:', error)
		},
	})

	const [name, setName] = useState(selectedNote?.title || '')
	useEffect(() => {
		setName(selectedNote?.title || '')
	}, [selectedNote])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (!name?.trim()) return
		setOpen(false)
		putMutation.mutate({
			id: selectedNote?.id as number,
			title: name,
			content: selectedNote?.content as string,
			index: selectedNote?.index as number,
			pageId: selectedNote?.pageId as number,
		})
	}

	if (!selectedNote) return

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className='btn p-2!' disabled={putMutation.isPending}>
				<EditIcon className='size-5' />
			</DialogTrigger>
			<DialogContent className='border-2 sm:max-w-md'>
				<DialogTitle>Rename</DialogTitle>
				<form onSubmit={handleSubmit} className='flex gap-2'>
					<Input
						autoFocus
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder='New page...'
					/>
					<Button type='submit' disabled={putMutation.isPending}>
						Save
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	)
}
