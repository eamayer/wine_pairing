
const form = document.querySelector('form')
form.addEventListener('submit', event => {
    alert("hi");
    event.preventDefault()
})