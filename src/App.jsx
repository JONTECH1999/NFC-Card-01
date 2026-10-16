import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

const profile = {
  name: "Aljon Alonzo",
  business: "Jontech",
  role: "Website & Digital Business Associate",
  phone: "0951 364 4817",
  phoneLink: "+639513644817",
  email: "aljonrisasalonzo@gmail.com",
  address:
    "Brgy. 185, North B12, L9 Manggahan Road, Barangay 185, Caloocan, Metro Manila",
  facebook: "https://www.facebook.com/aljon11onsi/",
  youtube: "https://www.youtube.com/@aljonalonzo2195",
  instagram: "https://www.instagram.com/aljon_alonzo/",
};

const actions = [
  {
    label: "Call",
    icon: "fa-solid fa-phone",
    href: `tel:${profile.phoneLink}`,
    ariaLabel: `Call ${profile.name} at ${profile.phone}`,
    primary: true,
  },
  {
    label: "Email",
    icon: "fa-regular fa-envelope",
    href: `mailto:${profile.email}`,
    ariaLabel: `Email ${profile.name}`,
    primary: true,
  },
  {
    label: "Text",
    icon: "fa-regular fa-comment-dots",
    href: `sms:${profile.phoneLink}`,
    ariaLabel: `Text ${profile.name}`,
    primary: true,
  },
  {
    label: "Facebook",
    icon: "fa-brands fa-facebook-f",
    href: profile.facebook,
    ariaLabel: `${profile.business} on Facebook`,
    external: true,
    social: true,
  },
  {
    label: "YouTube",
    icon: "fa-brands fa-youtube",
    href: profile.youtube,
    ariaLabel: `${profile.business} on YouTube`,
    external: true,
    social: true,
  },
  {
    label: "Instagram",
    icon: "fa-brands fa-instagram",
    href: profile.instagram,
    ariaLabel: `${profile.business} on Instagram`,
    external: true,
    social: true,
  },
  {
    label: "Shop location",
    icon: "fa-solid fa-location-dot",
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.address)}`,
    ariaLabel: `Find ${profile.business} at ${profile.address}`,
    external: true,
  },
];

const products = [
  {
    name: "Website Design & Development",
    image:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=720&q=85",
    alt: "Brand identity colors and design materials",
  },
  {
    name: "Digital Business Cards",
    image:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=720&q=85",
    alt: "Social media campaign displayed on a phone",
  },
  {
    name: "Small Business Websites",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=720&q=85",
    alt: "Team planning a marketing strategy together",
  },
  {
    name: "Online Store Setup",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=720&q=85",
    alt: "Website analytics and design on a laptop",
  },
  {
    name: "Website Maintenance & Support",
    image:
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=720&q=85",
    alt: "Camera prepared for professional content creation",
  },
];

function ActionLink({ action }) {
  const className = [
    "action",
    action.primary && "primary",
    action.social && "social",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <a
      className={className}
      href={action.href}
      aria-label={action.ariaLabel}
      {...(action.external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      <i className={action.icon} aria-hidden="true" />
      <span>{action.label}</span>
    </a>
  );
}

function getInstallGuide() {
  const userAgent = navigator.userAgent;
  const isIOS =
    /iPad|iPhone|iPod/.test(userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);

  if (isIOS) {
    return {
      browser: "On iPhone or iPad",
      steps: [
        "Open this page in Safari.",
        "Tap the Share button.",
        "Choose Add to Home Screen, then tap Add.",
      ],
    };
  }

  if (isAndroid) {
    return {
      browser: "On Android",
      steps: [
        "Open this page in Chrome or your preferred browser.",
        "Open the browser menu (⋮).",
        "Choose Install app or Add to Home screen, then confirm.",
      ],
    };
  }

  if (isSafari) {
    return {
      browser: "In Safari on Mac",
      steps: [
        "Open the File menu.",
        "Choose Add to Dock.",
        "Confirm to add Jontech to your Dock and apps.",
      ],
    };
  }

  return {
    browser: "On this computer",
    steps: [
      "Open this page in Chrome or Microsoft Edge.",
      "Select the install icon in the address bar, or open the browser menu.",
      "Choose Install page as app or Install Jontech, then confirm.",
    ],
  };
}

function App() {
  const [introPhase, setIntroPhase] = useState("loading");
  const [tapRipple, setTapRipple] = useState(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [installHelpOpen, setInstallHelpOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [installPrompt, setInstallPrompt] = useState(null);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("nfc_card_theme") || "dark";
    } catch {
      return "dark";
    }
  });
  const toastTimer = useRef(null);
  const rippleTimer = useRef(null);
  const pageRef = useRef(null);
  const qrButton = useRef(null);
  const closeButton = useRef(null);
  const installButton = useRef(null);
  const installCloseButton = useRef(null);
  const installHelpWasOpen = useRef(false);

  useLayoutEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute(
        "content",
        theme === "light" ? "#f6f1e8" : "#0b1120"
      );
    }
  }, [theme]);

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    try {
      localStorage.setItem("nfc_card_theme", nextTheme);
    } catch (e) {
      console.error("Could not save theme preference:", e);
    }
    document.documentElement.setAttribute("data-theme", nextTheme);
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute(
        "content",
        nextTheme === "light" ? "#f6f1e8" : "#0b1120"
      );
    }
    showToast(
      nextTheme === "light"
        ? "Switched to Warm Beige view"
        : "Switched to Classic Dark view"
    );
  }

  useEffect(() => {
    if (pageRef.current) pageRef.current.inert = introPhase !== "done";
  }, [introPhase]);

  useEffect(() => {
    function handleInstallAvailable(event) {
      event.preventDefault();
      setInstallPrompt(event);
    }

    function handleAppInstalled() {
      setInstallPrompt(null);
      setInstallHelpOpen(false);
      showToast("Jontech was added to your apps.");
    }

    window.addEventListener("beforeinstallprompt", handleInstallAvailable);
    window.addEventListener("appinstalled", handleAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallAvailable);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const revealDelay = reducedMotion ? 80 : 1550;
    const exitDelay = reducedMotion ? 0 : 650;
    const revealTimer = window.setTimeout(
      () => setIntroPhase("exiting"),
      revealDelay,
    );
    const finishTimer = window.setTimeout(
      () => setIntroPhase("done"),
      revealDelay + exitDelay,
    );

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(finishTimer);
      window.clearTimeout(toastTimer.current);
      window.clearTimeout(rippleTimer.current);
    };
  }, []);

  useEffect(() => {
    if (qrOpen) closeButton.current?.focus();
  }, [qrOpen]);

  useEffect(() => {
    if (installHelpOpen) {
      installHelpWasOpen.current = true;
      installCloseButton.current?.focus();
    } else if (installHelpWasOpen.current) {
      installHelpWasOpen.current = false;
      installButton.current?.focus();
    }
  }, [installHelpOpen]);

  const installGuide = getInstallGuide();

  function showToast(message) {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 3200);
  }

  function closeQR() {
    setQrOpen(false);
    window.requestAnimationFrame(() => qrButton.current?.focus());
  }

  function closeInstallHelp() {
    setInstallHelpOpen(false);
  }

  function animateCardTap(event) {
    if (
      event.target instanceof Element &&
      event.target.closest("a, button")
    ) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const ripple = {
      id: Date.now(),
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    };
    setTapRipple(ripple);
    window.clearTimeout(rippleTimer.current);
    rippleTimer.current = window.setTimeout(() => setTapRipple(null), 850);
  }

  async function shareCard() {
    const shareData = {
      title: `${profile.name} | ${profile.business}`,
      text: `Connect with ${profile.name}, ${profile.role} at ${profile.business}.`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Business card link copied.");
      } else {
        const input = document.createElement("textarea");
        input.value = window.location.href;
        input.setAttribute("readonly", "");
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.appendChild(input);
        input.select();
        const copied = document.execCommand("copy");
        input.remove();
        if (!copied) throw new Error("The browser did not copy the link.");
        showToast("Business card link copied.");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Unable to share business card:", error);
        showToast(
          "Unable to share the link. Please copy it from your browser address bar.",
        );
      }
    }
  }

  async function installCard() {
    const isInstalled =
      window.matchMedia("(display-mode: standalone)").matches ||
      navigator.standalone === true;

    if (isInstalled) {
      showToast("Jontech is already open as an app.");
      return;
    }

    if (installPrompt) {
      try {
        await installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;
        setInstallPrompt(null);
        if (outcome === "accepted") {
          showToast("Jontech was added to your apps.");
        } else {
          setInstallHelpOpen(true);
        }
      } catch (error) {
        console.error("Unable to install Jontech:", error);
        setInstallHelpOpen(true);
      }
      return;
    }

    setInstallHelpOpen(true);
  }

  useEffect(() => {
    if (!qrOpen && !installHelpOpen) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        if (installHelpOpen) closeInstallHelp();
        else closeQR();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [qrOpen, installHelpOpen]);

  return (
    <>
      {introPhase !== "done" && (
        <div
          className={`intro-screen${introPhase === "exiting" ? " is-exiting" : ""}`}
          role="status"
          aria-live="polite"
          aria-label="Preparing your introduction"
        >
          <div className="intro-content">
            <div className="intro-emblem">
              <span className="intro-orbit intro-orbit-one" />
              <span className="intro-orbit intro-orbit-two" />
              <span className="intro-emblem-core">
                <i className="fa-solid fa-arrow-trend-up" />
              </span>
            </div>
            <p className="intro-eyebrow">A personal introduction</p>
            <p className="intro-brand">{profile.business}</p>
            <div className="intro-loader" role="presentation">
              <span />
            </div>
            <p className="intro-caption">Preparing your introduction</p>
          </div>
        </div>
      )}

      {introPhase === "done" && (
        <aside className="top-controls" aria-label="Theme settings">
          <button
            className="theme-toggle-btn"
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "light"
                ? "Switch to Classic Dark mode"
                : "Switch to Warm Beige mode"
            }
            title={
              theme === "light"
                ? "Switch to Classic Dark mode"
                : "Switch to Warm Beige mode"
            }
          >
            <span className="theme-toggle-icon" aria-hidden="true">
              <i
                className={
                  theme === "light" ? "fa-solid fa-moon" : "fa-solid fa-sun"
                }
              />
            </span>
            <span className="theme-toggle-label">
              {theme === "light" ? "Classic Dark" : "Warm Beige"}
            </span>
          </button>
        </aside>
      )}

      <main
        ref={pageRef}
        className="page"
        aria-hidden={introPhase !== "done"}
      >
        <article
          className={`business-card${introPhase === "loading" ? " is-loading" : " is-entering"}${tapRipple ? " is-tapped" : ""}`}
          aria-labelledby="person-name"
          onClick={animateCardTap}
        >
          {tapRipple && (
            <>
              <span
                key={`sweep-${tapRipple.id}`}
                className="card-light-sweep"
                aria-hidden="true"
              />
              <span
                key={`ripple-${tapRipple.id}`}
                className="card-ripple"
                style={{ left: tapRipple.x, top: tapRipple.y }}
                aria-hidden="true"
              />
            </>
          )}
          <section className="profile-panel" aria-label="Business owner profile">
            <img
              className="profile-photo"
              src="/aljon-profile.jfif"
              alt={`Portrait of ${profile.name}`}
              onError={(event) => {
                event.currentTarget.hidden = true;
              }}
            />
            <div className="profile-copy">
              <p className="eyebrow">Your digital growth partner</p>
              <h1 id="person-name">{profile.name}</h1>
              <p className="role">{profile.role}</p>
              <div className="company-name">
                <span className="company-icon">
                  <i className="fa-solid fa-arrow-trend-up" aria-hidden="true" />
                </span>
                <span>{profile.business}</span>
              </div>
            </div>
          </section>

          <section className="details-panel" aria-labelledby="about-heading">
            <p className="section-kicker">Let&apos;s build something great</p>
            <h2 id="about-heading">{profile.business}</h2>
            <p className="actions-label">Connect with {profile.name}</p>
            <nav className="action-grid" aria-label="Contact and social links">
              {actions.map((action) => (
                <ActionLink action={action} key={action.label} />
              ))}
              <button
                className="action"
                ref={qrButton}
                type="button"
                aria-label="Show QR code for this business card"
                onClick={() => setQrOpen(true)}
              >
                <i className="fa-solid fa-qrcode" aria-hidden="true" />
                <span>My QR code</span>
              </button>
              <button
                className="action"
                type="button"
                aria-label="Install Jontech"
                onClick={installCard}
                ref={installButton}
              >
                <i className="fa-solid fa-download" aria-hidden="true" />
                <span>Install</span>
              </button>
            </nav>
            <p className="description">
              {profile.business} helps individuals and small businesses build
              their online presence with professional websites, digital
              business cards, and practical digital support.
            </p>
            <section className="product-section" aria-labelledby="products-heading">
              <div className="product-heading">
                <div>
                  <p className="product-kicker">What we do</p>
                  <h3 id="products-heading">Featured services</h3>
                </div>
                <span className="sample-label">SAMPLE</span>
              </div>
              <div className="products-grid">
                {products.map((product) => (
                  <article className="product-card" key={product.name}>
                    <h4>{product.name}</h4>
                    <img
                      className="product-image"
                      src={product.image}
                      alt={product.alt}
                      loading="lazy"
                    />
                  </article>
                ))}
              </div>
            </section>
            <div className="contact-strip" aria-label="Direct contact details">
              <a href={`tel:${profile.phoneLink}`}>
                <i className="fa-solid fa-phone" aria-hidden="true" />
                {profile.phone}
              </a>
              <a href={`mailto:${profile.email}`}>
                <i className="fa-regular fa-envelope" aria-hidden="true" />
                {profile.email}
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.address)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-solid fa-location-dot" aria-hidden="true" />
                {profile.address}
              </a>
            </div>
          </section>
        </article>
        <p className="card-footer">
          <span>Digital business card &middot; Share this card with others</span>
          <button className="install-button" type="button" onClick={shareCard}>
            <i className="fa-solid fa-arrow-up-from-bracket" aria-hidden="true" />
            <span>Share card</span>
          </button>
        </p>
      </main>

      {installHelpOpen && (
        <div
          className="modal"
          role="presentation"
          onKeyDown={(event) => {
            if (event.key === "Escape") closeInstallHelp();
          }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeInstallHelp();
          }}
        >
          <section
            className="modal-card install-guide"
            role="dialog"
            aria-modal="true"
            aria-labelledby="install-title"
          >
            <button
              className="modal-close"
              ref={installCloseButton}
              type="button"
              aria-label="Close install instructions"
              onClick={closeInstallHelp}
            >
              <i className="fa-solid fa-xmark" aria-hidden="true" />
            </button>
            <div className="install-guide-icon" aria-hidden="true">
              <i className="fa-solid fa-mobile-screen-button" />
            </div>
            <h2 id="install-title">Install Jontech</h2>
            <p>
              Add this digital card to your device to open it from your home
              screen or apps without the browser address bar.
            </p>
            <h3>{installGuide.browser}</h3>
            <ol>
              {installGuide.steps.map((step) => <li key={step}>{step}</li>)}
            </ol>
            <button
              className="install-guide-done"
              type="button"
              onClick={closeInstallHelp}
            >
              Got it
            </button>
          </section>
        </div>
      )}

      {qrOpen && (
        <div
          className="modal"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeQR();
          }}
        >
          <section
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="qr-title"
          >
            <button
              className="modal-close"
              ref={closeButton}
              type="button"
              aria-label="Close QR code"
              onClick={closeQR}
            >
              <i className="fa-solid fa-xmark" aria-hidden="true" />
            </button>
            <h2 id="qr-title">Scan to connect</h2>
            <p>Point your camera at the code to open {profile.business}&apos;s digital card.</p>
            <div className="qr-frame">
              <QRCodeSVG
                value={window.location.href}
                size={148}
                fgColor={theme === "light" ? "#4a3319" : "#163c83"}
                level="H"
                includeMargin
              />
            </div>
          </section>
        </div>
      )}

      {toast && (
        <div className="toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </>
  );
}

export default App;
