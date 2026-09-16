from fastapi import FastAPI

app = FastAPI(
    title="RTK CRM API",
    description="API для системы управления партнерствами вузов",
    version="1.0.0"
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Бэкенд успешно запущен!"}