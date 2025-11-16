import { Loader2, LogOut } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'

export default () => {
	const [isLoading, setIsLoading] = useState(false)

	const handleLogout = async () => {
		setIsLoading(true)

		try {
			await authClient.signOut()
			window.location.href = '/'
		} catch (error) {
			console.error('Logout failed:', error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Button className='w-full' onClick={handleLogout} disabled={isLoading}>
			{isLoading ? (
				<Loader2 strokeWidth={3} className='mr-2 h-4 w-4 animate-spin' />
			) : (
				<LogOut className='mr-2 h-4 w-4' />
			)}
			Logout
		</Button>
	)
}
