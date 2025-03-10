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
    private final SocialStatusRepository socialStatusRepository;
    private final FamilyStatusRepository familyStatusRepository;
    private final LandownerRepository landownerRepository;

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

    public List<Uyezd> getUyezdy() {
        return uyezdRepository.findAll();
    }

    public List<Volost> getVolosts(Long uyezdId) {
        return volostRepository.findAllByUyezd_Id(uyezdId);
    }

    public List<Place> getPlaces(Long volostId) {
        return placeRepository.findAllByVolost_Id(volostId);
    }

    public List<Parish> getParishesContaining(String str) {
        return parishRepository.findAllByParishContainingIgnoreCase(str);
    }

    public List<FamilyStatus> getFamilyStatuses() {
        return familyStatusRepository.findAll();
    }

    public List<SocialStatus> getSocialStatuses() {
        return socialStatusRepository.findAll();
    }

    public List<Landowner> getLandowners(String str) {
        return landownerRepository.findByLandownerContainingIgnoreCase(str);
    }

}
