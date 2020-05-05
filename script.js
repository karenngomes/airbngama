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
  p.setAttribute("class", "card-text");
  p.textContent = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(data[position].price || "");

  divCardBody.appendChild(cardTitle);
  divCardBody.appendChild(cardSubtitle);
  divCardBody.appendChild(p);

  divCard.appendChild(img);
  divCard.appendChild(divCardBody);

  return divCard;
}
async function fetchDatas() {
  await fetch("https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log("rolou", data);
      var divCardGroup = document.getElementById("div-card-group");
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

fetchDatas();
