from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

model = joblib.load("resume_model_v1.pkl")
label_encoder = joblib.load("label_encoder_v1.pkl")

app = FastAPI(title="Resume job prediction API")

class ResumeRequest(BaseModel):
    resume: str
    top_k: int = 5



@app.post("/predict")
def predict_jobs(data: ResumeRequest):
    resume_text = [data.resume]
    probs = model.predict_proba(resume_text)[0]

    top_indices = np.argsort(probs)[::-1][:data.top_k]

    results = [
        {
            "job": label_encoder.inverse_transform([idx])[0],
            "confidence": float(probs[idx])
        }
        for idx in top_indices
    ]
    return {
        "success": True,
        "predictions": results
    }
