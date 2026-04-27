import { useState, useEffect, useRef, useCallback } from "react";

const VSPLYSH_IMG  = "https://cdn.poehali.dev/projects/e87ddbd1-cd5c-4ae2-9444-587f5752c268/files/8955bc32-c510-4e9d-92f8-53d515e173de.jpg";
const OGURCHIK_IMG = "https://cdn.poehali.dev/projects/e87ddbd1-cd5c-4ae2-9444-587f5752c268/files/ff26489d-9175-4142-8e78-4e7543885ec9.jpg";
const LUNTIK_IMG   = "https://cdn.poehali.dev/projects/e87ddbd1-cd5c-4ae2-9444-587f5752c268/files/8a791d5d-298b-43b7-a662-4f7274c4516f.jpg";
const RYG_IMG      = "https://cdn.poehali.dev/projects/e87ddbd1-cd5c-4ae2-9444-587f5752c268/files/555ac2d9-15c7-4ca6-b903-7a86d2de8717.jpg";
const MUSIC_URL    = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
const SAVE_KEY     = "moneta_save_v2";

const NEWS = [
  { date: "27.04.2025", title: "Новый персонаж — Рыг!", text: "После 700 кликов на Лунтика появится Рыг — самый крутой персонаж в игре." },
  { date: "27.04.2025", title: "Очки добавлены в магазин", text: "Купи очки за 128 монет и получай в 1.2 раза больше монет за каждый клик!" },
  { date: "27.04.2025", title: "Раздел Новости", text: "Теперь в главном меню есть вкладка Новости — здесь ты всегда узнаешь, что добавили в игру." },
  { date: "27.04.2025", title: "Сохранения", text: "Прогресс теперь сохраняется автоматически. Можешь закрыть вкладку и вернуться позже!" },
  { date: "27.04.2025", title: "Раздел Ачивки", text: "За каждую покупку в магазине теперь выдаётся уникальная ачивка. Собери их все!" },
];

const SHOP_ITEMS = [
  { id: "kastrul",  name: "Кастрюля",      price: 50,  emoji: "🪣", desc: "кастрюля.",                                                    boost: 1,   achiev: { title: "Это не ведро!",         desc: "купи кастрюлю" } },
  { id: "ochki",    name: "Очки",          price: 128, emoji: "👓", desc: "У тебя зрение ниже нормы?",                                    boost: 1.2, achiev: { title: "Четыре глаза!",         desc: "купи очки" } },
  { id: "multivar", name: "Мультиварка",   price: 125, emoji: "🍲", desc: "очень полезная в готовке",                                     boost: 1,   achiev: { title: "сам варить не умеешь?", desc: "купи мультиварку" } },
  { id: "nozh",     name: "Нож",           price: 175, emoji: "🔪", desc: "очень опасен не только в нападении, но и при резке чего либо", boost: 1,   achiev: { title: "ты осторожней будь!",   desc: "купи нож" } },
  { id: "tv",       name: "Телевизор",     price: 275, emoji: "📺", desc: "всегда весело посмотреть телевизор вечером!",                  boost: 1,   achiev: { title: "любишь залипать?",      desc: "купи телек" } },
  { id: "ruchka",   name: "Ручка Вспыша", price: 666, emoji: "✒️", desc: "ЭКСКЛЮЗИВ!",                                                   boost: 1,   achiev: { title: "И ЧУДО МАШИНКИ!",       desc: "купи ручку вспыша" } },
];

const ALL_ACHIEVS = SHOP_ITEMS.map((i) => ({ id: i.id, ...i.achiev, emoji: i.emoji }));

const UPGRADES = [
  { id: "click", name: "+1 монета за клик",   basePrice: 25, desc: "Каждый клик приносит больше монет" },
  { id: "auto",  name: "+1 монета в секунду", basePrice: 50, desc: "Монеты приходят автоматически" },
];

