import { atom } from 'jotai'

export type Page = {
	id: number
	title: string
	index: number
	userId?: number
}

export const selectedPageAtom = atom<undefined | Page>(undefined)

export type Note = {
	id: number
	title: string
	content?: string
	index: number
	pageId?: number
}

export const selectedNoteAtom = atom<undefined | Note>(undefined)
export const noteStatusAtom = atom<'saved' | 'unsaved' | 'saving'>('saved')

// page dialogs
export const createPageDialogAtom = atom(false)
export const deletePageDialogAtom = atom(false)
export const renamePageDialogAtom = atom(false)

// note dialogs
export const createNoteDialogAtom = atom(false)
export const deleteNoteDialogAtom = atom(false)
export const renameNoteDialogAtom = atom(false)
