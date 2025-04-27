package backend.filters;

import backend.models.Person;
import backend.models.references.Gender;
import backend.repositories.PersonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Order(3)
@RequiredArgsConstructor
public class UyezdStrategy implements PersonFilterStrategy {

    private final PersonRepository personRepository;

    @Override
    public boolean isApplicable(String str, Gender gender, Long uyezdId, Short from, Short to) {
        return uyezdId != null;
    }

    @Override
    public List<Person> filter(String str, Gender gender, Long uyezdId, Short from, Short to) {
        return personRepository.findAllByFirstNameStartingWithIgnoreCaseAndPlace_Volost_Uyezd_IdOrLastNameStartingWithIgnoreCaseAndPlace_Volost_Uyezd_IdOrderByLastName
                (str, uyezdId, str, uyezdId);
    }
}
