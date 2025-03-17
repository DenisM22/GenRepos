package backend.dto;

import backend.models.references.FuzzyDate;
import backend.models.references.Gender;
import backend.models.references.Place;
import lombok.Data;

@Data
public class PersonLightDto {

    private Long id;
    private String firstName;
    private String lastName;
    private String middleName;
    private Gender gender;
    private FuzzyDate birthDate;
    private FuzzyDate deathDate;
    private Place place;

}
