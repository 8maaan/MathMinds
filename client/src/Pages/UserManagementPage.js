import React, { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, Typography, TextField } from '@mui/material';
import { getAllUsersForAdmin, changeUserRole } from '../API-Services/UserAPI';
import '../PagesCSS/UserManagementPage.css'
import '../PagesCSS/Global.css';

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUsersForAdmin();
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
            window.location.reload();
        } catch (error) {
            console.error('Error changing role:', error);
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        
        const filtered = users.filter((user) => 
            user.uid.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.fname.toLowerCase().includes(query) ||
            user.lname.toLowerCase().includes(query)
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
                    backgroundColor:"#f4f4f4", 
                    '& .MuiInput-underline:before': {
                        borderBottomColor: '#ffb100', // Before focus
                    },
                    '& .MuiInput-underline:after': {
                        borderBottomColor: '#ffb100', // After focus
                    },
                    '& .MuiInputBase-input': {
                        color: '#181A52', // Text color
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
                <Table aria-label="user table" stickyHeader sx={{}}>
                    <TableHead component={Paper}>
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
                                                fontFamily: 'Poppins',
                                                '&:hover': {
                                                    backgroundColor: '#e69500', // Darker shade on hover
                                                }
                                            }} onClick={() => handleOpen(user)}>
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
                    <Typography variant="h6" sx={{ fontFamily: 'Poppins' }}>Confirm Role Change</Typography>
                    <Typography sx={{ marginBottom: '20px', fontFamily: 'Poppins' }}>
                        Are you sure you want to change the role of {selectedUser?.fname} {selectedUser?.lname} from {selectedUser?.userType} to {selectedUser?.userType === 'Student' ? 'Teacher' : 'Student'}?
                    </Typography>
                    <Button variant="contained" sx={{
                        backgroundColor: '#ffb100', 
                        color: '#181A52', 
                        fontFamily: 'Poppins',
                        '&:hover': {
                            backgroundColor: '#e69500', // Darker shade on hover
                        }
                    }} onClick={handleChangeRole}>
                        Yes
                    </Button>
                    <Button variant="outlined" sx={{
                        marginLeft: '10px', 
                        fontFamily: 'Poppins', 
                        color: '#181A52', 
                        borderColor: '#ffb100',
                        '&:hover': {
                            borderColor: '#e69500', // Darker shade on hover
                            backgroundColor: 'rgba(255, 177, 0, 0.1)', // Light background on hover
                        }
                    }} onClick={handleClose}>
                        No
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
}

export default UserManagementPage;
