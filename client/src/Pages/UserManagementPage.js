import React, { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, Typography } from '@mui/material';
import { getAllUsersForAdmin, changeUserRole } from '../API-Services/UserAPI';
import '../PagesCSS/UserManagementPage.css'

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUsersForAdmin();
                if (response && response.data) {
                    setUsers(response.data);
                } else {
                    setUsers([]);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                setUsers([]);
            }
        };

        fetchUsers();
    }, []);

    const handleOpen = (user) => {
        setSelectedUser(user);
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleChangeRole = async () => {
        try {
            const newRole = selectedUser.userType === 'Student' ? 'Teacher' : 'Student';
            await changeUserRole(selectedUser.uid, newRole);
            handleClose();
            window.location.reload(); // Reloads the page after a role change
        } catch (error) {
            console.error('Error changing role:', error);
        }
    };

    return (
        <Box className="user-management-page">
            <TableContainer component={Paper}>
                <Table aria-label="user table">
                    <TableHead>
                        <TableRow>
                            <TableCell>UID</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>User Type</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <TableRow key={user.uid}>
                                    <TableCell>{user.uid}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.fname}</TableCell>
                                    <TableCell>{user.lname}</TableCell>
                                    <TableCell>{user.status}</TableCell>
                                    <TableCell>{user.userType}</TableCell>
                                    <TableCell>
                                        {user.userType !== 'Admin' && (
                                            <Button variant="contained" color="primary" onClick={() => handleOpen(user)}>
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

            <Modal open={open} onClose={handleClose}>
                <Box sx={{ padding: '20px', backgroundColor: 'white', margin: '20px auto', maxWidth: '400px', borderRadius: '8px' }}>
                    <Typography variant="h6">Confirm Role Change</Typography>
                    <Typography sx={{ marginBottom: '20px' }}>
                        Are you sure you want to change the role of {selectedUser?.fname} {selectedUser?.lname} from {selectedUser?.userType} to {selectedUser?.userType === 'Student' ? 'Teacher' : 'Student'}?
                    </Typography>
                    <Button variant="contained" color="primary" onClick={handleChangeRole}>
                        Yes
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleClose} sx={{ marginLeft: '10px' }}>
                        No
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
}

export default UserManagementPage;
