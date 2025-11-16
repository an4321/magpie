import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { renamePageDialogAtom, selectedPageAtom } from '@/lib/atoms'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { putPage } from '@/lib/page'

export default () => {
	const queryClient = useQueryClient()

	let [selectedPage, _] = useAtom(selectedPageAtom)

	const [name, setName] = useState(selectedPage?.title || '')
	useEffect(() => {
		setName(selectedPage?.title || '')
	}, [selectedPage])

	const postMutation = useMutation({
		mutationFn: (variables: { title: string; index: number }) => {
			return putPage(
				selectedPage?.id as number,
				variables.title,
				variables.index,
			)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['pages'] })
			setOpen(false)
		},
		onError: (error) => {
			console.error('Error renameing page:', error)
		},
	})

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (!name?.trim()) return
		postMutation.mutate({ title: name, index: 1 })
		setName('')
	}

	const [open, setOpen] = useAtom(renamePageDialogAtom)

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className='border-2 sm:max-w-md'>
				<DialogTitle>Rename Page</DialogTitle>
				<form onSubmit={handleSubmit} className='grid gap-3'>
					<Input
						autoFocus
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder='New page...'
					/>
					<Button type='submit' disabled={postMutation.isPending}>
						Save
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	)
}
