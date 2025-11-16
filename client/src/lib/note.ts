export async function getNotes(pageId: number) {
	try {
		const res = await fetch(`/api/note?pageId=${pageId}`)
		if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
		return await res.json()
	} catch (err) {
		console.error('Failed to fetch data:', err)
		throw err
	}
}

export async function postNote(title: string, index: number, pageId: number) {
	try {
		const response = await fetch('/api/note', {
			method: 'post',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ title, index, content: '', pageId }),
		})
		if (!response.ok) {
			const error = await response.json()
			throw new Error(error.error || 'failed to create note')
		}
		const result = await response.json()
		return result
	} catch (error) {
		console.error('error creating note:', error)
		throw error
	}
}

export async function deleteNote(id: number) {
	try {
		const response = await fetch(`/api/note/${id}`, {
			method: 'DELETE',
		})
		if (!response.ok) {
			const error = await response.json()
			throw new Error(error.error || 'Failed to delete note')
		}
		return await response.json()
	} catch (error) {
		console.error('Error deleting note:', error)
		throw error
	}
}

export async function putNote(
	id: number,
	title: string,
	content: string,
	index: number,
	pageId: number,
) {
	try {
		const response = await fetch(`/api/note/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ title, content, index, pageId }),
		})
		if (!response.ok) {
			const error = await response.json()
			throw new Error(error.error || 'Failed to update note')
		}
		return await response.json()
	} catch (error) {
		console.error('Error updating note:', error)
		throw error
	}
}
