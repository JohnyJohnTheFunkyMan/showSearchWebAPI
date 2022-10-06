const form = document.querySelector('form')
const bg = document.querySelector('.background')
const resultCont = document.querySelector('.search-results')

const submitQuery = async (searchTerm) => {
    let searchResults = await axios.get(`https://api.tvmaze.com/search/shows?q=${searchTerm}`)
    return searchResults
}

const listQueries = (searchObj) => {
    for (let e of searchObj) {
        const newShow = document.createElement('div')
        const showImg = document.createElement('img')
        newShow.classList.add('movie-card')
        showImg.src = e.show.image.original
        newShow.append(showImg)
        resultCont.append(newShow)
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