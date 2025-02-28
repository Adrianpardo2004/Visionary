// Confirmación de que sales.js está cargado
console.log('sales.js cargado');

(function() {
    /**
     * An array containing the names of the months in Spanish.
     *
     * @type {string[]}
     */
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    let salesChart; // Variable para almacenar la instancia de la gráfica

    // Función para cargar datos desde el archivo JSON
    async function loadData() {
        try {
            const response = await fetch('../../Data/sales_by_country.json');
            if (!response.ok) {
                throw new Error('Error al cargar el archivo JSON: ' + response.statusText);
            }
            const data = await response.json();
            console.log('Datos de ventas:', data);
            return data;
        } catch (error) {
            console.error('Error al cargar los datos:', error);
        }
    }

    // Función para cargar datos del archivo JSON de predicciones
    async function loadPredictions() {
        try {
            const response = await fetch('../../Data/predictions_2024.json');
            if (!response.ok) {
                throw new Error('No se pudo cargar predictions_2024.json');
            }
            const data = await response.json();
            console.log('Predicciones de ventas:', data);
            return Object.values(data); // Devuelve los valores del JSON en un array
        } catch (error) {
            console.error('Error al cargar los datos:', error);
        }
    }

    // Función para cargar datos del archivo JSON de sumas totales
    async function loadTotalSales() {
        try {
            const response = await fetch('../../Data/predictions_2024_ajustadas.json');
            if (!response.ok) {
                throw new Error('No se pudo cargar predictions_2024_ajustadas.json: ' + response.statusText);
            }
            const data = await response.json();
            console.log('Suma total de ventas:', data);
            return data;
        } catch (error) {
            console.error('Error al cargar los datos:', error);
            alert('Hubo un problema al cargar los datos. Revisa la consola para más detalles.');
        }
    }

    // Función para calcular la regresión lineal (y = mx + b)
    function calculateRegression(x, y) {
        const n = x.length;
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
        const sumX2 = x.reduce((a, b) => a + b * b, 0);

        const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const b = (sumY - m * sumX) / n;

        return { m, b };
    }

    // Función para generar la gráfica de regresión lineal entre las ventas de 2023 y las predicciones de 2024
    async function showRegressionChart() {
        const data2023 = await loadData();
        const predictions2024 = await loadPredictions();

        if (!data2023 || !predictions2024) return;

        // Preparar los datos de 2023 y las predicciones de 2024 para la regresión lineal
        const salesData2023 = [];
        const monthsIndex = [];

        // Extraer las ventas de 2023 (totales de ventas)
        for (const info of Object.values(data2023)) {
            for (let i = 0; i < info.meses.length; i++) {
                const monthIndex = info.meses[i] - 1; // Índice del mes
                const total = info.totales[i];
                salesData2023.push(total); // Ventas de 2023
                monthsIndex.push(monthIndex); // Índice del mes
            }
        }

        // Las predicciones de 2024 son solo los valores que recibimos, por lo que se deben emparejar con los meses
        const predictionsData2024 = predictions2024;

        // Calcular la regresión lineal entre las ventas de 2023 y las predicciones de 2024
        const regression = calculateRegression(salesData2023, predictionsData2024);
        const regressionData = monthsIndex.map(month => regression.m * salesData2023[month] + regression.b);

        // Crear la gráfica de regresión lineal
        const ctx = document.getElementById('salesChart').getContext('2d');
        if (salesChart) {
            salesChart.destroy(); // Destruir cualquier gráfica previa
        }

        salesChart = new Chart(ctx, {
            type: 'line',  // Gráfico de líneas para la regresión
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'Ventas 2023',
                        data: salesData2023,
                        backgroundColor: 'rgba(0, 123, 255, 0.5)',
                        borderColor: 'rgba(0, 123, 255, 1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.1
                    },
                    {
                        label: 'Predicciones 2024',
                        data: predictionsData2024,
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.1
                    },
                    {
                        label: 'Regresión Lineal',
                        data: regressionData,
                        backgroundColor: 'rgba(0, 255, 0, 0.5)',
                        borderColor: 'rgba(0, 255, 0, 1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.1
                    }
                ]
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
    }

    // Función para actualizar la gráfica y la tabla
    async function updateTableAndChart(data, chartData, chartTitle) {
        const salesTableBody = document.getElementById('salesTable').getElementsByTagName('tbody')[0];
        salesTableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

        for (const [month, total] of Object.entries(chartData)) {
            const row = salesTableBody.insertRow();
            row.insertCell(0).textContent = month;
            row.insertCell(1).textContent = total.toLocaleString(); // Formatear el total
        }

        if (salesChart) {
            salesChart.destroy();
        }

        const ctx = document.getElementById('salesChart').getContext('2d');
        salesChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(chartData),
                datasets: [{
                    label: chartTitle,
                    data: Object.values(chartData),
                    backgroundColor: 'rgba(0, 123, 255, 0.5)',
                    borderColor: 'rgba(0, 123, 255, 1)',
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
    }

    async function generateTableAndChart(data) {
        const chartData = {};
        for (const info of Object.values(data)) {
            for (let i = 0; i < info.meses.length; i++) {
                const monthIndex = info.meses[i] - 1;
                const month = months[monthIndex];
                const total = info.totales[i];

                if (!chartData[month]) {
                    chartData[month] = 0;
                }
                chartData[month] += total;
            }
        }

        await updateTableAndChart(data, chartData, 'Ventas Totales 2023');
    }

    async function createPredictionsChart() {
        const data = await loadPredictions();
        if (!data) return;

        const chartData = {};
        data.forEach((value, index) => {
            chartData[months[index]] = value;
        });

        await updateTableAndChart(data, chartData, 'Predicciones de Ventas 2024');
    }

    async function createTotalSalesChart() {
        const data = await loadTotalSales();
        if (!data) return;

        const chartData = {};
        const monthsInOrder = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        monthsInOrder.forEach(month => {
            if (data[month]) {
                chartData[months[monthsInOrder.indexOf(month)]] = data[month];
            }
        });

        await updateTableAndChart(data, chartData, 'Suma Ventas 2023 y Predicción Ventas 2024');
    }

    async function loadInitialChart() {
        const data = await loadData();
        generateTableAndChart(data);
    }

    loadInitialChart();

    document.getElementById('btnAll').addEventListener('click', async () => {
        const data = await loadData();
        generateTableAndChart(data);
    });

    document.getElementById('btnPredictions').addEventListener('click', createPredictionsChart);
    document.getElementById('btnTotalSales').addEventListener('click', createTotalSalesChart);
    document.getElementById('btnRegression').addEventListener('click', showRegressionChart);

})();
