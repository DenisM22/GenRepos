package backend.repositories;

import backend.models.references.Parish;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VolostRepository extends JpaRepository<Volost, Long> {

    List<Volost> findAllByParishStartingWithIgnoreCase(String str);

}
