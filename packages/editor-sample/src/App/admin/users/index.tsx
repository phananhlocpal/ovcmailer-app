import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast, ToastContainer } from 'react-toastify';
import Papa from 'papaparse';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';

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
  'status'
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
      callback(isValid, result.data);
    },
    header: true,
    skipEmptyLines: true
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
      status: 'active'
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 100 }}
      className="w-1/3 bg-white p-6 shadow-lg border-l"
    >
      <h2 className="text-xl font-semibold mb-4">{user ? 'Edit User' : 'Add User'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {csvTemplateHeaders.map((field) =>
            field !== 'status' ? (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700">
                  {field.replace('_', ' ').toUpperCase()}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field as keyof User]}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
            ) : null
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Save
          </button>
        </div>
      </form>
    </motion.div>
  );
};

const UserList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const queryClient = useQueryClient(); // Access the query client to invalidate queries

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      // const response = await fetch(API_URL);
      // return response.json();
      return [
        {
          user_code: 'locpa',
          student_id: '1952827',
          full_name: 'Phan Anh Loc',
          email_hcmut: 'loc.phan.pal@hcmut.edu.vn',
          email_individual: 'anhloc280@gmail.com',
          phone_number: '0345654280',
          status: 'active'
        }
      ]
    }
  });

  const createMutation = useMutation({
    mutationFn: async (user: User) => {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully!');
      setShowForm(false);
    },
    onError: () => toast.error('Failed to create user')
  });

  const updateMutation = useMutation({
    mutationFn: async (user: User) => {
      const response = await fetch(`${API_URL}/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated successfully!');
      setShowForm(false);
      setEditingUser(null);
    },
    onError: () => toast.error('Failed to update user')
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully!');
    },
    onError: () => toast.error('Failed to delete user')
  });

  const bulkCreateMutation = useMutation({
    mutationFn: async (users: User[]) => {
      const response = await fetch(`${API_URL}/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(users)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Users created successfully!');
    },
    onError: () => toast.error('Failed to create users')
  });

  const handleSave = (user: User) => {
    if (editingUser && editingUser.id) {
      updateMutation.mutate({ ...user, id: editingUser.id });
    } else {
      createMutation.mutate(user);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateCsv(file, (isValid, data) => {
        if (isValid) {
          bulkCreateMutation.mutate(data);
        } else {
          toast.error('Invalid CSV format. Please use the provided template.');
        }
      });
    }
  };

  if (isLoading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <div className={`flex-1 p-6 ${showForm ? 'w-2/3' : 'w-full'}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">User Management</h1>
          <div className="space-x-2">
            <button
              onClick={downloadCsvTemplate}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Download CSV Template
            </button>
            <label className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
              Upload CSV
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
            <button
              onClick={() => {
                setEditingUser(null);
                setShowForm(true);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add User
            </button>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {csvTemplateHeaders.map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.replace('_', ' ')}
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users?.map((user) => (
                <tr key={user.id}>
                  {csvTemplateHeaders.map((field) => (
                    <td key={field} className="px-6 py-4 text-sm text-gray-500">
                      {user[field as keyof User]}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id!)}
                      className="text-red-600 hover:text-red-900 ml-4"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <UserForm
            user={editingUser || undefined}
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
          />
        )}
      </AnimatePresence>
      <ToastContainer />
    </div>
  );
};

export default UserList;
