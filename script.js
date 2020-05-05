var countDays = 0;

function loadingSpinner() {
  var divSpinner = document.createElement("div");
  divSpinner.setAttribute("class", "spinner-border text-success");
  divSpinner.setAttribute("rolw", "status");

  var divCardGroup = document.getElementById("div-card-group");
  divCardGroup.innerHTML = "";
  divCardGroup.style =
    "justify-content: center; height: 300px; align-items: center;";

  divCardGroup.appendChild(divSpinner);
}

function createCard(data, position) {
  var divCard, divCardBody, img, p, cardTitle, cardSubtitle;

  divCard = document.createElement("div");
  divCard.setAttribute("class", "card");

  img = document.createElement("img");
  img.setAttribute("class", "card-img-top");
  img.setAttribute("src", data[position].photo);

  divCardBody = document.createElement("div");
  divCardBody.setAttribute("class", "card-body");

  cardTitle = document.createElement("h5");
  cardTitle.setAttribute("class", "card-title");
  cardTitle.textContent = data[position].name;

  cardSubtitle = document.createElement("h6");
  cardSubtitle.setAttribute("class", "card-subtitle");
  cardSubtitle.textContent = data[position].property_type;

  p = document.createElement("p");
  p.setAttribute("class", "card-text text-value-day");
  p.textContent =
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(data[position].price || "") + "/noite";

  divCardBody.appendChild(cardTitle);
  divCardBody.appendChild(cardSubtitle);
  divCardBody.appendChild(p);

  if (countDays !== 0) {
    var newParagraph = document.createElement("p");
    newParagraph.setAttribute("class", "card-text");

    var small = document.createElement("small");
    small.setAttribute("class", "text-muted");

    small.textContent =
      "Total de " +
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(data[position].price * countDays || "");
    console.log(small);

    newParagraph.appendChild(small);
    divCardBody.appendChild(small);
  }

  divCard.appendChild(img);
  divCard.appendChild(divCardBody);

  return divCard;
}

async function fetchData() {
  await fetch("https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log("rolou", data);
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

loadingSpinner();
fetchData();

function daysBetween(firstDate, lastDate) {
  const oneDay = 24 * 60 * 60 * 1000;
  return parseInt((lastDate - firstDate) / oneDay) + 1;
}

function handleClickSearch() {
  var checkinValue = document.getElementById("checkin").value;
  var checkoutValue = document.getElementById("checkout").value;

  var checkinDate = new Date(checkinValue);
  var checkoutDate = new Date(checkoutValue);

  countDays = daysBetween(checkinDate, checkoutDate);

  loadingSpinner();
  fetchData();
}
