"""Cut/fill volume computation between a surface (DSM) and a base (DTM)."""
from __future__ import annotations

import numpy as np


def cut_fill(
    surface: np.ndarray,
    base: np.ndarray,
    cell_size: float = 1.0,
    method: str = "grid",
) -> dict:
    """Compute cut, fill, and net volumes between two aligned elevation grids.

    surface/base are 2D arrays of the same shape. `cell_size` is the ground
    sampling distance in metres; cell area = cell_size**2.
    """
    surface = np.asarray(surface, dtype=float)
    base = np.asarray(base, dtype=float)
    if surface.shape != base.shape:
        raise ValueError("Surface and base grids must have the same shape.")

    diff = surface - base  # +ve = material above base (fill), -ve = cut
    cell_area = cell_size**2

    fill = float(np.clip(diff, 0, None).sum() * cell_area)
    cut = float(-np.clip(diff, None, 0).sum() * cell_area)

    return {
        "method": method,
        "cut_volume_m3": round(cut, 2),
        "fill_volume_m3": round(fill, 2),
        "net_volume_m3": round(fill - cut, 2),
        "cell_size_m": cell_size,
        # Per-cell difference for the cut/fill color ramp on the client.
        "difference": diff.tolist(),
    }
