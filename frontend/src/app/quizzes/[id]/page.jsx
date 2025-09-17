"use client";

import React, { useEffect, useState } from "react";
import "./DetailPage.scss";
import "./Adaptations.scss";
import { fetchQuizzesById } from "@/utils/api";

export default function page({ params }) {
  const [quiz, setQuiz] = useState(null);

  const { id } = React.use(params);

  useEffect(() => {
    const getQuiz = async () => {
      try {
        const data = await fetchQuizzesById(id);
        setQuiz(data.quiz);
      } catch (err) {
        console.log(err.message);
      }
    };
    getQuiz();
  }, [])
  

  return (
    <>
      {quiz ? (
          <div className="quiz-container">
            <span className="quiz-title">{quiz.title}</span>
            <div className="quiz-content">
              {quiz.questions.length > 0 && (
                <>
                  <ul className="question-list">
                    {quiz.questions.map((question, index) => (
                      <li key={index} className="question-item">
                        <span className="title">{question.question_text}</span>
                        {question.question_type === "input" && (
                          <div className="answer-input">
                            <input 
                              type="text"
                              placeholder="Enter your answer"
                              className="input-field"
                            />
                          </div>
                        )}
                        {question.question_type === "boolean" && (
                          <div className="answer-input">
                            <select className="select-field">
                              <option value="">Select an answer</option>
                              <option value="true">True</option>
                              <option value="false">False</option>
                            </select>
                          </div>
                        )}
                        {question.question_type === "checkbox" && (
                          <div className="answer-input">
                            {question.options.map((option, id) => (
                              <div key={id} className="checkbox-option">
                                <input type="checkbox" id={`checkbox-${index}-${id}`} name={`checkbox-${index}`} value={option} />
                                <label htmlFor={`checkbox-${index}-${id}`}>{option}</label>
                              </div>
                            ))}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                  <button className="submit">
                    Submit Answers
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          null
        )
      }
    </>
  );
};
