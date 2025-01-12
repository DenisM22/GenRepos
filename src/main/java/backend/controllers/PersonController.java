package backend.controllers;

import backend.models.Person;
import backend.services.PersonService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/person")
@RequiredArgsConstructor
public class PersonController {

    private final PersonService personService;

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getPersonById(@PathVariable Long id) {
        return ResponseEntity.ok().body(personService.getPersonById(id));
    }

    @PostMapping("/save")
    public ResponseEntity<?> savePerson(@RequestBody Person person) {
        personService.savePerson(person);
        return ResponseEntity.ok().build();
    }



}
