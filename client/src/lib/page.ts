export async function getPages() {
	try {
		const response = await fetch('/api/page')
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}
		const data = await response.json()
		return data
	} catch (error) {
		console.error('Failed to fetch data:', error)
		throw error
	}
}

export async function postPage(title: string, index: number) {
	try {
		const response = await fetch('/api/page', {
			method: 'post',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ title, index }),
		})
		if (!response.ok) {
			const error = await response.json()
			throw new Error(error.error || 'failed to create page')
		}
		const result = await response.json()
		return result
	} catch (error) {
		console.error('error creating page:', error)
		throw error
	}
}

export async function deletePage(id: number) {
	try {
		const response = await fetch(`/api/page/${id}`, {
			method: 'DELETE',
		})
		if (!response.ok) {
			const error = await response.json()
			throw new Error(error.error || 'Failed to delete page')
		}
		return await response.json()
	} catch (error) {
		console.error('Error deleting page:', error)
		throw error
	}
}

export async function putPage(id: number, title: string, index: number) {
	try {
		const response = await fetch(`/api/page/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ title, index }),
		})
		if (!response.ok) {
			const error = await response.json()
			throw new Error(error.error || 'Failed to update page')
		}
		return await response.json()
	} catch (error) {
		console.error('Error updating page:', error)
		throw error
	}
}
