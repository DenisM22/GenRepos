package backend.repositories;

import backend.models.references.FirstName;
import backend.models.references.LastName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LastNameRepository extends JpaRepository<LastName, Long> {

    List<LastName> findAllByLastNameStartingWithIgnoreCase(String str);


}
