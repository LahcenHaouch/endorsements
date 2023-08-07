import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL: "",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsements = ref(database, "endorsements");

const newEndorsementStr = "new-endorsement";
const formEl = document.querySelector(`#${newEndorsementStr}-form`);
const newEndorsementBodyEl = document.querySelector(
  `#${newEndorsementStr}-body`
);
const newEndorsementFromEl = document.querySelector(
  `#${newEndorsementStr}-from`
);
const newEndorsementToEl = document.querySelector(`#${newEndorsementStr}-to`);

const endorsementsEl = document.querySelector(".endorsements");

formEl.addEventListener("submit", (event) => {
  event.preventDefault();

  const { value: body } = newEndorsementBodyEl;
  const { value: from } = newEndorsementFromEl;
  const { value: to } = newEndorsementToEl;

  clearForm();

  push(endorsements, { body, from, to, likes: 0 });
});

function clearForm() {
  formEl.reset();
}

function clearEndorsementsInDOM() {
  endorsementsEl.innerHTML = "";
}

onValue(endorsements, (snapshot) => {
  if (!snapshot.exists()) {
    return;
  }

  const remoteEndorsements = Object.entries(snapshot.val());

  clearEndorsementsInDOM();

  remoteEndorsements.forEach(([id, values]) => {
    appendEndorsementToDOM({ id, ...values });
  });
});

function appendEndorsementToDOM(endorsement) {
  console.log({ endorsement });

  const endorsementEl = document.createElement("li");
  endorsementEl.classList.add("endorsement");

  const endorsementToEl = document.createElement("p");
  endorsementToEl.classList.add("endorsement-to");
  endorsementToEl.textContent = endorsement.to;

  const endorsementBodyEl = document.createElement("p");
  endorsementBodyEl.classList.add("endorsement-body");
  endorsementBodyEl.textContent = endorsement.body;

  const fromLikeEl = document.createElement("div");
  fromLikeEl.classList.add("from-like-container");

  const endorsementFromEl = document.createElement("p");
  endorsementFromEl.classList.add("endorsement-from");
  endorsementFromEl.textContent = endorsement.from;

  const buttonEl = document.createElement("button");
  buttonEl.classList.add("endorsement-like");

  const iconEl = document.createElement("i");
  iconEl.classList.add("endorsement-icon", "fa", "fa-heart");

  buttonEl.appendChild(iconEl);
  const likesEl = document.createTextNode(endorsement.likes);
  buttonEl.appendChild(likesEl);

  fromLikeEl.append(endorsementFromEl);
  fromLikeEl.append(buttonEl);

  endorsementEl.append(endorsementToEl);
  endorsementEl.append(endorsementBodyEl);
  endorsementEl.append(fromLikeEl);

  endorsementsEl.append(endorsementEl);
}
