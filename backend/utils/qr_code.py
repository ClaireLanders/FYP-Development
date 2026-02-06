# this file contains QR code generation utilities so the pickup can be verified
# this code is adapted from a Youtube tutorial (ProgrammingKnowledge, 2025)

import qrcode
import io
import base64
import secrets

def generate_qr_code(data:str) -> str:
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)

    img=qr.make_image(fill_color="black", back_color="white")

    # Converting to base 64
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    buffer.seek(0)
    img_base64 = base64.b64encode(buffer.getvalue()).decode()

    return f"data:image/png;base64,{img_base64}"

# (Python, 2026)
def generate_secure_token(prefix: str = "WN", length: int=16) -> str:
    random_part = secrets.token_urlsafe(length)
    return f"{prefix}{random_part}"




