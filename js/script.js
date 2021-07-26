/* --- Geral --- */
//Variables
const darkMode = document.querySelector('#darkModeBtn')
let pizzaModal = document.querySelector('.pizzaInfoModal')
let pizzaModalContent = pizzaModal.querySelector('.modalContent')
let key

let pizzaAmount = 1 //Quantidade de pizzas do modal.
let cart = [] //Carrinho de compras.
let modalKey, pizzaPrice, pizzaPriceFloat

let subtotal = 0
let discount = 0
let total = 0
let cartModal = document.querySelector('.cart')
let cartVisibility = 'hidden'

//Functions
function closePizzaInfoModal() {
  pizzaModal.style.opacity = 0

  setTimeout(() => {
    pizzaModal.style.display = 'none'
  }, 300)
}

function closeCartModal() {
   
  cartModal.style.opacity = 0

  setTimeout(() => {
    cartModal.style.display = 'none'
  }, 300)
}

/* --- Dark Mode ---*/
darkMode.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark-mode')
})

/* --- Close Modal Buttons --- */
document
  .querySelectorAll('.closeProduct, .mobileCloseModal')
  .forEach(element => {
    element.addEventListener('click', () => {
      closePizzaInfoModal()
    })
  })

/* --- Select pizza size --- */
document.querySelectorAll('.pizzaSize').forEach(element => {
  element.addEventListener('click', () => {
    document.querySelector('.pizzaSize.selected').classList.remove('selected')
    element.classList.add('selected')

    /* Set price */
    pizzaPriceFloat = pizzaJson[key].price
    let keyValue = element.getAttribute('data-key')

    switch (Number(keyValue)) {
      case 0:
        pizzaPriceFloat *= 0.8
        break
      case 1:
        pizzaPriceFloat *= 0.9
        break
      default:
        console.log('Erro ao calcular o preço. Key = ' + key)
        break
    }

    pizzaPrice = pizzaPriceFloat.toFixed(2)
    pizzaModalContent.querySelector('.price').innerHTML = `R$ ${pizzaPrice}`

    pizzaAmount = 1
    document.querySelector('.qntBtn h3').innerHTML = pizzaAmount
  })
})

/* --- Change pizza quantity --- */
document.querySelector('.lessQnt').addEventListener('click', () => {
  //To decrease pizza amount
  if (pizzaAmount > 1) {
    pizzaAmount--
    let pizzaPriceAct = (pizzaPriceFloat * pizzaAmount).toFixed(2)

    pizzaModalContent.querySelector('.price').innerHTML = `R$ ${pizzaPriceAct}`
    document.querySelector('.qntBtn h3').innerHTML = pizzaAmount
  }
})

document.querySelector('.moreQnt').addEventListener('click', () => {
  //To increase pizza amount.
  pizzaAmount++
  let pizzaPriceAct = (pizzaPrice * pizzaAmount).toFixed(2)

  pizzaModalContent.querySelector('.price').innerHTML = `R$ ${pizzaPriceAct}`
  document.querySelector('.qntBtn h3').innerHTML = pizzaAmount
})

/* --- Cart --- */
document.querySelector('.cartIcon').addEventListener('click', () => {
  //cart eventListener to open modal.
  if (cartVisibility == 'visible') {
    cartVisibility = 'hidden'
    closeCartModal()
  } else {
    cartModal.style.display = 'flex'
    cartModal.style.visibility = 'visible'

    cartModal.style.opacity = 0
    setTimeout(() => {
      cartModal.style.opacity = 1
    }, 30)
    cartVisibility = 'visible'
  }
})



/* --- Main System --- */
document.querySelector('.addProduct').addEventListener('click', () => {
  //Add product to cart
  //modalKey = Qual pizza
  //pizzaSize = Tamanho da pizza
  //pizzaAmount = Quantidade de pizzas
  let pizzaSize = parseInt(
    document.querySelector('.pizzaSize.selected').getAttribute('data-key')
  )
  let identifier = pizzaJson[modalKey].id + '@' + pizzaSize
  let key = cart.findIndex(item => item.identifier == identifier)

  if (key > -1) {
    cart[key].amount += pizzaAmount
  } else {
    cart.push({
      identifier: identifier,
      id: pizzaJson[modalKey].id,
      size: pizzaSize,
      amount: pizzaAmount
    })
  }

  console.log(cart)
  document.querySelector('.cartIcon span').innerHTML = cart.length
  document.querySelector('.cartIcon span').style.display = 'flex'

  updateCar()
  closePizzaInfoModal()
})

pizzaJson.map((item, index) => {
  //Fill content div with pizzas info & open modal system.
  let pizzaItem = document.querySelector('.models .pizzaItem').cloneNode(true)

  pizzaItem.setAttribute('data-key', index)
  pizzaItem.querySelector('.pizzaPrice').innerHTML = `R$ ${item.price.toFixed(
    2
  )}`
  pizzaItem.querySelector('.pizzaImg img').src = item.img
  pizzaItem.querySelector('.pizzaName').innerHTML = item.name
  pizzaItem.querySelector('.pizzaDescription').innerHTML = item.description

  pizzaItem.querySelector('a').addEventListener('click', e => {
    e.preventDefault()
    closeCartModal()

    key = e.target.closest('.pizzaItem').getAttribute('data-key')
    pizzaPrice = pizzaJson[key].price.toFixed(2)

    pizzaModalContent.querySelector('.pizzaDescription').innerHTML =
      pizzaJson[key].description
    pizzaModalContent.querySelector('.pizzaName').innerHTML =
      pizzaJson[key].name
    pizzaModalContent.querySelector('.price').innerHTML = `R$ ${pizzaPrice}`
    pizzaModalContent.querySelector('img').src = pizzaJson[key].img
    pizzaModalContent.querySelector('.priceArea .qntBtn h3').innerHTML =
      pizzaAmount

    pizzaModalContent
      .querySelectorAll('.pizzaSize')
      .forEach((size, sizeIndex) => {
        size.classList.remove('selected')
        if (sizeIndex == 2) size.classList.add('selected')
        size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
      })

    //open modal animation
    pizzaModal.style.display = 'flex'
    pizzaModal.style.visibility = 'visible'

    pizzaModal.style.opacity = 0
    setTimeout(() => {
      pizzaModal.style.opacity = 1
    }, 30)

    pizzaAmount = 1
    modalKey = key
  })

  document.querySelector('main .content').append(pizzaItem)
})

