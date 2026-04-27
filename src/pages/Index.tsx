import { useState } from "react";

type ModalState =
  | { type: "simple"; title: string; message: string; emoji: string }
  | { type: "vspysh" }
  | { type: "result"; correct: boolean };

const cards = [
  { id: "gd",        emoji: "😈", question: "ГД что это?",           border: "#ff7777", glow: "rgba(255,50,50,0.35)" },
  { id: "undertale", emoji: "❤️", question: "Андертейл что это?",    border: "#7799ff", glow: "rgba(50,100,255,0.35)" },
  { id: "roblox",    emoji: "⭐", question: "Нулс что это?",          border: "#ffd700", glow: "rgba(255,180,0,0.35)" },
  { id: "vspysh",    emoji: "⚡", question: "Что такое Вспыш?",       border: "#cc77ff", glow: "rgba(180,50,255,0.35)" },
];

export default function Index() {
  const [modal, setModal] = useState<ModalState | null>(null);

  function openCard(id: string) {
    if (id === "gd")        setModal({ type: "simple", emoji: "💩", title: "ГД — это...", message: "гд понос удали его" });
    if (id === "undertale") setModal({ type: "simple", emoji: "📉", title: "Андертейл — это...", message: "андертейл скатился, и тоже понос" });
    if (id === "roblox")    setModal({ type: "simple", emoji: "🏆", title: "Нулс — это...", message: "нулс лучше гд и андертейл" });
    if (id === "vspysh")    setModal({ type: "vspysh" });
  }

  return (
    <div className="pw">
      {/* Floating cucumbers */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {Array.from({ length: 22 }).map((_, i) => (
          <span key={i} style={{
            position: "absolute",
            left: `${(i * 41 + 3) % 96}%`,
            top: `${(i * 57 + 8) % 92}%`,
            animationDelay: `${(i * 0.35) % 5}s`,
            fontSize: `${1.1 + (i % 4) * 0.55}rem`,
            opacity: 0.15 + (i % 5) * 0.06,
            animation: "floatC 6s ease-in-out infinite",
            userSelect: "none",
          }}>🥒</span>
        ))}
      </div>

      <div className="pc">
        <h1 className="mt">🥒 ИГРОВОЙ ПОРТАЛ 🥒</h1>
        <p className="ms">Нажми на карточку и узнай правду!</p>

        <div className="cg">
          {cards.map((card) => (
            <button key={card.id} className="gc" onClick={() => openCard(card.id)}
              style={{ borderColor: card.border, boxShadow: `0 4px 24px ${card.glow}` }}>
              <span style={{ fontSize: "2.6rem", animation: "wigC 2.5s ease-in-out infinite" }}>{card.emoji}</span>
              <span className="ct">{card.question}</span>
              <span className="ch">Нажми, чтобы узнать →</span>
            </button>
          ))}
        </div>
      </div>

      {/* Simple modal */}
      {modal?.type === "simple" && (
        <div className="mo" onClick={() => setModal(null)}>
          <div className="mb" onClick={(e) => e.stopPropagation()}>
            <div className="me">{modal.emoji}</div>
            <h2 className="mtt">{modal.title}</h2>
            <p className="mm">{modal.message}</p>
            <button className="mc" onClick={() => setModal(null)}>Закрыть ✕</button>
          </div>
        </div>
      )}

      {/* Vspysh modal */}
      {modal?.type === "vspysh" && (
        <div className="mo" onClick={() => setModal(null)}>
          <div className="mb" onClick={(e) => e.stopPropagation()}>
            <div className="me">⚡</div>
            <h2 className="mtt">Вспыш — это...</h2>
            <p className="mm" style={{ fontSize: "0.95rem", opacity: 0.8 }}>Выбери правильный ответ:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.75rem" }}>
              <button className="vb vbad" onClick={() => setModal({ type: "result", correct: false })}>
                💩 вспыш это говно
              </button>
              <button className="vb vgood" onClick={() => setModal({ type: "result", correct: true })}>
                👑 вспыш это имба
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result modal */}
      {modal?.type === "result" && (
        <div className="mo" onClick={() => setModal(null)}>
          <div className="mb" style={modal.correct
            ? { borderColor: "#44ff44", background: "linear-gradient(160deg,#074a07,#0f7a0f)" }
            : { borderColor: "#ff4444", background: "linear-gradient(160deg,#4a0707,#7a1010)" }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: "4rem", marginBottom: "0.5rem" }}>{modal.correct ? "✅" : "❌"}</div>
            <p style={{ fontFamily: "'Caveat',cursive", fontSize: "2.4rem", fontWeight: 700, color: "#fff", margin: "0 0 1.5rem" }}>
              {modal.correct ? "ПРАВИЛЬНО!!" : "НЕПРАВИЛЬНО!"}
            </p>
            <button className="mc" onClick={() => setModal(null)}>Закрыть ✕</button>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;700;900&family=Caveat:wght@700&display=swap');

        .pw {
          min-height: 100vh;
          background: linear-gradient(135deg, #145214 0%, #1f8c1f 40%, #28c228 70%, #166816 100%);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Rubik', sans-serif;
          position: relative; overflow: hidden; padding: 2rem 1rem;
        }
        .pc { position: relative; z-index: 1; width: 100%; max-width: 640px; text-align: center; }
        .mt {
          font-family: 'Caveat', cursive; font-size: 2.4rem; font-weight: 700;
          color: #ccffcc; margin-bottom: 0.4rem;
          text-shadow: 0 2px 12px rgba(0,0,0,0.5);
          animation: popIn .5s cubic-bezier(.34,1.56,.64,1) both;
        }
        .ms { color: #a8ffb0; font-size: 1rem; margin-bottom: 2rem; opacity: .85; animation: popIn .5s .1s cubic-bezier(.34,1.56,.64,1) both; }
        .cg { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        @media(max-width:480px){ .cg { grid-template-columns: 1fr; } }
        .gc {
          background: rgba(0,50,0,.72); backdrop-filter: blur(10px);
          border: 2.5px solid transparent; border-radius: 20px;
          padding: 1.6rem 1rem; cursor: pointer;
          display: flex; flex-direction: column; align-items: center; gap: .5rem;
          transition: transform .18s, box-shadow .18s;
          animation: popIn .5s cubic-bezier(.34,1.56,.64,1) both;
        }
        .gc:hover { transform: translateY(-6px) scale(1.04); }
        .gc:active { transform: scale(.97); }
        .ct { font-weight: 700; font-size: 1.05rem; color: #e8ffe8; line-height: 1.3; }
        .ch { font-size: .75rem; color: #7dff7d; opacity: .7; }

        .mo {
          position: fixed; inset: 0;
          background: rgba(0,30,0,.78); backdrop-filter: blur(7px);
          display: flex; align-items: center; justify-content: center;
          z-index: 100; animation: fadeIn .2s ease both; padding: 1rem;
        }
        .mb {
          background: linear-gradient(160deg, #0b4a0b, #1b701b);
          border: 3px solid #7fff7f; border-radius: 24px;
          padding: 2.5rem 1.8rem; max-width: 360px; width: 100%;
          text-align: center;
          box-shadow: 0 0 60px rgba(0,255,60,.3), 0 16px 48px rgba(0,0,0,.6);
          animation: popIn .3s cubic-bezier(.34,1.56,.64,1) both;
        }
        .me { font-size: 3.5rem; margin-bottom: .75rem; animation: wigC .5s ease; }
        .mtt { font-family: 'Caveat', cursive; font-size: 1.5rem; color: #ccffcc; margin-bottom: .6rem; }
        .mm { font-size: 1.15rem; font-weight: 700; color: #fff; margin-bottom: 1.5rem; text-shadow: 0 1px 6px rgba(0,0,0,.5); }
        .mc {
          background: linear-gradient(135deg, #33cc33, #1a8a1a);
          color: #fff; border: 2px solid #7fff7f; border-radius: 12px;
          padding: .65rem 1.5rem; font-family: 'Rubik', sans-serif;
          font-weight: 700; font-size: .95rem; cursor: pointer;
          transition: transform .15s; box-shadow: 0 4px 14px rgba(50,200,50,.35);
        }
        .mc:hover { transform: scale(1.06); }

        .vb {
          padding: .9rem 1.2rem; border-radius: 14px;
          font-family: 'Rubik', sans-serif; font-weight: 700; font-size: 1rem;
          cursor: pointer; border: 2.5px solid transparent;
          transition: transform .15s;
        }
        .vb:hover { transform: scale(1.05); }
        .vb:active { transform: scale(.97); }
        .vbad {
          background: linear-gradient(135deg, #cc2222, #881111);
          color: #fff; border-color: #ff6666;
          box-shadow: 0 4px 16px rgba(200,30,30,.4);
        }
        .vgood {
          background: linear-gradient(135deg, #ffcc00, #ff8800);
          color: #2a1500; border-color: #ffe066;
          box-shadow: 0 4px 16px rgba(255,160,0,.4);
        }

        @keyframes popIn {
          from { transform: scale(.7); opacity: 0; }
          to   { transform: scale(1);  opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes floatC {
          0%,100% { transform: translateY(0) rotate(-10deg); }
          50%     { transform: translateY(-20px) rotate(12deg); }
        }
        @keyframes wigC {
          0%,100% { transform: rotate(-5deg); }
          50%     { transform: rotate(5deg); }
        }
      `}</style>
    </div>
  );
}
