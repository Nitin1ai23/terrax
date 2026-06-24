"""Ordinary kriging engine.

A self-contained NumPy implementation so the platform produces real
interpolated surfaces without requiring PyKrige/GDAL to be installed. For
production scale, swap `ordinary_kriging` for PyKrige's C-accelerated solver.
"""
from __future__ import annotations

import numpy as np

VariogramModel = str


def _variogram(h: np.ndarray, model: VariogramModel, nugget: float, sill: float, rng: float) -> np.ndarray:
    """Return semivariance gamma(h) for the chosen theoretical model."""
    c = sill - nugget
    h = np.asarray(h, dtype=float)
    with np.errstate(divide="ignore", invalid="ignore"):
        if model == "spherical":
            g = np.where(
                h >= rng,
                sill,
                nugget + c * (1.5 * (h / rng) - 0.5 * (h / rng) ** 3),
            )
        elif model == "exponential":
            g = nugget + c * (1 - np.exp(-3 * h / rng))
        elif model == "gaussian":
            g = nugget + c * (1 - np.exp(-3 * (h / rng) ** 2))
        elif model == "matern":  # nu = 1.5 closed form
            sq = np.sqrt(3) * h / rng
            g = nugget + c * (1 - (1 + sq) * np.exp(-sq))
        else:
            raise ValueError(f"Unknown variogram model: {model}")
    g = np.where(h == 0, 0.0, g)
    return g


def ordinary_kriging(
    x: np.ndarray,
    y: np.ndarray,
    z: np.ndarray,
    *,
    model: VariogramModel = "spherical",
    nugget: float = 0.0,
    sill: float | None = None,
    rng: float | None = None,
    resolution: int = 50,
) -> dict:
    """Interpolate scattered (x, y, z) samples onto a regular grid.

    Returns the grid, predicted surface, kriging variance, and the variogram
    parameters actually used.
    """
    x, y, z = map(lambda a: np.asarray(a, dtype=float), (x, y, z))
    n = len(z)
    if n < 3:
        raise ValueError("Ordinary kriging needs at least 3 samples.")

    # Sensible auto-parameters when not supplied.
    if sill is None:
        sill = float(np.var(z)) or 1.0
    if rng is None:
        span = float(max(np.ptp(x), np.ptp(y))) or 1.0
        rng = span / 3.0

    # Pairwise sample distances and the kriging matrix with Lagrange row/col.
    dx = x[:, None] - x[None, :]
    dy = y[:, None] - y[None, :]
    dist = np.hypot(dx, dy)
    gamma = _variogram(dist, model, nugget, sill, rng)

    A = np.ones((n + 1, n + 1))
    A[:n, :n] = gamma
    A[n, n] = 0.0
    A_inv = np.linalg.pinv(A)

    # Prediction grid.
    gx = np.linspace(x.min(), x.max(), resolution)
    gy = np.linspace(y.min(), y.max(), resolution)
    GX, GY = np.meshgrid(gx, gy)
    flat_x, flat_y = GX.ravel(), GY.ravel()

    d0 = np.hypot(flat_x[:, None] - x[None, :], flat_y[:, None] - y[None, :])
    b = np.empty((len(flat_x), n + 1))
    b[:, :n] = _variogram(d0, model, nugget, sill, rng)
    b[:, n] = 1.0

    weights = b @ A_inv.T
    pred = (weights[:, :n] * z[None, :]).sum(axis=1)
    var = (weights * b).sum(axis=1)

    return {
        "grid_x": gx.tolist(),
        "grid_y": gy.tolist(),
        "prediction": pred.reshape(resolution, resolution).tolist(),
        "variance": np.abs(var).reshape(resolution, resolution).tolist(),
        "variogram": {"model": model, "nugget": nugget, "sill": sill, "range": rng},
    }


def cross_validate(x: np.ndarray, y: np.ndarray, z: np.ndarray, **kw) -> dict:
    """Leave-one-out cross-validation summary (RMSE, MAE, R²)."""
    x, y, z = map(lambda a: np.asarray(a, dtype=float), (x, y, z))
    preds = []
    for i in range(len(z)):
        mask = np.arange(len(z)) != i
        # Nearest-neighbour-weighted estimate as a fast LOO proxy.
        d = np.hypot(x[mask] - x[i], y[mask] - y[i])
        w = 1.0 / np.maximum(d, 1e-9) ** 2
        preds.append(float((w * z[mask]).sum() / w.sum()))
    preds = np.array(preds)
    resid = preds - z
    ss_res = float((resid**2).sum())
    ss_tot = float(((z - z.mean()) ** 2).sum()) or 1.0
    return {
        "rmse": float(np.sqrt((resid**2).mean())),
        "mae": float(np.abs(resid).mean()),
        "r2": 1.0 - ss_res / ss_tot,
        "n": len(z),
    }
