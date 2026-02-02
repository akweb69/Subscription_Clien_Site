import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ────────────────────────────────────────────────
   INJECTED STYLES  (updated Feb 2026 version)
   ──────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');

  :root {
    --bg-base:      #0a0c11;
    --bg-card:      #12151e;
    --bg-card-hi:   #1a1f2c;
    --border:       rgba(255,255,255,.08);
    --border-hi:    rgba(255,255,255,.15);
    --txt-primary:  #f1f2f6;
    --txt-secondary:#9ca1b5;
    --txt-muted:    #5f647a;
    --accent:       #00eaff;
    --accent-dim:   rgba(0,234,255,.11);
    --accent-glow:  rgba(0,234,255,.28);
    --accent2:      #8b5cf6;
    --accent2-dim:  rgba(139,92,246,.14);
    --radius-card:  22px;
    --radius-sm:    14px;
  }

  .md-tc-wrap {
    font-family: 'DM Sans', system-ui, sans-serif;
    background: var(--bg-base);
    color: var(--txt-primary);
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
  }

  /* ambient glow blobs */
  .md-blob {
    position: fixed;
    border-radius: 50%;
    filter: blur(110px);
    opacity: 0.16;
    pointer-events: none;
    z-index: 0;
  }
  .md-blob--1 { width: 580px; height: 580px; background: var(--accent); top: -220px; right: -180px; }
  .md-blob--2 { width: 480px; height: 480px; background: var(--accent2); bottom: -140px; left: -160px; }
  .md-blob--3 { width: 360px; height: 360px; background: #f472b6; top: 60%; left: 48%; opacity: 0.09; }

  /* hero header */
  .md-hero {
    position: relative;
    z-index: 2;
    padding: 120px 20px 64px;
    text-align: center;
    max-width: 820px;
    margin: 0 auto;
  }
  .md-hero__badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: var(--accent-dim);
    border: 1px solid var(--accent-glow);
    border-radius: 50px;
    padding: 8px 20px 8px 12px;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--accent);
    letter-spacing: 0.07em;
    text-transform: uppercase;
    margin-bottom: 32px;
  }
  .md-hero__badge-dot {
    width: 9px; height: 9px;
    border-radius: 50%;
    background: var(--accent);
    animation: md-pulse 2.4s ease-in-out infinite;
  }
  @keyframes md-pulse {
    0%,100% { box-shadow: 0 0 0 0 var(--accent-glow); }
    50%     { box-shadow: 0 0 0 10px transparent; }
  }
  .md-hero__title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2.6rem, 7vw, 4.2rem);
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.035em;
    margin-bottom: 20px;
  }
  .md-hero__title em {
    font-style: normal;
    background: linear-gradient(135deg, var(--accent), var(--accent2), #f472b6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .md-hero__sub {
    font-size: clamp(1rem, 2.1vw, 1.12rem);
    color: var(--txt-secondary);
    max-width: 560px;
    margin: 0 auto;
    line-height: 1.75;
    font-weight: 300;
  }
  .md-hero__meta {
    margin-top: 32px;
    display: flex;
    justify-content: center;
    gap: 28px;
    flex-wrap: wrap;
  }
  .md-hero__meta span {
    font-size: 0.84rem;
    color: var(--txt-muted);
    display: flex;
    align-items: center;
    gap: 7px;
  }

  /* layout */
  .md-layout {
    position: relative;
    z-index: 2;
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 20px 120px;
    display: flex;
    gap: 48px;
    align-items: flex-start;
  }

  /* sticky TOC sidebar */
  .md-toc {
    position: sticky;
    top: 40px;
    width: 260px;
    flex-shrink: 0;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-card);
    padding: 28px 22px;
    backdrop-filter: blur(14px);
  }
  .md-toc__label {
    font-family: 'Syne', sans-serif;
    font-size: 0.76rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--txt-muted);
    margin-bottom: 20px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--border);
  }
  .md-toc__item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all 0.22s;
  }
  .md-toc__item:hover,
  .md-toc__item:focus { background: var(--bg-card-hi); outline: none; }
  .md-toc__item--active {
    background: var(--accent-dim);
    border: 1px solid var(--accent-glow);
  }
  .md-toc__item--active .md-toc__dot { background: var(--accent); box-shadow: 0 0 10px var(--accent-glow); }
  .md-toc__item--active .md-toc__txt { color: var(--accent); font-weight: 500; }
  .md-toc__dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--txt-muted);
    flex-shrink: 0;
    transition: all 0.3s;
  }
  .md-toc__txt {
    font-size: 0.86rem;
    color: var(--txt-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .md-toc__progress {
    margin-top: 24px;
    padding-top: 18px;
    border-top: 1px solid var(--border);
  }
  .md-toc__progress-bar-bg {
    height: 4px;
    background: var(--border);
    border-radius: 2px;
  }
  .md-toc__progress-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    border-radius: 2px;
    transition: width 0.4s ease;
  }

  /* main content sections */
  .md-section {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-card);
    padding: 44px 40px;
    margin-bottom: 24px;
    transition: border-color 0.4s, transform 0.3s;
    opacity: 0;
    transform: translateY(30px);
    animation: md-reveal 0.7s cubic-bezier(0.22,1,0.36,1) forwards;
  }
  .md-section:hover { border-color: var(--border-hi); transform: translateY(-2px); }
  @keyframes md-reveal {
    to { opacity: 1; transform: translateY(0); }
  }

  .md-section__num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 42px; height: 42px;
    border-radius: 14px;
    background: var(--accent-dim);
    border: 1px solid var(--accent-glow);
    font-family: 'Syne', sans-serif;
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--accent);
    margin-bottom: 20px;
  }
  .md-section__title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.3rem, 2.6vw, 1.55rem);
    font-weight: 700;
    margin-bottom: 16px;
  }
  .md-section__body {
    font-size: 0.96rem;
    line-height: 1.85;
    color: var(--txt-secondary);
    font-weight: 300;
  }
  .md-section__body p { margin-bottom: 16px; }

  /* callouts & lists */
  .md-callout {
    margin: 24px 0;
    padding: 20px 24px;
    border-radius: 16px;
    border-left: 4px solid var(--accent);
    background: var(--accent-dim);
  }
  .md-callout--purple {
    border-left-color: var(--accent2);
    background: var(--accent2-dim);
  }
  .md-list {
    list-style: none;
    padding: 0;
    margin: 20px 0;
  }
  .md-list li {
    padding: 12px 0 12px 32px;
    position: relative;
    border-bottom: 1px solid var(--border);
  }
  .md-list li::before {
    content: '';
    position: absolute;
    left: 4px; top: 20px;
    width: 12px; height: 12px;
    border-radius: 4px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
  }

  /* acceptance footer */
  .md-accept {
    position: relative;
    z-index: 2;
    max-width: 1100px;
    margin: 0 auto 80px;
    padding: 0 20px;
  }
  .md-accept__card {
    background: linear-gradient(135deg, rgba(0,234,255,.08), rgba(139,92,246,.08));
    border: 1px solid var(--border-hi);
    border-radius: var(--radius-card);
    padding: 40px 36px;
    display: flex;
    align-items: center;
    gap: 32px;
    flex-wrap: wrap;
  }
  .md-accept__btn {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: white;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.94rem;
    padding: 16px 36px;
    border: none;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.25s;
    box-shadow: 0 6px 28px rgba(0,234,255,.3);
  }
  .md-accept__btn:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(0,234,255,.4);
  }
  .md-accept__btn:disabled {
    background: var(--bg-card-hi);
    box-shadow: none;
    cursor: default;
    color: var(--txt-muted);
  }

  /* responsive */
  @media (max-width: 860px) {
    .md-layout { flex-direction: column; gap: 32px; }
    .md-toc { position: relative; top: 0; width: 100%; }
    .md-toc__items { display: flex; flex-wrap: wrap; gap: 8px; }
  }
  @media (max-width: 540px) {
    .md-hero { padding: 90px 16px 48px; }
    .md-section { padding: 28px 20px; }
    .md-accept__card { padding: 28px 20px; flex-direction: column; text-align: center; }
  }
