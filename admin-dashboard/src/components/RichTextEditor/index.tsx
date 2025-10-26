import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Box, Typography } from '@mui/material';

const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => (
    <Box 
      sx={{ 
        minHeight: 200,
        border: '1px solid #e0e0e0',
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Typography color="textSecondary">Editör yükleniyor...</Typography>
    </Box>
  )
});

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
}

export default function RichTextEditor({ 
  content, 
  onChange, 
  placeholder = "İçeriğinizi yazın...",
  error = false,
  helperText 
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Quill CSS'ini programatik olarak yükle
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css';
    document.head.appendChild(link);
    
    return () => {
      // Cleanup: CSS linkini kaldır
      document.head.removeChild(link);
    };
  }, []);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'blockquote', 'code-block',
    'link', 'image'
  ];

  if (!isMounted) {
    return (
      <Box>
        <Box 
          sx={{ 
            minHeight: 200,
            border: error ? '1px solid #d32f2f' : '1px solid #e0e0e0',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography color="textSecondary">Editör yükleniyor...</Typography>
        </Box>
        {helperText && (
          <Typography 
            variant="caption" 
            color={error ? 'error' : 'textSecondary'}
            sx={{ mt: 0.5, ml: 2, display: 'block' }}
          >
            {helperText}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box>
      <Box 
        sx={{ 
          '& .ql-editor': {
            minHeight: '200px',
            fontSize: '14px',
            lineHeight: 1.5,
          },
          '& .ql-toolbar': {
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px',
            border: error ? '1px solid #d32f2f' : '1px solid #e0e0e0',
            borderBottom: 'none',
          },
          '& .ql-container': {
            borderBottomLeftRadius: '4px',
            borderBottomRightRadius: '4px',
            border: error ? '1px solid #d32f2f' : '1px solid #e0e0e0',
            borderTop: 'none',
          },
          '& .ql-editor.ql-blank::before': {
            content: `"${placeholder}"`,
            color: '#adb5bd',
            fontStyle: 'italic',
          }
        }}
      >
        <ReactQuill
          theme="snow"
          value={content}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
        />
      </Box>

      {helperText && (
        <Typography 
          variant="caption" 
          color={error ? 'error' : 'textSecondary'}
          sx={{ mt: 0.5, ml: 2, display: 'block' }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );
}