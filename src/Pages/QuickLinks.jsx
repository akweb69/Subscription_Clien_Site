// QuickLinks.jsx – upgraded UI/UX with glassmorphism, glow effects & rich micro-interactions
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Phone, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

/* ─── CSS injected once ─── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap');

  .ql-root {
    --clr-phone:    #10b981;
    --clr-phone-hi: #34d399;
    --clr-wa:       #25d366;
    --clr-wa-hi:    #5eeb8a;
    --clr-tg:       #0088cc;
    --clr-tg-hi:    #42a5f5;
    font-family: 'Outfit', sans-serif;
  }

  /* ── animated ambient orbs behind the card ── */
  .ql-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: .35;
    animation: ql-drift 8s ease-in-out infinite alternate;
    pointer-events: none;
  }
  .ql-orb--1 { width: 220px; height: 220px; background: #818cf8; top: -60px; left: -40px; animation-delay: 0s; }
  .ql-orb--2 { width: 180px; height: 180px; background: #34d399; bottom: -50px; right: -30px; animation-delay: -3s; }
  .ql-orb--3 { width: 140px; height: 140px; background: #60a5fa; top: 50%; left: 55%; animation-delay: -5s; }

  @keyframes ql-drift {
    0%   { transform: translate(0, 0) scale(1); }
    100% { transform: translate(30px, -25px) scale(1.15); }
  }

  /* ── frosted-glass card ── */
  .ql-card {
    position: relative;
    overflow: hidden;
    background: rgba(255, 255, 255, .55);
    backdrop-filter: blur(24px) saturate(1.6);
    -webkit-backdrop-filter: blur(24px) saturate(1.6);
    border: 1px solid rgba(255,255,255,.7);
    box-shadow:
      0  8px 32px rgba(99,102,241,.12),
      0  2px  8px rgba(0,0,0,.06);
    border-radius: 28px;
    padding: 36px 32px 32px;
  }
  @media (max-width: 520px) {
    .ql-card { padding: 28px 20px 24px; border-radius: 22px; }
  }

  /* ── heading ── */
  .ql-heading {
    font-size: clamp(1.45rem, 4vw, 2rem);
    font-weight: 800;
    letter-spacing: -.02em;
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 8px;
  }
  .ql-sub {
    font-size: clamp(.8rem, 2.2vw, .92rem);
    color: #7c7f8e;
    font-weight: 600;
    letter-spacing: .02em;
    text-transform: uppercase;
    margin-bottom: 26px;
  }

  /* ── button row ── */
  .ql-btn-row {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
  }
  @media (min-width: 620px) {
    .ql-btn-row { gap: 18px; }
  }

  /* ── single button ── */
  .ql-btn {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 26px;
    border-radius: 18px;
    border: 1.5px solid transparent;
    text-decoration: none;
    font-family: inherit;
    font-weight: 700;
    font-size: clamp(.88rem, 2.3vw, 1rem);
    letter-spacing: -.01em;
    color: #1e293b;
    background: rgba(255,255,255,.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    position: relative;
    overflow: hidden;
    cursor: pointer;
    transition: transform .25s cubic-bezier(.34,1.56,0,1),
                box-shadow .25s ease,
                border-color .25s ease;
    -webkit-tap-highlight-color: transparent;
  }
  @media (max-width: 420px) {
    .ql-btn { padding: 16px 20px; gap: 12px; border-radius: 16px; width: 100%; }
  }

  /* ── icon wrapper ── */
  .ql-btn__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 46px; height: 46px;
    border-radius: 14px;
    flex-shrink: 0;
    transition: transform .3s cubic-bezier(.34,1.56,0,1);
  }
  .ql-btn:hover .ql-btn__icon { transform: scale(1.12) rotate(-4deg); }

  /* ── label + arrow ── */
  .ql-btn__label { flex: 1; text-align: left; }
  .ql-btn__label span  { display: block; font-size: .78rem; font-weight: 600; opacity: .5; letter-spacing: .04em; text-transform: uppercase; margin-bottom: 2px; }
  .ql-btn__label strong { display: block; font-size: clamp(.92rem, 2.4vw, 1.05rem); }

  .ql-btn__arrow {
    width: 32px; height: 32px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(0,0,0,.06);
    transition: transform .3s cubic-bezier(.34,1.56,0,1), background .25s;
    flex-shrink: 0;
  }
  .ql-btn:hover .ql-btn__arrow {
    transform: translateX(4px);
  }

  /* ── glow line that sweeps across on hover ── */
  .ql-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,.55) 50%, transparent 100%);
    transform: translateX(-110%);
    transition: transform .55s ease;
    pointer-events: none;
  }
  .ql-btn:hover::before { transform: translateX(110%); }

  /* ─── colour variants ─── */

  /* Phone / WhatsApp‑call */
  .ql-btn--phone .ql-btn__icon     { background: linear-gradient(135deg, #d1fae5, #a7f3d0); }
  .ql-btn--phone .ql-btn__icon svg { color: var(--clr-phone); }
  .ql-btn--phone:hover             { border-color: var(--clr-phone); box-shadow: 0 6px 28px rgba(16,185,129,.2); }
  .ql-btn--phone:hover .ql-btn__arrow { background: linear-gradient(135deg, #10b981, #34d399); }
  .ql-btn--phone:hover .ql-btn__arrow svg { color: #fff; }
  .ql-btn--phone:active            { transform: scale(.96); }

  /* WhatsApp */
  .ql-btn--whatsapp .ql-btn__icon     { background: linear-gradient(135deg, #dcfce7, #bbf7d0); }
  .ql-btn--whatsapp .ql-btn__icon svg { color: var(--clr-wa); }
  .ql-btn--whatsapp:hover             { border-color: var(--clr-wa); box-shadow: 0 6px 28px rgba(37,211,102,.2); }
  .ql-btn--whatsapp:hover .ql-btn__arrow { background: linear-gradient(135deg, #25d366, #5eeb8a); }
  .ql-btn--whatsapp:hover .ql-btn__arrow svg { color: #fff; }
  .ql-btn--whatsapp:active            { transform: scale(.96); }

  /* Telegram */
  .ql-btn--telegram .ql-btn__icon     { background: linear-gradient(135deg, #dbeafe, #bfdbfe); }
  .ql-btn--telegram .ql-btn__icon svg { color: var(--clr-tg); }
  .ql-btn--telegram:hover             { border-color: var(--clr-tg); box-shadow: 0 6px 28px rgba(0,136,204,.2); }
  .ql-btn--telegram:hover .ql-btn__arrow { background: linear-gradient(135deg, #0088cc, #42a5f5); }
  .ql-btn--telegram:hover .ql-btn__arrow svg { color: #fff; }
  .ql-btn--telegram:active            { transform: scale(.96); }

  /* ── loader pulse ── */
  .ql-loader { display: flex; justify-content: center; padding: 48px 0; }
  .ql-loader svg { color: #6366f1; }
`;

function useInjectCSS() {
    const injected = useRef(false);
    useEffect(() => {
        if (injected.current) return;
        injected.current = true;
        const tag = document.createElement('style');
        tag.textContent = CSS;
        document.head.appendChild(tag);
    }, []);
}

/* ─── tiny inline SVG arrow ─── */
const ArrowIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);

/* ─── reusable animated button ─── */
const ContactButton = ({ href, variant, icon: Icon, badge, label }) => (
    <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`ql-btn ql-btn--${variant}`}
        initial={{ opacity: 0, y: 18, scale: .94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: .96 }}
        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
    >
        <div className="ql-btn__icon">
            <Icon size={22} strokeWidth={2.2} />
        </div>
        <div className="ql-btn__label">
            <span>{badge}</span>
            <strong>{label}</strong>
        </div>
        <div className="ql-btn__arrow">
            <ArrowIcon />
        </div>
    </motion.a>
);

/* ─── main component ─── */
const QuickLinks = () => {
    useInjectCSS();

    const base_url = import.meta.env.VITE_BASE_URL;

    const [links, setLinks] = useState({ whatsapp: '', telegram: '', phone: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get(`${base_url}/quick-links`)
            .then((res) => {
                const data = res.data || {};
                setLinks({
                    whatsapp: data.whatsapp || '',
                    telegram: data.telegram || '',
                    phone: data.phone || '',
                });
            })
            .catch((err) => console.error('Quick links fetch failed:', err))
            .finally(() => setLoading(false));
    }, []);

    /* ── loading state ── */
    if (loading) {
        return (
            <div className="ql-loader">
                <Loader2 size={34} className="animate-spin" />
            </div>
        );
    }

    /* ── nothing to show ── */
    if (!links.whatsapp && !links.telegram && !links.phone) return null;

    /* ── entrance animation for the whole wrapper ── */
    const wrapperVariants = {
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: .55, ease: [.22, 1, .36, 1] } },
    };

    return (
        <motion.section
            className="ql-root"
            variants={wrapperVariants}
            initial="hidden"
            animate="visible"
            style={{ padding: '40px 20px' }}
        >
            {/* outer shell that clips the ambient orbs */}
            <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto' }}>

                {/* ambient glow orbs */}
                <div className="ql-orb ql-orb--1" />
                <div className="ql-orb ql-orb--2" />
                <div className="ql-orb ql-orb--3" />

                {/* frosted card */}
                <div className="ql-card" style={{ position: 'relative', zIndex: 1 }}>

                    {/* heading block */}
                    <h3 className="ql-heading">Quick Contact</h3>
                    <p className="ql-sub">Reach us instantly</p>

                    {/* buttons */}
                    <div className="ql-btn-row">
                        <AnimatePresence>
                            {links.phone && (
                                <ContactButton
                                    key="phone"
                                    href={`https://wa.me/${links.phone.replace(/\D/g, '')}`}
                                    variant="phone"
                                    icon={Phone}
                                    badge=" Chat WhatsApp"
                                    label="WhatsApp Support"
                                />
                            )}
                            {links.whatsapp && (
                                <ContactButton
                                    key="whatsapp"
                                    href={links.whatsapp}
                                    variant="whatsapp"
                                    icon={MessageCircle}
                                    badge="Chat via"
                                    label="WhatsApp  group"
                                />
                            )}
                            {links.telegram && (
                                <ContactButton
                                    key="telegram"
                                    href={links.telegram}
                                    variant="telegram"
                                    icon={Send}
                                    badge="Message via"
                                    label="Telegram Channel"
                                />
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default QuickLinks;