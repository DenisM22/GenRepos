package backend.repositories;

import backend.models.metricDocuments.MetricDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MetricDocumentRepository extends JpaRepository<MetricDocument, Long> {

    List<MetricDocument> findAllByTitleContainingIgnoreCase(String str);

}
