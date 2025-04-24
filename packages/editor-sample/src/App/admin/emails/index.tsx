import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast, ToastContainer } from 'react-toastify';
import Papa from 'papaparse';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Box,
  Typography,
  Pagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TableSortLabel,
  SelectChangeEvent,
  Chip,
  Autocomplete
} from '@mui/material';
import { Download, Upload, Add, Edit, Delete, CheckCircle, Cancel } from '@mui/icons-material';

const API_URL = 'http://localhost:3000/api/users';

interface User {
  id?: number;
  user_code: string;
  student_id: string;
  full_name: string;
  email_hcmut: string;
  email_individual: string;
  phone_number: string;
  status: 'active' | 'inactive';
}

const csvTemplateHeaders = [
  'user_code',
  'student_id',
  'full_name',
  'email_hcmut',
  'email_individual',
  'phone_number',
  'status',
];

const downloadCsvTemplate = () => {
  const csvContent = csvTemplateHeaders.join(',') + '\n';
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'user_template.csv');
  link.click();
};

const validateCsv = (file: File, callback: (isValid: boolean, data: User[]) => void) => {
  Papa.parse(file, {
    complete: (result: Papa.ParseResult<User>) => {
      const headers = result.data[0] ? Object.keys(result.data[0]) : [];
      const isValid = csvTemplateHeaders.every((header) => headers.includes(header));

      if (!isValid) {
        callback(false, []);
        return;
      }

      const hasValidData = result.data.every((row) =>
        row.full_name && row.full_name.trim() !== '' &&
        row.email_hcmut && row.email_hcmut.trim() !== ''
      );

      if (!hasValidData) {
        callback(false, []);
        toast.error('CSV contains rows with missing or empty full_name or email_hcmut.', {
          position: 'bottom-right',
        });
        return;
      }

      callback(true, result.data);
    },
    header: true,
    skipEmptyLines: true,
  });
};

