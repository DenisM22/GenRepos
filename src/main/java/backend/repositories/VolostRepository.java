package backend.repositories;

import backend.models.references.Volost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VolostRepository extends JpaRepository<Volost, Long> {

    List<Volost> findAllByUyezd_IdAndVolostStartingWithIgnoreCase(Long uyezdId, String volost);

}
