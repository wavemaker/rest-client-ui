import React, { useEffect, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';

declare const window: any;
const MonacoEditor = ({ editorRef, initialValue, url, editorLanguage, viewMode }:
    { editorRef: any, initialValue: string | undefined, url: string, editorLanguage: string, viewMode: boolean }) => {
    const matches = useMediaQuery('(min-width:1600px)');
    const [editorModel, setEditorModel] = useState<any>(null)

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
                    value: (initialValue && editorLanguage === 'json') ? JSON.stringify(JSON.parse(initialValue), undefined, 2) : initialValue,
                    language: editorLanguage,
                    theme: 'vs-dark',
                    minimap: {
                        enabled: false,
                    },
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                });
                editorRef.current = editorInstance;
                setEditorModel(editorInstance.getModel())
            });
            window.addEventListener('resize', refreshMonacoLayout);
            window.addEventListener('refreshMonacoLayout', refreshMonacoLayout);
        };
        loadMonaco();

        return () => {
            window.removeEventListener('resize', refreshMonacoLayout);
            window.removeEventListener('refreshMonacoLayout', refreshMonacoLayout);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if(editorModel && editorLanguage) {
            const currentLanguageId = editorModel.getLanguageId();
            switch(editorLanguage){
                case 'json':
                    currentLanguageId !== 'json' && window.monaco.editor.setModelLanguage(editorModel, 'json');
                    break;
                case 'xml':
                    currentLanguageId !== 'xml' && window.monaco.editor.setModelLanguage(editorModel, 'xml');
                    break;
                case 'plaintext':
                    currentLanguageId !== 'xml' && window.monaco.editor.setModelLanguage(editorModel, 'xml');
                    break;
            }
        }
    },[editorLanguage, editorModel])

    function refreshMonacoLayout(event: any) {
        setTimeout(() => {
            editorRef?.current?.layout();
        }, 0)
    }

    return <>
        <div  className="monaco_editor" style={{ height: matches ? "65vh" : viewMode ? "50vh" : '55vh', width: '99%' }}>
            <div className="monaco_editor_content" ref={editorRef} style={{ height: '100%' }} />
        </div>
    </>;
};

export default MonacoEditor;
