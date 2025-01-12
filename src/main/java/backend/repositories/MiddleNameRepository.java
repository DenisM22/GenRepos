package backend.repositories;

import backend.models.references.FirstName;
import backend.models.references.MiddleName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MiddleNameRepository extends JpaRepository<MiddleName, Long> {

    List<MiddleName> findAllByMiddleNameStartingWithIgnoreCase(String str);


}
