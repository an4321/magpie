import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteNote } from '@/lib/note'
import { TrashIcon, Loader2Icon } from 'lucide-react'
import { useAtom } from 'jotai'
import { selectedNoteAtom } from '@/lib/atoms'

export default () => {
	const [selectedNote, _setSelectedNote] = useAtom(selectedNoteAtom)

	const queryClient = useQueryClient()

	const deleteMutation = useMutation({
		mutationFn: deleteNote,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['notes', selectedNote?.pageId],
			})
		},
	})

	if (!selectedNote) return

	return (
		<button
			className='btn p-2!'
			onClick={() => deleteMutation.mutate(selectedNote?.id as number)}
			disabled={deleteMutation.isPending}
		>
			{deleteMutation.isPending ? (
				<Loader2Icon className='size-5 animate-spin' />
			) : (
				<TrashIcon className='size-5' />
			)}
		</button>
	)
}
