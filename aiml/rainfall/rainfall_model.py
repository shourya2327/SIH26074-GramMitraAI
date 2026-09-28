"""
GramMitraAI - Panchayat Rainfall Prediction Model
Calculates probabilistic rainfall accumulation, expected ranges, intensity categories and flood/runoff risk.
"""

from typing import Dict, Any

class RainfallPredictor:
    def predict_horizons(self, current_rain_mm: float, humidity: int, temp: float, pressure: float = 1010.0) -> Dict[str, Any]:
        """
        Predict rainfall across Today, Tomorrow, 3-Day, and 7-Day windows.
        """
        # Multi-factor convective atmospheric index
        convective_index = (humidity / 100.0) * 1.5 - ((temp - 28.0) * 0.02)
        base_probability = min(95, max(10, int(convective_index * 60 + (current_rain_mm * 1.8))))

        def get_intensity(mm: float) -> str:
            if mm < 1.0:
                return "NO_RAIN"
            elif mm < 7.5:
                return "LIGHT"
            elif mm < 35.0:
                return "MODERATE"
            elif mm < 65.0:
                return "HEAVY"
            else:
                return "VERY_HEAVY"

        def get_risk(mm: float, prob: int) -> str:
            if mm > 50.0 and prob > 70:
                return "HIGH"
            elif mm > 25.0 or prob > 60:
                return "MODERATE"
            return "LOW"

        today_expected = round(current_rain_mm * 1.1 + (humidity > 75) * 5.0, 1)
        today_range = f"{max(0.0, round(today_expected * 0.7, 1))} - {round(today_expected * 1.4 + 2.0, 1)} mm"

        tomorrow_expected = round(today_expected * 0.85 + (humidity > 80) * 8.0, 1)
        tomorrow_range = f"{max(0.0, round(tomorrow_expected * 0.6, 1))} - {round(tomorrow_expected * 1.5 + 3.0, 1)} mm"

        three_day_total = round(today_expected + tomorrow_expected + (today_expected * 0.5), 1)
        seven_day_total = round(three_day_total * 1.8, 1)

        return {
            "today": {
                "probability_pct": base_probability,
                "expected_mm": today_expected,
                "range_display": today_range,
                "intensity": get_intensity(today_expected),
                "risk_level": get_risk(today_expected, base_probability)
            },
            "tomorrow": {
                "probability_pct": min(90, max(15, int(base_probability * 0.85))),
                "expected_mm": tomorrow_expected,
                "range_display": tomorrow_range,
                "intensity": get_intensity(tomorrow_expected),
                "risk_level": get_risk(tomorrow_expected, int(base_probability * 0.85))
            },
            "next_3_days": {
                "total_expected_mm": three_day_total,
                "rainy_days_count": 2 if three_day_total > 15 else 1,
                "risk_level": "MODERATE" if three_day_total > 40 else "LOW"
            },
            "next_7_days": {
                "total_expected_mm": seven_day_total,
                "forecast_trend": "Monsoon Active / Moist" if seven_day_total > 60 else "Scattered Showers / Dry Spell"
            }
        }
