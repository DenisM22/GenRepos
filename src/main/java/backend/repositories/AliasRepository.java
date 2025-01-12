package backend.repositories;

import backend.models.references.Alias;
import backend.models.references.LastName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AliasRepository extends JpaRepository<Alias, Long> {

    List<Alias> findAllByAliasStartingWithIgnoreCase(String str);

}
