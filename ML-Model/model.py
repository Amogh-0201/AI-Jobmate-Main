import os
# ─── Must be set BEFORE importing tensorflow or torch ───
# Prevents TensorFlow + PyTorch native library segfault (exit code 139)
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["TOKENIZERS_PARALLELISM"] = "false"
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"

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


# ─── Compatibility shim for model deserialization ───
# The model was saved with Keras 3.14.0 which includes 'quantization_config'
# in Dense layer configs. If a different Keras version is installed (e.g. via
# tensorflow-cpu in Docker), Dense.__init__ may reject this kwarg and crash
# with: "Unrecognized keyword arguments passed to Dense: {'quantization_config': None}"
class _CompatDense(tf.keras.layers.Dense):
    def __init__(self, *args, **kwargs):
        kwargs.pop("quantization_config", None)
        super().__init__(*args, **kwargs)


print("Loading ML models into memory...")
embedder = SentenceTransformer(embedder_path)
ml_model = tf.keras.models.load_model(
    classifier_path,
    custom_objects={"Dense": _CompatDense},
)
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
    embedding = embedder.encode(resume_text)

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
