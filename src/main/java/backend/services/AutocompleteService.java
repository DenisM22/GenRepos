package backend.services;

import backend.models.references.*;
import backend.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AutocompleteService {

    private final FirstNameRepository firstNameRepository;
    private final AliasRepository aliasRepository;
    private final LastNameRepository lastNameRepository;
    private final MiddleNameRepository middleNameRepository;
    private final PlaceRepository placeRepository;

    public List<FirstName> getFirstNamesWith(String str) { //TODO добавить синонимы
        List<FirstName> list = firstNameRepository.findAllByFirstNameStartingWithIgnoreCase(str);
        return list;
    }

    public List<String> getLastNamesWith(String str) {
        List<LastName> list = lastNameRepository.findAllByLastNameStartingWithIgnoreCase(str);
        return list.stream().map(LastName::getLastName).toList();
    }

    public List<String> getMiddleNamesWith(String str) {
        List<MiddleName> list = middleNameRepository.findAllByMiddleNameStartingWithIgnoreCase(str);
        return list.stream().map(MiddleName::getMiddleName).toList();
    }

    public List<String> getPlacesWith(String str) {
        List<Place> list = placeRepository.findAllByPlaceStartingWithIgnoreCase(str);
        return list.stream().map(Place::getPlace).toList();
    }


}
