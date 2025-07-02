const assignSliderObservers = () => {
  const wrappers = document.querySelectorAll(".slider-wrapper");
  const className = "active";
  wrappers.forEach((wrapper) => {
    const slider = wrapper.querySelector(".slider");
    const navs = wrapper.querySelectorAll(".slider-nav > a");
    const slides = slider.querySelectorAll("img");
    navs[0].classList.add(className);

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;

            navs.forEach((nav) =>
              nav.classList.toggle(
                className,
                `#${id}` === nav.getAttribute("href")
              )
            );
          }
        }),
      {
        root: slider,
        threshold: 0.5,
      }
    );

    slides.forEach((slide) => observer.observe(slide));
  });
};
