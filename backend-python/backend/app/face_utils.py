import numpy as np
import cv2
import insightface
from insightface.app import FaceAnalysis
from datetime import datetime

# Initialize face detection model
model = FaceAnalysis(name="buffalo_l")
model.prepare(ctx_id=0, det_size=(640, 640))  # Use ctx_id=-1 for CPU

# Store each user's registered face embedding
registered_faces = {}

def preprocess_image(image_bytes):
    """Convert uploaded file to image array"""
    try:
        np_arr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        if img is None:
            print("❌ cv2.imdecode returned None")
            return None
            
        # Convert BGR to RGB
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        return img_rgb
    except Exception as e:
        print(f"❌ Error decoding image: {e}")
        return None

def get_face_embedding(img):
    """Get a single face embedding"""
    if img is None:
        return None, "invalid_image"
    
    try:
        print("📷 Image shape:", img.shape)
        
        # Save input image for debugging
        debug_img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
        cv2.imwrite("debug_input.jpg", debug_img)
        
        faces = model.get(img)
        print(f"🧠 Faces detected: {len(faces)}")

        if len(faces) == 0:
            cv2.imwrite("no_face_detected.jpg", debug_img)
            return None, "face_not_detected"
        if len(faces) > 1:
            cv2.imwrite("multiple_faces.jpg", debug_img)
            return None, "multiple_faces"

        return faces[0].embedding, None
    except Exception as e:
        print(f"❌ Error in get_face_embedding: {e}")
        return None, "detection_error"

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def verify_face(image_bytes, applicant_id):
    """
    Register face on first attempt or verify face match
    """
    img = preprocess_image(image_bytes)
    if img is None:
        return {"status": "invalid_image"}

    embedding, error = get_face_embedding(img)
    if error:
        return {"status": error}

    if applicant_id not in registered_faces:
        registered_faces[applicant_id] = {
            "embedding": embedding,
            "registered_at": datetime.now().isoformat()
        }
        print(f"✅ Registered face for applicant: {applicant_id}")
        return {"status": "identity_registered"}

    stored_embedding = registered_faces[applicant_id]["embedding"]
    similarity = cosine_similarity(stored_embedding, embedding)
    print(f"🔁 Similarity with registered face for {applicant_id}: {similarity}")

    return {
        "status": "verified" if similarity >= 0.7 else "mismatch",
        "similarity": round(float(similarity), 4)
    }

def verify_live_face(image_bytes, applicant_id):
    """
    Perform live proctoring face verification
    """
    if applicant_id not in registered_faces:
        print(f"⚠️ No registered embedding found for {applicant_id}")
        return {"status": "no_reference_face"}

    img = preprocess_image(image_bytes)
    if img is None:
        return {"status": "invalid_image"}

    embedding, error = get_face_embedding(img)
    if error:
        return {"status": error}

    stored_embedding = registered_faces[applicant_id]["embedding"]
    similarity = cosine_similarity(stored_embedding, embedding)
    print(f"🔁 Live similarity for {applicant_id}: {similarity}")

    return {
        "status": "verified" if similarity >= 0.7 else "mismatch",
        "similarity": round(float(similarity), 4)
    }