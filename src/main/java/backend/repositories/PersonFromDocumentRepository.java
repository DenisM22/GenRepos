package backend.repositories;

import backend.models.PersonFromDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonFromDocumentRepository extends JpaRepository<PersonFromDocument, Long> {

}
