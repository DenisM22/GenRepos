package backend.repositories;

import backend.models.references.Uyezd;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UyezdRepository extends JpaRepository<Uyezd, Long> {

    List<Uyezd> findAll();

}
