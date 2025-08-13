from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from app.face_utils import verify_face, verify_live_face

app = FastAPI()

# Configure CORS properly
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/verify")
async def register_or_verify(
    file: UploadFile = File(...),
    applicant_id: str = Form(...)
):
    image_bytes = await file.read()
    result = verify_face(image_bytes, applicant_id)
    return result

@app.post("/verify/embedding")
async def live_verify(
    file: UploadFile = File(...),
    applicant_id: str = Form(...)
):
    image_bytes = await file.read()
    result = verify_live_face(image_bytes, applicant_id)
    return result

@app.post("/detect/screens")
async def detect_screens(
    file: UploadFile = File(...),
    applicant_id: str = Form(...)
):
    image_bytes = await file.read()
    # Add your screen analysis logic here
    return {"status": "analyzed", "screens_detected": 1}  # Example response