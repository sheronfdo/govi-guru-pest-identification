import json
from minio import Minio
from minio.error import S3Error
from uuid import uuid4
from pathlib import Path

from app.core.config import settings


def get_minio_client() -> Minio:
    return Minio(
        settings.minio_endpoint,
        access_key=settings.minio_access_key,
        secret_key=settings.minio_secret_key,
        secure=settings.minio_secure,
    )


def ensure_bucket() -> None:
    client = get_minio_client()
    if not client.bucket_exists(settings.minio_bucket):
        client.make_bucket(settings.minio_bucket)
    # Ensure public read access for objects in this bucket
    policy = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {"AWS": ["*"]},
                "Action": ["s3:GetObject"],
                "Resource": [f"arn:aws:s3:::{settings.minio_bucket}/*"],
            }
        ],
    }
    client.set_bucket_policy(settings.minio_bucket, json.dumps(policy))


def upload_image(file_name: str, content: bytes, content_type: str | None) -> str:
    ensure_bucket()
    ext = Path(file_name).suffix
    object_name = f"pests/{uuid4().hex}{ext}"
    client = get_minio_client()
    client.put_object(
        settings.minio_bucket,
        object_name,
        data=bytes_to_stream(content),
        length=len(content),
        content_type=content_type or "application/octet-stream",
    )
    return object_name


def bytes_to_stream(data: bytes):
    from io import BytesIO
    return BytesIO(data)


def get_object_url(object_name: str) -> str:
    scheme = "https" if settings.minio_secure else "http"
    return f"{scheme}://{settings.get_minio_external_endpoint}/{settings.minio_bucket}/{object_name}"
