package backend.services;

import backend.dto.PersonDto;
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

    private Person getPersonById(Long id) {
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