const SPLASH_EMOJIS = ["💰","🤑","💰","🤑","💰","💰","🤑","💰","🤑","💰","💰","🤑","💰","🤑","💰","🤑","💰","💰","🤑","💰"];

function getUpgradePrice(basePrice: number, level: number) {
  return Math.floor(basePrice * Math.pow(1.5, level));
}

function getCharacter(clicks: number) {
  if (clicks >= 700) return { img: RYG_IMG,      name: "Рыг",     color: "#ff4da6" };
  if (clicks >= 350) return { img: LUNTIK_IMG,   name: "Лунтик",  color: "#b266ff" };
  if (clicks >= 100) return { img: OGURCHIK_IMG, name: "Огурчик", color: "#44cc44" };
  return                     { img: VSPLYSH_IMG,  name: "Вспыш",   color: "#ffcc00" };
}

type Tab = "main" | "earn" | "shop" | "settings" | "achievs" | "news";

interface SaveData {
  coins: number; totalClicks: number; charClicks: number;
  clickLevel: number; autoLevel: number; purchased: string[]; music: boolean;
}

function loadSave(): Partial<SaveData> {
  try { return JSON.parse(localStorage.getItem(SAVE_KEY) || "{}"); }
  catch { return {}; }
}

// ── Splash screen ──────────────────────────────────────────────
function SplashScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 2800;
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, 200);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <div className="splash">
      <div className="splash-emojis">
        {SPLASH_EMOJIS.map((e, i) => (
          <span key={i} className="splash-emoji" style={{
            animationDelay: `${(i * 0.15) % 2}s`,
            fontSize: `${2 + (i % 3) * 0.8}rem`,
          }}>{e}</span>
        ))}
      </div>
      <div className="splash-center">
        <div className="splash-title">💰 МОНЕТНЫЙ КЛИКЕР 💰</div>
        <div className="splash-sub">Загружаем монеты...</div>
        <div className="splash-bar-wrap">
          <div className="splash-bar-fill" style={{ width: `${progress * 100}%` }} />
        </div>
        <div className="splash-pct">{Math.round(progress * 100)}%</div>
      </div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────
