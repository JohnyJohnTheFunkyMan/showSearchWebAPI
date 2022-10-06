const form = document.querySelector('form')
const bg = document.querySelector('.background')
const resultCont = document.querySelector('.search-results')

const submitQuery = async (searchTerm) => {
    let searchResults = await axios.get(`https://api.tvmaze.com/search/shows?q=${searchTerm}`)
    return searchResults
}

const createInfoElements = (showTitle, showRating, showSummary) => {
    const overlay = document.createElement('div')
    overlay.classList.add('overlay')
    const overlayContentContainer = document.createElement('div')
    overlayContentContainer.classList.add('overlay-content-container')
    const movieTitle = document.createElement('h1')
    movieTitle.classList.add('movie-title')
    movieTitle.innerHTML = showTitle
    const rating = document.createElement('h2')
    rating.classList.add('rating')
    const movieRating = document.createElement('span')
    movieRating.classList.add('movie-rating')
    if (showRating === null) showRating = 0
    movieRating.innerHTML = showRating
    const starSymbol = document.createElement('i')
    starSymbol.classList.add('fa-solid')
    starSymbol.classList.add('fa-star')
    const starSymbol1 = document.createElement('i')
    starSymbol1.classList.add('fa-solid')
    starSymbol1.classList.add('fa-star')
    const overTen = document.createTextNode('/ 10')
    const movieSummary = document.createElement('p')
    movieSummary.classList.add('movie-summary')
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

const listQueries = (searchObj) => {
    let loadImages = 0
    for (let e of searchObj) {
        const newShow = document.createElement('div')
        const showImg = document.createElement('img')
        newShow.classList.add('movie-card')
        showImg.src = e.show.image.original
        let smallInfoOverlay = createInfoElements(e.show.name, e.show.rating.average, e.show.summary)
        newShow.append(smallInfoOverlay)
        console.log(newShow)
        newShow.append(showImg)
        resultCont.append(newShow)

        newShow.addEventListener('click', () => {
            newShow.classList.toggle('small-screen-menu')
        })
    }
}

const search = async () => {
    try {
        const searchTerm = form.children[0].value
        if (searchTerm === '') {
            console.log('no search term!')
            return 0
        }
        const searchResults = await submitQuery(searchTerm)
        if (searchResults.data.length === 0) {
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