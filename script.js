// Usage:
// Edit the slides array below to update the presentation.
// Keep image files in the images folder and do not rename the provided PNG files.
const slides = [
  {
    file: "01_exterior_day.png",
    title: "森に抱かれる石の別荘",
    description: "森の自然と重なり合う、静かなラグジュアリー。",
  },
  {
    file: "02_entrance_approach.png",
    title: "陰影のアプローチ",
    description: "石壁と木天井が、私邸へ入る時間をゆっくり整える。",
  },
  {
    file: "03_living_room.png",
    title: "森を眺めるラウンジ",
    description: "暖炉、石、木、ガラスが一体となる滞在の中心。",
  },
  {
    file: "04_dining_kitchen.png",
    title: "食と庭がつながる空間",
    description: "素材の質感と森の風景を楽しむダイニングキッチン。",
  },
  {
    file: "05_bathroom.png",
    title: "森を望む浴室",
    description: "森の光を受けながら、石・木・左官と浴槽が静かに調和する。",
  },
  {
    file: "06_sauna_wellness.png",
    title: "水と熱を整えるウェルネス空間",
    description: "サウナ、水風呂、外気浴が連続する私邸のための空間。",
  },
  {
    file: "07_master_bedroom.png",
    title: "森に眠る主寝室",
    description: "低く落ち着いた設えで、眠りの質を高める。",
  },
  {
    file: "08_exterior_night.png",
    title: "夜に浮かぶ石の邸宅",
    description: "軒下の光と石壁が、静かな存在感をつくる。",
  },
];

const presentation = document.querySelector("#presentation");
const slideNav = document.querySelector("#slideNav");
const controls = document.querySelectorAll("[data-direction]");
const totalImageSlides = slides.length;
let currentIndex = 0;

function formatNumber(value) {
  return String(value).padStart(2, "0");
}

function createImageSlide(slide, index) {
  const section = document.createElement("section");
  section.className = "snap-section slide";
  section.id = `slide-${formatNumber(index + 1)}`;
  section.dataset.index = String(index);

  const image = document.createElement("img");
  image.className = "slide-image";
  image.src = `images/${slide.file}`;
  image.alt = slide.title;
  image.decoding = "async";
  image.loading = index === 0 ? "eager" : "lazy";

  const caption = document.createElement("div");
  caption.className = "slide-caption";

  const title = document.createElement("h1");
  title.className = "slide-title";
  title.textContent = slide.title;

  const description = document.createElement("p");
  description.className = "slide-description";
  description.textContent = slide.description;

  const indexLabel = document.createElement("p");
  indexLabel.className = "slide-index";
  indexLabel.textContent = `${formatNumber(index + 1)} / ${formatNumber(totalImageSlides)}`;

  caption.append(title, description);
  section.append(image, caption, indexLabel);

  return section;
}

function createEndSlide(index) {
  const section = document.createElement("section");
  section.className = "snap-section end-slide";
  section.id = "proposal-end";
  section.dataset.index = String(index);

  const content = document.createElement("div");
  content.className = "end-content";

  const kicker = document.createElement("p");
  kicker.className = "end-kicker";
  kicker.textContent = "Architecture / Interior / AI Visualization";

  const title = document.createElement("h1");
  title.className = "end-title";
  title.textContent = "Design Proposal / Kakuo Architect Office";

  const subtitle = document.createElement("p");
  subtitle.className = "end-subtitle";
  subtitle.textContent = "Private Villa";

  content.append(kicker, title, subtitle);
  section.append(content);

  return section;
}

function createNavButton(index, label) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "nav-dot";
  button.dataset.index = String(index);
  button.setAttribute("aria-label", label);
  button.addEventListener("click", () => scrollToSection(index));

  return button;
}

function buildPresentation() {
  const imageSections = slides.map((slide, index) => createImageSlide(slide, index));
  const endSection = createEndSlide(imageSections.length);

  presentation.append(...imageSections, endSection);

  slides.forEach((slide, index) => {
    slideNav.append(createNavButton(index, `${formatNumber(index + 1)} ${slide.title}`));
  });
  slideNav.append(createNavButton(slides.length, "エンド画面"));
}

function getSections() {
  return Array.from(document.querySelectorAll(".snap-section"));
}

function setActiveSection(index) {
  const sections = getSections();
  const dots = Array.from(document.querySelectorAll(".nav-dot"));
  currentIndex = Math.max(0, Math.min(index, sections.length - 1));

  sections.forEach((section, sectionIndex) => {
    section.classList.toggle("is-active", sectionIndex === currentIndex);
  });

  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === currentIndex);
    dot.setAttribute("aria-current", dotIndex === currentIndex ? "true" : "false");
  });

  controls.forEach((button) => {
    const direction = button.dataset.direction;
    button.disabled =
      (direction === "prev" && currentIndex === 0) ||
      (direction === "next" && currentIndex === sections.length - 1);
  });
}

function scrollToSection(index) {
  const sections = getSections();
  const nextIndex = Math.max(0, Math.min(index, sections.length - 1));
  sections[nextIndex].scrollIntoView({ behavior: "smooth", block: "start" });
}

function observeSections() {
  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visibleEntry) {
        return;
      }

      setActiveSection(Number(visibleEntry.target.dataset.index));
    },
    {
      root: presentation,
      threshold: [0.55, 0.72, 0.9],
    }
  );

  getSections().forEach((section) => observer.observe(section));
}

controls.forEach((button) => {
  button.addEventListener("click", () => {
    const offset = button.dataset.direction === "next" ? 1 : -1;
    scrollToSection(currentIndex + offset);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown" || event.key === "PageDown") {
    event.preventDefault();
    scrollToSection(currentIndex + 1);
  }

  if (event.key === "ArrowUp" || event.key === "PageUp") {
    event.preventDefault();
    scrollToSection(currentIndex - 1);
  }
});

buildPresentation();
observeSections();
setActiveSection(0);
