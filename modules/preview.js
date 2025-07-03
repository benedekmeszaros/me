const preview = document.querySelector("#image-preview");
let globalScrollY;

const showImagePreview = (src) => {
  const img = preview.querySelector("img");
  img.style.visibility = "hidden";
  img.setAttribute("src", src);
  img.onload = () => {
    img.style.visibility = "visible";
  };
  preview.style.display = "flex";

  globalScrollY = window.scrollY;
  document.body.style.position = "fixed";
  document.body.style.overflow = "scroll";
  document.body.style.top = `-${globalScrollY}px`;
};

const cloaseImagePreview = () => {
  preview.style.display = "none";
  document.body.style.position = "";
  document.body.style.overflow = "";
  document.body.style.top = "";
  window.scrollTo({ top: globalScrollY, behavior: "instant" });
};

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && preview.style.display !== "none")
    cloaseImagePreview();
});

preview.addEventListener("click", (e) => {
  if (
    e.target.tagName.toLowerCase() == "section" &&
    preview.style.display !== "none"
  )
    cloaseImagePreview();
});
