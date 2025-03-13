package backend.repositories;

import backend.models.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {

    List<Person> findAllByLastNameStartingWithIgnoreCase(String str);

    List<Person> findAllByPlace_Volost_Uyezd_IdAndBirthDate_ExactDate_YearBetweenAndFirstNameStartingWithIgnoreCaseOrLastNameStartingWithIgnoreCase
            (Long uyezdId, int from, int to, String firstName, String lastName);

}
