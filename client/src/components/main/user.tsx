import Logout from '@/components/logout'
import { ModeToggle } from '@/components/mode-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { authClient } from '@/lib/auth-client'

export default () => {
	const { data: session } = authClient.useSession()

	return (
		<Popover>
			<PopoverTrigger className='fixed top-4 right-4 z-30 cursor-pointer'>
				<Avatar className='border-main size-12 border-3'>
					<AvatarImage src={`${session?.user.image}`} />
					<AvatarFallback className='uppercase'>
						{' '}
						{session?.user.name.slice(0, 2)}{' '}
					</AvatarFallback>
				</Avatar>
			</PopoverTrigger>
			<PopoverContent className='bg-background mt-2 mr-6 flex flex-col gap-4 border-2'>
				<div>
					<h3 className='text-lg font-bold'>{session?.user.name}</h3>
					<p className='text-muted-foreground text-lg'>{session?.user.email}</p>
				</div>
				<ModeToggle />
				<Logout />
			</PopoverContent>
		</Popover>
	)
}
