import os
import datetime
import pickle
import numpy as np
import tensorflow as tf
import ast
import json

from flask_cors import CORS
from flask import Flask, request, jsonify  # type: ignore
from PIL import Image
from tensorflow.keras.models import load_model, Sequential  # type: ignore
from keras.layers import Dense, Conv2D, Flatten # type: ignore

# Inicializar Flask y cargar modelo
app = Flask(__name__)
CORS(app, origins=["http://localhost:4200"])  # Habilita CORS para todas las rutas

def load_model_and_preprocessing():
    """
    Carga el modelo entrenado y el archivo de procesamiento de imágenes.
    """
    try:
        # Cargar el modelo completo (arquitectura + pesos)
        trained_model = load_model('models/model_complete.h5')  # Asegúrate de tener el modelo guardado correctamente
    except Exception as e:
        raise RuntimeError(f"Error al cargar el modelo: {e}") from e

    try:
        # Cargar el objeto de procesamiento de imágenes
        with open('models/mlb_model.pkl', 'rb') as f:
            image_processing_obj = pickle.load(f)
    except Exception as e:
        raise RuntimeError(f"Error al cargar el archivo .pickle: {e}") from e
    
    return trained_model, image_processing_obj

def preprocess_image(image):
    """
    Preprocesa la imagen redimensionándola y normalizándola.
    """
    try:
        image = image.convert('RGB')  # Asegurar formato RGB
        image = image.resize((128, 128))  # Redimensionar a 224x224 para MobileNetV2
        image_array = np.array(image) / 255.0  # Normalizar la imagen
        image_array = np.expand_dims(image_array, axis=0)  # Añadir dimensión para el batch
        return image_array
    except Exception as e:
        raise ValueError(f"Error al preprocesar la imagen: {e}") from e

def decode_predictions(predictions, labels_map):
    """
    Decodifica las predicciones para obtener las etiquetas más probables.
    """
    try:
        # Cambiamos para obtener las top-N etiquetas si es necesario
        num_top_labels = 5  # Cuántas etiquetas mostrar (ajusta según lo necesites)
        top_labels_idx = np.argsort(predictions[0])[::-1][:num_top_labels]  # Obtiene los índices de las N etiquetas más altas
        labels = [labels_map[idx] for idx in top_labels_idx]  # Convertir a nombres de las etiquetas
        return labels
    except Exception as e:
        raise ValueError(f"Error al decodificar las predicciones: {e}") from e

def fix_history_json():
    """
    Corrige el archivo history.json si contiene objetos mal formateados.
    """
    try:
        with open('history.json', 'r', encoding='utf-8') as f:
            content = f.read().strip()
        
        # Reemplazar comillas simples por dobles y convertir a lista de objetos
        entries = [ast.literal_eval(entry) for entry in content.splitlines()]
        
        # Guardar como JSON válido
        with open('history.json', 'w', encoding='utf-8') as f:
            json.dump(entries, f, ensure_ascii=False, indent=4)
        print("Archivo corregido exitosamente.")
    except Exception as e:
        print(f"Error al corregir el archivo JSON: {e}")

fix_history_json()

def save_image_to_history(image_file, labels):
    """
    Guarda la imagen procesada y los resultados en el historial.
    """
    try:
        timestamp = datetime.datetime.now().isoformat()
        image_path = os.path.join('static/images', f'{timestamp}.png')
        os.makedirs(os.path.dirname(image_path), exist_ok=True)
        
        # Abrir y guardar correctamente como PNG
        image = Image.open(image_file)
        image.convert('RGB').save(image_path, format='PNG')
        
        # Guardar el historial
        history_entry = {
            'image_path': image_path,
            'labels': labels,
            'timestamp': timestamp
        }
        with open('history.json', 'a', encoding='utf-8') as f:
            f.write(json.dumps(history_entry) + '\n')
    except Exception as e:
        raise IOError(f"Error al guardar la imagen o el historial: {e}") from e

try:
    model, labels_map = load_model_and_preprocessing()  # labels_map debería ser un diccionario
except RuntimeError as e:
    print(e)
    exit(1)

@app.route('/process_image', methods=['POST'])
def process_image():
    if 'image' not in request.files:
        return jsonify({"error": "No se encontró un archivo de imagen"}), 400

    image_file = request.files['image']
    
    # Generar timestamp antes de usarlo
    timestamp = datetime.datetime.now().strftime('%Y-%m-%dT%H-%M-%S-%f')  # Formato de timestamp
    image_path = os.path.join('static/images', f'{timestamp}.png')  # Usamos el timestamp para el nombre de la imagen

    try:
        image = Image.open(image_file)
        image.save(image_path)  # Guardar la imagen con el timestamp como nombre
        image_array = preprocess_image(image)
        predictions = model.predict(image_array)
        labels = decode_predictions(predictions, labels_map)  # Pasa labels_map aquí
        image_url = f'http://127.0.0.1:5000/static/images/{timestamp}.png'
        save_image_to_history(image_file, labels)
        return jsonify({
            'imageUrl': image_url,  # Incluir la URL en la respuesta
            'labels': labels,
            'message': 'Imagen procesada con éxito',
            'timestamp': datetime.datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({"error": f"Error al procesar la imagen: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
