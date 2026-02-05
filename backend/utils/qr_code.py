# TODO: Reference and Description
# this file contains QR code generation utilities so the pickup can be verified
# this code is adapted from a Youtube tutorial (ProgrammingKnowledge, 2025)

import qrcode
import io # TODO: WHY
import base64 # TODO: WHY
import secrets # TODO: WHY

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
    # TODO: add source !
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    buffer.seek(0)
    img_base64 = base64.b64encode(buffer.getvalue()).decode()

    return f"data:image/png;base64,{img_base64}"

# TODO:  SOURCE !!!
def generate_secure_token(prefix: str = "WN", length: int=16) -> str:
    random_part = secrets.token_urlsafe(length)
    return f"{prefix}{random_part}"




# REFERENCES
# ProgrammingKnowledge. (2025, February 8). How to Create QR Codes with Python | Generate QR Codes Easily. Retrieved from youtube.com: https://www.youtube.com/watch?v=2yTlvPSIePs