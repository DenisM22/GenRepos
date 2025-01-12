package backend.services;

import backend.models.Person;
import backend.repositories.PersonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PersonService {

    private final PersonRepository personRepository;

    public Person getPersonById(Long id) {
        return personRepository.findById(id).orElseThrow(() -> new RuntimeException("Человек не найден"));
    }

    public void savePerson(Person person) {
        personRepository.save(person);
    }

}
