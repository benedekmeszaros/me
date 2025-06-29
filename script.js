const showcase = document.querySelector("#showcase");
const preview = document.querySelector("#image-preview");
const main = showcase.parentNode;
const tabs = [];
let globalScrollY;

const loadSnippet = async (path, append) => {
  if (!append) showcase.innerHTML = "";
  return fetch(path)
    .then((res) => {
      if (res.ok) {
        return res.text();
      }
    })
    .then((htmlSnipped) => {
      if (append) showcase.innerHTML += htmlSnipped;
      else showcase.innerHTML = htmlSnipped;
    });
};

const appendTopic = (label) => {
  const topic = showcase.appendChild(document.createElement("h3"));
  topic.textContent = label;
  topic.classList.add("topic");
  return topic;
};

const showImagePreview = (src) => {
  const img = preview.querySelector("img");
  img.style.visibility = "hidden";
  img.setAttribute("src", src);
  img.onload = (_) => {
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
  window.scrollTo(0, globalScrollY);
};

const loadProjects = async () => {
  showcase.innerHTML = "";
  selectTab(0);
  appendTopic("/Unity Projects");
  let i = 1;
  for (i; i < 4; i++) await loadSnippet(`/cards/card-project-${i}.html`, true);
  appendTopic("/Full-Stack Projects");
  for (i; i < 6; i++) await loadSnippet(`/cards/card-project-${i}.html`, true);
  appendTopic("/AI Research");
  await loadSnippet(`/cards/card-project-${i}.html`, true);

  Array.from(showcase.querySelectorAll(".slide-wrapper")).forEach((wrapper) => {
    const img = wrapper.querySelector("img");
    img.addEventListener("click", (e) => {
      showImagePreview(img.getAttribute("src"));
    });
  });
};

const showJournal = async (id) => {
  selectTab(0);
  await loadSnippet(`/journals/journal-project-${id}.html`, false);
  Array.from(showcase.querySelectorAll(".slide-wrapper")).forEach((wrapper) => {
    const img = wrapper.querySelector("img");
    img.addEventListener("click", (e) => {
      showImagePreview(img.getAttribute("src"));
    });
  });
};

const showAbout = () => {
  selectTab(1);
  loadSnippet(`/pages/about.html`, false);
};
const showContact = () => {
  selectTab(2);
  loadSnippet(`/pages/contact.html`, false);
};

const clearForm = () => {
  Array.from(
    showcase.querySelectorAll("input[type='text'],input[type='email'],textarea")
  ).forEach((inp) => (inp.value = null));
};

const selectTab = (idx) => {
  tabs.forEach((tab) => tab.removeAttribute("selected"));
  tabs[idx].setAttribute("selected", null);
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

let tab = document.querySelector("#home-btn");
tab.addEventListener("click", loadProjects);
tabs.push(tab);
tab = document.querySelector("#about-btn");
tab.addEventListener("click", showAbout);
tabs.push(tab);
tab = document.querySelector("#contact-btn");
tab.addEventListener("click", showContact);
tabs.push(tab);

loadProjects();
