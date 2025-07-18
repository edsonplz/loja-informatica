document.addEventListener("DOMContentLoaded", function () {
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    const menu = document.querySelector('.menu');

    mobileMenuIcon.addEventListener('click', function () {
        menu.classList.toggle('mobile-menu-open');
    })
})

// Filtro de produtos */
document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll('.products-code-start');

    sections.forEach(section => {
        const menuItems = section.querySelectorAll('.product-filter-brands ul li');
        const productCards = section.querySelectorAll('.card-new-products');

        const state = {
            activeBrand: "todos",
            activeType: "todos"
        }

        function updateCards() {
            productCards.forEach(card => {
                const brand = card.getAttribute('data-brand');
                const type = card.getAttribute('data-products-type');

                if ((state.activeBrand === 'todos' || state.activeBrand === brand) && (state.activeType === 'todos' || state.activeType === type)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            })
        }

        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                menuItems.forEach(menuItem => {
                    menuItem.classList.remove('product-brand-active');
                })
                item.classList.add('product-brand-active');

                state.activeBrand = item.getAttribute('data-brand');
                state.activeType = item.getAttribute('data-products-type');

                updateCards();
            })
        })

        updateCards();

    })
})

// Slider de Patrocinadores

window.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.slider-sponsors');
    if (slider) {
        const images = slider.querySelectorAll('img');

        images.forEach(image => {
            const clone = image.cloneNode(true);
            slider.appendChild(clone);
        });

        const totalWidth = images.length * (images[0].offsetWidth + 20);

        slider.style.width = `${totalWidth}px`;

        let currentPosition = 0;

        const moveSlider = () => {
            currentPosition -= 1;
            if (currentPosition <= -totalWidth / 2) {
                currentPosition = 0;
            }

            slider.style.transform = `translateX(${currentPosition}px)`;
            requestAnimationFrame(moveSlider);
        }

        requestAnimationFrame(moveSlider);
    }
})

// Slider de Depoimentos
document.addEventListener("DOMContentLoaded", () => {
    const testimonials = document.querySelectorAll('.testimonial');
    if (testimonials.length > 0) {
        const controls = document.querySelectorAll('.controls-testimonials span');
        const firstTestimonial = testimonials[0];

        testimonials.forEach(testimonial => {
            testimonial.style.display = 'none';
        });
        firstTestimonial.style.display = 'block';

        controls.forEach(control => {
            control.addEventListener('click', () => {
                const targetSlide = control.getAttribute('data-slide');
                controls.forEach(c => {
                    c.classList.remove('active-testimonial');
                });
                control.classList.add('active-testimonial');

                testimonials.forEach(testimonial => {
                    testimonial.style.display = 'none';
                });

                const showTestimonial = document.querySelector('.testimonial[data-slide="' + targetSlide + '"]');
                showTestimonial.style.display = 'block';
            })
        })

        firstTestimonial.classList.add('active-testimonial');
    }
})

// Manipulação do carrinho de produtos
const productsArray = [];
const neigthborhoodShipment = [
    {
        neigthborhood: "Centro",
        shipment: 100
    },
    {
        neigthborhood: "Sitio",
        shipment: 150
    },
    {
        neigthborhood: "Amarelinha",
        shipment: 180
    }
]

function increaseQuantity(event) {
    const quantityElement = event.target.parentElement.querySelector('.number-quantity');
    const quantity = parseInt(quantityElement.textContent);
    quantityElement.textContent = quantity + 1;
}

function decreaseQuantity(event) {
    const quantityElement = event.target.parentElement.querySelector('.number-quantity');
    const quantity = parseInt(quantityElement.textContent);
    if (quantity > 0) {
        quantityElement.textContent = quantity - 1;
    }
}

function updateCart(quantity) {
    const cart = document.querySelector('.items-cart')
    cart.textContent = quantity;
}

function addProductToCart(event) {
    const productCard = event.target.closest('.card-new-products');
    const productName = productCard.querySelector('.info-product h3').textContent;
    const productImg = productCard.querySelector('.img-product');
    const srcProduct = productImg.getAttribute('src');
    const priceText = productCard.querySelector('.new-price').textContent;
    const price = parseFloat(priceText.replace("R$", ""));

    const quantityElement = productCard.querySelector('.number-quantity')

    let quantity = parseInt(quantityElement.textContent);

    const existingProductIndex = productsArray.findIndex((product) => product.productName === productName);

    if (quantity > 0) {
        if (existingProductIndex !== -1) {
            productsArray[existingProductIndex].quantity = quantity;
        } else {
            productsArray.push({
                productName: productName,
                productImg: srcProduct,
                price: price,
                quantity: quantity
            }
            )
        }
    } else {
        if (existingProductIndex !== 1) {
            productsArray.splice(existingProductIndex, 1);
        }
    }
    localStorage.setItem("productsArray", JSON.stringify(productsArray));
    updateCart(productsArray ? productsArray.length : 0);
}

const addCartButtons = document.querySelectorAll('.confirm-add-cart')

addCartButtons.forEach(button => {
    button.addEventListener('click', addProductToCart)
})

const decreaseButtons = document.querySelectorAll('.decrease-quantity')