interface UserFormProps {
  user?: User;
  onSave: (user: User) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState<User>(
    user || {
      user_code: '',
      student_id: '',
      full_name: '',
      email_hcmut: '',
      email_individual: '',
      phone_number: '',
      status: 'active',
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | React.ChangeEvent<{ name?: string; value: unknown }> | SelectChangeEvent<"active" | "inactive">
  ) => {
    const { name, value } = e.target as { name?: string; value: unknown };
    if (name) {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const editableFields = ['full_name', 'email_individual', 'phone_number', 'status'];

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 80, damping: 20 }}
      className="w-1/3 bg-white p-6 shadow-lg border-l"
    >
      <Typography variant="h6" gutterBottom>
        {user ? 'Edit User' : 'Add User'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {csvTemplateHeaders.map((field) =>
            field !== 'status' ? (
              <TextField
                key={field}
                label={field.replace('_', ' ').toUpperCase()}
                name={field}
                value={formData[field as keyof User]}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                required={editableFields.includes(field) || !user}
                disabled={user && !editableFields.includes(field)}
              />
            ) : null
          )}
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              label="Status"
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="contained" type="submit">
            Save
          </Button>
        </Box>
      </form>
    </motion.div>
  );
};

const UserList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [orderBy, setOrderBy] = useState<keyof User | ''>('');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const itemsPerPage = 5;
  const queryClient = useQueryClient();

  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  // Nếu bạn dùng useState để quản lý giá trị chọn
  const [status, setStatus] = useState(statusOptions[0]); // mặc định là "active"


  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      return [
        {
          id: 1,
          user_code: 'locpa',
          student_id: '1952827',
          full_name: 'Phan Anh Loc',
          email_hcmut: 'loc.phan.pal@hcmut.edu.vn',
          email_individual: 'anhloc280@gmail.com',
          phone_number: '0345654280',
          status: 'active',
        },
      ];
    },
  });

  const handleSort = (property: keyof User) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedUsers = users ? [...users].sort((a, b) => {
    if (!orderBy) return 0;
    const valueA = a[orderBy];
    const valueB = b[orderBy];
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    }
    return order === 'asc' ? ((valueA ?? '') < (valueB ?? '') ? -1 : 1) : ((valueA ?? '') > (valueB ?? '') ? -1 : 1);
  }) : [];

  const filteredUsers = sortedUsers.filter((user) =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const createMutation = useMutation({
    mutationFn: async (user: User) => {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully!', {
        position: 'bottom-right',
      });
      setShowForm(false);
    },
    onError: () => toast.error('Failed to create user', {
      position: 'bottom-right',
    }),
  });

  const updateMutation = useMutation({
    mutationFn: async (user: User) => {
      const response = await fetch(`${API_URL}/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated successfully!', {
        position: 'bottom-right',
      });
      setShowForm(false);
      setEditingUser(null);
    },
    onError: () => toast.error('Failed to update user', {
      position: 'bottom-right',
    }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully!', {
        position: 'bottom-right',
      });
    },
    onError: () => toast.error('Failed to delete user', {
      position: 'bottom-right',
    }),
  });

  const bulkCreateMutation = useMutation({
    mutationFn: async (users: User[]) => {
      const response = await fetch(`${API_URL}/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(users),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Users created successfully!', {
        position: 'bottom-right',
      });
    },
    onError: () => toast.error('Failed to create users', {
      position: 'bottom-right',
    }),
  });

  const handleSave = (user: User) => {
    if (editingUser && editingUser.id) {
      setSelectedUser(user);
      setOpenUpdateDialog(true);
    } else {
      createMutation.mutate(user);
    }
  };

  const handleConfirmUpdate = () => {
    if (selectedUser && selectedUser.id) {
      updateMutation.mutate({ ...selectedUser, id: selectedUser.id });
    }
    setOpenUpdateDialog(false);
    setSelectedUser(null);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setSelectedUserId(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUserId) {
      deleteMutation.mutate(selectedUserId);
    }
    setOpenDeleteDialog(false);
    setSelectedUserId(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateCsv(file, (isValid, data) => {
        if (isValid) {
          bulkCreateMutation.mutate(data);
        } else {
          toast.error('Invalid CSV format. Please use the provided template.', {
            position: 'bottom-right',
          });
        }
      });
    }
  };

  if (isLoading) return <Box sx={{ textAlign: 'center', py: 10 }}>Loading...</Box>;

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ flex: 1, p: 3, overflow: 'auto', width: showForm ? '70%' : '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', mb: 1, }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'end' }}>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={downloadCsvTemplate}
              color="success"
            >
              CSV Template
            </Button>
            <Button
              variant="contained"
              startIcon={<Upload />}
              component="label"
              color="info"
            >
              Upload CSV
              <input
                type="file"
                accept=".csv"
                hidden
                onChange={handleFileUpload}
              />
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setEditingUser(null);
                setShowForm(true);
              }}
            >
              Add User
            </Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'end' }}>
            <Autocomplete
              id="status-select"
              sx={{ width: 300, background: 'white' }}
              options={statusOptions}
              value={status}
              disableClearable
              onChange={(event, newValue) => {
                if (newValue) {
                  setStatus(newValue);
                }
              }}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  {...props}
                >
                  {option.value === 'active' ? (
                    <CheckCircle color="success" fontSize="small" />
                  ) : (
                    <Cancel color="error" fontSize="small" />
                  )}
                  <Typography variant="body2">{option.label}</Typography>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Status"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password',
                    readOnly: true,
                  }}
                />
              )}
            />
            <TextField
              label="Search users"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              variant="outlined"
              sx={{
                width: 300,
                backgroundColor: 'white',
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2',
                    borderWidth: 2,
                  },
                },
                '& label.Mui-focused': {
                  color: '#1976d2',
                },
              }}
            />
          </Box>
        </Box>
        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                {csvTemplateHeaders.map((header) => (
                  <TableCell key={header}>
                    <TableSortLabel
                      active={orderBy === header}
                      direction={orderBy === header ? order : 'asc'}
                      onClick={() => handleSort(header as keyof User)}
                    >
                      {header.replace('_', ' ').toUpperCase()}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id} hover>
                  {csvTemplateHeaders.map((field) => (
                    <TableCell key={field}>
                      {field === 'status' ? (
                        <Chip
                          label={user.status}
                          color={user.status === 'active' ? 'success' : 'error'}
                          variant="outlined"
                          size="small"
                        />
                      ) : (
                        user[field as keyof User]
                      )}
                    </TableCell>
                  ))}
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleEdit(user)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(user.id!)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            color="primary"
          />
        </Box>
      </Box>

      <AnimatePresence>
        {showForm && (
          <UserForm
            user={editingUser || undefined}
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
          />
        )}
      </AnimatePresence>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openUpdateDialog}
        onClose={() => setOpenUpdateDialog(false)}
      >
        <DialogTitle>Confirm Update</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to update this user's information?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdateDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </Box>
  );
};

export default UserList;