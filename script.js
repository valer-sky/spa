let game = null;

document.querySelectorAll(".menu__item").forEach((item) => {
  item.addEventListener("click", function () {
    const path = item.getAttribute("value");
    loadPage(path);
    location.hash = path;
  });
});

window.onhashchange = determinePagesForRendering;

function determinePagesForRendering() {
  const path = window.location.hash.substring(1);

  switch (path) {
    case "": {
      loadPage("home");
      break;
    }
    case "home": {
      loadPage("home");
      break;
    }
    case "rules": {
      loadPage("rules");
      break;
    }
    case "pricing": {
      loadPage("pricing");
      break;
    }
    default: {
      loadPage("404");
      break;
    }
  }
}

function loadPage(path) {
  if (path === "") return;

  const container = document.getElementById("container");

  const request = new XMLHttpRequest();
  request.open("GET", "pages/" + path + ".html");
  request.send();
  request.onload = function () {
    if (request.status === 200) {
      container.innerHTML = request.responseText;
      document.title = path;
      if (path === 'home') {
        loadGame();
      }
    }
  }
}

async function loadGame() {
  if (!game) {
    game = await import('./game.js');
  }
  game.gameInit();
}

determinePagesForRendering();
