import React, { useEffect } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';

declare const window: any;
const MonacoEditor = ({ editorRef, initialValue, url, initialLanguage, viewMode }:
    { editorRef: any, initialValue: string | undefined, url: string, initialLanguage: string, viewMode: boolean }) => {
    const matches = useMediaQuery('(min-width:1600px)');

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
                    scrollBeyondLastLine: false
                });
                editorRef.current = editorInstance;
            });
            window.addEventListener('resize', function () {
                editorRef?.current?.layout();
            });
        };
        loadMonaco();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <>
        <div  className="monaco_editor" style={{ height: matches ? "65vh" : viewMode ? "50vh" : '55vh', width: '99%' }}>
            <div className="monaco_editor_content" ref={editorRef} style={{ height: '100%' }} />
        </div>
    </>;
};

export default MonacoEditor;
