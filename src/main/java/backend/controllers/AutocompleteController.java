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
        return ResponseEntity.ok(autocompleteService.getFirstNamesWith(str));
    }

    @GetMapping("/last-names")
    public ResponseEntity<?> getLastNamesWith(@RequestParam(name = "str") String str) {
        return ResponseEntity.ok(autocompleteService.getLastNamesWith(str));
    }

    @GetMapping("/middle-names")
    public ResponseEntity<?> gwtMiddleNamesWith(@RequestParam(name = "str") String str) {
        return ResponseEntity.ok(autocompleteService.getMiddleNamesWith(str));
    }

    @GetMapping("/places")
    public ResponseEntity<?> getPlacesWith(@RequestParam(name = "str") String str) {
        return ResponseEntity.ok(autocompleteService.getPlacesWith(str));
    }

}
