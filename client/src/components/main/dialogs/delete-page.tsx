import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deletePageDialogAtom, selectedPageAtom } from '@/lib/atoms'

import { useAtom } from 'jotai'
import { deletePage } from '@/lib/page'

export default () => {
	const [open, setOpen] = useAtom(deletePageDialogAtom)
	const [selectedPage, setSelectedPage] = useAtom(selectedPageAtom)

	const queryClient = useQueryClient()

	const deleteMutation = useMutation({
		mutationFn: deletePage,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['pages'] })
		},
	})

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className='border-2 sm:max-w-md'>
				<DialogTitle>Confirm delete '{selectedPage?.title}'</DialogTitle>
				<div className='flex gap-5'>
					<Button className='w-fit' onClick={() => setOpen(false)}>
						Cancel
					</Button>
					<Button
						className='w-fit'
						variant='destructive'
						onClick={() => {
							setOpen(false)
							deleteMutation.mutate(selectedPage?.id as number)
							setSelectedPage(undefined)
						}}
					>
						Delete
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
