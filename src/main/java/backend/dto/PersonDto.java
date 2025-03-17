package backend.dto;

import backend.models.references.FuzzyDate;
import backend.models.references.Gender;
import backend.models.references.Place;
import backend.models.references.SocialStatus;
import lombok.Data;

import java.util.List;

@Data
public class PersonDto {

    private Long id;
    private String firstName;
    private String lastName;
    private String middleName;
    private Gender gender;
    private FuzzyDate birthDate;
    private FuzzyDate deathDate;
    private Place place;
    private SocialStatus socialStatus;
    private PersonLightDto spouse;
    private PersonLightDto father;
    private PersonLightDto mother;
    private List<PersonLightDto> children;

}
