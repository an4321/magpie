import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { authClient } from '@/lib/auth-client'

export default () => {
	const [isLoading, setIsLoading] = useState(false)

	return (
		<Button
			className='flex px-6 py-5! text-xl font-bold'
			type='button'
			disabled={isLoading}
			onClick={async () => {
				setIsLoading(true)
				await authClient.signIn.social({ provider: 'github' })
			}}
		>
			{isLoading && <Loader2 strokeWidth={3} className='w-16 animate-spin' />}
			Login with Github
		</Button>
	)
}
