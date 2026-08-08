document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const feedFilterBtn = document.getElementById("feedFilterBtn");
  const filterDropdown = document.getElementById("filterDropdown");
  const dockHome = document.getElementById("dockHome");
  const contentScroll = document.querySelector(".content-scroll");
  const likeBtn = document.querySelector(".action-like");
  const modalOverlay = document.getElementById("modalOverlay");
  const modalBody = document.getElementById("modalBody");
  const closeModal = document.getElementById("closeModal");
  const postMedia = document.querySelector(".post-media");

  // 1. Header Logo Dropdown Filter
  feedFilterBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    filterDropdown.classList.toggle("hidden");
  });

  document.addEventListener("click", () => {
    filterDropdown.classList.add("hidden");
  });

  filterDropdown.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const selectedFilter = e.currentTarget.getAttribute("data-filter");
      alert(`Filtering feed by: ${selectedFilter}`);
      filterDropdown.classList.add("hidden");
    });
  });

  // 2. Primary Navigation: Home Double-Tap Scroll & Refresh
  dockHome.addEventListener("click", () => {
    if (dockHome.classList.contains("active")) {
      contentScroll.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setActiveDockButton(dockHome);
    }
  });

  // Handle Dock Active States
  const dockButtons = document.querySelectorAll(".dock-btn");
  dockButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (e.currentTarget !== dockHome) {
        setActiveDockButton(e.currentTarget);
      }
    });
  });

  function setActiveDockButton(targetBtn) {
    dockButtons.forEach((btn) => btn.classList.remove("active"));
    targetBtn.classList.add("active");
  }

  // 3. Post Like Functionality (Tap & Double Tap)
  let isLiked = false;

  function toggleLike() {
    isLiked = !isLiked;
    const heartIcon = likeBtn.querySelector("i");
    if (isLiked) {
      heartIcon.className = "fa-solid fa-heart liked";
    } else {
      heartIcon.className = "fa-regular fa-heart";
    }
  }

  likeBtn.addEventListener("click", toggleLike);

  // Double Tap Media to Like
  let lastTap = 0;
  postMedia.addEventListener("touchstart", (e) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    if (tapLength < 300 && tapLength > 0) {
      if (!isLiked) toggleLike();
      e.preventDefault();
    }
    lastTap = currentTime;
  });

  // 4. Modal Triggers (Options, Comments, Creation)
  document.querySelector(".post-options-btn").addEventListener("click", () => {
    openModal(`
      <h3>Post Options</h3>
      <p style="margin-top: 10px; color: #a1a1aa;">- Join Jam Session</p>
      <p style="margin-top: 10px; color: #a1a1aa;">- Download Stem</p>
      <p style="margin-top: 10px; color: #ef4444;">- Report Content</p>
    `);
  });

  document.querySelector(".action-comment").addEventListener("click", () => {
    openModal(`
      <h3>Comments</h3>
      <div style="margin-top: 15px;">
        <p><strong>synth_fan:</strong> That bass drop was clean!</p>
      </div>
    `);
  });

  document.getElementById("dockCreate").addEventListener("click", () => {
    openModal(`
      <h3>Create & Broadcast</h3>
      <button style="width:100%; padding:10px; margin-top:10px;">Start Live Stream</button>
      <button style="width:100%; padding:10px; margin-top:10px;">Upload Music Stem</button>
    `);
  });

  function openModal(content) {
    modalBody.innerHTML = content;
    modalOverlay.classList.remove("hidden");
  }

  closeModal.addEventListener("click", () => {
    modalOverlay.classList.add("hidden");
  });

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) modalOverlay.classList.add("hidden");
  });
});
