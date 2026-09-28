"""
GramMitraAI - Crop Disease Risk Model
Evaluates micro-meteorological indices (leaf wetness hours, temperature-humidity index)
to predict favorable pathogen incubation risk.
Important: Does not diagnose diseases without lab/field scouting; provides risk index only.
"""

from typing import Dict, Any, List

class CropDiseaseRiskModel:
    DISEASE_RULES = {
        "Wheat": [
            {
                "disease": "Yellow Rust (Stripe Rust)",
                "pathogen": "Puccinia striiformis",
                "temp_range": (10.0, 20.0),
                "min_humidity": 75,
                "action": "Inspect lower canopy for yellow pustules. If detected, spray Propiconazole 25% EC @ 1ml/L as per local KVK protocol."
            },
            {
                "disease": "Powdery Mildew",
                "pathogen": "Blumeria graminis",
                "temp_range": (15.0, 25.0),
                "min_humidity": 65,
                "action": "Avoid dense canopies and high nitrogen doses. Monitor flag leaf."
            }
        ],
        "Soybean": [
            {
                "disease": "Rust (Asian Soybean Rust)",
                "pathogen": "Phakopsora pachyrhizi",
                "temp_range": (18.0, 28.0),
                "min_humidity": 80,
                "action": "High risk under prolonged leaf wetness. Apply prophylactic hexaconazole if weather continues humid for 3+ consecutive days."
            },
            {
                "disease": "Collar Rot / Root Rot",
                "pathogen": "Rhizoctonia solani",
                "temp_range": (25.0, 32.0),
                "min_humidity": 85,
                "action": "Ensure field drainage to eliminate water ponding around root collars."
            }
        ],
        "Gram / Chickpea": [
            {
                "disease": "Ascochyta Blight",
                "pathogen": "Ascochyta rabiei",
                "temp_range": (15.0, 23.0),
                "min_humidity": 70,
                "action": "Cloudy, rainy weather triggers rapid spore dispersal. Scout for brown circular lesions on leaves and pods."
            }
        ]
    }

    def evaluate_risk(
        self,
        crop_name: str,
        temperature: float,
        humidity: int,
        rainfall_expected_mm: float
    ) -> Dict[str, Any]:
        crop = crop_name if crop_name in self.DISEASE_RULES else "Wheat"
        rules = self.DISEASE_RULES[crop]

        evaluations: List[Dict[str, Any]] = []
        overall_risk = "LOW"

        for r in rules:
            t_min, t_max = r["temp_range"]
            temp_in_range = t_min <= temperature <= t_max
            humidity_high = humidity >= r["min_humidity"]
            rain_present = rainfall_expected_mm > 5.0

            if temp_in_range and humidity_high and rain_present:
                risk = "HIGH"
                score = 88
            elif (temp_in_range and humidity_high) or (humidity_high and rain_present):
                risk = "MEDIUM"
                score = 64
            else:
                risk = "LOW"
                score = 22

            if risk == "HIGH":
                overall_risk = "HIGH"
            elif risk == "MEDIUM" and overall_risk != "HIGH":
                overall_risk = "MEDIUM"

            evaluations.append({
                "disease_name": r["disease"],
                "pathogen": r["pathogen"],
                "risk_level": risk,
                "risk_score_pct": score,
                "favorable_conditions": f"Temp {t_min}-{t_max}°C and RH > {r['min_humidity']}%",
                "recommended_action": r["action"]
            })

        return {
            "crop": crop,
            "overall_disease_risk": overall_risk,
            "monitored_diseases": evaluations,
            "environmental_drivers": {
                "temperature": temperature,
                "relative_humidity": humidity,
                "rainfall_expected_mm": rainfall_expected_mm,
                "leaf_wetness_risk": "Elevated" if humidity > 78 or rainfall_expected_mm > 8.0 else "Normal"
            },
            "scientific_disclaimer": "Disease risk is calculated from micro-meteorological indices. This is an early warning system, not a definitive botanical diagnosis."
        }
