from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
import os
from dotenv import load_dotenv

load_dotenv()

ml_model = joblib.load("../ML Model/resume_model_v1.pkl")
label_encoder = joblib.load("../ML Model/label_encoder_v1.pkl")

app = FastAPI(title="Resume job prediction API")

class ResumeRequest(BaseModel):
    resume: str
    top_k: int = 5

API_KEY = os.getenv('ML_API_KEY')


@app.post("/predict")
def predict_jobs(data: ResumeRequest, x_api_key: str = Header(...)):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    resume_text = [data.resume]
    probs = ml_model.predict_proba(resume_text)[0]

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
