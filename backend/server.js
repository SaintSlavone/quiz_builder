const express = require('express');
const cors = require('cors');
const { pool, initDB } = require('./database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());


initDB();

// POST /quizzes - Create a new quiz
app.post('/quizzes', async (req, res) => {
  try {
    const { title, questions } = req.body;
    
    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ 
        error: 'Title and at least one question are required' 
      });
    }

    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const quizResult = await client.query(
        'INSERT INTO quizzes (title) VALUES ($1) RETURNING *',
        [title]
      );
      
      const quizId = quizResult.rows[0].id;
      
      for (const question of questions) {
        await client.query(
          'INSERT INTO questions (quiz_id, question_text, question_type, options) VALUES ($1, $2, $3, $4)',
          [
            quizId, 
            question.question_text, 
            question.question_type,
            JSON.stringify(question.options || null), 
          ]
        );
      }
      
      await client.query('COMMIT');
      
      res.status(201).json({
        success: true,
        quiz: quizResult.rows[0]
      });
      
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
    
  } catch (err) {
    console.error('Error creating quiz:', err);
    res.status(500).json({ error: 'Failed to create quiz' });
  }
});

// GET /quizzes - Return a list of all quizzes
app.get('/quizzes', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        q.id,
        q.title,
        q.created_at,
        COUNT(qs.id) as questions_count
      FROM quizzes q
      LEFT JOIN questions qs ON q.id = qs.quiz_id
      GROUP BY q.id, q.title, q.created_at
      ORDER BY q.created_at DESC
    `);
    
    res.json({
      success: true,
      quizzes: result.rows
    });
    
  } catch (err) {
    console.error('Error fetching quizzes:', err);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

// GET /quizzes/:id - Return full details of a quiz
app.get('/quizzes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const quizResult = await pool.query(
      'SELECT * FROM quizzes WHERE id = $1',
      [id]
    );
    
    if (quizResult.rows.length === 0) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    
    const questionsResult = await pool.query(
      'SELECT * FROM questions WHERE quiz_id = $1 ORDER BY id',
      [id]
    );
    
    const quiz = {
      ...quizResult.rows[0],
      questions: questionsResult.rows
    };
    
    res.json({
      success: true,
      quiz
    });
    
  } catch (err) {
    console.error('Error fetching quiz:', err);
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
});

// DELETE /quizzes/:id - Delete a quiz
app.delete('/quizzes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM quizzes WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    
    res.json({
      success: true,
      message: 'Quiz deleted successfully',
      deletedQuiz: result.rows[0]
    });
    
  } catch (err) {
    console.error('Error deleting quiz:', err);
    res.status(500).json({ error: 'Failed to delete quiz' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});