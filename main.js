// DISPLAY CARD FUNCTION
const displayCard = (data) => {
  const carousel = document.querySelector(".carousel");
  let card = "";

  data.map(({ nama, img, harga, id }) => {
    card += `<li class="card">
          <img draggable="false" src="./img/${img}" alt="">
          <div class="body-card">
            <p>${nama}</p>
            <div class="checkout"> 
              <button data-key="${id}" class="btn-add">Add to Cart</button>
              <p>Rp${harga.toLocaleString("id-ID", {
                styles: "currency",
                currency: "IDR",
              })}</p>
            </div>
          </div>
        </li>`;
  });
  carousel.innerHTML = card;
};

// SLIDER CARD EFFECT FUNCTION
const sliderEffect = () => {
  const carousel = document.querySelector(".carousel");
  const firstCardWidth = carousel.querySelector(".card").offsetWidth;
  const arrowBtns = document.querySelectorAll(".wrapper i");

  let isDragging = false,
    startPageX,
    startScrollLeft;

  // Add event listeners for the arrow buttons to scroll the carousel left and right
  arrowBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      carousel.scrollLeft +=
        btn.id == "left" ? -firstCardWidth : firstCardWidth;
    });
  });

  const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging");
    // Records the initial cursor and scroll position of the carousel
    startPageX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
  };

  const dragging = (e) => {
    if (!isDragging) return; // if isDragging is false return from here
    // Updates the scroll position of the carousel based on the cursor movement
    carousel.scrollLeft = startScrollLeft - (e.pageX - startPageX);
    //        ?????       = 300 - 600 - 600
    // after geser ke kiri
    //      ?????????     = 300 - (400 - 600)
    //       ?????        = 300 - (-200)
    //       ???          = 500
    //     500
  };

  const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging");
  };

  carousel.addEventListener("mousedown", dragStart);
  carousel.addEventListener("mousemove", dragging);
  document.addEventListener("mouseup", dragStop);
};

// DISPLAY CART FUNCTION
const displayCart = (data) => {
  const btnAdd = document.querySelectorAll(".btn-add");
  const cardContainer = document.getElementById("cart");
  const totalElm = document.getElementById("total");

  //Array object cart
  let cart = [];

  //if cart empty show this to user
  let isCartEmpty = true;
  if (isCartEmpty) {
    cardContainer.innerHTML = "Your Cart Is Empty..";
    totalElm.innerHTML = "0";
  }

  btnAdd.forEach((btn) => {
    btn.addEventListener("click", () => {
      let total = 0;
      let card = "";
      cart.push(data[btn.getAttribute("data-key") - 1]);
      //display
      cart.map(({ nama, img, harga, id }) => {
        total += harga;
        card += ` <div class="cart-card">
                    <div class="cart-desc">
                      <img class="cart-thumbnail" src="./img/${img}" alt="food-img">
                      <div>
                      <p>${nama}</p>
                      <p>Rp${harga.toLocaleString("id-ID", {
                        styles: "currency",
                        currency: "IDR",
                      })}</p>
                      </div>
                    </div>
                    <i id="delete" data-key="${id}" class="fa-solid fa-trash"></i>
                  </div>`;
      });
      totalElm.innerHTML = `Rp${total.toLocaleString("id-ID", {
        styles: "currency",
        currency: "IDR",
      })}`;
      cardContainer.innerHTML = card;

      //Delete Cart
      const btnDel = document.querySelectorAll("#delete");
      btnDel.forEach((btn) => {
        btn.addEventListener("click", () => {
          total = 0;
          cart.splice(
            cart.findIndex((i) => i.id == btn.getAttribute("data-key")),
            1
          );

          cart.map(({ harga }) => {
            total += harga;
          });
          totalElm.innerHTML = `Rp${total.toLocaleString("id-ID", {
            styles: "currency",
            currency: "IDR",
          })}`;
          cardContainer.removeChild(btn.parentNode);

          //conditional rendering
          isCartEmpty = cart.length < 1 ? true : false;
          //if cart empty show this to user
          if (isCartEmpty) {
            cardContainer.innerHTML = "Your Cart Is Empty..";
            totalElm.innerHTML = "0";
          }
        });
      });
    });
  });
};

// READ API FUNCTION
async function readAPI() {
  try {
    const response = await fetch("data.json");
    const data = await response.json();

    //Display Card
    displayCard(data);
    sliderEffect();

    displayCart(data);
  } catch (error) {
    console.error(error);
  }
}

readAPI();
