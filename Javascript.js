const productList = document.querySelector(".product-list");
const searchForm = document.querySelector(".search-form");
const priceChart = document.querySelector(".Price-chart");
const searchInput = document.querySelector("#input");

searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    searchForm.dispatchEvent(new event("submit"));
  }
});

let Mychart = "";

searchForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const input = event.target[0].value;
  const data = await fetch(
    `https://api.mercadolibre.com/sites/MLB/search?q=${input}`
  );

  // Pega somente os 10 primeiros e mostra no console
  const products = (await data.json()).results.slice(0, 20);

  // Chama a função Displayitems passando os produtos
  Displayitems(products);
  UpdatePriceChart(products);
});

function Displayitems(products) {
  productList.innerHTML = products
    .map(
      (product) => `
        <div class="product-card">
          <img src="${product.thumbnail.replace(/\w\.jpg/gi, "W.jpg")}" alt="${
        product.title
      }">

          <h3> ${product.title}</h3>

          <p class="product-price" > Preço : ${product.price.toLocaleString(
            "pt-br",
            {
              style: "currency",
              currency: "BRL",
            }
          )}
          </p>

          <p class="product-store" > Loja : ${product.seller.nickname} </p>

          <a href=${product.permalink}
          target="_blank"
          class="product-link"
          > Ver Produto
          </a>
        </div>
      `
    )
    .join("");
}

function UpdatePriceChart(products) {
  const ctx = priceChart.getContext("2d");

  if (Mychart) {
    Mychart.destroy();
  }

  Mychart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: products.map((product) => product.title.substring(0, 20) + ".."),
      datasets: [
        {
          label: "Preço (RS)",
          data: products.map((products) => products.price),
          backgroundColor: "rgba(135, 206, 235, 1)",
          borderColor: "rgba(46,204,113,1)",
          BorderWidth: 1,
        },
      ],
    },
    Options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return (
                "R$" +
                value.toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })
              );
            },
          },
          Plugins: {
            legend: {
              diplay: false,
            },
            title: {
              display: true,
              text: "Comparador de Preços",
              font: {
                size: 18,
              },
            },
          },
        },
      },
    },
  });
}
