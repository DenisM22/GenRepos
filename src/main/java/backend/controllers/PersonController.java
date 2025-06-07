package backend.controllers;

import backend.dto.PersonDto;
import backend.models.references.Gender;
import backend.services.GedcomService;
import backend.services.PersonService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/person")
public class PersonController {

    private final PersonService personService;
    private final GedcomService gedcomService;

    @GetMapping("/get-all")
    public ResponseEntity<?> getAllPeople(@RequestParam(name = "str", required = false) String str,
                                          @RequestParam(name = "gender", required = false) Gender gender,
                                          @RequestParam(name = "uyezdId", required = false) Long uyezdId,
                                          @RequestParam(name = "from", required = false) Short from,
                                          @RequestParam(name = "to", required = false) Short to) {
        log.info("Отправлен запрос на получение всех людей");
        return ResponseEntity.ok(personService.getAllPeople(str, gender, uyezdId, from, to));
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getPersonById(@PathVariable Long id) {
        log.info("Отправлен запрос на получение человека с id {}", id);
        return ResponseEntity.ok().body(personService.getPersonById(id));
    }

    @PostMapping("/save")
    public ResponseEntity<?> savePerson(@RequestParam Boolean me, @RequestBody PersonDto personDto) {
        log.info("Отправлен запрос на сохранение нового человека");
        personService.savePerson(personDto, me);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/edit/{id}")
    public ResponseEntity<?> editPerson(@PathVariable Long id, @RequestBody PersonDto personDto) {
        log.info("Отправлен запрос на редактирование человека с id {}", id);
        personService.editPerson(id, personDto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deletePerson(@PathVariable Long id) {
        log.info("Отправлен запрос на удаление человека с id {}", id);
        personService.deletePerson(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/family-tree/{id}")
    public ResponseEntity<?> getFamilyTree(@PathVariable Long id) {
        log.info("Отправлен запрос на получение генеалогического древа человека с id {}", id);
        return ResponseEntity.ok().body(personService.getFamilyTree(id));
    }

    @GetMapping("/family-tree/gedcom/{id}")
    public ResponseEntity<?> getGedcomFile(@PathVariable Long id) {
        log.info("Отправлен запрос на получение файла в формате GEDCOM для человека с id {}", id);
        return ResponseEntity.ok().body(gedcomService.getGedcomFile(id));
    }

}
