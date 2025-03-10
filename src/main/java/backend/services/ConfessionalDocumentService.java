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
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Transactional
public class ConfessionalDocumentService {

    private final ConfessionalDocumentRepository confessionalDocumentRepository;
    private final FuzzyDateRepository fuzzyDateRepository;
    private final ModelMapper modelMapper;
    private final int SIZE = 1;
    private final String IMAGE_PATH = "C:\\Program Files\\PostgreSQL\\17\\data\\images\\ConfessionalDocuments";
    private static final Pattern URL_PATTERN = Pattern.compile(
            "^(https?|ftp)://[\\w.-]+(?:\\.[\\w.-]+)+[/#?]?.*$", Pattern.CASE_INSENSITIVE
    );

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
        //Сохранение людей из документа
        if (confessionalDocument.getPeople() != null) {
            confessionalDocument.getPeople().forEach(personFromDocument -> {

                if (personFromDocument.getBirthDate() != null)
                    fuzzyDateRepository.save(personFromDocument.getBirthDate());
                if (personFromDocument.getDeathDate() != null)
                    fuzzyDateRepository.save(personFromDocument.getDeathDate());
                personFromDocument.setDocument(confessionalDocument);

                personFromDocument.setId(null);
                personFromDocument.setDocument(confessionalDocument);

                //Сохранение изображения в директорию и замена поля на путь к файлу, если строка base64
                if (personFromDocument.getImage() != null && !personFromDocument.getImage().isEmpty()) {
                    if (personFromDocument.getImage().startsWith("data:image")) {
                        try {
                            String fileName = UUID.randomUUID() + ".png";
                            Path filePath = Paths.get(IMAGE_PATH, fileName);

                            byte[] bytes = Base64.getDecoder().decode(personFromDocument.getImage());

                            Files.createDirectories(filePath.getParent());
                            Files.write(filePath, bytes);

                            personFromDocument.setImage(null);
                            personFromDocument.setImage(filePath.toString());
                        } catch (Exception ex) {
                            throw new RuntimeException(ex);
                        }
                    }
                }

            });
        }

        confessionalDocumentRepository.save(confessionalDocument);
    }

}
