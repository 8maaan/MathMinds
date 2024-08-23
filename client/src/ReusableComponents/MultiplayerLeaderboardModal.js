import React, { } from 'react'
import {Box, Modal, Typography, Fade, Backdrop, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, tableCellClasses } from '@mui/material'
import { styled } from '@mui/material/styles';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    height: '60%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: '20px'
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "rgba(255, 177, 0, 0.7)",
      color: "#181A52",
      fontWeight: "600",
      fontSize: 17,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 15,
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

const MultiplayerLeaderboardModal = ({open, onClose, scores}) => {
    
    const sortedScores = Object.entries(scores).sort(([, scoreA], [, scoreB]) => scoreB - scoreA);
    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={onClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                backdrop: {
                    timeout: 500,
                },}}
            >
            <Fade in={open}>
                <Box sx={style}>
                    <Typography id="transition-modal-title" variant="h5" component="h2" sx={{textAlign: 'center', marginBottom: '1.5%'}}>
                        Leaderboard 👑
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table aria-label="leaderboard table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Rank</StyledTableCell>
                                    <StyledTableCell>Player Name</StyledTableCell>
                                    <StyledTableCell align="right">Score</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedScores.map(([playerId, totalScore], index) => (
                                    <StyledTableRow key={playerId}>
                                        <StyledTableCell>{index + 1}</StyledTableCell> {/* Rank column */}
                                        <StyledTableCell component="th" scope="row">
                                            {playerId}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">{totalScore}</StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Fade>
        </Modal>
        </div>
    )
}

export default MultiplayerLeaderboardModal