package backend.services;

import backend.dto.DocumentDto;
import backend.dto.DocumentLightDto;
import backend.models.Document;
import backend.repositories.DocumentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final ModelMapper modelMapper;
    private final int SIZE = 1;

    public List<DocumentLightDto> getAllDocuments(String str) {
        List<Document> documents;
        if (str == null || str.isEmpty())
            documents = documentRepository.findAll();
        else
            documents = documentRepository.findAllByTitleContainingIgnoreCase(str);
        return documents.stream().map(document -> modelMapper.map(document, DocumentLightDto.class)).toList();
    }

    public Document getDocumentById(Long id) {
        return documentRepository.findById(id).orElseThrow(() -> new RuntimeException("Документ не найден"));
    }

    public void saveDocument(Document document) {
        documentRepository.save(document);
    }

}
