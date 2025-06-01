from flask import Blueprint, request, jsonify
import os
from dotenv import load_dotenv
from chatbot.bot import RAGQuerySystem
load_dotenv()

API_KEY = os.getenv('HF_API_KEY')
VECTORDB_PATH = os.getenv('VECTORDB_PATH')
chatbot = Blueprint('chatbot', __name__)
rag_system = RAGQuerySystem(
            api_key=API_KEY,
            vectordb_path=VECTORDB_PATH
)
@chatbot.route("", methods=['POST'])
def getAnswer():
    data = request.json
    question = data.get("question")

    answer = rag_system.ask(question)['answer']
    return jsonify(answer)
