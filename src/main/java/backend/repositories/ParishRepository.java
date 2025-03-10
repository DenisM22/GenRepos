package backend.repositories;

import backend.models.references.Parish;
import backend.models.references.Place;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParishRepository extends JpaRepository<Parish, Long> {

    List<Parish> findAllByParishContainingIgnoreCase(String str);

}
