import React, { useEffect } from 'react';

declare const window: any;
const MonacoEditor = ({ editorRef, initialValue, url, monacoEditorHeight, initialLanguage }:
    { editorRef: any, initialValue: string | undefined, url: string, monacoEditorHeight: number, initialLanguage: string }) => {

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
                    language: initialLanguage,
                    theme: 'vs-dark',
                    minimap: {
                        enabled: false,
                    },
                });
                editorRef.current = editorInstance;
            });
            window.addEventListener('resize', function () {
                editorRef.current.layout();
            });
        }; 
        loadMonaco();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div ref={editorRef} style={{ height: monacoEditorHeight ? `${monacoEditorHeight / 0.8}px` : '200px', width: "100%" }} />;
};

export default MonacoEditor;
