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
    public ResponseEntity<?> getAllUyezdy() {
        return ResponseEntity.ok(autocompleteService.getAllUyezdy());
    }

    @GetMapping("/volosts")
    public ResponseEntity<?> getVolostsWith(@RequestParam(name = "uyezdId") Long uyezdId,
                                            @RequestParam(name = "str") String str) {
        return ResponseEntity.ok(autocompleteService.getVolostsStartingWith(uyezdId, str));
    }

    @GetMapping("/places")
    public ResponseEntity<?> getPlacesWith(@RequestParam(name = "volostId") Long volostId,
                                           @RequestParam(name = "str") String str) {
        return ResponseEntity.ok(autocompleteService.getPlacesStartingWith(volostId, str));
    }

    @GetMapping("/parishes")
    public ResponseEntity<?> getParishesWith(@RequestParam(name = "str") String str) {
        return ResponseEntity.ok(autocompleteService.getParishesStartingWith(str));
    }

}