export default function Index() {
  const [splashDone, setSplashDone] = useState(false);
  const saved = loadSave();

  const [tab, setTab]               = useState<Tab>("main");
  const [coins, setCoins]           = useState(saved.coins ?? 0);
  const [totalClicks, setTotal]     = useState(saved.totalClicks ?? 0);
  const [charClicks, setCharClicks] = useState(saved.charClicks ?? 0);
  const [clickLevel, setClickLevel] = useState(saved.clickLevel ?? 0);
  const [autoLevel, setAutoLevel]   = useState(saved.autoLevel ?? 0);
  const [purchased, setPurchased]   = useState<string[]>(saved.purchased ?? []);
  const [music, setMusic]           = useState(saved.music ?? true);
  const [clickAnim, setClickAnim]   = useState(false);
  const [plusAnims, setPlusAnims]   = useState<{ id: number; x: number; y: number; val: number }[]>([]);
  const [toast, setToast]           = useState<{ title: string; desc: string } | null>(null);
  const audioRef  = useRef<HTMLAudioElement | null>(null);
  const animIdRef = useRef(0);

  const hasOchki = purchased.includes("ochki");
  const clickBoost = hasOchki ? 1.2 : 1;

  useEffect(() => {
    const data: SaveData = { coins, totalClicks, charClicks, clickLevel, autoLevel, purchased, music };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  }, [coins, totalClicks, charClicks, clickLevel, autoLevel, purchased, music]);

  useEffect(() => {
    const audio = new Audio(MUSIC_URL);
    audio.loop = true; audio.volume = 0.3;
    audioRef.current = audio;
    if (music) audio.play().catch(() => {});
    return () => { audio.pause(); };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    if (music) audioRef.current.play().catch(() => {});
    else audioRef.current.pause();
  }, [music]);

  useEffect(() => {
    if (autoLevel === 0) return;
    const iv = setInterval(() => setCoins((c) => c + autoLevel), 1000);
    return () => clearInterval(iv);
  }, [autoLevel]);

  const handleCharClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const base = 1 + clickLevel;
    const earned = Math.round(base * clickBoost);
    setCoins((c) => c + earned);
    setTotal((t) => t + 1);
    setCharClicks((c) => c + 1);
    setClickAnim(true);
    setTimeout(() => setClickAnim(false), 120);
    const rect = e.currentTarget.getBoundingClientRect();
    const id = animIdRef.current++;
    setPlusAnims((a) => [...a, { id, x: e.clientX - rect.left, y: e.clientY - rect.top, val: earned }]);
    setTimeout(() => setPlusAnims((a) => a.filter((p) => p.id !== id)), 800);
  }, [clickLevel, clickBoost]);

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
    const item = SHOP_ITEMS.find((i) => i.id === itemId);
    if (item) {
      setToast(item.achiev);
      setTimeout(() => setToast(null), 3500);
    }
  };

  const char = getCharacter(charClicks);

  if (!splashDone) return <SplashScreen onDone={() => setSplashDone(true)} />;

  return (
    <div className="pw">
      {/* Floating coin bg */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0 }}>
        {Array.from({ length: 35 }).map((_, i) => (
          <span key={i} style={{
            position:"absolute",
            left:`${(i*41+7)%97}%`, top:`${(i*59+13)%95}%`,
            fontSize:`${1.1+(i%4)*0.5}rem`,
            opacity:0.12+(i%6)*0.04,
            animation:`floatC ${4+(i%5)}s ease-in-out infinite`,
            animationDelay:`${(i*0.3)%6}s`,
            userSelect:"none",
          }}>🪙</span>
        ))}
      </div>

      {/* Coin badge */}
      <div style={{ position:"fixed", top:"1rem", right:"1rem", zIndex:200 }}>
        <span className="coin-badge">🪙 {coins.toLocaleString()}{hasOchki ? " ×1.2" : ""}</span>
      </div>

      {/* Achievement toast */}
      {toast && (
        <div className="achiev-toast">
          <span className="achiev-icon">🏆</span>
          <div>
            <div className="achiev-t">Ачивка: {toast.title}</div>
            <div className="achiev-d">{toast.desc}</div>
          </div>
        </div>
      )}

      <div className="pc">

        {/* ── MAIN MENU ── */}
        {tab === "main" && (
          <div className="menu">
            <h1 className="mt">💰 МОНЕТНЫЙ КЛИКЕР 💰</h1>
            <p className="ms">Зарабатывай монеты и покупай всё подряд!</p>
            <div className="mbg">
              <button className="mb" onClick={() => setTab("earn")}>Заработок 🤑</button>
              <button className="mb" onClick={() => setTab("shop")}>Магазин 🛒</button>
              <button className="mb" onClick={() => setTab("achievs")}>Ачивки 🏆</button>
              <button className="mb" onClick={() => setTab("news")}>Новости 📰</button>
              <button className="mb" onClick={() => setTab("settings")}>Настройки ⚙️</button>
            </div>
          </div>
        )}

        {/* ── EARN ── */}
        {tab === "earn" && (
          <div className="earn-view">
            <button className="back-btn" onClick={() => setTab("main")}>← Назад</button>
            <div className="stats-row">
              <span>🪙 {coins.toLocaleString()}</span>
              <span>👆 {totalClicks} кликов</span>
              <span>⚡ +{Math.round((1+clickLevel)*clickBoost)}/клик</span>
              {autoLevel > 0 && <span>⏱ +{autoLevel}/сек</span>}
              {hasOchki && <span>👓 ×1.2</span>}
            </div>

            <div className="char-wrap">
              <p className="char-label" style={{ color: char.color }}>{char.name}</p>
              {charClicks < 100  && <p className="char-hint">ещё {100-charClicks} кликов до Огурчика</p>}
              {charClicks >= 100 && charClicks < 350 && <p className="char-hint">ещё {350-charClicks} кликов до Лунтика</p>}
              {charClicks >= 350 && charClicks < 700 && <p className="char-hint" style={{color:"#b266ff"}}>ещё {700-charClicks} кликов до Рыга</p>}
              {charClicks >= 700 && <p className="char-hint" style={{color:"#ff4da6"}}>Максимальный персонаж — Рыг! 🎉</p>}
              <button
                className={`char-btn${clickAnim ? " clicked" : ""}`}
                onClick={handleCharClick}
                style={{ borderColor: char.color, boxShadow:`0 0 30px ${char.color}55` }}
              >
                <img src={char.img} alt={char.name} className="char-img" />
                {plusAnims.map((p) => (
                  <span key={p.id} className="plus-anim" style={{ left:p.x, top:p.y }}>
                    +{p.val}
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
                        {Array.from({length:5}).map((_,i) => (
                          <span key={i} style={{ opacity: i < level ? 1 : 0.25 }}>⭐</span>
                        ))}
                      </div>
                    </div>
                    <button className="upg-btn" disabled={maxed || coins < price} onClick={() => buyUpgrade(upg.id)}>
                      {maxed ? "МАКС" : `🪙 ${price}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── SHOP ── */}
        {tab === "shop" && (
          <div className="shop-view">
            <button className="back-btn" onClick={() => setTab("main")}>← Назад</button>
            <h2 className="shop-title">🛒 Магазин</h2>
            <p className="ms" style={{ marginBottom:"1.2rem" }}>🪙 {coins.toLocaleString()} монет</p>
            <div className="items-list">
              {SHOP_ITEMS.map((item) => {
                const bought = purchased.includes(item.id);
                const canBuy = !bought && coins >= item.price;
                return (
                  <div key={item.id} className={`item-card${bought ? " bought" : ""}`}>
                    <span className="item-emoji">{item.emoji}</span>
                    <div className="item-info">
                      <span className="item-name">
                        {item.name}
                        {item.boost > 1 && <span className="boost-badge"> ×{item.boost}</span>}
                      </span>
                      <span className="item-desc">{item.desc}</span>
                    </div>
                    <button
                      className="buy-btn"
                      disabled={!canBuy && !bought}
                      onClick={() => buyItem(item.id, item.price)}
                      style={bought ? { background:"#2a8a2a", borderColor:"#44ff44", cursor:"default" } : {}}
                    >
                      {bought ? "✅ Куплено" : `🪙 ${item.price}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── ACHIEVS ── */}
        {tab === "achievs" && (
          <div className="shop-view">
            <button className="back-btn" onClick={() => setTab("main")}>← Назад</button>
            <h2 className="shop-title">🏆 Ачивки</h2>
            <p className="ms" style={{ marginBottom:"1.2rem" }}>
              Открыто: {purchased.length} / {ALL_ACHIEVS.length}
            </p>
            <div className="items-list">
              {ALL_ACHIEVS.map((a) => {
                const unlocked = purchased.includes(a.id);
                return (
                  <div key={a.id} className={`item-card${unlocked ? " bought" : ""}`}
                    style={{ opacity: unlocked ? 1 : 0.45 }}>
                    <span className="item-emoji" style={{ filter: unlocked ? "none" : "grayscale(1)" }}>
                      {unlocked ? "🏆" : "🔒"}
                    </span>
                    <div className="item-info">
                      <span className="item-name">{unlocked ? a.title : "???"}</span>
                      <span className="item-desc">{unlocked ? a.desc : "Купи предмет в магазине"}</span>
                    </div>
                    <span style={{ fontSize:"1.5rem" }}>{a.emoji}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── NEWS ── */}
        {tab === "news" && (
          <div className="shop-view">
            <button className="back-btn" onClick={() => setTab("main")}>← Назад</button>
            <h2 className="shop-title">📰 Новости</h2>
            <p className="ms" style={{ marginBottom:"1.2rem" }}>Последние обновления игры</p>
            <div className="items-list">
              {NEWS.map((n, i) => (
                <div key={i} className="news-card">
                  <div className="news-date">{n.date}</div>
                  <div className="news-title">{n.title}</div>
                  <div className="news-text">{n.text}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SETTINGS ── */}
        {tab === "settings" && (
          <div className="settings-view">
            <button className="back-btn" onClick={() => setTab("main")}>← Назад</button>
            <h2 className="shop-title">⚙️ Настройки</h2>
            <div className="set-card">
              <span className="set-label">🎵 Музыка</span>
              <button className={`toggle-btn${music ? " on" : " off"}`} onClick={() => setMusic((m) => !m)}>
                {music ? "Включена" : "Выключена"}
              </button>
            </div>
            <div className="set-card" style={{ marginTop:"0.75rem" }}>
              <span className="set-label">🗑 Сбросить прогресс</span>
              <button className="toggle-btn off" onClick={() => {
                localStorage.removeItem(SAVE_KEY);
                location.reload();
              }}>Сброс</button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;700;900&family=Caveat:wght@700&display=swap');
        * { box-sizing: border-box; }

        /* ── SPLASH ── */
        .splash {
          min-height:100vh; width:100%;
          background:radial-gradient(ellipse at 50% 0%,#7a5c00,#3d2e00 50%,#1a1200);
          display:flex; align-items:center; justify-content:center;
          font-family:'Rubik',sans-serif; position:relative; overflow:hidden;
        }
        .splash-emojis {
          position:absolute; inset:0; display:flex; flex-wrap:wrap;
          align-content:flex-start; gap:.6rem; padding:1rem;
          pointer-events:none; overflow:hidden;
        }
        .splash-emoji {
          animation:splashFloat 2s ease-in-out infinite;
          display:inline-block;
        }
        .splash-center {
          position:relative; z-index:1; text-align:center; padding:2rem;
        }
        .splash-title {
          font-family:'Caveat',cursive; font-size:2.8rem; color:#f5c518;
          text-shadow:0 2px 20px rgba(0,0,0,.8); margin-bottom:.5rem;
          animation:popIn .6s cubic-bezier(.34,1.56,.64,1) both;
        }
        .splash-sub {
          color:#c9a840; font-size:1.1rem; margin-bottom:1.8rem; opacity:.9;
        }
        .splash-bar-wrap {
          width:280px; max-width:80vw; height:18px;
          background:rgba(0,0,0,.5); border:2px solid #c9a840;
          border-radius:12px; overflow:hidden; margin:0 auto;
        }
        .splash-bar-fill {
          height:100%; background:linear-gradient(90deg,#c9a840,#f5c518,#fff8a0,#f5c518);
          background-size:200%;
          animation:shimmer 1.2s linear infinite;
          border-radius:12px; transition:width .05s linear;
        }
        .splash-pct {
          color:#f5c518; font-weight:700; font-size:1.1rem; margin-top:.7rem;
        }
        @keyframes splashFloat {
          0%,100% { transform:translateY(0) rotate(-5deg); }
          50%      { transform:translateY(-12px) rotate(5deg); }
        }
        @keyframes shimmer {
          0%   { background-position:0% 50%; }
          100% { background-position:200% 50%; }
        }

        /* ── MAIN ── */
        .pw {
          min-height:100vh;
          background:radial-gradient(ellipse at 50% 0%,#7a5c00,#3d2e00 45%,#1a1200);
          display:flex; align-items:center; justify-content:center;
          font-family:'Rubik',sans-serif; position:relative; overflow:hidden; padding:1rem;
        }
        .pc { position:relative; z-index:1; width:100%; max-width:500px; text-align:center; }

        .coin-badge {
          background:rgba(0,0,0,.6); backdrop-filter:blur(8px);
          border:2px solid #f5c518; border-radius:20px;
          padding:.4rem 1rem; color:#f5c518; font-weight:700; font-size:1.1rem;
        }

        .mt { font-family:'Caveat',cursive; font-size:2.5rem; color:#f5c518; margin-bottom:.3rem; text-shadow:0 2px 16px rgba(0,0,0,.7); }
        .ms { color:#c9a840; font-size:1rem; margin-bottom:2rem; opacity:.9; }
        .menu { animation:popIn .4s cubic-bezier(.34,1.56,.64,1) both; }
        .mbg { display:flex; flex-direction:column; gap:.85rem; }
        .mb {
          background:linear-gradient(135deg,#7a5c00,#4a3800);
          color:#f5c518; border:2.5px solid #c9a840; border-radius:18px;
          padding:1rem 1.5rem; font-family:'Rubik',sans-serif;
          font-weight:700; font-size:1.15rem; cursor:pointer;
          transition:transform .15s,box-shadow .15s;
          box-shadow:0 4px 20px rgba(200,160,0,.3);
        }
        .mb:hover { transform:translateY(-4px) scale(1.03); box-shadow:0 8px 30px rgba(245,197,24,.4); }
        .mb:active { transform:scale(.97); }

        .back-btn {
          background:rgba(0,0,0,.4); color:#f5c518; border:2px solid #7a5c00;
          border-radius:12px; padding:.5rem 1.1rem; font-family:'Rubik',sans-serif;
          font-weight:700; cursor:pointer; margin-bottom:1rem;
          transition:transform .15s; font-size:.95rem;
        }
        .back-btn:hover { transform:scale(1.05); }

        .earn-view { animation:popIn .35s cubic-bezier(.34,1.56,.64,1) both; }
        .stats-row { display:flex; flex-wrap:wrap; gap:.5rem; justify-content:center; margin-bottom:1.2rem; }
        .stats-row span {
          background:rgba(0,0,0,.45); border:1.5px solid #7a5c00;
          border-radius:12px; padding:.35rem .8rem; color:#f5c518; font-size:.9rem; font-weight:700;
        }

        .char-wrap { position:relative; margin-bottom:1.5rem; }
        .char-label { font-family:'Caveat',cursive; font-size:1.8rem; font-weight:700; margin-bottom:.2rem; }
        .char-hint  { color:#c9a840; font-size:.85rem; margin-bottom:.5rem; opacity:.8; }
        .char-btn {
          position:relative; background:rgba(0,0,0,.4);
          border:3px solid #f5c518; border-radius:50%;
          width:180px; height:180px; margin:0 auto; display:block;
          cursor:pointer; transition:transform .1s; overflow:hidden;
        }
        .char-btn.clicked { transform:scale(.88) !important; }
        .char-btn:hover   { transform:scale(1.06); }
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
          padding:1rem 1.2rem; margin-bottom:.75rem; display:flex; align-items:center; gap:1rem;
        }
        .upg-info { flex:1; }
        .upg-name  { display:block; color:#f5c518; font-weight:700; font-size:1rem; }
        .upg-desc  { display:block; color:#c9a840; font-size:.8rem; opacity:.8; margin:.2rem 0; }
        .upg-stars { font-size:.9rem; }
        .upg-btn {
          background:linear-gradient(135deg,#7a5c00,#4a3800);
          color:#f5c518; border:2px solid #c9a840; border-radius:12px;
          padding:.55rem .9rem; font-weight:700; font-size:.9rem; cursor:pointer;
          white-space:nowrap; transition:transform .12s; min-width:80px;
        }
        .upg-btn:hover:not(:disabled) { transform:scale(1.07); }
        .upg-btn:disabled { opacity:.45; cursor:not-allowed; }

        .shop-view  { animation:popIn .35s cubic-bezier(.34,1.56,.64,1) both; }
        .shop-title { font-family:'Caveat',cursive; font-size:2rem; color:#f5c518; margin-bottom:.5rem; }
        .items-list { display:flex; flex-direction:column; gap:.75rem; }
        .item-card {
          background:rgba(0,0,0,.4); border:2px solid #7a5c00; border-radius:16px;
          padding:1rem 1.2rem; display:flex; align-items:center; gap:1rem; transition:border-color .2s;
        }
        .item-card.bought { border-color:#44cc44; }
        .item-emoji { font-size:2rem; flex-shrink:0; }
        .item-info  { flex:1; text-align:left; }
        .item-name  { display:block; color:#f5c518; font-weight:700; font-size:1rem; }
        .item-desc  { display:block; color:#c9a840; font-size:.82rem; opacity:.85; margin-top:.2rem; }
        .boost-badge {
          background:#f5c518; color:#3a2a00; font-size:.72rem;
          border-radius:8px; padding:.1rem .4rem; font-weight:900; margin-left:.4rem; vertical-align:middle;
        }
        .buy-btn {
          background:linear-gradient(135deg,#7a5c00,#4a3800);
          color:#f5c518; border:2px solid #c9a840; border-radius:12px;
          padding:.55rem .9rem; font-weight:700; font-size:.9rem; cursor:pointer;
          white-space:nowrap; transition:transform .12s; min-width:90px;
        }
        .buy-btn:hover:not(:disabled) { transform:scale(1.07); }
        .buy-btn:disabled { opacity:.45; cursor:not-allowed; }

        /* ── NEWS ── */
        .news-card {
          background:rgba(0,0,0,.45); border:2px solid #7a5c00; border-radius:16px;
          padding:1rem 1.2rem; text-align:left;
        }
        .news-date  { color:#7a5c00; font-size:.78rem; font-weight:700; margin-bottom:.25rem; }
        .news-title { color:#f5c518; font-weight:700; font-size:1.05rem; margin-bottom:.35rem; }
        .news-text  { color:#c9a840; font-size:.88rem; opacity:.9; line-height:1.5; }

        .settings-view { animation:popIn .35s cubic-bezier(.34,1.56,.64,1) both; }
        .set-card {
          background:rgba(0,0,0,.4); border:2px solid #7a5c00; border-radius:16px;
          padding:1.2rem 1.5rem; display:flex; align-items:center; justify-content:space-between;
        }
        .set-label { color:#f5c518; font-weight:700; font-size:1.1rem; }
        .toggle-btn {
          border-radius:12px; padding:.6rem 1.3rem; font-weight:700; font-size:1rem;
          cursor:pointer; border:2px solid; transition:transform .12s;
        }
        .toggle-btn.on  { background:#2a5a2a; color:#44ff44; border-color:#44ff44; }
        .toggle-btn.off { background:#5a1a1a; color:#ff6666; border-color:#ff6666; }
        .toggle-btn:hover { transform:scale(1.06); }

        .achiev-toast {
          position:fixed; bottom:1.5rem; left:50%; transform:translateX(-50%);
          background:linear-gradient(135deg,#3a2a00,#6a4e00);
          border:2.5px solid #f5c518; border-radius:18px;
          padding:.9rem 1.4rem; display:flex; align-items:center; gap:.9rem;
          z-index:300; box-shadow:0 8px 30px rgba(245,197,24,.4);
          animation:toastIn .4s cubic-bezier(.34,1.56,.64,1) both;
          min-width:260px; max-width:90vw;
        }
        .achiev-icon { font-size:2rem; flex-shrink:0; }
        .achiev-t { color:#f5c518; font-weight:700; font-size:1rem; }
        .achiev-d { color:#c9a840; font-size:.82rem; margin-top:.1rem; opacity:.85; }

        @keyframes toastIn {
          0%   { opacity:0; transform:translateX(-50%) translateY(30px) scale(.85); }
          100% { opacity:1; transform:translateX(-50%) translateY(0) scale(1); }
        }
        @keyframes floatC {
          0%,100% { transform:translateY(0) rotate(-8deg); }
          50%     { transform:translateY(-20px) rotate(8deg); }
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