`;

/* ─── injector hook ─── */
function useCSS() {
    const done = useRef(false);
    useEffect(() => {
        if (done.current) return;
        done.current = true;
        const style = document.createElement('style');
        style.textContent = STYLES;
        document.head.appendChild(style);
        return () => document.head.removeChild(style); // cleanup on unmount
    }, []);
}

/* ─── TERMS DATA (updated) ─── */
const SECTIONS = [
    {
        id: 'acceptance',
        title: 'Acceptance of Terms',
        body: [
            'By accessing or using MasterDesk — including our website, dashboard, mobile apps, APIs, or any related services — you agree to be legally bound by these Terms and Conditions.',
            'If you do not accept any part of these terms, you must immediately stop using our services.',
        ],
        callout: { type: 'default', title: 'Important', text: 'These terms apply to everyone — free users, subscribers, and API users alike.' },
    },
    {
        id: 'services',
        title: 'Our Services',
        body: [
            'MasterDesk provides cloud-based productivity, collaboration, and business management tools under a subscription model.',
        ],
        list: [
            'Project & task management dashboards',
            'Team communication & file sharing',
            'Automated billing & subscription handling',
            'Analytics, reports & insights',
            'API & third-party integrations (higher tiers)',
        ],
    },
    {
        id: 'subscriptions',
        title: 'Subscriptions & Payments',
        body: [
            'All paid plans are recurring (monthly or yearly). Yearly plans usually include a discount.',
            'You must keep a valid payment method on file. We may suspend access if payment fails repeatedly.',
        ],
        callout: { type: 'purple', title: 'Payment Info', text: 'Transactions are securely processed. You’ll receive receipts via email after every charge.' },
    },
    {
        id: 'user-content',
        title: 'User Content & Responsibility',
        body: [
            'You are fully responsible for any content you upload, share, or generate using MasterDesk.',
            'We do not claim ownership of your content, but you grant us a limited license to store, process, and display it as needed to provide the service.',
        ],
        list: [
            'Do not upload illegal, infringing, or harmful material',
            'You must comply with all applicable laws in Bangladesh and your jurisdiction',
        ],
    },
    {
        id: 'refunds',
        title: 'Refunds & Cancellation',
        body: [
            'You may cancel your subscription anytime from your account. Access continues until the end of the current billing period — no pro-rated refunds.',
            'Refund requests due to technical issues are reviewed case-by-case (submit within 7 days).',
        ],
    },
    {
        id: 'usage',
        title: 'Acceptable Use',
        body: [
            'You may use MasterDesk only for lawful purposes and in accordance with these terms.',
        ],
        list: [
            'No malware, spam, phishing, or illegal content',
            'No reverse-engineering, scraping, or unauthorized automation',
            'No sharing of accounts or credentials with unauthorized persons',
        ],
    },
    {
        id: 'ip',
        title: 'Intellectual Property',
        body: [
            'MasterDesk (including design, code, branding) remains our property. Your use is licensed only during active subscription.',
            'Your own documents, projects, and data remain yours.',
        ],
    },
    {
        id: 'liability',
        title: 'Limitation of Liability',
        body: [
            'To the fullest extent allowed by law, we are not liable for indirect, consequential, or punitive damages.',
            'Our maximum liability is limited to the amount you paid us in the last 12 months.',
        ],
        callout: { type: 'default', title: 'Legal Note', text: 'This applies even if we were informed of possible damages.' },
    },
    {
        id: 'termination',
        title: 'Termination & Suspension',
        body: [
            'We may suspend or terminate access for violation of these terms, illegal activity, or non-payment — sometimes without prior notice.',
            'You may terminate your account anytime from settings.',
        ],
    },
    {
        id: 'governing',
        title: 'Governing Law & Disputes',
        body: [
            'These terms are governed by the laws of Bangladesh.',
            'Disputes shall first be attempted to be resolved amicably. If unresolved, they shall be subject to arbitration in Dhaka under the Arbitration Act, 2001.',
        ],
    },
    {
        id: 'changes',
        title: 'Changes to Terms',
        body: [
            'We may update these terms. Significant changes will be notified via email or in-app message at least 14 days in advance.',
            'Continued use after the effective date = acceptance.',
        ],
    },
];

/* ─── tiny inline icons ─── */
const CalIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
const ClockIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const ShieldIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
const CheckIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>;

/* ─── MAIN COMPONENT ─── */
const TermsAndConditions = () => {
    useCSS();

    const [activeId, setActiveId] = useState(SECTIONS[0].id);
    const [scrollPct, setScrollPct] = useState(0);
    const [accepted, setAccepted] = useState(false);

    const sectionRefs = useRef({});

    const onScroll = useCallback(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        setScrollPct(docHeight ? Math.min((scrollTop / docHeight) * 100, 100) : 0);

        let current = SECTIONS[0].id;
        for (const sec of SECTIONS) {
            const el = sectionRefs.current[sec.id];
            if (el?.getBoundingClientRect().top <= 180) current = sec.id;
        }
        setActiveId(current);
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [onScroll]);

    const scrollTo = (id) => {
        sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="md-tc-wrap">
            <div className="md-blob md-blob--1" />
            <div className="md-blob md-blob--2" />
            <div className="md-blob md-blob--3" />

            <header className="md-hero">
                <div className="md-hero__badge">
                    <span className="md-hero__badge-dot" />
                    Last updated · February 2026
                </div>
                <h1 className="md-hero__title">
                    Terms &<br /><em>Conditions</em>
                </h1>
                <p className="md-hero__sub">
                    Please read these terms carefully before using MasterDesk services.
                </p>
                <div className="md-hero__meta">
                    <span><CalIcon /> Effective February 3, 2026</span>
                    <span><ClockIcon /> ~9 min read</span>
                    <span><ShieldIcon /> Legally binding</span>
                </div>
            </header>

            <div className="md-layout">
                <nav className="md-toc">
                    <div className="md-toc__label">CONTENTS</div>
                    <div className="md-toc__items">
                        {SECTIONS.map((sec, i) => (
                            <div
                                key={sec.id}
                                className={`md-toc__item ${activeId === sec.id ? 'md-toc__item--active' : ''}`}
                                onClick={() => scrollTo(sec.id)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={e => e.key === 'Enter' && scrollTo(sec.id)}
                            >
                                <span className="md-toc__dot" />
                                <span className="md-toc__txt">{i + 1}. {sec.title}</span>
                            </div>
                        ))}
                    </div>
                    <div className="md-toc__progress">
                        <div className="md-toc__progress-bar-bg">
                            <div className="md-toc__progress-bar" style={{ width: `${scrollPct}%` }} />
                        </div>
                        <div className="md-toc__progress-lbl">{Math.round(scrollPct)}% read</div>
                    </div>
                </nav>

                <main className="md-content">
                    {SECTIONS.map((sec, i) => (
                        <section
                            key={sec.id}
                            id={sec.id}
                            ref={el => { sectionRefs.current[sec.id] = el; }}
                            className="md-section"
                            style={{ animationDelay: `${i * 0.07}s` }}
                        >
                            <div className="md-section__num">{(i + 1).toString().padStart(2, '0')}</div>
                            <h2 className="md-section__title">{sec.title}</h2>
                            <div className="md-section__body">
                                {sec.body.map((p, j) => <p key={j}>{p}</p>)}
                                {sec.callout && (
                                    <div className={`md-callout ${sec.callout.type === 'purple' ? 'md-callout--purple' : ''}`}>
                                        <strong>{sec.callout.title}</strong>
                                        <p>{sec.callout.text}</p>
                                    </div>
                                )}
                                {sec.list && (
                                    <ul className="md-list">
                                        {sec.list.map((item, j) => <li key={j}>{item}</li>)}
                                    </ul>
                                )}
                            </div>
                        </section>
                    ))}
                </main>
            </div>

            <div className="md-accept">
                <div className="md-accept__card">
                    <div className="md-accept__text">
                        <h4>{accepted ? '✓ Terms Accepted' : 'Ready to proceed?'}</h4>
                        <p>
                            {accepted
                                ? 'Thank you! You have accepted the MasterDesk Terms & Conditions.'
                                : 'By clicking below you confirm that you have read and agree to all terms above.'}
                        </p>
                    </div>
                    <button
                        className="md-accept__btn"
                        onClick={() => setAccepted(true)}
                        disabled={accepted}
                    >
                        {accepted ? <><CheckIcon /> Accepted</> : 'I Agree & Continue'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;