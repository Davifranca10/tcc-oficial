document.addEventListener("DOMContentLoaded", () => {
    const menuBtn = document.getElementById("menuBtn");
    const menu = document.getElementById("menu");
    const navBg = document.getElementById("navBackground");
  
    menuBtn.addEventListener("click", () => {
      menuBtn.classList.toggle("close");
      navBg.classList.toggle("show");
      menu.classList.toggle("show");
    });
  });
  