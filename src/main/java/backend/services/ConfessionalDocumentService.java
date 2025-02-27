package backend.services;

import backend.dto.DocumentLightDto;
import backend.models.confessionalDocuments.ConfessionalDocument;
import backend.repositories.ConfessionalDocumentRepository;
import backend.repositories.FuzzyDateRepository;
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
public class ConfessionalDocumentService {

    private final ConfessionalDocumentRepository confessionalDocumentRepository;
    private final ModelMapper modelMapper;
    private final int SIZE = 1;
    private final String IMAGE_PATH = "C:\\Program Files\\PostgreSQL\\17\\data\\images\\ConfessionalDocuments";
    private final FuzzyDateRepository fuzzyDateRepository;

    public List<DocumentLightDto> getDocumentsStartingWith(String str) {
        List<ConfessionalDocument> confessionalDocuments;
        if (str == null || str.isEmpty())
            confessionalDocuments = confessionalDocumentRepository.findAll();
        else
            confessionalDocuments = confessionalDocumentRepository.findAllByTitleContainingIgnoreCase(str);
        return confessionalDocuments.stream().map(document ->
                modelMapper.map(document, DocumentLightDto.class)).toList();
    }

    public ConfessionalDocument getDocumentById(Long id) {
        return confessionalDocumentRepository.findById(id).orElseThrow(() -> new RuntimeException("Документ не найден"));
    }

    public void saveDocument(ConfessionalDocument confessionalDocument) throws IOException {
        //Сохранение изображения в директорию и замена поля на путь к файлу
        if (confessionalDocument.getImage() != null && !confessionalDocument.getImage().isEmpty()) {
            String fileName = UUID.randomUUID() + ".png";
            Path filePath = Paths.get(IMAGE_PATH, fileName);

            Files.createDirectories(filePath.getParent());
            Files.write(filePath, Base64.getDecoder().decode(confessionalDocument.getImage()));
            confessionalDocument.setImage(null);
            confessionalDocument.setImage(filePath.toString());
        }

        //Сохранение людей из документа
        if (confessionalDocument.getPeople() != null) {
            confessionalDocument.getPeople().forEach(personFromDocument -> {
                if (personFromDocument.getBirthDate() != null)
                    fuzzyDateRepository.save(personFromDocument.getBirthDate());
                if (personFromDocument.getDeathDate() != null)
                    fuzzyDateRepository.save(personFromDocument.getDeathDate());
                personFromDocument.setDocument(confessionalDocument);
            });
        }

        confessionalDocumentRepository.save(confessionalDocument);
    }

}
