package backend.controllers;

import backend.services.AutocompleteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/autocomplete")
@RequiredArgsConstructor
public class AutocompleteController {

    private final AutocompleteService autocompleteService;

    @GetMapping("/first-names")
    public ResponseEntity<?> getFirstNamesWith(@RequestParam(name = "str") String str) {
        return ResponseEntity.ok(autocompleteService.getFirstNamesStartingWith(str));
    }

    @GetMapping("/last-names")
    public ResponseEntity<?> getLastNamesWith(@RequestParam(name = "str") String str) {
        return ResponseEntity.ok(autocompleteService.getLastNamesStartingWith(str));
    }

    @GetMapping("/middle-names")
    public ResponseEntity<?> getMiddleNamesWith(@RequestParam(name = "str") String str) {
        return ResponseEntity.ok(autocompleteService.getMiddleNamesStartingWith(str));
    }

    @GetMapping("/uyezdy")
    public ResponseEntity<?> getUyezdy() {
        return ResponseEntity.ok(autocompleteService.getUyezdy());
    }

    @GetMapping("/volosts")
    public ResponseEntity<?> getVolosts(@RequestParam(name = "uyezdId") Long uyezdId) {
        return ResponseEntity.ok(autocompleteService.getVolosts(uyezdId));
    }

    @GetMapping("/places")
    public ResponseEntity<?> getPlaces(@RequestParam(name = "volostId") Long volostId) {
        return ResponseEntity.ok(autocompleteService.getPlaces(volostId));
    }

    @GetMapping("/parishes")
    public ResponseEntity<?> getParishesContaining(@RequestParam(name = "str") String str) {
        return ResponseEntity.ok(autocompleteService.getParishesContaining(str));
    }

    @GetMapping("/family-statuses")
    public ResponseEntity<?> getFamilyStatuses() {
        return ResponseEntity.ok(autocompleteService.getFamilyStatuses());
    }

    @GetMapping("/social-statuses")
    public ResponseEntity<?> getSocialStatuses() {
        return ResponseEntity.ok(autocompleteService.getSocialStatuses());
    }

    @GetMapping("/landowners")
    public ResponseEntity<?> getLandowners(@RequestParam(name = "str") String str) {
        return ResponseEntity.ok(autocompleteService.getLandowners(str));
    }
}
