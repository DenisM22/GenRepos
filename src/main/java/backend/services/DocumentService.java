package backend.services;

import backend.dto.DocumentLightDto;
import backend.models.Document;
import backend.repositories.DocumentRepository;
import backend.repositories.FuzzyDateRepository;
import backend.repositories.PersonFromDocumentRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
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
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final ModelMapper modelMapper;
    private final int SIZE = 1;
    private final String IMAGE_PATH = "C:\\Program Files\\PostgreSQL\\17\\data\\images";
    private final PersonFromDocumentRepository personFromDocumentRepository;
    private final FuzzyDateRepository fuzzyDateRepository;

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

    public void saveDocument(Document document) throws IOException {
        //Сохранение изображения в директорию и замена поля на путь к файлу
        if (document.getImage() != null && !document.getImage().isEmpty()) {
            String fileName = UUID.randomUUID() + ".png";
            Path filePath = Paths.get(IMAGE_PATH, fileName);

            Files.createDirectories(filePath.getParent());
            Files.write(filePath, Base64.getDecoder().decode(document.getImage()));
            document.setImage(null);
            document.setImage(filePath.toString());
        }

        //Сохранение людей из документа
        if (document.getPeople() != null) {
            document.getPeople().forEach(personFromDocument -> {
                if (personFromDocument.getBirthDate() != null)
                    fuzzyDateRepository.save(personFromDocument.getBirthDate());
                if (personFromDocument.getDeathDate() != null)
                    fuzzyDateRepository.save(personFromDocument.getDeathDate());
                personFromDocument.setDocument(document);
            });
        }

        documentRepository.save(document);
    }

}
