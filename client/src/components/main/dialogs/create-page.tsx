import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

import { useAtom } from 'jotai'
import { useState } from 'react'
import { createPageDialogAtom } from '@/lib/atoms'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postPage } from '@/lib/page'

export default () => {
	const queryClient = useQueryClient()

	const [name, setName] = useState('')

	const postMutation = useMutation({
		mutationFn: (variables: { title: string; index: number }) => {
			return postPage(variables.title, variables.index)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['pages'] })
			setOpen(false)
		},
		onError: (error) => {
			console.error('Error creating page:', error)
		},
	})

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (!name.trim()) return
		postMutation.mutate({ title: name, index: 1 })
		setName('')
	}

	const [open, setOpen] = useAtom(createPageDialogAtom)

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className='border-2 sm:max-w-[425px]'>
				<DialogTitle>Create Page</DialogTitle>
				<form onSubmit={handleSubmit} className='grid gap-3'>
					<Input
						autoFocus
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder='New page...'
					/>
					<Button type='submit' disabled={postMutation.isPending}>
						Create Page
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	)
}
