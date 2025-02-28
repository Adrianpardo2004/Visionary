var salesChart; // Declarar salesChart en un ámbito mayor para poder acceder a él

// Definición de la función para cargar datos y dibujar el gráfico
function loadSalesDataAndDrawChart() {
    console.log("Cargando datos y dibujando gráfico...");

    // Cargar los datos desde el archivo JSON
    fetch('/Data/data_2023.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // Preparar los datos para la gráfica
            const labels = data.meses; // 'meses' es un array en tu JSON
            const salesData = data.totales; // 'totales' es un array en tu JSON

            // Si ya existe un gráfico, destruirlo
            if (salesChart) {
                salesChart.destroy();
            }

            // Crear la gráfica circular
            const ctx = document.getElementById('salesChart').getContext('2d');
            salesChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Ventas Mensuales',
                        data: salesData,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(255, 206, 86, 0.6)',
                            'rgba(75, 192, 192, 0.6)',
                            'rgba(153, 102, 255, 0.6)',
                            'rgba(255, 159, 64, 0.6)',
                        ],
                        borderColor: 'rgba(255, 255, 255, 1)',
                        borderWidth: 1,
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Composición de Ventas Mensuales'
                        },
                        datalabels: { // Agregar etiquetas de datos con los porcentajes
                            color: 'white', // Color de las etiquetas de los datos
                            formatter: function(value, context) {
                                return Math.round((value / salesData.reduce((a, b) => a + b)) * 100) + '%'; // Mostrar porcentaje
                            }
                        }
                    }
                }
            });

            // Actualizar la lista de "Warehouse Detail"
            const warehouseList = document.getElementById('warehouse-list');
            const totalPrimerSemestre = salesData.slice(0, 6).reduce((acc, curr) => acc + curr, 0); // Suma de Enero a Junio
            const totalSegundoSemestre = salesData.slice(6, 12).reduce((acc, curr) => acc + curr, 0); // Suma de Julio a Diciembre

            // Actualizar los elementos de la lista con formato de número
            warehouseList.innerHTML = `
                <li><span>Enero a junio</span><span>${totalPrimerSemestre.toLocaleString()} Ventas del semestre</span></li>
                <li><span>Julio a diciembre</span><span>${totalSegundoSemestre.toLocaleString()} Ventas del semestre</span></li>
            `;

            // Configurar las barras de progreso
            const progressBars = document.querySelectorAll('.progress');

            // Obtener el total máximo para normalizar el porcentaje
            const totalSales = Math.max(...salesData);

            progressBars.forEach((bar, index) => {
                const progress = salesData[index]; // Asignar los valores de las ventas a las barras
                const percentage = (progress / totalSales) * 100; // Calcular el porcentaje

                bar.style.width = '0%'; // Inicialmente, las barras están en 0%

                // Aumentar la barra al 100% del porcentaje calculado
                setTimeout(() => {
                    bar.style.width = percentage + '%'; // Luego, aumenta a su valor correspondiente
                }, 100); // Tiempo de retardo antes de mostrar el progreso

                // Actualizar el <span> con el valor de ventas correspondiente
                const spanValue = bar.previousElementSibling; // Seleccionar el <span> antes de la barra
                spanValue.innerText = progress.toLocaleString(); // Mostrar el valor formateado
            });
        })
        .catch(error => console.error('Error cargando el archivo JSON:', error));
}

// Función para descargar la imagen del gráfico en formato JPG
function downloadChartImage() {
    if (!salesChart) {
        alert("El gráfico no está disponible para descargar.");
        return;
    }

    const canvas = document.getElementById('salesChart');

    // Crear una nueva imagen del gráfico en formato JPG sin bordes ni márgenes extra
    const imageUrl = canvas.toDataURL("image/jpeg", 0.9);  // '0.9' para calidad máxima

    // Crear un enlace de descarga
    const link = document.createElement('a');
    link.href = imageUrl;  // Enlace a la imagen generada
    link.download = 'grafica_ventas.jpg';  // Nombre de la imagen descargada
    link.click();  // Disparar la descarga
}


// Llamar a la función después de que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    loadSalesDataAndDrawChart();
});
