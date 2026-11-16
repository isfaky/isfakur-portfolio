document.addEventListener("DOMContentLoaded", () => {
  const cardWrapper = document.getElementById("idCardWrapper");
  const glareFront = document.getElementById("idGlare");
  const glareBack = document.getElementById("idGlareBack");
  const lanyard = document.getElementById("lanyardRig");
  const flipBtn = document.getElementById("flipBtn");

  if (cardWrapper) {
    let isPointerDown = false;
    let pointerMoved = false;
    let startX = 0;
    let startY = 0;
    let idleAngle = 0;
    let isInteracting = false;

    function animateIdle() {
      if (!isInteracting) {
        idleAngle += 0.022;
        const swayY = Math.sin(idleAngle) * 5.5;
        const swayX = Math.cos(idleAngle * 0.85) * 2.5;
        cardWrapper.style.transform = `rotateX(${swayX}deg) rotateY(${swayY}deg)`;
        if (lanyard) {
          lanyard.style.transform = `rotateZ(${-swayY * 0.35}deg)`;
        }
      }
      requestAnimationFrame(animateIdle);
    }
    requestAnimationFrame(animateIdle);

    function handleMove(clientX, clientY) {
      const rect = cardWrapper.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateY = ((x - centerX) / centerX) * 24;
      const rotateX = -((y - centerY) / centerY) * 20;

      cardWrapper.style.transition = "transform 0.08s ease-out";
      cardWrapper.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`;

      if (lanyard) {
        lanyard.style.transform = `rotateZ(${(-rotateY * 0.25).toFixed(2)}deg)`;
      }

      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      const glareBg = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.38), transparent 62%)`;

      [glareFront, glareBack].forEach((g) => {
        if (g) {
          g.style.background = glareBg;
          g.style.opacity = "1";
        }
      });
    }

    function resetCard() {
      isInteracting = false;
      isPointerDown = false;
      cardWrapper.style.transition =
        "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)";
      cardWrapper.style.transform =
        "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
      if (lanyard) lanyard.style.transform = "rotateZ(0deg)";
      [glareFront, glareBack].forEach((g) => {
        if (g) g.style.opacity = "0";
      });
    }

    cardWrapper.addEventListener("mouseenter", () => {
      isInteracting = true;
    });
    cardWrapper.addEventListener("mousemove", (e) => {
      isInteracting = true;
      handleMove(e.clientX, e.clientY);
    });
    cardWrapper.addEventListener("mouseleave", resetCard);

    cardWrapper.addEventListener("pointerdown", (e) => {
      isInteracting = true;
      isPointerDown = true;
      pointerMoved = false;
      startX = e.clientX;
      startY = e.clientY;
    });

    window.addEventListener("pointermove", (e) => {
      if (!isPointerDown) return;
      if (
        Math.abs(e.clientX - startX) > 6 ||
        Math.abs(e.clientY - startY) > 6
      ) {
        pointerMoved = true;
      }
      handleMove(e.clientX, e.clientY);
    });

    window.addEventListener("pointerup", () => {
      if (isPointerDown) resetCard();
    });

    cardWrapper.addEventListener("click", () => {
      if (!pointerMoved) cardWrapper.classList.toggle("is-flipped");
    });

    if (flipBtn) {
      flipBtn.addEventListener("click", () => {
        cardWrapper.classList.toggle("is-flipped");
      });
    }
  }

  // Scroll Progress Bar & Active Navigation Link
  const progressBar = document.getElementById("scrollProgress");
  const sections = document.querySelectorAll("main section[id]");
  const navItems = document.querySelectorAll("#navLinks a");

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar && docHeight > 0) {
      progressBar.style.width = `${(scrollTop / docHeight) * 100}%`;
    }

    let currentId = "";
    sections.forEach((sec) => {
      if (scrollTop >= sec.offsetTop - 160) {
        currentId = sec.getAttribute("id");
      }
    });

    navItems.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${currentId}`,
      );
    });
  });

  const reveals = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.12 },
  );
  reveals.forEach((el) => observer.observe(el));
});
