# Upgrade base image to Python 3.10 for better PyTorch/TensorFlow wheel support
FROM python:3.10-slim

# Set environment variables to prevent Python from writing pyc files and buffer output
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system packages needed for torch/tf builds if required
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy all model weights and application code
COPY . .

# Hugging Face Spaces exposes port 7860
EXPOSE 7860

# Run Uvicorn server on port 7860
CMD ["uvicorn", "model:app", "--host", "0.0.0.0", "--port", "7860"]