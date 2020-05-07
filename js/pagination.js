let list = [];
let pageList = [];
let currentPage = 1;
let numberPerPage = 6;
let numberOfPages = 1;

function createPagesItem() {
  let lines = "";
  for (let i = 1; i <= numberOfPages; i++) {
    lines += `<li id="page-${i}" class="page-item"><a class="page-link" onclick="goToPage(${i})">${i}</a></li>`;
  }

  return lines;
}

function createPagination() {
  let row = document.createElement("div");
  row.className = "row row-pagination";

  row.innerHTML = `
    <div class="col-md-12">
        <nav>
            <ul class="pagination">
                <li id="previousPage" class="page-item">
                <a class="page-link" onclick="previousPage()" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                    <span class="sr-only">Previous</span>
                </a>
                </li>
                ${createPagesItem()}
                <li id="nextPage" class="page-item">
                <a class="page-link" onclick="nextPage()" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                    <span class="sr-only">Next</span>
                </a>
                </li>
            </ul>
        </nav>
    </div>
  `;

  return row;
}

function loadPagination(cards) {
  numberOfPages = Math.ceil(cards.length / numberPerPage);
  currentPage = 1;
  list = cards;
  loadList();
}

function nextPage() {
  currentPage += 1;
  loadList();
}

function goToPage(page) {
  currentPage = page;
  loadList();
}

function previousPage() {
  currentPage -= 1;
  loadList();
}

function loadList() {
  const begin = (currentPage - 1) * numberPerPage;
  const end = begin + numberPerPage;

  pageList = list.slice(begin, end);
  renderCards(pageList);
  checkButtonsPagination();
}

function checkButtonsPagination() {
  let elementPage = document.getElementById(`page-${currentPage}`);
  elementPage.setAttribute("class", "page-item active");

  document.getElementById("nextPage").className =
    currentPage == numberOfPages ? "page-item disabled" : "page-item";
  document.getElementById("previousPage").className =
    currentPage == 1 ? "page-item disabled" : "page-item";
}
