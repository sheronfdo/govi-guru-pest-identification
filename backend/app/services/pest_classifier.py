from __future__ import annotations

from dataclasses import dataclass
from functools import lru_cache
import io
import json
from pathlib import Path
from typing import Tuple

import numpy as np
from PIL import Image
import tensorflow as tf


@dataclass(frozen=True)
class Prediction:
    class_name: str
    confidence: float


def _get_model_dir() -> Path:
    return Path(__file__).resolve().parents[1] / "ml_models"


def _load_class_names(model_dir: Path) -> list[str]:
    class_file = model_dir / "class_names.json"
    if not class_file.exists():
        raise FileNotFoundError(f"Missing class names file: {class_file}")
    with class_file.open("r", encoding="utf-8") as handle:
        data = json.load(handle)
    if not isinstance(data, list) or not all(isinstance(x, str) for x in data):
        raise ValueError("class_names.json must be a list of strings")
    return data


@lru_cache(maxsize=1)
def _load_model_and_classes() -> Tuple[tf.keras.Model, list[str]]:
    model_dir = _get_model_dir()
    model_path = model_dir / "best_model.keras"
    if not model_path.exists():
        raise FileNotFoundError(f"Missing model file: {model_path}")
    model = tf.keras.models.load_model(model_path)
    class_names = _load_class_names(model_dir)
    return model, class_names


def predict_image_bytes(image_bytes: bytes) -> Prediction:
    model, class_names = _load_model_and_classes()

    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((224, 224))
    array = np.asarray(image, dtype=np.float32) / 255.0
    array = np.expand_dims(array, axis=0)

    preds = model.predict(array, verbose=0)[0]
    preds = tf.nn.softmax(preds).numpy()
    idx = int(np.argmax(preds))
    confidence = float(preds[idx])
    class_name = class_names[idx] if idx < len(class_names) else "Unknown"
    return Prediction(class_name=class_name, confidence=confidence)
