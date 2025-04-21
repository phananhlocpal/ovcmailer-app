import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  Divider,
  Chip,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const EmailPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(3),
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: theme.spacing(1, 3),
  textTransform: 'none',
  fontWeight: 600,
}));

const EmailNormal = () => {
  const [to, setTo] = useState(['oispvolunteerclub@gmail.com']);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [cc, setCc] = useState(false);

  const handleSend = () => {
    const emailData = {
      to,
      subject,
      body,
      attachments,
    };
    console.log('Sending email:', emailData);
    // Thêm logic gửi email thực tế ở đây
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddRecipient = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      setTo((prev) => [...prev, e.target.value]);
      e.target.value = '';
    }
  };

  return (
    <Container maxWidth="md">
      <EmailPaper elevation={3}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            New Email
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mb: 1 }}>
            {to.map((email, index) => (
              <Chip
                key={index}
                label={email}
                onDelete={() => setTo(to.filter((_, i) => i !== index))}
                color="primary"
                variant="outlined"
                size="small"
              />
            ))}
          </Stack>
          <TextField
            fullWidth
            variant="outlined"
            label="To"
            placeholder="Add recipient"
            onKeyPress={handleAddRecipient}
            InputProps={{
              sx: { borderRadius: 2 },
            }}
          />
        </Box>

        <TextField
          fullWidth
          variant="outlined"
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            sx: { borderRadius: 2 },
          }}
        />

        <TextField
          fullWidth
          variant="outlined"
          multiline
          rows={10}
          label="Message"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            sx: { borderRadius: 2 },
          }}
        />

        {attachments.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Attachments:
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
              {attachments.map((file, index) => (
                <Chip
                  key={index}
                  label={file.name}
                  onDelete={() => removeAttachment(index)}
                  deleteIcon={<DeleteIcon />}
                  variant="outlined"
                />
              ))}
            </Stack>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <input
              accept="*/*"
              style={{ display: 'none' }}
              id="attach-file"
              multiple
              type="file"
              onChange={handleFileUpload}
            />
            <label htmlFor="attach-file">
              <IconButton component="span">
                <AttachFileIcon />
              </IconButton>
            </label>
          </Box>

          <StyledButton
            variant="contained"
            color="primary"
            startIcon={<SendIcon />}
            onClick={handleSend}
          >
            Send
          </StyledButton>
        </Box>
      </EmailPaper>
    </Container>
  );
};

export default EmailNormal;