import numpy as np

from app.services.geostatistics import kriging
from app.services.volume import earthworks


def test_ordinary_kriging_returns_grid_and_diagnostics():
    rng = np.random.default_rng(0)
    x = rng.uniform(0, 100, 25)
    y = rng.uniform(0, 100, 25)
    z = 0.5 * x + 0.3 * y + rng.normal(0, 2, 25)

    res = kriging.ordinary_kriging(x, y, z, resolution=20)
    assert len(res["prediction"]) == 20
    assert len(res["prediction"][0]) == 20
    # Predictions should sit within a sane range of the samples.
    flat = np.array(res["prediction"])
    assert flat.min() >= z.min() - 3 * z.std()
    assert flat.max() <= z.max() + 3 * z.std()

    cv = kriging.cross_validate(x, y, z)
    assert cv["rmse"] >= 0
    assert -1 <= cv["r2"] <= 1


def test_kriging_requires_minimum_samples():
    try:
        kriging.ordinary_kriging([0, 1], [0, 1], [1, 2])
    except ValueError:
        pass
    else:  # pragma: no cover
        raise AssertionError("expected ValueError for <3 samples")


def test_cut_fill_volumes():
    surface = np.full((10, 10), 5.0)
    base = np.zeros((10, 10))
    res = earthworks.cut_fill(surface, base, cell_size=2.0)
    # 100 cells * 4 m² * 5 m height = 2000 m³ of fill, no cut.
    assert res["fill_volume_m3"] == 2000.0
    assert res["cut_volume_m3"] == 0.0
    assert res["net_volume_m3"] == 2000.0
