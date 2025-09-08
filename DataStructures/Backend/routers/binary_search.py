from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional 
import random

router = APIRouter()

class BinarySearchRequest(BaseModel):
    array: Optional[List[int]] = None
    size: Optional[int] = 10
    digits: Optional[int] = 2  # nuevo campo
    target: int

@router.post("/binary_search")
def binary_search(req: BinarySearchRequest):
    # Determinar rango en función de los dígitos
    min_val = 10 ** (req.digits - 1)
    max_val = (10 ** req.digits) - 1

    if req.array:
        arr = sorted(req.array)
    else:
        size = req.size if req.size else 10
        arr = sorted(random.sample(range(min_val, max_val + 1), size))

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
        "steps": steps,
        "found": found_index != -1,
        "position": found_index + 1 if found_index != -1 else None
    }
