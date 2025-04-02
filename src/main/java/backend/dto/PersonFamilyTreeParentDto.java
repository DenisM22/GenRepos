package backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PersonFamilyTreeParentDto extends PersonLightDto {

    private PersonFamilyTreeParentDto father;
    private PersonFamilyTreeParentDto mother;

}
