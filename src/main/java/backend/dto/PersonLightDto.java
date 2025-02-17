package backend.dto;

import backend.models.references.FuzzyDate;
import lombok.Data;

@Data
public class PersonLightDto {

    private Long id;
    private String firstName;
    private String lastName;
    private String middleName;
    private FuzzyDate birthDate;
    private FuzzyDate deathDate;

}
