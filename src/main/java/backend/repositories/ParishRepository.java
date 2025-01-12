package backend.repositories;

import backend.models.references.Parish;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParishRepository extends JpaRepository<Parish, Long> {

}
