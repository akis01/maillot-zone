/* MAILLOT ZONE
   1. utilitaires  2. présentoir tournant (photos ou séquence d'images Veo)  3. défilement (GSAP ScrollTrigger)
   4. bandeau et vitrine 360°  5. collection et aperçu  6. rendez-vous WhatsApp  7. menu mobile */
(() => {
  "use strict";
  const D = window.MZ;
  const $ = (s, r = document) => r.querySelector(s);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const smooth = (t) => t * t * (3 - 2 * t);
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const easeIn = (t) => t * t * t;
  const CAT = { club: "Clubs", selection: "Sélections", special: "Éditions spéciales" };
  const hasGsap = !!(window.gsap && window.ScrollTrigger);

  /* ======================= 1. UTILITAIRES ======================= */
  const waLink = (msg) => `https://wa.me/${D.whatsapp}?text=${encodeURIComponent(msg)}`;
  const askMsg = (m) => `Bonjour Maillot Zone ! Je suis intéressé(e) par le maillot ${m.equipe} (${m.version}). Est-il disponible ? Quel est le prix ?`;
  document.querySelectorAll("[data-wa]").forEach((a) => { a.href = waLink("Bonjour Maillot Zone ! "); });
  $("#year").textContent = new Date().getFullYear();

  const toastEl = $("#toast");
  let toastT;
  function toast(msg) { toastEl.textContent = msg; toastEl.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove("show"), 2600); }
  function openExternal(url) {
    const a = document.createElement("a");
    a.href = url; a.target = "_blank"; a.rel = "noopener";
    document.body.append(a); a.click(); a.remove();
  }
  const top = $("#top");
  addEventListener("scroll", () => top.classList.toggle("scrolled", scrollY > 8), { passive: true });

  /* ======================= 2. PRÉSENTOIR TOURNANT ======================= */
  const V = (D.vedettes || []).map((v) => ({ ...D.maillots.find((m) => m.id === v.id), ...v })).filter((v) => v.image && v.equipe);
  const spin = $("#tt-spin"), shadow = $("#tt-shadow"), tag = $("#tt-tag"), dotsBox = $("#tt-dots");
  V.forEach((v, i) => {
    const img = new Image();
    img.src = v.image; img.alt = `Maillot ${v.equipe} ${v.version}`; img.decoding = "async";
    img.hidden = i !== 0;
    spin.append(img); v.el = img;
    dotsBox.append(document.createElement("i"));
  });
  const canvas = document.createElement("canvas"); canvas.hidden = true; spin.append(canvas);
  const cctx = canvas.getContext("2d");

  // séquence d'images extraites d'une vidéo 360° : 001.webp, 002.webp…
  const frameUrl = (v, k) => `${v.rotation.dossier}${String(k + 1).padStart(3, "0")}.${v.rotation.extension || "webp"}`;
  function loadFrames(v) {
    if (!v.rotation || v.frames) return;
    const n = v.rotation.images;
    v.frames = new Array(n); v.loaded = 0;
    // d'abord une image sur 8 (le tour est vite jouable), puis on complète
    const order = [], seen = new Set();
    [8, 4, 2, 1].forEach((step) => { for (let k = 0; k < n; k += step) if (!seen.has(k)) { seen.add(k); order.push(k); } });
    let next = 0;
    const pump = () => {
      if (next >= order.length) return;
      const k = order[next++], im = new Image();
      im.onload = () => { v.frames[k] = im; v.loaded++; dirty = true; pump(); };
      im.onerror = pump;
      im.src = frameUrl(v, k);
    };
    for (let c = 0; c < 4; c++) pump();
  }
  function nearestFrame(v, k) {
    for (let d = 0; d < v.frames.length; d++) {
      if (v.frames[k - d]) return v.frames[k - d];
      if (v.frames[k + d]) return v.frames[k + d];
    }
    return null;
  }
  function drawFrame(v, local) {
    const n = v.rotation.images, k = Math.min(n - 1, Math.round(local * (n - 1)));
    const im = nearestFrame(v, k);
    if (!im) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const W = Math.round(spin.offsetWidth * dpr), H = Math.round(spin.offsetHeight * dpr);
    if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
    const s = Math.min(W / im.naturalWidth, H / im.naturalHeight), w = im.naturalWidth * s, h = im.naturalHeight * s;
    cctx.fillStyle = "#fff"; cctx.fillRect(0, 0, W, H);
    cctx.drawImage(im, (W - w) / 2, (H - h) / 2, w, h);
  }

  let active = -1;
  function setActive(i) {
    active = i;
    const v = V[i], n = V.length;
    V.forEach((x, j) => { x.el.hidden = j !== i; });
    $("#tt-count").textContent = `${String(i + 1).padStart(2, "0")} / ${String(n).padStart(2, "0")}`;
    $("#tt-cat").textContent = CAT[v.categorie] || "";
    $("#tt-team").textContent = v.equipe;
    $("#tt-ver").textContent = v.version;
    $("#tt-desc").textContent = v.description || "";
    $("#tt-desc").hidden = !v.description;
    $("#tt-ask").href = waLink(askMsg(v));
    [...dotsBox.children].forEach((d, j) => d.classList.toggle("on", j === i));
    tag.classList.remove("swap"); void tag.offsetWidth; tag.classList.add("swap");
    // on précharge la séquence de ce maillot et du suivant
    loadFrames(v); if (V[i + 1]) loadFrames(V[i + 1]);
  }

  function renderTT(p) {
    const n = V.length;
    if (!n) return;
    const f = clamp(p, 0, 0.99999) * n, i = Math.floor(f), local = f - i, v = V[i];
    if (i !== active) setActive(i);
    const seq = !!(v.rotation && v.frames && v.loaded > 0);
    let angle = 0, alpha = 1;
    if (seq) {
      // vraie rotation : on fait défiler les images de la vidéo, fondu entre deux maillots
      drawFrame(v, local);
      if (i > 0) alpha *= smooth(clamp(local / 0.12));
      if (i < n - 1) alpha *= 1 - smooth(clamp((local - 0.88) / 0.12));
    } else if (reduce) {
      if (i > 0) alpha *= smooth(clamp(local / 0.15));
      if (i < n - 1) alpha *= 1 - smooth(clamp((local - 0.85) / 0.15));
    } else {
      // photo : léger pivot, puis demi-tour ; on change de maillot quand il est de profil
      if (i > 0 && local < 0.2) angle = -90 + 78 * easeOut(local / 0.2);
      else if (i < n - 1 && local > 0.8) angle = 12 + 78 * easeIn((local - 0.8) / 0.2);
      else {
        const a = i > 0 ? 0.2 : 0, b = i < n - 1 ? 0.8 : 1, t = (local - a) / (b - a);
        angle = i === 0 ? 12 * t : i === n - 1 ? -12 * (1 - t) : -12 + 24 * t;
      }
    }
    canvas.hidden = !seq; v.el.hidden = seq;
    const c = Math.abs(Math.cos(angle * Math.PI / 180));
    const lift = 1 + Math.sin(Math.PI * local) * 0.03;
    spin.style.transform = `perspective(1400px) rotateY(${angle.toFixed(2)}deg) scale(${lift.toFixed(4)})`;
    spin.style.opacity = alpha.toFixed(3);
    shadow.style.transform = `translateX(-50%) scaleX(${(0.35 + 0.65 * c).toFixed(3)})`;
    shadow.style.opacity = ((0.4 + 0.6 * c) * alpha * (seq ? 0.55 : 1)).toFixed(3);
  }

  let heroP = 0, cur = 0, last = -1, dirty = true, heroVisible = true;
  new IntersectionObserver(([en]) => { heroVisible = en.isIntersecting; }).observe($(".stage"));
  (function ttLoop() {
    requestAnimationFrame(ttLoop);
    if (!heroVisible) return;
    if (!hasGsap && !reduce) heroP = (performance.now() / 18000) % 1;   // sans GSAP : défilement automatique
    cur += (heroP - cur) * (reduce ? 1 : 0.14);
    if (Math.abs(heroP - cur) < 0.00005) cur = heroP;
    if (cur === last && !dirty) return;
    last = cur; dirty = false;
    renderTT(cur);
  })();
  addEventListener("resize", () => { dirty = true; });

  /* ======================= 3. DÉFILEMENT ======================= */
  const hint = $(".scroll-hint");
  function initScroll() {
    if (!hasGsap) return;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    ScrollTrigger.create({
      trigger: "#hero", start: "top top", end: `+=${Math.max(2, V.length) * 100}%`, pin: true, anticipatePin: 1,
      onUpdate: (s) => { heroP = s.progress; hint.style.opacity = heroP > 0.02 ? 0 : 1; }
    });
    ScrollTrigger.create({
      trigger: "#vitrine", start: "top top", end: "+=220%", pin: true, anticipatePin: 1,
      onUpdate: (s) => { ringTarget = -20 - s.progress * 340; }
    });
    if (!reduce) {
      gsap.from(".intro > *, .actions", { y: 36, duration: 1, ease: "power3.out", stagger: 0.08 });
      gsap.utils.toArray(".sec-head, .step-list li, .reach-card, .rdv").forEach((el) => {
        gsap.from(el, { y: 44, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 92%" } });
      });
    }
    addEventListener("load", () => ScrollTrigger.refresh());
  }

  /* ======================= 4. BANDEAU ET VITRINE 360° ======================= */
  const teams = [...new Set(D.maillots.map((m) => m.equipe))];
  const ball = '<svg aria-hidden="true"><use href="#i-ball"/></svg>';
  const once = teams.map((t) => `<span>${t.replace(/[<>&]/g, "")}${ball}</span>`).join("");
  $("#marquee").innerHTML = once + once;

  const RING_IDS = ["psg-domicile-hechter", "barca-domicile", "real-madrid-domicile", "cote-divoire-domicile", "senegal-exterieur", "bresil-domicile-retro",
    "ac-milan-domicile", "man-city-domicile", "inter-miami-domicile", "algerie-domicile", "atletico-domicile", "liverpool-exterieur"];
  const ringItems = RING_IDS.map((id) => D.maillots.find((m) => m.id === id)).filter(Boolean);
  const ring = $("#ring");
  $("#ring-count").textContent = D.maillots.length;
  ringItems.forEach((m) => {
    const f = document.createElement("figure");
    const img = document.createElement("img"); img.src = m.image; img.alt = `Maillot ${m.equipe} ${m.version}`; img.loading = "lazy";
    img.style.background = m.fond;
    const cap = document.createElement("figcaption"); cap.textContent = m.equipe;
    f.append(img, cap); ring.append(f);
  });
  let ringTarget = -20, ringCur = -20, ringR = 0, ringVisible = false;
  function layoutRing() {
    const w = ring.offsetWidth, n = ringItems.length;
    ringR = Math.round((w / 2) / Math.tan(Math.PI / n) * 1.16);
    [...ring.children].forEach((f, i) => { f.style.transform = `rotateY(${(360 / n) * i}deg) translateZ(${ringR}px)`; });
  }
  layoutRing(); addEventListener("resize", layoutRing);
  new IntersectionObserver(([en]) => { ringVisible = en.isIntersecting; }).observe($(".ring-stage"));
  (function ringLoop() {
    requestAnimationFrame(ringLoop);
    if (!ringVisible) return;
    if (!hasGsap && !reduce) ringTarget -= 0.08;
    ringCur += (ringTarget - ringCur) * 0.08;
    ring.style.transform = `translateZ(${-ringR}px) rotateX(-6deg) rotateY(${ringCur.toFixed(2)}deg)`;
  })();

  /* ======================= 5. COLLECTION ET APERÇU ======================= */
  const grid = $("#grid"), filters = $("#filters");
  let filter = "all";
  const FILTERS = [["all", "Tous"], ["club", "Clubs"], ["selection", "Sélections"], ["special", "Éditions spéciales"]];
  filters.innerHTML = FILTERS.map(([k, label]) => {
    const n = k === "all" ? D.maillots.length : D.maillots.filter((m) => m.categorie === k).length;
    return `<button type="button" role="tab" data-f="${k}" aria-selected="${k === "all"}">${label}<span>${n}</span></button>`;
  }).join("");
  filters.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    filter = b.dataset.f;
    filters.querySelectorAll("button").forEach((x) => x.setAttribute("aria-selected", x === b));
    b.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
    renderGrid(true);
  });

  function renderGrid(animate) {
    grid.replaceChildren();
    D.maillots.filter((m) => filter === "all" || m.categorie === filter).forEach((m) => {
      const card = document.createElement("button");
      card.type = "button"; card.className = "card";
      card.setAttribute("aria-label", `${m.equipe}, maillot ${m.version}. Voir en grand`);
      const ph = document.createElement("div"); ph.className = "ph"; ph.style.background = m.fond;
      const img = document.createElement("img"); img.src = m.image; img.alt = ""; img.loading = "lazy"; img.decoding = "async";
      ph.append(img);
      const info = document.createElement("div"); info.className = "info";
      const team = document.createElement("span"); team.className = "team"; team.textContent = m.equipe;
      const ver = document.createElement("span"); ver.className = "ver"; ver.textContent = m.version;
      info.append(team, ver);
      const ask = document.createElement("span"); ask.className = "ask"; ask.innerHTML = '<svg aria-hidden="true"><use href="#i-chat"/></svg>';
      card.append(ph, info, ask);
      card.addEventListener("click", () => openLightbox(m));
      if (finePointer && !reduce) {
        card.addEventListener("pointermove", (e) => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform = `perspective(900px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg) translateY(-4px)`;
        });
        card.addEventListener("pointerleave", () => { card.style.transform = ""; });
      }
      grid.append(card);
    });
    if (hasGsap && !reduce) {
      if (animate) gsap.from(grid.children, { y: 30, duration: 0.6, ease: "power3.out", stagger: 0.025, clearProps: "transform" });
      else ScrollTrigger.batch(grid.children, { start: "top 94%", once: true,
        onEnter: (els) => gsap.from(els, { y: 60, rotateX: -12, transformPerspective: 900, duration: 0.9, ease: "power3.out", stagger: 0.05, clearProps: "transform" }) });
    }
  }

  const lb = $("#lightbox");
  let lbItem = null;
  function openLightbox(m) {
    lbItem = m;
    $("#lb-img").src = m.image; $("#lb-img").alt = `Maillot ${m.equipe} ${m.version}`;
    $("#lb-img-wrap").style.background = m.fond;
    $("#lb-cat").textContent = CAT[m.categorie] || "";
    $("#lb-title").textContent = m.equipe;
    $("#lb-version").textContent = m.version;
    $("#lb-desc").textContent = m.description || "";
    $("#lb-desc").hidden = !m.description;
    $("#lb-wa").href = waLink(askMsg(m));
    lb.showModal();
  }
  $("#lb-close").addEventListener("click", () => lb.close());
  lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
  $("#lb-rdv").addEventListener("click", () => {
    lb.close();
    if (lbItem) $("#f-maillot").value = lbItem.id;
    $("#contact").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    setTimeout(() => $("#f-nom").focus({ preventScroll: true }), 700);
  });

  /* ======================= 6. RENDEZ-VOUS WHATSAPP ======================= */
  const sel = $("#f-maillot");
  Object.entries(CAT).forEach(([k, label]) => {
    const og = document.createElement("optgroup"); og.label = label;
    D.maillots.filter((m) => m.categorie === k).forEach((m) => {
      const o = document.createElement("option"); o.value = m.id; o.textContent = `${m.equipe} · ${m.version}`; og.append(o);
    });
    sel.append(og);
  });
  const dateIn = $("#f-date");
  dateIn.min = new Date().toISOString().slice(0, 10);

  $("#rdv").addEventListener("submit", (e) => {
    e.preventDefault();
    const err = $("#rdv-error");
    const nom = $("#f-nom").value.trim();
    if (!nom) { err.textContent = "Indique ton nom pour qu'on sache qui vient."; err.hidden = false; $("#f-nom").focus(); return; }
    err.hidden = true;
    const m = D.maillots.find((x) => x.id === sel.value);
    const date = dateIn.value ? new Date(dateIn.value + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }) : "à convenir";
    const lines = [
      "Bonjour Maillot Zone ! Je voudrais prendre rendez-vous pour un essayage.",
      `Nom : ${nom}`,
      `Maillot : ${m ? `${m.equipe} (${m.version})` : "je ne sais pas encore"}`,
      `Taille : ${$("#f-taille").value}`,
      `Date souhaitée : ${date}`
    ];
    const msg = $("#f-msg").value.trim();
    if (msg) lines.push(`Message : ${msg}`);
    openExternal(waLink(lines.join("\n")));
    toast("WhatsApp s'ouvre avec ton message");
  });

  $("#copy-phone").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(D.telephone); toast("Numéro copié"); }
    catch (e) {
      const r = document.createRange(); r.selectNodeContents($("#phone"));
      const s = getSelection(); s.removeAllRanges(); s.addRange(r); toast("Numéro sélectionné");
    }
  });

  /* ======================= 7. MENU MOBILE ======================= */
  const menu = $("#menu"), menuBtn = $("#menu-btn");
  menuBtn.addEventListener("click", () => { menu.showModal(); menuBtn.setAttribute("aria-expanded", "true"); });
  menu.addEventListener("close", () => menuBtn.setAttribute("aria-expanded", "false"));
  $("#menu-close").addEventListener("click", () => menu.close());
  menu.querySelectorAll(".menu-links a").forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute("href"));
    menu.close();
    if (target) target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }));

  renderGrid(false);
  initScroll();
})();
