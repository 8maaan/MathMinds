import React, { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField } from '@mui/material';
import { getAllUsersForAdmin, changeUserRole } from '../API-Services/UserAPI';
import '../PagesCSS/UserManagementPage.css';
import '../PagesCSS/Global.css';
import ReusableDialog from '../ReusableComponents/ReusableDialog';
import ReusableSnackbar from '../ReusableComponents/ReusableSnackbar';
import { UserAuth } from '../Context-and-routes/AuthContext';

const UserManagementPage = () => {
    const { user } = UserAuth();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState(''); // New state for snackbar type

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUsersForAdmin(user.uid);
                if (response && response.data) {
                    setUsers(response.data);
                    setFilteredUsers(response.data);
                } else {
                    setUsers([]);
                    setFilteredUsers([]);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                setUsers([]);
                setFilteredUsers([]);
            }
        };

        fetchUsers();
    }, []);

    const handleOpenDialog = (user) => {
        setSelectedUser(user);
        setDialogOpen(true);
    };

    const handleCloseDialog = async (confirmed) => {
        setDialogOpen(false);
        if (confirmed) {
            // Proceed with role change if confirmed
            try {
                const newRole = selectedUser.userType === 'Student' ? 'Teacher' : 'Student';
                await changeUserRole(selectedUser.uid, newRole);

                // Update user list locally without reloading the page
                const updatedUsers = users.map((user) =>
                    user.uid === selectedUser.uid ? { ...user, userType: newRole } : user
                );

                setUsers(updatedUsers);
                setFilteredUsers(updatedUsers);

                // Display success message
                setSnackbarType('success');
                setSnackbarMessage('User role changed successfully!');
                setSnackbarOpen(true);
            } catch (error) {
                console.error('Error changing role:', error);

                // Display error message
                setSnackbarType('error');
                setSnackbarMessage('Failed to change user role, try again later.');
                setSnackbarOpen(true);
            }
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = users.filter((user) =>
            (user.uid && user.uid.toLowerCase().includes(query)) ||
            (user.email && user.email.toLowerCase().includes(query)) ||
            (user.fname && user.fname.toLowerCase().includes(query)) ||
            (user.lname && user.lname.toLowerCase().includes(query))
        );

        setFilteredUsers(filtered);
    };

    return (
        <Box className="user-management-page">
            <TextField
                label="Search users"
                variant="standard"
                value={searchQuery}
                onChange={handleSearch}
                sx={{
                    marginBottom: 2,
                    width: '100%',
                    backgroundColor: "#f4f4f4",
                    '& .MuiInput-underline:before': {
                        borderBottomColor: '#ffb100',
                    },
                    '& .MuiInput-underline:after': {
                        borderBottomColor: '#ffb100',
                    },
                    '& .MuiInputBase-input': {
                        color: '#181A52',
                    },
                    '& .MuiInputLabel-root': {
                        color: '#181A52', fontFamily:'Poppins' // Label color
                    },
                    '& .MuiInputLabel-root:after': {
                        color: '#181A52', // Label color
                    },
                }}
            />
            <TableContainer
                component={Paper}
                sx={{
                    maxHeight: 440,
                    '& .MuiTableCell-root': { color: '#181A52', fontFamily: 'Poppins' },
                    '&::-webkit-scrollbar': {
                        width: '8px',
                        height: '8px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#a6a6a6',
                        borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: '#808080',
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: '#f4f4f4',
                    }
                }}
            >
                <Table aria-label="user table" stickyHeader>
                    <TableHead component={Paper}>
                        <TableRow>
                            <TableCell>UID</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>User Role</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <TableRow key={user.uid}>
                                    <TableCell>{user.uid}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.fname}</TableCell>
                                    <TableCell>{user.lname}</TableCell>
                                    <TableCell>{user.status}</TableCell>
                                    <TableCell>{user.userType}</TableCell>
                                    <TableCell>
                                        {user.userType !== 'Admin' && (
                                            <Button variant="contained" sx={{
                                                backgroundColor: '#ffb100',
                                                color: '#181A52',
                                                borderRadius: '8px',
                                                '&:hover': {
                                                    backgroundColor: '#e69500',
                                                }
                                            }} onClick={() => handleOpenDialog(user)}>
                                                Change Role
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* ReusableDialog for confirmation */}
            <ReusableDialog
                status={dialogOpen}
                onClose={handleCloseDialog}
                title="Confirm Role Change"
                context={`Are you sure you want to change the role of ${selectedUser?.fname} ${selectedUser?.lname} from ${selectedUser?.userType} to ${selectedUser?.userType === 'Student' ? 'Teacher' : 'Student'}?`}
            />

            {/* ReusableSnackbar for notifications */}
            <ReusableSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarType} // Pass snackbar type here
                onClose={() => setSnackbarOpen(false)}
            />
        </Box>
    );
};

export default UserManagementPage;
