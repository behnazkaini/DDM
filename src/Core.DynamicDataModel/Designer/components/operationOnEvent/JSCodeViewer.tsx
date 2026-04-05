import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface Props { 
	code: string;
}

function JSCodeViewer({ code }: Props) {
	return (
		<div style={{direction: 'ltr'}}>
		<SyntaxHighlighter language='javascript' style={vs} wrapLines showLineNumbers  >
			{code}
		</SyntaxHighlighter>
		</div>
	);
}
export default JSCodeViewer