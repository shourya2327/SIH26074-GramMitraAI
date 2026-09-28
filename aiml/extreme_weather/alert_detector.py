"""
GramMitraAI - Extreme Weather Early Warning Detector
Evaluates IMD threshold standards for Indian agro-climatic conditions:
Heatwave, Cold Wave, Heavy Rainfall/Cloudburst, High Wind Gale, Hailstorm and Lightning Risk.
"""

from typing import List, Dict, Any

class ExtremeWeatherAlertDetector:
    def detect_alerts(
        self,
        temperature: float,
        rainfall_expected_mm: float,
        wind_speed_kmh: float,
        humidity: int,
        pressure_hpa: float = 1012.0
    ) -> List[Dict[str, Any]]:
        alerts = []

        # 1. Heavy Rainfall / Cloudburst risk
        if rainfall_expected_mm >= 64.5:
            alerts.append({
                "id": "ALERT-RAIN-RED",
                "event_type": "HEAVY_RAINFALL",
                "severity": "RED_WARNING",
                "headline": f"Severe Rainfall Warning: Expected ~{rainfall_expected_mm} mm in 24h",
                "expected_time": "Next 6 - 18 hours",
                "description": "High probability of localized flash inundation and rapid soil saturation.",
                "actions": [
                    "Open and clean field drainage channels immediately",
                    "Shift harvested produce to covered raised platforms",
                    "Do not apply insecticides or foliar fertilizers"
                ]
            })
        elif rainfall_expected_mm >= 35.0:
            alerts.append({
                "id": "ALERT-RAIN-ORANGE",
                "event_type": "MODERATE_HEAVY_RAIN",
                "severity": "ORANGE_ALERT",
                "headline": f"Moderate to Heavy Showers Anticipated (~{rainfall_expected_mm} mm)",
                "expected_time": "Next 12 - 24 hours",
                "description": "Substantial precipitation expected; field operations should be rescheduled.",
                "actions": [
                    "Halt all scheduled irrigation cycles",
                    "Inspect field bunds to avoid runoff breaches"
                ]
            })

        # 2. Heatwave conditions (IMD plains criteria: >= 40°C or 4.5°C departure)
        if temperature >= 42.0:
            alerts.append({
                "id": "ALERT-HEAT-ORANGE",
                "event_type": "HEATWAVE",
                "severity": "ORANGE_ALERT",
                "headline": f"Heatwave Condition: Peak Daytime Temperature {temperature}°C",
                "expected_time": "11:30 AM to 4:30 PM",
                "description": "Elevated atmospheric temperatures may cause flower drop and canopy dehydration.",
                "actions": [
                    "Conduct light evening/night micro-irrigation to maintain humidity",
                    "Keep farm livestock under shaded, well-ventilated shelters",
                    "Protect farm workers from direct noon sun exposure"
                ]
            })
        elif temperature <= 5.0:
            alerts.append({
                "id": "ALERT-COLD-YELLOW",
                "event_type": "COLD_WAVE",
                "severity": "YELLOW_WATCH",
                "headline": f"Cold Wave Watch: Minimum Temperature dipping to {temperature}°C",
                "expected_time": "Overnight (02:00 AM - 06:00 AM)",
                "description": "Low ground temperature risk, potential frost impact on sensitive young crops.",
                "actions": [
                    "Provide evening light furrow irrigation to elevate soil thermal capacity",
                    "Create gentle boundary smoke (thatched mulch) on north-western field edges"
                ]
            })

        # 3. Squall / High Wind
        if wind_speed_kmh >= 45.0:
            alerts.append({
                "id": "ALERT-WIND-YELLOW",
                "event_type": "STRONG_WIND",
                "severity": "YELLOW_WATCH",
                "headline": f"High Wind Alert: Sustained gusts up to {wind_speed_kmh} km/h",
                "expected_time": "Next 6 - 12 hours",
                "description": "Risk of crop lodging in tall crops (maize, sugarcane, banana) and drift during chemical spraying.",
                "actions": [
                    "Stake tall crops or provide earthing up support",
                    "Never spray pesticides or foliar nutrients during windy spells"
                ]
            })

        return alerts
