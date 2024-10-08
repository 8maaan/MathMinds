import { TextField, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const PracticeQuestion = ({ id, question, correctAnswer, incorrectAnswers, updateQuestion, deleteQuestion }) => {

    const handleUpdate = (field, value) => {
        const updatedQuestion = { question, correctAnswer, incorrectAnswers, [field]: value };
        updateQuestion(id, updatedQuestion);
    };

    const handleDelete = () => {
        deleteQuestion(id);
    };

    return (
        <>
        <div className="practiceQuestionContainer">
            <TextField
                variant='filled'
                label="Question"
                value={question}
                onChange={e => handleUpdate('question', e.target.value)}
                fullWidth
                autoComplete='off'
                required
            />
            <TextField
                label="Correct Answer"
                value={correctAnswer}
                onChange={e => handleUpdate('correctAnswer', e.target.value)}
                fullWidth
                autoComplete='off'
                required
            />
            {incorrectAnswers.map((answer, index) => (
                <TextField
                    key={index}
                    label={`Incorrect Answer ${index + 1}`}
                    value={answer}
                    onChange={e => {
                        const newIncorrectAnswers = [...incorrectAnswers];
                        newIncorrectAnswers[index] = e.target.value;
                        handleUpdate('incorrectAnswers', newIncorrectAnswers);
                    }}
                    fullWidth
                    autoComplete='off'
                    required={index===0}
                />
            ))}
            
        </div>
        <div className='practice-content-actions'>
        <IconButton onClick={handleDelete} color="error"><DeleteIcon /></IconButton>
        </div>
        </>
    );
};

export default PracticeQuestion;
