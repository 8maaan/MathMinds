import React from 'react';
import ReusableAppBar from '../ReusableComponents/ReusableAppBar';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import '../PagesCSS/ScoreDisplayStyle.css';

const ScoreDisplay = () => {
  // Dummy 
  const scores = [
    { id: 1, name: 'Name', questionsCorrect: 10, totalQuestions: 10, score: 100, totalScore: 100 },
    { id: 2, name: 'Name', questionsCorrect: 7, totalQuestions: 10, score: 70, totalScore: 100 },
    // ... add more score data as needed
  ];

  return (
    <div className="overallContainer"> 
    <ReusableAppBar />
    <div className="table-container"> 
    <TableContainer component={Paper} elevation={3} className="table-container">
      <Table aria-label="simple table">
        <TableHead>
        <TableRow className="tableHeadRow">
              <TableCell className="tableHeadCell">#</TableCell>
              <TableCell className="tableHeadCell">Name</TableCell>
              <TableCell className="tableHeadCell" align="right">Questions</TableCell>
              <TableCell className="tableHeadCell" align="right">Score</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
          {scores.map((row, index) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row" className="firstTableCell">
                {row.id}
              </TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell align="right">{`${row.questionsCorrect}/${row.totalQuestions}`}</TableCell>
              <TableCell align="right" className={scores.length === index + 1 ? "lastTableCell" : ""}>
                {`${row.score}/${row.totalScore}`}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
        <div className="done-button">
  <Button variant="contained" style={{ backgroundColor: ' #F5F5F5', color: 'black' }}>
    Done
  </Button>
</div>
      </div>
    </div>
  );
};

export default ScoreDisplay;
