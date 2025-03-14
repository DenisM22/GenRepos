package backend.services;

import backend.dto.PersonLightDto;
import backend.models.Person;
import backend.models.references.Gender;
import backend.repositories.FuzzyDateRepository;
import backend.repositories.PersonRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PersonService {

    private final PersonRepository personRepository;
    private final ModelMapper modelMapper;

    public List<PersonLightDto> getAllPeople(String str, Long uyezdId, Integer from, Integer to) {
        List<Person> people;
        if ((str == null || str.isEmpty()) && uyezdId == null && from == null && to == null)
            people = personRepository.findAll();
        else
            people = personRepository.findAllByLastNameStartingWithIgnoreCase
                    (str);

        return people.stream().map(person -> modelMapper.map(person, PersonLightDto.class)).toList();
    }

    public Person getPersonById(Long id) {
        return personRepository.findById(id).orElseThrow(() -> new RuntimeException("Человек не найден"));
    }

    public void savePerson(Person person) {

        if (person.getFather() != null) {
            try {
                Person father = getPersonById(person.getFather().getId());
                father.addChild(person);
            } catch (RuntimeException e) {
                throw new RuntimeException("Родственник(отец) не найден");
            }
        }

        if (person.getMother() != null) {
            try {
                Person mother = getPersonById(person.getMother().getId());
                mother.addChild(person);
            } catch (RuntimeException e) {
                throw new RuntimeException("Родственник(мать) не найден");
            }
        }

        if (person.getSpouse() != null) {
            try {
                Person spouse = getPersonById(person.getSpouse().getId());
                spouse.setSpouse(person);
            } catch (RuntimeException e) {
                throw new RuntimeException("Родственник(отец) не найден");
            }
        }

        if (person.getChildren() != null) {
            List<Person> children = person.getChildren().stream()
                    .map(child -> getPersonById(child.getId())).toList();

            if (person.getGender().equals(Gender.MALE)) {
                children.forEach(child -> {
                    child.setFather(person);
                });
            } else {
                children.forEach(child -> {
                    child.setMother(person);
                });
            }

            person.setChildren(children);
        }

        personRepository.save(person);
    }

}
