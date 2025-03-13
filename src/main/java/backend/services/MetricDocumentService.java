package backend.services;

import backend.dto.DocumentLightDto;
import backend.models.metricDocuments.MetricDocument;
import backend.repositories.FuzzyDateRepository;
import backend.repositories.MetricDocumentRepository;
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
public class MetricDocumentService {

    private final MetricDocumentRepository metricDocumentRepository;
    private final ModelMapper modelMapper;
    private final int SIZE = 1;
    private final String IMAGE_PATH = "C:\\Program Files\\PostgreSQL\\17\\data\\images\\MetricDocuments";
    private final FuzzyDateRepository fuzzyDateRepository;

    public List<DocumentLightDto> getDocumentsStartingWith(String str) {
        List<MetricDocument> metricDocuments;
        if (str == null || str.isEmpty())
            metricDocuments = metricDocumentRepository.findAll();
        else
            metricDocuments = metricDocumentRepository.findAllByTitleContainingIgnoreCase(str);
        return metricDocuments.stream().map(document ->
                modelMapper.map(document, DocumentLightDto.class)).toList();
    }

    public MetricDocument getDocumentById(Long id) {
        return metricDocumentRepository.findById(id).orElseThrow(() -> new RuntimeException("Документ не найден"));
    }

    public void saveDocument(MetricDocument metricDocument) {
        
        if (metricDocument.getBirthRecords() != null) {
            metricDocument.getBirthRecords().forEach(record -> {
                if (record.getBirthDate() != null)
                    fuzzyDateRepository.save(record.getBirthDate());
                record.setDocument(metricDocument);
            });
        }

        if (metricDocument.getMarriageRecords() != null) {
            metricDocument.getMarriageRecords().forEach(record -> {
                if (record.getMarriageDate() != null)
                    fuzzyDateRepository.save(record.getMarriageDate());
                record.setDocument(metricDocument);
            });
        }

        if (metricDocument.getDeathRecords() != null) {
            metricDocument.getDeathRecords().forEach(record -> {
                if (record.getDeathDate() != null)
                    fuzzyDateRepository.save(record.getDeathDate());
                record.setDocument(metricDocument);
            });
        }

        metricDocumentRepository.save(metricDocument);
    }

}
