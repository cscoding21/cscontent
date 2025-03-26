<script lang="ts">
    import { createEditor } from "lexical";
	import { onMount } from "svelte";
	import { theme } from "svelte-lexical/dist/themes/default";


    interface Props {
        content:any
        id: string
    }
    let { content, id }:Props = $props() 

    let initialConfig = {
        theme: theme,
        namespace: "default",
        nodes: [],
        onError: (err:any) => {
            throw err;
        }
    }

    let editor:any

    onMount(() => {
        editor = createEditor(initialConfig)
        
        const editorRef = document.getElementById(id);
        editor.setRootElement(editorRef);

        editor.setEditorState(editor.parseEditorState(content))
        editor.setEditable(false)
    })
</script>

<div class="editor-container">
    <div id={id}></div>
</div>