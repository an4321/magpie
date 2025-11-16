import './editor.css'

import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import { EditorContent, useEditor } from '@tiptap/react'
import { FloatingMenu, BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'

export default ({
	content,
	onChange,
}: {
	content: string
	onChange: (html: string) => void
}) => {
	const editor = useEditor({
		extensions: [StarterKit, TaskList, TaskItem],
		immediatelyRender: false,
		content,
		onUpdate({ editor }) {
			onChange(editor.getHTML())
		},
		// autofocus: 'end',
	})

	setTimeout(() => {
		editor?.commands.focus('end')
	}, 300)

	return (
		<>
			{editor && (
				<BubbleMenu className='bubble-menu' editor={editor}>
					<button
						type='button'
						onClick={() => editor.chain().focus().toggleBold().run()}
						className={editor.isActive('bold') ? 'is-active' : ''}
					>
						Bold
					</button>
					<button
						type='button'
						onClick={() => editor.chain().focus().toggleItalic().run()}
						className={editor.isActive('italic') ? 'is-active' : ''}
					>
						Italic
					</button>
					<button
						type='button'
						onClick={() => editor.chain().focus().toggleStrike().run()}
						className={editor.isActive('strike') ? 'is-active' : ''}
					>
						Strike
					</button>
				</BubbleMenu>
			)}

			{editor && (
				<FloatingMenu className='floating-menu' editor={editor}>
					<button
						type='button'
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 1 }).run()
						}
						className={
							editor.isActive('heading', { level: 1 }) ? 'is-active' : ''
						}
					>
						H1
					</button>
					<button
						type='button'
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 2 }).run()
						}
						className={
							editor.isActive('heading', { level: 2 }) ? 'is-active' : ''
						}
					>
						H2
					</button>
					<button
						type='button'
						onClick={() => editor.chain().focus().toggleBulletList().run()}
						className={editor.isActive('bulletList') ? 'is-active' : ''}
					>
						Bullet list
					</button>
					<button
						type='button'
						onClick={() => editor.chain().focus().toggleTaskList().run()}
						className={editor.isActive('taskList') ? 'is-active' : ''}
					>
						Check list
					</button>
				</FloatingMenu>
			)}

			<EditorContent editor={editor} />
		</>
	)
}
