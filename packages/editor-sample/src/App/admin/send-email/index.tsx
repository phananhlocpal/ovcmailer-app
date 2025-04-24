import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowId, GridCellEditStopParams } from '@mui/x-data-grid';
import { Button, TextField, Box, Typography, Container, Paper, IconButton, ToggleButton, ToggleButtonGroup, Chip, Input, Popover } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import CloseIcon from '@mui/icons-material/Close';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { SiGmail } from 'react-icons/si';

const extractVariables = (content: string) => {
  const regex = /\{\{(.*?)\}\}/g;
  const matches = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    matches.push(match[1].trim());
  }
  return matches;
};

// Custom EmailContentInput component
const EmailContentInput = ({
  value,
  onChange,
  columns,
}: {
  value: string;
  onChange: (val: string) => void;
  columns: GridColDef[];
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [suggestPos, setSuggestPos] = useState<number>(-1);

  // Khi nhập {{ thì mở gợi ý
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const cursor = e.target.selectionStart ?? 0;
    if (val.slice(cursor - 2, cursor) === '{{') {
      setOpen(true);
      setSuggestPos(cursor);
      setAnchorEl(e.target);
    } else {
      setOpen(false);
    }
    onChange(val);
  };

  // Khi chọn cột từ gợi ý
  const handleSelectColumn = (col: GridColDef) => {
    if (suggestPos === -1) return;
    // Chèn tên cột vào vị trí suggestPos
    const before = value.slice(0, suggestPos);
    const after = value.slice(suggestPos);
    const newValue = `${before}${col.field}}}${after}`;
    onChange(newValue);
    setOpen(false);
    setSuggestPos(-1);
  };

  // Render các biến thành chip
  const renderContentWithChips = () => {
    const regex = /\{\{(.*?)\}\}/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(value)) !== null) {
      const varName = match[1].trim();
      const isValid = columns.some(col => col.field === varName);
      parts.push(value.slice(lastIndex, match.index));
      parts.push(
        <Chip
          key={match.index}
          label={`{{${varName}}}`}
          color={isValid ? 'success' : 'error'}
          sx={{
            mx: 0.2,
            bgcolor: isValid ? 'success.light' : 'error.light',
            color: isValid ? 'success.contrastText' : 'error.contrastText',
            fontWeight: 600,
          }}
        />
      );
      lastIndex = match.index + match[0].length;
    }
    parts.push(value.slice(lastIndex));
    return parts;
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <TextField
        label="Email Content"
        multiline
        rows={6}
        value={value}
        onChange={handleInput}
        fullWidth
        variant="outlined"
        placeholder="Enter your email content here..."
        inputProps={{ style: { fontFamily: 'monospace' } }}
      />
      {/* Chips preview */}
      <Box sx={{ minHeight: 40, mt: 1, p: 1, border: '1px dashed #ccc', borderRadius: 1, background: '#fafbfc' }}>
        {renderContentWithChips()}
      </Box>
      {/* Gợi ý tên cột */}
      <Popover open={open} anchorEl={anchorEl} onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <Paper sx={{ p: 1, minWidth: 200 }}>
          {columns
            .filter(col => col.field !== 'actions')
            .map(col => (
              <Box
                key={col.field}
                sx={{ p: 1, cursor: 'pointer', '&:hover': { bgcolor: 'grey.100' } }}
                onClick={() => handleSelectColumn(col)}
              >
                {col.field}
              </Box>
            ))}
        </Paper>
      </Popover>
    </Box>
  );
};

