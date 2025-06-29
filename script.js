const showcase = document.querySelector("#showcase");
const preview = document.querySelector("#image-preview");
const main = showcase.parentNode;
const tabs = [];
let globalScrollY;

const loadSnippet = async (path) => {
  return fetch(path).then((res) => {
    if (res.ok) {
      return res.text();
    }
  });
};

const getTopicSnippet = (label) => {
  return `<h3 class="topic">${label}</h3>`;
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
  localStorage.setItem("page", 0);
  showcase.innerHTML = "";
  let snippet = "";
  selectTab(0);
  snippet += getTopicSnippet("/Unity Projects");
  let i = 1;
  for (i; i < 4; i++)
    snippet += await loadSnippet(`/cards/card-project-${i}.html`, true);
  snippet += getTopicSnippet("/Full-Stack Projects");
  for (i; i < 6; i++)
    snippet += await loadSnippet(`/cards/card-project-${i}.html`, true);
  snippet += getTopicSnippet("/AI Research");
  snippet += await loadSnippet(`/cards/card-project-${i}.html`, true);
  showcase.innerHTML = snippet;

  Array.from(showcase.querySelectorAll(".slide-wrapper")).forEach((wrapper) => {
    const img = wrapper.querySelector("img");
    img.addEventListener("click", (e) => {
      showImagePreview(img.getAttribute("src"));
    });
  });
};

const showJournal = async (id) => {
  localStorage.setItem("page", `0;${id}`);
  selectTab(0);
  showcase.innerHTML = "";
  showcase.innerHTML = await loadSnippet(
    `/journals/journal-project-${id}.html`,
    false
  );
  Array.from(showcase.querySelectorAll(".slide-wrapper")).forEach((wrapper) => {
    const img = wrapper.querySelector("img");
    img.addEventListener("click", (e) => {
      showImagePreview(img.getAttribute("src"));
    });
  });
};

const showAbout = async () => {
  selectTab(1);
  localStorage.setItem("page", 1);
  showcase.innerHTML = "";
  showcase.innerHTML = await loadSnippet(`/pages/about.html`, false);
};
const showContact = async () => {
  selectTab(2);
  localStorage.setItem("page", 2);
  showcase.innerHTML = "";
  showcase.innerHTML = await loadSnippet(`/pages/contact.html`, false);
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

const loadLastPage = () => {
  const pageId = localStorage.getItem("page") || -1;
  if (pageId == -1) loadProjects();
  else if (pageId.length === 1) {
    const id = parseInt(pageId);
    switch (id) {
      case 0:
        loadProjects();
        break;
      case 1:
        showAbout();
        break;
      case 2:
        showContact();
        break;
    }
  } else {
    try {
      const projectId = parseInt(pageId.split(";")[1]);
      showJournal(projectId);
    } catch {
      loadProjects();
    }
  }
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

loadLastPage();
