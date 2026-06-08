from fastapi import FastAPI

app = FastAPI()

@app.get("/weather")
def get_weather():

    return {
        "city": "Delhi",
        "temperature": "34°C",
        "condition": "Sunny"
    }