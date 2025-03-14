package backend.controllers;

import backend.models.Person;
import backend.services.PersonService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/person")
@RequiredArgsConstructor
@Slf4j
public class PersonController {

    private final PersonService personService;

    @GetMapping("/get-all")
    public ResponseEntity<?> getAllPeople(@RequestParam(name = "str", required = false) String str,
                                          @RequestParam(name = "uyezdId", required = false) Long uyezdId,
                                          @RequestParam(name = "from", required = false) Integer from,
                                          @RequestParam(name = "to", required = false) Integer to) {
        log.info("Отправлен запрос на получение всех людей");
        return ResponseEntity.ok(personService.getAllPeople(str, uyezdId, from, to));
    }

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
