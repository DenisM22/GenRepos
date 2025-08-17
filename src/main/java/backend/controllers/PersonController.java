package backend.controllers;

import backend.dto.PersonDto;
import backend.dto.PersonFamilyTreeDto;
import backend.dto.PersonLightDto;
import backend.models.references.Gender;
import backend.services.GedcomService;
import backend.services.PersonService;
import io.micrometer.core.annotation.Timed;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/person")
public class PersonController {

    private final PersonService personService;
    private final GedcomService gedcomService;

    @Timed(value = "GENREPOS_PEOPLE_GET_ALL", description = "Получение списка всех людей")
    @GetMapping("/get-all")
    public ResponseEntity<List<PersonLightDto>> getAllPeople(
            @RequestParam(name = "str", required = false) String str,
            @RequestParam(name = "gender", required = false) Gender gender,
            @RequestParam(name = "uyezdId", required = false) Long uyezdId,
            @RequestParam(name = "from", required = false) Short from,
            @RequestParam(name = "to", required = false) Short to) {
        log.info("Отправлен запрос на получение всех людей");
        return ResponseEntity.ok(personService.getAllPeople(str, gender, uyezdId, from, to));
    }

    @Timed(value = "GENREPOS_PEOPLE_GET", description = "Получение человека")
    @GetMapping("/get/{id}")
    public ResponseEntity<PersonDto> getPersonById(@PathVariable Long id) {
        log.info("Отправлен запрос на получение человека с id {}", id);
        return ResponseEntity.ok().body(personService.getPersonById(id));
    }

    @Timed(value = "GENREPOS_PEOPLE_SAVE", description = "Сохранение человека")
    @PostMapping("/save")
    public ResponseEntity<Object> savePerson(@RequestParam(required = false) Boolean me, @RequestBody PersonDto personDto) {
        log.info("Отправлен запрос на сохранение нового человека");
        personService.savePerson(personDto, me);
        return ResponseEntity.ok().build();
    }

    @Timed(value = "GENREPOS_PEOPLE_EDIT", description = "Редактирование человека")
    @PatchMapping("/edit/{id}")
    public ResponseEntity<?> editPerson(@PathVariable Long id, @RequestBody PersonDto personDto) {
        log.info("Отправлен запрос на редактирование человека с id {}", id);
        personService.editPerson(id, personDto);
        return ResponseEntity.ok().build();
    }

    @Timed(value = "GENREPOS_PEOPLE_DELETE", description = "Удаление человека")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deletePerson(@PathVariable Long id) {
        log.info("Отправлен запрос на удаление человека с id {}", id);
        personService.deletePerson(id);
        return ResponseEntity.ok().build();
    }

    @Timed(value = "GENREPOS_PEOPLE_FAMILY_TREE", description = "Получение генеалогического древа")
    @GetMapping("/family-tree/{id}")
    public ResponseEntity<PersonFamilyTreeDto> getFamilyTree(@PathVariable Long id) {
        log.info("Отправлен запрос на получение генеалогического древа человека с id {}", id);
        return ResponseEntity.ok().body(personService.getFamilyTree(id));
    }

    @Timed(value = "GENREPOS_PEOPLE_FAMILY_TREE_GEDCOM", description = "Получение файла в формате GEDCOM")
    @GetMapping("/family-tree/gedcom/{id}")
    public ResponseEntity<String> getGedcomFile(@PathVariable Long id) {
        log.info("Отправлен запрос на получение файла в формате GEDCOM для человека с id {}", id);
        return ResponseEntity.ok().body(gedcomService.getGedcomFile(id));
    }

}
