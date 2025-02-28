import os
import pandas as pd
import numpy as np
import json
import matplotlib.pyplot as plt
from xgboost import XGBRegressor
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import MinMaxScaler
import calendar

# Obtener la ruta del directorio actual
current_dir = os.path.dirname(__file__)  # Esto te dará la ruta de la carpeta donde está el script

# Crear la ruta relativa al archivo
file_path = os.path.join(current_dir, 'FA_CAFAC_cod_pais_modificado.xlsx')

# Cargar los datos
store_sales = pd.read_excel(file_path, engine='openpyxl')

# Verifica la carga de los datos
print(store_sales.head())

# Seleccionar y renombrar columnas
columnas_a_mantener = ['FEC_TRAN', 'VAL_TOTA', 'COD_PAIS']
store_sales = store_sales[columnas_a_mantener]
store_sales.rename(columns={'FEC_TRAN': 'date', 'VAL_TOTA': 'sales', 'COD_PAIS': 'country_code'}, inplace=True)

# Eliminar filas con valores nulos
store_sales = store_sales.dropna(subset=['sales'])

# Convertir las columnas
store_sales['sales'] = store_sales['sales'].astype('int64')
store_sales['date'] = pd.to_datetime(store_sales['date'])

# Extraer el mes
store_sales['month'] = store_sales['date'].dt.month

# Agrupar por mes y sumar las ventas
monthly_sales_grouped = store_sales.groupby(['month'])['sales'].sum().reset_index()

# Crear un diccionario para almacenar los datos de ventas totales
ventas_totales_dict = {
    "meses": [],
    "totales": []
}

# Rellenar el diccionario con los datos agrupados, convirtiendo el número de mes en nombre
for _, row in monthly_sales_grouped.iterrows():
    month_name = calendar.month_name[int(row['month'])]  # Convertir el número de mes en nombre del mes
    ventas_totales_dict["meses"].append(month_name)  # Agregar el nombre del mes
    ventas_totales_dict["totales"].append(int(row['sales']))  # Asegurarse de que sea un int de Python

# Crear directorios si no existen
output_dir = os.path.join(current_dir, '../Front-end/public/Data')  # Ruta relativa para la salida
os.makedirs(output_dir, exist_ok=True)

# Guardar datos de ventas totales en un archivo JSON
with open(os.path.join(output_dir, 'data_2023.json'), 'w') as json_file:
    json.dump(ventas_totales_dict, json_file, ensure_ascii=False)  # Usar ensure_ascii=False para permitir caracteres especiales

# Visualizar los resultados
plt.figure(figsize=(15, 5))
plt.bar(ventas_totales_dict["meses"], ventas_totales_dict["totales"], color='red', label='Ventas Totales')
plt.xticks(rotation=45)  # Rotar las etiquetas de los meses
plt.xlabel('Mes')
plt.ylabel('Ventas Totales')
plt.title('Ventas Totales por Mes en 2023')
plt.legend()
plt.show()

# Preparar los datos para el modelo
store_sales['date'] = store_sales['date'].dt.to_period('M')  # Agrupamos por mes
monthly_sales = store_sales.groupby(['date', 'country_code']).sum().reset_index()
monthly_sales['date'] = monthly_sales['date'].dt.to_timestamp()

# Crear un diccionario para almacenar los datos por país y mes
sales_by_country = {}

for _, row in monthly_sales.iterrows():
    month = row['date'].month
    country_code = row['country_code']
    sales = int(row['sales'])

    if country_code not in sales_by_country:
        sales_by_country[country_code] = {"meses": [], "totales": []}

    sales_by_country[country_code]["meses"].append(month)
    sales_by_country[country_code]["totales"].append(sales)

# Guardar los datos de ventas por país en un archivo JSON
with open(os.path.join(output_dir, 'sales_by_country.json'), 'w') as json_file:
    json.dump(sales_by_country, json_file)

# Preparar los datos para el modelo
X = monthly_sales['date'].dt.month.values.reshape(-1, 1)  # Meses como características
y = monthly_sales['sales'].values  # Ventas como objetivo

scaler = MinMaxScaler()
X_scaled = scaler.fit_transform(X)

split = int(0.8 * len(X))
X_train, X_test = X_scaled[:split], X_scaled[split:]
y_train, y_test = y[:split], y[split:]

# Entrenar los modelos
models = {
    'Linear Regression': LinearRegression(),
    'XGBoost': XGBRegressor()
}

for name, model in models.items():
    model.fit(X_train, y_train)

# Extender el rango de fechas hasta el año siguiente
last_date = monthly_sales['date'].max()
next_year_dates = pd.date_range(start=last_date + pd.DateOffset(months=1), periods=12, freq='M')

# Generar características para el año siguiente
X_next_year = pd.DataFrame({'date': next_year_dates})
X_next_year['month'] = X_next_year['date'].dt.month
X_next_year_scaled = scaler.transform(X_next_year[['month']])

# Realizar predicciones para el año siguiente usando ambos modelos
predictions_next_year = {}
for name, model in models.items():
    y_pred_next_year = model.predict(X_next_year_scaled)
    predictions_next_year[name] = y_pred_next_year

# Usar los nombres de los meses para el JSON
predictions_2024 = {
    calendar.month_name[month]: int(predictions_next_year['XGBoost'][i])  # Usar el nombre del mes
    for i, month in enumerate(X_next_year['month'])
}

# Guardar las predicciones en un archivo JSON
with open(os.path.join(output_dir, 'predictions_2024.json'), 'w') as json_file:
    json.dump(predictions_2024, json_file, ensure_ascii=False)

# Calcular las predicciones ajustadas
total_2023 = sum(ventas_totales_dict["totales"])  # Total de 2023
crecimiento_porcentaje = 0.10  # 10% de crecimiento
total_2024_proyectado = total_2023 * (1 + crecimiento_porcentaje)

# Crear un nuevo diccionario para las predicciones ajustadas
predicciones_2024_ajustadas = {}

# Distribuir el total proyectado por mes
for mes, total_mes in zip(ventas_totales_dict["meses"], ventas_totales_dict["totales"]):
    # Calcular el porcentaje de ventas de ese mes en 2023
    porcentaje_mes = total_mes / total_2023
    # Asignar el valor proyectado para 2024 basado en ese porcentaje
    predicciones_2024_ajustadas[mes] = int(total_2024_proyectado * porcentaje_mes)

# Guardar las predicciones ajustadas en un nuevo archivo JSON
with open(os.path.join(output_dir, 'predictions_2024_ajustadas.json'), 'w') as json_file:
    json.dump(predicciones_2024_ajustadas, json_file)

# Visualizar los resultados
plt.figure(figsize=(15, 5))

# Gráfico de predicciones de ambos modelos para el año siguiente
plt.plot(monthly_sales['date'], monthly_sales['sales'], color='blue', label='Datos reales', marker='o')
plt.plot(X_next_year['date'], predictions_next_year['Linear Regression'], label='Predicciones Regresión Lineal', color='green', linestyle='--')
plt.plot(X_next_year['date'], predictions_next_year['XGBoost'], label='Predicciones XGBoost', color='orange', linestyle='--')
plt.xlabel('Fecha')
plt.ylabel('Ventas')
plt.title('Predicciones para el Año Siguiente')
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.show()
