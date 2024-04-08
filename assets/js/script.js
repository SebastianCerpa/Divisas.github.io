const input = document.querySelector(".input");
const select = document.querySelector("select");
const button = document.querySelector(".buscar");
const span = document.querySelector(".resultado");
const canvas = document.querySelector(".grafico");
const url = "https://mindicador.cl/api";
let myChart = null

const formatDate = (date)=>{
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    return `${day}/${month}/${year}`
}

function renderGrafico(data){
        console.log(data)
        const config = {
            type: "line",
            data: {
            labels: data.map((elem)=> formatDate(new Date(elem.fecha))),
            datasets: [{
            label: "Ultimos 10 días",
            backgroundColor: "red",
            data: data.map((elem)=> elem.valor),
            }]}}

            canvas.style.backgroundColor = "white";
            if (myChart) {
                myChart.destroy();
                }
            myChart = new Chart(canvas, config);
            }

async function buscarCotizacion(){
    try {
        const cantidad = input.value;
        const moneda = select.value;
        const fetching = await fetch(`${url}/${moneda}`);
        const data = await fetching.json();
        return data;
    } catch (error) {
        console.log(error)
        span.innerHTML = "Ha ocurrido un error";
        buscarCotizacion()
    }
}

button.addEventListener('click', async () => {
try {
    span.innerHTML = "Cargando..."
    const result = await buscarCotizacion()
    const cantidad = input.value;
    const moneda = select.value;
    const serie = result.serie;
    const lastValue = serie[0].valor;
    const valorTotal = (cantidad/lastValue).toFixed(2);
    const data = serie.slice(0, 10).reverse();
    span.innerHTML = `La cotización del ${moneda} para hoy es: $${valorTotal}`

    renderGrafico(data)
} catch (error) {
    console.log(error);}
})

