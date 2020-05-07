let countDays = 0;
let data = [];
const apiUrl =
  "https://v2-api.sheety.co/74b6febf2ffacaffc50a409f935d9b95/airbngama/airbngama";

let divContainer = document.querySelector(".container");
let divCardsGroup = document.getElementById("div-cards-group");
let buttonModal = document.createElement("button");

function loadingSpinner() {
  let divSpinner = document.createElement("div");
  divSpinner.setAttribute("class", "spinner-border text-success");
  divSpinner.setAttribute("role", "status");

  divCardsGroup.innerHTML = "";
  divCardsGroup.style =
    "justify-content: center; height: 300px; align-items: center;";

  divCardsGroup.appendChild(divSpinner);
}

function createCard(card, index) {
  let col = document.createElement("div");
  col.setAttribute("class", "col-md-4 col-cards");

  let divCard = document.createElement("div");
  divCard.setAttribute("class", "card");
  divCard.innerHTML = `<img class="card-img-top" src=${card.photo}>`;

  let divCardBody = document.createElement("div");
  divCardBody.setAttribute("class", "card-body");
  divCardBody.innerHTML = `
    <h5 class="card-title">${card.name}</h5>
      <h6 class="card-subtitle">${card.propertyType}</h6>
      <p class="card-text text-value-day">
        ${
          new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(card.price || "") + "/noite"
        }
      </p>
  `;

  if (countDays > 0) {
    let small = document.createElement("small");
    small.setAttribute("class", "text-muted");
    small.setAttribute("style", "display: block;");

    small.textContent =
      "Total de " +
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(card.price * countDays || "");

    divCardBody.appendChild(small);
  }

  buttonModal = document.createElement("button");
  buttonModal.setAttribute("data-toggle", "modal");
  buttonModal.setAttribute("data-target", `#modalCard${index + 1}`);

  Object.assign(buttonModal, {
    className: "btn btn-success",
    id: `btn-modal-card-${index + 1}`,
    textContent: "Mais informações",
    onclick: function () {
      showModal(card, index);
      initMapModal(card, index + 1);
    },
  });

  divCardBody.appendChild(buttonModal);
  divCard.appendChild(divCardBody);
  col.appendChild(divCard);

  return col;
}

async function fetchData() {
  return await fetch(apiUrl)
    .then(async function (response) {
      return await response.json();
    })
    .catch(function (err) {
      console.log("algo deu errado", err);
    });
}

function renderCards(data) {
  let row, col;
  let i = 0;

  divCardsGroup.innerHTML = "";
  divCardsGroup.style = "";

  while (i < data.length) {
    row = document.createElement("div");
    row.setAttribute("class", "row");

    while (1) {
      col = createCard(data[i], i);

      row.appendChild(col);
      i++;
      if (i % 3 === 0 || i === data.length) {
        break;
      }
    }

    divCardsGroup.appendChild(row);
  }

  let pagination = createPagination();
  divCardsGroup.appendChild(pagination);
}

function daysBetween(firstDate, lastDate) {
  const oneDay = 24 * 60 * 60 * 1000;
  return parseInt((lastDate - firstDate) / oneDay) + 1;
}

function handleClickSearch() {
  // validate first
  // showMap(true);
  let checkinValue = document.getElementById("checkin").value;
  let checkoutValue = document.getElementById("checkout").value;

  let checkinDate = new Date(checkinValue);
  let checkoutDate = new Date(checkoutValue);

  countDays = daysBetween(checkinDate, checkoutDate);

  searchLocations();
}

function showMap(isToShow) {
  let divMap = document.getElementById("div-map");
  if (isToShow) {
    divMap.setAttribute("class", "row show-map");
  } else {
    divMap.setAttribute("class", "row");
  }
}

function showModal(card, index) {
  let divModal = document.createElement("div");

  Object.assign(divModal, {
    id: `modalCard${index + 1}`,
    tabindex: "-1",
    role: "dialog",
    className: "modal fade",
  });
  divModal.setAttribute("aria-labelledby", "exampleModalLabel");
  divModal.setAttribute("aria-hidden", "true");

  divModal.innerHTML = `
  <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Informações sobre a estadia</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body" style="height: 70vh">
        <div class="row" style="height: 100%;">
          <div class="col-md-6">
            <img class="card-img-top" src=${card.photo}>
            <h5>Nome: ${card.name}</h5>
            <h6>Tipo de estadia: ${card.propertyType}</h6>
            <p class="text-value-day">
              ${
                new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(card.price || "") + "/noite"
              }
            </p>
          </div>
          <div class="col-md-6">
          <div id="map-modal-${index + 1}" style="height: 100%"></div>
          </div>
        </div>
      </div>
    </div>
  </div>`;

  divContainer.appendChild(divModal);
}

async function main() {
  const response = await fetchData();
  data = response.airbngama;

  if (data.length) {
    loadPagination(data);
    initMapSearch();
  }
}

// showMap(true);
loadingSpinner();
main();
