package backend.repositories;

import backend.models.metricDocuments.MetricDocument;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MetricDocumentRepository extends JpaRepository<MetricDocument, Long> {

    @Override
    @EntityGraph(attributePaths = "parish")
    List<MetricDocument> findAll(Sort sort);

    @EntityGraph(attributePaths = "parish")
    List<MetricDocument> findAllByTitleContainingIgnoreCaseOrderByTitle(String title);

    @EntityGraph(attributePaths = "parish")
    List<MetricDocument> findAllByTitleContainingIgnoreCaseAndCreatedAtBetweenOrderByTitle
            (String title, Short createdAt, Short createdAt2);

    @Override
    @EntityGraph(attributePaths = "parish")
    Optional<MetricDocument> findById(Long id);

}
