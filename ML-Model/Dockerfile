FROM python:3.9-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy model files and script
COPY . .

# Hugging Face Spaces specifically looks for port 7860
EXPOSE 7860

CMD ["uvicorn", "model:app", "--host", "0.0.0.0", "--port", "7860"]