'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createQuiz } from '@/utils/api';
import './CreationPage.scss';
import "./Adaptations.scss";

export default function CreateQuiz() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    question_text: '',
    question_type: 'checkbox',
    options: ['']
  });

  const addQuestion = () => {
    if (!currentQuestion.question_text) {
      alert('Please enter question text');
      return;
    }
    
    if (currentQuestion.question_type === 'checkbox') {
      const validOptions = currentQuestion.options.filter(opt => opt.trim() !== '');
      if (validOptions.length < 2) {
        alert('Checkbox questions require at least 2 options');
        return;
      }
    }

    setQuestions([...questions, currentQuestion]);
    setCurrentQuestion({
      question_text: '',
      question_type: 'checkbox',
      options: ['']
    });
  };

  const addOption = () => {

    const lastOption = currentQuestion.options[currentQuestion.options.length - 1];
    if (!lastOption.trim()) {
      alert('Please fill in the current option before adding a new one');
      return;
    }

    setCurrentQuestion({
      ...currentQuestion,
      options: [...currentQuestion.options, '']
    });
  };

  const updateOption = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions
    });
  };

  const deleteOption = (index) => {
    if (currentQuestion.options.length <= 1) {
      alert('You must have at least one option');
      return;
    }
    const newOptions = currentQuestion.options.filter((_, i) => i !== index);
    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions
    });
  };

  const deleteQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || questions.length === 0) {
      alert('Please add a title and at least one question');
      return;
    }

    try {

      const invalidQuestion = questions.find(q => 
        q.question_type === 'checkbox' && 
        q.options.filter(opt => opt.trim() !== '').length < 2
      );
      
      if (invalidQuestion) {
        alert(`Question "${invalidQuestion.question_text}" must have at least 2 options`);
        return;
      }

      const cleanQuestions = questions.map(q => ({
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.question_type === 'checkbox' ? 
          q.options.filter(opt => opt.trim() !== '') :
          null
      }));

      const payload = {
        title: title.trim(),
        questions: cleanQuestions
      };

      const data = await createQuiz(payload);
      
      if (!data) {
        throw new Error('Failed to create quiz');
      }

      if (data.success) {
        router.push('/');
      }
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert(error.message || 'Failed to create quiz. Please try again.');
    }
  };

  return (
    <div className="quiz-container-create">
      <span className="quiz-title">Create New Quiz</span>
      
      <form onSubmit={handleSubmit} className="quiz-form">

        <label className="quiz-label">
          Quiz Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="quiz-input"
            required
          />
        </label>

        <div className="question-box">
          <span className="question-box-title">Current Question</span>
          <div className="question-inputs">
            <div className="question-title">
              <input
                type="text"
                value={currentQuestion.question_text}
                onChange={(e) => setCurrentQuestion({
                  ...currentQuestion,
                  question_text: e.target.value
                })}
                placeholder="Enter question text"
                className="quiz-input"
              />
              <select
                value={currentQuestion.question_type}
                onChange={(e) => setCurrentQuestion({
                  ...currentQuestion,
                  question_type: e.target.value
                })}
                className="quiz-select"
              >
                <option value="checkbox">Multiple Choice</option>
                <option value="boolean">True/False</option>
                <option value="input">Text Answer</option>
              </select>
            </div>

            {currentQuestion.question_type === 'checkbox' && (
              <div className="options-container">
                <span>Options:</span>
                <div className="options-list">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="option-input-container" style={{ position: 'relative' }}>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="quiz-input"
                      />
                      <button
                        type="button"
                        onClick={() => deleteOption(index)}
                        className="delete-option-button"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addOption}
                  className="secondary-button"
                >
                  Add Option
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={addQuestion}
              className="primary-button"
            >
              Add Question
            </button>
          </div>
        </div>

        {questions.length > 0 && (
          <div className="question-box">
            <h2 className="question-box-title">Added Questions:</h2>
            <ul className="questions-list">
              {questions.map((q, index) => (
                <li
                  key={index}
                  className='question-item'
                >
                  <div
                    className='question-item-content'
                  >
                    <div className='question-info'>
                      {q.question_text} ({q.question_type})
                      {q.options && q.options.length > 0 && (
                        <ul className="options-list">
                          {q.options.map((opt, i) => (
                            <li key={i}>{opt}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteQuestion(index)}
                      className="delete-question-button"
                    >
                      ×
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          className="submit-button"
          disabled={!title || questions.length === 0}
        >
          Create Quiz
        </button>
      </form>
    </div>
  );
}
