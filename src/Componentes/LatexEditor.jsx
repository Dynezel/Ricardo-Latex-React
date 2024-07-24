import React, { useState } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/stex/stex'; // Modo LaTeX para CodeMirror
import 'katex/dist/katex.min.css';
import katex from 'katex';
import '../css/LatexEditor.css'

const LatexEditor = () => {
    const [latexContent, setLatexContent] = useState('');
    const [previewContent, setPreviewContent] = useState('');
    

    const handleEditorChange = (editor, data, value) => {
        setLatexContent(value);
        try {
            const htmlContent = katex.renderToString(value, {
                throwOnError: false,
                displayMode: true
            });
            setPreviewContent(htmlContent);
        } catch (error) {
            console.error('Error rendering LaTeX:', error);
        }
    };

    return (
        <div className="latex-editor-container">
            <div className="editor-section">
                <h2>Editor de LaTeX</h2>
                <CodeMirror
                    value={latexContent}
                    options={{
                        mode: 'stex',
                        theme: 'default',
                        lineNumbers: true
                    }}
                    onBeforeChange={handleEditorChange}
                />
            </div>
            <div className="preview-section">
                <h2>Vista Previa</h2>
                <div
                    className="latex-preview"
                    dangerouslySetInnerHTML={{ __html: previewContent }}
                />
            </div>
        </div>
    );
};

export default LatexEditor;