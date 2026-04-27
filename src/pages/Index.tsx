import { useState } from "react";

type ModalInfo = {
  title: string;
  message: string;
  emoji: string;
};

const modals: Record<string, ModalInfo> = {
  gd: {
    title: "ГД — это...",
    message: "Гд понос",
    emoji: "💩",
  },
  undertale: {
    title: "Андертейл — это...",
    message: "Тоже самое что с гд",
    emoji: "💀",
  },
  roblox: {
    title: "Нулс — это...",
    message: "Ты правда любишь нулс? Тогда заходи в него.",
    emoji: "🎮",
  },
};

export default function Index() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const modal = activeModal ? modals[activeModal] : null;

  return (
    <div className="page-wrapper">
      <div className="cucumbers-bg" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => (
          <span key={i} className="cucumber-float" style={{
            left: `${(i * 37 + 5) % 95}%`,
            top: `${(i * 53 + 10) % 90}%`,
            animationDelay: `${(i * 0.4) % 4}s`,
            fontSize: `${1.2 + (i % 3) * 0.6}rem`,
            opacity: 0.18 + (i % 4) * 0.07,
          }}>🥒</span>
        ))}
      </div>

      <div className="main-card">
        <div className="hero-img-wrap">
          <img
            src="https://cdn.poehali.dev/projects/e87ddbd1-cd5c-4ae2-9444-587f5752c268/files/ba2f521e-db8d-405d-855c-1e6fe8a4d967.jpg"
            alt="Огурец"
            className="hero-img"
          />
        </div>

        <h1 className="main-title">🎮 ИГРОВОЙ ПОРТАЛ 🥒</h1>
        <p className="main-sub">Нажми кнопку и узнай правду!</p>

        <div className="buttons-row">
          <button className="game-btn btn-red" onClick={() => setActiveModal("gd")}>
            <span className="btn-icon">😈</span>
            Ты любишь ГД?
          </button>

          <button className="game-btn btn-blue" onClick={() => setActiveModal("undertale")}>
            <span className="btn-icon">❤️</span>
            Ты любишь Андертейл?
          </button>

          <button className="game-btn btn-yellow" onClick={() => setActiveModal("roblox")}>
            <span className="btn-icon">⭐</span>
            Ты любишь Нулс?
          </button>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-emoji">{modal.emoji}</div>
            <h2 className="modal-title">{modal.title}</h2>
            <p className="modal-msg">{modal.message}</p>
            <button className="modal-close" onClick={() => setActiveModal(null)}>
              Закрыть ✕
            </button>
          </div>
        </div>
      )}

      <style>{`
        .page-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a7a1a 0%, #2eb82e 40%, #3ddc3d 70%, #1f9e1f 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Rubik', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .cucumbers-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        .cucumber-float {
          position: absolute;
          animation: floatCucumber 6s ease-in-out infinite;
          user-select: none;
        }

        @keyframes floatCucumber {
          0%, 100% { transform: translateY(0px) rotate(-10deg); }
          50% { transform: translateY(-18px) rotate(10deg); }
        }

        .main-card {
          position: relative;
          z-index: 1;
          background: rgba(0, 60, 0, 0.78);
          backdrop-filter: blur(12px);
          border: 3px solid #7fff7f;
          border-radius: 28px;
          padding: 2.5rem 2rem;
          max-width: 520px;
          width: 90%;
          box-shadow: 0 0 60px rgba(0,255,0,0.25), 0 8px 32px rgba(0,0,0,0.4);
          text-align: center;
          animation: popIn 0.5s cubic-bezier(.34,1.56,.64,1) both;
        }

        @keyframes popIn {
          from { transform: scale(0.7); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .hero-img-wrap {
          margin: 0 auto 1rem;
          width: 110px;
          height: 110px;
          border-radius: 50%;
          overflow: hidden;
          border: 4px solid #7fff7f;
          box-shadow: 0 0 20px rgba(100,255,100,0.5);
        }

        .hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .main-title {
          font-family: 'Caveat', cursive;
          font-size: 2.2rem;
          font-weight: 700;
          color: #ccffcc;
          margin-bottom: 0.3rem;
          text-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }

        .main-sub {
          color: #a8ffb0;
          font-size: 1rem;
          margin-bottom: 2rem;
          opacity: 0.85;
        }

        .buttons-row {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .game-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          border-radius: 16px;
          font-family: 'Rubik', sans-serif;
          font-size: 1.05rem;
          font-weight: 700;
          border: 3px solid transparent;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
          justify-content: center;
        }

        .game-btn:hover {
          transform: scale(1.05) translateY(-2px);
        }

        .game-btn:active {
          transform: scale(0.97);
        }

        .btn-icon {
          font-size: 1.4rem;
        }

        .btn-red {
          background: linear-gradient(135deg, #ff4444, #cc1111);
          color: #fff;
          border-color: #ff8888;
          box-shadow: 0 4px 16px rgba(255,50,50,0.4);
        }

        .btn-blue {
          background: linear-gradient(135deg, #4488ff, #1133cc);
          color: #fff;
          border-color: #88aaff;
          box-shadow: 0 4px 16px rgba(50,100,255,0.4);
        }

        .btn-yellow {
          background: linear-gradient(135deg, #ffcc00, #ff9900);
          color: #2a1a00;
          border-color: #ffe066;
          box-shadow: 0 4px 16px rgba(255,180,0,0.4);
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 40, 0, 0.75);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          animation: fadeIn 0.2s ease both;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-box {
          background: linear-gradient(160deg, #0a4a0a, #1a6e1a);
          border: 3px solid #7fff7f;
          border-radius: 24px;
          padding: 2.5rem 2rem;
          max-width: 360px;
          width: 88%;
          text-align: center;
          box-shadow: 0 0 60px rgba(0,255,60,0.3), 0 16px 48px rgba(0,0,0,0.6);
          animation: popIn 0.3s cubic-bezier(.34,1.56,.64,1) both;
        }

        .modal-emoji {
          font-size: 3.5rem;
          margin-bottom: 0.75rem;
          animation: wiggle 0.5s ease;
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-15deg); }
          75% { transform: rotate(15deg); }
        }

        .modal-title {
          font-family: 'Caveat', cursive;
          font-size: 1.5rem;
          color: #ccffcc;
          margin-bottom: 0.75rem;
        }

        .modal-msg {
          font-size: 1.2rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 1.5rem;
          text-shadow: 0 1px 6px rgba(0,0,0,0.5);
        }

        .modal-close {
          background: linear-gradient(135deg, #33cc33, #1a8a1a);
          color: #fff;
          border: 2px solid #7fff7f;
          border-radius: 12px;
          padding: 0.65rem 1.5rem;
          font-family: 'Rubik', sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 4px 14px rgba(50,200,50,0.35);
        }

        .modal-close:hover {
          transform: scale(1.06);
          box-shadow: 0 6px 20px rgba(50,200,50,0.5);
        }
      `}</style>
    </div>
  );
}
