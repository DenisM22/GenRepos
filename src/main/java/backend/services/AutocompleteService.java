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
    private final ParishRepository parishRepository;
    private final VolostRepository volostRepository;
    private final UyezdRepository uyezdRepository;

    public List<String> getFirstNamesStartingWith(String str) { //TODO добавить синонимы
        List<FirstName> list = firstNameRepository.findAllByFirstNameStartingWithIgnoreCase(str);
        return list.stream().map(FirstName::getFirstName).toList();
    }

    public List<String> getLastNamesStartingWith(String str) {
        List<LastName> list = lastNameRepository.findAllByLastNameStartingWithIgnoreCase(str);
        return list.stream().map(LastName::getLastName).toList();
    }

    public List<String> getMiddleNamesStartingWith(String str) {
        List<MiddleName> list = middleNameRepository.findAllByMiddleNameStartingWithIgnoreCase(str);
        return list.stream().map(MiddleName::getMiddleName).toList();
    }

    public List<Uyezd> getAllUyezdy() {
        return uyezdRepository.findAll();
    }

    public List<Volost> getVolostsStartingWith(Long uyezdId, String str) {
        return volostRepository.findAllByUyezd_IdAndVolostStartingWithIgnoreCase(uyezdId, str);
    }

    public List<Place> getPlacesStartingWith(Long volostId, String str) {
        return placeRepository.findAllByVolost_IdAndPlaceStartingWithIgnoreCase(volostId, str);
    }

    public List<Parish> getParishesStartingWith(String str) {
        return parishRepository.findAllByParishStartingWithIgnoreCase(str);
    }

}
