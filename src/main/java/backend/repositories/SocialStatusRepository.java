package backend.repositories;

import backend.models.references.SocialStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SocialStatusRepository extends JpaRepository<SocialStatus, Long> {

    List<SocialStatus> findAllBySocialStatusStartingWithIgnoreCase(String str);

}
