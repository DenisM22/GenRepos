package backend.repositories;

import backend.models.confessionalDocuments.ConfessionalDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConfessionalDocumentRepository extends JpaRepository<ConfessionalDocument, Long> {

    List<ConfessionalDocument> findAllByTitleContainingIgnoreCaseOrderByTitle(String title);

    List<ConfessionalDocument> findAllByTitleContainingIgnoreCaseAndCreatedAtBetweenOrderByTitle
            (String title, Short createdAt, Short createdAt2);

}
