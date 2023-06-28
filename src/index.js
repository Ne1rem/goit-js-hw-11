import axios from 'axios'
import Notiflix from 'notiflix'
const API_KEY = 37953562-c7c28b8f0c02ebea23bfb706a
const searchText = document.querySelector(`.search-form input`)
let findingText = searchText.value.toLowerCase()
let URL = `https://pixabay.com/api/?key=${API_KEY}&q=${findingText}`