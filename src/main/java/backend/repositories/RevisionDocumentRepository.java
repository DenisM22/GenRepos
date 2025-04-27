package backend.repositories;

import backend.models.confessionalDocuments.ConfessionalDocument;
import backend.models.revisionDocuments.RevisionDocument;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RevisionDocumentRepository extends JpaRepository<RevisionDocument, Long> {

    @Override
    @EntityGraph(attributePaths = {"place", "place.volost", "place.volost.uyezd"})
    List<RevisionDocument> findAll(Sort sort);

    @EntityGraph(attributePaths = {"place", "place.volost", "place.volost.uyezd"})
    List<RevisionDocument> findAllByTitleContainingIgnoreCaseOrderByTitle(String title);

    @EntityGraph(attributePaths = {"place", "place.volost", "place.volost.uyezd"})
    List<RevisionDocument> findAllByTitleContainingIgnoreCaseAndCreatedAtBetweenOrderByTitle
            (String title, Short createdAt, Short createdAt2);

    @Override
    @EntityGraph(attributePaths = {"place", "place.volost", "place.volost.uyezd"})
    Optional<RevisionDocument> findById(Long id);

}
