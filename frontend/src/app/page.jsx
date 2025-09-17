
'use client';
import { useEffect, useState } from 'react';
import { fetchQuizzes, deleteQuiz } from '@/utils/api';
import './MainPage.scss';
import "./Adaptations.scss"
import { useRouter } from 'next/navigation';

export default function Home() {
  const [quizzes, setQuizzes] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const getQuizzes = async () => {
      try {
        const data = await fetchQuizzes();
        setQuizzes(data.quizzes);
      } catch (err) {
        console.log(err.message);
      }
    };
    getQuizzes();
  }, []);

  return (
    <div className="container">

      {quizzes.length === 0 ? (
        <p className="empty-message">No quizzes available. Create your first quiz!</p>
      ) : (
        <div className="quiz-grid">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="quiz-card"
              onClick={() => router.push(`/quizzes/${quiz.id}`)}
            >
              <h2 className="quiz-title">{quiz.title}</h2>
              <div className="card-content">
                <div className="quiz-meta">
                  <span>{quiz.questions_count} questions</span>
                </div>
                <button
                  className="quiz-delete"
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (confirm('Are you sure you want to delete this quiz?')) {
                      try {
                        await deleteQuiz(quiz.id);
                        setQuizzes(quizzes.filter(q => q.id !== quiz.id));
                      } catch (err) {
                        console.error('Error deleting quiz:', err);
                        alert('Failed to delete quiz');
                      }
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
