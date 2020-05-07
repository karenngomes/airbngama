let countDays = 0;
let buttonModal = document.createElement("button");

const apiUrl =
  "https://v2-api.sheety.co/74b6febf2ffacaffc50a409f935d9b95/airbngama/airbngama";

function loadingSpinner() {
  var divSpinner = document.createElement("div");
  divSpinner.setAttribute("class", "spinner-border text-success");
  divSpinner.setAttribute("role", "status");

  var divCardGroup = document.getElementById("div-card-group");
  divCardGroup.innerHTML = "";
  divCardGroup.style =
    "justify-content: center; height: 300px; align-items: center;";

  divCardGroup.appendChild(divSpinner);
}

function createCard(data, index) {
  var divCard, divCardBody, img, p, cardTitle, cardSubtitle;

  divCard = document.createElement("div");
  divCard.setAttribute("class", "card");

  img = document.createElement("img");
  img.setAttribute("class", "card-img-top");
  img.setAttribute("src", data[index].photo);

  divCardBody = document.createElement("div");
  divCardBody.setAttribute("class", "card-body");

  cardTitle = document.createElement("h5");
  cardTitle.setAttribute("class", "card-title");
  cardTitle.textContent = data[index].name;

  cardSubtitle = document.createElement("h6");
  cardSubtitle.setAttribute("class", "card-subtitle");
  cardSubtitle.textContent = data[index].propertyType;

  p = document.createElement("p");
  p.setAttribute("class", "card-text text-value-day");
  p.textContent =
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(data[index].price || "") + "/noite";

  divCardBody.appendChild(cardTitle);
  divCardBody.appendChild(cardSubtitle);
  divCardBody.appendChild(p);

  if (countDays > 0) {
    var newParagraph = document.createElement("p");
    newParagraph.setAttribute("class", "card-text");

    var small = document.createElement("small");
    small.setAttribute("class", "text-muted");
    small.setAttribute("style", "display: block;");

    small.textContent =
      "Total de " +
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(data[index].price * countDays || "");
    console.log(small);

    newParagraph.appendChild(small);
    divCardBody.appendChild(small);
  }

  buttonModal = document.createElement("button");
  buttonModal.setAttribute("data-toggle", "modal");
  buttonModal.setAttribute("data-target", `#modalCard${index + 1}`);

  Object.assign(buttonModal, {
    className: "btn btn-success",
    textContent: "Mais informações",
    onclick: function () {
      showModal(data, index);
    },
  });

  handleInitMap(data[index]);

  divCardBody.appendChild(buttonModal);

  divCard.appendChild(img);
  divCard.appendChild(divCardBody);

  return divCard;
}

async function fetchData() {
  await fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      let data = response.airbngama;
      var divCardGroup = document.getElementById("div-card-group");
      divCardGroup.innerHTML = "";
      divCardGroup.style = "";

      var newDiv, row, col;
      var i = 0;

      while (i < data.length) {
        row = document.createElement("div");
        row.setAttribute("class", "row");

        while (1) {
          col = document.createElement("div");
          col.setAttribute("class", "col-md-4 col-cards");

          newDiv = createCard(data, i);
          col.appendChild(newDiv);

          row.appendChild(col);
          i++;

          if (i % 3 === 0) {
            break;
          }
        }

        divCardGroup.appendChild(row);
      }
    })
    .catch(function (err) {
      console.log("algo deu erradoh", err);
    });
}

var divContainer = document.getElementsByClassName("container")[0];

loadingSpinner();
fetchData();

function daysBetween(firstDate, lastDate) {
  const oneDay = 24 * 60 * 60 * 1000;
  return parseInt((lastDate - firstDate) / oneDay) + 1;
}

function handleClickSearch() {
  // validate first
  showMap(true);
  var checkinValue = document.getElementById("checkin").value;
  var checkoutValue = document.getElementById("checkout").value;

  var checkinDate = new Date(checkinValue);
  var checkoutDate = new Date(checkoutValue);

  countDays = daysBetween(checkinDate, checkoutDate);

  loadingSpinner();
  fetchData();
}

function showMap(isToShow) {
  var divMap = document.getElementById("div-map");
  if (isToShow) {
    divMap.setAttribute("class", "row show-map");
  } else {
    divMap.setAttribute("class", "row");
  }
}

function showModal(data, index) {
  const currentData = data[index];

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
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">${currentData.name}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body" style="height: 100vh">
        <div id="map-modal" style="height: 100%"><div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
      </div>
    </div>
  </div>`;

  divContainer.appendChild(divModal);
}
