import os
import joblib
import numpy as np
import tensorflow as tf
from dotenv import load_dotenv
from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer

load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

embedder_path = os.path.join(BASE_DIR, "embedder")
classifier_path = os.path.join(BASE_DIR, "resume_classifier.keras")
encoder_path = os.path.join(BASE_DIR, "label_encoder.joblib")

print("Loading ML models into memory...")
embedder = SentenceTransformer(embedder_path)
ml_model = tf.keras.models.load_model(classifier_path)
label_encoder = joblib.load(encoder_path)
print("All models loaded successfully!")

app = FastAPI(title="Resume job prediction API")

class ResumeRequest(BaseModel):
    resume: str
    top_k: int = 5

API_KEY = os.getenv('ML_API_KEY')

#@app.get("/health")
#def health():
#    return {"status": "running"}


@app.post("/predict")
def predict_jobs(data: ResumeRequest, x_api_key: str = Header(...)):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")

    if not data.resume.strip():
        raise HTTPException(status_code=400, detail="Resume text cannot be empty.")
    
    resume_text = [data.resume]
    embedding = embedder.encode([resume_text])

    probs = ml_model.predict(embedding, verbose=0)[0]

    top_indices = np.argsort(probs)[::-1][:data.top_k]

    results = [
        {
            "job": label_encoder.inverse_transform([idx])[0],
            "confidence": f"{round(float(probs[idx])*100, 2)}%"
        }
        for idx in top_indices
    ]
    return {
        "success": True,
        "predictions": results
    }