function updateCar() {
  //Update cart function
  /*     document.querySelector('') - Do span do header do mobile*/

  if (cart.length > 0) {
    document.querySelector('.cart .container').innerHTML = ''

    for (let i in cart) {
      let pizzaItem = pizzaJson.find(item => item.id == cart[i].id)
      let cartItem = document.querySelector('.models .cartItem').cloneNode(true)
      let pizzaSizeName

      subtotal = Math.round(pizzaItem.price * cart[i].amount)

      switch (cart[i].size) {
        case 0:
          pizzaSizeName = 'Pequena'
          console.log()
          break
        case 1:
          pizzaSizeName = 'Média'
          break
        case 2:
          pizzaSizeName = 'Grande'
          break
        default:
          pizzaSizeName = 'Erro'
          console.log('Erro #001')
      }

      cartItem.querySelector('img').src = pizzaItem.img
      cartItem.querySelector('.cartPizzaName').innerHTML = pizzaItem.name
      cartItem.querySelector('.pizzaSize').innerHTML = ' - ' + pizzaSizeName
      cartItem.querySelector('.cartQuantityArea .showQuantity').innerHTML =
        cart[i].amount
      cartItem
        .querySelector('.cartQuantityArea .removeQuantity')
        .addEventListener('click', () => {
          if (cart[i].amount > 1) {
            cart[i].amount--
          } else {
            console.log(cart)
            cart.splice(i, 1)
            console.log(cart)
          }
          updateCar()
        })

      cartItem
        .querySelector('.cartQuantityArea .addQuantity')
        .addEventListener('click', () => {
          cart[i].amount++
          updateCar()
        })

      document.querySelector('.cart .container').append(cartItem)
    }

    discount = Math.round(subtotal * 0.1)
    total = subtotal - discount



    document.querySelector(
      '.cart .finalData .text .subTotal'
    ).innerHTML = `Subtotal: R$ ${subtotal.toFixed(2)}`
    document.querySelector(
      '.cart .finalData .text .discount'
    ).innerHTML = `Desconto: R$ ${discount.toFixed(2)}`
    document.querySelector(
      '.cart .finalData .text .totalText'
    ).innerHTML = `Total: R$ ${total.toFixed(2)}`
  }
}

const finaliza = document.querySelector('.botaofinal')
finaliza.addEventListener('click', () => iniciaDados('modal-dados'))


function iniciaDados(modalID) {
  const modalDI = document.getElementById(modalID)
  if (modalDI){
  modalDI.classList.add('mostrar')
  modalDI.addEventListener('click', (e) => {
    if(e.target.id == modalID) {
     modalDI.classList.remove('mostrar');
    }
 }); 
}
}

// FORM //

document.getElementById('botaoEnviar')

var nome = document.querySelector('.nome')
var email = document.querySelector('.email')
var telefone = document.querySelector('.phone')
var estado = document.querySelector('.estado')
var endereco = document.querySelector('.endereco')
var pagamento = document.querySelector('.pag')
var msgError = document.querySelector('#msgError')
var msgSuccess = document.querySelector('#msgSuccess')
var pizzanome = document.querySelector('.pizzaName')
var quantidade = document.querySelector('.qntBtn h3')


function finalizarprodutos(){
  if (pizzanome.value != '' && quantidade.value != '' ) {
    let produtos = JSON.parse(
      localStorage.getItem('pizzaName') ||      localStorage.getItem('qntBtn h3')
    )
    produtos.push({
      Pizza: pizzanome.value,
      Quantidade: quantidade.value
    })

    localStorage.setItem('produtos', JSON.stringify(produtos))
  }
}





function finalizarcomprar() {
  if (nome.value != '' && email.value != '' && telefone.value != '' && estado.value != '' &&  endereco.value !='' && pagamento.value !='' ) {
    let clientes = JSON.parse(
      localStorage.getItem('clientes') || '[]'
    )

    clientes.push({
      Nome: nome.value,
      Email: email.value,
      Telefone: telefone.value,
      Estado: estado.value,
      Endereço: endereco.value,
      Pagamento: pagamento.value
    })

    localStorage.setItem('clientes', JSON.stringify(clientes))

    msgSuccess.setAttribute('style', 'display: block')
    msgSuccess.innerHTML =
      '<strong>Prontinho! Seu Pedido foi finalizado com sucesso! </strong>'
    msgError.setAttribute('style', 'display: none')
    msgError.innerHTML = ''
  } else {
    msgError.setAttribute('style', 'display: block')
    msgError.innerHTML =
      '<strong>Ops! Algo saiu errado. Precisamos de todos os dados Completos! </strong>'
    msgSuccess.innerHTML = ''
    msgSuccess.setAttribute('style', 'display: none')
  }
}
