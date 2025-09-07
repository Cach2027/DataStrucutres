from fastapi import APIRouter
from typing import List

router = APIRouter(prefix="/binary-search", tags=["Binary Search"])

@router.post("/")
def binary_search(data: List[int], target: int):
    low, high = 0, len(data) - 1
    steps = []
    while low <= high:
        mid = (low + high) // 2
        steps.append(mid)
        if data[mid] == target:
            return {"found": True, "position": mid, "steps": steps}
        elif data[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return {"found": False, "steps": steps}
