let mainCont = document.querySelector(".card");
let searchBoxItems = document.querySelector(".card .search-box .items");
let searchBox = document.querySelector(".card .search-box");
searchBox.classList.add("hidden");

let req = new XMLHttpRequest();
req.open("GET", "./data.json");
req.send();

let searchItems = new Set();
let allJobs = []; 

req.onreadystatechange = function () {
  if (req.status == 200 && req.readyState == 4) {
    allJobs = JSON.parse(req.responseText);
    renderJobs(allJobs);
  }
};

function renderJobs(jobsArray) {
  document.querySelectorAll(".card .box").forEach((e) => e.remove());

  jobsArray.forEach((data) => {
    let skillsArr = [data.role, data.level, ...data.languages, ...data.tools];
    let skillsHTML = skillsArr
      .map((skill) => `<p class="skill small">${skill}</p>`)
      .join("");

    mainCont.insertAdjacentHTML(
      "beforeend",
      `
      <div class="box ${data.featured ? "featured" : ""}" id=${data.id}>
        <div class="data">
          <div class="image">
            <img src="${data.logo}" alt="" />
          </div>
          <div class="text">
            <div class="title">
              <p class="small">${data.company}</p>
              ${data.new ? `<p class="small new">NEW!</p>` : ""}
              ${data.featured ? `<p class="small featured">FEATURED</p>` : ""}
            </div>
            <div class="role">
              <p class="large">${data.position}</p>
            </div>
            <div class="details">
              <p class="xsmall">${data.postedAt}</p>
              <p class="xsmall">${data.contract}</p>
              <p class="xsmall">${data.location}</p>
            </div>
          </div>
        </div>
        <div class="skills">
          ${skillsHTML}
        </div>
      </div>
    `
    );
  });


  let skillTags = document.querySelectorAll(".card .box .skills .skill");
  skillTags.forEach((e) => {
    e.addEventListener("click", () => {
      searchItems.add(e.innerHTML.trim());
      updateSearchBox();
      handleSearchVisibility();
    });
  });
}

function updateSearchBox() {
  searchBoxItems.innerHTML = "";

  searchItems.forEach((item) => {
    searchBoxItems.innerHTML += `
      <p class="small" data-skill="${item}">
        ${item}
        <img src="images/icon-remove.svg" alt="Remove" />
      </p>
    `;
  });


  let deleteBtns = document.querySelectorAll(
    ".card .search-box .items p.small img"
  );
  deleteBtns.forEach((e) => {
    e.addEventListener("click", () => {
      let skill = e.parentElement.dataset.skill;
      searchItems.delete(skill);
      updateSearchBox();
      handleSearchVisibility();
    });
  });

  let filteredJobs = Array.from(allJobs).filter((job) => {
    let jobSkills = new Set([
      job.role,
      job.level,
      ...job.languages,
      ...job.tools,
    ]);
    return Array.from(searchItems).every((skill) => jobSkills.has(skill));
  });

  renderJobs(filteredJobs);
}

function handleClear() {
  let clearBtn = document.querySelector(".card .search-box > p.small");

  clearBtn.addEventListener("click", () => {
    searchItems.clear();
    searchBox.classList.add("hidden");
    updateSearchBox();
    renderJobs(allJobs);
  });
}

function handleSearchVisibility() {
  if (searchItems.size) {
    searchBox.classList.remove("hidden");
  } else {
    searchBox.classList.add("hidden");
  }
}

handleClear(); 
