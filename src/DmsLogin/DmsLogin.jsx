
import React, { useMemo, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom"; 
import { useAuth } from "../Hook/useAuth"; // Import the new hook

export default function DmsLogin() {
  const navigate = useNavigate();
  
  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  // Initialize Custom Hook
  const { login, loading } = useAuth();

  // ------------------ ANIMATION CONSTANTS ------------------
  const LIFT_PX = -22;       
  const SCALE = 1.03;        
  const ROTATE_DEG = 12;     
  // ---------------------------------------------------------

  // Tile geometry setup
  const tileSize = 145;      
  const tileRadius = 18;     
  const tileGapX = 22;       
  const tileGapY = 22;       
  const rows = 18;           
  const cols = 18;           

  const centerR = Math.floor(rows / 2);
  const centerC = Math.floor(cols / 2);

  const tiles = useMemo(() => {
    const arr = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * (tileSize + tileGapX) + (r % 2 ? (tileSize + tileGapX) / 2 : 0);
        const y = r * (tileSize * 0.5 + tileGapY * 0.25);
        arr.push({ key: `${r}-${c}`, x, y, r, c });
      }
    }
    return arr;
  }, [rows, cols, tileSize, tileGapX, tileGapY]);

  // ---------------------- SUBMIT HANDLER ----------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Call login from useAuth
    const result = await login(email, password);

    // 2. Handle Success (Storage is handled inside useAuth)
    if (result.success) {
        // If "Remember Me" is NOT checked, we might want to move to sessionStorage
        // But for simplicity, useAuth defaults to localStorage.
        // You can add logic here if strict session vs local storage is needed.
        
        navigate("/"); // Redirect to Home
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#0A2240]">
      <style>{`
        .tile-outer { transform: rotate(45deg); }
        .tile-inner  { transform: rotate(-45deg); }

        @keyframes liftRotateFixed {
          0% { transform: translate(-50%, -50%) translateY(0px) perspective(900px) rotateX(${ROTATE_DEG}deg) rotate(${ROTATE_DEG}deg) scale(1); filter: drop-shadow(0 14px 28px rgba(2,20,40,0.26)); }
          50% { transform: translate(-50%, -50%) translateY(${LIFT_PX}px) perspective(900px) rotateX(${ROTATE_DEG + 3}deg) rotate(${ROTATE_DEG + 3}deg) scale(${SCALE}); filter: drop-shadow(0 36px 56px rgba(2,20,40,0.36)); }
          100% { transform: translate(-50%, -50%) translateY(0px) perspective(900px) rotateX(${ROTATE_DEG}deg) rotate(${ROTATE_DEG}deg) scale(1); filter: drop-shadow(0 14px 28px rgba(2,20,40,0.26)); }
        }

        @keyframes shadowPulseFixed {
          0% { opacity: 0.42; transform: translate(-50%, 0) scale(1); filter: blur(18px); }
          50% { opacity: 0.30; transform: translate(-50%, 8px) scale(1.08); filter: blur(32px); }
          100% { opacity: 0.42; transform: translate(-50%, 0) scale(1); filter: blur(18px); }
        }

        img.noselect { user-select: none; pointer-events: none; }
      `}</style>

      {/* LEFT: tiled artboard */}
      <div className="relative w-full lg:w-1/2 bg-white overflow-hidden min-h-screen hidden lg:block">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent ${tileSize + tileGapX}px, rgba(229,231,235,0.30) ${tileSize + tileGapX}px, rgba(229,231,235,0.30) ${tileSize + tileGapX + 2}px)` }}>
          {tiles.map((t) => {
            const isCenter = t.r === centerR && t.c === centerC;
            return (
              <div key={t.key} className="absolute" style={{ left: t.x, top: t.y, width: tileSize, height: tileSize, transform: `translate(-50%, -50%)` }} aria-hidden="true">
                <div className="tile-outer w-full h-full flex items-center justify-center" style={{ borderRadius: tileRadius, background: "#FFFFFF", border: "5.5px solid #E8EAED", boxSizing: "border-box", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.03)", position: "relative", overflow: "visible" }}>
                  <div className="tile-inner w-full h-full flex items-center justify-center">
                    <img src={assets.bg_logo_one} alt="" className="noselect" style={{ width: 22, height: 22, opacity: 0.85 }} />
                  </div>
                  {isCenter && (
                    <>
                      <div aria-hidden="true" style={{ position: "absolute", left: "50%", top: "66%", width: tileSize * 0.95, height: tileSize * 0.30, transform: "translate(-50%, 0)", borderRadius: 999, background: "linear-gradient(180deg, rgba(10,34,64,0.06), rgba(10,34,64,0.20))", filter: "blur(20px)", zIndex: 12, animation: "shadowPulseFixed 3.6s ease-in-out infinite", pointerEvents: "none", opacity: 0.42 }} />
                      <div role="img" aria-label="Floating navy card" className="noselect" style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(-50%, -50%)`, width: tileSize * 0.82, height: tileSize * 0.82, borderRadius: 10, background: "#0A2240", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 16px 36px rgba(2,20,40,0.45), 0 8px 18px rgba(10,34,64,0.32)", animation: "liftRotateFixed 3.6s ease-in-out infinite", pointerEvents: "none" }}>
                        <img src={assets.bg_logo} alt="brand" className="noselect" style={{ width: 36, height: 36, filter: "brightness(0) invert(1)", opacity: 0.98 }} />
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT: login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative overflow-hidden">
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 5 }}>
          <div style={{ position: "absolute", left: "62%", top: "38%", width: "64%", height: "80%", background: "radial-gradient(closest-side, rgba(255,255,255,0.06), rgba(255,255,255,0) 60%)", transform: "translate(-50%,-50%) scale(1)", mixBlendMode: "overlay" }} />
        </div>

        <div className="w-full max-w-md rounded-xl p-8 relative z-10" style={{ background: "#FFFFFF", boxShadow: "0 20px 60px rgba(0,0,0,0.28)" }} role="region" aria-label="Login form">
          <h1 className="text-2xl lg:text-3xl font-semibold mb-6" style={{ color: "#0A2240" }}>Login</h1>

          <form onSubmit={handleSubmit} className="space-y-4" aria-live="polite">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" required aria-label="Email address" className="w-full rounded-lg px-4 py-3 text-sm bg-[#F9FAFB] border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#A2C8FF]" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)' }} autoComplete="username" />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required aria-label="Password" className="w-full rounded-lg px-4 py-3 text-sm bg-[#F9FAFB] border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#A2C8FF]" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)' }} autoComplete="current-password" />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-[#6B7280]">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 rounded accent-[#0A2240]" />
                Remember me
              </label>
              <a href="#" className="text-sm text-[#3B82F6] hover:underline">Forgot password?</a>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2" style={{ backgroundColor: loading ? "#234063" : "#0A2240", boxShadow: "0 6px 18px rgba(10,34,64,0.25)", cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? (
                  <>
                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    
                  </>
              ) : "Login"}
            </button>

            <p className="text-center text-sm text-[#6B7280] mt-3">Don't have an account? <a href="#" className="text-[#0A2240] font-medium hover:underline">Create free account</a></p>
          </form>
        </div>
      </div>
    </div>
  );
}