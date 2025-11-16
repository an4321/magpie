import { useState, useEffect } from 'react'
import { LaptopMinimal, Moon, Sun } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

export function ModeToggle() {
	const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light')

	useEffect(() => {
		const isDarkMode = document.documentElement.classList.contains('dark')
		setTheme(isDarkMode ? 'dark' : 'light')
	}, [])

	useEffect(() => {
		const isDark =
			theme === 'dark' ||
			(theme === 'system' &&
				window.matchMedia('(prefers-color-scheme: dark)').matches)
		document.documentElement.classList[isDark ? 'add' : 'remove']('dark')
	}, [theme])

	return (
		<div className='flex items-center justify-between'>
			<p>Theme</p>
			<ToggleGroup variant='outline' type='single' className='w-29'>
				<ToggleGroupItem value='light' onClick={() => setTheme('light')}>
					<Sun className='h-4 w-4' />
				</ToggleGroupItem>
				<ToggleGroupItem value='dark' onClick={() => setTheme('dark')}>
					<Moon className='h-4 w-4' />
				</ToggleGroupItem>
				<ToggleGroupItem value='system' onClick={() => setTheme('system')}>
					<LaptopMinimal className='h-4 w-4' />
				</ToggleGroupItem>
			</ToggleGroup>
		</div>
	)
}
