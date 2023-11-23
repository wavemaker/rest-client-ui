import React, { useEffect } from 'react';

declare const window: any;
const MonacoEditor = ({ editorRef, initialValue, url, monacoEditorHeight }: { editorRef: any, initialValue: string, url: string, monacoEditorHeight: number }) => {

    useEffect(() => {
        const loadMonaco = async () => {
            if (window.monaco) {
                initializeMonaco();
            } else {
                const script = document.createElement('script');
                script.src = url || 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.min.js';
                script.onload = initializeMonaco;
                document.body.appendChild(script);
            }
        };
        const initializeMonaco = () => {
            window.require.config({ paths: { 'vs': url || 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
            window.require(['vs/editor/editor.main'], () => {
                // Create Monaco Editor instance
                const editorInstance = window.monaco.editor.create(editorRef.current, {
                    value: initialValue,
                    language: 'json',
                    theme: 'vs-dark',
                    minimap: {
                        enabled: false,
                    },
                });
                editorRef.current = editorInstance;
            });
        };

        loadMonaco();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div ref={editorRef} style={{ height: monacoEditorHeight ? `${monacoEditorHeight}px` : '300px' }} />;
};

export default MonacoEditor;
