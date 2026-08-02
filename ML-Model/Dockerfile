# Upgrade base image to Python 3.11 for keras 3.14.0 compatibility
FROM python:3.11-slim

# Set environment variables to prevent Python from writing pyc files and buffer output
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# ─── Critical: these must be set BEFORE Python starts ───
# Prevents TensorFlow + PyTorch native library segfault (exit code 139)
ENV TF_CPP_MIN_LOG_LEVEL=3
ENV TF_ENABLE_ONEDNN_OPTS=0
ENV OMP_NUM_THREADS=1
ENV MKL_NUM_THREADS=1
ENV TOKENIZERS_PARALLELISM=false
ENV CUDA_VISIBLE_DEVICES=-1

WORKDIR /app

# Install system packages needed for torch/tf native libs
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install python dependencies
COPY requirements.txt .

# ─── Single consolidated install step ───
# --extra-index-url lets pip find torch==2.6.0+cpu (CPU-only, no CUDA deps)
# on the PyTorch index. This prevents sentence-transformers' torch>=1.11.0
# dependency from pulling the 10GB+ CUDA-enabled torch from PyPI.
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir \
        --extra-index-url https://download.pytorch.org/whl/cpu \
        -r requirements.txt

# Copy all model weights and application code
COPY . .

# Hugging Face Spaces exposes port 7860
EXPOSE 7860

# Run Uvicorn server on port 7860
CMD ["uvicorn", "model:app", "--host", "0.0.0.0", "--port", "7860"]
