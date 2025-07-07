const previewSliderTemp = `
<div class="slider-wrapper">
  <div class="slider"></div>
  <div class="slider-nav"></div>
</div>`;
let globalScrollY;

const showPreviewSlider = (srcs, selectedIdx) => {
  const preview = document.createElement("section");
  preview.id = "image-preview";
  preview.style.display = "flex";
  preview.innerHTML = previewSliderTemp;
  document.querySelector("main").appendChild(preview);
  const slider = preview.querySelector(".slider");
  const sliderNav = preview.querySelector(".slider-nav");

  srcs.forEach((src, idx) => {
    const slide = document.createElement("img");
    const nav = document.createElement("a");

    slide.src = src;
    slide.id = `p-s${idx + 1}`;
    nav.href = `#${slide.id}`;

    slider.appendChild(slide);
    sliderNav.appendChild(nav);
  });
  assignSliderObserver(slider.parentNode, selectedIdx);

  globalScrollY = window.scrollY;
  document.body.style.position = "fixed";
  document.body.style.overflow = "scroll";
  document.body.style.top = `-${globalScrollY}px`;
  document.addEventListener("keydown", closePreviewSliderEventListener);
  preview.addEventListener("click", (e) => {
    if (
      e.target.tagName.toLowerCase() == "section" &&
      preview.style.display !== "none"
    )
      closePreviewSlider();
  });
};

const closePreviewSliderEventListener = (e) => {
  const preview = document.getElementById("image-preview");
  if (e.key === "Escape" && preview.style.display !== "none")
    closePreviewSlider();
};

const closePreviewSlider = () => {
  const preview = document.getElementById("image-preview");
  const main = document.querySelector("main");
  main.removeChild(preview);
  document.body.style.position = "";
  document.body.style.overflow = "";
  document.body.style.top = "";
  window.scrollTo({ top: globalScrollY, behavior: "instant" });
  document.removeEventListener("keydown", closePreviewSliderEventListener);
};
