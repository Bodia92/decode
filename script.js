const header = document.querySelector(".header");
const burger = document.querySelector(".burger");
const menu = document.querySelector(".menu");
const progress = document.getElementById("progress");
const dayline = document.getElementById("dayline");
const days = document.querySelector(".days");
const dock = document.querySelector(".dock");
const hero = document.querySelector(".hero");

function closeMenu() {
    menu.classList.remove("is-open");
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("lock");
}

burger.addEventListener("click", () => {
    const open = !menu.classList.contains("is-open");
    menu.classList.toggle("is-open", open);
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("lock", open);
});

menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
});

const navLinks = [...document.querySelectorAll(".nav a[href^='#']")];
const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

const seen = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-in");
    });
}, { threshold: 0.22, rootMargin: "0px 0px -8% 0px" });

document.querySelectorAll(".reveal, .reveal-stagger").forEach((node) => seen.observe(node));

let heroOut = false;
let choosing = false;

function syncDock() {
    dock.classList.toggle("is-on", heroOut && !choosing);
}

const dockWatch = new IntersectionObserver(([entry]) => {
    heroOut = !entry.isIntersecting;
    syncDock();
}, { threshold: 0.12 });
dockWatch.observe(hero);

const choiceWatch = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        entry.target.dataset.dock = entry.isIntersecting ? "hide" : "";
    });
    choosing = [...document.querySelectorAll("#formats, #cta")].some((node) => node.dataset.dock === "hide");
    syncDock();
}, { threshold: 0.2 });
document.querySelectorAll("#formats, #cta").forEach((node) => choiceWatch.observe(node));

if (window.matchMedia("(pointer:fine)").matches) {
    window.addEventListener("pointermove", (event) => {
        document.documentElement.style.setProperty("--mx", `${event.clientX}px`);
        document.documentElement.style.setProperty("--my", `${event.clientY}px`);
    }, { passive: true });
}

function onScroll() {
    header.classList.toggle("is-on", window.scrollY > 12);

    const height = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${height > 0 ? window.scrollY / height : 0})`;

    const rect = days.getBoundingClientRect();
    const passed = window.innerHeight * 0.35 - rect.top;
    const ratio = Math.max(0, Math.min(1, passed / rect.height));
    dayline.style.transform = `scaleY(${ratio})`;

    const mark = window.scrollY + window.innerHeight * 0.35;
    let current = null;
    sections.forEach((section) => {
        if (section.offsetTop <= mark) current = section;
    });
    navLinks.forEach((link) => {
        const on = current && link.getAttribute("href") === `#${current.id}`;
        if (on) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
    });
}

onScroll();
window.addEventListener("scroll", onScroll, { passive: true });
