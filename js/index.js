const API_URL =
  "https://v2-api.sheety.co/74b6febf2ffacaffc50a409f935d9b95/airbngama/airbngama";

let countDays = 0;
let data = [];

let divCardsGroup = document.getElementById("div-cards-group");

function loadingSpinner() {
  let divSpinner = document.createElement("div");
  divSpinner.setAttribute("class", "spinner-border text-success");
  divSpinner.setAttribute("role", "status");

  divCardsGroup.innerHTML = "";
  divCardsGroup.classList.add("card-group-height");

  divCardsGroup.appendChild(divSpinner);
}

function createCard(card) {
  let col = document.createElement("div");
  col.setAttribute("class", "col-md-4 col-cards");

  let divCard = document.createElement("div");
  divCard.setAttribute("class", "card");
  divCard.innerHTML = `<img class="card-img-top" src=${card.photo}>`;

  let divCardBody = document.createElement("div");
  divCardBody.setAttribute("class", "card-body");
  divCardBody.innerHTML = `
    <h5 class="card-title">${card.name}</h5>
    <small class="card-subtitle">${card.propertyType}</small>
  `;

  let divTextPrices = document.createElement("div");
  divTextPrices.setAttribute("class", "text-prices");
  divTextPrices.innerHTML = `
    <p class="card-text text-value-day">
      ${formattedCurrency(card.price || "")}/noite
    </p>
  `;

  if (countDays > 0) {
    let small = document.createElement("small");
    small.setAttribute("class", "text-muted");
    small.setAttribute("style", "display: block;");

    small.textContent = `Total de ${formattedCurrency(
      card.price * countDays || ""
    )}`;

    divTextPrices.appendChild(small);
  }

  divCardBody.appendChild(divTextPrices);

  let buttonModal = document.createElement("button");
  buttonModal.setAttribute("data-toggle", "modal");
  buttonModal.setAttribute("data-target", `#modalCard${card.id}`);
  buttonModal.innerHTML = '<i class="fas fa-plus"></i>';

  Object.assign(buttonModal, {
    className: "btn btn-success btn-more-info",
    id: `btn-modal-card-${card.id}`,
    onclick: function () {
      showModal(card);
      initMapModal(card);
    },
  });

  divCardBody.appendChild(buttonModal);
  divCard.appendChild(divCardBody);
  col.appendChild(divCard);

  return col;
}

async function fetchData(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("algo deu errado", err);
  }
}

function renderCards(data) {
  let row, col;
  let i = 0;

  divCardsGroup.innerHTML = "";
  divCardsGroup.className = "row";

  while (i < data.length) {
    row = document.createElement("div");
    row.setAttribute("class", "row");

    do {
      col = createCard(data[i]);

      row.appendChild(col);
      i++;
    } while (!(i % 3 === 0 || i === data.length));

    divCardsGroup.appendChild(row);
  }

  let pagination = createPagination();
  divCardsGroup.appendChild(pagination);
}

function validateForm() {
  let form = document.getElementById("form-search");
  form.classList.add("was-validated");

  const invalidGroup = form.querySelectorAll(":invalid");

  if (invalidGroup.length) {
    return false;
  }

  let checkin = document.getElementById("checkin");
  let checkout = document.getElementById("checkout");

  let checkinDate = new Date(checkin.value);
  let checkoutDate = new Date(checkout.value);

  if (checkinDate > checkoutDate) {
    let invalidFeedback = document.querySelectorAll(".date-fields");
    checkin.classList.add("is-invalid");
    checkout.classList.add("is-invalid");

    invalidFeedback.forEach((div) => {
      return (div.textContent = "Data de Checkin maior que Data de Checkout");
    });
    return false;
  } else {
    checkin.classList.remove("is-invalid");
    checkout.classList.remove("is-invalid");
  }

  countDays = daysBetween(checkinDate, checkoutDate);

  return true;
}

function handleClickSearch() {
  if (validateForm()) {
    // searchLocations();
    loadPagination(data);
  }
}

// function handleChangeDate() {
//   let checkin = document.getElementById("checkin");
//   let checkout = document.getElementById("checkout");

//   if (checkin.value) {
//     let checkinDate = new Date(checkin.value);

//     checkout.setAttribute(
//       "min",
//       [
//         checkinDate.getFullYear(),
//         checkinDate.getMonth() + 1,
//         checkinDate.getDate() + 1,
//       ]
//         .map((n) => (n < 10 ? `0${n}` : `${n}`))
//         .join("-")
//     );
//   }

//   if (checkout.value) {
//     let checkoutDate = new Date(checkout.value);

//     checkin.setAttribute(
//       "max",
//       [
//         checkoutDate.getFullYear(),
//         checkoutDate.getMonth() + 1,
//         checkoutDate.getDate() + 1,
//       ]
//         .map((n) => (n < 10 ? `0${n}` : `${n}`))
//         .join("-")
//     );
//   }
// }

function showModal(card) {
  let divContainer = document.querySelector(".container");
  let divModal = document.createElement("div");

  Object.assign(divModal, {
    id: `modalCard${card.id}`,
    tabindex: "-1",
    role: "dialog",
    className: "modal fade",
  });
  divModal.setAttribute("aria-hidden", "true");

  divModal.innerHTML = `
  <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Informações sobre a estadia</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body" style="height: 70vh">
        <div class="row" style="height: 100%;">
          <div class="col-md-6 modal-body-info">
            <img class="card-img-top" src=${card.photo}>
            <h5 style="margin-top: 0.5rem;">${card.name}</h5>
            <h6>Tipo de estadia: <small style="display: inline;" class="card-subtitle">${
              card.propertyType
            }</small></h6>
            <p class="text-value-day">
              ${formattedCurrency(card.price || "")}/noite
            </p>
          </div>
          <div class="col-md-6">
            <div id="map-modal-${card.id}" style="height: 100%"></div>
          </div>
        </div>
      </div>
    </div>
  </div>`;

  divContainer.appendChild(divModal);
}

async function main() {
  try {
    const response = await fetchData(API_URL);
    data = response.airbngama;

    if (data.length) {
      loadPagination(data);
    }
  } catch (err) {
    console.log("Erro ao pegar os dados da api. ", err);
  }
}

main();
