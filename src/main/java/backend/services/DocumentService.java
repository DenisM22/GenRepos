package backend.services;

import backend.models.Document;
import backend.repositories.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final int SIZE = 20;

    public Page<Document> getAllDocuments(String str, int page) {
        Pageable pageable = PageRequest.of(page, SIZE);
        if (str == null || str.isEmpty())
            return documentRepository.findAll(pageable);
        return documentRepository.findAllByTitleContainingIgnoreCase(str, pageable);
    }

    public Document getDocumentById(Long id) {
        return documentRepository.findById(id).orElseThrow(() -> new RuntimeException("Документ не найден"));
    }

    public void saveDocument(Document document) {
        documentRepository.save(document);
    }

}
