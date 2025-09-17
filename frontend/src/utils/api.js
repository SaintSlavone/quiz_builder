const API_BASE = "http://localhost:3001";

export async function fetchQuizzes() {
    const res = await fetch(`${API_BASE}/quizzes`);
    if (!res.ok) throw new Error(`Failed to fetch quizzes: ${res.status}`);
    return res.json();
}

export async function fetchQuizzesById(id) {
    const res = await fetch(`${API_BASE}/quizzes/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch quizzes: ${res.status}`);
    return res.json();
}

export async function deleteQuiz(id) {
    const res = await fetch(`${API_BASE}/quizzes/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error(`Failed to delete quiz: ${res.status}`);
    return res.json();
}

export async function createQuiz(quizData) {
    const res = await fetch(`${API_BASE}/quizzes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData)
    });
    if (!res.ok) throw new Error(`Failed to create quiz: ${res.status}`);
    return res.json();
}