import { useEffect , useState } from 'react';

function QuizPage() {
    const [questions , setQuestions] = useState([]);
    useEffect(() => {
        try {
            fetch(process.env.FETCH_QUESTIONS).then((res) => {
                return res.json();
            }).then((data) => {
                setQuestions(data);
            })
        } catch (error) {
            console.error("Error fetching quiz questions:", error);
        }
    }, [])

    return (
        <div className="quiz_page_container">
            <div className="header">
                <div className="content">04/40</div>
                <div className="content website_name">Quiz With Me</div>
                <div className="content"><i className="bi bi-clock"></i> 60:00</div>
            </div>
            <div className="question_container">
                <div className="question">Hello World</div>
            </div>
        </div>
    );
}

export default QuizPage;