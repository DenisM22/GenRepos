package backend.repositories;

import backend.models.references.FirstName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FirstNameRepository extends JpaRepository<FirstName, String> {

    List<FirstName> findAllByFirstNameStartingWithIgnoreCase(String str);

}
