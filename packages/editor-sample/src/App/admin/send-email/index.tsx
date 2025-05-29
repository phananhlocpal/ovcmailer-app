import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
  SelectChangeEvent,
} from '@mui/material';
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import DOMPurify from 'dompurify';
import { styled } from '@mui/material/styles';
import debounce from 'lodash.debounce';

declare global {
  interface Window {
    luckysheet?: any;
  }
}

const EditorContainer = styled(Box)(({ theme }) => ({
  minHeight: '300px',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1.5),
  fontFamily: theme.typography.fontFamily,
  fontSize: '16px',
  overflowY: 'auto',
  backgroundColor: theme.palette.background.paper,
  '&:focus': {
    borderColor: theme.palette.primary.main,
    outline: 'none',
  },
  '& .mui-chip': {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: theme.palette.grey[200],
    borderRadius: '16px',
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.25),
    fontSize: '0.875rem',
    color: theme.palette.text.primary,
    verticalAlign: 'middle',
  },
}));

const LuckysheetContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  border: `1px solid ${theme.palette.divider}`,
  position: 'relative',
  overflow: 'hidden',
  isolation: 'isolate',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const SendEmail: React.FC = () => {
  const [mode, setMode] = useState<'normal' | 'mailmerge'>('mailmerge');
  const [templates, setTemplates] = useState<{ id: string; name: string }[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [mailmergeType, setMailMergeType] = useState<'html' | 'normal'>('html');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [luckysheetHeaders, setLuckysheetHeaders] = useState<string[]>([]);
  const editorRef = useRef<HTMLDivElement>(null);

  const fetchLuckysheetHeaders = useCallback(
    debounce(() => {
      if (window.luckysheet) {
        try {
          const sheetData = window.luckysheet.getSheetData();
          if (sheetData && sheetData.length > 0) {
            const firstRow = sheetData[0];
            const headers = firstRow
              .map((cell: any) => (cell && cell.v ? cell.v.toString().trim() : ''))
              .filter((header: string) => header !== '');
            setLuckysheetHeaders(headers);
          }
        } catch (err) {
          console.error('Error fetching Luckysheet headers:', err);
          setError('Failed to load Luckysheet headers');
        }
      }
    }, 300),
    []
  );

  const transformPlaceholdersToChips = useMemo(
    () =>
      (content: string) => {
        return content.replace(/\{\{(\w+)\}\}/g, (match, variable) => {
          if (luckysheetHeaders.includes(variable)) {
            return `<span class="mui-chip" contenteditable="false">${variable}</span>`;
          }
          return match;
        });
      },
    [luckysheetHeaders]
  );

  const saveCaretPosition = useCallback((context: HTMLElement) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    return {
      range: range.cloneRange(),
    };
  }, []);

  const restoreCaretPosition = useCallback((context: HTMLElement, saved: { range: Range } | null) => {
    if (!saved || !context) return;

    const selection = window.getSelection();
    if (!selection) return;

    try {
      selection.removeAllRanges();
      selection.addRange(saved.range);
    } catch (e) {
      console.warn('Failed to restore caret position:', e);
      const newRange = document.createRange();
      newRange.selectNodeContents(context);
      newRange.collapse(false);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
  }, []);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const position = saveCaretPosition(editorRef.current);
      const rawContent = editorRef.current.innerHTML;
      setEmailContent(
        DOMPurify.sanitize(rawContent, {
          ADD_TAGS: ['span'],
          ADD_ATTR: ['class', 'contenteditable'],
        })
      );
      restoreCaretPosition(editorRef.current, position);
    }
  }, [saveCaretPosition, restoreCaretPosition]);

  const handleBlur = useCallback(() => {
    // Không cần xử lý gì thêm khi blur
  }, []);

  // Giả lập gọi API để lấy danh sách template
  useEffect(() => {
    if (mode === 'mailmerge') {
      // Giả lập API call để lấy danh sách template
      const fetchTemplates = async () => {
        try {
          // Thay thế bằng API thực tế của bạn, ví dụ: axios.get('/api/templates')
          const response = await Promise.resolve([
            { id: 'template1', name: 'Welcome Email' },
            { id: 'template2', name: 'Promotion Email' },
          ]);
          setTemplates(response);
          if (response.length > 0 && !selectedTemplate) {
            setSelectedTemplate(response[0].id);
          }
        } catch (err) {
          console.error('Error fetching templates:', err);
          setError('Failed to load templates');
        }
      };
      fetchTemplates();
      fetchLuckysheetHeaders();
    } else {
      setTemplates([]);
      setSelectedTemplate('');
      setEmailContent('');
      setLuckysheetHeaders([]);
    }
  }, [mode, fetchLuckysheetHeaders, selectedTemplate]);

  // Gọi API khi thay đổi template
  const handleTemplateChange = useCallback(
    async (event: SelectChangeEvent) => {
      const newTemplateId = event.target.value as string;
      if (
        editorRef.current?.innerHTML !== emailContent &&
        !window.confirm('Bạn có muốn thay đổi template? Nội dung hiện tại sẽ bị mất.')
      ) {
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        // Giả lập API call để lấy nội dung template, thay bằng API thực tế của bạn
        const response = await Promise.resolve(
          newTemplateId === 'template1'
            ? `
                <h1 style="color: #007acc; text-align: center;">Welcome to My Simple Page, {{name}}!</h1>
                <p style="font-size: 16px; line-height: 1.5; max-width: 600px; margin: 20px auto; background-color: #fff; padding: 15px; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
                  This is a simple HTML page with clean and minimal styling. Your email is {{email}}.
                </p>
                <p style="text-align: center;">
                  <a href="#" style="display: inline-block; padding: 10px 20px; font-size: 16px; background-color: #007acc; color: white; text-decoration: none; border-radius: 4px;">
                    Click Me
                  </a>
                </p>
              `
            : '<div>Hello {{name}}, your offer code is {{code}}.</div>'
        );
        const transformedContent = transformPlaceholdersToChips(response);
        const sanitizedContent = DOMPurify.sanitize(transformedContent, {
          ADD_TAGS: ['span'],
          ADD_ATTR: ['class', 'contenteditable'],
        });
        setSelectedTemplate(newTemplateId);
        setEmailContent(sanitizedContent);
      } catch (err) {
        console.error('Error fetching template content:', err);
        setError('Failed to load template content');
      } finally {
        setIsLoading(false);
      }
    },
    [transformPlaceholdersToChips, emailContent]
  );

  useEffect(() => {
    if (mode !== 'mailmerge' || !window.luckysheet) return;

    let isInitialized = false;
    if (!document.getElementById('luckysheet-sheet0') && !isInitialized) {
      window.luckysheet.create({
        container: 'luckysheet',
        lang: 'en',
        title: '',
        allowEdit: true,
        showtoolbar: false,
        showinfobar: false,
        showsheetbar: false,
        showstatisticBar: false,
        showformulaBar: false,
        functionButton: '',
        allowFunction: false,
        hook: { workbookCreate: () => console.log('Luckysheet initialized') },
      });

      const style = document.createElement('style');
      style.innerHTML = `
        #luckysheet {
          overflow: hidden !important;
        }
        #luckysheet-wa-calculate,
        .luckysheet-stat-area {
          display: none !important;
        }
        .luckysheet-grid-container {
          overflow: auto !important;
        }
        .luckysheet-cell-content {
          pointer-events: auto !important;
          user-select: text !important;
        }
      `;
      document.head.appendChild(style);

      isInitialized = true;

      setTimeout(() => {
        const stat = document.querySelector('.luckysheet-stat-area');
        if (stat) stat.remove();
        fetchLuckysheetHeaders();
      }, 100);
    }

    const luckysheetDom = document.getElementById('luckysheet');
    const handleFocus = (e: Event) => e.preventDefault();
    const handleMousedown = (e: MouseEvent) => {
      if (e.target && !(e.target as Element).closest('.luckysheet-grid-container')) {
        e.preventDefault();
      }
    };

    luckysheetDom?.addEventListener('focus', handleFocus, { capture: true });
    luckysheetDom?.addEventListener('mousedown', handleMousedown, { capture: true });

    return () => {
      luckysheetDom?.removeEventListener('focus', handleFocus, { capture: true });
      luckysheetDom?.removeEventListener('mousedown', handleMousedown, { capture: true });
    };
  }, [mode, fetchLuckysheetHeaders]);

  const handleMailMergeType = useCallback((e: SelectChangeEvent) => {
    setMailMergeType(e.target.value as 'html' | 'normal');
  }, []);

  const handleSendEmail = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      console.log('Sending email with content:', emailContent);
      setIsLoading(false);
    }, 1000);
  }, [emailContent]);

  const editorComponent = useMemo(() => {
    if (mode === 'normal' || mailmergeType === 'normal') {
      return (
        <CKEditor
          editor={ClassicEditor as any}
          data={emailContent}
          config={{
            toolbar: [
              'heading',
              '|',
              'bold',
              'italic',
              'link',
              'bulletedList',
              'numberedList',
              '|',
              'fontSize',
              'fontColor',
              'fontBackgroundColor',
              '|',
              'alignment',
              'indent',
              'outdent',
              '|',
              'blockQuote',
              'insertTable',
              'mediaEmbed',
              'undo',
              'redo',
            ],
          }}
          onChange={(event, editor) => {
            const data = DOMPurify.sanitize(editor.getData());
            setEmailContent(data);
          }}
        />
      );
    }
    return (
      <EditorContainer
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleBlur}
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{ __html: emailContent }}
      />
    );
  }, [mode, mailmergeType, emailContent, handleInput, handleBlur]);

  return (
    <Box sx={{ p: 3, height: 'calc(100vh - 64px)', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <FormControlLabel
          control={<Switch checked={mode === 'mailmerge'} onChange={(e) => setMode(e.target.checked ? 'mailmerge' : 'normal')} />}
          label="Mailmerge mode"
        />
        <Button variant="contained" color="primary" onClick={handleSendEmail} disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : 'Send Email'}
        </Button>
        <Button variant="outlined" color="primary" disabled={isLoading}>
          Save Draft
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ display: 'flex', flex: 1, gap: 2, overflow: 'hidden' }}>
        {mode === 'mailmerge' && <LuckysheetContainer id="luckysheet" />}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {mode === 'normal' && (
            <>
              <TextField label="To" variant="outlined" fullWidth />
              <TextField label="CC" variant="outlined" fullWidth />
              <TextField label="BCC" variant="outlined" fullWidth />
            </>
          )}
          {mode === 'mailmerge' && (
            <Box>
              <FormControl fullWidth>
                <InputLabel id="mailmergetype-select-label">Mail Type</InputLabel>
                <Select
                  labelId="mailmergetype-select-label"
                  value={mailmergeType}
                  label="Mail Type"
                  onChange={handleMailMergeType}
                >
                  <MenuItem value="html">HTML Email</MenuItem>
                  <MenuItem value="normal">Normal Email</MenuItem>
                </Select>
              </FormControl>
              {mailmergeType === 'html' && (
                <Box sx={{ mt: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel id="template-select-label">Choose Template</InputLabel>
                    <Select
                      labelId="template-select-label"
                      value={selectedTemplate}
                      label="Choose Template"
                      onChange={handleTemplateChange}
                      fullWidth
                    >
                      {templates.map((template) => (
                        <MenuItem key={template.id} value={template.id}>
                          {template.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              )}
              <TextField label="Subject" variant="outlined" fullWidth />
              {editorComponent}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SendEmail;