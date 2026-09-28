package com.grammitraai.controller;

import com.grammitraai.model.FarmerFeedback;
import com.grammitraai.model.User;
import com.grammitraai.repository.FeedbackRepository;
import com.grammitraai.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "*")
public class FeedbackController {

    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;

    public FeedbackController(FeedbackRepository feedbackRepository, UserRepository userRepository) {
        this.feedbackRepository = feedbackRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<FarmerFeedback>> getFeedback(@RequestParam(required = false, defaultValue = "1") Long userId) {
        return ResponseEntity.ok(feedbackRepository.findByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<?> submitFeedback(@RequestBody Map<String, Object> req) {
        FarmerFeedback fb = new FarmerFeedback();
        Long userId = req.containsKey("userId") ? Long.valueOf(req.get("userId").toString()) : 1L;
        User user = userRepository.findById(userId).orElse(null);
        fb.setUser(user);
        fb.setIsUseful(Boolean.valueOf(req.getOrDefault("isUseful", "true").toString()));
        fb.setFarmerComment((String) req.get("farmerComment"));
        fb.setActualWeatherObserved((String) req.get("actualWeatherObserved"));
        fb.setCropConditionReported((String) req.get("cropConditionReported"));

        FarmerFeedback saved = feedbackRepository.save(fb);
        return ResponseEntity.ok(saved);
    }
}
