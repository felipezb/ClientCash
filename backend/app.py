from flask import Flask, request, jsonify, render_template
from pymongo import MongoClient
import os

app = Flask(__name__, static_folder="../frontend", template_folder="../frontend/paginas")

client = MongoClient("mongodb://localhost:27017/")
db = client["banco"]
clientes = db["clientes"]

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/cadastrar_cliente', methods=['POST'])
def cadastrar_cliente():
    data = request.get_json()
    cliente = {
        "nome": data["nome"],
        "saldo": float(data["saldo"]),
        "cpf": data["cpf"]
    }
    clientes.insert_one(cliente)
    return jsonify({"message": f"Cliente {data['nome']} cadastrado com sucesso!"})

@app.route('/fazer_transferencia', methods=['POST'])
def fazer_transferencia():
    data = request.get_json()
    cliente_origem = clientes.find_one({"nome": data["origemNome"], "cpf": data["origemCpf"]})
    cliente_destino = clientes.find_one({"nome": data["destinoNome"], "cpf": data["destinoCpf"]})

    if cliente_origem and cliente_destino and float(cliente_origem["saldo"]) >= float(data["valor"]):
        clientes.update_one({"nome": data["origemNome"], "cpf": data["origemCpf"]}, {"$inc": {"saldo": -float(data["valor"])}})
        clientes.update_one({"nome": data["destinoNome"], "cpf": data["destinoCpf"]}, {"$inc": {"saldo": float(data["valor"])}})
        return jsonify({"message": f"Transferência de {data['valor']} de {data['origemNome']} para {data['destinoNome']} realizada com sucesso!"})
    else:
        return jsonify({"message": "Transferência não realizada. Verifique os saldos e os nomes/cpfs dos clientes."})
    
@app.route('/exibir_clientes', methods=['GET'])
def exibir_clientes():
    todos_clientes = list(clientes.find({}, {"_id": 0, "nome": 1, "cpf": 1, "saldo": 1}))
    return jsonify(todos_clientes)

@app.route('/limpar_clientes', methods=['DELETE'])
def limpar_clientes():
    clientes.delete_many({})
    return jsonify({'message': 'Todos os clientes foram removidos.'})

if __name__ == '__main__':
    app.run(debug=True)