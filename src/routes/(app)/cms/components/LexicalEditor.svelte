<script lang="ts">
	import { onMount } from "svelte";
	import { RichTextComposer } from "svelte-lexical";
	import { theme } from "$lib/components/forms/lexical-theme/theme";


    interface Props {
        contents:any
        id: string
    }
    let { contents = $bindable() }:Props = $props() 

    let composer:any

    const setContent = () => {
        if(composer && composer.getEditor) {
            const editor = composer.getEditor()

            if(contents) {
                editor.setEditorState(editor.parseEditorState(contents))
            }
        }
    }

    onMount(() => {
        setContent()

        const editor = composer.getEditor()

        // @ts-expect-error
        editor.registerUpdateListener(({editorState}) => {
            // The latest EditorState can be found aitorState`.
            // To read the contents of the EditorState, use the following API:

            editorState.read(() => {
                // Just like editor.update(), .read() expects a closure where you can use
                // the $ prefixed helper functions.
                contents = editorState.toJSON()
            });
        });
    })
</script>

<div class="editor-container">
    <RichTextComposer bind:this={composer} theme={theme} />
</div>