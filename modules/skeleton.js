const topicSkeleton = `
<h3 class="topic loader">
    <div class="skeleton-heading"></div>
</h3>`;
const cardSkeleton = `
<article class="card loader">
  <div class="slider-wrapper"></div>
  <div class="details">
   <span class="categories">
      <div class="skeleton-category"></div>
      <div class="skeleton-category"></div>
    </span>
    <div class="skeleton-heading"></div>
    <div class="skeleton-text"></div>
    <div class="skeleton-text"></div>
    <div class="skeleton-text"></div>
  </div>
</article>
`;
const aboutSkeleton = `
<article class="card about loader">
  <div class="details">
    <div class="skeleton-heading"></div>
    <div class="skeleton-text"></div>
    <div class="skeleton-text"></div>
    <div></div>
    <div class="skeleton-text"></div>
    <div class="skeleton-text"></div>
    <div class="skeleton-text"></div>
    <div class="skeleton-text"></div>
  </div>
  <div style="height: 150px"></div>
</article>
`;
const skeletonThreshold = { min: 100, max: 500 };
