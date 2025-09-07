from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BinarySearchRequest(BaseModel):
    array: list[int] | None = None
    size: int | None = None
    target: int

@app.post("/binary_search")
def binary_search(req: BinarySearchRequest):
    # Si no se manda un array, generamos uno ordenado con el tamaño indicado
    if req.array:
        arr = sorted(req.array)
    else:
        size = req.size if req.size else 10  # default tamaño = 10
        arr = sorted(random.sample(range(1, 100), size))

    target = req.target
    steps = []
    left, right = 0, len(arr) - 1
    found_index = -1

    while left <= right:
        mid = (left + right) // 2
        steps.append({
            "left": left,
            "right": right,
            "mid": mid,
            "mid_value": arr[mid]
        })
        if arr[mid] == target:
            found_index = mid
            break
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return {
        "array": arr,
        "target": target,
        "steps": steps,
        "found_index": found_index
    }
