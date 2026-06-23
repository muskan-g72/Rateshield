from fastapi import FastAPI

app = FastAPI()

@app.get("/weather")
def weather():
    return {
        "city": "Delhi",
        "temperature": "30°C",
        "condition": "Sunny"
    }