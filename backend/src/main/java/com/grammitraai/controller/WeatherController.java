package com.grammitraai.controller;

import com.grammitraai.service.WeatherService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/weather")
@CrossOrigin(origins = "*")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping("/current")
    public ResponseEntity<?> getCurrent(
            @RequestParam(required = false, defaultValue = "22.9734") Double lat,
            @RequestParam(required = false, defaultValue = "75.8267") Double lon) {
        return ResponseEntity.ok(weatherService.getCurrentWeather(lat, lon));
    }

    @GetMapping("/hourly")
    public ResponseEntity<?> getHourly(
            @RequestParam(required = false, defaultValue = "22.9734") Double lat,
            @RequestParam(required = false, defaultValue = "75.8267") Double lon) {
        return ResponseEntity.ok(weatherService.getHourlyForecast(lat, lon));
    }

    @GetMapping("/daily")
    public ResponseEntity<?> getDaily(
            @RequestParam(required = false, defaultValue = "22.9734") Double lat,
            @RequestParam(required = false, defaultValue = "75.8267") Double lon) {
        return ResponseEntity.ok(weatherService.getDailyForecast(lat, lon));
    }
}
