import { useSuspenseQuery } from '@tanstack/react-query'
import { selectedPageAtom, type Page } from '@/lib/atoms'
import { useAtom } from 'jotai'
import { getPages } from '@/lib/page'

export default () => {
	let [selectedPage, setSelectedPage] = useAtom(selectedPageAtom)
	type PagesData = Page[]

	const { data: pages, isLoading } = useSuspenseQuery<PagesData>({
		queryKey: ['pages'],
		queryFn: getPages,
	})

	if (isLoading) return
	if (pages?.length === 0) return
	if (selectedPage === undefined) setSelectedPage(pages?.[0])

	return (
		<div className='fixed left-2 my-auto hidden h-full flex-col justify-center p-2 text-[22px] lg:left-10 lg:flex xl:left-[130px]'>
			{pages?.map((page) => (
				<button
					type='button'
					key={page.id}
					onClick={() => setSelectedPage(page)}
					className={`${selectedPage?.id === page.id ? 'text-main' : ''} w-34 cursor-pointer truncate text-left`}
				>
					{page.title}
				</button>
			))}
		</div>
	)
}
