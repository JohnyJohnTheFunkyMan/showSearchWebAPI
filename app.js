const form = document.querySelector('form')
const bg = document.querySelector('.background')
const resultCont = document.querySelector('.search-results')

const submitQuery = async (searchTerm) => {
    let searchResults = await axios.get(`https://api.tvmaze.com/search/shows?q=${searchTerm}`)
    return searchResults
}

const createMovieCard = (imgSrc) => {
    let movieCard = document.createElement('div')
    const movieImg = document.createElement('img')
    movieCard.classList.add('movie-card')
    movieImg.src = imgSrc
    movieCard.append(movieImg)
    return movieCard
}

const createInfoElements = (showTitle, showRating, showSummary) => {
    const elementsArray = []
    const elementsClasses = ['overlay', 'overlay-content-container', 'movie-title', 'rating', 'movie-rating', 'fa-solid', 'fa-solid', 'movie-summary']
    const elementNames = ['div', 'div', 'h1', 'h2', 'span', 'i', 'i', 'p']
    for (let index in elementNames) {
        elementsArray.push(document.createElement(elementNames[index]))
        elementsArray[index].classList.add(elementsClasses[index])
    }
    const [overlay, overlayContentContainer, movieTitle, rating, movieRating, starSymbol, starSymbol1, movieSummary] = elementsArray
    starSymbol.classList.add('fa-star')
    starSymbol1.classList.add('fa-star')
    movieTitle.innerHTML = showTitle
    if (showRating === null) showRating = 0
    movieRating.innerHTML = showRating
    const overTen = document.createTextNode(' / 10')
    movieSummary.innerHTML = showSummary

    overlay.append(overlayContentContainer)
    overlayContentContainer.append(movieTitle)
    overlayContentContainer.append(rating)
    rating.append(movieRating)
    rating.append(starSymbol)
    rating.append(overTen)
    rating.append(starSymbol1)
    overlayContentContainer.append(movieSummary)

    return overlay
}

const checkForBounds = () => {
    const movies = document.querySelectorAll('.movie-card')
    const windowHalfX = window.innerWidth / 2
    const windowHalfY = (window.innerHeight / 2) + 100
    for (let movie of movies) {
        const movieObj = movie.getBoundingClientRect()
        const movieHoverDiv = movie.children[1]
        let currLeftVal = Number(movieHoverDiv.style.left.slice(0, -3))
        let currTopVal = Number(movieHoverDiv.style.top.slice(0, -3))
        if (movieObj.left > windowHalfX) {
            currLeftVal -= 20
            movieHoverDiv.style.left = currLeftVal + 'rem'
        }
        if (movieObj.top > windowHalfY) {
            currTopVal -= 10
            movieHoverDiv.style.top = currTopVal + 'rem'
        }
    }
}

const listQueries = (searchObj) => {
    for (let e of searchObj) {
        const newShow = createMovieCard(e?.show?.image?.original || 'assets/noImage.png')
        let smallInfoOverlay = createInfoElements(e.show.name, e.show.rating.average, e.show.summary)
        newShow.append(smallInfoOverlay)
        resultCont.append(newShow)
        if (window.innerWidth < 700) {
            newShow.addEventListener('click', () => {
                newShow.classList.toggle('small-screen-menu')
            })
        } else {
            newShow.addEventListener('mouseover', (e) => {
                newShow.classList.add('big-screen-menu')
            })
            newShow.addEventListener('mouseout', () => {
                newShow.classList.remove('big-screen-menu')
            })
        }
    }
    window.innerWidth >= 700 && checkForBounds()
}

const search = async () => {
    try {
        const searchTerm = form.children[0].value
        const searchResults = await submitQuery(searchTerm)
        if (!searchResults.data.length) {
            let nsr = document.createElement('p')
            nsr.classList.add('no-search-results')
            nsr.innerHTML = 'no search results found'
            resultCont.append(nsr)
        } else {
            bg.style.paddingBlockStart = '2.5rem'
            listQueries(searchResults.data)
        }
    } catch (e) {
        console.log(e)
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    while (resultCont.children.length > 0) {
        let currChild = resultCont.children[0]
        resultCont.removeChild(currChild)
    }
    search()
})