const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById("template-footer").content
const templateCarrito = document.getElementById("template-carrito").content
const fragment = document.createDocumentFragment()
let carrito = {}



// events
document.addEventListener("DOMContentLoaded", () => {

    fechtData()
 if (localStorage.getItem('carrito')) {
     
     carrito = JSON.parse(localStorage.getItem('carrito'))
     pintarCarrito()
 }

}
)
cards.addEventListener("click", (e) => addCarrito(e))

items.addEventListener('click', (e) => btnAccion(e))
const fechtData = async () => {
    
    try {
        const res = await fetch("api.json");
        const data = await res.json()
        pintarCard(data)


    } catch (error) {
        console.log(error);
    }
}


const pintarCard = (data) => {
    
    data.forEach(item => {
        
        templateCard.querySelector('h5').textContent = item.title
        templateCard.querySelector('p').textContent = item.precio
        templateCard.querySelector('button').dataset.id = item.id
        templateCard.querySelector("img").setAttribute("src", item.thumbnailUrl)
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    });
cards.appendChild(fragment)
}

const addCarrito = e => {

    if (e.target.matches(".btn")) { 

 setCarrito(e.target.parentElement);

    }
    e.stopPropagation()
}


const setCarrito = obj => {

    const producto = {
        title: obj.querySelector('h5').textContent,
        precio: obj.querySelector('p').textContent,
        id: obj.querySelector('button').dataset.id,
        cantidad: 1
    }
    
    
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = { ...producto }
    pintarCarrito()
}


const pintarCarrito = () => {
  
items.innerHTML = ''
    Object.values(carrito).forEach(product => {
        
        templateCarrito.querySelector('th').textContent = product.title
        templateCarrito.querySelectorAll('td')[0].textContent = product.title
        templateCarrito.querySelectorAll('td')[1].textContent = product.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = product.id
        templateCarrito.querySelector('.btn-danger').dataset.id = product.id
        templateCarrito.querySelector('span').textContent = product.cantidad * product.precio
        const clone = templateCarrito.cloneNode(true)
    fragment.appendChild(clone)    

    })
items.appendChild(fragment)

    pintarFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const pintarFooter = () => {
    footer.innerHTML = ''
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = ` <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`
        return
    }
    
    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad,0)
    const nProduct = Object.values(carrito).reduce((acc, { cantidad, precio }) => acc + cantidad * precio, 0)
    
    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nProduct

     
    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)  

    footer.appendChild(fragment)
    const btnVaciar = document.querySelector('#vaciar-carrito')

    btnVaciar.addEventListener('click', () => {
        carrito = {}
        console.log(carrito);
        pintarCarrito()
    })
}

const btnAccion = e => {
    
    if (e.target.classList.contains('btn-info')) {
        
        const product =  carrito[e.target.dataset.id]
        product.cantidad++
        console.log(product.cantidad);
        carrito[e.target.dataset.id] = {...product}
        pintarCarrito()
    }

    if (e.target.classList.contains('btn-danger')) {

        const product = carrito[e.target.dataset.id]
        product.cantidad--
        console.log(product.cantidad);
        carrito[e.target.dataset.id] = { ...product }
        if (product.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()


    }
e.stopPropagation()
}