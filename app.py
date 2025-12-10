#======================================================================|
from flask import Flask, redirect, request, render_template, session, url_for
from flask_socketio import SocketIO, emit, rooms
import secrets

#============================*****=====================================|
app = Flask(__name__)
app.config['SECRET_KEY'] = 'clave provicional'
socketio = SocketIO(app, cors_allowed_origins='*')
#============================*****=====================================|
"""                  VARIABLES Y DICCIONARIOS                       """
usuarios = {}

mensajes = []

#=========================|||||||RUTAS||||||===========================|

#Ruta del index
@app.route('/')
def index():
    if not 'user_id' in session:
        session['user_id'] = secrets.token_urlsafe(16)
    return render_template('loggin.html')

#                                -----

#Ruta de Loggin
@app.route('/loggin', methods=['POST'])
def loggin():
    usuarios[session.get('user_id')] = {"nombre": request.form['nombre']}
    return redirect('/chat')


@app.route('/chat')
def chat():
    return render_template('chat.html')

@app.route('/volver_inicio')
def volver_inicio():
    return redirect('/')
#=========================||||||||||||||||||===========================|

#==============================SOCKETS=================================|

@socketio.on('nuevo_mensaje')
def handle_nuevo_mensaje(data):
    mensajes.append({'remitente':data['nombre'], 'mensaje':data['mensaje']})
    emit('cargar_mensaje',{'remitente':data['nombre'], 'mensaje':data['mensaje']}, broadcast=True)


@socketio.on('connect')
def handle_connect():
    if session.get('user_id') in usuarios:
        print(usuarios)
        emit('mi_nombre',{'nombre': usuarios[session.get('user_id')]['nombre']})
    else:
        emit('redirect',{'url':'/'})

@socketio.on('recibir_mensajes')
def handle_recibir_mensajes(data):
    emit('cargar_historial',mensajes)
    
    

#======================================================================|
if __name__ == '__main__':
    socketio.run(app, debug=False ,host='0.0.0.0', port=5000)
#======================================================================|
