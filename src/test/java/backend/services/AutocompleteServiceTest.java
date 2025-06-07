package backend.services;

import backend.models.references.*;
import backend.repositories.*;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.List;

@ExtendWith(MockitoExtension.class)
class AutocompleteServiceTest {

    @InjectMocks
    private AutocompleteService autocompleteService;

    @Mock
    private FirstNameRepository firstNameRepository;
    @Mock
    private LastNameRepository lastNameRepository;
    @Mock
    private MiddleNameRepository middleNameRepository;
    @Mock
    private UyezdRepository uyezdRepository;
    @Mock
    private VolostRepository volostRepository;
    @Mock
    private PlaceRepository placeRepository;
    @Mock
    private ParishRepository parishRepository;
    @Mock
    private FamilyStatusRepository familyStatusRepository;
    @Mock
    private SocialStatusRepository socialStatusRepository;
    @Mock
    private LandownerRepository landownerRepository;

    @Test
    void allListReturningMethodsShouldWork() throws Exception {
        String testString = "Тест";
        Long testId = 1L;

        Mockito.when(firstNameRepository.findAllByFirstNameStartingWithIgnoreCase(Mockito.anyString()))
                .thenReturn(List.of(new FirstName("Имя1")));
        Mockito.when(lastNameRepository.findAllByLastNameStartingWithIgnoreCase(Mockito.anyString()))
                .thenReturn(List.of(new LastName("Фамилия1")));
        Mockito.when(middleNameRepository.findAllByMiddleNameStartingWithIgnoreCase(Mockito.anyString()))
                .thenReturn(List.of(new MiddleName("Отчество1")));
        Mockito.when(uyezdRepository.findAll())
                .thenReturn(List.of(new Uyezd()));
        Mockito.when(volostRepository.findAllByUyezd_Id(Mockito.anyLong()))
                .thenReturn(List.of(new Volost()));
        Mockito.when(placeRepository.findAllByVolost_Id(Mockito.anyLong()))
                .thenReturn(List.of(new Place()));
        Mockito.when(parishRepository.findAllByParishContainingIgnoreCase(Mockito.anyString()))
                .thenReturn(List.of(new Parish()));
        Mockito.when(familyStatusRepository.findAll())
                .thenReturn(List.of(new FamilyStatus()));
        Mockito.when(socialStatusRepository.findAll())
                .thenReturn(List.of(new SocialStatus()));
        Mockito.when(landownerRepository.findByLandownerContainingIgnoreCase(Mockito.anyString()))
                .thenReturn(List.of(new Landowner()));

        for (Method method : AutocompleteService.class.getDeclaredMethods()) {
            if (Modifier.isPublic(method.getModifiers()) && method.getReturnType().equals(List.class)) {
                Object result;

                if (method.getParameterCount() == 0) {
                    result = method.invoke(autocompleteService);
                } else if (method.getParameterTypes()[0] == String.class) {
                    result = method.invoke(autocompleteService, testString);
                } else if (method.getParameterTypes()[0] == Long.class) {
                    result = method.invoke(autocompleteService, testId);
                } else {
                    continue; // не поддерживаем тип
                }

                Assertions.assertNotNull(result, "Метод " + method.getName() + " вернул null");
                Assertions.assertInstanceOf(List.class, result, "Метод " + method.getName() + " должен возвращать List");
            }
        }
    }
}
