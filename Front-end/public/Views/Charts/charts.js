// Confirmación de que charts.js está cargado
console.log('charts.js cargado');

(function () {
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    let chartInstance;

    const descriptions = {
        'Australia': 'Australia es conocida por su estabilidad económica y su fuerte industria minera. Las ventas tienden a aumentar en los meses de invierno.',
        'Brasil': 'Brasil, con su vasta población, muestra un comportamiento de ventas estacional influenciado por festividades locales.',
        'Canadá': 'Canadá destaca por su fuerte sector tecnológico y picos de ventas en verano e invierno.',
        'China': 'China, una de las economías más grandes del mundo, experimenta picos de ventas durante el Año Nuevo Lunar.',
        'Colombia': 'En Ecuador, las ventas están marcadas por eventos locales y cambios estacionales.',
        'Francia': 'Francia muestra tendencias de ventas estables con picos durante las vacaciones de verano.',
        'Alemania': 'Alemania, líder en manufactura, tiene un comportamiento de ventas estable con un ligero aumento en otoño.',
        'Italia': 'Italia, con su rica cultura, tiene picos de ventas durante la temporada de turismo.',
        'Japón': 'Japón experimenta picos de ventas en primavera y otoño, coincidiendo con festividades tradicionales.',
        'Sudáfrica': 'En Sudáfrica, las ventas tienden a fluctuar según las estaciones, con picos en marzo.',
        'Reino Unido': 'El Reino Unido muestra ventas altas en invierno, especialmente durante las festividades de fin de año.',
        'Estados Unidos': 'En los Estados Unidos, el comportamiento de ventas refleja un fuerte aumento en la temporada navideña.'
    };

    async function loadData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error al cargar el archivo JSON: ' + response.statusText);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al cargar los datos:', error);
        }
    }

    async function generateChart(data, country) {
        if (!data[country]) {
            console.error(`País no encontrado en los datos: ${country}`);
            return;
        }

        const countryData = data[country];
        const chartData = {};

        for (let i = 0; i < countryData.meses.length; i++) {
            const month = months[countryData.meses[i] - 1];
            chartData[month] = countryData.totales[i];
        }

        const ctx = document.getElementById('predictionsChart').getContext('2d');

        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(chartData),
                datasets: [{
                    label: `Ventas Mensuales en ${country}`,
                    data: Object.values(chartData),
                    backgroundColor: 'rgba(0, 123, 255, 0.5)', // Color de las barras
                    borderColor: 'rgba(0, 123, 255, 1)', // Borde de las barras
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Ventas (en unidades o valores monetarios)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Meses'
                        }
                    }
                }
            }
        });

        // Actualizar el texto descriptivo
        const descriptionBox = document.getElementById('chartDescription');
        descriptionBox.querySelector('p').textContent = descriptions[country] || 'Descripción no disponible para este país.';
    }

    async function loadInitialChart() {
        const data = await loadData('../../Data/sales_by_country.json');
        if (data) {
            generateChart(data, 'Australia');
        }
    }

    async function setupCountryButtons(data) {
        const countrySelect = document.getElementById('countrySelect');

        countrySelect.addEventListener('change', (event) => {
            const selectedCountry = event.target.value;
            generateChart(data, selectedCountry);
        });
    }

    async function init() {
        const data = await loadData('../../Data/sales_by_country.json');
        if (data) {
            await loadInitialChart();
            setupCountryButtons(data);
        }
    }

    init();
})();
