package backend.services;

import backend.dto.DocumentLightDto;
import backend.models.confessionalDocuments.ConfessionalDocument;
import backend.repositories.ConfessionalDocumentRepository;
import backend.repositories.FuzzyDateRepository;
import backend.repositories.LandownerRepository;
import backend.repositories.ParishRepository;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Transactional
public class ConfessionalDocumentService {

    private static final Pattern URL_PATTERN = Pattern.compile(
            "^(https?|ftp)://[\\w.-]+(?:\\.[\\w.-]+)+[/#?]?.*$", Pattern.CASE_INSENSITIVE
    );
    private final ConfessionalDocumentRepository confessionalDocumentRepository;
    private final FuzzyDateRepository fuzzyDateRepository;
    private final ModelMapper modelMapper;
    private final int SIZE = 1;
    private final String IMAGE_PATH = "C:\\Program Files\\PostgreSQL\\17\\data\\images\\ConfessionalDocuments";
    private final ParishRepository parishRepository;
    private final LandownerRepository landownerRepository;

    public List<DocumentLightDto> getAllDocuments(String str, Short from, Short to) {
        List<ConfessionalDocument> confessionalDocuments;
        if ((str == null || str.isBlank()) && from == null && to == null)
            confessionalDocuments = confessionalDocumentRepository.findAll(Sort.by("title"));
        else if ((str != null && !str.isBlank()) && from == null && to == null)
            confessionalDocuments = confessionalDocumentRepository.findAllByTitleContainingIgnoreCaseOrderByTitle(str);
        else {
            if (from == null)
                from = 0;
            if (to == null)
                to = 3000;
            confessionalDocuments = confessionalDocumentRepository.findAllByTitleContainingIgnoreCaseAndCreatedAtBetweenOrderByTitle
                    (str, from, to);
        }

        return confessionalDocuments.stream().map(document ->
                modelMapper.map(document, DocumentLightDto.class)).toList();
    }

    public ConfessionalDocument getDocumentById(Long id) {
        ConfessionalDocument document = confessionalDocumentRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Документ не найден"));
        Hibernate.initialize(document.getPeople());
        return document;
    }

    public void saveDocument(ConfessionalDocument confessionalDocument) {

        if (confessionalDocument.getParish() != null) {
            if (confessionalDocument.getParish().getId() == null)
                throw new RuntimeException("Приход " + confessionalDocument.getParish().getParish() + " не был найден");
            else
                parishRepository.findById(confessionalDocument.getParish().getId()).orElseThrow(() ->
                        new RuntimeException("Приход " + confessionalDocument.getParish().getParish() + " не был найден"));
        }

        if (confessionalDocument.getPeople() != null) {
            confessionalDocument.getPeople().forEach(record -> {

                if (record.getLandowner() != null) {
                    if (record.getLandowner().getId() == null)
                        throw new RuntimeException("Для одной из записей не был найден землевладелец " +
                                record.getLandowner().getLandowner());
                    else
                        landownerRepository.findById(record.getLandowner().getId()).orElseThrow(() ->
                                new RuntimeException("Для одной из записей не был найден землевладелец " +
                                        record.getLandowner().getLandowner()));
                }

                if (record.getBirthDate() != null)
                    fuzzyDateRepository.save(record.getBirthDate());
                if (record.getDeathDate() != null)
                    fuzzyDateRepository.save(record.getDeathDate());

                record.setDocument(confessionalDocument);
            });
        }

        confessionalDocumentRepository.save(confessionalDocument);
    }

}

//Сохранение изображения в директорию и замена поля на путь к файлу, если строка base64
//                if (record.getImage() != null && !record.getImage().isEmpty()) {
//                    if (record.getImage().startsWith("data:image")) {
//                        try {
//                            String fileName = UUID.randomUUID() + ".png";
//                            Path filePath = Paths.get(IMAGE_PATH, fileName);
//
//                            byte[] bytes = Base64.getDecoder().decode(record.getImage());
//
//                            Files.createDirectories(filePath.getParent());
//                            Files.write(filePath, bytes);
//
//                            record.setImage(null);
//                            record.setImage(filePath.toString());
//                        } catch (Exception ex) {
//                            throw new RuntimeException(ex);
//                        }
//                    }
//                }
