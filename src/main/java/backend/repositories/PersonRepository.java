package backend.repositories;

import backend.models.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {

    List<Person> findAllByFirstNameStartingWithIgnoreCaseOrLastNameStartingWithIgnoreCaseOrderByLastName
            (String firstName, String lastName);

    List<Person> findAllByFirstNameStartingWithIgnoreCaseAndBirthDate_ExactDateBetweenOrLastNameStartingWithIgnoreCaseAndBirthDate_ExactDateBetweenOrderByLastName
            (String firstName, LocalDate birthDate_exactDate, LocalDate birthDate_exactDate2, String lastName, LocalDate birthDate_exactDate3, LocalDate birthDate_exactDate4);

    List<Person> findAllByFirstNameStartingWithIgnoreCaseAndPlace_Volost_Uyezd_IdAndBirthDate_ExactDateBetweenOrLastNameStartingWithIgnoreCaseAndPlace_Volost_Uyezd_IdAndBirthDate_ExactDateBetweenOrderByLastName
            (String firstName, Long place_volost_uyezd_id, LocalDate birthDate_exactDate, LocalDate birthDate_exactDate2, String lastName, Long place_volost_uyezd_id2, LocalDate birthDate_exactDate3, LocalDate birthDate_exactDate4);

}
