package backend.filters;

import backend.models.Person;
import backend.models.references.Gender;

import java.util.List;

public interface PersonFilterStrategy {
    boolean isApplicable(String str, Gender gender, Long uyezdId, Short from, Short to);

    List<Person> filter(String str, Gender gender, Long uyezdId, Short from, Short to);
}
