package backend.filters;

import backend.models.Person;
import backend.models.references.Gender;
import backend.repositories.PersonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Order(4)
@RequiredArgsConstructor
public class NameStrategy implements PersonFilterStrategy {

    private final PersonRepository personRepository;

    @Override
    public boolean isApplicable(String str, Gender gender, Long uyezdId, Short from, Short to) {
        return (str != null && !str.isBlank()) && gender == null && uyezdId == null && from == null && to == null;
    }

    @Override
    public List<Person> filter(String str, Gender gender, Long uyezdId, Short from, Short to) {
        return personRepository.findAllByFirstNameStartingWithIgnoreCaseOrLastNameStartingWithIgnoreCaseOrderByLastName(str, str);
    }
}
