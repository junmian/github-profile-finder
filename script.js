const APIURL = "https://api.github.com/users/"; // root url

const form = document.getElementById("form");
const search = document.getElementById("search");
const content = document.getElementById("content");

async function getUser(username) {
  try {
    const { data } = await axios.get(APIURL + username); // Destructure
    createUserCard(data);
    getRepos(username);
  } catch (error) {
    if (error.response.status === 404) {
      createErrorCard(
        `Oopsie, there is no profile with the username ${username}. Please try again.`
      );
    }
  }
}

async function getRepos(username) {
  try {
    const { data } = await axios.get(APIURL + username + "/repos?sort=created"); // Destructure and sort by date created
    addReposToCard(data);
  } catch (error) {
    createErrorCard("Oops, there is a problem fetching repos.");
  }
}

function createUserCard(user) {
  const cardHTML = `
  <div class="card">
  <div>
    <a href="${user.html_url}" target="_blank">
    <img src="${user.avatar_url}" alt="${user.name}" 
    class="avatar" title="${user.login}"></a>
  </div>
  <div class="user-info">
    <h2>${user.name}</h2>
    <p><strong>Username</strong>: ${user.login}</p>
    <p><strong>Location</strong>: ${user.location}</p>
    <p><strong>Bio</strong>: ${user.bio}</p>
    <ul>
      <li>${user.followers} <strong>Followers</strong></li>
      <li>${user.following} <strong>Following</strong></li>
      <li>${user.public_repos} <strong>Repos</strong></li>
    </ul>
    <div id="repos"></div>
  </div>
</div>
  `;
  content.innerHTML = cardHTML;
}

function createErrorCard(message) {
  const cardHTML = `
    <div class='card'>
      <p>${message}</p>
    </div>
  `;

  content.innerHTML = cardHTML;
}

function addReposToCard(repos) {
  const reposElement = document.getElementById("repos");
  repos.slice(0, 5).forEach((repo) => {
    const repoElement = document.createElement("a");
    repoElement.classList.add("repo");
    repoElement.href = repo.html_url;
    repoElement.target = "_blank";
    repoElement.innerText = repo.name;
    reposElement.appendChild(repoElement);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const user = search.value;

  if (user) {
    getUser(user);
    search.value = "";
  }
});