decreaseButtons.forEach(button => {
    button.addEventListener('click', decreaseQuantity)
})

const increaseButtons = document.querySelectorAll('.increase-quantity')

increaseButtons.forEach(button => {
    button.addEventListener('click', increaseQuantity)
})

//Carrinho

const inputCep = document.querySelector('#cep');
const inputStreet = document.querySelector('#street');
const inputCity = document.querySelector('#city');
const inputState = document.querySelector('#state');
const inputNeigthborhood = document.querySelector('#neigthborhood');
const inputNumber = document.querySelector('#number');
const savedProductsArray = JSON.parse(localStorage.getItem("productsArray"));
const totalOrder = savedProductsArray ? savedProductsArray.reduce((acumulator, currentProduct) => {
    return acumulator + currentProduct.quantity * currentProduct.price;
}, 0) : 0;
const subtotal = document.querySelector('#subtotal-value')
const shipmentInput = document.querySelector('#shipment-value');
const totalOrderField = document.querySelector('#total-order-value');

document.addEventListener("DOMContentLoaded", function() {
    updateCart(savedProductsArray ? savedProductsArray.length : 0);
})

function searchCep() {
    const typedCep = inputCep.value.trim().replace(/\D/g, "");

    fetch(`https://viacep.com.br/ws/${typedCep}/json/`).then(response => {
        if (!response.ok) {
            console.error("Não foi possível obter os dados do CEP")
        }
        return response.json();
    }).then((data) => {
        inputCity.value = data.localidade;
        if (data.bairro) {
            inputNeigthborhood.value = data.bairro;
            let changeEvent = new Event("change", { bubbles: true })
            inputNeigthborhood.dispatchEvent(changeEvent);
        }
        inputState.value = data.estado;
        inputStreet.value = data.logradouro;
    }).catch((error => {
        console.error("Erro: ", error)
    }))

    console.log(typedCep)
}

document.addEventListener("DOMContentLoaded", function () {
    const tbody = document.querySelector('.info-products-order tbody');

    if (tbody && savedProductsArray) {
        for (const product of savedProductsArray) {
            const row = document.createElement("tr");
            const nameCell = document.createElement("td");
            nameCell.innerHTML = `<div class="product-cart">
                                <img src="${product.productImg}" alt="${product.productName}" width="100px"/>
                                ${product.productName}
                                </div>`;

            const priceCell = document.createElement("td");
            priceCell.textContent = `R$ ${product.price.toFixed(2)}`;

            const quantityCell = document.createElement("td");
            quantityCell.textContent = product.quantity;

            const subTotalCell = document.createElement("td");
            const subtotal = product.price * product.quantity;
            subTotalCell.textContent = `R$ ${subtotal.toFixed(2)}`

            row.appendChild(nameCell);
            row.appendChild(priceCell);
            row.appendChild(quantityCell);
            row.appendChild(subTotalCell);
            tbody.appendChild(row);
        }
    }
})

function finishOrder() {
    const fullName = document.querySelector('#fullname').value;
    const rg = document.querySelector('#rg').value;
    const cpf = document.querySelector('#cpf').value;
    const cep = inputCep.value;
    const street = inputStreet.value;
    const city = inputCity.value;
    const number = inputNumber.value;
    const neigthborhood = inputNeigthborhood.value;
    const state = inputState.value;

    let textFormated = `Olá gostaria de fazer um pedido.
    Meus dados são:
    Nome: ${fullName}
    Rg: ${rg}
    CPF: ${cpf}
    Endereço: Rua: ${street}, Cidade: ${city}, Estado ${state}, Bairro ${neigthborhood}, Número/Complemento ${number}, CEP ${cep}
    Os produtos que escolhi são: `;

    savedProductsArray.forEach((product) => {
        textFormated += `
        Nome do produto: ${product.productName}
        Preço: R$ ${product.price}
        Quantidade: ${product.quantity}`;
    })

    textFormated += `
    Total do Pedido: R$ ${totalOrder}`

    const textEncoded = encodeURIComponent(textFormated);

    window.open(`https://wa.me/5583993719980?text=${textEncoded}`)
}

function clearCart() {
    localStorage.removeItem("productsArray");
    inputCep.value = '';
    inputStreet.value = '';
    inputCity.value = '';
    inputNeigthborhood.value = '';
    inputNumber.value = '';
    inputState.value = '';
    location.reload();
}

function updateInfoOrder() {
    if (subtotal) {
        subtotal.textContent = totalOrder;
    }

    if (shipmentInput && totalOrderField && savedProductsArray.length > 0 && inputNeigthborhood.value != "") {
        const foundedNeigthborhood = neigthborhoodShipment.find(info => info.neigthborhood === inputNeigthborhood.value);

        const shipmentValue = foundedNeigthborhood ? foundedNeigthborhood.shipment : 150;
        shipmentInput.textContent = shipmentValue;

        totalOrderField.textContent = Number(subtotal.textContent) + Number(shipmentValue);
    }
}

if (inputNeigthborhood) {
    inputNeigthborhood.addEventListener("change", function () {
        updateInfoOrder();
    })
}