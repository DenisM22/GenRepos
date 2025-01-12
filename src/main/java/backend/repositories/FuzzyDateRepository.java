package backend.repositories;

import backend.models.references.FuzzyDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FuzzyDateRepository extends JpaRepository<FuzzyDate, Long> {

}
