const showcase = document.querySelector("#showcase");
const preview = document.querySelector("#image-preview");
const main = showcase.parentNode;
const tabs = [];
let isBussy = false;
let globalScrollY;

const getActivePage = () => localStorage.getItem("page");

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

const loadProjects = async () => {
  if (isBussy || getActivePage() === "0") return;

  localStorage.setItem("page", 0);
  showcase.innerHTML = topicSkeleton;
  showcase.innerHTML += cardSkeleton;
  isBussy = true;
  let snippet = "";
  selectTab(0);
  snippet += getTopicSnippet("/Unity Projects");
  let i = 1;
  for (i; i < 4; i++)
    snippet += await loadSnippet(`/cards/card-project-${i}.html`);
  snippet += getTopicSnippet("/Full-Stack Projects");
  for (i; i < 6; i++)
    snippet += await loadSnippet(`/cards/card-project-${i}.html`);
  snippet += getTopicSnippet("/AI Research");
  snippet += await loadSnippet(`/cards/card-project-${i}.html`);

  const time = Date.now();
  const temp = document.createElement("div");
  temp.innerHTML = snippet;
  await Promise.all(
    Array.from(temp.querySelectorAll("img"))
      .filter((img) => {
        const src = img.getAttribute("src") || "";
        return !src.toLowerCase().endsWith(".gif");
      })
      .map((img) => {
        img.addEventListener("click", (e) => {
          showImagePreview(img.getAttribute("src"));
        });
        if (img.complete) return Promise.resolve();
        return new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
      })
  );
  const timeOffset = Date.now() - time;
  if (timeOffset < skeletonThreshold.max && timeOffset > skeletonThreshold.min)
    await new Promise((resolve) =>
      setTimeout(resolve, skeletonThreshold.max - timeOffset)
    );
  else showcase.classList.add("diver");
  showcase.innerHTML = temp.innerHTML;
  assignSliderObservers();
  showcase
    .querySelectorAll(".slider > img")
    .forEach((img) =>
      img.addEventListener("click", () =>
        showImagePreview(img.getAttribute("src"))
      )
    );
  isBussy = false;
};

const showJournal = async (id) => {
  if (isBussy) return;

  isBussy = true;
  showcase.innerHTML = cardSkeleton;
  selectTab(0);
  localStorage.setItem("page", `0;${id}`);
  const time = Date.now();
  const temp = document.createElement("div");
  temp.innerHTML = await loadSnippet(`/journals/journal-project-${id}.html`);
  await Promise.all(
    Array.from(temp.querySelectorAll("img"))
      .filter((img) => {
        const src = img.getAttribute("src") || "";
        return !src.toLowerCase().endsWith(".gif");
      })
      .map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
      })
  );
  const timeOffset = Date.now() - time;
  if (timeOffset < skeletonThreshold.max && timeOffset > skeletonThreshold.min)
    await new Promise((resolve) =>
      setTimeout(resolve, skeletonThreshold.max - timeOffset)
    );
  else showcase.classList.add("diver");
  showcase.innerHTML = temp.innerHTML;
  assignSliderObservers();
  showcase
    .querySelectorAll(".slider > img")
    .forEach((img) =>
      img.addEventListener("click", () =>
        showImagePreview(img.getAttribute("src"))
      )
    );
  isBussy = false;
};

const showAbout = async () => {
  if (isBussy || getActivePage() === "1") return;

  isBussy = true;
  selectTab(1);
  showcase.innerHTML = aboutSkeleton;
  localStorage.setItem("page", 1);
  const time = Date.now();
  const temp = document.createElement("div");
  temp.innerHTML = await loadSnippet(`/pages/about.html`);
  await Promise.all(
    Array.from(temp.querySelectorAll("img")).map((img) => {
      img.addEventListener("click", (e) => {
        showImagePreview(img.getAttribute("src"));
      });
      if (img.complete) return Promise.resolve();
      return new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
    })
  );
  const timeOffset = Date.now() - time;
  if (timeOffset < skeletonThreshold.max && timeOffset > skeletonThreshold.min)
    await new Promise((resolve) =>
      setTimeout(resolve, skeletonThreshold.max - timeOffset)
    );
  else showcase.classList.add("diver");
  showcase.innerHTML = temp.innerHTML;
  isBussy = false;
};
const showContact = async () => {
  if (isBussy || getActivePage() === "2") return;
  isBussy = true;
  selectTab(2);
  showcase.innerHTML = "";
  localStorage.setItem("page", 2);
  showcase.innerHTML = await loadSnippet(`/pages/contact.html`);
  isBussy = false;
};

const clearForm = () => {
  Array.from(
    showcase.querySelectorAll("input[type='text'],input[type='email'],textarea")
  ).forEach((inp) => (inp.value = null));
};

const selectTab = (idx) => {
  showcase.classList.remove("diver");
  tabs.forEach((tab) => tab.removeAttribute("selected"));
  tabs[idx].setAttribute("selected", null);
};

const loadLastPage = () => {
  const pageId = localStorage.getItem("page") || -1;
  localStorage.removeItem("page");
  if (pageId == -1) loadProjects();
  else if (pageId.length === 1) {
    const id = parseInt(pageId);
    switch (id) {
      default:
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