const SendEmail: React.FC = () => {
  const [rows, setRows] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', subject: 'Welcome' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', subject: 'Update' },
    { id: 3 }, // Initial empty row
  ]);
  const [columns, setColumns] = useState<GridColDef[]>([
    { field: 'name', headerName: 'Name', width: 150, editable: true },
    { field: 'email', headerName: 'Email', width: 200, editable: true },
    { field: 'subject', headerName: 'Subject', width: 150, editable: true }
  ]);

  const [emailContent, setEmailContent] = useState('');
  const [newColumnName, setNewColumnName] = useState('');
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
  // New state for email form
  const [toEmails, setToEmails] = useState<string[]>([]);
  const [ccEmails, setCcEmails] = useState<string[]>([]);
  const [bccEmails, setBccEmails] = useState<string[]>([]);
  const [currentTo, setCurrentTo] = useState('');
  const [currentCc, setCurrentCc] = useState('');
  const [currentBcc, setCurrentBcc] = useState('');
  const [subject, setSubject] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  // Ensure there's always an empty row
  useEffect(() => {
    const hasEmptyRow = rows.some(row => Object.keys(row).length === 1 && 'id' in row);
    if (!hasEmptyRow) {
      const newId = Math.max(...rows.map((row) => row.id), 0) + 1;
      setRows([...rows, { id: newId }]);
    }
  }, [rows]);

  // Email validation regex
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleDelete = (id: GridRowId) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleDeleteSelected = () => {
    setRows(rows.filter((row) => !selectedRows.includes(row.id)));
    setSelectedRows([]);
  };

  const handleAddColumn = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && newColumnName.trim()) {
      const fieldName = newColumnName.trim().toLowerCase().replace(/\s+/g, '_');
      if (columns.some(col => col.field === fieldName)) {
        alert('Column name already exists!');
        return;
      }
      setColumns([
        ...columns.slice(0, -1),
        {
          field: fieldName,
          headerName: newColumnName.trim(),
          width: 150,
          editable: true,
        },
        columns[columns.length - 1],
      ]);
      setNewColumnName('');
    }
  };

  const handleDeleteColumn = (field: string) => {
    const hasData = rows.some(row => row[field as keyof typeof row] && row[field as keyof typeof row]?.toString().trim() !== '');
    if (hasData) {
      if (!window.confirm('This column contains data. Are you sure you want to delete it?')) {
        return;
      }
    }
    setColumns(columns.filter(col => col.field !== field));
    setRows(rows.map(row => {
      const newRow = { ...row };
      delete newRow[field as keyof typeof newRow];
      return newRow;
    }));
  };

  const handleCellEditStop = (params: GridCellEditStopParams) => {
    const isLastRow = params.id === rows[rows.length - 1].id;
    if (isLastRow && params.value) {
      const newId = Math.max(...rows.map((row) => row.id), 0) + 1;
      setRows([...rows, { id: newId }]);
    }
  };

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        if (lines.length === 0) return;

        const headers = lines[0].split(',').map(h => h.trim());
        const newColumns = headers.map((header, index) => ({
          field: header.toLowerCase().replace(/\s+/g, '_'),
          headerName: header,
          width: 150,
          editable: true,
        }));

        const newRows = lines.slice(1).map((line, index) => {
          const values = line.split(',').map(v => v.trim());
          const row: any = { id: index + 1 };
          headers.forEach((header, i) => {
            row[header.toLowerCase().replace(/\s+/g, '_')] = values[i] || '';
          });
          return row;
        });

        setColumns([
          ...newColumns,
        ]);
        setRows([...newRows, { id: newRows.length + 1 }]);
      };
      reader.readAsText(file);
    }
  };

  // Handle adding emails on Enter
  const handleAddEmail = (
    event: React.KeyboardEvent,
    email: string,
    setEmails: React.Dispatch<React.SetStateAction<string[]>>,
    setCurrent: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (event.key === 'Enter' && email.trim()) {
      if (!validateEmail(email.trim())) {
        alert('Please enter a valid email address');
        return;
      }
      setEmails(prev => [...prev, email.trim()]);
      setCurrent('');
    }
  };

  // Handle deleting email chips
  const handleDeleteEmail = (
    email: string,
    setEmails: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setEmails(prev => prev.filter(e => e !== email));
  };

  // Handle file attachment
  const handleFileAttach = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setAttachedFiles(prev => [...prev, ...Array.from(files)]);
    }
  };

  // Handle file removal
  const handleRemoveFile = (fileName: string) => {
    setAttachedFiles(prev => prev.filter(file => file.name !== fileName));
  };

  const handleSendEmail = () => {
    console.log('Sending emails with:', {
      to: toEmails,
      cc: ccEmails,
      bcc: bccEmails,
      subject,
      content: emailContent,
      attachments: attachedFiles.map(file => file.name),
      recipients: rows
    });
    alert('Emails sent successfully!');
  };

  const [mode, setMode] = React.useState<'mailmerge' | 'common'>('mailmerge');

  const handleModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: 'mailmerge' | 'common' | null
  ) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  return (
    <Container className="py-3" maxWidth={false}
      sx={{
        height: 'calc(100vh - 64px)',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding={1}
        sx={{
          mb: 1,
          background: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          border: 'none'
        }}
      >
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
          <SiGmail size={28} color="#EA4335" style={{ marginRight: 8 }} />
          Send Email
        </Typography>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleModeChange}
          size="small"
          color="primary"
        >
          <ToggleButton value="mailmerge">Mail Merge</ToggleButton>
          <ToggleButton value="common">Common</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 3,
        height: '100%'
      }}>
        {/* Left Section: Data Grid */}
        <Paper elevation={3} sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%' }}>
          <Box className="mb-4 flex gap-2">
            <TextField
              label="New Column Name"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              onKeyPress={handleAddColumn}
              placeholder="Enter column name and press Enter"
              fullWidth
            />
            <Button
              variant="contained"
              component="label"
            >
              Import CSV
              <input
                type="file"
                accept=".csv"
                hidden
                onChange={handleImportCSV}
              />
            </Button>
            {selectedRows.length > 0 && (
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteSelected}
              >
                Delete Selected
              </Button>
            )}
          </Box>
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns.map(col => ({
                ...col,
                getOptionValue: col.field !== 'actions' ? () => [
                  {
                    label: 'Delete Column',
                    onClick: () => handleDeleteColumn(col.field),
                    icon: <CloseIcon fontSize="small" />,
                  },
                ] : undefined,
              }))}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 5 },
                },
              }}
              paginationModel={{ page: 0, pageSize: 5 }}
              checkboxSelection
              onRowSelectionModelChange={(newSelection) => setSelectedRows(newSelection as any)}
              onCellEditStop={handleCellEditStop}
              disableColumnMenu={false}
              disableRowSelectionOnClick
            />
          </div>
        </Paper>

        {/* Right Section: Email Form */}
        <Paper elevation={3} sx={{
          flex: 1,
          p: 3,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Box className="flex flex-col gap-4" sx={{ flex: 1 }}>
            {/* To Field */}
            <Box>
              <TextField
                label="To"
                value={currentTo}
                onChange={(e) => setCurrentTo(e.target.value)}
                onKeyPress={(e) => handleAddEmail(e, currentTo, setToEmails, setCurrentTo)}
                fullWidth
                variant="outlined"
              />
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {toEmails.map(email => (
                  <Chip
                    key={email}
                    label={email}
                    onDelete={() => handleDeleteEmail(email, setToEmails)}
                    deleteIcon={<CloseIcon />}
                  />
                ))}
              </Box>
            </Box>

            {/* CC Field */}
            <Box>
              <TextField
                label="CC"
                value={currentCc}
                onChange={(e) => setCurrentCc(e.target.value)}
                onKeyPress={(e) => handleAddEmail(e, currentCc, setCcEmails, setCurrentCc)}
                fullWidth
                variant="outlined"
              />
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {ccEmails.map(email => (
                  <Chip
                    key={email}
                    label={email}
                    onDelete={() => handleDeleteEmail(email, setCcEmails)}
                    deleteIcon={<CloseIcon />}
                  />
                ))}
              </Box>
            </Box>

            {/* BCC Field */}
            <Box>
              <TextField
                label="BCC"
                value={currentBcc}
                onChange={(e) => setCurrentBcc(e.target.value)}
                onKeyPress={(e) => handleAddEmail(e, currentBcc, setBccEmails, setCurrentBcc)}
                fullWidth
                variant="outlined"
              />
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {bccEmails.map(email => (
                  <Chip
                    key={email}
                    label={email}
                    onDelete={() => handleDeleteEmail(email, setBccEmails)}
                    deleteIcon={<CloseIcon />}
                  />
                ))}
              </Box>
            </Box>

            {/* Subject Field */}
            <TextField
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              fullWidth
              variant="outlined"
            />

            {/* Email Content */}
            <EmailContentInput
              value={emailContent}
              onChange={setEmailContent}
              columns={columns}
            />

            {/* File Attachment */}
            <Box>
              <Button
                variant="outlined"
                component="label"
                startIcon={<AttachFileIcon />}
              >
                Attach File
                <input
                  type="file"
                  multiple
                  hidden
                  onChange={handleFileAttach}
                />
              </Button>
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {attachedFiles.map(file => (
                  <Chip
                    key={file.name}
                    label={file.name}
                    onDelete={() => handleRemoveFile(file.name)}
                    deleteIcon={<CloseIcon />}
                  />
                ))}
              </Box>
            </Box>

            <Button
              variant="contained"
              color="primary"
              onClick={handleSendEmail}
              sx={{ alignSelf: 'flex-end', mt: 'auto' }}
            >
              Send Emails
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default SendEmail;