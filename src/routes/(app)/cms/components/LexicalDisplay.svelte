<script lang="ts">
	import { onMount } from "svelte";
	import { Composer, RichTextPlugin } from "svelte-lexical";
	import { theme } from "svelte-lexical/dist/themes/default";


    interface Props {
        content:any
    }
    let { content }:Props = $props() 

    let initialConfig = {
        theme: theme,
        namespace: "default",
        nodes: [],
        onError: (err:any) => {
            throw err;
        }
    }

    let composer:RichTextComposer = {}

    onMount(() => {
        const initialConfig = {
            editorState: content
        }

        composer.getEditor().setEditorState(initialConfig)
    })
</script>

<div class="editor-container">
    <Composer {initialConfig} bind:this={composer}>
      <RichTextPlugin
        placeholder={null}
        contentEditableClassName="content-editable"
      />
    </Composer>
  </div>