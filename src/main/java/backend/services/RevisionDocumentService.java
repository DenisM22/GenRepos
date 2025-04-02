package backend.services;

import backend.dto.DocumentLightDto;
import backend.models.revisionDocuments.RevisionDocument;
import backend.repositories.LandownerRepository;
import backend.repositories.PlaceRepository;
import backend.repositories.RevisionDocumentRepository;
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
public class RevisionDocumentService {

    private final RevisionDocumentRepository revisionDocumentRepository;
    private final ModelMapper modelMapper;
    private final int SIZE = 1;
    private final String IMAGE_PATH = "C:\\Program Files\\PostgreSQL\\17\\data\\images\\RevisionDocuments";
    private final PlaceRepository placeRepository;
    private final LandownerRepository landownerRepository;

    public List<DocumentLightDto> getAllDocuments(String str, Short from, Short to) {
        List<RevisionDocument> revisionDocuments;
        if ((str == null || str.isBlank()) && from == null && to == null)
            revisionDocuments = revisionDocumentRepository.findAll(Sort.by("title"));
        else if ((str != null && !str.isBlank()) && from == null && to == null)
            revisionDocuments = revisionDocumentRepository.findAllByTitleContainingIgnoreCaseOrderByTitle(str);
        else {
            if (from == null)
                from = 0;
            if (to == null)
                to = 3000;
            revisionDocuments = revisionDocumentRepository.findAllByTitleContainingIgnoreCaseAndCreatedAtBetweenOrderByTitle
                    (str, from, to);
        }

        return revisionDocuments.stream().map(document ->
                modelMapper.map(document, DocumentLightDto.class)).toList();
    }

    public RevisionDocument getDocumentById(Long id) {
        RevisionDocument document = revisionDocumentRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Документ не найден"));
        Hibernate.initialize(document.getPeople());
        return document;
    }

    public void saveDocument(RevisionDocument revisionDocument) {

        if (revisionDocument.getPlace() != null) {
            if (revisionDocument.getPlace().getId() == null)
                throw new RuntimeException("Место " + revisionDocument.getPlace().getPlace() + " не было найден");
            else
                placeRepository.findById(revisionDocument.getPlace().getId()).orElseThrow(() ->
                        new RuntimeException("Место " + revisionDocument.getPlace().getPlace() + " не было найден"));
        }

        if (revisionDocument.getPeople() != null) {
            revisionDocument.getPeople().forEach(record -> {

                if (record.getLandowner() != null) {
                    if (record.getLandowner().getId() == null)
                        throw new RuntimeException("Для одной из записей не был найден землевладелец " +
                                record.getLandowner().getLandowner());
                    else
                        landownerRepository.findById(record.getLandowner().getId()).orElseThrow(() ->
                                new RuntimeException("Для одной из записей не был найден землевладелец " +
                                        record.getLandowner().getLandowner()));
                }

                record.setDocument(revisionDocument);
            });
        }

        revisionDocumentRepository.save(revisionDocument);
    }

}
