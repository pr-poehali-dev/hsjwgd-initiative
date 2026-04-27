import { useState } from "react";

type Step =
  | { quiz: string; step: "question" }
  | { quiz: string; step: "result"; answer: string };

const quizzes = [
  {
    id: "gd",
    label: "Тест на любителя ГД",
    question: "Сколько уровней в ГД?",
    answers: ["1488", "67", "666 exe"],
    results: ["возможно.", "не знаю", "ТОМ666ЕХЕ ВЗЛОМАЛ ТЕБЯ!"],
  },
  {
    id: "undertale",
    label: "Тест на фаната Андертейл",
    question: "Сколько лет Сансу?",
    answers: ["6362637272653", "673836"],
    results: ["грузовички", "огуросыш"],
  },
  {
    id: "nuls",
    label: "Тест на знание нулса",
    question: "Нулс имба?",
    answers: ["Да", "конечно"],
    results: ["молодец!", "правильно!"],
  },
  {
    id: "mine",
    label: "Тест на знание майна",
    question: "Майн имба?",
    answers: ["да", "у у Мишка Мишка"],
    results: ["НЕ ТАК!!!!", "ЭЭЭЭ 67 У У У МИШКА МИШКА (Правильно)"],
  },
  {
    id: "kastrul",
    label: "кастрюля",
    question: null,
    answers: [],
    results: [],
  },
];

export default function Index() {
  const [step, setStep] = useState<Step | null>(null);

  function openQuiz(id: string) {
    if (id === "kastrul") {
      setStep({ quiz: "kastrul", step: "result", answer: "Кастрюля." });
      return;
    }
    setStep({ quiz: id, step: "question" });
  }

  function pickAnswer(quizId: string, idx: number) {
    const q = quizzes.find((x) => x.id === quizId)!;
    setStep({ quiz: quizId, step: "result", answer: q.results[idx] });
  }

  const currentQuiz =
    step ? quizzes.find((x) => x.id === step.quiz)! : null;

  return (
    <div className="pw">
      {/* Poop background */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {Array.from({ length: 30 }).map((_, i) => (
          <span key={i} style={{
            position: "absolute",
            left: `${(i * 37 + 5) % 97}%`,
            top: `${(i * 53 + 11) % 95}%`,
            fontSize: `${1.2 + (i % 4) * 0.6}rem`,
            opacity: 0.18 + (i % 5) * 0.05,
            animation: `floatP ${4 + (i % 4)}s ease-in-out infinite`,
            animationDelay: `${(i * 0.4) % 5}s`,
            userSelect: "none",
          }}>💩</span>
        ))}
      </div>

      <div className="pc">
        <h1 className="mt">💩 МЕГА ТЕСТЫ 💩</h1>
        <p className="ms">Выбери тест и докажи что ты знаешь!</p>

        <div className="bg">
          {quizzes.map((q) => (
            <button key={q.id} className="qb" onClick={() => openQuiz(q.id)}>
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* Question modal */}
      {step?.step === "question" && currentQuiz && (
        <div className="mo" onClick={() => setStep(null)}>
          <div className="mb" onClick={(e) => e.stopPropagation()}>
            <div className="me">💩</div>
            <h2 className="mtt">{currentQuiz.question}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}>
              {currentQuiz.answers.map((ans, i) => (
                <button key={i} className="ab" onClick={() => pickAnswer(currentQuiz.id, i)}>
                  {ans}
                </button>
              ))}
            </div>
            <button className="mc" style={{ marginTop: "1.2rem" }} onClick={() => setStep(null)}>Закрыть ✕</button>
          </div>
        </div>
      )}

      {/* Result modal */}
      {step?.step === "result" && (
        <div className="mo" onClick={() => setStep(null)}>
          <div className="mb" onClick={(e) => e.stopPropagation()}>
            <div className="me">💩</div>
            <p className="mm">{step.answer}</p>
            <button className="mc" onClick={() => setStep(null)}>Закрыть ✕</button>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;700;900&family=Caveat:wght@700&display=swap');

        .pw {
          min-height: 100vh;
          background: radial-gradient(ellipse at center, #5c3a1e 0%, #3b1f0a 50%, #1a0a00 100%);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Rubik', sans-serif;
          position: relative; overflow: hidden; padding: 2rem 1rem;
        }
        .pc { position: relative; z-index: 1; width: 100%; max-width: 480px; text-align: center; }
        .mt {
          font-family: 'Caveat', cursive; font-size: 2.6rem; font-weight: 700;
          color: #ffe0a0; margin-bottom: 0.4rem;
          text-shadow: 0 2px 16px rgba(0,0,0,0.7);
          animation: popIn .5s cubic-bezier(.34,1.56,.64,1) both;
        }
        .ms { color: #d4a96a; font-size: 1rem; margin-bottom: 2rem; opacity: .9; }
        .bg { display: flex; flex-direction: column; gap: 1rem; }
        .qb {
          background: linear-gradient(135deg, #7a4010, #4a2208);
          color: #ffe0a0; border: 2.5px solid #c07030;
          border-radius: 16px; padding: 1.1rem 1.5rem;
          font-family: 'Rubik', sans-serif; font-weight: 700; font-size: 1.1rem;
          cursor: pointer; transition: transform .15s, box-shadow .15s;
          box-shadow: 0 4px 18px rgba(180,80,0,.35);
        }
        .qb:hover { transform: translateY(-4px) scale(1.03); box-shadow: 0 8px 28px rgba(180,80,0,.55); }
        .qb:active { transform: scale(.97); }

        .mo {
          position: fixed; inset: 0;
          background: rgba(20,8,0,.82); backdrop-filter: blur(7px);
          display: flex; align-items: center; justify-content: center;
          z-index: 100; animation: fadeIn .2s ease both; padding: 1rem;
        }
        .mb {
          background: linear-gradient(160deg, #4a2208, #7a3810);
          border: 3px solid #c07030; border-radius: 24px;
          padding: 2.5rem 1.8rem; max-width: 380px; width: 100%;
          text-align: center;
          box-shadow: 0 0 60px rgba(200,100,0,.3), 0 16px 48px rgba(0,0,0,.7);
          animation: popIn .3s cubic-bezier(.34,1.56,.64,1) both;
        }
        .me { font-size: 3.5rem; margin-bottom: .75rem; }
        .mtt {
          font-family: 'Caveat', cursive; font-size: 1.7rem; font-weight: 700;
          color: #ffe0a0; margin-bottom: .6rem;
        }
        .mm { font-size: 1.3rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem; text-shadow: 0 1px 6px rgba(0,0,0,.5); }
        .mc {
          background: linear-gradient(135deg, #c07030, #7a4010);
          color: #fff; border: 2px solid #e09050; border-radius: 12px;
          padding: .65rem 1.5rem; font-family: 'Rubik', sans-serif;
          font-weight: 700; font-size: .95rem; cursor: pointer;
          transition: transform .15s; box-shadow: 0 4px 14px rgba(180,80,0,.35);
        }
        .mc:hover { transform: scale(1.06); }
        .ab {
          background: linear-gradient(135deg, #3b1f0a, #5c3010);
          color: #ffe0a0; border: 2px solid #a06030;
          border-radius: 12px; padding: .85rem 1.2rem;
          font-family: 'Rubik', sans-serif; font-weight: 700; font-size: 1rem;
          cursor: pointer; transition: transform .15s, background .15s;
        }
        .ab:hover { background: linear-gradient(135deg, #7a4010, #a05020); transform: scale(1.04); }
        .ab:active { transform: scale(.97); }

        @keyframes floatP {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-18px) rotate(5deg); }
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(.7); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
