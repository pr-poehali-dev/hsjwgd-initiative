import { useState, useEffect, useRef, useCallback } from "react";

const VSPLYSH_IMG = "https://cdn.poehali.dev/projects/e87ddbd1-cd5c-4ae2-9444-587f5752c268/files/8955bc32-c510-4e9d-92f8-53d515e173de.jpg";
const OGURCHIK_IMG = "https://cdn.poehali.dev/projects/e87ddbd1-cd5c-4ae2-9444-587f5752c268/files/ff26489d-9175-4142-8e78-4e7543885ec9.jpg";
const LUNTIK_IMG = "https://cdn.poehali.dev/projects/e87ddbd1-cd5c-4ae2-9444-587f5752c268/files/8a791d5d-298b-43b7-a662-4f7274c4516f.jpg";
const MUSIC_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

const SHOP_ITEMS = [
  { id: "kastrul",  name: "Кастрюля",      price: 50,  emoji: "🪣", desc: "кастрюля." },
  { id: "multivar", name: "Мультиварка",   price: 125, emoji: "🍲", desc: "очень полезная в готовке" },
  { id: "nozh",     name: "Нож",           price: 175, emoji: "🔪", desc: "очень опасен не только в нападении, но и при резке чего либо" },
  { id: "tv",       name: "Телевизор",     price: 275, emoji: "📺", desc: "всегда весело посмотреть телевизор вечером!" },
  { id: "ruchka",   name: "Ручка Вспыша", price: 666, emoji: "✒️", desc: "ЭКСКЛЮЗИВ!" },
];

const UPGRADES = [
  { id: "click", name: "+1 монета за клик",    basePrice: 25, desc: "Каждый клик приносит больше монет" },
  { id: "auto",  name: "+1 монета в секунду",  basePrice: 50, desc: "Монеты приходят автоматически" },
];

function getUpgradePrice(basePrice: number, level: number) {
  return Math.floor(basePrice * Math.pow(1.5, level));
}

function getCharacter(clicks: number) {
  if (clicks >= 350) return { img: LUNTIK_IMG,   name: "Лунтик",  color: "#b266ff" };
  if (clicks >= 100) return { img: OGURCHIK_IMG, name: "Огурчик", color: "#44cc44" };
  return                     { img: VSPLYSH_IMG,  name: "Вспыш",   color: "#ffcc00" };
}

type Tab = "main" | "earn" | "shop" | "settings";

