package backend.repositories;

import backend.models.revisionDocuments.RevisionDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RevisionDocumentRepository extends JpaRepository<RevisionDocument, Long> {

    List<RevisionDocument> findAllByTitleContainingIgnoreCaseOrderByTitle(String title);

    List<RevisionDocument> findAllByTitleContainingIgnoreCaseAndCreatedAtBetweenOrderByTitle
            (String title, Short createdAt, Short createdAt2);

}
