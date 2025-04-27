package backend.repositories;

import backend.models.confessionalDocuments.ConfessionalDocument;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConfessionalDocumentRepository extends JpaRepository<ConfessionalDocument, Long> {

    @Override
    @EntityGraph(attributePaths = "parish")
    List<ConfessionalDocument> findAll(Sort sort);

    @EntityGraph(attributePaths = "parish")
    List<ConfessionalDocument> findAllByTitleContainingIgnoreCaseOrderByTitle(String title);

    @EntityGraph(attributePaths = "parish")
    List<ConfessionalDocument> findAllByTitleContainingIgnoreCaseAndCreatedAtBetweenOrderByTitle
            (String title, Short createdAt, Short createdAt2);

    @Override
    @EntityGraph(attributePaths = "parish")
    Optional<ConfessionalDocument> findById(Long id);

}
