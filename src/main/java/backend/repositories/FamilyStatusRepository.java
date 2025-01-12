package backend.repositories;

import backend.models.references.FamilyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FamilyStatusRepository extends JpaRepository<FamilyStatus, Long> {

}
