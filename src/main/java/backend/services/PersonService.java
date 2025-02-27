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

    public List<PersonLightDto> getAllPeople(String str) {
        List<Person> people;
        if (str == null || str.isEmpty())
            people = personRepository.findAll();
        else
            people = personRepository.findAllByLastNameStartingWithIgnoreCase(str);
        return people.stream().map(person -> modelMapper.map(person, PersonLightDto.class)).toList();
    }

    public Person getPersonById(Long id) {
        return personRepository.findById(id).orElseThrow(() -> new RuntimeException("Человек не найден"));
    }

    public void savePerson(Person person) {
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
