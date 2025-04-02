package backend.services;

import backend.dto.DocumentLightDto;
import backend.models.metricDocuments.MetricDocument;
import backend.repositories.FuzzyDateRepository;
import backend.repositories.LandownerRepository;
import backend.repositories.MetricDocumentRepository;
import backend.repositories.ParishRepository;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MetricDocumentService {

    private final MetricDocumentRepository metricDocumentRepository;
    private final ModelMapper modelMapper;
    private final int SIZE = 1;
    private final String IMAGE_PATH = "C:\\Program Files\\PostgreSQL\\17\\data\\images\\MetricDocuments";
    private final FuzzyDateRepository fuzzyDateRepository;
    private final ParishRepository parishRepository;
    private final LandownerRepository landownerRepository;

    public List<DocumentLightDto> getAllDocuments(String str, Short from, Short to) {
        List<MetricDocument> metricDocuments;
        if ((str == null || str.isBlank()) && from == null && to == null)
            metricDocuments = metricDocumentRepository.findAll(Sort.by("title"));
        else if ((str != null && !str.isBlank()) && from == null && to == null)
            metricDocuments = metricDocumentRepository.findAllByTitleContainingIgnoreCaseOrderByTitle(str);
        else {
            if (from == null)
                from = 0;
            if (to == null)
                to = 3000;
            metricDocuments = metricDocumentRepository.findAllByTitleContainingIgnoreCaseAndCreatedAtBetweenOrderByTitle(str, from, to);
        }

        return metricDocuments.stream().map(document ->
                modelMapper.map(document, DocumentLightDto.class)).toList();
    }

    public MetricDocument getDocumentById(Long id) {
        MetricDocument document = metricDocumentRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Документ не найден"));
        Hibernate.initialize(document.getBirthRecords());
        Hibernate.initialize(document.getMarriageRecords());
        Hibernate.initialize(document.getDeathRecords());
        return document;
    }

    public void saveDocument(MetricDocument metricDocument) {

        if (metricDocument.getParish() != null) {
            if (metricDocument.getParish().getId() == null)
                throw new RuntimeException("Приход " + metricDocument.getParish().getParish() + " не был найден");
            else
                parishRepository.findById(metricDocument.getParish().getId()).orElseThrow(() ->
                        new RuntimeException("Приход " + metricDocument.getParish().getParish() + " не был найден"));
        }

        if (metricDocument.getBirthRecords() != null) {
            metricDocument.getBirthRecords().forEach(record -> {

                if (record.getLandowner() != null) {
                    if (record.getLandowner().getId() == null)
                        throw new RuntimeException("Для одной из записей рождения не был найден землевладелец " +
                                record.getLandowner().getLandowner());
                    else
                        landownerRepository.findById(record.getLandowner().getId()).orElseThrow(() ->
                                new RuntimeException("Для одной из записей рождения не был найден землевладелец " +
                                        record.getLandowner().getLandowner()));
                }

                if (record.getBirthDate() != null)
                    fuzzyDateRepository.save(record.getBirthDate());

                record.setDocument(metricDocument);
            });
        }

        if (metricDocument.getMarriageRecords() != null) {
            metricDocument.getMarriageRecords().forEach(record -> {

                if (record.getGroomLandowner() != null) {
                    if (record.getGroomLandowner().getId() == null)
                        throw new RuntimeException("Для одной из записей брака не был найден землевладелец жениха " +
                                record.getGroomLandowner().getLandowner());
                    else
                        landownerRepository.findById(record.getGroomLandowner().getId()).orElseThrow(() ->
                                new RuntimeException("Для одной из записей брака не был найден землевладелец жениха" +
                                        record.getGroomLandowner().getLandowner()));
                }

                if (record.getBrideLandowner() != null) {
                    if (record.getBrideLandowner().getId() == null)
                        throw new RuntimeException("Для одной из записей брака не был найден землевладелец невесты " +
                                record.getBrideLandowner().getLandowner());
                    else
                        landownerRepository.findById(record.getBrideLandowner().getId()).orElseThrow(() ->
                                new RuntimeException("Для одной из записей брака не был найден землевладелец невесты " +
                                        record.getBrideLandowner().getLandowner()));
                }

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
