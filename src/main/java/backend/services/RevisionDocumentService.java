package backend.services;

import backend.dto.DocumentLightDto;
import backend.models.confessionalDocuments.ConfessionalDocument;
import backend.models.revisionDocuments.RevisionDocument;
import backend.repositories.*;
import backend.repositories.RevisionDocumentRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class RevisionDocumentService {

    private final RevisionDocumentRepository revisionDocumentRepository;
    private final ModelMapper modelMapper;
    private final int SIZE = 1;
    private final String IMAGE_PATH = "C:\\Program Files\\PostgreSQL\\17\\data\\images\\RevisionDocuments";

    public List<DocumentLightDto> getDocumentsStartingWith(String str) {
        List<RevisionDocument> revisionDocuments;
        if (str == null || str.isEmpty())
            revisionDocuments = revisionDocumentRepository.findAll();
        else
            revisionDocuments = revisionDocumentRepository.findAllByTitleContainingIgnoreCase(str);
        return revisionDocuments.stream().map(document ->
                modelMapper.map(document, DocumentLightDto.class)).toList();
    }

    public RevisionDocument getDocumentById(Long id) {
        return revisionDocumentRepository.findById(id).orElseThrow(() -> new RuntimeException("Документ не найден"));
    }

    public void saveDocument(RevisionDocument revisionDocument) {
        //Сохранение людей из документа
        if (revisionDocument.getPeople() != null) {
            revisionDocument.getPeople().forEach(personFromDocument ->
                    personFromDocument.setDocument(revisionDocument));
        }

        revisionDocumentRepository.save(revisionDocument);
    }
    
}
