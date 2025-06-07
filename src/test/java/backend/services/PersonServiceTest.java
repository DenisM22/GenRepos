package backend.services;

import backend.dto.PersonDto;
import backend.dto.PersonFamilyTreeDto;
import backend.dto.PersonLightDto;
import backend.filters.PersonFilterStrategy;
import backend.models.Person;
import backend.models.references.Gender;
import backend.repositories.PersonRepository;
import backend.repositories.UserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class PersonServiceTest {

    @Mock
    private PersonRepository personRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserService userService;

    @Mock
    private ModelMapper modelMapper;

    @Mock
    private PersonFilterStrategy strategy1;

    @Mock
    private PersonFilterStrategy strategy2;

    @InjectMocks
    private PersonService personService;

    @Test
    void getAllPeople_shouldReturnList_withMatchingStrategy() {
        String str = "Name";
        Gender gender = Gender.MALE;
        Long uyezdId = 1L;
        Short from = 1800;
        Short to = 1850;

        Person person = new Person();
        PersonLightDto personLightDto = new PersonLightDto();

        List<PersonFilterStrategy> strategies = List.of(strategy1, strategy2);
        PersonService personService = new PersonService(personRepository, modelMapper, userRepository, userService, strategies);

        Mockito.when(strategy1.isApplicable(str, gender, uyezdId, from, to)).thenReturn(false);
        Mockito.when(strategy2.isApplicable(str, gender, uyezdId, from, to)).thenReturn(true);
        Mockito.when(strategy2.filter(str, gender, uyezdId, from, to)).thenReturn(List.of(person));

        Mockito.when(modelMapper.map(person, PersonLightDto.class)).thenReturn(personLightDto);

        List<PersonLightDto> result = personService.getAllPeople(str, gender, uyezdId, from, to);

        Assertions.assertEquals(1, result.size());
        Assertions.assertEquals(personLightDto, result.getFirst());
    }

    @Test
    void getAllPeople_shouldThrowException_withNoMatchingStrategy() {
        String str = "Name";
        Gender gender = Gender.MALE;
        Long uyezdId = 1L;
        Short from = 1800;
        Short to = 1850;

        List<PersonFilterStrategy> strategies = List.of(strategy1, strategy2);
        PersonService personService = new PersonService(personRepository, modelMapper, userRepository, userService, strategies);

        Mockito.when(strategy1.isApplicable(str, gender, uyezdId, from, to)).thenReturn(false);
        Mockito.when(strategy2.isApplicable(str, gender, uyezdId, from, to)).thenReturn(false);

        IllegalStateException exception = Assertions.assertThrows(
                IllegalStateException.class,
                () -> personService.getAllPeople(str, gender, uyezdId, from, to)
        );

        Assertions.assertEquals("Подходящая стратегия поиска людей не найдена", exception.getMessage());
    }

    @Test
    void getPersonById_shouldReturnPerson() {
        Long id = 1L;
        Person person = new Person(id);
        PersonDto expectedDto = new PersonDto();
        expectedDto.setId(id);

        Mockito.when(personRepository.findById(id)).thenReturn(Optional.of(person));
        Mockito.when(modelMapper.map(person, PersonDto.class)).thenReturn(expectedDto);

        PersonDto actualDto = personService.getPersonById(id);
        Assertions.assertEquals(expectedDto, actualDto);
    }

    @Test
    void getPersonById_shouldThrowException_whenPersonNotFound() {
        Long id = 1L;

        Mockito.when(personRepository.findById(id)).thenReturn(Optional.empty());

        RuntimeException exception = Assertions.assertThrows(
                RuntimeException.class,
                () -> personService.getPersonById(id)
        );

        Assertions.assertEquals("Человек не найден", exception.getMessage());
    }

    @Test
    void savePerson_shouldSavePerson_whenNotMe() {
        Person person = new Person(1L);
        PersonDto personDto = new PersonDto();
        Boolean me = false;

        Mockito.when(modelMapper.map(personDto, Person.class)).thenReturn(person);

        personService.savePerson(personDto, me);
        Mockito.verify(personRepository, Mockito.times(1)).save(person);
    }

    @Test
    void savePerson_shouldSavePerson_whenMe() {
        Person person = new Person(1L, 1L);
        PersonDto personDto = new PersonDto();
        Boolean me = true;

        Mockito.when(modelMapper.map(personDto, Person.class)).thenReturn(person);
        Mockito.when(personRepository.save(person)).thenReturn(person);
        personService.savePerson(personDto, me);

        Mockito.verify(personRepository, Mockito.times(1)).save(person);
        Mockito.verify(userRepository, Mockito.times(1)).updatePersonId(person.getUserId(), person.getId());
        Mockito.verify(userService, Mockito.times(1)).refreshAuthentication(person);
    }

    @Test
    void deletePerson_shouldDeletePerson() {
        Long id = 1L;

        Mockito.when(personRepository.existsById(id)).thenReturn(true);

        personService.deletePerson(id);

        Mockito.verify(personRepository).deleteById(id);
    }

    @Test
    void deletePerson_shouldThrowException_whenPersonNotFound() {
        Long id = 1L;

        Mockito.when(personRepository.existsById(id)).thenReturn(false);

        RuntimeException exception = Assertions.assertThrows(
                RuntimeException.class,
                () -> personService.deletePerson(id)
        );

        Assertions.assertEquals("Человек не найден", exception.getMessage());
    }

    @Test
    void getFamilyTree_shouldReturnFamilyTree() {
        Long id = 1L;
        Person person = new Person(id);
        PersonFamilyTreeDto expectedDto = new PersonFamilyTreeDto();

        Mockito.when(personRepository.findById(id)).thenReturn(Optional.of(person));
        Mockito.when(modelMapper.map(person, PersonFamilyTreeDto.class)).thenReturn(expectedDto);
        PersonFamilyTreeDto actualDto = personService.getFamilyTree(id);

        Assertions.assertEquals(expectedDto, actualDto);
    }

    @Test
    void getFamilyTree_shouldThrowException_whenPersonNotFound() {
        Long id = 1L;

        Mockito.when(personRepository.findById(id)).thenReturn(Optional.empty());

        RuntimeException exception = Assertions.assertThrows(
                RuntimeException.class,
                () -> personService.getFamilyTree(id)
        );

        Assertions.assertEquals("Человек не найден", exception.getMessage());
    }

}
