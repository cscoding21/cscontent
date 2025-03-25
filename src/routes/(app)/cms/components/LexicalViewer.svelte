<script>
    import { LexicalComposer, LexicalRichTextPlugin } from 'svelte-lexical';
    import { onMount } from 'svelte';
    
  
    // Props for the JSON content
    export let editorStateJson;
  
    // Configuration for read-only viewer
    const config = {
      namespace: 'viewer',
      editable: false,
      theme: {
        paragraph: 'editor-paragraph',
        text: {
          bold: 'editor-text-bold',
          italic: 'editor-text-italic',
          underline: 'editor-text-underline'
        }
      },
      onError: (error) => {
        console.error(error);
      }
    };
  
    let editor;
  
    // Initialize editor state when component mounts
    onMount(() => {
      if (editor && editorStateJson) {
        try {
          const editorState = editor.parseEditorState(JSON.parse(editorStateJson));
          editor.setEditorState(editorState);
        } catch (error) {
          console.error('Failed to parse editor state:', error);
        }
      }
    });
  </script>
  
  <div class="editor-container">
    <LexicalComposer initialConfig={config} bind:editor>
      <LexicalRichTextPlugin
        placeholder={null}
        contentEditableClassName="content-editable"
      />
    </LexicalComposer>
  </div>
  
  <style>
    .editor-container {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
    }
  
    :global(.content-editable) {
      min-height: 200px;
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      outline: none;
    }
  
    :global(.editor-paragraph) {
      margin: 0 0 1rem 0;
    }
  
    :global(.editor-text-bold) {
      font-weight: bold;
    }
  
    :global(.editor-text-italic) {
      font-style: italic;
    }
  
    :global(.editor-text-underline) {
      text-decoration: underline;
    }
  </style>