import { authClient } from '@/lib/auth-client'
import { Loader2 } from 'lucide-react'
import Login from '../login'
import User from './user'
import SideBar from './side-bar'
import BottomBar from './bottom-bar'
import Notes from './notes/index'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Dialogs from './dialogs'

const queryClient = new QueryClient()

export default () => {
	const { data: session, isPending } = authClient.useSession()

	if (isPending) {
		return (
			<div className='flex h-[90vh] items-center justify-center'>
				<Loader2 className='text-primary size-20 animate-spin' />
			</div>
		)
	}

	if (!session?.user?.name) {
		return (
			<div className='mx-auto flex h-[90vh] max-w-5xl flex-col items-center justify-center p-4'>
				<h1 className='pb-5 text-4xl font-bold'>Welcom to Magpie</h1>
				<Login />
			</div>
		)
	}

	return (
		<QueryClientProvider client={queryClient}>
			<div className='w-full p-2'>
				<SideBar />
				<User />
				<main className='mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center py-40'>
					<Notes />
					<BottomBar />
				</main>
				<Dialogs />
			</div>
		</QueryClientProvider>
	)
}