export default function Index() {
  const [tab, setTab] = useState<Tab>("main");
  const [coins, setCoins] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [charClicks, setCharClicks] = useState(0);
  const [clickLevel, setClickLevel] = useState(0);
  const [autoLevel, setAutoLevel] = useState(0);
  const [purchased, setPurchased] = useState<string[]>([]);
  const [music, setMusic] = useState(true);
  const [clickAnim, setClickAnim] = useState(false);
  const [plusAnims, setPlusAnims] = useState<{ id: number; x: number; y: number }[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animIdRef = useRef(0);

  useEffect(() => {
    const audio = new Audio(MUSIC_URL);
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;
    audio.play().catch(() => {});
    return () => { audio.pause(); };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    if (music) { audioRef.current.play().catch(() => {}); }
    else { audioRef.current.pause(); }
  }, [music]);

  useEffect(() => {
    if (autoLevel === 0) return;
    const interval = setInterval(() => {
      setCoins((c) => c + autoLevel);
    }, 1000);
    return () => clearInterval(interval);
  }, [autoLevel]);

  const handleCharClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const perClick = 1 + clickLevel;
    setCoins((c) => c + perClick);
    setTotalClicks((t) => t + 1);
    setCharClicks((c) => c + 1);
    setClickAnim(true);
    setTimeout(() => setClickAnim(false), 120);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = animIdRef.current++;
    setPlusAnims((a) => [...a, { id, x, y }]);
    setTimeout(() => setPlusAnims((a) => a.filter((p) => p.id !== id)), 800);
  }, [clickLevel]);

  const buyUpgrade = (id: string) => {
    const upg = UPGRADES.find((u) => u.id === id)!;
    const level = id === "click" ? clickLevel : autoLevel;
    if (level >= 5) return;
    const price = getUpgradePrice(upg.basePrice, level);
    if (coins < price) return;
    setCoins((c) => c - price);
    if (id === "click") setClickLevel((l) => l + 1);
    else setAutoLevel((l) => l + 1);
  };

  const buyItem = (itemId: string, price: number) => {
    if (purchased.includes(itemId) || coins < price) return;
    setCoins((c) => c - price);
    setPurchased((p) => [...p, itemId]);
  };

  const char = getCharacter(charClicks);

  return (
    <div className="pw">
      {/* Coin background */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {Array.from({ length: 35 }).map((_, i) => (
          <span key={i} style={{
            position: "absolute",
            left: `${(i * 41 + 7) % 97}%`,
            top: `${(i * 59 + 13) % 95}%`,
            fontSize: `${1.1 + (i % 4) * 0.5}rem`,
            opacity: 0.12 + (i % 6) * 0.04,
            animation: `floatC ${4 + (i % 5)}s ease-in-out infinite`,
            animationDelay: `${(i * 0.3) % 6}s`,
            userSelect: "none",
          }}>🪙</span>
        ))}
      </div>

      {/* Coin badge */}
      <div style={{ position: "fixed", top: "1rem", right: "1rem", zIndex: 200 }}>
        <span className="coin-badge">🪙 {coins.toLocaleString()}</span>
      </div>

      <div className="pc">
        {/* Main menu */}
        {tab === "main" && (
          <div className="menu">
            <h1 className="mt">💰 МОНЕТНЫЙ КЛИКЕР 💰</h1>
            <p className="ms">Зарабатывай монеты и покупай всё подряд!</p>
            <div className="mbg">
              <button className="mb" onClick={() => setTab("earn")}>Заработок 🤑</button>
              <button className="mb" onClick={() => setTab("shop")}>Магазин 🛒</button>
              <button className="mb" onClick={() => setTab("settings")}>Настройки ⚙️</button>
            </div>
          </div>
        )}

        {/* Earn tab */}
        {tab === "earn" && (
          <div className="earn-view">
            <button className="back-btn" onClick={() => setTab("main")}>← Назад</button>
            <div className="stats-row">
              <span>🪙 {coins.toLocaleString()}</span>
              <span>👆 {totalClicks} кликов</span>
              <span>⚡ +{1 + clickLevel}/клик</span>
              {autoLevel > 0 && <span>⏱ +{autoLevel}/сек</span>}
            </div>

            <div className="char-wrap">
              <p className="char-label" style={{ color: char.color }}>{char.name}</p>
              {charClicks < 100 && <p className="char-hint">ещё {100 - charClicks} кликов до Огурчика</p>}
              {charClicks >= 100 && charClicks < 350 && <p className="char-hint">ещё {350 - charClicks} кликов до Лунтика</p>}
              {charClicks >= 350 && <p className="char-hint" style={{ color: "#b266ff" }}>Максимальный персонаж!</p>}
              <button
                className={`char-btn${clickAnim ? " clicked" : ""}`}
                onClick={handleCharClick}
                style={{ borderColor: char.color, boxShadow: `0 0 30px ${char.color}55` }}
              >
                <img src={char.img} alt={char.name} className="char-img" />
                {plusAnims.map((p) => (
                  <span key={p.id} className="plus-anim" style={{ left: p.x, top: p.y }}>
                    +{1 + clickLevel}
                  </span>
                ))}
              </button>
            </div>

            <div className="upg-section">
              <h3 className="upg-title">Улучшения</h3>
              {UPGRADES.map((upg) => {
                const level = upg.id === "click" ? clickLevel : autoLevel;
                const price = getUpgradePrice(upg.basePrice, level);
                const maxed = level >= 5;
                return (
                  <div key={upg.id} className="upg-card">
                    <div className="upg-info">
                      <span className="upg-name">{upg.name}</span>
                      <span className="upg-desc">{upg.desc}</span>
                      <div className="upg-stars">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} style={{ opacity: i < level ? 1 : 0.25 }}>⭐</span>
                        ))}
                      </div>
                    </div>
                    <button
                      className="upg-btn"
                      disabled={maxed || coins < price}
                      onClick={() => buyUpgrade(upg.id)}
                    >
                      {maxed ? "МАКС" : `🪙 ${price}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Shop tab */}
        {tab === "shop" && (
          <div className="shop-view">
            <button className="back-btn" onClick={() => setTab("main")}>← Назад</button>
            <h2 className="shop-title">🛒 Магазин</h2>
            <p className="ms" style={{ marginBottom: "1.2rem" }}>🪙 {coins.toLocaleString()} монет</p>
            <div className="items-list">
              {SHOP_ITEMS.map((item) => {
                const bought = purchased.includes(item.id);
                const canBuy = !bought && coins >= item.price;
                return (
                  <div key={item.id} className={`item-card${bought ? " bought" : ""}`}>
                    <span className="item-emoji">{item.emoji}</span>
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-desc">{item.desc}</span>
                    </div>
                    <button
                      className="buy-btn"
                      disabled={!canBuy && !bought}
                      onClick={() => buyItem(item.id, item.price)}
                      style={bought ? { background: "#2a8a2a", borderColor: "#44ff44", cursor: "default" } : {}}
                    >
                      {bought ? "✅ Куплено" : `🪙 ${item.price}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Settings tab */}
        {tab === "settings" && (
          <div className="settings-view">
            <button className="back-btn" onClick={() => setTab("main")}>← Назад</button>
            <h2 className="shop-title">⚙️ Настройки</h2>
            <div className="set-card">
              <span className="set-label">🎵 Музыка</span>
              <button
                className={`toggle-btn${music ? " on" : " off"}`}
                onClick={() => setMusic((m) => !m)}
              >
                {music ? "Включена" : "Выключена"}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;700;900&family=Caveat:wght@700&display=swap');
        * { box-sizing: border-box; }

        .pw {
          min-height: 100vh;
          background: radial-gradient(ellipse at 50% 0%, #7a5c00 0%, #3d2e00 45%, #1a1200 100%);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Rubik', sans-serif;
          position: relative; overflow: hidden; padding: 1rem;
        }
        .pc { position: relative; z-index: 1; width: 100%; max-width: 500px; text-align: center; }

        .coin-badge {
          background: rgba(0,0,0,.6); backdrop-filter: blur(8px);
          border: 2px solid #f5c518; border-radius: 20px;
          padding: .4rem 1rem; color: #f5c518; font-weight: 700; font-size: 1.1rem;
        }

        .mt { font-family:'Caveat',cursive; font-size:2.5rem; color:#f5c518; margin-bottom:.3rem; text-shadow:0 2px 16px rgba(0,0,0,.7); }
        .ms { color:#c9a840; font-size:1rem; margin-bottom:2rem; opacity:.9; }
        .menu { animation: popIn .4s cubic-bezier(.34,1.56,.64,1) both; }
        .mbg { display:flex; flex-direction:column; gap:1rem; }
        .mb {
          background: linear-gradient(135deg,#7a5c00,#4a3800);
          color:#f5c518; border:2.5px solid #c9a840; border-radius:18px;
          padding:1.1rem 1.5rem; font-family:'Rubik',sans-serif;
          font-weight:700; font-size:1.2rem; cursor:pointer;
          transition:transform .15s, box-shadow .15s;
          box-shadow:0 4px 20px rgba(200,160,0,.3);
        }
        .mb:hover { transform:translateY(-4px) scale(1.03); box-shadow:0 8px 30px rgba(245,197,24,.4); }
        .mb:active { transform:scale(.97); }

        .back-btn {
          background:rgba(0,0,0,.4); color:#f5c518; border:2px solid #7a5c00;
          border-radius:12px; padding:.5rem 1.1rem; font-family:'Rubik',sans-serif;
          font-weight:700; cursor:pointer; margin-bottom:1rem; transition:transform .15s; font-size:.95rem;
        }
        .back-btn:hover { transform:scale(1.05); }

        .earn-view { animation: popIn .35s cubic-bezier(.34,1.56,.64,1) both; }
        .stats-row {
          display:flex; flex-wrap:wrap; gap:.5rem; justify-content:center; margin-bottom:1.2rem;
        }
        .stats-row span {
          background:rgba(0,0,0,.45); border:1.5px solid #7a5c00;
          border-radius:12px; padding:.35rem .8rem; color:#f5c518; font-size:.9rem; font-weight:700;
        }

        .char-wrap { position:relative; margin-bottom:1.5rem; }
        .char-label { font-family:'Caveat',cursive; font-size:1.8rem; font-weight:700; margin-bottom:.2rem; }
        .char-hint { color:#c9a840; font-size:.85rem; margin-bottom:.5rem; opacity:.8; }
        .char-btn {
          position:relative; background:rgba(0,0,0,.4);
          border:3px solid #f5c518; border-radius:50%;
          width:180px; height:180px; margin:0 auto; display:block;
          cursor:pointer; transition:transform .1s; overflow:hidden;
        }
        .char-btn.clicked { transform:scale(.88) !important; }
        .char-btn:hover { transform:scale(1.06); }
        .char-img { width:100%; height:100%; object-fit:cover; border-radius:50%; display:block; }

        .plus-anim {
          position:absolute; pointer-events:none;
          color:#f5c518; font-weight:900; font-size:1.4rem;
          text-shadow:0 2px 8px rgba(0,0,0,.8);
          animation:floatUp .8s ease forwards;
          transform:translate(-50%,-50%);
        }

        .upg-section { text-align:left; }
        .upg-title { color:#f5c518; font-family:'Caveat',cursive; font-size:1.5rem; margin-bottom:.8rem; text-align:center; }
        .upg-card {
          background:rgba(0,0,0,.4); border:2px solid #7a5c00; border-radius:16px;
          padding:1rem 1.2rem; margin-bottom:.75rem;
          display:flex; align-items:center; gap:1rem;
        }
        .upg-info { flex:1; }
        .upg-name { display:block; color:#f5c518; font-weight:700; font-size:1rem; }
        .upg-desc { display:block; color:#c9a840; font-size:.8rem; opacity:.8; margin:.2rem 0; }
        .upg-stars { font-size:.9rem; }
        .upg-btn {
          background:linear-gradient(135deg,#7a5c00,#4a3800);
          color:#f5c518; border:2px solid #c9a840; border-radius:12px;
          padding:.55rem .9rem; font-weight:700; font-size:.9rem; cursor:pointer;
          white-space:nowrap; transition:transform .12s; min-width:80px;
        }
        .upg-btn:hover:not(:disabled) { transform:scale(1.07); }
        .upg-btn:disabled { opacity:.45; cursor:not-allowed; }

        .shop-view { animation:popIn .35s cubic-bezier(.34,1.56,.64,1) both; }
        .shop-title { font-family:'Caveat',cursive; font-size:2rem; color:#f5c518; margin-bottom:.5rem; }
        .items-list { display:flex; flex-direction:column; gap:.75rem; }
        .item-card {
          background:rgba(0,0,0,.4); border:2px solid #7a5c00; border-radius:16px;
          padding:1rem 1.2rem; display:flex; align-items:center; gap:1rem; transition:border-color .2s;
        }
        .item-card.bought { border-color:#44cc44; }
        .item-emoji { font-size:2rem; flex-shrink:0; }
        .item-info { flex:1; text-align:left; }
        .item-name { display:block; color:#f5c518; font-weight:700; font-size:1rem; }
        .item-desc { display:block; color:#c9a840; font-size:.82rem; opacity:.85; margin-top:.2rem; }
        .buy-btn {
          background:linear-gradient(135deg,#7a5c00,#4a3800);
          color:#f5c518; border:2px solid #c9a840; border-radius:12px;
          padding:.55rem .9rem; font-weight:700; font-size:.9rem; cursor:pointer;
          white-space:nowrap; transition:transform .12s; min-width:90px;
        }
        .buy-btn:hover:not(:disabled) { transform:scale(1.07); }
        .buy-btn:disabled { opacity:.45; cursor:not-allowed; }

        .settings-view { animation:popIn .35s cubic-bezier(.34,1.56,.64,1) both; }
        .set-card {
          background:rgba(0,0,0,.4); border:2px solid #7a5c00; border-radius:16px;
          padding:1.2rem 1.5rem; display:flex; align-items:center; justify-content:space-between; margin-top:1rem;
        }
        .set-label { color:#f5c518; font-weight:700; font-size:1.1rem; }
        .toggle-btn {
          border-radius:12px; padding:.6rem 1.3rem; font-weight:700; font-size:1rem;
          cursor:pointer; border:2px solid; transition:transform .12s;
        }
        .toggle-btn.on  { background:#2a5a2a; color:#44ff44; border-color:#44ff44; }
        .toggle-btn.off { background:#5a1a1a; color:#ff6666; border-color:#ff6666; }
        .toggle-btn:hover { transform:scale(1.06); }

        @keyframes floatC {
          0%,100% { transform:translateY(0) rotate(-8deg); }
          50% { transform:translateY(-20px) rotate(8deg); }
        }
        @keyframes floatUp {
          0%   { opacity:1; transform:translate(-50%,-50%); }
          100% { opacity:0; transform:translate(-50%,-130%); }
        }
        @keyframes popIn {
          0%   { opacity:0; transform:scale(.75); }
          100% { opacity:1; transform:scale(1); }
        }
      `}</style>
    </div>
  );
}
