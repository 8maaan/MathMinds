import React, { } from 'react'
import {Box, Modal, Typography, Fade, Backdrop, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, tableCellClasses, Button } from '@mui/material'
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "rgba(255, 177, 0, 0.7)",
      color: "#181A52",
      fontWeight: "600",
      fontSize: 17,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: '1rem',
      color: "#333333"
    },
}));
  
const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(even)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
}));

const MultiplayerLeaderboardModal = ({open, onClose, scores, isFinished, roomCode}) => {
    const navigateTo = useNavigate();
    const handleNavigateBacktoLobby = () => {
        navigateTo(`/lobby/${roomCode}`)
    }
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: !isFinished ? '50%' : '80%',
        height: !isFinished ? '60%' : '80%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        borderRadius: '20px',
        color: '#181A52'
    };
    
    const sortedScores = Object.entries(scores).sort(([, scoreA], [, scoreB]) => scoreB - scoreA);
    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={isFinished ? undefined : onClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                backdrop: {
                    timeout: 500,
                },}}
            >
            <Fade in={open}>
                <Box sx={{ ...style, display: 'flex', flexDirection: 'column' }}>
                    <Typography id="transition-modal-title" variant="h5" component="h2" sx={{textAlign: 'center', marginBottom: '1.5%'}}>
                        👑 Leaderboard 👑
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table aria-label="leaderboard table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Rank</StyledTableCell>
                                    <StyledTableCell>Player Name</StyledTableCell>
                                    <StyledTableCell align="left">Score</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedScores.map(([playerId, totalScore], index) => (
                                    <StyledTableRow key={playerId}>
                                        <StyledTableCell>{index + 1}</StyledTableCell> {/* Rank column */}
                                        <StyledTableCell component="th" scope="row">
                                            {playerId} {isFinished && (index + 1 === 1 ? '🥇' : index + 1 === 2 ? '🥈' : index + 1 === 3 ? '🥉' : '')}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">{totalScore}</StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {isFinished && 
                        <Box sx={{ marginTop: 'auto', textAlign: 'center', }}>
                            <p style={{fontWeight: '600', color: '#ba8f22'}}>The game has finished!</p>
                            <Button variant='contained' onClick={() => handleNavigateBacktoLobby()}>Lobby</Button>
                        </Box>
                     }
                </Box>
            </Fade>
        </Modal>
        </div>
    )
}

export default MultiplayerLeaderboardModal