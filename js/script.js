// VARIABLES
const listaLibros = document.querySelector('#listaLibros');
const botonBackArea = document.querySelector('#botonBack');
const subtitulo = document.querySelector('#subtitulo');
const mainIndex = document.querySelector('#mainIndex');
const URLPrincipal = 'https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=jJgyyVhUzpWhDDqn1MdittMq1PfrAH1q';
const fragment = document.createDocumentFragment();

// EVENTOS 
document.addEventListener('DOMContentLoaded', () => {
    llamarAPIPrincipal()
        .then((resp) => {
            pintarCuerpo(resp);
        })
        .catch((error) => {
            console.error(error);
        });
});

document.addEventListener('click', ({ target }) => {
    if (target.textContent == 'READ MORE!') {
        const categoria = target.id
        llamarAPISecundaria(categoria)
            .then((resp1) => {
                pintarSeleccion(resp1);
            })
            .catch((error1) => {
                console.log(error1)
            })
    }

    if (target.matches('.buttonBack')) {
        limpiar(mainIndex);
        limpiar(subtitulo);
        llamarAPIPrincipal()
            .then((resp1) => {
                pintarCuerpo(resp1);
            })
            .catch((error) => {
                console.error(error);
            })
    }

    if (target.textContent == 'BUY AT AMAZON') {
        let urlAmazon = target.id;
        window.open(urlAmazon, '_blank')
    }
});

// FUNCIONES
const llamarAPIPrincipal = async () => {
    try {
        const response = await fetch(URLPrincipal);
        if (response.ok) {
            const data = await response.json();
            console.log(data.results)
            return data.results;
        } else {
            throw 'No se encontró URL';
        }
    } catch (error) {
        console.log(error);
    }
};
const llamarAPISecundaria = async (categoria) => {
    try {
        const response = await fetch(`https://api.nytimes.com/svc/books/v3/lists/current/${categoria}.json?api-key=jJgyyVhUzpWhDDqn1MdittMq1PfrAH1q`)
        if (response.ok) {
            const data2 = await response.json();
            console.log(data2.results)
            return data2.results;
        }
    } catch {

    }
}

const pintarCuerpo = (resp) => {
    const lista = document.createElement('section');
    lista.setAttribute('id', 'listaLibros')
    resp.forEach((element) => {
        const bookCard = document.createElement('div')
        bookCard.classList.add('bookCard');

        const nombreLista = document.createElement('h3')
        nombreLista.classList.add('encabezadoCard')
        nombreLista.innerHTML = element.display_name;
        const contenidoCard = document.createElement('div')
        const updated = document.createElement('p');
        updated.innerHTML = `Updated: ${element.updated}`;
        const oldest = document.createElement('p');
        oldest.innerHTML = `Oldest: ${element.oldest_published_date}`;
        const newest = document.createElement('p');
        newest.innerHTML = `Newest: ${element.newest_published_date}`
        contenidoCard.append(oldest, newest, updated)
        const botonRead = document.createElement('button');
        botonRead.classList.add('botonRead');
        botonRead.innerHTML = 'READ MORE!';
        botonRead.setAttribute('id', element.list_name_encoded)
        bookCard.append(nombreLista, contenidoCard, botonRead)
        fragment.append(bookCard)
    });
    lista.append(fragment)
    mainIndex.append(lista)
};

const pintarSeleccion = (resp1) => {
    limpiar(mainIndex);
    console.log(resp1)
    const seccionBoton = document.createElement('section')
    seccionBoton.setAttribute('class', 'seccionBotonBack')
    const botonBack = document.createElement('button')
    botonBack.classList.add('buttonBack')
    botonBack.innerHTML = `BACK TO INDEX`
    seccionBoton.append(botonBack)
    const lista = document.createElement('section');
    lista.setAttribute('id', 'listaLibros');
    subtitulo.textContent = `${resp1.list_name}`;
    const arrayLibros = resp1.books;

    arrayLibros.forEach((elemento) => {

        const cardsRank = document.createElement('div');
        cardsRank.classList.add('cardsRank');
        const tituloRank = document.createElement('h5');
        tituloRank.textContent = `#${elemento.rank} ${elemento.title}`
        const imagenRank = document.createElement('img');
        imagenRank.setAttribute('src', elemento.book_image);
        imagenRank.setAttribute('alt', elemento.title);
        imagenRank.classList.add('fotoPortada')
        const descripcion = document.createElement('p');
        descripcion.textContent = elemento.description || "No se cuentan con descripcion";
        const weeksRank = document.createElement('p')
        weeksRank.textContent = `Weeks on List: ${elemento.weeks_on_list}`
        const botonAmazon = document.createElement('button')
        botonAmazon.textContent = 'BUY AT AMAZON';
        botonAmazon.classList.add('amazonButton')
        botonAmazon.setAttribute('id', elemento.amazon_product_url)
        cardsRank.append(tituloRank, imagenRank, descripcion, botonAmazon);
        fragment.append(cardsRank);
    })
    lista.append(fragment)
    mainIndex.append(seccionBoton, lista)
}
const limpiar = (elemento) => {
    elemento.innerHTML = '';
}
