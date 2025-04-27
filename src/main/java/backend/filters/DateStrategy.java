package backend.filters;

import backend.models.Person;
import backend.models.references.Gender;
import backend.repositories.PersonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@Order(2)
@RequiredArgsConstructor
public class DateStrategy implements PersonFilterStrategy {

    private final PersonRepository personRepository;

    @Override
    public boolean isApplicable(String str, Gender gender, Long uyezdId, Short from, Short to) {
        return from != null || to != null;
    }

    @Override
    public List<Person> filter(String str, Gender gender, Long uyezdId, Short from, Short to) {
        LocalDate dateFrom = LocalDate.of(1, 1, 1);
        LocalDate dateTo = LocalDate.of(3000, 12, 31);
        if (from != null)
            dateFrom = LocalDate.of(from, 1, 1);

        if (to != null)
            dateTo = LocalDate.of(to, 12, 31);

        return personRepository.findAllByFirstNameStartingWithIgnoreCaseAndBirthDate_ExactDateBetweenOrLastNameStartingWithIgnoreCaseAndBirthDate_ExactDateBetweenOrderByLastName
                (str, dateFrom, dateTo, str, dateFrom, dateTo);
    }
}
