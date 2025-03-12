import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { Edit, Delete, GetApp } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Papa from 'papaparse'; // For CSV parsing
import Navigator from '../navigator/navigator';

// Styled components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  textTransform: 'none',
}));

const initialStudents = [
  {
    id: 'ST001',
    fullName: 'Nguyen Van A',
    personalEmail: 'nguyenvana@gmail.com',
    studentEmail: 'nguyenvana@edu.vn',
    phone: '0912345678',
  },
];

// Sample CSV template
const sampleCSV = `Student ID,Full Name,Personal Email,Student Email,Phone Number,Role
ST001,Nguyen Van A,nguyenvana@gmail.com,nguyenvana@edu.vn,0912345678`;

export const UserPage = () => {
  const [students, setStudents] = useState(initialStudents);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({
    id: '',
    fullName: '',
    personalEmail: '',
    studentEmail: '',
    phone: '',
  });

  // Handle dialog open/close
  const handleOpen = () => {
    setOpen(true);
    setEditMode(false);
    setCurrentStudent({
      id: '',
      fullName: '',
      personalEmail: '',
      studentEmail: '',
      phone: '',
    });
  };

  const handleClose = () => setOpen(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentStudent((prev) => ({ ...prev, [name]: value }));
  };

  // Create or Update student
  const handleSave = () => {
    if (editMode) {
      setStudents(students.map((student) =>
        student.id === currentStudent.id ? currentStudent : student
      ));
    } else {
      setStudents([...students, { ...currentStudent, id: `ST${students.length + 1}` }]);
    }
    handleClose();
  };

  // Edit student
  const handleEdit = (student: any) => {
    setCurrentStudent(student);
    setEditMode(true);
    setOpen(true);
  };

  // Delete student
  const handleDelete = (id: any) => {
    setStudents(students.filter((student) => student.id !== id));
  };

  // Handle CSV file import
  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const importedStudents = result.data
            .slice(1) // Skip header row
            .filter(row => row.length === 5) // Ensure row has all columns
            .map(row => ({
              id: row[0],
              fullName: row[1],
              personalEmail: row[2],
              studentEmail: row[3],
              phone: row[4],
            }));
          setStudents([...students, ...importedStudents]);
        },
        header: false,
      });
    }
  };

  // Download sample CSV
  const downloadSampleCSV = () => {
    const blob = new Blob([sampleCSV], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'student_template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Navigator />
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        Student Management
      </Typography>

      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <StyledButton
          variant="contained"
          color="primary"
          onClick={handleOpen}
        >
          Add New Student
        </StyledButton>

        <StyledButton
          variant="outlined"
          color="primary"
          component="label"
        >
          Import CSV
          <input
            type="file"
            hidden
            accept=".csv"
            onChange={handleFileUpload}
          />
        </StyledButton>

        <StyledButton
          variant="outlined"
          color="secondary"
          startIcon={<GetApp />}
          onClick={downloadSampleCSV}
        >
          Download Template
        </StyledButton>
      </Box>

      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1976d2' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Student ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Full Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Personal Email</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Student Email</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Phone Number</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id} hover>
                <TableCell>{student.id}</TableCell>
                <TableCell>{student.fullName}</TableCell>
                <TableCell>{student.personalEmail}</TableCell>
                <TableCell>{student.studentEmail}</TableCell>
                <TableCell>{student.phone}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(student)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(student.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {/* Dialog for Create/Update */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? 'Edit Student' : 'Add New Student'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="id"
            label="Student ID"
            fullWidth
            value={currentStudent.id}
            onChange={handleChange}
            disabled={editMode}
          />
          <TextField
            margin="dense"
            name="fullName"
            label="Full Name"
            fullWidth
            value={currentStudent.fullName}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="personalEmail"
            label="Personal Email"
            type="email"
            fullWidth
            value={currentStudent.personalEmail}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="studentEmail"
            label="Student Email"
            type="email"
            fullWidth
            value={currentStudent.studentEmail}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="phone"
            label="Phone Number"
            fullWidth
            value={currentStudent.phone}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editMode ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};