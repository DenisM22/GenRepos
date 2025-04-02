package backend.services;

import backend.dto.PersonDto;
import backend.dto.PersonFamilyTreeDto;
import backend.dto.PersonLightDto;
import backend.models.Person;
import backend.models.references.Gender;
import backend.repositories.PersonRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PersonService {

    private final PersonRepository personRepository;
    private final ModelMapper modelMapper;

    public List<PersonLightDto> getAllPeople(String str, Long uyezdId, Short from, Short to) {
        List<Person> people;
        LocalDate dateFrom = LocalDate.of(1, 1, 1);
        LocalDate dateTo = LocalDate.of(3000, 12, 31);

        if ((str == null || str.isBlank()) && uyezdId == null && from == null && to == null) {
            people = personRepository.findAll(Sort.by("lastName"));
        } else if ((str != null && !str.isBlank()) && uyezdId == null && from == null && to == null) {
            people = personRepository.findAllByFirstNameStartingWithIgnoreCaseOrLastNameStartingWithIgnoreCaseOrderByLastName(str, str);
        } else {
            if (from != null)
                dateFrom = LocalDate.of(from, 1, 1);

            if (to != null)
                dateTo = LocalDate.of(to, 12, 31);

            if (uyezdId == null) {
                people = personRepository.findAllByFirstNameStartingWithIgnoreCaseAndBirthDate_ExactDateBetweenOrLastNameStartingWithIgnoreCaseAndBirthDate_ExactDateBetweenOrderByLastName
                        (str, dateFrom, dateTo, str, dateFrom, dateTo);
            } else
                people = personRepository.findAllByFirstNameStartingWithIgnoreCaseAndPlace_Volost_Uyezd_IdAndBirthDate_ExactDateBetweenOrLastNameStartingWithIgnoreCaseAndPlace_Volost_Uyezd_IdAndBirthDate_ExactDateBetweenOrderByLastName
                        (str, uyezdId, dateFrom, dateTo, str, uyezdId, dateFrom, dateTo);
        }

        return people.stream().map(person -> modelMapper.map(person, PersonLightDto.class)).toList();
    }

    public PersonDto getPersonDtoById(Long id) {
        Person person = personRepository.findById(id).orElseThrow(() -> new RuntimeException("Человек не найден"));
        return modelMapper.map(person, PersonDto.class);
    }

    private Person getRelative(Person person, String status) {
        if (person.getId() == null)
            throw new RuntimeException(status + " с именем " + person.getFirstName() + " не найден");
        else
            return personRepository.findById(person.getId()).orElseThrow(() ->
                    new RuntimeException(status + " с именем " + person.getFirstName() + " не найден"));
    }

    private void validatePerson(Person person) {

        if (person == null) {
            throw new IllegalArgumentException("Переданный объект person не должен быть null");
        }

        if (person.getFather() != null) {
            if (Objects.equals(person.getId(), person.getFather().getId())) {
                throw new IllegalArgumentException("Человек не может быть своим собственным отцом");
            }
        }

        if (person.getMother() != null) {
            if (Objects.equals(person.getId(), person.getMother().getId())) {
                throw new IllegalArgumentException("Человек не может быть своей собственной матерью");
            }
        }

        if (person.getSpouse() != null) {
            if (Objects.equals(person.getId(), person.getSpouse().getId())) {
                throw new IllegalArgumentException("Человек не может быть сам себе супругом");
            }
        }

        if (person.getFather() != null && person.getMother() != null &&
                Objects.equals(person.getFather().getId(), person.getMother().getId())) {
            throw new IllegalArgumentException("Отец и мать не могут быть одним и тем же человеком");
        }

        if (person.getFather() != null && person.getSpouse() != null &&
                Objects.equals(person.getFather().getId(), person.getSpouse().getId())) {
            throw new IllegalArgumentException("Отец и супруг(а) не могут быть одним и тем же человеком");
        }

        if (person.getMother() != null && person.getSpouse() != null &&
                Objects.equals(person.getMother().getId(), person.getSpouse().getId())) {
            throw new IllegalArgumentException("Мать и супруг(а) не могут быть одним и тем же человеком");
        }
    }

    public void savePerson(Person person) {

        validatePerson(person);

        if (person.getFather() != null) {
            Person father = getRelative(person.getFather(), "Отец");
            father.addChild(person);
        }

        if (person.getMother() != null) {
            Person mother = getRelative(person.getMother(), "Мать");
            mother.addChild(person);
        }

        if (person.getSpouse() != null) {
            Person spouse = getRelative(person.getSpouse(), "Супруг(а)");
            spouse.setSpouse(person);
        }

        if (person.getChildren() != null) {
            List<Person> children = person.getChildren().stream()
                    .map(child -> getRelative(child, "Ребенок")).collect(Collectors.toSet())
                    .stream().toList();

            if (person.getGender().equals(Gender.MALE)) {
                children.forEach(child -> child.setFather(person));
            } else {
                children.forEach(child -> child.setMother(person));
            }

            person.setChildren(children);
        }

        personRepository.save(person);
    }

    //    @CacheEvict(value = "familyTree", key = "#id")
    public void editPerson(Long id, Person editedPerson) {

        validatePerson(editedPerson);

        Person originalPerson = personRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Человек не найден"));

        if (Objects.equals(editedPerson, originalPerson)) {
            return;
        }

        if (!Objects.equals(
                editedPerson.getFather() != null ? editedPerson.getFather().getId() : null,
                originalPerson.getFather() != null ? originalPerson.getFather().getId() : null)) {

            if (originalPerson.getFather() != null) {
                Person oldFather = getRelative(originalPerson.getFather(), "Отец по предыдущей записи");
                oldFather.removeChild(originalPerson);
            }

            if (editedPerson.getFather() != null) {
                Person newFather = getRelative(editedPerson.getFather(), "Отец");
                newFather.addChild(editedPerson);
                editedPerson.setFather(newFather);
            }
        }

        if (!Objects.equals(
                editedPerson.getMother() != null ? editedPerson.getMother().getId() : null,
                originalPerson.getMother() != null ? originalPerson.getMother().getId() : null)) {

            if (originalPerson.getMother() != null) {
                Person oldMother = getRelative(originalPerson.getMother(), "Мать по предыдущей записи");
                oldMother.removeChild(originalPerson);
            }

            if (editedPerson.getMother() != null) {
                Person newMother = getRelative(editedPerson.getMother(), "Мать");
                newMother.addChild(editedPerson);
                editedPerson.setMother(newMother);
            }
        }

        if (!Objects.equals(
                editedPerson.getSpouse() != null ? editedPerson.getSpouse().getId() : null,
                originalPerson.getSpouse() != null ? originalPerson.getSpouse().getId() : null)) {

            if (originalPerson.getSpouse() != null) {
                Person oldSpouse = getRelative(originalPerson.getSpouse(), "Супруг(а) по предыдущей записи");
                oldSpouse.setSpouse(null);
            }

            if (editedPerson.getSpouse() != null) {
                Person newSpouse = getRelative(editedPerson.getSpouse(), "Супруг(а)");
                newSpouse.setSpouse(editedPerson);
                editedPerson.setSpouse(newSpouse);
            }
        }

        if (!Objects.equals(editedPerson.getChildren(), originalPerson.getChildren())) {

            if (originalPerson.getChildren() != null) {
                List<Person> children = originalPerson.getChildren().stream()
                        .map(child -> getRelative(child, "Ребенок из предыдущей записи")).toList();

                if (originalPerson.getGender().equals(Gender.MALE)) {
                    children.forEach(child -> child.setFather(null));
                } else {
                    children.forEach(child -> child.setMother(null));
                }

            }

            if (editedPerson.getChildren() != null) {
                List<Person> children = editedPerson.getChildren().stream()
                        .map(child -> getRelative(child, "Ребенок")).collect(Collectors.toSet())
                        .stream().toList();

                if (editedPerson.getGender().equals(Gender.MALE)) {
                    children.forEach(child -> child.setFather(editedPerson));
                } else {
                    children.forEach(child -> child.setMother(editedPerson));
                }

                editedPerson.setChildren(children);
            }
        }

        personRepository.save(editedPerson);
    }

    //    @CacheEvict(value = "familyTree", key = "#id")
    public void deletePerson(Long id) {
        if (!personRepository.existsById(id)) {
            throw new RuntimeException("Человек не найден");
        }
        personRepository.deleteById(id);
    }

    //    @Cacheable(value = "familyTree", key = "#id")
    public PersonFamilyTreeDto getFamilyTree(Long id) {
        Person person = personRepository.findById(id).orElseThrow(() -> new RuntimeException("Человек не найден"));
        return modelMapper.map(person, PersonFamilyTreeDto.class);
    }

}
