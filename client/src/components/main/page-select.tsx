import {
	CommandDialog,
	CommandEmpty,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import { useEffect, useState } from 'react'
import { selectedPageAtom, type Page } from '@/lib/atoms'
import { useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'

export default () => {
	const queryClient = useQueryClient()
	const pages = queryClient.getQueryData<Page[]>(['pages'])

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

	const [selectedPage, setSelectedPage] = useAtom(selectedPageAtom)

	return (
		<>
			<button
				onClick={() => setOpen(true)}
				className='flex max-w-[180px] items-center gap-2 truncate rounded-[5px] px-2 py-1 text-lg hover:bg-white/25'
			>
				{selectedPage?.title}
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
				</CommandList>
			</CommandDialog>
		</>
	)
}
